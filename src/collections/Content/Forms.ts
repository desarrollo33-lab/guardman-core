/**
 * GUARDMAN - Form Builder
 * Configuración de formularios dinámicos
 * 
 * Utiliza el plugin oficial @payloadcms/plugin-form-builder
 */

import type { CollectionConfig } from 'payload'

export const forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'title',
    group: 'CMS',
    description: 'Formularios del sitio',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return true
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título del formulario',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Ej: contacto, cotizacion, presupuesto',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      defaultValue: 'Enviar',
      label: 'Texto del botón',
    },
    {
      name: 'confirmationType',
      type: 'select',
      label: 'Tipo de confirmación',
      options: [
        { label: 'Mensaje en pantalla', value: 'message' },
        { label: 'Redireccionar a página', value: 'redirect' },
      ],
      defaultValue: 'message',
    },
    {
      name: 'confirmationMessage',
      type: 'textarea',
      label: 'Mensaje de confirmación',
      admin: {
        description: 'Mensaje mostrado después de enviar',
      },
    },
    {
      name: 'redirectUrl',
      type: 'text',
      label: 'URL de redirección',
      admin: {
        condition: (data) => data.confirmationType === 'redirect',
      },
    },
    {
      name: 'sendConfirmationEmail',
      type: 'checkbox',
      defaultValue: false,
      label: 'Enviar email de confirmación',
    },
    {
      name: 'confirmationEmailSubject',
      type: 'text',
      label: 'Asunto del email',
      admin: {
        condition: (data) => data.sendConfirmationEmail,
      },
    },
    // Integración con Leads
    {
      name: 'createLead',
      type: 'checkbox',
      defaultValue: true,
      label: 'Crear lead automáticamente',
      admin: {
        description: 'Al enviar, crear un lead en la colección',
      },
    },
    {
      name: 'leadConfig',
      type: 'group',
      label: 'Configuración de Lead',
      admin: {
        condition: (data) => data.createLead,
      },
      fields: [
        {
          name: 'defaultSource',
          type: 'text',
          label: 'Fuente por defecto',
          admin: {
            description: 'Valor para el campo source',
          },
        },
        {
          name: 'assignTo',
          type: 'relationship',
          relationTo: 'users',
          label: 'Asignar a usuario',
          admin: {
            description: 'Usuario asignado por defecto',
          },
        },
        {
          name: 'addTags',
          type: 'array',
          label: 'Etiquetas',
          fields: [
            { name: 'tag', type: 'text', label: 'Etiqueta' },
          ],
        },
        {
          name: 'notifyOnSubmit',
          type: 'checkbox',
          defaultValue: true,
          label: 'Notificar al crear lead',
        },
      ],
    },
    // Captcha
    {
      name: 'enableCaptcha',
      type: 'checkbox',
      defaultValue: true,
      label: 'Habilitar CAPTCHA',
    },
    // Estado
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Formulario activo',
    },
  ],
}
