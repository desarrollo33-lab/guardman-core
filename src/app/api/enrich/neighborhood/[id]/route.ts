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

    const neighborhood = await payload.findByID({
      collection: 'neighborhoods',
      id,
      depth: 1,
    })

    if (!neighborhood || !neighborhood.name) {
      return NextResponse.json({ error: 'Neighborhood not found' }, { status: 404 })
    }

    const nb = neighborhood as any
    const locationName = nb.location?.name || ''
    console.log(
      `[Enrich Neighborhood] Processing: ${nb.name}${locationName ? ` in ${locationName}` : ''}`,
    )

    const updateData: Record<string, any> = {}
    const searchQuery = locationName
      ? `${nb.name} ${locationName} Santiago Chile`
      : `${nb.name} Santiago Chile`

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
    } catch (e) {
      console.error('[Enrich Neighborhood] Serper error:', e)
    }

    try {
      const prompt = locationName
        ? `Barrio ${nb.name} en ${locationName}, Santiago Chile`
        : `Barrio ${nb.name} en Santiago Chile`

      const systemPrompt = `Eres experto en SEO local para Chile.
Genera información para el barrio "${prompt}".
Responde EXACTAMENTE en JSON:
{
  "characteristics": string (tipo de barrio: residencial, comercial, etc, max 200 chars),
  "mainKeywords": string[] (5 keywords principales para SEO del barrio),
  "latitude": number (latitud del barrio, ej: -33.45),
  "longitude": number (longitud del barrio, ej: -70.65)
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
        if (!updateData.coordinates && analysis.latitude && analysis.longitude) {
          updateData.coordinates = {
            lat: analysis.latitude,
            lng: analysis.longitude,
          }
        }
      }
    } catch (e) {
      console.error('[Enrich Neighborhood] GLM error:', e)
    }

    if (Object.keys(updateData).length > 0) {
      const updated = await payload.update({
        collection: 'neighborhoods',
        id,
        data: updateData,
        depth: 0,
      })
      console.log('[Enrich Neighborhood] Updated:', updated.id)
    }

    return NextResponse.json({
      success: true,
      neighborhoodId: id,
      neighborhoodName: nb.name,
      enriched: updateData,
    })
  } catch (error: any) {
    console.error('[Enrich Neighborhood] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
