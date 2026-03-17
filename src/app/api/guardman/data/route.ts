/**
 * GUARDMAN - API Route: Obtener Datos Públicos
 * GET /api/guardman/data?type=locations&filters=...
 * 
 * Obtiene datos públicos para el frontend (no requiere auth)
 */

import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const slug = searchParams.get('slug')
    const limit = searchParams.get('limit') || '50'

    if (!type) {
      return NextResponse.json(
        { error: 'Tipo requerido: locations, services, industries, etc.' },
        { status: 400 }
      )
    }

    let url = ''

    switch (type) {
      case 'locations':
        url = `${PAYLOAD_URL}/api/locations?where[isActive][equals]=true&sort=-priorityScore&limit=${limit}`
        break
      case 'location':
        if (!slug) return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
        url = `${PAYLOAD_URL}/api/locations?where[slug][equals]=${slug}&limit=1`
        break
      case 'services':
        url = `${PAYLOAD_URL}/api/services?where[isActive][equals]=true&sort=order&limit=${limit}`
        break
      case 'service':
        if (!slug) return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
        url = `${PAYLOAD_URL}/api/services?where[slug][equals]=${slug}&limit=1`
        break
      case 'industries':
        url = `${PAYLOAD_URL}/api/industries?where[isActive][equals]=true&limit=${limit}`
        break
      case 'geo-zones':
        url = `${PAYLOAD_URL}/api/locations?where[isActive][equals]=true&limit=100`
        break
      case 'testimonials':
        url = `${PAYLOAD_URL}/api/testimonials?where[isApproved][equals]=true&sort=-order&limit=${limit}`
        break
      case 'seo-pages':
        url = `${PAYLOAD_URL}/api/seo-pages?where[status][equals]=published&sort=-priorityScore&limit=${limit}`
        break
      case 'seo-page':
        if (!slug) return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
        url = `${PAYLOAD_URL}/api/seo-pages?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`
        break
      default:
        return NextResponse.json({ error: `Tipo no válido: ${type}` }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Error al obtener datos' }, { status: response.status })
    }

    const result = await response.json() as any

    // Para geo-zones, filtrar solo las zonas únicas
    if (type === 'geo-zones') {
      const zones = [...new Set(result.docs?.map((loc: any) => loc.geoZone).filter(Boolean))]
      return NextResponse.json(zones)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Error fetching data:', error)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}
