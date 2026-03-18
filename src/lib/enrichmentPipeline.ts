import { Payload } from 'payload'
import { fetchSerperData } from './serper'
import { GLMService } from '../services/GLMService'

const SERPER_API_KEY = process.env.SERPER_API_KEY
const GLM_API_KEY = process.env.GLM_API_KEY

export async function runEnrichmentPipeline(
  payload: Payload,
  collectionSlug: string,
  docId: string | number,
) {
  if (collectionSlug !== 'locations') {
    throw new Error(`Pipeline not implemented for collection: ${collectionSlug}`)
  }

  payload.logger.info(`[Pipeline] Starting for location ID: ${docId}`)

  const locationDoc = await payload.findByID({
    collection: 'locations',
    id: docId,
    depth: 0,
  })

  payload.logger.info(`[Pipeline] Found: ${locationDoc.name}`)

  let characteristics = ''
  let serperData: any = null

  // Step 1: Fetch Serper data (graceful if API key missing)
  try {
    const serperQuery = `seguridad privada empresas o condominios en ${locationDoc.name} Chile`
    serperData = await fetchSerperData(payload, { q: serperQuery })

    payload.logger.info(`[Pipeline] Serper results: ${serperData?.organic?.length || 0}`)

    // Extract characteristics from search snippets
    characteristics =
      serperData.organic
        ?.slice(0, 3)
        .map((r: any) => r.snippet)
        .join(' || ') || ''

    // Cache the raw Serper result
    try {
      await payload.create({
        collection: 'api-cache',
        data: {
          source: 'serper',
          query: serperQuery,
          response: serperData,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        } as any,
        overrideAccess: true,
      })
    } catch (cacheErr) {
      payload.logger.warn(`[Pipeline] Failed to cache Serper result: ${cacheErr}`)
    }
  } catch (serperErr) {
    payload.logger.warn(
      `[Pipeline] Serper unavailable (${serperErr instanceof Error ? serperErr.message : serperErr}), skipping`,
    )
  }

  // Step 2: Generate SEO content with GLM
  let glmContent: any = null
  if (GLM_API_KEY && locationDoc.name) {
    try {
      const glmService = new GLMService(GLM_API_KEY, 'glm-5')
      glmContent = await glmService.generateSEOContent({
        location: locationDoc.name,
        service: 'Guardias de Seguridad',
        problem: 'Seguridad para empresas y condominios',
      })

      payload.logger.info(
        `[Pipeline] GLM generated: ${glmContent?.metaTitle?.slice(0, 50) || 'N/A'}...`,
      )

      // Cache the GLM result
      try {
        await payload.create({
          collection: 'api-cache',
          data: {
            source: 'glm',
            query: `seo-content-${locationDoc.name}`,
            response: glmContent,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          } as any,
          overrideAccess: true,
        })
      } catch (cacheErr) {
        payload.logger.warn(`[Pipeline] Failed to cache GLM result: ${cacheErr}`)
      }
    } catch (glmErr) {
      payload.logger.warn(
        `[Pipeline] GLM unavailable (${glmErr instanceof Error ? glmErr.message : glmErr}), skipping`,
      )
    }
  } else if (!GLM_API_KEY) {
    payload.logger.warn('[Pipeline] GLM_API_KEY not configured, skipping AI content generation')
  }

  // Step 3: Update location with enrichment data
  const updateData: Record<string, any> = {}
  if (characteristics) {
    updateData.characteristics = characteristics
  }

  // Add GLM-generated SEO content
  if (glmContent) {
    if (glmContent.metaTitle) {
      updateData.seo = {
        ...updateData.seo,
        metaTitle: glmContent.metaTitle,
        metaDescription: glmContent.metaDescription,
      }
    }
  }

  if (Object.keys(updateData).length > 0) {
    await payload.update({
      collection: 'locations',
      id: docId,
      data: updateData,
      overrideAccess: true,
    })
  }

  // Step 4: Create SEO page (Hub)
  const slug = (locationDoc.name as string)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  try {
    // Check if page already exists
    const existing = await payload.find({
      collection: 'seo-pages',
      where: { slug: { equals: `seguridad-${slug}` } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'seo-pages',
        data: {
          title: glmContent?.h1 || `Seguridad en ${locationDoc.name}`,
          slug: `seguridad-${slug}`,
          pageType: 'location',
          location: Number(docId),
          status: 'draft',
          priorityScore: 50,
        } as any,
        overrideAccess: true,
      })
    }
  } catch (seoErr) {
    payload.logger.warn(`[Pipeline] SEO page creation failed: ${seoErr}`)
  }

  // Step 5: Save enrichment history
  try {
    await payload.create({
      collection: 'enrichment-history',
      data: {
        sourceCollection: 'locations',
        sourceId: String(docId),
        serperRawData: serperData as any,
        glmResponse: glmContent as any,
        wasSuccessful: true,
      },
      overrideAccess: true,
    })
  } catch (e) {
    payload.logger.error(`[Pipeline] Failed to save history: ${e}`)
  }

  payload.logger.info(`[Pipeline] Completed for: ${locationDoc.name}`)
  return {
    success: true,
    serperResults: serperData?.organic?.length || 0,
    glmGenerated: !!glmContent,
  }
}
