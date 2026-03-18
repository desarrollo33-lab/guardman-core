import { CollectionAfterChangeHook } from 'payload'

/**
 * Hook que se dispara de forma síncrona después de guardar un Location.
 * Si el campo `autoEnrich` está en true, hace un POST http (fire & forget)
 * al endpoint de async-enrichment.
 */
export const triggerAsyncEnrichment: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Solo procesar si autoEnrich está encendido
  if (!doc.autoEnrich) {
    return doc
  }

  // Prevenir bucles infinitos usando ctx
  // Si el background job actualiza este documento, le pasará `context: { skipEnrichmentWebhook: true }`
  if (req.context?.skipEnrichmentWebhook) {
    return doc
  }

  // Comprobar si debemos dispararlo:
  // - En 'create', siempre y cuando tenga autoEnrich
  // - En 'update', si autoEnrich fue activado en este save, o si cambiaron campos relevantes (ej: motor economico)
  const isCreate = operation === 'create'
  const isUpdate = operation === 'update'
  const autoEnrichJustTurnedOn = isUpdate && !previousDoc?.autoEnrich && doc.autoEnrich
  const economicDriverChanged = isUpdate && doc.economicDriver !== previousDoc?.economicDriver

  if (isCreate || autoEnrichJustTurnedOn || economicDriverChanged) {
    req.payload.logger.info(`[Locations Hook] Triggering async enrichment for Location: ${doc.name} (ID: ${doc.id})`)

    // We make an internal fetch to our own endpoint
    // We need to know the origin URL. Since we are in Payload backend, we can construct it or use a relative path if supported.
    // In Next.js/Payload v3 server, absolute URL is usually required.
    const baseUrl = process.env.PAYLOAD_URL || 'http://localhost:3000'
    const endpointUrl = `${baseUrl}/api/async-enrichment`

    // Do NOT await this fetch. We want it to run in the background.
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the auth header if necessary, or let the endpoint be public/protected appropriately
        // We might need an internal API key here in production to secure the endpoint.
      },
      body: JSON.stringify({
        collectionSlug: 'locations',
        docId: doc.id,
      }),
    }).catch(err => {
      req.payload.logger.error(`[Locations Hook] Error triggering async fetch: ${err.message}`)
    })
  }

  return doc
}
