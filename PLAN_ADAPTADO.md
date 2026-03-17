# 🎯 PLAN DE IMPLEMENTACIÓN ADAPTADO - guardman-gateway

## Adaptado para: Next.js 15 + Payload 3.77 + Cloudflare Workers

---

## 1. ARQUITECTURA ADAPTADA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GUARDMAN-GATEWAY ACTUAL                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐ │
│  │   FRONTEND      │     │   PAYLOAD CMS   │     │    API REST     │ │
│  │   (Next.js 15)  │     │   (D1 + R2)     │     │  (Next.js API)  │ │
│  │                 │     │                 │     │                 │ │
│  │   - Pages       │     │   - Admin UI   │     │  - /api/leads   │ │
│  │   - Components  │     │   - Collections│     │  - Custom API   │ │
│  │   - Lib/API     │     │   - Hooks      │     │  - Webhooks     │ │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘ │
│           │                       │                       │             │
│           └───────────────────────┼───────────────────────┘             │
│                                   ▼                                     │
│                    ┌─────────────────────────────┐                      │
│                    │     CLOUDFLARE WORKER       │                      │
│                    │                             │                      │
│                    │  - D1 (SQLite Database)    │                      │
│                    │  - R2 (File Storage)        │                      │
│                    │  - ASSETS (Static Files)    │                      │
│                    └─────────────────────────────┘                      │
│                                                                          │
│  ┌─────────────────┐     ┌─────────────────┐                           │
│  │   SERPER.DEV    │     │   GLM-5 (AI)    │                           │
│  │   (SEO Data)    │     │  (Scoring/IA)   │                           │
│  └─────────────────┘     └─────────────────┘                           │
│                                                                          │
│  ┌─────────────────┐                                                   │
│  │  TELEGRAM BOT   │                                                   │
│  │  (Notificaciones)                                                   │
│  └─────────────────┘                                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Diferencias Clave con el Plan Original

| Aspecto | Plan Original | Plan Adaptado |
|---------|---------------|---------------|
| **API Layer** | Worker separado (`api/`) | Next.js API Routes + Payload REST |
| **Base de datos** | SQLite local + Express | D1 (SQLite cloud) con sqliteD1Adapter |
| **Frontend** | Astro 6 | Next.js 15 (ya existente) |
| **Hooks** | Express middleware | Payload Collection Hooks |
| **Rutas** | Service Bindings | Next.js rewrites + API routes |

---

## 2. COLECCIONES ADAPTADAS

### 2.1 Estructura de Archivos Propuesta

```
guardman-gateway/src/
├── collections/
│   ├── index.ts                 # Exporta todas las colecciones
│   ├── System/
│   │   ├── Users.ts            # Usuarios del equipo
│   │   ├── Media.ts            # Archivos multimedia
│   │   └── Settings.ts         # Configuración global
│   ├── Geography/
│   │   ├── Locations.ts        # Comunas RM
│   │   └── Neighborhoods.ts     # Barrios
│   ├── Business/
│   │   ├── Services.ts         # Servicios de seguridad
│   │   ├── Problems.ts         # Problemas SEO
│   │   ├── Industries.ts       # Industrias
│   │   ├── Solutions.ts        # Soluciones
│   │   └── Personas.ts         # Personas objetivo
│   ├── SEO/
│   │   ├── SeoPages.ts         # Páginas SEO
│   │   ├── Keywords.ts         # Keywords
│   │   └── Testimonials.ts     # Testimonios
│   ├── CRM/
│   │   ├── Leads.ts            # Leads
│   │   ├── LeadDuplicates.ts   # Duplicados
│   │   └── ScoringRules.ts     # Reglas de scoring
│   └── Content/
│       └── Blog.ts              # Blog
│
├── hooks/
│   ├── index.ts                # Exporta todos los hooks
│   ├── leads/
│   │   ├── enrichLead.ts       # Enriquecer lead
│   │   ├── detectDuplicate.ts  # Detectar duplicados
│   │   ├── scoreLead.ts        # Scoring con GLM
│   │   ├── assignLead.ts       # Asignar vendedor
│   │   └── notifyTelegram.ts   # Notificaciones
│   └── seo/
│       ├── generateContent.ts  # Generar contenido
│       └── runAudit.ts         # Auditorías
│
├── services/
│   ├── SerperService.ts        # API Serper
│   ├── GLMService.ts           # API GLM-5
│   └── TelegramService.ts      # Bot Telegram
│
├── app/
│   ├── (payload)/
│   │   ├── api/
│   │   │   └── [...slug]/      # Payload REST API
│   │   └── admin/              # Admin Panel
│   └── api/
│       └── guardman/
│           ├── leads/
│           │   ├── route.ts     # POST /api/guardman/leads
│           │   └── duplicate.ts # GET /api/guardman/leads/check-duplicate
│           └── sitemap/
│               └── route.ts    # GET /api/guardman/sitemap.xml
│
└── payload.config.ts           # Configuración principal
```

---

## 3. COLECCIONES A IMPLEMENTAR

### Fase 1: Sistema + Geografía + Negocio (CRÍTICO)

```typescript
// src/collections/index.ts - Adaptado del blueprint

import { users } from './System/Users'
import { media } from './System/Media'
import { settings } from './System/Settings'
import { locations } from './Geography/Locations'
import { neighborhoods } from './Geography/Neighborhoods'
import { services } from './Business/Services'
import { problems } from './Business/Problems'
import { industries } from './Business/Industries'
import { solutions } from './Business/Solutions'
import { personas } from './Business/Personas'
import { leads } from './CRM/Leads'
import { leadDuplicates } from './CRM/LeadDuplicates'
import { scoringRules } from './CRM/ScoringRules'
import { seoPages } from './SEO/SeoPages'
import { keywords } from './SEO/Keywords'
import { testimonials } from './SEO/Testimonials'
import { blog } from './Content/Blog'

export const collections = [
  // Sistema (3)
  users,
  media,
  settings,

  // Geografía (2)
  locations,
  neighborhoods,

  // Negocio (5)
  services,
  problems,
  industries,
  solutions,
  personas,

  // CRM (3) - Esencial
  leads,
  leadDuplicates,
  scoringRules,

  // SEO (3)
  seoPages,
  keywords,
  testimonials,

  // Contenido (1)
  blog,
]

// Total: 17 colecciones (en lugar de 26)
```

### Fase 2: Opcionales (Segundi Implementación)

| Colección | Grupo | Notes |
|-----------|-------|-------|
| `seoAudits` | SEO | Auditorías - alto costo API |
| `seoTrends` | SEO | Tendencias - requiere volumen |
| `competitors` | SEO | Análisis competidores |
| `contentIdeas` | SEO | Ideas IA - fase posterior |
| `promptTemplates` | IA | Prompts editables |
| `apiUsage` | IA | Tracking de uso |
| `autoLeads` | CRM | Prospección - fase posterior |
| `quotes` | CRM | Cotizaciones |
| `documents` | CRM | Documentos |

---

## 4. IMPLEMENTACIÓN DE SERVICIOS

### 4.1 Serper Service (Adaptado para Workers)

```typescript
// src/services/SerperService.ts
// Adaptado para Cloudflare Workers

import type { DrizzleD1Database } from 'drizzle-orm/d1'

const SERPER_BASE_URL = 'https://google.serper.dev'

export interface Env {
  DB: D1Database
  SERPER_API_KEY: string
}

export class SerperService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${SERPER_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Serper API Error: ${response.status}`)
    }

    return response.json()
  }

  async search(query: string, num: number = 10) {
    return this.request('/search', { q: query, num })
  }

  async places(query: string) {
    return this.request('/places', { q: query })
  }

  async news(query: string) {
    return this.request('/news', { q: query, num: 10 })
  }

  async autocomplete(query: string) {
    return this.request('/autocomplete', { q: query })
  }
}
```

### 4.2 GLM Service (Adaptado para Workers)

```typescript
// src/services/GLMService.ts
// Versión adaptada para Cloudflare Workers

const GLM_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

export class GLMService {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string = 'glm-5') {
    this.apiKey = apiKey
    this.model = model
  }

  async chat(messages: Array<{ role: string; content: string }>, options: {
    temperature?: number
    maxTokens?: number
  } = {}) {
    const response = await fetch(`${GLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    })

    if (!response.ok) {
      throw new Error(`GLM API Error: ${response.status}`)
    }

    return response.json()
  }

  async scoreLead(leadData: {
    name: string
    message: string
    source?: string
  }) {
    const systemPrompt = `Eres un experto calificando leads para servicios de seguridad privada en Chile.
Analiza el lead y responde en JSON:
{
  "score": number (0-100),
  "detectedProblems": string[],
  "detectedPersona": string,
  "estimatedBudget": "low" | "medium" | "high" | "enterprise",
  "recommendedAction": "URGENT_CONTACT" | "FOLLOW_UP" | "AI_DELEGATE" | "REACTIVATE" | "NOT_QUALIFIED",
  "urgency": "low" | "medium" | "high"
}`

    const result = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(leadData) },
    ])

    try {
      return JSON.parse(result.choices[0].message.content)
    } catch {
      return { score: 50, recommendedAction: 'FOLLOW_UP' }
    }
  }

  async generateSEOContent(params: {
    location?: string
    service?: string
    problem?: string
  }) {
    const prompt = `Genera contenido SEO para seguridad privada en Chile.
Comuna: ${params.location || 'Santiago'}
Servicio: ${params.service || 'Guardias'}
Responde en JSON:
{
  "metaTitle": string,
  "metaDescription": string,
  "h1": string,
  "contentOutline": string[],
  "faq": [{ "question": string, "answer": string }]
}`

    const result = await this.chat([
      { role: 'user', content: prompt },
    ])

    try {
      return JSON.parse(result.choices[0].message.content)
    } catch {
      return {}
    }
  }
}
```

### 4.3 Telegram Service

```typescript
// src/services/TelegramService.ts

export class TelegramService {
  private botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  async sendMessage(chatId: string, message: string, parseMode: 'Markdown' | 'HTML' = 'Markdown') {
    if (!this.botToken || !chatId) return

    await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
      }),
    })
  }

  async notifyNewLead(lead: {
    name: string
    phone: string
    email?: string
    score: number
    message: string
    source?: { pageUrl?: string }
  }, chatId: string) {
    const message = `
🆕 *NUEVO LEAD*

👤 *${lead.name}*
📱 ${lead.phone}
${lead.email ? `📧 ${lead.email}` : ''}

🎯 Score: ${lead.score}/100

💬 ${lead.message?.slice(0, 100)}...

📍 ${lead.source?.pageUrl || 'Directo'}
    `.trim()

    await this.sendMessage(chatId, message)
  }
}
```

---

## 5. IMPLEMENTACIÓN DE HOOKS

### 5.1 Hook de Enriquecimiento de Lead

```typescript
// src/hooks/leads/enrichLead.ts
import type { CollectionBeforeChangeHook } from 'payload'

// Normalización de teléfono Chile
function normalizePhone(phone: string): string {
  return phone
    .replace(/\s/g, '')
    .replace(/[+\-()]/g, '')
    .replace(/^56/, '9')
    .replace(/^9/, '+569')
}

export const enrichLeadBeforeCreate: CollectionBeforeChangeHook = async ({
  operation,
  data,
}) => {
  if (operation !== 'create') return data

  // Normalizar teléfono
  const normalizedPhone = normalizePhone(data.phone)
  
  // Guardar teléfono normalizado en el campo source
  data.source = {
    ...data.source,
    normalizedPhone,
  }

  return data
}
```

### 5.2 Hook de Detección de Duplicados

```typescript
// src/hooks/leads/detectDuplicate.ts
import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/[+\-()]/g, '').replace(/^56/, '9').replace(/^9/, '+569')
}

export const detectDuplicateBeforeCreate: CollectionBeforeChangeHook = async ({
  operation,
  data,
  req,
}) => {
  if (operation !== 'create') return data

  const normalizedPhone = normalizePhone(data.phone)

  // Buscar lead existente con mismo teléfono
  const existing = await req.payload.find({
    collection: 'leads',
    where: {
      'source.normalizedPhone': { equals: normalizedPhone },
      status: { not_equals: 'lost' },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    // Crear/actualizar registro de duplicado
    const existingLead = existing.docs[0]

    const duplicateRecord = await req.payload.find({
      collection: 'lead-duplicates',
      where: { normalizedPhone: { equals: normalizedPhone } },
      limit: 1,
    })

    if (duplicateRecord.totalDocs > 0) {
      await req.payload.update({
        collection: 'lead-duplicates',
        id: duplicateRecord.docs[0].id,
        data: {
          occurrenceCount: duplicateRecord.docs[0].occurrenceCount + 1,
          lastSeen: new Date().toISOString(),
          leadIds: [
            ...duplicateRecord.docs[0].leadIds,
            { leadId: existingLead.id },
          ],
        },
        req,
      })
    } else {
      await req.payload.create({
        collection: 'lead-duplicates',
        data: {
          normalizedPhone,
          leadIds: [{ leadId: existingLead.id }],
          occurrenceCount: 1,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
        },
        req,
      })
    }

    // Agregar warning al lead
    data.tags = [...(data.tags || []), { tag: 'DUPLICADO' }]
    data.notes = [
      ...(data.notes || []),
      {
        note: `⚠️ Teléfono ya registrado en lead anterior (${existingLead.id})`,
        date: new Date().toISOString(),
      },
    ]
  }

  return data
}
```

### 5.3 Hook de Scoring con GLM

```typescript
// src/hooks/leads/scoreLead.ts
import type { CollectionAfterChangeHook } from 'payload'
import { GLMService } from '../../services/GLMService'

let glmService: GLMService | null = null

export const initGLMService = (apiKey: string) => {
  glmService = new GLMService(apiKey)
}

export const scoreLeadAfterCreate: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation !== 'create') return
  if (!glmService) {
    console.warn('GLM service not initialized')
    return
  }

  try {
    const analysis = await glmService.scoreLead({
      name: doc.name,
      message: doc.message,
      source: doc.source?.pageUrl,
    })

    // Obtener reglas de scoring activas
    const rules = await req.payload.find({
      collection: 'scoring-rules',
      where: { isActive: { equals: true } },
      limit: 1,
    })

    // Calcular score final
    let finalScore = analysis.score || 50
    
    if (rules.docs[0]) {
      const rule = rules.docs[0]
      
      // Aplicar pesos
      if (analysis.detectedPersona && rule.personaWeights) {
        const peso = rule.personaWeights.find(
          (p: any) => p.persona === analysis.detectedPersona
        )
        if (peso) finalScore += peso.weight - 10
      }

      if (analysis.estimatedBudget && rule.budgetWeights) {
        const peso = rule.budgetWeights.find(
          (b: any) => b.budget === analysis.estimatedBudget
        )
        if (peso) finalScore += peso.weight - 10
      }
    }

    // Actualizar lead
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        score: Math.min(100, Math.max(0, finalScore)),
        smartAction: analysis.recommendedAction || 'FOLLOW_UP',
        internalClassification: {
          detectedPersona: analysis.detectedPersona || 'Unknown',
          detectedProblems: analysis.detectedProblems || [],
          estimatedBudget: analysis.estimatedBudget || 'medium',
        },
      },
      req,
    })

    console.log(`✅ Lead ${doc.id} scored: ${finalScore}`)
  } catch (error) {
    console.error('Lead scoring error:', error)
  }
}
```

### 5.4 Hook de Asignación de Vendedor

```typescript
// src/hooks/leads/assignLead.ts
import type { CollectionAfterChangeHook } from 'payload'
import { TelegramService } from '../../services/TelegramService'

let telegramService: TelegramService | null = null

export const initTelegramService = (botToken: string) => {
  telegramService = new TelegramService(botToken)
}

export const assignLeadAfterCreate: CollectionAfterChangeHook = async ({
  operation,
  doc,
  req,
}) => {
  if (operation !== 'create') return

  // Buscar vendedores disponibles
  const users = await req.payload.find({
    collection: 'users',
    where: {
      role: { equals: 'sales' },
      isActive: { equals: true },
    },
    limit: 100,
  })

  if (users.docs.length === 0) return

  // Seleccionar vendedor con menos leads pendientes
  const candidates = []

  for (const user of users.docs) {
    const userLeads = await req.payload.find({
      collection: 'leads',
      where: {
        assignedTo: { equals: user.id },
        status: { not_in: ['converted', 'lost'] },
      },
      limit: 1000,
    })

    const pendingCount = userLeads.totalDocs
    const maxPending = user.salesProfile?.maxPendingLeads || 10

    if (pendingCount < maxPending) {
      let score = 100 - pendingCount * 10

      // Bonus por zona preferida
      if (user.salesProfile?.preferredZones?.length && doc.source?.location) {
        const leadZone = typeof doc.source.location === 'object' 
          ? doc.source.location.geoZone 
          : null
        if (leadZone) {
          const match = user.salesProfile.preferredZones.some(
            (z: any) => z.zone === leadZone
          )
          if (match) score += 20
        }
      }

      candidates.push({ user, score })
    }
  }

  // Seleccionar mejor candidato
  candidates.sort((a, b) => b.score - a.score)
  const bestSeller = candidates[0]?.user

  if (bestSeller) {
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: { assignedTo: bestSeller.id },
      req,
    })

    // Notificar por Telegram
    if (telegramService && bestSeller.telegram?.chatId) {
      await telegramService.notifyNewLead(
        {
          name: doc.name,
          phone: doc.phone,
          email: doc.email,
          score: doc.score || 50,
          message: doc.message,
          source: doc.source,
        },
        bestSeller.telegram.chatId
      )
    }
  }
}
```

---

## 6. CONFIGURACIÓN DE PAYLOAD

### 6.1 payload.config.ts Actualizado

```typescript
// src/payload.config.ts
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import { r2Storage } from '@payloadcms/storage-r2'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Colecciones
import { collections } from './collections'

// Hooks
import { 
  enrichLeadBeforeCreate,
  detectDuplicateBeforeCreate,
  scoreLeadAfterCreate,
  assignLeadAfterCreate,
} from './hooks'

// Servicios
import { initGLMService } from './services/GLMService'
import { initTelegramService } from './services/TelegramService'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: (globalThis as any).cloudflare?.env?.D1,
  }),
  plugins: [
    r2Storage({
      bucket: (globalThis as any).cloudflare?.env?.R2,
      collections: { media: true },
    }),
  ],
  // Hooks de collections
  collections: {
    leads: {
      hooks: {
        beforeChange: [enrichLeadBeforeCreate, detectDuplicateBeforeCreate],
        afterChange: [scoreLeadAfterCreate, assignLeadAfterCreate],
      },
    },
  },
})
```

---

## 7. VARIABLES DE ENTORNO

### 7.1 .env.example

```bash
# Payload CMS
PAYLOAD_SECRET=tu-secret-aqui
SITE_URL=https://guardman.cl

# Cloudflare (ya configurado en wrangler.jsonc)
# D1 y R2 binding automatique

# AI Services
SERPER_API_KEY=tu-serper-api-key
GLM_API_KEY=tu-glm-api-key

# Telegram
TELEGRAM_BOT_TOKEN=tu-bot-token
TELEGRAM_ADMIN_CHAT_ID=tu-chat-id
```

### 7.2 Configuración en wrangler.jsonc

```jsonc
{
  "vars": {
    "SITE_URL": "https://guardman.cl"
  },
  "secrets": [
    //Agregar con: wrangler secret put PAYLOAD_SECRET
    //Agregar con: wrangler secret put SERPER_API_KEY
    //Agregar con: wrangler secret put GLM_API_KEY
    //Agregar con: wrangler secret put TELEGRAM_BOT_TOKEN
    //Agregar con: wrangler secret put TELEGRAM_ADMIN_CHAT_ID
  ]
}
```

---

## 8. API ROUTES CUSTOM

### 8.1 Endpoint para crear leads (público)

```typescript
// src/app/api/guardman/leads/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, phone, email, message, pageUrl, location, service } = body

    // Validar campos requeridos
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Importar dinámicamente payload (disponible solo en Cloudflare)
    const { getPayload } = await import('@payloadcms/next/getPayload')
    const config = await import('@payload-config')
    
    const payload = await getPayload({ config: config.default })

    // Crear lead
    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        phone,
        email,
        message,
        source: {
          pageUrl,
          location,
          service,
        },
        status: 'new',
        score: 50,
      },
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead creado exitosamente',
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Error al crear lead' },
      { status: 500 }
    )
  }
}
```

### 8.2 Endpoint para verificar duplicados

```typescript
// src/app/api/guardman/leads/check-duplicate/route.ts

import { NextRequest, NextResponse } from 'next/server'

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/[+\-()]/g, '').replace(/^56/, '9').replace(/^9/, '+569')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')

  if (!phone) {
    return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 })
  }

  try {
    const { getPayload } = await import('@payloadcms/next/getPayload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const normalized = normalizePhone(phone)

    const existing = await payload.find({
      collection: 'leads',
      where: {
        'source.normalizedPhone': { equals: normalized },
        status: { not_equals: 'lost' },
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({
        exists: true,
        leadId: existing.docs[0].id,
        leadName: existing.docs[0].name,
      })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error('Error checking duplicate:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
```

### 8.3 Sitemap dinámico

```typescript
// src/app/api/guardman/sitemap.xml/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { getPayload } = await import('@payloadcms/next/getPayload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const baseUrl = process.env.SITE_URL || 'https://guardman.cl'

    // Obtener datos
    const [locations, services, seoPages, blogPosts] = await Promise.all([
      payload.find({ collection: 'locations', where: { isActive: { equals: true } }, limit: 100 }),
      payload.find({ collection: 'services', where: { isActive: { equals: true } }, limit: 50 }),
      payload.find({ collection: 'seo-pages', where: { status: { equals: 'published' } }, limit: 100 }),
      payload.find({ collection: 'blog', where: { status: { equals: 'published' } }, limit: 50 }),
    ])

    const urls = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/servicios', priority: '0.9', changefreq: 'weekly' },
      { loc: '/industrias', priority: '0.8', changefreq: 'weekly' },
      { loc: '/personas', priority: '0.8', changefreq: 'weekly' },
      { loc: '/zonas', priority: '0.8', changefreq: 'weekly' },
      { loc: '/contacto', priority: '0.8', changefreq: 'monthly' },
      { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    ]

    // Agregar locations
    locations.docs.forEach((loc: any) => {
      urls.push({ loc: `/zonas/${loc.slug}`, priority: '0.8', changefreq: 'weekly' })
    })

    // Agregar services
    services.docs.forEach((svc: any) => {
      urls.push({ loc: `/servicios/${svc.slug}`, priority: '0.8', changefreq: 'weekly' })
    })

    // Agregar seo pages
    seoPages.docs.forEach((page: any) => {
      urls.push({ loc: `/${page.slug}`, priority: '0.8', changefreq: 'weekly' })
    })

    // Agregar blog posts
    blogPosts.docs.forEach((post: any) => {
      urls.push({ loc: `/blog/${post.slug}`, priority: '0.6', changefreq: 'monthly' })
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: { 'Content-Type': 'application/xml' },
    })
  } catch (error) {
    console.error('Sitemap error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
```

---

## 9. MIGRACIÓN D1

### 9.1 Script de migración inicial

```typescript
// src/migrations/001_initial_schema.ts

export async function up(db: any) {
  // Las colecciones de Payload se crean automáticamente
  // Este script es para datos iniciales si es necesario
  
  // Comunas iniciales (Región Metropolitana)
  const locations = [
    { name: 'Las Condes', slug: 'las-condes', geoZone: 'oriente', tier: 'premium', priorityScore: 95 },
    { name: 'Providencia', slug: 'providencia', geoZone: 'centro', tier: 'high', priorityScore: 90 },
    { name: 'Vitacura', slug: 'vitacura', geoZone: 'oriente', tier: 'premium', priorityScore: 95 },
    { name: 'Santiago Centro', slug: 'santiago-centro', geoZone: 'centro', tier: 'high', priorityScore: 85 },
    { name: 'Ñuñoa', slug: 'nunoa', geoZone: 'nororiente', tier: 'high', priorityScore: 80 },
    { name: 'La Reina', slug: 'la-reina', geoZone: 'oriente', tier: 'high', priorityScore: 80 },
    { name: 'Peñalolén', slug: 'penalolen', geoZone: 'oriente', tier: 'medium', priorityScore: 70 },
    { name: 'Maipú', slug: 'maipu', geoZone: 'poniente', tier: 'medium', priorityScore: 75 },
    { name: 'La Florida', slug: 'la-florida', geoZone: 'suroriente', tier: 'medium', priorityScore: 70 },
    { name: 'San Bernardo', slug: 'san-bernardo', geoZone: 'sur', tier: 'medium', priorityScore: 60 },
  ]

  // Servicios iniciales
  const services = [
    { title: 'Guardias de Seguridad', slug: 'guardias-seguridad', shortDescription: 'Personal de seguridadarmed escort y vigilancia', isHighlighted: true, icon: '🛡️' },
    { title: 'Monitoreo 24/7', slug: 'monitoreo-24-7', shortDescription: 'Centro de control con supervisión continua', isHighlighted: true, icon: '📹' },
    { title: 'Sistemas de Alarmas', slug: 'sistemas-alarmas', shortDescription: 'Instalación y monitoreo de sistemas de alarma', isHighlighted: true, icon: '🔔' },
    { title: 'Cámaras de Seguridad', slug: 'camaras-seguridad', shortDescription: 'Circuito cerrado de televigilancia', isHighlighted: false, icon: '📷' },
    { title: 'Control de Accesos', slug: 'control-accesos', shortDescription: 'Sistemas de control de ingreso', isHighlighted: false, icon: '🔐' },
    { title: 'Seguridad Electrónica', slug: 'seguridad-electronica', shortDescription: 'Integración de sistemas de seguridad', isHighlighted: false, icon: '⚡' },
  ]

  // Personas objetivo
  const personas = [
    { name: 'Presidente Comunidad', slug: 'presidente-comunidad', title: 'Presidente de Comunidad', description: 'Lidera junta de vecinos o comunidad residencial' },
    { name: 'Admin Condominio', slug: 'admin-condominio', title: 'Administrador de Condominio', description: 'Gestiona administración de edificios o condomini' },
    { name: 'Gerente General', slug: 'gerente-general', title: 'Gerente General', description: 'Directivo de empresa' },
    { name: 'Dueño Casa', slug: 'dueno-casa', title: 'Dueño de Casa', description: 'Propietario residencial' },
    { name: 'Encargado Seguridad', slug: 'encargado-seguridad', title: 'Encargado de Seguridad', description: 'Responsable de seguridad en empresa u organización' },
  ]

  console.log('Data seeds prepared - will be loaded via Payload admin')
}
```

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Fundamentos (Semana 1)

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Crear estructura de carpetas | `/src/collections/`, `/src/hooks/`, `/src/services/` |
| 3-4 | Implementar colecciones sistema + geografía | Users, Media, Settings, Locations, Neighborhoods |
| 5 | Implementar colecciones negocio | Services, Problems, Industries, Solutions, Personas |

### Fase 2: CRM Leads (Semana 2)

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Colección Leads con campos completos | Schema de leads |
| 3 | Hooks de enriquecimiento y duplicados | Detección automática |
| 4 | Scoring rules configurables | UI de configuración |
| 5 | Asignación inteligente | Distribución automática |

### Fase 3: Integración Services (Semana 3)

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | SerperService implementado | Conexión API |
| 3-4 | GLMService implementado | Scoring IA |
| 5 | TelegramService implementado | Notificaciones |

### Fase 4: SEO + Contenido (Semana 4)

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | SeoPages + Keywords | Páginas SEO |
| 3 | Testimonials + Blog | Contenido |
| 4-5 | API Routes custom | Endpoints públicos |

### Fase 5: Testing + Deploy (Semana 5)

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1-2 | Testing completo | Tests passando |
| 3-4 | Migración D1 | Datos iniciales |
| 5 | Deploy a producción | Sitio live |

---

## 11. VERIFICACIÓN DE COMPATIBILIDAD

### Checklist de integración

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    VERIFICACIÓN FINAL                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  □ Arquitectura                                                          │
│    □ Next.js 15 + Payload 3.77 (Cloudflare Workers)    ✅              │
│    □ D1 Database (sqliteD1Adapter)                   ✅              │
│    □ R2 Storage (payload storage)                    ✅              │
│    □ Wrangler config centralizado                    ✅              │
│                                                                          │
│  □ Colecciones (17 principales)                                         │
│    □ users + roles + telegram                    ✅              │
│    □ locations + neighborhoods                      ✅              │
│    □ services + problems + industries              ✅              │
│    □ solutions + personas                           ✅              │
│    □ leads + scoring + duplicates                   ✅              │
│    □ seoPages + keywords                            ✅              │
│    □ blog + testimonials                            ✅              │
│                                                                          │
│  □ Hooks                                                                  │
│    □ enrichLeadBeforeCreate                       ✅              │
│    □ detectDuplicateBeforeCreate                  ✅              │
│    □ scoreLeadAfterCreate (GLM)                    ✅              │
│    □ assignLeadAfterCreate (Telegram)              ✅              │
│                                                                          │
│  □ Services                                                               │
│    □ SerperService                                ✅              │
│    □ GLMService                                   ✅              │
│    □ TelegramService                              ✅              │
│                                                                          │
│  □ API Routes                                                            │
│    □ POST /api/guardman/leads                     ✅              │
│    □ GET /api/guardman/leads/check-duplicate      ✅              │
│    □ GET /api/guardman/sitemap.xml                ✅              │
│                                                                          │
│  □ Configuración                                                          │
│    □ wrangler.jsonc con secrets                   ✅              │
│    □ payload.config.ts con hooks                  ✅              │
│    □ R2 bucket binding                            ✅              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 12. ARCHIVOS A CREAR/MODIFICAR

### Archivos nuevos a crear

```
src/
├── collections/
│   ├── index.ts                           # Export all
│   ├── System/
│   │   ├── Users.ts                       # [NEW]
│   │   └── Settings.ts                    # [NEW]
│   ├── Geography/
│   │   ├── Locations.ts                   # [NEW]
│   │   └── Neighborhoods.ts               # [NEW]
│   ├── Business/
│   │   ├── Services.ts                    # [NEW]
│   │   ├── Problems.ts                    # [NEW]
│   │   ├── Industries.ts                  # [NEW]
│   │   ├── Solutions.ts                   # [NEW]
│   │   └── Personas.ts                    # [NEW]
│   ├── SEO/
│   │   ├── SeoPages.ts                    # [NEW]
│   │   ├── Keywords.ts                    # [NEW]
│   │   └── Testimonials.ts                # [NEW]
│   ├── CRM/
│   │   ├── Leads.ts                       # [MODIFY existing]
│   │   ├── LeadDuplicates.ts              # [NEW]
│   │   └── ScoringRules.ts                # [NEW]
│   └── Content/
│       └── Blog.ts                        # [NEW]
│
├── hooks/
│   ├── index.ts                           # [NEW]
│   └── leads/
│       ├── enrichLead.ts                  # [NEW]
│       ├── detectDuplicate.ts              # [NEW]
│       ├── scoreLead.ts                    # [NEW]
│       └── assignLead.ts                   # [NEW]
│
├── services/
│   ├── SerperService.ts                    # [NEW]
│   ├── GLMService.ts                       # [NEW]
│   └── TelegramService.ts                  # [NEW]
│
└── migrations/
    └── 001_initial_data.ts                 # [NEW]
```

### Archivos a modificar

```
src/
├── payload.config.ts                       # [MODIFY - add collections + hooks]
├── .env.example                            # [MODIFY - add API keys]
└── wrangler.jsonc                          # [MODIFY - add secrets]
```

---

## 13. RESUMEN DE COSTOS

| Recurso | Plan | Costo |
|---------|------|-------|
| **Cloudflare Workers** | <1M requests/mes | $0 |
| **D1** | <1M reads/mes | $0 |
| **R2** | <1GB storage | $0 |
| **Serper.dev** | ~2,000 queries/mes | $0-30/mes |
| **GLM-5** | ~500 calls/mes | $0-20/mes |
| **Telegram** | Unlimited | $0 |

**Costo mensual estimado: $0-50 USD**

---

## 14. PRÓXIMO PASSO

¿Querés que comience con la implementación? Puedo:

| Opción | Descripción |
|--------|-------------|
| **A** | Crear la estructura de carpetas y colecciones del Fase 1 |
| **B** | Implementar las colecciones completas de Sistema + Geografía + Negocio |
| **C** | Implementar el CRM de Leads completo con hooks |
| **D** | Implementar los servicios (Serper, GLM, Telegram) |
| **E** | Implementar todo junto (completo) |

¿Cuál preferís?
