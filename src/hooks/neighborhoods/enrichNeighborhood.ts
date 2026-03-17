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

export const enrichNeighborhoodAfterChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return

  initServices()

  const neighborhoodId = doc.id
  const neighborhoodName = doc.name

  if (!neighborhoodName) return

  let locationName = ''
  if (doc.location) {
    try {
      const location = await req.payload.findByID({
        collection: 'locations',
        id: typeof doc.location === 'object' ? doc.location.id : doc.location,
      })
      locationName = location?.name || ''
    } catch (e) {
      console.log('[Neighborhood Enrichment] Could not fetch location:', e)
    }
  }

  console.log(
    `[Neighborhood Enrichment] Processing: ${neighborhoodName}${locationName ? ` in ${locationName}` : ''}`,
  )

  try {
    const updateData: Record<string, any> = {}
    const searchQuery = locationName
      ? `${neighborhoodName} ${locationName} Santiago Chile`
      : `${neighborhoodName} Santiago Chile`

    if (serperService) {
      try {
        const [searchResult, placesResult] = await Promise.all([
          serperService.search(searchQuery),
          serperService.places(searchQuery),
        ])

        if (searchResult.organic?.length > 0 && !updateData.description) {
          const firstResult = searchResult.organic[0]
          updateData.description = firstResult.snippet?.substring(0, 500) || ''
        }

        if (placesResult.places?.length > 0) {
          const place = placesResult.places[0]
          if (place.latitude && place.longitude) {
            updateData.coordinates = {
              lat: place.latitude,
              lng: place.longitude,
            }
          }
        }

        console.log(`[Neighborhood Enrichment] Serper done for ${neighborhoodName}`)
      } catch (e) {
        console.error('[Neighborhood Enrichment] Serper error:', e)
      }
    }

    if (glmService) {
      try {
        const prompt = locationName
          ? `Barrio ${neighborhoodName} en ${locationName}, Santiago Chile`
          : `Barrio ${neighborhoodName} en Santiago Chile`

        const systemPrompt = `Eres experto en SEO local para Chile.
Genera información para el barrio "${prompt}".
Responde EXACTAMENTE en JSON:
{
  "characteristics": string (tipo de barrio: residencial, comercial, etc, max 200 chars),
  "mainKeywords": string[] (5 keywords principales para SEO del barrio)
}`

        const result = await glmService.chatWithSystem(systemPrompt, prompt)
        const jsonStr = result.replace(/```json|```/g, '').trim()
        const analysis = JSON.parse(jsonStr)

        if (analysis) {
          if (analysis.characteristics && !updateData.characteristics) {
            updateData.characteristics = analysis.characteristics
          }
          if (analysis.mainKeywords) {
            updateData.mainKeywords = analysis.mainKeywords.map((k: string) => ({ keyword: k }))
          }
        }

        console.log(`[Neighborhood Enrichment] GLM done for ${neighborhoodName}`)
      } catch (e) {
        console.error('[Neighborhood Enrichment] GLM error:', e)
      }
    }

    if (Object.keys(updateData).length > 0) {
      await req.payload.update({
        collection: 'neighborhoods',
        id: neighborhoodId,
        data: updateData,
        req,
      })
      console.log(`[Neighborhood Enrichment] ${neighborhoodName} enriched`)
    }
  } catch (error) {
    console.error('[Neighborhood Enrichment] Error:', error)
  }
}

export default enrichNeighborhoodAfterChange
