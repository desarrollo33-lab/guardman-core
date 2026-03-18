import { Payload } from 'payload'

export interface SerperSearchParams {
  q: string
  gl?: string
  hl?: string
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

export async function fetchSerperData(
  payload: Payload,
  options: SerperSearchParams,
): Promise<SerperResponse> {
  const apiKey = process.env.SERPER_API_KEY

  if (!apiKey) {
    throw new Error('SERPER_API_KEY no está configurada')
  }

  payload.logger.info(`[Serper] Fetching for: ${options.q}`)

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
  return data
}
