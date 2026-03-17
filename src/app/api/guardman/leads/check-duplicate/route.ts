/**
 * GUARDMAN - API Route: Verificar Duplicado
 * GET /api/guardman/leads/check-duplicate?phone=+569XXXXXXXX
 * 
 * Verifica si un teléfono ya existe como lead activo
 */

import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

// Normalizar teléfono Chile
function normalizePhone(phone: string): string {
  return phone
    .replace(/\s/g, '')
    .replace(/[+\-()]/g, '')
    .replace(/^56/, '9')
    .replace(/^9/, '+569')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Teléfono requerido' },
        { status: 400 }
      )
    }

    const normalizedPhone = normalizePhone(phone)

    // Buscar en Payload API
    const response = await fetch(
      `${PAYLOAD_URL}/api/leads?where[source.normalizedPhone][equals]=${normalizedPhone}&where[status][not_equals]=lost&limit=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al buscar duplicado' },
        { status: response.status }
      )
    }

    const result = await response.json() as any

    if (result.docs?.length > 0) {
      const lead = result.docs[0]
      return NextResponse.json({
        exists: true,
        leadId: lead.id,
        leadName: lead.name,
        status: lead.status,
        message: 'Ya existe un lead con este teléfono',
      })
    }

    return NextResponse.json({
      exists: false,
    })
  } catch (error) {
    console.error('[API] Error checking duplicate:', error)
    return NextResponse.json(
      { error: 'Error al verificar duplicado' },
      { status: 500 }
    )
  }
}
