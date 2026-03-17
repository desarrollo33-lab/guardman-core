/**
 * GUARDMAN - Hooks de Leads
 * Exporta todos los hooks relacionados con la gestión de leads
 */

// Hooks que se ejecutan ANTES del cambio (beforeChange)
export { enrichLeadBeforeCreate, normalizePhone } from './enrichLead'
export { detectDuplicateBeforeCreate } from './detectDuplicate'

// Hooks que se ejecutan DESPUÉS del cambio (afterChange)
export { scoreLeadAfterCreate } from './scoreLead'
export { assignLeadAfterCreate } from './assignLead'
