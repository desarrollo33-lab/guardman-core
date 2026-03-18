'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useConfig } from '@payloadcms/ui'

interface EnrichButtonProps {
  label?: string
}

interface EnrichResponse {
  success: boolean
  error?: string
  enriched?: Record<string, unknown>
  neighborhoodName?: string
  locationName?: string
}

export function EnrichButton({ label = 'Enriquecer con IA' }: EnrichButtonProps) {
  const docInfo = useDocumentInfo()
  const id = docInfo.id as string | undefined
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const isNeighborhood = path.includes('/neighborhoods') || path.includes('neighborhoods')
  const endpointCollection = isNeighborhood ? 'neighborhoods' : 'location'
  const collection = endpointCollection

  console.log('[EnrichButton] Path:', path, 'Endpoint:', endpointCollection, 'ID:', id)

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [result, setResult] = useState<{
    success?: boolean
    error?: string
    enriched?: Record<string, unknown>
  } | null>(null)

  const handleEnrich = async () => {
    console.log(
      '[EnrichButton] Starting enrichment, id:',
      id,
      'collection:',
      collection,
      'path:',
      path,
    )
    if (!id) {
      setResult({
        error: 'ID no disponible. Guarda el documento primero y vuelve a abrir la edición.',
      })
      return
    }

    setLoading(true)
    setProgress('Iniciando enriquecimiento...')
    setResult(null)

    try {
      setProgress('Consultando servicios de IA...')

      const idString = String(id)
      const url = `/api/enrich/${collection}/${idString}`
      console.log('[EnrichButton] Fetching:', url)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('[EnrichButton] Response status:', response.status)
      setProgress('Procesando resultados...')
      const data = (await response.json()) as EnrichResponse
      console.log('[EnrichButton] Response data:', data)

      if (response.ok) {
        setProgress('')
        setResult({ success: true, enriched: data.enriched })
      } else {
        setProgress('')
        setResult({ error: data.error || `Error ${response.status}: ${response.statusText}` })
      }
    } catch (_error) {
      setProgress('')
      setResult({ error: 'Error de conexión. Revisa la consola para más detalles.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        type="button"
        onClick={handleEnrich}
        disabled={loading || !id}
        style={{
          backgroundColor: loading ? '#6b7280' : '#16a34a',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: loading || !id ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          width: '100%',
          transition: 'background-color 0.2s',
        }}
      >
        {loading ? `${progress}` : label}
      </button>

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            backgroundColor: result.success ? '#dcfce7' : '#fee2e2',
            borderRadius: '6px',
            fontSize: '13px',
            border: `1px solid ${result.success ? '#86efac' : '#fca5a5'}`,
          }}
        >
          {result.success ? (
            <>
              <div style={{ color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>
                ✓ Enriquecimiento completado
              </div>
              {result.enriched && Object.keys(result.enriched).length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#166534' }}>
                  {Object.keys(result.enriched).map((key) => (
                    <li key={key} style={{ marginBottom: '0.25rem' }}>
                      <strong>{key}</strong>: {JSON.stringify(result.enriched?.[key]).slice(0, 100)}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div style={{ color: '#dc2626', fontWeight: 600 }}>✗ Error: {result.error}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnrichButton
