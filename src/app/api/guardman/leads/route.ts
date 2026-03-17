/**
 * GUARDMAN - API Route: Crear Lead
 * POST /api/guardman/leads
 * 
 * Endpoint público para crear leads desde formularios del frontend
 * Usa fetch al endpoint REST de Payload
 */

import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    // Parsear body
    const body = await request.json() as {
      name?: string
      phone?: string
      email?: string
      company?: string
      message?: string
      pageUrl?: string
      location?: string
      service?: string
      formId?: string
      utmSource?: string
      utmMedium?: string
      utmCampaign?: string
    }
    
    const { 
      name, 
      phone, 
      email, 
      company, 
      message,
      pageUrl,
      location,
      service,
      formId,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body

    // Validar campos requeridos
    if (!name || !phone || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos requeridos',
          required: ['name', 'phone', 'message']
        },
        { status: 400 }
      )
    }

    // Normalizar teléfono
    const normalizedPhone = phone
      .replace(/\s/g, '')
      .replace(/[+\-()]/g, '')
      .replace(/^56/, '9')
      .replace(/^9/, '+569')

    // Enviar a Payload API
    const response = await fetch(`${PAYLOAD_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone: normalizedPhone,
        email: email || undefined,
        company: company || undefined,
        message,
        source: {
          pageUrl: pageUrl || '/',
          location: location || undefined,
          service: service || undefined,
          formId: formId || undefined,
          utmSource: utmSource || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: utmCampaign || undefined,
        },
        status: 'new',
      }),
    })

    if (!response.ok) {
      const error = await response.json() as { message?: string }
      return NextResponse.json(
        { success: false, error: error.message || 'Error al crear lead' },
        { status: response.status }
      )
    }

    const result = await response.json() as { doc?: { id: string } }
    console.log(`[API] Lead creado: ${result.doc?.id}`)

    return NextResponse.json({
      success: true,
      leadId: result.doc?.id,
      message: 'Lead creado exitosamente. Te contactaremos pronto.',
    })
  } catch (error) {
    console.error('[API] Error creating lead:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear lead' 
      },
      { status: 500 }
    )
  }
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
