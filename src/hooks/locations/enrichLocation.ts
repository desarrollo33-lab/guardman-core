import type { CollectionAfterChangeHook } from 'payload'
import { GLMService } from '../../services/GLMService'
import { SerperService } from '../../services/SerperService'

const SERPER_API_KEY = process.env.SERPER_API_KEY
const GLM_API_KEY = process.env.GLM_API_KEY

let serperService: SerperService | null = null
let glmService: GLMService | null = null

function initServices() {
  if (SERPER_API_KEY && !serperService) {
    serperService = new SerperService(SERPER_API_KEY)
  }
  if (GLM_API_KEY && !glmService) {
    glmService = new GLMService(GLM_API_KEY, 'glm-5')
  }
}

export const enrichLocationAfterChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return

  initServices()

  const locationId = doc.id
  const locationName = doc.name
  const currentSlug = doc.slug

  if (!locationName) return

  console.log(`[Location Enrichment] Processing: ${locationName}`)

  try {
    const updateData: Record<string, any> = {}
    const searchQuery = `${locationName} Santiago Chile`

    if (serperService) {
      try {
        const [searchResult, placesResult] = await Promise.all([
          serperService.search(searchQuery),
          serperService.places(searchQuery),
        ])

        if (searchResult.organic?.length > 0) {
          const firstResult = searchResult.organic[0]
          if (!updateData.characteristics) {
            updateData.characteristics = firstResult.snippet?.substring(0, 500) || ''
          }
        }

        if (placesResult.places?.length > 0) {
          const place = placesResult.places[0]
          if (place.latitude && place.longitude) {
            updateData.coordinates = {
              lat: place.latitude,
              lng: place.longitude,
            }
          }
          if (place.rating) {
            updateData.rating = place.rating
          }
        }

        console.log(`[Location Enrichment] Serper done for ${locationName}`)
      } catch (e) {
        console.error('[Location Enrichment] Serper error:', e)
      }
    }

    if (glmService) {
      try {
        const systemPrompt = `Eres experto en SEO local para Chile.
Genera información para la comuna "${locationName}" en Santiago.
Responde EXACTAMENTE en JSON:
{
  "population": number (población aproximada),
  "characteristics": string (breve descripción para SEO, max 200 chars),
  "mainKeywords": string[] (5 keywords principales),
  "metaTitle": string (título SEO, max 60 chars),
  "metaDescription": string (descripción SEO, max 160 chars)
}`

        const result = await glmService.chatWithSystem(systemPrompt, locationName)
        const jsonStr = result.replace(/```json|```/g, '').trim()
        const analysis = JSON.parse(jsonStr)

        if (analysis) {
          if (analysis.population && !updateData.population) {
            updateData.population = analysis.population
          }
          if (analysis.characteristics && !updateData.characteristics) {
            updateData.characteristics = analysis.characteristics
          }
          if (analysis.mainKeywords) {
            updateData.mainKeywords = analysis.mainKeywords.map((k: string) => ({ keyword: k }))
          }
          if (analysis.metaTitle || analysis.metaDescription) {
            updateData.seo = {
              metaTitle: analysis.metaTitle || '',
              metaDescription: analysis.metaDescription || '',
            }
          }
        }

        console.log(`[Location Enrichment] GLM done for ${locationName}`)
      } catch (e) {
        console.error('[Location Enrichment] GLM error:', e)
      }
    }

    if (Object.keys(updateData).length > 0) {
      await req.payload.update({
        collection: 'locations',
        id: locationId,
        data: updateData,
        req,
      })
      console.log(`[Location Enrichment] ${locationName} enriched`)
    }
  } catch (error) {
    console.error('[Location Enrichment] Error:', error)
  }
}

export default enrichLocationAfterChange
