import type { GlobalConfig } from 'payload'

export const BrandDNA: GlobalConfig = {
  slug: 'brand-dna',
  label: 'Brand DNA',
  admin: {
    group: 'Sistema',
    description: 'ADN de la marca, Asset Visuales (Logo/Favicon), Reglas para IA y Configuración de Negocio Local.',
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
      ],
    },
  ],
}
