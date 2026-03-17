/**
 * GUARDMAN - Hook de Enriquecimiento de Lead
 * Se ejecuta ANTES de crear un lead para enriquecer los datos
 */

import type { CollectionBeforeChangeHook } from 'payload'

// Normalización de teléfono Chile
export function normalizePhone(phone: string): string {
  if (!phone) return ''
  
  return phone
    .replace(/\s/g, '')
    .replace(/[+\-()]/g, '')
    .replace(/^56/, '9')
    .replace(/^9/, '+569')
}

export const enrichLeadBeforeCreate: CollectionBeforeChangeHook = async ({
  operation,
  data,
  req,
}) => {
  // Solo ejecutar en creación
  if (operation !== 'create') return data

  // 1. Normalizar teléfono
  const normalizedPhone = normalizePhone(data.phone)
  
  // 2. Enriquecer datos del origen
  const enrichedData = {
    ...data,
    source: {
      ...data.source,
      normalizedPhone,
    },
  }

  // 3. Logging para debugging
  console.log(`[Lead Enrichment] New lead: ${data.name} (${normalizedPhone})`)

  return enrichedData
}

export default enrichLeadBeforeCreate
