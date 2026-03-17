/**
 * GUARDMAN - Form Submissions
 * Respuestas recibidas de los formularios
 */

import type { CollectionConfig } from 'payload'

export const formSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    group: 'CMS',
    description: 'Respuestas de formularios',
    listSearchableFields: ['form', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return true // Users can see their own submissions if needed
    },
    create: () => false, // Only created via form submission
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Formulario',
    },
    {
      name: 'submissionData',
      type: 'json',
      required: true,
      label: 'Datos enviados',
    },
    {
      name: 'ip',
      type: 'text',
      label: 'IP del usuario',
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Página de origen',
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      label: 'Lead creado',
      admin: {
        description: 'Lead generado a partir de esta submission',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: '✅ Procesado', value: 'processed' },
        { label: '⚠️ Error', value: 'error' },
        { label: '📧 Email enviado', value: 'email_sent' },
      ],
      defaultValue: 'processed',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas',
    },
  ],
}
