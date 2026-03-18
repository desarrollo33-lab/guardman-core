import { CollectionAfterChangeHook } from 'payload'
import { runEnrichmentPipeline } from '../../lib/enrichmentPipeline'

export const triggerAsyncEnrichment: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (req.context?.skipEnrichmentWebhook) {
    return doc
  }

  if (operation === 'create') {
    const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id

    try {
      await runEnrichmentPipeline(req.payload, 'locations', docId)

      await req.payload.update({
        collection: 'locations',
        id: docId,
        data: { enrichmentStatus: 'completed' as const },
        context: { skipEnrichmentWebhook: true },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      req.payload.logger.error(`[Locations Hook] Enrichment failed: ${errorMsg}`)

      await req.payload.update({
        collection: 'locations',
        id: docId,
        data: { enrichmentStatus: 'failed' as const },
        context: { skipEnrichmentWebhook: true },
      })
    }
  }

  return doc
}
