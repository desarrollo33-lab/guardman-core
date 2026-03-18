import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'

/**
 * GUARDMAN V3 - Seed Script Completo
 * Popula todas las colecciones con datos beta
 *
 * Orden de ejecución (por dependencias):
 * 1. BrandDNA (global, sin deps)
 * 2. Services (sin deps)
 * 3. Industries (sin deps)
 * 4. Problems (deps: services)
 * 5. Personas (deps: problems, services, industries)
 * 6. Solutions (deps: industries, personas, services)
 * 7. Locations (sin deps)
 * 8. Prompts (sin deps)
 * 9. Testimonials (deps: locations, services)
 */

// Helper: upsert por slug o identifier
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

async function seed() {
  console.log('🌱 GUARDMAN V3 - Starting seed process...\n')
  const payload = await getPayload({ config: configPromise })

  // ===================================================================
  // 1. BRAND DNA
  // ===================================================================
  console.log('1/9 Seeding BrandDNA...')
  await payload.updateGlobal({
    slug: 'brand-dna',
    data: {
      companyName: 'Guardman',
      legalName: 'Guardman Chile SPA',
      toneOfVoice:
        'B2B, profesional, persuasivo, no alarmista. Experto en seguridad con enfoque tecnológico.',
      coreDifferentiators: [
        { differentiator: 'GuardPod® V1: Sistema autónomo con 15 meses de batería y visión 360°' },
        { differentiator: 'Guardias con curso OS-10 vigente y certificación Ley 21.659' },
        { differentiator: 'Supervisión nocturna con tecnología de última generación' },
        { differentiator: 'Modelo híbrido: guardias humanos + tecnología IA' },
        { differentiator: 'Clientes premium: Courtyard Marriott, Hamptons, Kavak, Embajadas' },
      ],
      strictRules: [
        { rule: 'Siempre mencionar acreditación OS-10 y Ley 21.659' },
        { rule: 'Nunca usar tono alarmista ni sensacionalista' },
        { rule: 'Siempre incluir CTA con teléfono y WhatsApp' },
        { rule: 'Mencionar GuardPod® V1 como diferenciador único' },
        { rule: 'NAP consistente en todas las páginas' },
      ],
      colorPalette: {
        primary: '#1B2B3A',
        secondary: '#C49A2A',
        accent: '#E8E0D0',
      },
      headquartersAddress:
        'Av. Américo Vespucio Norte 1980, Of. 501-01, Providencia, Santiago',
      latitude: -33.4114,
      longitude: -70.6053,
      primaryPhone: '(2) 29461824',
      whatsappNumber: '+56 9 300 000 10',
      supportEmail: 'info@guardman.cl',
    },
    overrideAccess: true,
  })
  console.log('   ✅ BrandDNA seeded')

  // ===================================================================
  // 2. SERVICES (7)
  // ===================================================================
  console.log('2/9 Seeding Services...')
  const servicesData = [
    {
      title: 'Guardias de Seguridad',
      slug: 'guardias-de-seguridad',
      icon: '🛡️',
      shortDescription:
        'Guardias profesionales con curso OS-10 vigente y capacitación continua. Supervisión 24/7.',
      isHighlighted: true,
    },
    {
      title: 'Alarmas Monitoreadas',
      slug: 'alarmas',
      icon: '🚨',
      shortDescription:
        'Sistemas de alarma con monitoreo remoto 24/7 y respuesta inmediata ante emergencias.',
      isHighlighted: true,
    },
    {
      title: 'Cámaras de Seguridad (CCTV)',
      slug: 'camaras-de-seguridad',
      icon: '📹',
      shortDescription:
        'Circuito cerrado de televisión con analítica IA, grabación en la nube y acceso remoto.',
      isHighlighted: true,
    },
    {
      title: 'Control de Acceso',
      slug: 'control-de-acceso',
      icon: '🔐',
      shortDescription:
        'Sistemas de control de ingreso vehicular y peatonal con tecnología biométrica y RFID.',
      isHighlighted: false,
    },
    {
      title: 'Cercos Eléctricos',
      slug: 'cercos-electricos',
      icon: '⚡',
      shortDescription:
        'Cercos eléctricos perimetrales con detección de intrusión y alarma sonora.',
      isHighlighted: false,
    },
    {
      title: 'GuardPod® Protección Autónoma',
      slug: 'guardpod-proteccion-autonoma',
      icon: '🤖',
      shortDescription:
        'Sistema autónomo con visión 360°, 15 meses de batería y monitoreo remoto. Sin cables ni instalación.',
      isHighlighted: true,
    },
    {
      title: 'Patrullaje y Drones',
      slug: 'patrullaje-y-drones',
      icon: '🚁',
      shortDescription:
        'Patrullaje vehicular y aéreo con drones para grandes superficies y zonas rurales.',
      isHighlighted: false,
    },
  ]

  const serviceIds: Record<string, number> = {}
  for (const s of servicesData) {
    serviceIds[s.slug] = await upsert(payload, 'services', { slug: { equals: s.slug } }, s)
  }
  console.log(`   ✅ ${Object.keys(serviceIds).length} services seeded`)

  // ===================================================================
  // 3. INDUSTRIES (5)
  // ===================================================================
  console.log('3/9 Seeding Industries...')
  const industriesData = [
    {
      name: 'Condominios y Comunidades',
      slug: 'condominios',
      icon: '🏘️',
      description:
        'Seguridad integral para condominios, comunidades y edificios residenciales con control de acceso y vigilancia 24/7.',
    },
    {
      name: 'Corporativo y Oficinas',
      slug: 'corporativo',
      icon: '🏢',
      description:
        'Protección corporativa para oficinas, edificios comerciales y centros empresariales de alto valor.',
    },
    {
      name: 'Industrial y Logística',
      slug: 'industrial',
      icon: '🏭',
      description:
        'Vigilancia perimetral, control de acceso vehicular y protección de activos para galpones, bodegas y plantas industriales.',
    },
    {
      name: 'Retail y Comercial',
      slug: 'retail',
      icon: '🏪',
      description:
        'Seguridad para locales comerciales, centros comerciales y retail con prevención de pérdidas.',
    },
    {
      name: 'Embajadas y Diplomático',
      slug: 'embajadas',
      icon: '🏛️',
      description:
        'Seguridad diplomática de alto nivel para embajadas, consulados y residencias oficiales.',
    },
  ]

  const industryIds: Record<string, number> = {}
  for (const i of industriesData) {
    industryIds[i.slug] = await upsert(payload, 'industries', { slug: { equals: i.slug } }, i)
  }
  console.log(`   ✅ ${Object.keys(industryIds).length} industries seeded`)

  // ===================================================================
  // 4. PROBLEMS (5) - deps: services
  // ===================================================================
  console.log('4/9 Seeding Problems...')
  const problemsData = [
    {
      name: 'Robos y Portonazos',
      slug: 'robos-portonazos',
      description:
        'Robos a la propiedad, vehículos y personas. Portonazos en accesos vehiculares a condominios y empresas.',
      relatedServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['camaras-de-seguridad'],
      ],
      isActive: true,
    },
    {
      name: 'Falta de Control de Acceso',
      slug: 'falta-control-acceso',
      description:
        'Ingresos no autorizados de personas o vehículos por falta de sistemas de control.',
      relatedServices: [
        serviceIds['control-de-acceso'],
        serviceIds['guardias-de-seguridad'],
      ],
      isActive: true,
    },
    {
      name: 'Seguridad Nocturna Deficiente',
      slug: 'seguridad-nocturna',
      description:
        'Vulnerabilidad durante horario nocturno por falta de vigilancia o tecnología de detección.',
      relatedServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['alarmas'],
      ],
      isActive: true,
    },
    {
      name: 'Alta Rotación de Guardias',
      slug: 'alta-rotacion-guardias',
      description:
        'Cambio frecuente de personal de seguridad que afecta la calidad del servicio y el conocimiento del sitio.',
      relatedServices: [serviceIds['guardias-de-seguridad']],
      isActive: true,
    },
    {
      name: 'Sin Monitoreo Tecnológico',
      slug: 'sin-monitoreo-tecnologico',
      description:
        'Dependencia exclusiva de guardias humanos sin respaldo tecnológico de cámaras, sensores o alarmas.',
      relatedServices: [
        serviceIds['camaras-de-seguridad'],
        serviceIds['alarmas'],
        serviceIds['guardpod-proteccion-autonoma'],
      ],
      isActive: true,
    },
  ]

  const problemIds: Record<string, number> = {}
  for (const p of problemsData) {
    problemIds[p.slug] = await upsert(payload, 'problems', { slug: { equals: p.slug } }, p)
  }
  console.log(`   ✅ ${Object.keys(problemIds).length} problems seeded`)

  // ===================================================================
  // 5. PERSONAS (6) - deps: problems, services, industries
  // ===================================================================
  console.log('5/9 Seeding Personas...')
  const personasData = [
    {
      name: 'Juan Administrador',
      slug: 'juan-administrador',
      title: 'Administrador de Condominio',
      description:
        'Administrador profesional de condominios. Gestiona la seguridad como parte de sus responsabilidades. Busca proveedores confiables con buen precio.',
      demographics: { ageRange: '35-55', location: 'Santiago Oriente', incomeLevel: 'medium' as const },
      painPoints: [problemIds['robos-portonazos'], problemIds['alta-rotacion-guardias']],
      needs: [
        { need: 'Guardias confiables que no falten' },
        { need: 'Precio competitivo' },
        { need: 'Reportes para la comunidad' },
      ],
      goals: [
        { goal: 'Mantener la seguridad del condominio' },
        { goal: 'Cumplir con el presupuesto' },
      ],
      preferredServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['control-de-acceso'],
      ],
      decisionTimeline: 'short' as const,
      relatedIndustries: [industryIds['condominios']],
      communication: { preferredChannel: 'whatsapp' as const, tone: 'semi_formal' as const },
      scoring: { baseScore: 15, urgencyWeight: 15 },
      isActive: true,
    },
    {
      name: 'Marcela Presidente',
      slug: 'marcela-presidente',
      title: 'Presidente Comunidad Vecinal',
      description:
        'Presidente de comunidad. Toma decisiones de seguridad que afectan a toda la comunidad. Busca soluciones que generen confianza entre los vecinos.',
      demographics: { ageRange: '40-60', location: 'Sector Oriente', incomeLevel: 'high' as const },
      painPoints: [problemIds['robos-portonazos'], problemIds['seguridad-nocturna']],
      needs: [
        { need: 'Solución integral que tranquilice a vecinos' },
        { need: 'Empresa con buena reputación' },
        { need: 'Informes periódicos' },
      ],
      goals: [
        { goal: 'Reducir incidentes de seguridad' },
        { goal: 'Aumentar el valor de las propiedades' },
      ],
      preferredServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['alarmas'],
      ],
      decisionTimeline: 'medium' as const,
      relatedIndustries: [industryIds['condominios']],
      communication: { preferredChannel: 'email' as const, tone: 'formal' as const },
      scoring: { baseScore: 20, urgencyWeight: 15 },
      isActive: true,
    },
    {
      name: 'Roberto Gerente',
      slug: 'roberto-gerente',
      title: 'Gerente General',
      description:
        'Gerente que toma decisiones estratégicas. Busca proveedores de seguridad que ofrezcan tecnología avanzada y SLA garantizado.',
      demographics: { ageRange: '40-55', location: 'Las Condes / Providencia', incomeLevel: 'premium' as const },
      painPoints: [problemIds['sin-monitoreo-tecnologico'], problemIds['alta-rotacion-guardias']],
      needs: [
        { need: 'Tecnología de punta' },
        { need: 'SLA con tiempos de respuesta garantizados' },
        { need: 'Facturación empresarial' },
      ],
      goals: [
        { goal: 'Proteger activos corporativos' },
        { goal: 'Cumplir normativas de seguridad' },
      ],
      preferredServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['guardpod-proteccion-autonoma'],
      ],
      decisionTimeline: 'medium' as const,
      relatedIndustries: [industryIds['corporativo']],
      communication: { preferredChannel: 'email' as const, tone: 'formal' as const },
      scoring: { baseScore: 25, urgencyWeight: 20 },
      isActive: true,
    },
    {
      name: 'Carolina Seguridad',
      slug: 'carolina-seguridad',
      title: 'Encargada de Seguridad Corporativa',
      description:
        'Profesional de seguridad corporativa. Evalúa proveedores con criterios técnicos. Necesita KPIs y métricas.',
      demographics: { ageRange: '30-45', location: 'Santiago Centro / Las Condes', incomeLevel: 'high' as const },
      painPoints: [problemIds['alta-rotacion-guardias'], problemIds['sin-monitoreo-tecnologico']],
      needs: [
        { need: 'Cumplimiento de protocolos OS-10' },
        { need: 'Dashboards de monitoreo' },
        { need: 'Integración con sistemas existentes' },
      ],
      goals: [
        { goal: 'Reducir incidentes a cero' },
        { goal: 'Reportes automatizados' },
      ],
      preferredServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['control-de-acceso'],
      ],
      decisionTimeline: 'short' as const,
      relatedIndustries: [industryIds['corporativo']],
      communication: { preferredChannel: 'email' as const, tone: 'formal' as const },
      scoring: { baseScore: 20, urgencyWeight: 18 },
      isActive: true,
    },
    {
      name: 'Pedro Propietario',
      slug: 'pedro-propietario',
      title: 'Dueño de Casa',
      description:
        'Propietario de vivienda particular que busca seguridad para su hogar y familia. Decide rápido cuando hay urgencia.',
      demographics: { ageRange: '35-65', location: 'Vitacura / Lo Barnechea / La Reina', incomeLevel: 'medium' as const },
      painPoints: [problemIds['robos-portonazos'], problemIds['seguridad-nocturna']],
      needs: [
        { need: 'Tranquilidad para su familia' },
        { need: 'Sistema confiable sin fallos' },
      ],
      goals: [{ goal: 'Proteger a su familia y propiedad' }],
      preferredServices: [
        serviceIds['alarmas'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['cercos-electricos'],
      ],
      decisionTimeline: 'immediate' as const,
      relatedIndustries: [industryIds['condominios']],
      communication: { preferredChannel: 'whatsapp' as const, tone: 'semi_formal' as const },
      scoring: { baseScore: 10, urgencyWeight: 20 },
      isActive: true,
    },
    {
      name: 'Fernando Dueño',
      slug: 'fernando-dueno',
      title: 'Dueño de Galpones / Empresario Industrial',
      description:
        'Empresario dueño de galpones, bodegas o plantas industriales. Opera en zonas como Lampa, Quilicura, Renca, Pudahuel o Huechuraba. Toma decisiones de inversión en seguridad con ticket alto. Busca protección de activos, control de acceso vehicular y vigilancia perimetral 24/7.',
      demographics: {
        ageRange: '40-60',
        location: 'Las Condes / Vitacura (vive) + Lampa / Quilicura (opera)',
        incomeLevel: 'premium' as const,
      },
      painPoints: [
        problemIds['robos-portonazos'],
        problemIds['sin-monitoreo-tecnologico'],
        problemIds['falta-control-acceso'],
      ],
      needs: [
        { need: 'Protección de activos de alto valor' },
        { need: 'Control de camiones e inventario' },
        { need: 'Cobertura nocturna autónoma' },
        { need: 'SLA garantizado' },
        { need: 'Facturación empresarial' },
      ],
      goals: [
        { goal: 'Reducir merma por robo' },
        { goal: 'Cumplir normativa de seguridad' },
        { goal: 'Proteger personal e instalaciones' },
      ],
      preferredServices: [
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['cercos-electricos'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['guardias-de-seguridad'],
      ],
      decisionTimeline: 'medium' as const,
      relatedIndustries: [industryIds['industrial']],
      communication: { preferredChannel: 'email' as const, tone: 'formal' as const },
      scoring: { baseScore: 25, urgencyWeight: 20 },
      isActive: true,
    },
  ]

  const personaIds: Record<string, number> = {}
  for (const p of personasData) {
    personaIds[p.slug] = await upsert(payload, 'personas', { slug: { equals: p.slug } }, p)
  }
  console.log(`   ✅ ${Object.keys(personaIds).length} personas seeded`)

  // ===================================================================
  // 6. SOLUTIONS (3) - deps: industries, personas, services
  // ===================================================================
  console.log('6/9 Seeding Solutions...')
  const solutionsData = [
    {
      title: 'Seguridad Integral para Condominios',
      slug: 'seguridad-integral-condominios',
      shortDescription:
        'Paquete completo de seguridad diseñado para condominios y comunidades residenciales.',
      icon: '🏘️',
      industry: industryIds['condominios'],
      targetPersonas: [
        personaIds['juan-administrador'],
        personaIds['marcela-presidente'],
        personaIds['pedro-propietario'],
      ],
      relatedServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['control-de-acceso'],
      ],
      includes: [
        { item: 'Guardias 24/7 con curso OS-10' },
        { item: 'CCTV con grabación 30 días' },
        { item: 'Control de acceso vehicular' },
        { item: 'Rondas nocturnas verificadas' },
      ],
      benefits: [
        { benefit: 'Reducción de incidentes hasta 95%' },
        { benefit: 'Reportes semanales para la comunidad' },
        { benefit: 'Guardias dedicados que conocen el condominio' },
      ],
    },
    {
      title: 'Protección Corporativa Premium',
      slug: 'proteccion-corporativa-premium',
      shortDescription:
        'Seguridad de alto nivel para oficinas corporativas y edificios empresariales.',
      icon: '🏢',
      industry: industryIds['corporativo'],
      targetPersonas: [
        personaIds['roberto-gerente'],
        personaIds['carolina-seguridad'],
      ],
      relatedServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['control-de-acceso'],
        serviceIds['alarmas'],
      ],
      includes: [
        { item: 'Guardias especializados en protocolo corporativo' },
        { item: 'CCTV con analítica IA' },
        { item: 'Control de acceso biométrico' },
        { item: 'Monitoreo remoto 24/7' },
      ],
      benefits: [
        { benefit: 'SLA garantizado con tiempos de respuesta' },
        { benefit: 'Dashboard en tiempo real' },
        { benefit: 'Integración con sistemas corporativos' },
      ],
    },
    {
      title: 'Vigilancia Industrial Autónoma',
      slug: 'vigilancia-industrial-autonoma',
      shortDescription:
        'Solución de seguridad perimetral autónoma para galpones, bodegas y plantas industriales.',
      icon: '🏭',
      industry: industryIds['industrial'],
      targetPersonas: [
        personaIds['fernando-dueno'],
        personaIds['roberto-gerente'],
      ],
      relatedServices: [
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['cercos-electricos'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['guardias-de-seguridad'],
      ],
      includes: [
        { item: 'GuardPod® V1 con visión 360°' },
        { item: 'Cerco eléctrico perimetral' },
        { item: 'CCTV industrial' },
        { item: 'Control de acceso vehicular para camiones' },
      ],
      benefits: [
        { benefit: 'Cobertura nocturna sin costo de guardias adicionales' },
        { benefit: '15 meses de autonomía por GuardPod®' },
        { benefit: 'Ideal para zonas aisladas' },
      ],
    },
  ]

  for (const s of solutionsData) {
    await upsert(payload, 'solutions', { slug: { equals: s.slug } }, s)
  }
  console.log(`   ✅ ${solutionsData.length} solutions seeded`)

  // ===================================================================
  // 7. LOCATIONS (14)
  // ===================================================================
  console.log('7/9 Seeding Locations...')
  const locationsData = [
    // Región Metropolitana (12)
    {
      name: 'Lampa',
      slug: 'lampa',
      region: 'rm',
      geoZone: 'norte',
      tier: 'emerging',
      economicDriver: 'industrial',
      priorityScore: 90,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Mega zona industrial, 400+ empresas, galpones, centro logístico norte de Santiago. Población 100k+. Parques industriales en expansión.',
    },
    {
      name: 'Quilicura',
      slug: 'quilicura',
      region: 'rm',
      geoZone: 'norte',
      tier: 'medium',
      economicDriver: 'industrial',
      priorityScore: 88,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Gran polo industrial y logístico. Bodegas, centros de distribución, zona franca. Ruta 5 Norte.',
    },
    {
      name: 'Conchalí',
      slug: 'conchali',
      region: 'rm',
      geoZone: 'norte',
      tier: 'emerging',
      economicDriver: 'mixto_masivo',
      priorityScore: 60,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Mixto residencial-comercial. Oficina actual de Guardman. Conectividad norte.',
    },
    {
      name: 'Huechuraba',
      slug: 'huechuraba',
      region: 'rm',
      geoZone: 'norte',
      tier: 'medium',
      economicDriver: 'industrial',
      priorityScore: 85,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Ciudad Empresarial + zona industrial. Parques de oficinas premium y bodegas. Gran potencial B2B.',
    },
    {
      name: 'Las Condes',
      slug: 'las-condes',
      region: 'rm',
      geoZone: 'oriente',
      tier: 'premium',
      economicDriver: 'corporativo_premium',
      priorityScore: 100,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Corporativo premium. El Golf, embajadas, retail de lujo. Donde viven los tomadores de decisiones.',
    },
    {
      name: 'Vitacura',
      slug: 'vitacura',
      region: 'rm',
      geoZone: 'oriente',
      tier: 'premium',
      economicDriver: 'residencial_premium',
      priorityScore: 98,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Residencial alto y embajadas. Casas de lujo, condominios exclusivos.',
    },
    {
      name: 'Lo Barnechea',
      slug: 'lo-barnechea',
      region: 'rm',
      geoZone: 'nororiente',
      tier: 'premium',
      economicDriver: 'residencial_premium',
      priorityScore: 95,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Condominios exclusivos, parcelas extensas. Seguridad perimetral prioritaria.',
    },
    {
      name: 'La Reina',
      slug: 'la-reina',
      region: 'rm',
      geoZone: 'oriente',
      tier: 'high',
      economicDriver: 'residencial_premium',
      priorityScore: 80,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Residencial arbolado, condominios de buen nivel. Conectividad metro.',
    },
    {
      name: 'Renca',
      slug: 'renca',
      region: 'rm',
      geoZone: 'norte',
      tier: 'emerging',
      economicDriver: 'industrial',
      priorityScore: 82,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Parque Industrial El Montijo (200+ hectáreas). Galpones, logística, acceso a Ruta 5 y Vespucio. Reconversión industrial en curso.',
    },
    {
      name: 'Pudahuel',
      slug: 'pudahuel',
      region: 'rm',
      geoZone: 'poniente',
      tier: 'emerging',
      economicDriver: 'industrial',
      priorityScore: 75,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Aeropuerto, zona industrial, bodegas de carga. Enlink Logístico, crecimiento urbano.',
    },
    {
      name: 'La Pintana',
      slug: 'la-pintana',
      region: 'rm',
      geoZone: 'sur',
      tier: 'emerging',
      economicDriver: 'mixto_masivo',
      priorityScore: 55,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        '849+ establecimientos industriales. Manufactura, bodegas, pymes. Comuna en desarrollo con demanda de seguridad básica.',
    },
    {
      name: 'Santiago Centro',
      slug: 'santiago-centro',
      region: 'rm',
      geoZone: 'centro',
      tier: 'medium',
      economicDriver: 'comercial_alta_densidad',
      priorityScore: 89,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Centro financiero y comercial. Bancos, retail, oficinas gubernamentales. Alto tráfico, alta demanda.',
    },
    // Región de Valparaíso (2)
    {
      name: 'Los Andes',
      slug: 'los-andes',
      region: 'valparaiso',
      geoZone: 'aconcagua',
      tier: 'medium',
      economicDriver: 'industrial',
      priorityScore: 78,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Capital provincial de Aconcagua. Minería (Codelco Andina, cobre), agroindustria, transporte cordillerano. Población ~70k. Demanda de seguridad industrial y minera.',
    },
    {
      name: 'San Felipe',
      slug: 'san-felipe',
      region: 'valparaiso',
      geoZone: 'aconcagua',
      tier: 'emerging',
      economicDriver: 'industrial',
      priorityScore: 70,
      isActive: true,
      enrichmentStatus: 'completed',
      characteristics:
        'Agroindustria, fruticultura de exportación, gestión de residuos industriales. Población ~84k. Zona rural-urbana con crecimiento de bodegas y frigoríficos.',
    },
  ]

  const locationIds: Record<string, number> = {}
  for (const loc of locationsData) {
    locationIds[loc.slug] = await upsert(
      payload,
      'locations',
      { slug: { equals: loc.slug } },
      loc,
    )
  }
  console.log(`   ✅ ${Object.keys(locationIds).length} locations seeded`)

  // ===================================================================
  // 8. PROMPTS (4)
  // ===================================================================
  console.log('8/9 Seeding Prompts...')
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

  for (const promptData of prompts) {
    await upsert(
      payload,
      'prompts',
      { identifier: { equals: promptData.identifier } },
      promptData,
    )
  }
  console.log(`   ✅ ${prompts.length} prompts seeded`)

  // ===================================================================
  // 9. TESTIMONIALS (3) - deps: locations, services
  // ===================================================================
  console.log('9/9 Seeding Testimonials...')
  const testimonialsData = [
    {
      clientName: 'Carlos Mendoza',
      company: 'Condominio Los Robles, Providencia',
      position: 'Presidente de Comunidad',
      testimonial:
        'Desde que contratamos a Guardman, los incidentes de seguridad se redujeron a cero. Los guardias son profesionales y el sistema de CCTV nos da total tranquilidad. Excelente servicio.',
      rating: 5,
      location: locationIds['las-condes'],
      service: [serviceIds['guardias-de-seguridad']],
      industry: industryIds['condominios'],
      isActive: true,
      isFeatured: true,
    },
    {
      clientName: 'Andrea Valenzuela',
      company: 'Hamptons Residencial',
      position: 'Administradora',
      testimonial:
        'La combinación de guardias capacitados con cámaras inteligentes ha transformado la seguridad de nuestro condominio. El equipo de Guardman es muy profesional y responsable.',
      rating: 5,
      location: locationIds['las-condes'],
      service: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
      ],
      industry: industryIds['condominios'],
      isActive: true,
      isFeatured: true,
    },
    {
      clientName: 'Roberto Fuentes',
      company: 'Kavak Chile',
      position: 'Gerente de Operaciones',
      testimonial:
        'El GuardPod® ha sido un game changer para nuestras instalaciones en Huechuraba. Cobertura nocturna sin necesidad de guardias extras. La tecnología de Guardman es realmente innovadora.',
      rating: 5,
      location: locationIds['huechuraba'],
      service: [
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['cercos-electricos'],
      ],
      industry: industryIds['industrial'],
      isActive: true,
      isFeatured: true,
    },
  ]

  for (const t of testimonialsData) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: {
        clientName: { equals: t.clientName },
        company: { equals: t.company },
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'testimonials',
        id: existing.docs[0].id,
        data: t,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'testimonials', data: t, overrideAccess: true })
    }
  }
  console.log(`   ✅ ${testimonialsData.length} testimonials seeded`)

  // ===================================================================
  // DONE
  // ===================================================================
  console.log('\n🎉 GUARDMAN V3 - Seed completed successfully!')
  console.log(`
  Summary:
  - Brand DNA: ✅ updated
  - Services: ${Object.keys(serviceIds).length}
  - Industries: ${Object.keys(industryIds).length}
  - Problems: ${Object.keys(problemIds).length}
  - Personas: ${Object.keys(personaIds).length} (includes Fernando Dueño)
  - Solutions: ${solutionsData.length}
  - Locations: ${Object.keys(locationIds).length} (12 RM + 2 Valparaíso)
  - Prompts: ${prompts.length}
  - Testimonials: ${testimonialsData.length}
  `)

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
