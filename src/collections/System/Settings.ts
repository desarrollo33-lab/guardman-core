/**
 * GUARDMAN - Configuración Global
 * Variables de configuración del sistema
 */

import type { CollectionConfig } from 'payload'

export const settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'siteName',
    group: 'Sistema',
    description: 'Configuración global del sitio',
  },
  access: {
    read: () => true,
    create: () => false,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: () => false,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Guardman Chile',
      label: 'Nombre del sitio',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Servicios de seguridad privada en Santiago, Chile',
      label: 'Descripción del sitio',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Email de contacto',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Teléfono de contacto',
    },
    {
      name: 'contactWhatsapp',
      type: 'text',
      label: 'WhatsApp',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Dirección',
    },
    // API Keys (ocultas)
    {
      name: 'apiKeys',
      type: 'group',
      label: 'API Keys',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'serperApiKey',
          type: 'text',
          label: 'Serper API Key',
        },
        {
          name: 'glmApiKey',
          type: 'text',
          label: 'GLM API Key',
        },
        {
          name: 'telegramBotToken',
          type: 'text',
          label: 'Telegram Bot Token',
        },
        {
          name: 'telegramAdminChatId',
          type: 'text',
          label: 'Telegram Admin Chat ID',
        },
      ],
    },
    // Configuración de GLM
    {
      name: 'glmConfig',
      type: 'group',
      label: 'Configuración GLM',
      fields: [
        {
          name: 'model',
          type: 'select',
          options: [
            { label: 'GLM-5', value: 'glm-5' },
            { label: 'GLM-4.7', value: 'glm-4.7' },
            { label: 'GLM-4.6', value: 'glm-4.6' },
          ],
          defaultValue: 'glm-5',
          label: 'Modelo',
        },
        {
          name: 'temperature',
          type: 'number',
          min: 0,
          max: 2,
          defaultValue: 0.7,
          label: 'Temperatura',
        },
        {
          name: 'maxTokens',
          type: 'number',
          min: 100,
          max: 32000,
          defaultValue: 2048,
          label: 'Máximo de tokens',
        },
      ],
    },
    // Límites de API
    {
      name: 'limits',
      type: 'group',
      label: 'Límites de API',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'serperMonthlyLimit',
          type: 'number',
          defaultValue: 5000,
          label: 'Límite mensual Serper',
        },
        {
          name: 'glmMonthlyLimit',
          type: 'number',
          defaultValue: 1000,
          label: 'Límite mensual GLM',
        },
        {
          name: 'currentSerperUsage',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'currentGlmUsage',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'billingPeriodStart',
          type: 'date',
          label: 'Inicio período de facturación',
        },
      ],
    },
    // Configuración de leads
    {
      name: 'leadsConfig',
      type: 'group',
      label: 'Configuración de Leads',
      fields: [
        {
          name: 'autoAssign',
          type: 'checkbox',
          defaultValue: true,
          label: 'Asignación automática',
        },
        {
          name: 'notifyOnNewLead',
          type: 'checkbox',
          defaultValue: true,
          label: 'Notificar nuevos leads',
        },
        {
          name: 'defaultScore',
          type: 'number',
          defaultValue: 50,
          label: 'Score por defecto',
        },
      ],
    },
    // Redes sociales
    {
      name: 'social',
      type: 'group',
      label: 'Redes Sociales',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook' },
        { name: 'instagram', type: 'text', label: 'Instagram' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn' },
        { name: 'youtube', type: 'text', label: 'YouTube' },
      ],
    },
  ],
}
