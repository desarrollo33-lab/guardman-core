import type { GlobalConfig } from 'payload'

export const BrandDNA: GlobalConfig = {
  slug: 'brand-dna',
  label: 'Brand DNA',
  admin: {
    group: 'Sistema',
    description:
      'ADN de la marca, Asset Visuales (Logo/Favicon), Reglas para IA y Configuración de Negocio Local.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Identity',
          fields: [
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Descripción del Sitio',
              admin: { description: 'Meta description para SEO global' },
            },
            {
              type: 'row',
              fields: [
                { name: 'companyName', type: 'text', required: true, admin: { width: '33%' } },
                { name: 'legalName', type: 'text', admin: { width: '33%' } },
                { name: 'rut', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              name: 'toneOfVoice',
              type: 'textarea',
              required: true,
              defaultValue: 'B2B, profesional, persuasivo, no alarmista',
              admin: { description: 'Tono de voz que la IA debe usar (Ej: "B2B, profesional").' },
            },
            {
              name: 'coreDifferentiators',
              type: 'array',
              required: true,
              labels: {
                singular: 'Differentiator',
                plural: 'Differentiators',
              },
              fields: [{ name: 'differentiator', type: 'text', required: true }],
              admin: { description: 'Propuestas de valor clave (ej. "GuardPod autónomo").' },
            },
            {
              name: 'strictRules',
              type: 'array',
              required: true,
              labels: {
                singular: 'Rule',
                plural: 'Rules',
              },
              fields: [{ name: 'rule', type: 'text', required: true }],
              admin: { description: 'Reglas invariables para GLM (ej. "Siempre nombrar OS-10").' },
            },
          ],
        },
        {
          label: 'Brand Assets (GBP)',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            {
              name: 'colorPalette',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'primary', type: 'text', admin: { width: '33%' } },
                    { name: 'secondary', type: 'text', admin: { width: '33%' } },
                    { name: 'accent', type: 'text', admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & Location (GBP)',
          fields: [
            { name: 'headquartersAddress', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'latitude', type: 'number', admin: { width: '50%' } },
                { name: 'longitude', type: 'number', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'primaryPhone', type: 'text', admin: { width: '33%' } },
                { name: 'whatsappNumber', type: 'text', admin: { width: '33%' } },
                { name: 'supportEmail', type: 'email', admin: { width: '33%' } },
              ],
            },
            {
              name: 'businessHours',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      type: 'select',
                      options: [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ],
                      required: true,
                    },
                    { name: 'openTime', type: 'text', admin: { description: 'ej: 09:00' } },
                    { name: 'closeTime', type: 'text', admin: { description: 'ej: 18:00' } },
                    { name: 'closed', type: 'checkbox' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'https://facebook.com/...' },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'https://instagram.com/...' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'https://linkedin.com/company/...' },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'https://youtube.com/...' },
                },
              ],
            },
          ],
        },
        {
          label: 'API Config',
          fields: [
            {
              name: 'glmConfig',
              type: 'group',
              label: 'Configuración GLM',
              fields: [
                {
                  name: 'model',
                  type: 'select',
                  label: 'Modelo',
                  options: [
                    { label: 'GLM-5', value: 'glm-5' },
                    { label: 'GLM-4', value: 'glm-4' },
                  ],
                  defaultValue: 'glm-5',
                },
                {
                  name: 'temperature',
                  type: 'number',
                  label: 'Temperature',
                  defaultValue: 0.7,
                  min: 0,
                  max: 1,
                },
                {
                  name: 'maxTokens',
                  type: 'number',
                  label: 'Max Tokens',
                  defaultValue: 2048,
                },
              ],
            },
            {
              name: 'limits',
              type: 'group',
              label: 'Límites',
              fields: [
                {
                  name: 'monthlySerperQuota',
                  type: 'number',
                  label: 'Cuota mensual Serper',
                  defaultValue: 2000,
                },
                {
                  name: 'monthlyGLMQuota',
                  type: 'number',
                  label: 'Cuota mensual GLM',
                  defaultValue: 500,
                },
              ],
            },
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
                  name: 'notifyTelegram',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Notificar por Telegram',
                },
                {
                  name: 'scoringEnabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Scoring automático con IA',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
