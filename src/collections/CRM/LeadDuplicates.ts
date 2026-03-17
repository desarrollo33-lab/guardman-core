/**
 * GUARDMAN - Detección de Duplicados
 * Registro de teléfonos duplicados para evitar leads repetidos
 */

import type { CollectionConfig } from 'payload'

export const leadDuplicates: CollectionConfig = {
  slug: 'lead-duplicates',
  admin: {
    useAsTitle: 'normalizedPhone',
    group: 'CRM',
    description: 'Registro de teléfonos duplicados',
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'seo_manager',
    create: () => false, // Solo se crea desde hooks
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'normalizedPhone',
      type: 'text',
      required: true,
      unique: true,
      label: 'Teléfono normalizado',
      admin: {
        description: 'Teléfono en formato: +569XXXXXXXX',
      },
    },
    {
      name: 'leadIds',
      type: 'array',
      label: 'Leads relacionados',
      fields: [
        {
          name: 'leadId',
          type: 'text',
          label: 'ID del Lead',
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Fecha de creación',
        },
      ],
    },
    {
      name: 'occurrenceCount',
      type: 'number',
      defaultValue: 1,
      label: 'Veces visto',
    },
    {
      name: 'firstSeen',
      type: 'date',
      label: 'Primera vez visto',
    },
    {
      name: 'lastSeen',
      type: 'date',
      label: 'Última vez visto',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Sin resolver', value: 'unresolved' },
        { label: 'Falso positivo', value: 'false_positive' },
        { label: 'Mismo cliente', value: 'same_customer' },
        { label: 'Resuelto', value: 'resolved' },
      ],
      defaultValue: 'unresolved',
      label: 'Estado',
    },
    {
      name: 'resolution',
      type: 'group',
      label: 'Resolución',
      admin: {
        condition: (data) => data.status !== 'unresolved',
      },
      fields: [
        {
          name: 'resolvedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Resuelto por',
        },
        {
          name: 'resolvedAt',
          type: 'date',
          label: 'Fecha de resolución',
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notas de resolución',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas',
    },
  ],
}
