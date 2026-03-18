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

    payload.logger.info(`[API] Starting async enrichment for ${collectionSlug} ID: ${docId}`)
    ;(async () => {
      try {
        await runEnrichmentPipeline(payload, collectionSlug as string, String(docId))
        payload.logger.info(`[API] Enrichment completed for ${collectionSlug} ID: ${docId}`)
      } catch (error) {
        payload.logger.error(`[API] Enrichment failed: ${error}`)

        try {
          const validCollections = ['locations', 'services', 'problems', 'seo-pages'] as const
          type ValidCollection = (typeof validCollections)[number]
          const safeCollection = (
            validCollections.includes(collectionSlug as ValidCollection)
              ? collectionSlug
              : 'locations'
          ) as ValidCollection

          await payload.create({
            collection: 'enrichment-history',
            data: {
              sourceCollection: safeCollection,
              sourceId: String(docId),
              wasSuccessful: false,
              errorMessage: error instanceof Error ? error.message : String(error),
            },
            overrideAccess: true,
          })
        } catch (logError) {
          payload.logger.error(`[API] Failed to log error: ${logError}`)
        }
      }
    })()

    return NextResponse.json(
      {
        status: 'accepted',
        message: 'Enrichment job queued',
        jobDetails: { collectionSlug, docId },
      },
      { status: 202 },
    )
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
