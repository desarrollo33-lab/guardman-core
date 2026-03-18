/**
 * GUARDMAN V3 - Hook de Detección de Duplicados
 * Se ejecuta ANTES de crear un lead para detectar duplicados
 * V3: Simplified - no longer writes to lead-duplicates collection
 */

import type { CollectionBeforeChangeHook } from 'payload'
import { normalizePhone } from './enrichLead'

export const detectDuplicateBeforeCreate: CollectionBeforeChangeHook = async ({
  operation,
  data,
  req,
}) => {
  // Solo ejecutar en creación
  if (operation !== 'create') return data

  const normalizedPhone = normalizePhone(data.phone)

  if (!normalizedPhone) return data

  try {
    // Buscar lead existente con mismo teléfono (que no esté perdido)
    const existing = await req.payload.find({
      collection: 'leads',
      where: {
        'source.normalizedPhone': { equals: normalizedPhone },
        status: { not_equals: 'lost' },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      const existingLead = existing.docs[0]
      console.log(`[Duplicate Detection] Found duplicate: ${existingLead.id}`)

      // Agregar etiqueta y nota al nuevo lead
      const updatedData = {
        ...data,
        tags: [
          ...(data.tags || []),
          { tag: 'DUPLICADO' },
        ],
        notes: [
          ...(data.notes || []),
          {
            note: `⚠️ DUPLICADO: Teléfono ya registrado en lead anterior (${existingLead.id})`,
            date: new Date().toISOString(),
          },
        ],
      }

      console.log(`[Duplicate Detection] Duplicate flagged for lead`)

      return updatedData
    }

    console.log(`[Duplicate Detection] No duplicate found for: ${normalizedPhone}`)

  } catch (error) {
    console.error('[Duplicate Detection] Error:', error)
  }

  return data
}

export default detectDuplicateBeforeCreate

