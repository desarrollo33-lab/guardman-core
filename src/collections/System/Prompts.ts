import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    useAsTitle: 'identifier',
    group: 'Sistema',
    description: 'Gestión de Prompts modulares para GLM.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'identifier',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador único (ej. "generate_cluster_structure", "write_hero_section").',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Propósito de este prompt.',
      },
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Instrucciones base para la IA (rol, formato, restricciones).',
      },
    },
    {
      name: 'userPromptTemplate',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Template del prompt con variables inyectables (ej. {{location}}, {{service}}).',
      },
    },
    {
      name: 'expectedOutputSchema',
      type: 'json',
      admin: {
        description: 'JSON Schema estricto que se espera recibir de respuesta.',
      },
    },
  ],
}
