/**
 * GUARDMAN - Personas Objetivo
 * Perfiles de clientes ideales
 * 
 * Usado para:
 * - Segmentación de leads
 * - Scoring de leads
 * - Contenido personalizado
 */

import type { CollectionConfig } from 'payload'

export const personas: CollectionConfig = {
  slug: 'personas',
  admin: {
    useAsTitle: 'name',
    group: 'Empresa',
    description: 'Personas objetivo (clientes ideales)',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
      admin: {
        description: 'Ej: Administrador de Condominio',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
    {
      name: 'demographics',
      type: 'group',
      label: 'Demografía',
      fields: [
        {
          name: 'ageRange',
          type: 'text',
          label: 'Rango de edad',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Zona típica',
        },
        {
          name: 'incomeLevel',
          type: 'select',
          label: 'Nivel de ingreso',
          options: [
            { label: 'Premium', value: 'premium' },
            { label: 'Alto', value: 'high' },
            { label: 'Medio', value: 'medium' },
            { label: 'Emergente', value: 'emerging' },
          ],
        },
      ],
    },
    {
      name: 'painPoints',
      type: 'relationship',
      relationTo: 'problems',
      hasMany: true,
      label: 'Puntos de Dolor (Problemas)',
      admin: {
        description: 'Problemas estructurales que sufre este cliente (ligados a colección Problems)',
      },
    },
    {
      name: 'needs',
      type: 'array',
      label: 'Necesidades',
      fields: [
        { name: 'need', type: 'text', label: 'Necesidad' },
      ],
    },
    {
      name: 'goals',
      type: 'array',
      label: 'Objetivos',
      fields: [
        { name: 'goal', type: 'text', label: 'Objetivo' },
      ],
    },
    {
      name: 'preferredServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios preferidos',
    },
    {
      name: 'budgetRange',
      type: 'group',
      label: 'Rango de presupuesto',
      fields: [
        { name: 'min', type: 'number', label: 'Mínimo (CLP)' },
        { name: 'max', type: 'number', label: 'Máximo (CLP)' },
      ],
    },
    {
      name: 'decisionTimeline',
      type: 'select',
      label: 'Tiempo de decisión',
      options: [
        { label: 'Inmediato', value: 'immediate' },
        { label: 'Corto (1-2 semanas)', value: 'short' },
        { label: 'Medio (1-3 meses)', value: 'medium' },
        { label: 'Largo (3+ meses)', value: 'long' },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords',
      admin: {
        description: 'Keywords que usa esta persona',
      },
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword' },
      ],
    },
    {
      name: 'relatedIndustries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      label: 'Industrias relacionadas',
    },
    {
      name: 'communication',
      type: 'group',
      label: 'Comunicación',
      fields: [
        {
          name: 'preferredChannel',
          type: 'select',
          label: 'Canal preferido',
          options: [
            { label: 'Teléfono', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Presencial', value: 'in_person' },
          ],
        },
        {
          name: 'tone',
          type: 'select',
          label: 'Tono de comunicación',
          options: [
            { label: 'Formal', value: 'formal' },
            { label: 'Semi-formal', value: 'semi_formal' },
            { label: 'Informal', value: 'informal' },
          ],
        },
      ],
    },
    {
      name: 'scoring',
      type: 'group',
      label: 'Scoring',
      admin: {
        description: 'Puntos base para scoring de leads',
      },
      fields: [
        {
          name: 'baseScore',
          type: 'number',
          defaultValue: 10,
          label: 'Puntos base',
        },
        {
          name: 'urgencyWeight',
          type: 'number',
          defaultValue: 15,
          label: 'Peso de urgencia',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Persona activa',
    },
  ],
}
