/**
 * GUARDMAN - Hook de Detección de Duplicados
 * Se ejecuta ANTES de crear un lead para detectar duplicados
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

      // Buscar o crear registro de duplicado
      const duplicateRecord = await req.payload.find({
        collection: 'lead-duplicates',
        where: { normalizedPhone: { equals: normalizedPhone } },
        limit: 1,
      })

      if (duplicateRecord.totalDocs > 0) {
        // Actualizar registro existente
        const currentLeadIds = duplicateRecord.docs[0].leadIds as any[]
        await req.payload.update({
          collection: 'lead-duplicates',
          id: duplicateRecord.docs[0].id,
          data: {
            occurrenceCount: duplicateRecord.docs[0].occurrenceCount + 1,
            lastSeen: new Date().toISOString(),
            leadIds: [
              ...currentLeadIds,
              { leadId: String(existingLead.id), createdAt: new Date().toISOString() },
            ],
          },
          req,
        })
      } else {
        // Crear nuevo registro de duplicado
        await req.payload.create({
          collection: 'lead-duplicates',
          data: {
            normalizedPhone,
            leadIds: [
              { leadId: String(existingLead.id), createdAt: String(existingLead.createdAt) },
            ],
            occurrenceCount: 1,
            firstSeen: existingLead.createdAt,
            lastSeen: new Date().toISOString(),
          },
          req,
        })
      }

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
