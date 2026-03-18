import { Endpoint } from 'payload'
import { runEnrichmentPipeline } from '../lib/enrichmentPipeline'

export const asyncEnrichmentEndpoint: Endpoint = {
  path: '/async-enrichment',
  method: 'post',
  handler: async (req) => {
    // 1. Immediately return 202 Accepted to prevent blocking the UI
    const requestBody = (await req.json?.()) as { collectionSlug?: string; docId?: string | number } || {}
    const { collectionSlug, docId } = requestBody

    if (!collectionSlug || !docId) {
      return Response.json({ error: 'Missing collectionSlug or docId' }, { status: 400 })
    }

    // 2. Process in background (Fire and Forget)
    // We execute an IIFE (Immediately Invoked Function Expression) that catches its own errors
    // so it doesn't crash the server if it fails.
    ;(async () => {
      try {
        console.log(`[AsyncEnrichment] Starting background job for ${collectionSlug} ID: ${docId}`)
        
        await runEnrichmentPipeline(req.payload, collectionSlug, String(docId))
        
        console.log(`[AsyncEnrichment] Finished background job for ${collectionSlug} ID: ${docId}`)

      } catch (error) {
        console.error(`[AsyncEnrichment] Background job failed:`, error)
        // Ensure we log errors to the EnrichmentHistory collection to inform the admin
        try {
          await req.payload.create({
            collection: 'enrichment-history',
            data: {
              sourceCollection: collectionSlug as any,
              sourceId: String(docId),
              wasSuccessful: false,
              errorMessage: error instanceof Error ? error.message : String(error),
            },
            overrideAccess: true, // Use system access
          })
        } catch (logError) {
          console.error('[AsyncEnrichment] Failed to save error to EnrichmentHistory:', logError)
        }
      }
    })()

    // Respond immediately to the frontend
    return new Response(JSON.stringify({ 
      status: 'accepted',
      message: 'Background enrichment job queued successfully.',
      jobDetails: { collectionSlug, docId }
    }), {
      status: 202,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
