/**
 * GUARDMAN - Hook de Enrichment de Problem con Serper y GLM
 * Se ejecuta DESPUÉS de crear/actualizar un problem para enriquecer datos
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
export const enrichProblemAfterChange: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  // Solo ejecutar en creación o actualización
  if (operation !== 'create' && operation !== 'update') return

  // Inicializar servicios
  initServices()

  const problemId = doc.id
  const problemName = doc.name

  if (!problemName) {
    console.log('[Problem Enrichment] No problem name, skipping')
    return
  }

  console.log(`[Problem Enrichment] Processing problem: ${problemName}`)

  try {
    const updateData: Record<string, any> = {}

    // 1. Obtener datos de Serper (News + Search)
    if (serperService) {
      try {
        console.log('[Problem Enrichment] Calling Serper API...')

        // Llamadas paralelas a news y search
        const [newsResult, searchResult] = await Promise.all([
          serperService.news(problemName),
          serperService.search(problemName, { num: 10 }),
        ])

        // Extraer newsCount
        const newsCount = newsResult.news?.length || 0

        // Extraer searchVolume (contar resultados orgánicos)
        const searchVolume = searchResult.organic?.length || 0

        // Analizar tendencias con GLM si hay noticias
        let trending: 'rising' | 'stable' | 'declining' = 'stable'

        if (glmService && newsCount > 0) {
          try {
            console.log('[Problem Enrichment] Analyzing trends with GLM...')

            // Preparar datos de noticias para GLM
            const newsData =
              newsResult.news?.slice(0, 5).map((n) => ({
                title: n.title,
                snippet: n.snippet,
                source: n.source,
                date: n.date,
              })) || []

            const trendAnalysis = await glmService.analyzeTrends(newsData)
            trending = trendAnalysis.momentum

            console.log(
              `[Problem Enrichment] Trend analysis: ${trendAnalysis.momentum}, sentiment: ${trendAnalysis.sentiment}`,
            )
          } catch (glmError) {
            console.error('[Problem Enrichment] GLM error:', glmError)
          }
        } else if (!glmService) {
          console.log('[Problem Enrichment] GLM not available, skipping trend analysis')
        }

        // Actualizar serperData
        updateData.serperData = {
          newsCount,
          searchVolume,
          trending,
          lastChecked: new Date().toISOString(),
        }

        console.log(
          `[Problem Enrichment] Serper data: newsCount=${newsCount}, searchVolume=${searchVolume}, trending=${trending}`,
        )
      } catch (serperError) {
        console.error('[Problem Enrichment] Serper error:', serperError)
      }
    } else {
      console.log('[Problem Enrichment] Serper not available, skipping')
    }

    // 2. Actualizar el documento si hay datos
    if (Object.keys(updateData).length > 0) {
      await req.payload.update({
        collection: 'problems',
        id: problemId,
        data: updateData,
        req,
      })

      console.log(`[Problem Enrichment] Problem ${problemId} enriched successfully`)
    } else {
      console.log('[Problem Enrichment] No enrichment data to update')
    }
  } catch (error) {
    console.error('[Problem Enrichment] Error:', error)
    // No lanzar error - el documento ya fue creado
  }
}

export default enrichProblemAfterChange
