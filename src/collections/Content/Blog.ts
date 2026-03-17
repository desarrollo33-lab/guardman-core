/**
 * GUARDMAN - Blog
 * Artículos y contenido del blog
 */

import type { CollectionConfig } from 'payload'

export const blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    description: 'Artículos del blog',
    listSearchableFields: ['title', 'slug', 'category', 'status'],
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
      admin: {
        placeholder: 'Título del artículo...',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Ej: como-elegir-servicio-seguridad',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Extracto',
      admin: {
        description: 'Breve descripción para tarjetas y SEO (160 caracteres)',
        rows: 3,
      },
    },

    // ===================================================================
    // CONTENIDO
    // ===================================================================
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen Destacada',
    },

    // ===================================================================
    // CATEGORIZACIÓN
    // ===================================================================
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      options: [
        { label: '💡 Consejos de Seguridad', value: 'security-tips' },
        { label: '📰 Noticias', value: 'news' },
        { label: '🏆 Casos de Éxito', value: 'case-studies' },
        { label: '📖 Guías', value: 'guides' },
        { label: '🔒 Seguridad Empresarial', value: 'business-security' },
        { label: '🏠 Seguridad Residencial', value: 'home-security' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Etiquetas',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta',
        },
      ],
    },

    // ===================================================================
    // RELACIONES
    // ===================================================================
    {
      name: 'relatedLocations',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      label: 'Comunas relacionadas',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios relacionados',
    },
    {
      name: 'relatedProblems',
      type: 'relationship',
      relationTo: 'problems',
      hasMany: true,
      label: 'Problemas relacionados',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autor',
    },

    // ===================================================================
    // SEO
    // ===================================================================
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
            description: 'Título para SEO (60 caracteres máx)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Descripción para SEO (160 caracteres máx)',
          },
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
    // ESTADO
    // ===================================================================
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: '📝 Borrador', value: 'draft' },
        { label: '📌 Revision', value: 'review' },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Artículo destacado',
    },

    // ===================================================================
    // METADATA
    // ===================================================================
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Tiempo de lectura (minutos)',
      admin: {
        description: 'Tiempo estimado de lectura',
      },
    },
  ],
}
