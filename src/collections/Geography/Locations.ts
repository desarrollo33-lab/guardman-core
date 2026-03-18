/**
 * GUARDMAN - Localidades (Comunas)
 * Comunas de la Región Metropolitana de Santiago
 *
 * Usado para:
 * - SEO geolocalizado (/seguridad-las-condes/)
 * - Filtrar contenido por zona
 * - Asignar leads a vendedores por zona
 */

import type { CollectionConfig } from 'payload'
import { triggerAsyncEnrichment } from '../../hooks/locations/triggerAsyncEnrichment'

export const locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    group: 'Geografía',
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Ej: las-condes, providencia, santiago-centro',
      },
    },
    {
      name: 'region',
      type: 'select',
      options: [{ label: 'Región Metropolitana', value: 'rm' }],
      defaultValue: 'rm',
      label: 'Región',
    },
    {
      name: 'geoZone',
      type: 'select',
      required: true,
      label: 'Zona Geográfica',
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
        description: 'Define el foco transaccional B2B (Ej. Huechuraba = Industrial).',
      }
    },
    {
      name: 'decisionBuyerLocation',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Ubicación del Buyer Persona (Cross-Location Intent)',
      admin: {
        description: 'Ej: Para Seguridad Industrial en San Bernardo, el Dueño/Buyer vive y busca desde Vitacura.',
      }
    },
    {
      name: 'autoEnrich',
      type: 'checkbox',
      label: 'Auto-Enrich con IA',
      defaultValue: false,
      admin: {
        description: 'Al marcar y guardar, se dispara el pipeline asíncrono de Serper y GLM.',
      }
    },
    {
      name: 'characteristics',
      type: 'textarea',
      label: 'Características',
      admin: {
        description: 'Descripción de la comuna para contenido SEO',
      },
    },
    {
      name: 'population',
      type: 'number',
      label: 'Población',
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Coordenadas',
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
        description: 'Keywords principales para SEO de esta comuna',
      },
      fields: [{ name: 'keyword', type: 'text', label: 'Keyword' }],
    },
    {
      name: 'serviceAreas',
      type: 'array',
      label: 'Áreas de servicio',
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
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Comuna activa',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Título para SEO (si está vacío usa el nombre)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Descripción para SEO',
          },
        },
      ],
    },
    {
      name: 'enrichButton',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '/components/EnrichButton',
            exportName: 'EnrichButton',
          },
        },
      },
    },
  ],

  hooks: {
    afterChange: [triggerAsyncEnrichment],
  },
}
