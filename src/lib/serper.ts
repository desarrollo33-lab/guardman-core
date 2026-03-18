/**
 * Cliente para interactuar con la API de Serper.dev
 */

import { Payload } from 'payload'

export interface SerperSearchParams {
  q: string
  gl?: string // country (e.g. 'cl')
  hl?: string // language (e.g. 'es')
  location?: string
  num?: number
}

export interface SerperResponse {
  searchParameters: any
  organic?: any[]
  local?: any[]
  peopleAlsoAsk?: any[]
  relatedSearches?: any[]
}

export async function fetchSerperData(payload: Payload, options: SerperSearchParams): Promise<SerperResponse> {
  const apiKey = process.env.SERPER_API_KEY

  if (!apiKey) {
    throw new Error('SERPER_API_KEY no está configurada')
  }

  const cacheKey = `serper:${options.q}:${options.gl || 'cl'}:${options.hl || 'es'}`

  // 1. Verificar Caché
  const cached = await payload.find({
    collection: 'api-cache',
    where: {
      cacheKey: { equals: cacheKey },
      service: { equals: 'serper' },
    },
    limit: 1,
  })

  // Optional: Check expiry (e.g. 30 days)
  if (cached.docs.length > 0) {
    const cacheDoc = cached.docs[0]
    if (!cacheDoc.expiresAt || new Date(cacheDoc.expiresAt) > new Date()) {
      payload.logger.info(`[ApiCache] HIT Serper para: ${cacheKey}`)
      return cacheDoc.response as any
    } else {
      payload.logger.info(`[ApiCache] EXPIRED Serper para: ${cacheKey}`)
      // Borrar o actualizar luego
    }
  }

  payload.logger.info(`[ApiCache] MISS Serper para: ${cacheKey}. Fetching...`)

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gl: 'cl',
      hl: 'es',
      ...options,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Serper API error: ${response.status} ${response.statusText} - ${errText}`)
  }

  const data: SerperResponse = await response.json()

  // 2. Guardar en Caché (expira en 30 días)
  const expiresDate = new Date()
  expiresDate.setDate(expiresDate.getDate() + 30)

  try {
    if (cached.docs.length > 0) {
      await payload.update({
        collection: 'api-cache',
        id: cached.docs[0].id,
        data: {
          response: data as any,
          expiresAt: expiresDate.toISOString(),
        },
      })
    } else {
      await payload.create({
        collection: 'api-cache',
        data: {
          cacheKey,
          service: 'serper',
          response: data as any,
          expiresAt: expiresDate.toISOString(),
        },
      })
    }
  } catch (err) {
    payload.logger.error(`[ApiCache] Error saving cache for ${cacheKey}: ${err instanceof Error ? err.message : String(err)}`)
  }

  return data
}
