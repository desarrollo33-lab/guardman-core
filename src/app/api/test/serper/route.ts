/**
 * GUARDMAN - API Route: Test Serper Service
 * GET /api/test/serper
 *
 * Endpoint para probar el servicio de búsqueda Serper
 * Protegido: solo si NODE_ENV !== 'production' O usuario admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { SerperService, SerperSearchResult } from '@/services/SerperService'

export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === 'production'

    if (isProduction) {
      const adminToken = request.headers.get('x-admin-token')
      const expectedToken = process.env.ADMIN_TEST_TOKEN

      if (!adminToken || adminToken !== expectedToken) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }

    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'SERPER_API_KEY no configurada',
          query: null,
          resultCount: 0,
          competitors: [],
          credits: null,
        },
        { status: 503 },
      )
    }

    // Obtener query de los parámetros URL, valor por defecto
    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q') || 'guardias de seguridad santiago'

    // Crear instancia del servicio
    const serperService = new SerperService(apiKey)

    let serperResult: SerperSearchResult | null = null
    const errors: string[] = []

    try {
      // Llamar al servicio de búsqueda
      serperResult = await serperService.search(query, { num: 10 })
    } catch (serperError: unknown) {
      const errorMessage = serperError instanceof Error ? serperError.message : 'Unknown error'
      errors.push(`Serper Error: ${errorMessage}`)
      console.error('[API/TestSerper] Error calling Serper service:', serperError)
    }

    // Extraer los primeros 3 competidores (resultados orgánicos)
    const competitors =
      serperResult?.organic?.slice(0, 3).map((result) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        position: result.position,
      })) || []

    // Verificar respuesta válida
    const isValid = serperResult && Array.isArray(serperResult.organic)

    return NextResponse.json({
      status: isValid ? 'success' : 'error',
      query,
      resultCount: serperResult?.organic?.length || 0,
      competitors,
      credits: serperResult?.credits ?? null,
      errors: errors.length > 0 ? errors : undefined,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!apiKey,
        isProduction,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('[API/TestSerper] Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: errorMessage,
        query: null,
        resultCount: 0,
        competitors: [],
        credits: null,
      },
      { status: 500 },
    )
  }
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
