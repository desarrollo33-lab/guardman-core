/**
 * Cliente para interactuar con la API de Google Gemini (GLM)
 * Utiliza @google/genai SDK o fetch directo según la preferencia.
 * Usaremos fetch directo para mantener las dependencias ligeras y compatibles con Cloudflare Workers por ahora.
 */

import { Payload } from 'payload'
import crypto from 'crypto'

// Interfaz para el Payload de la API de Gemini rest
export interface GLMPayload {
  contents: {
    role: 'user' | 'model',
    parts: { text: string }[]
  }[]
  systemInstruction?: {
    role: 'user',
    parts: { text: string }[]
  }
  generationConfig?: {
    temperature?: number
    topP?: number
    topK?: number
    responseMimeType?: 'application/json' | 'text/plain'
  }
}

export async function generateContentGLM(payloadCtx: Payload, payloadObj: GLMPayload): Promise<string> {
  const apiKey = process.env.GLM_API_KEY

  if (!apiKey) {
    throw new Error('GLM_API_KEY no configurada')
  }

  // Crear un hash del prompt para la clave de caché
  const hashString = JSON.stringify(payloadObj)
  const hash = crypto.createHash('sha256').update(hashString).digest('hex')
  const cacheKey = `glm:${hash}`

  // 1. Verificar Caché
  const cached = await payloadCtx.find({
    collection: 'api-cache',
    where: {
      cacheKey: { equals: cacheKey },
      service: { equals: 'glm' },
    },
    limit: 1,
  })

  if (cached.docs.length > 0) {
    payloadCtx.logger.info(`[ApiCache] HIT GLM para prompt hash: ${hash.substring(0, 8)}`)
    return cached.docs[0].response as string
  }

  payloadCtx.logger.info(`[ApiCache] MISS GLM para prompt hash: ${hash.substring(0, 8)}. Generando...`)

  // Usamos gemini-1.5-pro como modelo estándar
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloadObj),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`GLM API error: ${response.status} ${response.statusText} - ${errText}`)
  }

  const data: any = await response.json()

  if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0 || !data.candidates[0].content.parts[0].text) {
    throw new Error('Estructura de respuesta de GLM inesperada')
  }

  const resultText = data.candidates[0].content.parts[0].text

  // 2. Guardar en Caché (GLM outputs can be cached indefinitely for exact same prompts)
  try {
    await payloadCtx.create({
      collection: 'api-cache',
      data: {
        cacheKey,
        service: 'glm',
        response: resultText, // we save the unparsed string for simplicity
      },
    })
  } catch (err) {
    payloadCtx.logger.error(`[ApiCache] Error saving GLM cache for ${cacheKey}: ${err instanceof Error ? err.message : String(err)}`)
  }

  return resultText
}
