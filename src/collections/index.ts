/**
 * GUARDMAN V3 - Colecciones del CMS
 * 15 colecciones organizadas en 4 grupos: Empresa, Marketing, CRM, Sistema
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { users } from './System/Users'
import { Prompts } from './System/Prompts'
import { EnrichmentHistory } from './System/EnrichmentHistory'
import { ApiCache } from './System/ApiCache'
import { Media } from './Media'
import { locations } from './Geography/Locations'
import { services } from './Business/Services'
import { problems } from './Business/Problems'
import { industries } from './Business/Industries'
import { solutions } from './Business/Solutions'
import { personas } from './Business/Personas'
import { leads } from './CRM/Leads'
import { seoPages } from './SEO/SeoPages'
import { keywords } from './SEO/Keywords'
import { testimonials } from './SEO/Testimonials'
import { blog } from './Content/Blog'

// =============================================================================
// NAMED EXPORTS
// =============================================================================
export { users } from './System/Users'
export { Prompts } from './System/Prompts'
export { EnrichmentHistory } from './System/EnrichmentHistory'
export { ApiCache } from './System/ApiCache'
export { Media } from './Media'
export { locations } from './Geography/Locations'
export { services } from './Business/Services'
export { problems } from './Business/Problems'
export { industries } from './Business/Industries'
export { solutions } from './Business/Solutions'
export { personas } from './Business/Personas'
export { leads } from './CRM/Leads'
export { seoPages } from './SEO/SeoPages'
export { keywords } from './SEO/Keywords'
export { testimonials } from './SEO/Testimonials'
export { blog } from './Content/Blog'

// =============================================================================
// EXPORT PRINCIPAL - COLECCIONES PARA PAYLOAD
// =============================================================================
export const collections = [
  // ⚙️ Sistema (5)
  users,
  Media,
  Prompts,
  EnrichmentHistory,
  ApiCache,

  // 🏢 Empresa (5)
  services,
  industries,
  personas,
  problems,
  solutions,

  // 📊 Marketing (5)
  locations,
  seoPages,
  keywords,
  testimonials,
  blog,

  // 💼 CRM (1)
  leads,
]

// Total: 16 colecciones (15 + Media)
