/**
 * GUARDMAN - Barrios/Urbanizaciones
 * Barrios dentro de las comunas
 *
 * Usado para:
 * - Contenido más específico (/seguridad-las-condes-las-bodegas/)
 * - Testimonios por barrio
 */

import type { CollectionConfig } from 'payload'

import { enrichNeighborhoodAfterChange } from '../../hooks/neighborhoods/enrichNeighborhood'

export const neighborhoods: CollectionConfig = {
  slug: 'neighborhoods',
  admin: {
    useAsTitle: 'name',
    group: 'Geografía',
    description: 'Barrios y urbanizaciones dentro de las comunas',
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
      label: 'Nombre del Barrio',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
      label: 'Comuna',
      admin: {
        description: 'Comuna a la que pertenece este barrio',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'characteristics',
      type: 'textarea',
      label: 'Características',
      admin: {
        description: 'Tipo de barrio: residencial, comercial, industrial, etc.',
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Coordenadas',
      fields: [
        { name: 'lat', type: 'number', label: 'Latitud' },
        { name: 'lng', type: 'number', label: 'Longitud' },
      ],
    },
    {
      name: 'mainKeywords',
      type: 'array',
      label: 'Palabras Clave',
      fields: [{ name: 'keyword', type: 'text', label: 'Keyword' }],
    },
    {
      name: 'priorityScore',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      label: 'Prioridad SEO (0-100)',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Barrio activo',
    },
  ],

  hooks: {
    afterChange: [enrichNeighborhoodAfterChange],
  },
}
