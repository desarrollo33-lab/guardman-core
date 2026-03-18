/**
 * GUARDMAN - Colección de Usuarios
 * Sistema de autenticación y gestión de equipo
 * 
 * Roles disponibles:
 * - admin: Acceso completo
 * - sales: Vendedor (gestión de leads)
 * - seo_manager: Gestor SEO
 * - support: Atención al cliente
 */

import type { CollectionConfig } from 'payload'

export const users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    group: 'Sistema',
    description: 'Usuarios del equipo Guardman',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Vendedor', value: 'sales' },
        { label: 'SEO Manager', value: 'seo_manager' },
        { label: 'Atención al Cliente', value: 'support' },
      ],
      defaultValue: 'sales',
      label: 'Rol',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Usuario activo',
    },
    // Configuración de Telegram
    {
      name: 'telegram',
      type: 'group',
      label: 'Telegram',
      fields: [
        {
          name: 'chatId',
          type: 'text',
          label: 'Chat ID',
        },
        {
          name: 'username',
          type: 'text',
          label: '@username',
        },
        {
          name: 'notificationsEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Notificaciones activas',
        },
        {
          name: 'notifyOnNewLead',
          type: 'checkbox',
          defaultValue: true,
          label: 'Notificar nuevos leads',
        },
        {
          name: 'notifyOnStatusChange',
          type: 'checkbox',
          defaultValue: true,
          label: 'Notificar cambios de estado',
        },
      ],
    },
    // Perfil de ventas
    {
      name: 'salesProfile',
      type: 'group',
      label: 'Perfil de Ventas',
      admin: {
        condition: (data) => data.role === 'sales',
      },
      fields: [
        {
          name: 'preferredZones',
          type: 'array',
          label: 'Zonas preferidas',
          fields: [
            {
              name: 'zone',
              type: 'select',
              options: [
                { label: 'Zona Oriente', value: 'oriente' },
                { label: 'Zona Nororiente', value: 'nororiente' },
                { label: 'Zona Norte', value: 'norte' },
                { label: 'Zona Poniente', value: 'poniente' },
                { label: 'Zona Suroriente', value: 'suroriente' },
                { label: 'Zona Sur', value: 'sur' },
                { label: 'Zona Centro', value: 'centro' },
              ],
            },
          ],
        },
        {
          name: 'specializations',
          type: 'array',
          label: 'Especializaciones',
          fields: [
            { name: 'persona', type: 'text', label: 'Persona objetivo' },
          ],
        },
        {
          name: 'workingHours',
          type: 'group',
          label: 'Horario laboral',
          fields: [
            {
              name: 'start',
              type: 'number',
              min: 0,
              max: 23,
              defaultValue: 9,
              label: 'Inicio (hora)',
            },
            {
              name: 'end',
              type: 'number',
              min: 0,
              max: 23,
              defaultValue: 18,
              label: 'Fin (hora)',
            },
          ],
        },
        {
          name: 'maxPendingLeads',
          type: 'number',
          defaultValue: 10,
          label: 'Máximo leads pendientes',
        },
      ],
    },
    // Estadísticas (solo lectura)
    {
      name: 'stats',
      type: 'group',
      label: 'Estadísticas',
      admin: {
        readOnly: true,
        condition: (data) => data.role === 'sales',
      },
      fields: [
        {
          name: 'totalLeads',
          type: 'number',
          defaultValue: 0,
          label: 'Total leads',
        },
        {
          name: 'convertedLeads',
          type: 'number',
          defaultValue: 0,
          label: 'Leads convertidos',
        },
        {
          name: 'conversionRate',
          type: 'number',
          defaultValue: 0,
          label: 'Tasa de conversión (%)',
        },
      ],
    },
  ],
}
