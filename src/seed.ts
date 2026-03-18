import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'

async function seed() {
  console.log('Starting seed process...')
  const payload = await getPayload({ config: configPromise })

  console.log('Seeding BrandDNA...')

  await payload.updateGlobal({
    slug: 'brand-dna',
    data: {
      companyName: 'Guardman',
      legalName: 'Guardman SpA',
      toneOfVoice:
        'B2B, profesional, persuasivo, no alarmista, experto en seguridad industrial y corporativa.',
      coreDifferentiators: [
        { differentiator: 'GuardPod V1 autónomo 15 meses' },
        { differentiator: 'Supervisión nocturna preventiva' },
        { differentiator: 'Respuesta inmediata certificada' },
      ],
      strictRules: [
        { rule: 'Mencionar siempre: Guardias con curso OS-10 vigente' },
        { rule: 'Referenciar cumplimiento de la Ley 21.659' },
      ],
      headquartersAddress: 'Santiago, Chile',
    },
    overrideAccess: true,
  })

  console.log('BrandDNA seeded.')

  console.log('Seeding Prompts...')

  // Prompts para el Pipeline de Enrichment
  const prompts = [
    {
      identifier: 'analyze_location',
      description:
        'Step 1: Análisis estratégico de la ubicación - Determina el economic driver, problemas de seguridad y recommends Hub',
      systemPrompt:
        'Eres un analista estratégico de seguridad B2B para el mercado chileno. Analizas datos de búsqueda para determinar el perfil de riesgo y oportunidad de una comuna.',
      userPromptTemplate: `Analiza la comuna de {{location}} en Chile.

Datos de Serper orgánicos:
{{serperData}}

Basado en los resultados de búsqueda, determina:
1. El "economicDriver": "industrial", "corporativo_premium", "comercial_alta_densidad", "residencial_premium", o "mixto_masivo"
2. Los principales "securityProblems" (array de problemas de seguridad que buscan)
3. El "recommendedHub" (qué tipo de página padre debería crear)

Responde en JSON exacto:
{
  "economicDriver": "...",
  "securityProblems": ["...", "..."],
  "recommendedHub": "..."
}`,
      expectedOutputSchema: {
        type: 'object',
        properties: {
          economicDriver: {
            type: 'string',
            enum: [
              'industrial',
              'corporativo_premium',
              'comercial_alta_densidad',
              'residencial_premium',
              'mixto_masivo',
            ],
          },
          securityProblems: { type: 'array', items: { type: 'string' } },
          recommendedHub: { type: 'string' },
        },
        required: ['economicDriver', 'securityProblems', 'recommendedHub'],
      },
    },
    {
      identifier: 'outline_cluster',
      description: 'Step 2: Genera la estructura Hub & Spoke para una comuna',
      systemPrompt: 'Eres un experto en SEO B2B para empresas de seguridad privada en Chile.',
      userPromptTemplate: `Diseña una estructura Hub & Spoke para la comuna: {{location}}. 

Driver Económico: {{economicDriver}}

Datos de Serper orgánicos detectados:
{{serperData}}

Genera un JSON con un array 'pages' que contenga el hub y 2 spokes. El hub debe tener 'pageType': 'hub' y los spokes 'pageType': 'spoke'. Tienen que tener 'title', 'slug', y 'pageType'.`,
      expectedOutputSchema: {
        type: 'object',
        properties: {
          pages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                pageType: { type: 'string', enum: ['hub', 'spoke'] },
              },
              required: ['title', 'slug', 'pageType'],
            },
          },
        },
        required: ['pages'],
      },
    },
    {
      identifier: 'write_hero_section',
      description: 'Step 3a: Genera la sección Hero para una página SEO',
      systemPrompt:
        'Eres un copywriter experto en seguridad privada B2B para el mercado chileno. Escribes textos persuasivos, profesionales y orientados a conversión.',
      userPromptTemplate: `Escribe la sección Hero para una página de seguridad en {{location}}.

Persona objetivo: {{persona}}
Problema principal: {{problem}}
Motor económico de la zona: {{economicDriver}}

Genera en JSON:
{
  "headline": "Título principal (máx 60 caracteres)",
  "subheadline": "Subtítulo persuasivo (máx 120 caracteres)", 
  "ctaText": "Texto del botón CTA"
}`,
      expectedOutputSchema: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          subheadline: { type: 'string' },
          ctaText: { type: 'string' },
        },
        required: ['headline', 'subheadline', 'ctaText'],
      },
    },
    {
      identifier: 'write_faq',
      description: 'Step 3b: Genera FAQs basadas en People Also Ask de Serper',
      systemPrompt:
        'Eres un experto en contenido SEO y atención al cliente para seguridad privada en Chile. Conviertes preguntas de clientes en respuestas útiles.',
      userPromptTemplate: `Genera Frequently Asked Questions (FAQs) para una página de seguridad en {{location}}.

Problemas de seguridad detectados:
{{problems}}

Datos de People Also Ask de Serper:
{{peopleAlsoAsk}}

Genera un array JSON de preguntas y respuestas:
[
  {
    "question": "Pregunta frecuente...",
    "answer": "Respuesta detallada..."
  }
]

Genera 5 FAQs relevantes para el público de {{location}}.`,
      expectedOutputSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            answer: { type: 'string' },
          },
          required: ['question', 'answer'],
        },
      },
    },
  ]

  // Seed each prompt
  for (const promptData of prompts) {
    const existingPrompt = await payload.find({
      collection: 'prompts',
      where: { identifier: { equals: promptData.identifier } },
    })

    if (existingPrompt.totalDocs === 0) {
      await payload.create({
        collection: 'prompts',
        data: promptData,
        overrideAccess: true,
      })
      console.log(`Prompt "${promptData.identifier}" created.`)
    } else {
      await payload.update({
        collection: 'prompts',
        id: existingPrompt.docs[0].id,
        data: promptData,
        overrideAccess: true,
      })
      console.log(`Prompt "${promptData.identifier}" updated.`)
    }
  }

  console.log('Prompts seeded.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
