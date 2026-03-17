/**
 * GUARDMAN - Serper Service
 * Integración con Serper.dev para datos de SEO
 * 
 * Endpoints disponibles:
 * - /search    → Búsqueda orgánica
 * - /places    → Empresas locales
 * - /news      → Noticias
 * - /autocomplete → Sugerencias
 */

const SERPER_BASE_URL = 'https://google.serper.dev'

export interface SerperSearchOptions {
  num?: number
  page?: number
}

export interface SerperSearchResult {
  searchParameters: Record<string, unknown>
  organic: Array<{
    title: string
    link: string
    snippet: string
    position: number
  }>
  credits: number
}

export interface SerperPlacesResult {
  searchParameters: Record<string, unknown>
  places: Array<{
    title: string
    address: string
    latitude: number
    longitude: number
    rating: number
    ratingCount: number
    category: string
    phoneNumber?: string
    website?: string
    cid: string
  }>
  credits: number
}

export interface SerperNewsResult {
  searchParameters: Record<string, unknown>
  news: Array<{
    title: string
    link: string
    snippet: string
    date: string
    source: string
    imageUrl?: string
  }>
  credits: number
}

export interface SerperAutocompleteResult {
  searchParameters: Record<string, unknown>
  suggestions: Array<{ value: string }>
  credits: number
}

export class SerperService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(`${SERPER_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Serper API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Búsqueda orgánica de Google
   * Útil para: Rankings, análisis de competidores, keywords
   */
  async search(query: string, options: SerperSearchOptions = {}): Promise<SerperSearchResult> {
    return this.request<SerperSearchResult>('/search', {
      q: query,
      num: options.num || 10,
      page: options.page || 1,
    })
  }

  /**
   * Empresas locales
   * Útil para: Perfiles de competidores, ratings
   */
  async places(query: string): Promise<SerperPlacesResult> {
    return this.request<SerperPlacesResult>('/places', {
      q: query,
      num: 10,
    })
  }

  /**
   * Noticias
   * Útil para: Detección de tendencias
   */
  async news(query: string): Promise<SerperNewsResult> {
    return this.request<SerperNewsResult>('/news', {
      q: query,
      num: 10,
    })
  }

  /**
   * Sugerencias de autocomplete
   * Útil para: Keyword research
   */
  async autocomplete(query: string): Promise<SerperAutocompleteResult> {
    return this.request<SerperAutocompleteResult>('/autocomplete', {
      q: query,
    })
  }

  /**
   * Ejecuta múltiples endpoints en paralelo
   */
  async fullAudit(query: string) {
    const [search, places, news, autocomplete] = await Promise.all([
      this.search(query),
      this.places(query),
      this.news(query),
      this.autocomplete(query),
    ])

    return {
      search,
      places,
      news,
      autocomplete,
      totalCredits: search.credits + places.credits + news.credits + autocomplete.credits,
    }
  }
}

// Export por defecto
export default SerperService
