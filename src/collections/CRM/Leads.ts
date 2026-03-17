/**
 * GUARDMAN - Leads
 * Gestión de leads con scoring automático
 *
 * Flujo:
 * 1. Se crea desde formulario público o manualmente
 * 2. Hook beforeChange: normaliza teléfono y detecta duplicados
 * 3. Hook afterChange: scoring con GLM y asignación a vendedor
 */

import type { CollectionConfig } from 'payload'

// ===================================================================
// HOOKS
// ===================================================================
import { enrichLeadBeforeCreate } from '../../hooks/leads/enrichLead'
import { detectDuplicateBeforeCreate } from '../../hooks/leads/detectDuplicate'
import { scoreLeadAfterCreate } from '../../hooks/leads/scoreLead'
import { assignLeadAfterCreate } from '../../hooks/leads/assignLead'

export const leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'CRM',
    description: 'Leads captados desde formularios',
    listSearchableFields: ['name', 'phone', 'email', 'status', 'score'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'seo_manager') return true
      // Vendedores ven solo sus leads
      return { assignedTo: { equals: user.id } }
    },
    create: () => true, // Público para formularios
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'seo_manager') return true
      return { assignedTo: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ===================================================================
    // DATOS DEL CONTACTO
    // ===================================================================
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
      admin: {
        placeholder: 'Nombre completo del contacto',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      admin: {
        placeholder: 'correo@ejemplo.cl',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Teléfono',
      admin: {
        placeholder: '+569XXXXXXXX',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Empresa/Organización',
      admin: {
        placeholder: 'Nombre de la empresa (opcional)',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
      admin: {
        placeholder: '¿En qué podemos ayudarte?',
      },
    },

    // ===================================================================
    // ORIGEN
    // ===================================================================
    {
      name: 'source',
      type: 'group',
      label: 'Origen',
      fields: [
        {
          name: 'pageUrl',
          type: 'text',
          label: 'URL de origen',
          admin: {
            description: 'Página donde se captó el lead',
          },
        },
        {
          name: 'location',
          type: 'relationship',
          relationTo: 'locations',
          label: 'Comuna',
        },
        {
          name: 'neighborhood',
          type: 'relationship',
          relationTo: 'neighborhoods',
          label: 'Barrio',
        },
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          label: 'Servicio de interés',
        },
        {
          name: 'referrer',
          type: 'text',
          label: 'Referente',
        },
        {
          name: 'normalizedPhone',
          type: 'text',
          admin: {
            hidden: true,
          },
          label: 'Teléfono normalizado',
        },
        {
          name: 'formId',
          type: 'text',
          label: 'ID del formulario',
        },
        {
          name: 'utmSource',
          type: 'text',
          label: 'UTM Source',
        },
        {
          name: 'utmMedium',
          type: 'text',
          label: 'UTM Medium',
        },
        {
          name: 'utmCampaign',
          type: 'text',
          label: 'UTM Campaign',
        },
      ],
    },

    // ===================================================================
    // CLASIFICACIÓN IA (automática)
    // ===================================================================
    {
      name: 'internalClassification',
      type: 'group',
      label: 'Clasificación IA',
      admin: {
        hidden: true,
        description: 'Datos preenchidos automaticamente pelo GLM',
      },
      fields: [
        {
          name: 'detectedPersona',
          type: 'select',
          label: 'Persona Detectada',
          options: [
            { label: 'Presidente Comunidad', value: 'presidente_comunidad' },
            { label: 'Administrador Condominio', value: 'admin_condominio' },
            { label: 'Gerente General', value: 'gerente_general' },
            { label: 'Dueño de Casa', value: 'dueno_casa' },
            { label: 'Encargado Seguridad', value: 'encargado_seguridad' },
            { label: 'Otro', value: 'otro' },
          ],
        },
        {
          name: 'detectedProblems',
          type: 'array',
          label: 'Problemas Detectados',
          fields: [
            { name: 'problem', type: 'text', label: 'Problema' },
          ],
        },
        {
          name: 'estimatedBudget',
          type: 'select',
          label: 'Presupuesto Estimado',
          options: [
            { label: 'Bajo', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
        },
        {
          name: 'urgency',
          type: 'select',
          label: 'Urgencia',
          options: [
            { label: 'Alta', value: 'high' },
            { label: 'Media', value: 'medium' },
            { label: 'Baja', value: 'low' },
          ],
        },
        {
          name: 'analyzedAt',
          type: 'date',
          label: 'Fecha de análisis',
        },
        {
          name: 'modelUsed',
          type: 'text',
          label: 'Modelo usado',
        },
      ],
    },

    // ===================================================================
    // SCORING
    // ===================================================================
    {
      name: 'score',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      label: 'Score (0-100)',
      admin: {
        description: 'Puntuación automática del lead',
      },
    },
    {
      name: 'smartAction',
      type: 'select',
      label: 'Acción Sugerida',
      options: [
        { label: 'Contactar Urgente', value: 'URGENT_CONTACT' },
        { label: 'Seguimiento', value: 'FOLLOW_UP' },
        { label: 'Delegar a IA', value: 'AI_DELEGATE' },
        { label: 'Reactivar', value: 'REACTIVATE' },
        { label: 'No Califica', value: 'NOT_QUALIFIED' },
      ],
      defaultValue: 'FOLLOW_UP',
    },

    // ===================================================================
    // ESTADO KANBAN
    // ===================================================================
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: '🆕 Nuevo', value: 'new' },
        { label: '📞 Contactado', value: 'contacted' },
        { label: '📋 Cotizando', value: 'quoting' },
        { label: '✅ Convertido', value: 'converted' },
        { label: '❌ Perdido', value: 'lost' },
      ],
      defaultValue: 'new',
      admin: {
        description: 'Estado del lead en el embudo',
      },
    },

    // ===================================================================
    // GESTIÓN
    // ===================================================================
    {
      name: 'tags',
      type: 'array',
      label: 'Etiquetas',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta',
        },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Asignado a',
      admin: {
        description: 'Vendedor responsable del lead',
      },
    },
    {
      name: 'notes',
      type: 'array',
      label: 'Notas',
      fields: [
        {
          name: 'note',
          type: 'textarea',
          label: 'Nota',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Fecha',
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          label: 'Usuario',
        },
      ],
    },
    {
      name: 'followUps',
      type: 'array',
      label: 'Seguimientos',
      admin: {
        description: 'Historial de seguimientos',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Fecha',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Tipo',
          options: [
            { label: 'Llamada', value: 'call' },
            { label: 'Email', value: 'email' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Visita', value: 'visit' },
          ],
        },
        {
          name: 'result',
          type: 'select',
          label: 'Resultado',
          options: [
            { label: 'Sin respuesta', value: 'no_answer' },
            { label: 'Interesado', value: 'interested' },
            { label: 'No interesado', value: 'not_interested' },
            { label: 'Callback', value: 'callback' },
          ],
        },
        {
          name: 'nextAction',
          type: 'text',
          label: 'Próxima acción',
        },
        {
          name: 'nextFollowUp',
          type: 'date',
          label: 'Próximo seguimiento',
        },
      ],
    },

    // ===================================================================
    // LEAD AUTOMÁTICO (prospección)
    // ===================================================================
    {
      name: 'isAutoGenerated',
      type: 'checkbox',
      label: 'Lead automático',
      defaultValue: false,
      admin: {
        hidden: true,
        description: 'Si fue generado automáticamente por prospección',
      },
    },

    // ===================================================================
    // METADATA
    // ===================================================================
    {
      name: 'createdAt',
      type: 'date',
      label: 'Fecha de creación',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        hidden: true,
      },
      label: 'Última actualización',
    },
    {
      name: 'lastContactedAt',
      type: 'date',
      label: 'Último contacto',
    },
    {
      name: 'convertedAt',
      type: 'date',
      label: 'Fecha de conversión',
      admin: {
        hidden: true,
      },
    },
  ],

  // Hooks para automatización
  hooks: {
    beforeChange: [enrichLeadBeforeCreate, detectDuplicateBeforeCreate],
    afterChange: [scoreLeadAfterCreate, assignLeadAfterCreate],
  },
}
