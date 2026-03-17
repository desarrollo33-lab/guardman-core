/**
 * GUARDMAN - Testimonios
 * Testimonios de clientes para mostrar en el sitio
 */

import type { CollectionConfig } from 'payload'

export const testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    group: 'SEO',
    description: 'Testimonios de clientes',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ===================================================================
    // DATOS DEL CLIENTE
    // ===================================================================
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Nombre del Cliente',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Empresa/Condominio',
      admin: {
        placeholder: 'Ej: Condominio Los Robles',
      },
    },
    {
      name: 'position',
      type: 'text',
      label: 'Cargo',
      admin: {
        placeholder: 'Ej: Presidente de Comunidad',
      },
    },

    // ===================================================================
    // TESTIMONIO
    // ===================================================================
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      label: 'Testimonio',
      admin: {
        rows: 5,
        placeholder: 'Escribe el testimonio del cliente...',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Rating',
    },

    // ===================================================================
    // RELACIONES (para contexto)
    // ===================================================================
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Comuna',
    },
    {
      name: 'neighborhood',
      type: 'relationship',
      relationTo: 'neighborhoods',
      label: 'Barrio',
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Servicio Contratado',
      hasMany: true,
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      label: 'Industria',
    },

    // ===================================================================
    // MULTIMEDIA
    // ===================================================================
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto del Cliente',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL de Video (YouTube/Vimeo)',
      admin: {
        placeholder: 'https://youtube.com/watch?v=...',
      },
    },

    // ===================================================================
    // CONFIGURACIÓN
    // ===================================================================
    {
      name: 'isApproved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Aprobado',
      admin: {
        description: 'Solo mostrar testimonios aprobados',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        description: 'Mostrar en página principal',
      },
    },

    // ===================================================================
    // SEO
    // ===================================================================
    {
      name: 'useInHomepage',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar en homepage',
    },
    {
      name: 'useInLocationPages',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar en páginas de comunas',
    },

    // ===================================================================
    // ORDEN
    // ===================================================================
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden de visualización',
      admin: {
        description: 'Menor número = aparece primero',
      },
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
  ],
}
