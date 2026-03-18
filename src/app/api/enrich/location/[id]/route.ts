import { NextRequest, NextResponse } from 'next/server'
import { GLMService } from '@/services/GLMService'
import { SerperService } from '@/services/SerperService'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const SERPER_API_KEY = process.env.SERPER_API_KEY
    const GLM_API_KEY = process.env.GLM_API_KEY

    if (!SERPER_API_KEY || !GLM_API_KEY) {
      return NextResponse.json({ error: 'API keys not configured' }, { status: 503 })
    }

    const payload = await getPayload({ config: configPromise })

    const serperService = new SerperService(SERPER_API_KEY)
    const glmService = new GLMService(GLM_API_KEY, 'glm-5')

    const location = await payload.findByID({
      collection: 'locations',
      id,
      depth: 0,
    })

    if (!location || !location.name) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const loc = location
    console.log(`[Enrich Location] Processing: ${loc.name}`)

    const updateData: Record<string, any> = {}
    const searchQuery = `${loc.name} Santiago Chile`

    try {
      const [searchResult, placesResult] = await Promise.all([
        serperService.search(searchQuery),
        serperService.places(searchQuery),
      ])

      console.log(
        '[Enrich Location] Serper search result:',
        JSON.stringify(searchResult.organic?.[0]?.snippet?.slice(0, 100)),
      )
      console.log(
        '[Enrich Location] Serper places result:',
        JSON.stringify(placesResult.places?.[0]),
      )

      if (searchResult.organic?.length > 0) {
        const firstResult = searchResult.organic[0]
        updateData.characteristics = firstResult.snippet?.substring(0, 500) || ''
      }

      if (placesResult.places?.length > 0) {
        const place = placesResult.places[0]
        if (place.latitude && place.longitude) {
          updateData.coordinates = {
            lat: place.latitude,
            lng: place.longitude,
          }
          console.log('[Enrich Location] Coordinates from Serper:', updateData.coordinates)
        }
      }
      console.log(`[Enrich Location] Serper done`)
    } catch (e) {
      console.error('[Enrich Location] Serper error:', e)
    }

    try {
      const systemPrompt = `Eres experto en SEO local para Chile.
Genera información para la comuna "${loc.name}" en Santiago.
Responde EXACTAMENTE en JSON:
{
  "population": number (población aproximada),
  "characteristics": string (breve descripción para SEO, max 200 chars),
  "mainKeywords": string[] (5 keywords principales),
  "metaTitle": string (título SEO, max 60 chars),
  "metaDescription": string (descripción SEO, max 160 chars),
  "latitude": number (latitud de la comuna, ej: -33.45),
  "longitude": number (longitud de la comuna, ej: -70.65)
}`

      const result = await glmService.chatWithSystem(systemPrompt, loc.name)
      const jsonStr = result.replace(/```json|```/g, '').trim()
      const analysis = JSON.parse(jsonStr)

      console.log('[Enrich Location] GLM result:', jsonStr)

      if (analysis) {
        if (analysis.population) updateData.population = analysis.population
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
        // Fallback coordinates from GLM if not available from Serper
        if (!updateData.coordinates && analysis.latitude && analysis.longitude) {
          updateData.coordinates = {
            lat: analysis.latitude,
            lng: analysis.longitude,
          }
          console.log('[Enrich Location] Coordinates from GLM:', updateData.coordinates)
        }
      }
      console.log(`[Enrich Location] GLM done`)
    } catch (e) {
      console.error('[Enrich Location] GLM error:', e)
    }

    if (Object.keys(updateData).length > 0) {
      await payload.update({
        collection: 'locations',
        id,
        data: updateData,
        depth: 0,
      })
    }

    return NextResponse.json({
      success: true,
      locationId: id,
      locationName: loc.name,
      enriched: updateData,
    })
  } catch (error: any) {
    console.error('[Enrich Location] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
