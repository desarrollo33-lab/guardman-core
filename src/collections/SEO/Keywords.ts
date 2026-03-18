/**
 * GUARDMAN - Keywords
 * Keywords clusterizadas y analizadas para SEO
 *
 * Tipos de keywords:
 * - location: Comuna (las condes)
 * - service: Servicio (guardias seguridad)
 * - service-location: Servicio+Comuna (guardias las condes)
 * - long-tail: Keywords larga cola
 */

import type { CollectionConfig } from 'payload'
import { enrichKeywordAfterChange } from '../../hooks/keywords/enrichKeyword'

export const keywords: CollectionConfig = {
  slug: 'keywords',
  admin: {
    useAsTitle: 'keyword',
    group: 'Marketing',
    description: 'Keywords para SEO',
    listSearchableFields: ['keyword', 'type', 'cluster'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ===================================================================
    // KEYWORD PRINCIPAL
    // ===================================================================
    {
      name: 'keyword',
      type: 'text',
      required: true,
      label: 'Keyword',
      admin: {
        placeholder: 'Ej: guardias de seguridad santiago',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo',
      options: [
        { label: '📍 Comuna', value: 'location' },
        { label: '🛠️ Servicio', value: 'service' },
        { label: '📍+🛠️ Servicio+Comuna', value: 'service-location' },
        { label: '🔍 Problema+Comuna', value: 'problem-location' },
        { label: '📝 Long-tail', value: 'long-tail' },
      ],
    },

    // ===================================================================
    // RELACIONES
    // ===================================================================
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Comuna',
      admin: {
        condition: (data) =>
          ['location', 'service-location', 'problem-location'].includes(data.type),
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Servicio',
      admin: {
        condition: (data) => ['service', 'service-location'].includes(data.type),
      },
    },
    {
      name: 'problem',
      type: 'relationship',
      relationTo: 'problems',
      label: 'Problema',
      admin: {
        condition: (data) => data.type === 'problem-location',
      },
    },

    // ===================================================================
    // CLUSTERING
    // ===================================================================
    {
      name: 'cluster',
      type: 'text',
      label: 'Cluster',
      admin: {
        description: 'Grupo de keywords relacionadas',
      },
    },
    {
      name: 'relatedKeywords',
      type: 'array',
      label: 'Keywords Relacionadas',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Keyword',
        },
        {
          name: 'intent',
          type: 'select',
          label: 'Intención',
          options: [
            { label: 'Informacional', value: 'informational' },
            { label: 'Comercial', value: 'commercial' },
            { label: 'Transaccional', value: 'transactional' },
          ],
        },
      ],
    },

    // ===================================================================
    // INTENTO DE BÚSQUEDA
    // ===================================================================
    {
      name: 'intent',
      type: 'select',
      label: 'Intención de Búsqueda',
      options: [
        { label: '🔎 Informacional', value: 'informational' },
        { label: '💼 Comercial', value: 'commercial' },
        { label: '💳 Transaccional', value: 'transactional' },
      ],
    },

    // ===================================================================
    // MÉTRICAS DE SERPER
    // ===================================================================
    {
      name: 'serperMetrics',
      type: 'group',
      label: 'Métricas de Serper',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'resultCount',
          type: 'number',
          label: 'Resultados encontrados',
        },
        {
          name: 'adsCount',
          type: 'number',
          label: 'Anuncios',
        },
        {
          name: 'topCompetitors',
          type: 'array',
          label: 'Principales competidores',
          fields: [
            { name: 'competitor', type: 'text', label: 'Competidor' },
            { name: 'position', type: 'number', label: 'Posición' },
          ],
        },
        {
          name: 'searchedAt',
          type: 'date',
          label: 'Última búsqueda',
        },
      ],
    },

    // ===================================================================
    // ANÁLISIS GLM
    // ===================================================================
    {
      name: 'glmAnalysis',
      type: 'group',
      label: 'Análisis GLM',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'difficulty',
          type: 'number',
          min: 0,
          max: 100,
          label: 'Dificultad (0-100)',
        },
        {
          name: 'volume',
          type: 'select',
          label: 'Volumen estimado',
          options: [
            { label: 'Alto', value: 'high' },
            { label: 'Medio', value: 'medium' },
            { label: 'Bajo', value: 'low' },
          ],
        },
        {
          name: 'opportunity',
          type: 'select',
          label: 'Oportunidad',
          options: [
            { label: 'Alta', value: 'high' },
            { label: 'Media', value: 'medium' },
            { label: 'Baja', value: 'low' },
          ],
        },
        {
          name: 'recommendedUrl',
          type: 'text',
          label: 'URL recomendada',
        },
        {
          name: 'analyzedAt',
          type: 'date',
          label: 'Fecha de análisis',
        },
      ],
    },

    // ===================================================================
    // CONFIGURACIÓN
    // ===================================================================
    {
      name: 'isTracked',
      type: 'checkbox',
      defaultValue: false,
      label: 'Rastrear posiciones',
    },
    {
      name: 'targetPosition',
      type: 'number',
      defaultValue: 10,
      label: 'Posición objetivo',
    },
    {
      name: 'currentPosition',
      type: 'number',
      admin: {
        readOnly: true,
      },
      label: 'Posición actual',
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridad',
      options: [
        { label: '🔴 Alta', value: 'high' },
        { label: '🟡 Media', value: 'medium' },
        { label: '🟢 Baja', value: 'low' },
      ],
      defaultValue: 'medium',
    },

    // ===================================================================
    // PÁGINA ASOCIADA
    // ===================================================================
    {
      name: 'seoPage',
      type: 'relationship',
      relationTo: 'seo-pages',
      label: 'Página SEO asociada',
    },

    // ===================================================================
    // METADATA
    // ===================================================================
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [enrichKeywordAfterChange],
  },
}
