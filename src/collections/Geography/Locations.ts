import type { CollectionConfig } from 'payload'
import { triggerAsyncEnrichment } from '../../hooks/locations/triggerAsyncEnrichment'

export const locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    group: 'Marketing',
    description: 'Comunas de la Región Metropolitana',
    listSearchableFields: ['name', 'slug', 'geoZone'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la Comuna',
      admin: {
        description: 'Ingresa el nombre y guarda para generar contenido automáticamente',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Se genera automáticamente desde el nombre',
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'Región Metropolitana', value: 'rm' },
        { label: 'Región de Valparaíso', value: 'valparaiso' },
      ],
      defaultValue: 'rm',
      label: 'Región',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'geoZone',
      type: 'select',
      label: 'Zona Geográfica',
      defaultValue: 'oriente',
      options: [
        { label: 'Zona Oriente', value: 'oriente' },
        { label: 'Zona Nororiente', value: 'nororiente' },
        { label: 'Zona Norte', value: 'norte' },
        { label: 'Zona Poniente', value: 'poniente' },
        { label: 'Zona Suroriente', value: 'suroriente' },
        { label: 'Zona Sur', value: 'sur' },
        { label: 'Zona Centro', value: 'centro' },
        { label: 'Valle de Aconcagua', value: 'aconcagua' },
      ],
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'tier',
      type: 'select',
      label: 'Nivel Socioeconómico',
      options: [
        { label: 'Premium (ABC1)', value: 'premium' },
        { label: 'Alto (C1a)', value: 'high' },
        { label: 'Medio (C1b-C2)', value: 'medium' },
        { label: 'Emergente (C3-D)', value: 'emerging' },
      ],
      defaultValue: 'medium',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'economicDriver',
      type: 'select',
      label: 'Motor Económico (Value-Based Tiering)',
      options: [
        { label: 'Industrial (Alto Valor B2B)', value: 'industrial' },
        { label: 'Corporativo Premium', value: 'corporativo_premium' },
        { label: 'Comercial de Alta Densidad', value: 'comercial_alta_densidad' },
        { label: 'Residencial Premium', value: 'residencial_premium' },
        { label: 'Mixto Masivo', value: 'mixto_masivo' },
      ],
      admin: {
        description: 'Se genera automáticamente con IA',
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'decisionBuyerLocation',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Ubicación del Buyer Persona',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'enrichmentStatus',
      type: 'select',
      label: 'Estado de Generación IA',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Generando...', value: 'in_progress' },
        { label: 'Completado', value: 'completed' },
        { label: 'Error', value: 'failed' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        description: 'Estado del pipeline de generación de contenido',
      },
    },
    {
      name: 'characteristics',
      type: 'textarea',
      label: 'Características',
      admin: {
        description: 'Se genera automáticamente con IA',
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'population',
      type: 'number',
      label: 'Población',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Coordenadas',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Latitud',
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Longitud',
        },
      ],
    },
    {
      name: 'mainKeywords',
      type: 'array',
      label: 'Palabras Clave Principales',
      admin: {
        description: 'Se genera automáticamente con IA',
        condition: (data) => data.enrichmentStatus === 'completed',
      },
      fields: [{ name: 'keyword', type: 'text', label: 'Keyword' }],
    },
    {
      name: 'serviceAreas',
      type: 'array',
      label: 'Áreas de servicio',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
      fields: [{ name: 'area', type: 'text', label: 'Área' }],
    },
    {
      name: 'priorityScore',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      label: 'Prioridad SEO (0-100)',
      admin: {
        description: 'Mayor número = más importante para SEO',
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Comuna activa',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        condition: (data) => data.enrichmentStatus === 'completed',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Se genera automáticamente con IA',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Se genera automáticamente con IA',
          },
        },
      ],
    },
  ],

  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create' && data?.name) {
          if (!data.slug) {
            data.slug = data.name
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          }
          data.enrichmentStatus = 'pending'
        }
        return data
      },
    ],
    afterChange: [triggerAsyncEnrichment],
  },
}
