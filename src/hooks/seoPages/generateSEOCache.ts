/**
 * GUARDMAN - Hook de Generación de Cache SEO con GLM
 * Se ejecuta DESPUÉS de crear/actualizar una página SEO para generar contenido
 */

import type { CollectionAfterChangeHook } from 'payload'
import { GLMService } from '../../services/GLMService'

// Variable de entorno
const GLM_API_KEY = process.env.GLM_API_KEY

// Instancia de servicio
let glmService: GLMService | null = null

// Inicializar servicio
function initService() {
  if (GLM_API_KEY && !glmService) {
    glmService = new GLMService(GLM_API_KEY, 'glm-5')
  }
}

// Hook principal
export const generateSEOCache: CollectionAfterChangeHook = async ({ operation, doc, req }) => {
  // Solo ejecutar en creación o actualización
  if (operation !== 'create' && operation !== 'update') return

  // Inicializar servicio
  initService()

  // Verificar si GLM está disponible
  if (!glmService) {
    console.log('[SEO Cache] GLM not available, skipping')
    return
  }

  const seoPageId = doc.id
  const pageType = doc.pageType

  console.log(`[SEO Cache] Processing SEO page: ${doc.title} (${pageType})`)

  try {
    // Obtener los parámetros para generar contenido
    const params: {
      location?: string
      service?: string
      problem?: string
    } = {}

    // Si hay location relacionada, obtener su nombre
    if (doc.location) {
      try {
        const location = await req.payload.findByID({
          collection: 'locations',
          id: doc.location,
          depth: 0,
        })
        params.location = (location as any).name
      } catch (e) {
        console.log('[SEO Cache] Could not fetch location:', e)
      }
    }

    // Si hay service relacionado, obtener su nombre
    if (doc.service) {
      try {
        const service = await req.payload.findByID({
          collection: 'services',
          id: doc.service,
          depth: 0,
        })
        params.service = (service as any).title || (service as any).name
      } catch (e) {
        console.log('[SEO Cache] Could not fetch service:', e)
      }
    }

    // Si hay problem relacionado, obtener su nombre
    if (doc.problem) {
      try {
        const problem = await req.payload.findByID({
          collection: 'problems',
          id: doc.problem,
          depth: 0,
        })
        params.problem = (problem as any).title || (problem as any).name
      } catch (e) {
        console.log('[SEO Cache] Could not fetch problem:', e)
      }
    }

    console.log('[SEO Cache] Generating SEO content with params:', params)

    // Generar contenido con GLM
    const seoContent = await glmService.generateSEOContent(params)

    console.log('[SEO Cache] Generated content:', {
      metaTitle: seoContent.metaTitle,
      metaDescription: seoContent.metaDescription?.slice(0, 50) + '...',
      h1: seoContent.h1,
      contentOutlineLength: seoContent.contentOutline?.length || 0,
      faqLength: seoContent.faq?.length || 0,
    })

    // Preparar datos para actualizar
    const updateData: Record<string, any> = {
      // Actualizar campos SEO
      seo: {
        metaTitle: seoContent.metaTitle,
        metaDescription: seoContent.metaDescription,
        h1: seoContent.h1,
      },
      // Actualizar FAQ
      faq: seoContent.faq || [],
      // Marcar como generado por GLM
      glmGenerated: true,
    }

    // Actualizar el documento
    await req.payload.update({
      collection: 'seo-pages',
      id: seoPageId,
      data: updateData,
      req,
    })

    console.log(`[SEO Cache] SEO page ${seoPageId} updated successfully`)
  } catch (error) {
    console.error('[SEO Cache] Error:', error)
    // No lanzar error - el documento ya fue creado
  }
}

export default generateSEOCache
