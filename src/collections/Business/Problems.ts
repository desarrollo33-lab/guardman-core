/**
 * GUARDMAN - Problemas SEO
 * Problemas de seguridad que buscan los clientes
 * 
 * Usado para:
 * - Keyword research
 * - Generación de páginas SEO
 * - Contenido del blog
 */

import type { CollectionConfig } from 'payload'

export const problems: CollectionConfig = {
  slug: 'problems',
  admin: {
    useAsTitle: 'name',
    group: 'Negocio',
    description: 'Problemas de seguridad que buscan los clientes (keywords SEO)',
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
      label: 'Nombre del Problema',
      admin: {
        description: 'Ej: Robos en condominios, Falta de seguridad',
      },
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
      admin: {
        description: 'Descripción del problema para contenido SEO',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios que lo resuelven',
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords SEO',
      admin: {
        description: 'Palabras clave relacionadas con este problema',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Keyword',
        },
        {
          name: 'intent',
          type: 'select',
          label: 'Intención de búsqueda',
          options: [
            { label: 'Informacional', value: 'informational' },
            { label: 'Comercial', value: 'commercial' },
            { label: 'Transaccional', value: 'transactional' },
          ],
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
      ],
    },
    {
      name: 'painPoints',
      type: 'array',
      label: 'Puntos de Dolor',
      admin: {
        description: 'Por qué el cliente busca este servicio',
      },
      fields: [
        { name: 'painPoint', type: 'text', label: 'Punto de dolor' },
      ],
    },
    {
      name: 'serperData',
      type: 'group',
      label: 'Datos de Serper',
      admin: {
        hidden: true,
        description: 'Datos obtenidos de la API de Serper',
      },
      fields: [
        { name: 'newsCount', type: 'number', label: 'Noticias encontradas' },
        { name: 'searchVolume', type: 'number', label: 'Volumen de búsqueda' },
        {
          name: 'trending',
          type: 'select',
          label: 'Tendencia',
          options: [
            { label: 'En Auge', value: 'rising' },
            { label: 'Estable', value: 'stable' },
            { label: 'Declinando', value: 'declining' },
          ],
        },
        { name: 'lastChecked', type: 'date', label: 'Última verificación' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Problema activo',
    },
  ],
}
