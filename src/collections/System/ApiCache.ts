import type { CollectionConfig } from 'payload'

export const ApiCache: CollectionConfig = {
  slug: 'api-cache',
  admin: {
    useAsTitle: 'cacheKey',
    group: 'Sistema',
    description: 'Memoria Global: Interceptor de Peticiones a APIs Externas para ahorrar costos.',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => false, // Only system creates it programmatically
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'cacheKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'La clave de caché, por ejemplo el Hash del prompt GLM o el query de Serper.',
      },
    },
    {
      name: 'service',
      type: 'select',
      required: true,
      options: ['serper', 'glm'],
      admin: { readOnly: true },
    },
    {
      name: 'response',
      type: 'json',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
