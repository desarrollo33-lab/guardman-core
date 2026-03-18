/**
 * GUARDMAN - Soluciones
 * Soluciones específicas para cada necesidad
 * 
 * Usado para:
 * - Página de soluciones (/soluciones/)
 * - Paquetes de servicios
 * - SEO especializado
 */

import type { CollectionConfig } from 'payload'

export const solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    group: 'Empresa',
    description: 'Soluciones específicas para cada necesidad',
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
      label: 'Título de la Solución',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descripción Corta',
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
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen',
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      label: 'Industria',
    },
    {
      name: 'targetPersonas',
      type: 'relationship',
      relationTo: 'personas',
      hasMany: true,
      label: 'Personas objetivo',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios incluidos',
    },
    {
      name: 'includes',
      type: 'array',
      label: 'Incluye',
      fields: [
        { name: 'item', type: 'text', label: 'Incluye' },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Beneficios',
      fields: [
        { name: 'benefit', type: 'text', label: 'Beneficio' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Precio',
      fields: [
        { name: 'min', type: 'number', label: 'Precio mínimo (CLP)' },
        { name: 'max', type: 'number', label: 'Precio máximo (CLP)' },
        {
          name: 'billingPeriod',
          type: 'select',
          label: 'Período',
          options: [
            { label: 'Por mes', value: 'month' },
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
      label: 'Palabras Clave',
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword' },
      ],
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
      label: 'Solución Destacada',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Solución activa',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
  ],
}
