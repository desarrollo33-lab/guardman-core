/**
 * GUARDMAN - Telegram Service
 * Servicio de notificaciones via Telegram Bot
 */

export interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: 'Markdown' | 'HTML'
  disable_web_page_preview?: boolean
}

export class TelegramService {
  private botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  /**
   * Enviar mensaje de texto
   */
  async sendMessage(
    chatId: string, 
    message: string, 
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<boolean> {
    if (!this.botToken || !chatId) {
      console.warn('[Telegram] Bot token or chat ID not configured')
      return false
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: parseMode,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        console.error('[Telegram] Error sending message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('[Telegram] Exception sending message:', error)
      return false
    }
  }

  /**
   * Notificar nuevo lead asignado
   */
  async notifyNewLead(
    lead: {
      name: string
      phone: string
      email?: string
      score: number
      message: string
      source?: {
        pageUrl?: string
        location?: string | { name: string }
        service?: string | { title: string }
      }
      smartAction?: string
    },
    chatId: string,
    assignedUser?: {
      name: string
    }
  ): Promise<boolean> {
    const locationName = typeof lead.source?.location === 'object' 
      ? lead.source.location?.name 
      : lead.source?.location || 'No especificada'
    
    const serviceName = typeof lead.source?.service === 'object'
      ? lead.source.service?.title
      : lead.source?.service || 'No especificado'

    const message = `
🆕 *NUEVO LEAD ASIGNADO*

👤 *${lead.name}*
📱 ${lead.phone}
${lead.email ? `📧 ${lead.email}` : ''}

🎯 *Score:* ${lead.score}/100
${lead.smartAction ? `⚡ *Acción:* ${this.formatAction(lead.smartAction)}` : ''}

📍 *Origen:*
   Comuna: ${locationName}
   Servicio: ${serviceName}
   URL: ${lead.source?.pageUrl || 'Directo'}

💬 *Mensaje:*
${lead.message?.slice(0, 150)}${lead.message && lead.message.length > 150 ? '...' : ''}
${assignedUser ? `\n👤 *Asignado a:* ${assignedUser.name}` : ''}
    `.trim()

    return this.sendMessage(chatId, message)
  }

  /**
   * Notificar cambio de estado de lead
   */
  async notifyStatusChange(
    lead: {
      name: string
      phone: string
    },
    oldStatus: string,
    newStatus: string,
    chatId: string
  ): Promise<boolean> {
    const emojis: Record<string, string> = {
      new: '🆕',
      contacted: '📞',
      quoting: '📋',
      converted: '✅',
      lost: '❌',
    }

    const labels: Record<string, string> = {
      new: 'Nuevo',
      contacted: 'Contactado',
      quoting: 'Cotizando',
      converted: 'Convertido',
      lost: 'Perdido',
    }

    const message = `
📊 *CAMBIO DE ESTADO*

👤 ${lead.name}
📱 ${lead.phone}

${emojis[oldStatus] || '⚪'} → ${emojis[newStatus] || '⚪'}
*${labels[oldStatus] || oldStatus}* → *${labels[newStatus] || newStatus}*
    `.trim()

    return this.sendMessage(chatId, message)
  }

  /**
   * Notificar lead de prospección automática
   */
  async notifyAutoLead(
    lead: {
      name: string
      reason: string
      matchedPersona: string
      source: string
    },
    chatId: string
  ): Promise<boolean> {
    const message = `
🤖 *NUEVO LEAD DE PROSPECCIÓN*

🎯 *Razón:* ${lead.reason}
👤 *Persona:* ${lead.matchedPersona}
📰 *Fuente:* ${lead.source}

⚠️ *Nota:* Este lead fue generado automáticamente. Verificar disponibilidad.
    `.trim()

    return this.sendMessage(chatId, message)
  }

  /**
   * Notificar recordatorio de seguimiento
   */
  async notifyFollowUpReminder(
    lead: {
      name: string
      phone: string
      nextFollowUp: string
    },
    chatId: string
  ): Promise<boolean> {
    const message = `
⏰ *RECORDATORIO DE SEGUIMIENTO*

👤 ${lead.name}
📱 ${lead.phone}

📅 *Fecha:* ${lead.nextFollowUp}

*Recuerda dar seguimiento a este lead*
    `.trim()

    return this.sendMessage(chatId, message)
  }

  /**
   * Formatear acción para mostrar
   */
  private formatAction(action: string): string {
    const actions: Record<string, string> = {
      URGENT_CONTACT: '📞 Contactar Urgente',
      FOLLOW_UP: '📝 Seguimiento',
      AI_DELEGATE: '🤖 Delegar a IA',
      REACTIVATE: '♻️ Reactivar',
      NOT_QUALIFIED: '⛔ No Califica',
    }
    return actions[action] || action
  }
}

export default TelegramService
