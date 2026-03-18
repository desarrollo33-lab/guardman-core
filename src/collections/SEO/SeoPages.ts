/**
 * GUARDMAN - Páginas SEO
 * Páginas SEO geolocalizadas generadas automáticamente
 *
 * Tipos de página:
 * - location: Página de comuna (/seguridad-las-condes/)
 * - service: Página de servicio (/guardias-de-seguridad/)
 * - service-location: Servicio en comuna (/guardias-las-condes/)
 * - problem-location: Problema en comuna
 */

import type { CollectionConfig } from 'payload'

import { generateSEOCache } from '../../hooks/seoPages/generateSEOCache'

export const seoPages: CollectionConfig = {
  slug: 'seo-pages',
  admin: {
    useAsTitle: 'title',
    group: 'Marketing',
    description: 'Páginas SEO geolocalizadas',
    listSearchableFields: ['title', 'slug', 'pageType', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ===================================================================
    // IDENTIFICACIÓN
    // ===================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Ej: seguridad-las-condes-guardias',
      },
    },

    // ===================================================================
    // TIPO DE PÁGINA
    // ===================================================================
    {
      name: 'pageType',
      type: 'select',
      required: true,
      label: 'Tipo de Página',
      options: [
        { label: '📍 Comuna', value: 'location' },
        { label: '🛠️ Servicio', value: 'service' },
        { label: '🏭 Industria', value: 'industry' },
        { label: '👤 Persona', value: 'persona' },
        { label: '📍+🛠️ Servicio + Comuna', value: 'service-location' },
        { label: '📍+🏭 Industria + Comuna', value: 'industry-location' },
        { label: '📍+👤 Persona + Comuna', value: 'persona-location' },
        { label: '📄 Problema + Comuna', value: 'problem-location' },
      ],
    },
    {
      name: 'clusterRole',
      type: 'select',
      label: 'Rol en el Clúster',
      options: [
        { label: 'Hub (Pillar Page)', value: 'hub' },
        { label: 'Spoke (Cluster)', value: 'spoke' },
        { label: 'Local Bottom-Funnel', value: 'local_bottom_funnel' },
      ],
      admin: {
        description: 'Clasificación estructural dentro del Topic Cluster.',
      }
    },

    // ===================================================================
    // RELACIONES
    // ===================================================================
    {
      name: 'parentHub',
      type: 'relationship',
      relationTo: 'seo-pages',
      label: 'Página Hub (Pillar Page)',
      admin: {
        description: 'Define la página padre a la que apunta y pertenece.',
      }
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Comuna',
      admin: {
        condition: (data) =>
          [
            'location',
            'service-location',
            'industry-location',
            'persona-location',
            'problem-location',
          ].includes(data.pageType),
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Servicio',
      admin: {
        condition: (data) => ['service', 'service-location'].includes(data.pageType),
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      label: 'Industria',
      admin: {
        condition: (data) => ['industry', 'industry-location'].includes(data.pageType),
      },
    },
    {
      name: 'persona',
      type: 'relationship',
      relationTo: 'personas',
      label: 'Persona',
      admin: {
        condition: (data) => ['persona', 'persona-location'].includes(data.pageType),
      },
    },
    {
      name: 'targetPersona',
      type: 'relationship',
      relationTo: 'personas',
      label: 'Persona Objetivo (Target Intent)',
      admin: {
        description: 'El tomador de decisiones o Buyer Persona al que apunta el contenido B2B.',
      }
    },
    {
      name: 'problem',
      type: 'relationship',
      relationTo: 'problems',
      label: 'Problema',
      admin: {
        condition: (data) => data.pageType === 'problem-location',
      },
    },

    // ===================================================================
    // SEO METADATA
    // ===================================================================
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Metadata',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Título para搜索引擎 (60 caracteres máx)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Descripción para搜索引擎 (160 caracteres máx)',
          },
        },
        {
          name: 'h1',
          type: 'text',
          label: 'H1 Principal',
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
        },
      ],
    },

    // ===================================================================
    // CONTENIDO
    // ===================================================================
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Subheadline',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Texto del CTA',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Link del CTA',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de fondo',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido Principal',
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Puntos Destacados',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Texto',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icono',
        },
      ],
    },

    // ===================================================================
    // PRECIOS
    // ===================================================================
    {
      name: 'priceRange',
      type: 'group',
      label: 'Rango de Precios',
      admin: {
        condition: (data) => ['service', 'service-location'].includes(data.pageType),
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          label: 'Precio mínimo (CLP)',
        },
        {
          name: 'max',
          type: 'number',
          label: 'Precio máximo (CLP)',
        },
        {
          name: 'billingPeriod',
          type: 'select',
          label: 'Período',
          options: [
            { label: 'Por mes', value: 'month' },
            { label: 'Por servicio', value: 'service' },
            { label: 'Por turno', value: 'shift' },
          ],
        },
        {
          name: 'hidePrice',
          type: 'checkbox',
          defaultValue: false,
          label: 'Ocultar precios',
        },
      ],
    },

    // ===================================================================
    // FAQ
    // ===================================================================
    {
      name: 'faq',
      type: 'array',
      label: 'Preguntas Frecuentes',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Pregunta',
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Respuesta',
        },
      ],
    },

    // ===================================================================
    // TESTIMONIOS
    // ===================================================================
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Testimonios',
    },

    // ===================================================================
    // DATOS DE IA
    // ===================================================================
    {
      name: 'glmGenerated',
      type: 'checkbox',
      label: 'Generado por GLM',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'serperEnriched',
      type: 'checkbox',
      label: 'Enriquecido con Serper',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'glmAnalysis',
      type: 'group',
      label: 'Análisis GLM',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'score',
          type: 'number',
          label: 'Score SEO',
        },
        {
          name: 'opportunities',
          type: 'array',
          fields: [{ name: 'opportunity', type: 'text' }],
        },
        {
          name: 'recommendedKeywords',
          type: 'array',
          fields: [{ name: 'keyword', type: 'text' }],
        },
      ],
    },

    // ===================================================================
    // ESTADO Y PRIORIDAD
    // ===================================================================
    {
      name: 'glmGenerationStatus',
      type: 'select',
      label: 'Estado de Generación IA',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Generando...', value: 'generating' },
        { label: 'Requiere Revisión', value: 'review_needed' },
        { label: 'Publicado', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'priorityScore',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      label: 'Prioridad SEO (0-100)',
      admin: {
        description: 'Mayor número = más importante para generar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: '📝 Borrador', value: 'draft' },
        { label: '✅ Publicado', value: 'published' },
        { label: '📦 Archivado', value: 'archived' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },

    // ===================================================================
    // SCHEMA
    // ===================================================================
    {
      name: 'schemaMarkup',
      type: 'json',
      label: 'Schema.org JSON-LD',
      admin: {
        description: 'Schema markup personalizado',
      },
    },
  ],

  // Hooks para generación automática
  hooks: {
    afterChange: [generateSEOCache],
  },
}
