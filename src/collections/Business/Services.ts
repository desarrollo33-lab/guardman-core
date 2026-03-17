/**
 * GUARDMAN - Servicios
 * Catálogo de servicios de seguridad ofrecidos
 * 
 * Usado para:
 * - Página de servicios (/servicios/)
 * - SEO por servicio (/guardias-de-seguridad/)
 * - Filtrar leads por servicio
 */

import type { CollectionConfig } from 'payload'

export const services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Negocio',
    description: 'Servicios de seguridad ofrecidos',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre del Servicio',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Ej: guardias-de-seguridad, monitoreo-24-7',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descripción Corta',
      admin: {
        description: 'Descripción breve para tarjetas y listados',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción Completa',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icono (emoji)',
      admin: {
        description: 'Emoji para mostrar en tarjetas',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen Destacada',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Características',
      admin: {
        description: 'Características del servicio',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Característica',
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Beneficios',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          label: 'Beneficio',
        },
      ],
    },
    {
      name: 'priceRange',
      type: 'group',
      label: 'Rango de Precios',
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
          label: 'Período de facturación',
          options: [
            { label: 'Por mes', value: 'month' },
            { label: 'Por turno', value: 'shift' },
            { label: 'Por hora', value: 'hour' },
            { label: 'Por servicio', value: 'service' },
          ],
        },
        {
          name: 'hidePrice',
          type: 'checkbox',
          defaultValue: false,
          label: 'Ocultar precio',
        },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Palabras Clave SEO',
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword' },
      ],
    },
    {
      name: 'relatedLocations',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      label: 'Comunas donde está disponible',
    },
    {
      name: 'relatedIndustries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      label: 'Industrias relacionadas',
    },
    {
      name: 'relatedProblems',
      type: 'relationship',
      relationTo: 'problems',
      hasMany: true,
      label: 'Problemas que resuelve',
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Preguntas Frecuentes',
      fields: [
        { name: 'question', type: 'text', label: 'Pregunta' },
        { name: 'answer', type: 'textarea', label: 'Respuesta' },
      ],
    },
    {
      name: 'isHighlighted',
      type: 'checkbox',
      defaultValue: false,
      label: 'Servicio Destacado',
      admin: {
        description: 'Mostrar en página principal',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Servicio activo',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden de visualización',
      admin: {
        description: 'Menor número = aparece primero',
      },
    },
    // SEO fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
}
