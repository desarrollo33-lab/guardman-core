/**
 * GUARDMAN - API Route: Test GLM Service
 * GET /api/test/glm
 *
 * Endpoint para probar el servicio GLM-5 de ZhipuAI
 * Protegido: solo si NODE_ENV !== 'production' O usuario admin
 */

import { NextRequest, NextResponse } from 'next/server'
import { GLMService, LeadScoringResult } from '@/services/GLMService'

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

    const apiKey = process.env.GLM_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'GLM_API_KEY no configurada',
          glmResponse: null,
          parsedResponse: null,
        },
        { status: 503 },
      )
    }

    // Datos de prueba para scoring
    const testLeadData = {
      name: 'Juan Pérez',
      message:
        'Necesito guardias de seguridad para mi empresa en Santiago. Tenemos 50 empleados y necesitamos protección 24/7.',
      source: 'test',
      location: 'Santiago, Chile',
    }

    // Crear instancia del servicio
    const glmService = new GLMService(apiKey, 'glm-5')

    let glmResponse: LeadScoringResult | null = null
    let parsedResponse: LeadScoringResult | null = null
    const errors: string[] = []

    try {
      // Llamar al servicio de scoring
      glmResponse = await glmService.scoreLead(testLeadData)
      parsedResponse = glmResponse
    } catch (glmError: unknown) {
      const errorMessage = glmError instanceof Error ? glmError.message : 'Unknown error'
      errors.push(`GLM Error: ${errorMessage}`)
      console.error('[API/TestGLM] Error calling GLM service:', glmError)
    }

    // Verificar respuesta
    const isValid =
      parsedResponse && typeof parsedResponse.score === 'number' && parsedResponse.recommendedAction

    return NextResponse.json({
      status: isValid ? 'success' : 'error',
      glmResponse: glmResponse
        ? {
            id: 'test-call',
            model: 'glm-5',
            success: !!parsedResponse,
          }
        : null,
      parsedResponse: parsedResponse || null,
      errors: errors.length > 0 ? errors : undefined,
      testData: testLeadData,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!apiKey,
        isProduction,
      },
    })
  } catch (error: any) {
    console.error('[API/TestGLM] Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: error.message || 'Error interno del servidor',
        glmResponse: null,
        parsedResponse: null,
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
