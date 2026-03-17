/**
 * GUARDMAN - Hook de Enrichment de Keyword con Serper y GLM
 * Se ejecuta DESPUÉS de crear/actualizar un keyword para enriquecer datos
 */

import type { CollectionAfterChangeHook } from 'payload'
import { GLMService } from '../../services/GLMService'
import { SerperService } from '../../services/SerperService'

// Variables de entorno
const SERPER_API_KEY = process.env.SERPER_API_KEY
const GLM_API_KEY = process.env.GLM_API_KEY

// Instancias de servicios
let serperService: SerperService | null = null
let glmService: GLMService | null = null

// Inicializar servicios
function initServices() {
  if (SERPER_API_KEY && !serperService) {
    serperService = new SerperService(SERPER_API_KEY)
  }
  if (GLM_API_KEY && !glmService) {
    glmService = new GLMService(GLM_API_KEY, 'glm-5')
  }
}

// Hook principal
export const enrichKeywordAfterChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  // Solo ejecutar en creación o actualización
  if (operation !== 'create' && operation !== 'update') return

  // Inicializar servicios
  initServices()

  const keywordId = doc.id
  const keywordText = doc.keyword

  if (!keywordText) {
    console.log('[Keyword Enrichment] No keyword text, skipping')
    return
  }

  console.log(`[Keyword Enrichment] Processing keyword: ${keywordText}`)

  try {
    const updateData: Record<string, any> = {}

    // 1. Enriquecer con Serper
    if (serperService) {
      try {
        console.log('[Keyword Enrichment] Calling Serper API...')
        const serperResult = await serperService.search(keywordText, { num: 10 })

        // Extraer métricas
        const resultCount = serperResult.organic?.length || 0

        // Contar anuncios (si están disponibles)
        const adsCount = (serperResult as any).ads?.length || 0

        // Top 3 competidores
        const topCompetitors =
          serperResult.organic?.slice(0, 3).map((r) => ({
            competitor: r.title,
            position: r.position,
          })) || []

        updateData.serperMetrics = {
          resultCount,
          adsCount,
          topCompetitors,
          searchedAt: new Date().toISOString(),
        }

        console.log(`[Keyword Enrichment] Serper result: ${resultCount} results, ${adsCount} ads`)
      } catch (serperError) {
        console.error('[Keyword Enrichment] Serper error:', serperError)
      }
    } else {
      console.log('[Keyword Enrichment] Serper not available, skipping')
    }

    // 2. Analizar con GLM
    if (glmService) {
      try {
        console.log('[Keyword Enrichment] Calling GLM API...')

        const systemPrompt = `Eres un experto en SEO para el mercado chileno de seguridad privada.
Analiza la siguiente keyword y responde EXACTAMENTE en formato JSON:
{
  "difficulty": number (0-100),
  "volume": "high" | "medium" | "low",
  "opportunity": "high" | "medium" | "low",
  "recommendedUrl": string (URL recomendada para posicionar esta keyword)
}`

        const result = await glmService.chatWithSystem(systemPrompt, `Keyword: ${keywordText}`)

        const jsonStr = result.replace(/```json|```/g, '').trim()
        const analysis = JSON.parse(jsonStr)

        if (analysis) {
          updateData.glmAnalysis = {
            difficulty: analysis.difficulty,
            volume: analysis.volume,
            opportunity: analysis.opportunity,
            recommendedUrl: analysis.recommendedUrl,
            analyzedAt: new Date().toISOString(),
          }

          console.log(
            `[Keyword Enrichment] GLM analysis: difficulty=${analysis.difficulty}, volume=${analysis.volume}`,
          )
        }
      } catch (glmError) {
        console.error('[Keyword Enrichment] GLM error:', glmError)
      }
    } else {
      console.log('[Keyword Enrichment] GLM not available, skipping')
    }

    // 3. Actualizar el documento si hay datos
    if (Object.keys(updateData).length > 0) {
      await req.payload.update({
        collection: 'keywords',
        id: keywordId,
        data: updateData,
        req,
      })

      console.log(`[Keyword Enrichment] Keyword ${keywordId} enriched successfully`)
    } else {
      console.log('[Keyword Enrichment] No enrichment data to update')
    }
  } catch (error) {
    console.error('[Keyword Enrichment] Error:', error)
    // No lanzar error - el documento ya fue creado
  }
}

export default enrichKeywordAfterChange
