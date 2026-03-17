/**
 * GUARDMAN - GLM Service
 * Integración con ZhipuAI GLM-5 para inteligencia artificial
 * 
 * Modelos disponibles:
 * - glm-5       → Modelo más reciente y potente
 * - glm-4.7     → Estable
 */

const GLM_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

export interface GLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GLMCompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface GLMCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Tipos para respuestas de scoring
export interface LeadScoringResult {
  score: number
  detectedProblems: string[]
  detectedPersona: string
  estimatedBudget: 'low' | 'medium' | 'high' | 'enterprise'
  recommendedAction: 'URGENT_CONTACT' | 'FOLLOW_UP' | 'AI_DELEGATE' | 'REACTIVATE' | 'NOT_QUALIFIED'
  urgency: 'low' | 'medium' | 'high'
}

export interface SEOContentResult {
  metaTitle: string
  metaDescription: string
  h1: string
  contentOutline: string[]
  faq: Array<{ question: string; answer: string }>
}

export class GLMService {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string = 'glm-5') {
    this.apiKey = apiKey
    this.model = model
  }

  async chat(
    messages: GLMMessage[],
    options: GLMCompletionOptions = {}
  ): Promise<GLMCompletionResponse> {
    const response = await fetch(`${GLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        model: options.model || this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`GLM API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  /**
   * Chat con prompt del sistema
   */
  async chatWithSystem(
    systemPrompt: string,
    userMessage: string,
    options: GLMCompletionOptions = {}
  ): Promise<string> {
    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      options
    )

    return response.choices[0]?.message?.content || ''
  }

  /**
   * Scoring de lead - Analiza un lead y devuelve score
   */
  async scoreLead(leadData: {
    name: string
    message: string
    source?: string
    location?: string
  }): Promise<LeadScoringResult> {
    const systemPrompt = `Eres un experto calificando leads para servicios de seguridad privada en Chile.
Analiza el lead y responde EXACTAMENTE en formato JSON:
{
  "score": number (0-100),
  "detectedProblems": string[],
  "detectedPersona": string,
  "estimatedBudget": "low" | "medium" | "high" | "enterprise",
  "recommendedAction": "URGENT_CONTACT" | "FOLLOW_UP" | "AI_DELEGATE" | "REACTIVATE" | "NOT_QUALIFIED",
  "urgency": "low" | "medium" | "high"
}`

    const userMessage = `
Nombre: ${leadData.name}
Mensaje: ${leadData.message}
Origen: ${leadData.source || 'No especificado'}
Ubicación: ${leadData.location || 'No especificada'}
`.trim()

    try {
      const result = await this.chatWithSystem(systemPrompt, userMessage)
      
      // Limpiar respuesta y parsear JSON
      const jsonStr = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      
      return {
        score: Math.min(100, Math.max(0, parsed.score || 50)),
        detectedProblems: parsed.detectedProblems || [],
        detectedPersona: parsed.detectedPersona || 'otro',
        estimatedBudget: parsed.estimatedBudget || 'medium',
        recommendedAction: parsed.recommendedAction || 'FOLLOW_UP',
        urgency: parsed.urgency || 'medium',
      }
    } catch (error) {
      console.error('[GLM] Error parsing lead scoring:', error)
      // Devolver默认值 en caso de error
      return {
        score: 50,
        detectedProblems: [],
        detectedPersona: 'otro',
        estimatedBudget: 'medium',
        recommendedAction: 'FOLLOW_UP',
        urgency: 'medium',
      }
    }
  }

  /**
   * Generación de contenido SEO
   */
  async generateSEOContent(params: {
    location?: string
    service?: string
    problem?: string
  }): Promise<SEOContentResult> {
    const systemPrompt = `Eres un experto en contenido SEO para el mercado chileno de seguridad privada.
Genera contenido para una página SEO y responde EXACTAMENTE en JSON:
{
  "metaTitle": string,
  "metaDescription": string,
  "h1": string,
  "contentOutline": string[],
  "faq": [{"question": string, "answer": string}]
}`

    const userMessage = `
Comuna: ${params.location || 'Santiago'}
Servicio: ${params.service || 'Guardias de Seguridad'}
Problema: ${params.problem || 'Seguridad general'}
`.trim()

    try {
      const result = await this.chatWithSystem(systemPrompt, userMessage)
      
      const jsonStr = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      
      return {
        metaTitle: parsed.metaTitle || '',
        metaDescription: parsed.metaDescription || '',
        h1: parsed.h1 || '',
        contentOutline: parsed.contentOutline || [],
        faq: parsed.faq || [],
      }
    } catch (error) {
      console.error('[GLM] Error parsing SEO content:', error)
      return {
        metaTitle: '',
        metaDescription: '',
        h1: '',
        contentOutline: [],
        faq: [],
      }
    }
  }

  /**
   * Análisis de tendencias desde noticias
   */
  async analyzeTrends(newsData: {
    title: string
    snippet: string
    source: string
    date: string
  }[]): Promise<{
    momentum: 'rising' | 'stable' | 'declining'
    sentiment: 'positive' | 'negative' | 'neutral'
    opportunity: string
  }> {
    const systemPrompt = `Eres un experto detectando tendencias en seguridad privada en Chile.
Analiza las siguientes noticias y responde EXACTAMENTE en JSON:
{
  "momentum": "rising" | "stable" | "declining",
  "sentiment": "positive" | "negative" | "neutral",
  "opportunity": string
}`

    const userMessage = newsData.map(n => 
      `- Título: ${n.title}\n  Fecha: ${n.date}\n  Fuente: ${n.source}`
    ).join('\n')

    try {
      const result = await this.chatWithSystem(systemPrompt, userMessage)
      
      const jsonStr = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      
      return {
        momentum: parsed.momentum || 'stable',
        sentiment: parsed.sentiment || 'neutral',
        opportunity: parsed.opportunity || '',
      }
    } catch (error) {
      console.error('[GLM] Error parsing trends:', error)
      return {
        momentum: 'stable',
        sentiment: 'neutral',
        opportunity: '',
      }
    }
  }
}

export default GLMService
