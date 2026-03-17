/**
 * GUARDMAN - Hook de Scoring de Lead con GLM
 * Se ejecuta DESPUÉS de crear un lead para calcular score con GLM-5
 */

import type { CollectionAfterChangeHook } from 'payload'
import { GLMService, type LeadScoringResult } from '../../services/GLMService'

// Instancia global del servicio GLM (se inicializa en payload.config.ts)
let glmService: GLMService | null = null

// Inicializar el servicio GLM (llamar desde payload.config.ts)
export function initGLMService(apiKey: string, model: string = 'glm-5') {
  glmService = new GLMService(apiKey, model)
  console.log('[GLM] Service initialized')
}

// Verificar si el servicio está disponible
function isGLMAvailable(): boolean {
  return glmService !== null
}

// Scoring básico (fallback cuando no hay GLM)
function calculateBasicScore(lead: any): number {
  let score = 50 // Score base

  // +10 si tiene email
  if (lead.email) score += 10

  // +10 si tiene empresa
  if (lead.company) score += 10

  // +15 si el mensaje es largo (>50 caracteres)
  if (lead.message && lead.message.length > 50) score += 15

  // +10 si menciona palabras clave de urgencia
  const urgencyKeywords = ['urgente', 'inmediato', 'ahora', 'pronto', 'emergencia']
  if (lead.message && urgencyKeywords.some(kw => lead.message.toLowerCase().includes(kw))) {
    score += 10
  }

  // +10 si menciona presupuesto
  const budgetKeywords = ['presupuesto', 'cotizar', 'precio', 'costo']
  if (lead.message && budgetKeywords.some(kw => lead.message.toLowerCase().includes(kw))) {
    score += 10
  }

  // Limitar a 0-100
  return Math.min(100, Math.max(0, score))
}

// Obtener reglas de scoring configurables
async function getScoringRules(payload: any) {
  try {
    const rules = await payload.find({
      collection: 'scoring-rules',
      where: { isActive: { equals: true } },
      limit: 1,
    })
    return rules.docs[0] || null
  } catch (error) {
    console.warn('[Scoring] Could not fetch rules:', error)
    return null
  }
}

// Aplicar pesos de las reglas configurables
function applyRuleWeights(
  score: number, 
  classification: LeadScoringResult, 
  rules: any
): number {
  if (!rules) return score

  let finalScore = score

  // Aplicar peso de persona
  if (classification.detectedPersona && rules.personaWeights) {
    const personaRule = rules.personaWeights.find(
      (p: any) => p.persona === classification.detectedPersona.toLowerCase().replace(/\s+/g, '_')
    )
    if (personaRule) {
      // Ajustar score base más el peso de la regla
      finalScore = Math.min(100, finalScore - 15 + personaRule.weight)
    }
  }

  // Aplicar peso de presupuesto
  if (classification.estimatedBudget && rules.budgetWeights) {
    const budgetRule = rules.budgetWeights.find(
      (b: any) => b.budget === classification.estimatedBudget
    )
    if (budgetRule) {
      finalScore = Math.min(100, finalScore - 10 + budgetRule.weight)
    }
  }

  // Aplicar peso de urgencia
  if (classification.urgency && rules.urgencyWeights) {
    const urgencyRule = rules.urgencyWeights.find(
      (u: any) => u.urgency === classification.urgency
    )
    if (urgencyRule) {
      finalScore = Math.min(100, finalScore - 5 + urgencyRule.weight)
    }
  }

  return Math.min(100, Math.max(0, finalScore))
}

// Determinar acción basada en score y reglas
function determineAction(score: number, rules: any): string {
  // Si hay reglas configuradas, usarlas
  if (rules?.actionThresholds) {
    const { urgentContact, followUp, notQualified } = rules.actionThresholds
    
    if (score >= urgentContact) return 'URGENT_CONTACT'
    if (score >= followUp) return 'FOLLOW_UP'
    if (score < notQualified) return 'NOT_QUALIFIED'
    return 'FOLLOW_UP'
  }

  // Valores por defecto
  if (score >= 80) return 'URGENT_CONTACT'
  if (score >= 50) return 'FOLLOW_UP'
  if (score < 30) return 'NOT_QUALIFIED'
  return 'FOLLOW_UP'
}

export const scoreLeadAfterCreate: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  // Solo ejecutar en creación
  if (operation !== 'create') return

  console.log(`[Lead Scoring] Processing lead: ${doc.id}`)

  try {
    let classification: LeadScoringResult
    let score: number
    let action: string

    // 1. Intentar usar GLM si está disponible
    if (isGLMAvailable() && glmService) {
      console.log('[Lead Scoring] Using GLM-5 for analysis')
      
      // Obtener nombre de ubicación si está disponible
      let locationName: string | undefined
      if (doc.source?.location) {
        try {
          const location = await req.payload.findByID({
            collection: 'locations',
            id: typeof doc.source.location === 'object' ? doc.source.location.id : doc.source.location,
          })
          locationName = location?.name
        } catch (e) {
          // Ignorar error
        }
      }

      // Analizar lead con GLM
      classification = await glmService.scoreLead({
        name: doc.name,
        message: doc.message,
        source: doc.source?.pageUrl,
        location: locationName,
      })

      // Aplicar pesos de reglas configurables
      const rules = await getScoringRules(req.payload)
      score = applyRuleWeights(classification.score, classification, rules)
      action = determineAction(score, rules)

      console.log(`[Lead Scoring] GLM Analysis:`, {
        persona: classification.detectedPersona,
        budget: classification.estimatedBudget,
        urgency: classification.urgency,
        originalScore: classification.score,
        finalScore: score,
        action,
      })
    } else {
      // Fallback: scoring básico
      console.log('[Lead Scoring] Using basic scoring (GLM not available)')
      
      score = calculateBasicScore(doc)
      const rules = await getScoringRules(req.payload)
      action = determineAction(score, rules)
      
      classification = {
        score,
        detectedProblems: [],
        detectedPersona: 'otro',
        estimatedBudget: 'medium',
        recommendedAction: action as 'URGENT_CONTACT' | 'FOLLOW_UP' | 'AI_DELEGATE' | 'REACTIVATE' | 'NOT_QUALIFIED',
        urgency: 'medium',
      }
    }

    // 2. Actualizar lead con el análisis
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        score,
        smartAction: action,
        internalClassification: {
          detectedPersona: classification.detectedPersona,
          detectedProblems: classification.detectedProblems.map((p: string) => ({ problem: p })),
          estimatedBudget: classification.estimatedBudget,
          urgency: classification.urgency,
          analyzedAt: new Date().toISOString(),
          modelUsed: isGLMAvailable() ? 'glm-5' : 'basic-rules',
        },
      } as any,
      req,
    })

    console.log(`[Lead Scoring] Lead ${doc.id} scored: ${score} (${action})`)

  } catch (error) {
    console.error('[Lead Scoring] Error:', error)
  }
}

export default scoreLeadAfterCreate
