/**
 * GUARDMAN - Hook de Asignación de Lead con Notificaciones
 * Se ejecuta DESPUÉS de crear un lead para asignar automáticamente a un vendedor
 * y notificar por Telegram
 */

import type { CollectionAfterChangeHook } from 'payload'
import { TelegramService } from '../../services/TelegramService'

// Instancia global de Telegram (se inicializa en payload.config.ts)
let telegramService: TelegramService | null = null

// Inicializar el servicio (llamar desde payload.config.ts)
export function initTelegramService(botToken: string) {
  telegramService = new TelegramService(botToken)
  console.log('[Telegram] Service initialized')
}

export const assignLeadAfterCreate: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  // Solo ejecutar en creación
  if (operation !== 'create') return

  console.log(`[Lead Assignment] Processing lead: ${doc.id}`)

  try {
    // 1. Buscar vendedores activos
    const users = await req.payload.find({
      collection: 'users',
      where: {
        role: { equals: 'sales' },
        isActive: { equals: true },
      },
      limit: 100,
    })

    if (users.docs.length === 0) {
      console.log('[Lead Assignment] No active sellers found')
      return
    }

    // 2. Para cada vendedor, contar leads pendientes
    const candidates = []

    for (const user of users.docs) {
      const userLeads = await req.payload.find({
        collection: 'leads',
        where: {
          assignedTo: { equals: user.id },
          status: { not_in: ['converted', 'lost'] },
        },
        limit: 1000,
      })

      const pendingCount = userLeads.totalDocs
      const maxPending = user.salesProfile?.maxPendingLeads || 10

      // Skip si tiene demasiados leads pendientes
      if (pendingCount >= maxPending) {
        console.log(`[Lead Assignment] User ${user.id} has ${pendingCount} pending leads (max: ${maxPending})`)
        continue
      }

      // Calcular score del vendedor
      let score = 100 - pendingCount * 10

      // Bonus por zona preferida
      if (user.salesProfile?.preferredZones?.length && doc.source?.location) {
        const leadLocation = doc.source.location
        
        if (typeof leadLocation === 'object' && leadLocation.id) {
          try {
            const location = await req.payload.findByID({
              collection: 'locations',
              id: leadLocation.id,
            })
            
            if (location?.geoZone) {
              const zoneMatch = user.salesProfile.preferredZones.some(
                (z: any) => z.zone === location.geoZone
              )
              if (zoneMatch) {
                score += 20
                console.log(`[Lead Assignment] Zone match for user ${user.id}: +20`)
              }
            }
          } catch (e) {
            // Ignorar error
          }
        }
      }

      candidates.push({ user, score, pendingCount })
    }

    // 3. Ordenar por score y seleccionar el mejor
    candidates.sort((a, b) => b.score - a.score)
    const bestSeller = candidates[0]

    if (!bestSeller) {
      console.log('[Lead Assignment] No suitable seller found')
      return
    }

    // 4. Asignar lead al vendedor
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        assignedTo: bestSeller.user.id,
      },
      req,
    })

    console.log(`[Lead Assignment] Lead ${doc.id} assigned to user ${bestSeller.user.id} (score: ${bestSeller.score})`)

    // 5. Notificar por Telegram al vendedor
    if (telegramService && bestSeller.user.telegram?.chatId) {
      const success = await telegramService.notifyNewLead(
        {
          name: doc.name,
          phone: doc.phone,
          email: doc.email,
          score: doc.score || 50,
          message: doc.message,
          source: {
            pageUrl: doc.source?.pageUrl,
            location: doc.source?.location,
            service: doc.source?.service,
          },
          smartAction: doc.smartAction,
        },
        bestSeller.user.telegram.chatId,
        {
          name: bestSeller.user.name,
        }
      )

      if (success) {
        console.log(`[Lead Assignment] Telegram notification sent to ${bestSeller.user.telegram.chatId}`)
      }
    }

    // 6. También notificar al admin si está configurado
    // Por ahora commented out - se puede habilitar cuando esté configurado en settings
    if (telegramService) {
      // const settings = await req.payload.find({ collection: 'settings', limit: 1 })
      // if (settings.docs[0]?.telegram?.adminChatId) { ... }
    }

  } catch (error) {
    console.error('[Lead Assignment] Error:', error)
  }
}

export default assignLeadAfterCreate
