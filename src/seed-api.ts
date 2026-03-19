import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'

import { upsert } from './lib/seed-helpers'

import { seed } from './lib/seed-main'
import { seedServices } from './lib/seed-services'
import { seedIndustries } from './lib/seed-industries'
import { seedProblems } from './lib/seed-problems'
import { seedPersonas } from './lib/seed-personas'
import { seedSolutions } from './lib/seed-solutions'
import { seedLocations } from './lib/seed-locations'
import { seedPrompts } from './lib/seed-prompts'
import { seedTestimonials } from './lib/seed-testimonials'
import { seedBrandDNA } from './lib/seed-brand-dna'

/**
 * GUARDMAN V3 - Seed Script (Improved Version)
 * Runs seed locally with better error handling and no remote API calls
 * Falls back to synchronous approach if Serper/GLM APIs fail
 */

// Helper: upsert document by slug or identifier
async function upsert(
  payload: any,
  collection: string,
  where: Record<string, any>,
  data: Record<string, any>,
): Promise<number> {
  const existing = await payload.find({ collection, where, limit: 1 })
  if (existing.totalDocs > 0) {
    const doc = await payload.update({
      collection,
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    return doc.id
  }
  const doc = await payload.create({ collection, data, overrideAccess: true })
  return doc.id
}

 }

// Helper: fetch with timeout and error handling
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = number = 5000,
): Promise<Response> {
 {
  const controller = new AbortController()
  if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${url}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Fetch failed for ${url}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
  }
}

 return null
}

 })
