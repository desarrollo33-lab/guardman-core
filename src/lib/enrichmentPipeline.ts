import { Payload } from 'payload'
import { fetchSerperData } from './serper'
import { generateContentGLM } from './glm'

interface GLMPrompt {
  id: number | string
  identifier: string
  systemPrompt?: string
  userPromptTemplate?: string
}

async function getPrompt(payload: Payload, identifier: string): Promise<GLMPrompt | null> {
  const result = await payload.find({
    collection: 'prompts',
    where: { identifier: { equals: identifier } },
    limit: 1,
  })
  return result.docs[0] || null
}

function replacePromptVars(template: string, vars: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

async function callGLM(
  payload: Payload,
  prompt: GLMPrompt,
  vars: Record<string, string>,
): Promise<any> {
  const systemPromptTxt = prompt.systemPrompt || 'Eres un experto en SEO B2B.'
  const userPromptTxt = replacePromptVars(prompt.userPromptTemplate || '', vars)

  const glmPayload = {
    contents: [{ role: 'user' as const, parts: [{ text: userPromptTxt }] }],
    systemInstruction: { role: 'user' as const, parts: [{ text: systemPromptTxt }] },
    generationConfig: { temperature: 0.3, responseMimeType: 'application/json' as const },
  }

  const result = await generateContentGLM(payload, glmPayload)
  try {
    return JSON.parse(result)
  } catch {
    throw new Error(`GLM returned invalid JSON for prompt ${prompt.identifier}`)
  }
}

export async function runEnrichmentPipeline(
  payload: Payload,
  collectionSlug: string,
  docId: string | number,
) {
  if (collectionSlug !== 'locations') {
    throw new Error(`Pipeline not implemented for collection: ${collectionSlug}`)
  }

  const locationDoc = await payload.findByID({
    collection: 'locations',
    id: docId,
    depth: 0,
  })

  payload.logger.info(`[Pipeline] Starting 3-step pipeline for: ${locationDoc.name}`)

  const historyRecords: any[] = []

  // Step 1: SERPER FETCH
  const serperQuery = `seguridad privada empresas o condominios en ${locationDoc.name} Chile`
  payload.logger.info(`[Pipeline:Step1] Fetching Serper data...`)
  const serperData = await fetchSerperData(payload, { q: serperQuery })

  // Step 2: ANALYZE LOCATION (Strategic Analysis)
  payload.logger.info(`[Pipeline:Step2] Running analyze_location...`)
  const analyzePrompt = await getPrompt(payload, 'analyze_location')

  let locationAnalysis: any = null
  if (analyzePrompt) {
    try {
      locationAnalysis = await callGLM(payload, analyzePrompt, {
        location: locationDoc.name as string,
        serperData: JSON.stringify(serperData?.organic?.slice(0, 5) || []),
      })

      historyRecords.push({
        promptIdentifier: 'analyze_location',
        response: locationAnalysis,
      })

      // Auto-update location with economicDriver if returned
      if (locationAnalysis?.economicDriver) {
        await payload.update({
          collection: 'locations',
          id: docId,
          data: { economicDriver: locationAnalysis.economicDriver },
          overrideAccess: true,
        })
        payload.logger.info(
          `[Pipeline] Updated economicDriver to: ${locationAnalysis.economicDriver}`,
        )
      }
    } catch (err) {
      payload.logger.error(`[Pipeline:Step2] Failed: ${err}`)
    }
  }

  // Step 3: OUTLINE CLUSTER (Structure Generation)
  payload.logger.info(`[Pipeline:Step3] Running outline_cluster...`)
  const outlinePrompt = await getPrompt(payload, 'outline_cluster')

  let clusterStructure: any = null
  if (outlinePrompt) {
    try {
      clusterStructure = await callGLM(payload, outlinePrompt, {
        location: locationDoc.name as string,
        economicDriver:
          locationAnalysis?.economicDriver || (locationDoc.economicDriver as string) || 'General',
        serperData: JSON.stringify(serperData?.organic?.slice(0, 3) || []),
      })

      historyRecords.push({
        promptIdentifier: 'outline_cluster',
        response: clusterStructure,
      })
    } catch (err) {
      payload.logger.error(`[Pipeline:Step3] Failed: ${err}`)
    }
  }

  // Step 4: BUILD SEOPAGES (Drafts)
  if (clusterStructure?.pages && Array.isArray(clusterStructure.pages)) {
    let hubId: string | number | null = null

    // Create HUB
    const hubPage = clusterStructure.pages.find((p: any) => p.pageType === 'hub')
    if (hubPage) {
      const createdHub = await payload.create({
        collection: 'seo-pages',
        data: {
          title: hubPage.title,
          slug: hubPage.slug,
          pageType: 'location',
          clusterRole: 'hub',
          location: docId as any,
          status: 'draft',
          glmGenerationStatus: 'review_needed',
        },
        overrideAccess: true,
      })
      hubId = createdHub.id
      payload.logger.info(`[Pipeline:Step4] Created Hub: ${hubPage.title}`)

      // Step 5: GENERATE CONTENT for Hub (Hero + FAQ)
      await generatePageContent(payload, createdHub.id, locationDoc, serperData, locationAnalysis)
    }

    // Create Spokes
    const spokes = clusterStructure.pages.filter((p: any) => p.pageType === 'spoke')
    for (const spoke of spokes) {
      const createdSpoke = await payload.create({
        collection: 'seo-pages',
        data: {
          title: spoke.title,
          slug: spoke.slug,
          pageType: 'problem-location',
          clusterRole: 'spoke',
          location: docId as any,
          parentHub: hubId as any,
          status: 'draft',
          glmGenerationStatus: 'review_needed',
        },
        overrideAccess: true,
      })
      payload.logger.info(`[Pipeline:Step4] Created Spoke: ${spoke.title}`)

      // Step 5: GENERATE CONTENT for each Spoke
      await generatePageContent(payload, createdSpoke.id, locationDoc, serperData, locationAnalysis)
    }
  }

  // Save EnrichmentHistory
  await payload.create({
    collection: 'enrichment-history',
    data: {
      sourceCollection: collectionSlug,
      sourceId: String(docId),
      serperRawData: serperData as any,
      glmResponse: { steps: historyRecords, finalStructure: clusterStructure },
      tokensUsed: 0,
      wasSuccessful: true,
    },
    overrideAccess: true,
  })

  payload.logger.info(`[Pipeline] Completed for: ${locationDoc.name}`)
  return clusterStructure
}

async function generatePageContent(
  payload: Payload,
  pageId: string | number,
  locationDoc: any,
  serperData: any,
  locationAnalysis: any,
) {
  const securityProblems = locationAnalysis?.securityProblems || []

  // Generate Hero Section
  const heroPrompt = await getPrompt(payload, 'write_hero_section')
  if (heroPrompt) {
    try {
      const heroContent = await callGLM(payload, heroPrompt, {
        location: locationDoc.name as string,
        persona: 'Dueño de empresa o Administrador de Propiedad',
        problem: securityProblems[0] || 'Seguridad',
        economicDriver:
          locationAnalysis?.economicDriver || (locationDoc.economicDriver as string) || 'General',
      })

      await payload.update({
        collection: 'seo-pages',
        id: pageId,
        data: {
          hero: {
            headline: heroContent.headline || '',
            subheadline: heroContent.subheadline || '',
            ctaText: heroContent.ctaText || 'Contáctenos',
          },
        },
        overrideAccess: true,
      })
      payload.logger.info(`[Pipeline:Step5] Generated Hero for page ${pageId}`)
    } catch (err) {
      payload.logger.error(`[Pipeline:Step5] Hero generation failed: ${err}`)
    }
  }

  // Generate FAQs
  const faqPrompt = await getPrompt(payload, 'write_faq')
  if (faqPrompt) {
    try {
      const faqContent = await callGLM(payload, faqPrompt, {
        location: locationDoc.name as string,
        problems: securityProblems.join(', '),
        peopleAlsoAsk: JSON.stringify(serperData?.peopleAlsoAsk?.slice(0, 5) || []),
      })

      const faqArray = Array.isArray(faqContent) ? faqContent : []

      await payload.update({
        collection: 'seo-pages',
        id: pageId,
        data: {
          faq: faqArray.map((f: any) => ({
            question: f.question,
            answer: f.answer,
          })),
        },
        overrideAccess: true,
      })
      payload.logger.info(`[Pipeline:Step5] Generated ${faqArray.length} FAQs for page ${pageId}`)
    } catch (err) {
      payload.logger.error(`[Pipeline:Step5] FAQ generation failed: ${err}`)
    }
  }

  // Mark as ready for review
  await payload.update({
    collection: 'seo-pages',
    id: pageId,
    data: { glmGenerationStatus: 'review_needed' },
    overrideAccess: true,
  })
}
