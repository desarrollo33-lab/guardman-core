import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { runEnrichmentPipeline } from '@/lib/enrichmentPipeline'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { collectionSlug?: string; docId?: string | number }
    const { collectionSlug, docId } = body

    if (!collectionSlug || !docId) {
      return NextResponse.json({ error: 'Missing collectionSlug or docId' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const result = await runEnrichmentPipeline(payload, collectionSlug as string, String(docId))

    await payload.update({
      collection: 'locations',
      id: Number(docId),
      data: { enrichmentStatus: 'completed' },
      overrideAccess: true,
    })

    return NextResponse.json({
      status: 'completed',
      result,
    })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
