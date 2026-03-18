import type { CollectionConfig } from 'payload'

export const EnrichmentHistory: CollectionConfig = {
  slug: 'enrichment-history',
  admin: {
    useAsTitle: 'sourceId',
    group: 'Sistema',
    description: 'Registro de auditoría de todas las interacciones con APIs (Serper, GLM).',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => false, // Only system creates it programmatically
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'sourceCollection',
      type: 'select',
      options: ['locations', 'services', 'problems', 'seo-pages'],
      admin: { readOnly: true },
    },
    { name: 'sourceId', type: 'text', admin: { readOnly: true } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SERPER Data',
          fields: [
            { name: 'serperRawData', type: 'json' },
          ],
        },
        {
          label: 'GLM Data',
          fields: [
            { name: 'glmPromptIdentifier', type: 'relationship', relationTo: 'prompts' },
            { name: 'glmResponse', type: 'json' },
            { name: 'tokensUsed', type: 'number' },
          ],
        },
        {
          label: 'System Status',
          fields: [
            { name: 'wasSuccessful', type: 'checkbox', defaultValue: false },
            { name: 'errorMessage', type: 'text' },
          ],
        },
      ],
    },
  ],
}
