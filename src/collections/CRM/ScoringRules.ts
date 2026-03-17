/**
 * GUARDMAN - Reglas de Scoring
 * Pesos configurables para el scoring de leads
 * 
 * Permite ajustar los criterios de calificación sin modificar código
 */

import type { CollectionConfig } from 'payload'

export const scoringRules: CollectionConfig = {
  slug: 'scoring-rules',
  admin: {
    useAsTitle: 'name',
    group: 'CRM',
    description: 'Configura los pesos del scoring de leads',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la regla',
      admin: {
        description: 'Ej: Regla default, Regula premium',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Regla activa',
      admin: {
        description: 'Solo una regla puede estar activa a la vez',
      },
    },
    // Pesos por Persona
    {
      name: 'personaWeights',
      type: 'array',
      label: 'Pesos por Persona',
      admin: {
        description: 'Puntos según el tipo de persona detectada',
      },
      fields: [
        {
          name: 'persona',
          type: 'select',
          label: 'Persona',
          options: [
            { label: 'Presidente Comunidad', value: 'presidente_comunidad' },
            { label: 'Administrador Condominio', value: 'admin_condominio' },
            { label: 'Gerente General', value: 'gerente_general' },
            { label: 'Dueño de Casa', value: 'dueno_casa' },
            { label: 'Encargado Seguridad', value: 'encargado_seguridad' },
            { label: 'Otro', value: 'otro' },
          ],
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 10,
          label: 'Peso',
        },
      ],
    },
    // Pesos por Presupuesto
    {
      name: 'budgetWeights',
      type: 'array',
      label: 'Pesos por Presupuesto',
      fields: [
        {
          name: 'budget',
          type: 'select',
          label: 'Presupuesto',
          options: [
            { label: 'Enterprise', value: 'enterprise' },
            { label: 'Alto', value: 'high' },
            { label: 'Medio', value: 'medium' },
            { label: 'Bajo', value: 'low' },
          ],
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 10,
          label: 'Peso',
        },
      ],
    },
    // Pesos por Urgencia
    {
      name: 'urgencyWeights',
      type: 'array',
      label: 'Pesos por Urgencia',
      fields: [
        {
          name: 'urgency',
          type: 'select',
          label: 'Urgencia',
          options: [
            { label: 'Alta', value: 'high' },
            { label: 'Media', value: 'medium' },
            { label: 'Baja', value: 'low' },
          ],
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 5,
          label: 'Peso',
        },
      ],
    },
    // Calidad del mensaje
    {
      name: 'messageQualityWeight',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 15,
      label: 'Peso por Calidad del Mensaje',
      admin: {
        description: 'Puntos adicionales si el mensaje tiene detalles específicos',
      },
    },
    // Acciones por Score
    {
      name: 'actionThresholds',
      type: 'group',
      label: 'Umbrales de Acción',
      fields: [
        {
          name: 'urgentContact',
          type: 'number',
          defaultValue: 80,
          label: 'Score para Contacto Urgente (≥)',
        },
        {
          name: 'followUp',
          type: 'number',
          defaultValue: 50,
          label: 'Score para Seguimiento (≥)',
        },
        {
          name: 'notQualified',
          type: 'number',
          defaultValue: 30,
          label: 'Score máximo para No Califica (<)',
        },
      ],
    },
  ],
}
