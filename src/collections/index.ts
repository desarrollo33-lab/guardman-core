/**
 * GUARDMAN - Colecciones del CMS
 * Exporta todas las colecciones organizadas por grupo
 * 
 * Fase 1: Sistema + Geografía + Negocio
 */

// =============================================================================
// SISTEMA
// =============================================================================
export { users } from './System/Users'
export { settings } from './System/Settings'

// Media está en la misma carpeta por compatibilidad con el build
import { Media } from './Media'
export { Media }

// =============================================================================
// GEOGRAFÍA
// =============================================================================
export { locations } from './Geography/Locations'
export { neighborhoods } from './Geography/Neighborhoods'

// =============================================================================
// NEGOCIO
// =============================================================================
export { services } from './Business/Services'
export { problems } from './Business/Problems'
export { industries } from './Business/Industries'
export { solutions } from './Business/Solutions'
export { personas } from './Business/Personas'

// =============================================================================
// SEO (Fase 4)
// =============================================================================
export { seoPages } from './SEO/SeoPages'
export { keywords } from './SEO/Keywords'
export { testimonials } from './SEO/Testimonials'

// =============================================================================
// CRM (Fase 2)
// =============================================================================
export { leads } from './CRM/Leads'
export { leadDuplicates } from './CRM/LeadDuplicates'
export { scoringRules } from './CRM/ScoringRules'

// =============================================================================
// CONTENIDO (Fase 5)
// =============================================================================
export { blog } from './Content/Blog'
export { forms } from './Content/Forms'
export { formSubmissions } from './Content/FormSubmissions'

// =============================================================================
// EXPORT PRINCIPAL - COLECCIONES PARA PAYLOAD
// =============================================================================
import { users } from './System/Users'
import { settings } from './System/Settings'
import { locations } from './Geography/Locations'
import { neighborhoods } from './Geography/Neighborhoods'
import { services } from './Business/Services'
import { problems } from './Business/Problems'
import { industries } from './Business/Industries'
import { solutions } from './Business/Solutions'
import { personas } from './Business/Personas'
import { leads } from './CRM/Leads'
import { leadDuplicates } from './CRM/LeadDuplicates'
import { scoringRules } from './CRM/ScoringRules'
import { seoPages } from './SEO/SeoPages'
import { keywords } from './SEO/Keywords'
import { testimonials } from './SEO/Testimonials'
import { blog } from './Content/Blog'
import { forms } from './Content/Forms'
import { formSubmissions } from './Content/FormSubmissions'

export const collections = [
  // Sistema (3)
  users,    // con auth
  Media,    // uploads
  settings, // configuración global

  // Geografía (2)
  locations,
  neighborhoods,

  // Negocio (5)
  services,
  problems,
  industries,
  solutions,
  personas,

  // CRM (3) - Fase 2
  leads,
  leadDuplicates,
  scoringRules,

  // SEO (3) - Fase 4
  seoPages,
  keywords,
  testimonials,

  // Contenido (3) - Fase 5
  blog,
  forms,
  formSubmissions,
]

// Total: 19 colecciones
