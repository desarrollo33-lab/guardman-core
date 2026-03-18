import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { fetchSerperData } from '@/lib/serper'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { collectionSlug?: string; docId?: string | number }
    const { collectionSlug, docId } = body

    if (!collectionSlug || !docId) {
      return NextResponse.json({ error: 'Missing collectionSlug or docId' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    payload.logger.info(`[Test] Starting pipeline for: ${docId}`)

    const locationDoc = await payload.findByID({
      collection: 'locations',
      id: docId,
      depth: 0,
    })

    payload.logger.info(`[Test] Found location: ${locationDoc.name}`)

    const serperQuery = `seguridad privada empresas o condominios en ${locationDoc.name} Chile`
    payload.logger.info(`[Test] Fetching Serper: ${serperQuery}`)

    const serperData = await fetchSerperData(payload, { q: serperQuery })

    return NextResponse.json({
      status: 'ok',
      location: locationDoc.name,
      serperResultCount: serperData?.organic?.length || 0,
    })
  } catch (error) {
    console.error('[Test] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
