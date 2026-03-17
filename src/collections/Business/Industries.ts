/**
 * GUARDMAN - Industrias
 * Industrias que atienden los servicios de seguridad
 * 
 * Usado para:
 * - Página de industrias (/industrias/)
 * - SEO por industria
 * - Casos de éxito
 */

import type { CollectionConfig } from 'payload'

export const industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    group: 'Negocio',
    description: 'Industrias que atendemos',
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
      label: 'Nombre de la Industria',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
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
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios relacionados',
    },
    {
      name: 'targetPersonas',
      type: 'array',
      label: 'Personas objetivo',
      admin: {
        description: 'Roles típicos en esta industria',
      },
      fields: [
        { name: 'persona', type: 'text', label: 'Persona' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Características de seguridad',
      fields: [
        { name: 'feature', type: 'text', label: 'Característica' },
      ],
    },
    {
      name: 'statistics',
      type: 'group',
      label: 'Estadísticas',
      admin: {
        description: 'Datos para contenido SEO',
      },
      fields: [
        {
          name: 'marketSize',
          type: 'text',
          label: 'Tamaño del mercado',
        },
        {
          name: 'growthRate',
          type: 'text',
          label: 'Tasa de crecimiento',
        },
        {
          name: 'mainRisks',
          type: 'array',
          label: 'Principales riesgos',
          fields: [
            { name: 'risk', type: 'text', label: 'Riesgo' },
          ],
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
      name: 'caseStudy',
      type: 'relationship',
      relationTo: 'blog',
      label: 'Caso de éxito',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Industria activa',
    },
    // SEO
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
