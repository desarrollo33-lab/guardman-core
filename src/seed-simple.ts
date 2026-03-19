import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'

async function upsert(
  payload: any,
  collection: string,
  where: Record<string, any>,
  data: Record<string, any>,
): Promise<number> {
  const existing = await payload.find({ collection, where, limit: 1, overrideAccess: true })
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
  console.log('🌱 GUARDMAN V3 - Starting seed (no schema sync)...')

  const payload = await getPayload({ config: configPromise })

  console.log('1/9 Seeding BrandDNA...')
  await payload.updateGlobal({
    slug: 'brand-dna',
    data: {
      companyName: 'Guardman',
      legalName: 'Guardman Chile SPA',
      toneOfVoice: 'B2B, profesional, persuasivo, no alarmista',
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
      colorPalette: { primary: '#1B2B3A', secondary: '#C49A2A', accent: '#E8E0D0' },
      headquartersAddress: 'Av. Américo Vespucio Norte 1980, Of. 501-01, Providencia, Santiago',
      latitude: -33.4114,
      longitude: -70.6053,
      primaryPhone: '(2) 29461824',
      whatsappNumber: '+56 9 300 000 10',
      supportEmail: 'info@guardman.cl',
    },
    overrideAccess: true,
  })
  console.log('   ✅ BrandDNA seeded')

  const servicesData = [
    {
      title: 'Guardias de Seguridad',
      slug: 'guardias-de-seguridad',
      icon: '🛡️',
      shortDescription: 'Guardias profesionales con curso OS-10',
      isHighlighted: true,
    },
    {
      title: 'Alarmas Monitoreadas',
      slug: 'alarmas',
      icon: '🚨',
      shortDescription: 'Sistemas de alarma con monitoreo 24/7',
      isHighlighted: true,
    },
    {
      title: 'Cámaras de Seguridad (CCTV)',
      slug: 'camaras-de-seguridad',
      icon: '📹',
      shortDescription: 'Circuito cerrado con analítica IA',
      isHighlighted: true,
    },
    {
      title: 'Control de Acceso',
      slug: 'control-de-acceso',
      icon: '🔐',
      shortDescription: 'Control de ingreso biométrico y RFID',
      isHighlighted: false,
    },
    {
      title: 'Cercos Eléctricos',
      slug: 'cercos-electricos',
      icon: '⚡',
      shortDescription: 'Cercos perimetrales con detección',
      isHighlighted: false,
    },
    {
      title: 'GuardPod® Protección Autónoma',
      slug: 'guardpod-proteccion-autonoma',
      icon: '🤖',
      shortDescription: 'Sistema autónomo 15 meses batería',
      isHighlighted: true,
    },
    {
      title: 'Patrullaje y Drones',
      slug: 'patrullaje-y-drones',
      icon: '🚁',
      shortDescription: 'Patrullaje vehicular y aéreo',
      isHighlighted: false,
    },
  ]

  const serviceIds: Record<string, number> = {}
  for (const s of servicesData) {
    serviceIds[s.slug] = await upsert(payload, 'services', { slug: { equals: s.slug } }, s)
  }
  console.log(`   ✅ ${Object.keys(serviceIds).length} services seeded`)

  const industriesData = [
    {
      name: 'Condominios y Comunidades',
      slug: 'condominios',
      icon: '🏘️',
      description: 'Seguridad para condominios y comunidades',
    },
    {
      name: 'Corporativo y Oficinas',
      slug: 'corporativo',
      icon: '🏢',
      description: 'Protección corporativa premium',
    },
    {
      name: 'Industrial y Logística',
      slug: 'industrial',
      icon: '🏭',
      description: 'Vigilancia perimetral industrial',
    },
    {
      name: 'Retail y Comercial',
      slug: 'retail',
      icon: '🏪',
      description: 'Seguridad para retail',
    },
    {
      name: 'Embajadas y Diplomático',
      slug: 'embajadas',
      icon: '🏛️',
      description: 'Seguridad diplomática de alto nivel',
    },
  ]

  const industryIds: Record<string, number> = {}
  for (const i of industriesData) {
    industryIds[i.slug] = await upsert(payload, 'industries', { slug: { equals: i.slug } }, i)
  }
  console.log(`   ✅ ${Object.keys(industryIds).length} industries seeded`)

  const problemsData = [
    {
      name: 'Robos y Portonazos',
      slug: 'robos-portonazos',
      description: 'Robos a la propiedad y vehículos',
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
      description: 'Ingresos no autorizados',
      relatedServices: [serviceIds['control-de-acceso'], serviceIds['guardias-de-seguridad']],
      isActive: true,
    },
    {
      name: 'Seguridad Nocturna Deficiente',
      slug: 'seguridad-nocturna',
      description: 'Vulnerabilidad nocturna',
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
      description: 'Cambio frecuente de personal',
      relatedServices: [serviceIds['guardias-de-seguridad']],
      isActive: true,
    },
    {
      name: 'Sin Monitoreo Tecnológico',
      slug: 'sin-monitoreo-tecnologico',
      description: 'Dependencia exclusiva de guardias',
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

  const personasData = [
    {
      name: 'Juan Administrador',
      slug: 'juan-administrador',
      title: 'Administrador de Condominio',
      description: 'Administrador profesional de condominios',
      demographics: {
        ageRange: '35-55',
        location: 'Santiago Oriente',
        incomeLevel: 'medium' as const,
      },
      painPoints: [problemIds['robos-portonazos'], problemIds['alta-rotacion-guardias']],
      needs: [{ need: 'Guardias confiables' }, { need: 'Precio competitivo' }],
      goals: [{ goal: 'Mantener seguridad del condominio' }],
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
      description: 'Presidenta de comunidad',
      demographics: { ageRange: '40-60', location: 'Sector Oriente', incomeLevel: 'high' as const },
      painPoints: [problemIds['robos-portonazos'], problemIds['seguridad-nocturna']],
      needs: [{ need: 'Solución integral' }, { need: 'Buena reputación' }],
      goals: [{ goal: 'Reducir incidentes' }],
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
      description: 'Gerente corporativo',
      demographics: { ageRange: '40-55', location: 'Las Condes', incomeLevel: 'premium' as const },
      painPoints: [problemIds['sin-monitoreo-tecnologico'], problemIds['alta-rotacion-guardias']],
      needs: [{ need: 'Tecnología de punta' }, { need: 'SLA garantizado' }],
      goals: [{ goal: 'Proteger activos corporativos' }],
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
      title: 'Encargada de Seguridad',
      description: 'Profesional de seguridad corporativa',
      demographics: {
        ageRange: '30-45',
        location: 'Santiago Centro',
        incomeLevel: 'high' as const,
      },
      painPoints: [problemIds['alta-rotacion-guardias'], problemIds['sin-monitoreo-tecnologico']],
      needs: [{ need: 'Cumplimiento OS-10' }, { need: 'Dashboards' }],
      goals: [{ goal: 'Reducir incidentes a cero' }],
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
      description: 'Propietario de vivienda',
      demographics: {
        ageRange: '35-65',
        location: 'Vitacura / Lo Barnechea',
        incomeLevel: 'medium' as const,
      },
      painPoints: [problemIds['robos-portonazos'], problemIds['seguridad-nocturna']],
      needs: [{ need: 'Tranquilidad familiar' }, { need: 'Sistema confiable' }],
      goals: [{ goal: 'Proteger a su familia' }],
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
      title: 'Dueño de Galpones',
      description: 'Empresario industrial',
      demographics: {
        ageRange: '40-60',
        location: 'Las Condes (vive) + Lampa (opera)',
        incomeLevel: 'premium' as const,
      },
      painPoints: [
        problemIds['robos-portonazos'],
        problemIds['sin-monitoreo-tecnologico'],
        problemIds['falta-control-acceso'],
      ],
      needs: [
        { need: 'Protección de activos' },
        { need: 'Control vehicular' },
        { need: 'Cobertura nocturna' },
      ],
      goals: [{ goal: 'Reducir merma por robo' }],
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

  const solutionsData = [
    {
      title: 'Seguridad Integral para Condominios',
      slug: 'seguridad-integral-condominios',
      shortDescription: 'Paquete completo para condominios',
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
        { item: 'Guardias 24/7 con OS-10' },
        { item: 'CCTV 30 días' },
        { item: 'Control vehicular' },
      ],
      benefits: [{ benefit: 'Reducción 95% incidentes' }, { benefit: 'Reportes semanales' }],
    },
    {
      title: 'Protección Corporativa Premium',
      slug: 'proteccion-corporativa-premium',
      shortDescription: 'Seguridad de alto nivel corporativo',
      icon: '🏢',
      industry: industryIds['corporativo'],
      targetPersonas: [personaIds['roberto-gerente'], personaIds['carolina-seguridad']],
      relatedServices: [
        serviceIds['guardias-de-seguridad'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['control-de-acceso'],
        serviceIds['alarmas'],
      ],
      includes: [
        { item: 'Guardias protocolo corporativo' },
        { item: 'CCTV con analítica IA' },
        { item: 'Control biométrico' },
      ],
      benefits: [{ benefit: 'SLA garantizado' }, { item: 'Dashboard en tiempo real' }],
    },
    {
      title: 'Vigilancia Industrial Autónoma',
      slug: 'vigilancia-industrial-autonoma',
      shortDescription: 'Seguridad perimetral autónoma',
      icon: '🏭',
      industry: industryIds['industrial'],
      targetPersonas: [personaIds['fernando-dueno'], personaIds['roberto-gerente']],
      relatedServices: [
        serviceIds['guardpod-proteccion-autonoma'],
        serviceIds['cercos-electricos'],
        serviceIds['camaras-de-seguridad'],
        serviceIds['guardias-de-seguridad'],
      ],
      includes: [
        { item: 'GuardPod® V1 360°' },
        { item: 'Cerco eléctrico' },
        { item: 'CCTV industrial' },
      ],
      benefits: [{ benefit: 'Cobertura nocturna sin guardias' }, { benefit: '15 meses autonomía' }],
    },
  ]

  for (const s of solutionsData) {
    await upsert(payload, 'solutions', { slug: { equals: s.slug } }, s)
  }
  console.log(`   ✅ ${solutionsData.length} solutions seeded`)

  const locationsData = [
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
      characteristics: 'Mega zona industrial, 400+ empresas',
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
      characteristics: 'Gran polo logístico y industrial',
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
      characteristics: 'Mixto residencial-comercial',
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
      characteristics: 'Ciudad Empresarial + zona industrial',
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
      characteristics: 'Corporativo premium, embajadas',
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
      characteristics: 'Residencial alto y embajadas',
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
      characteristics: 'Condominios exclusivos',
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
      characteristics: 'Residencial arbolado',
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
      characteristics: 'Parque Industrial El Montijo',
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
      characteristics: 'Aeropuerto, zona industrial',
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
      characteristics: '849+ establecimientos industriales',
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
      characteristics: 'Centro financiero y comercial',
    },
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
      characteristics: 'Capital provincial Aconcagua',
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
      characteristics: 'Agroindustria y fruticultura',
    },
  ]

  for (const loc of locationsData) {
    await upsert(payload, 'locations', { slug: { equals: loc.slug } }, loc)
  }
  console.log(`   ✅ ${locationsData.length} locations seeded`)

  const locationIds: Record<string, number> = {}
  for (const loc of locationsData) {
    const existing = await payload.find({
      collection: 'locations',
      where: { slug: { equals: loc.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) locationIds[loc.slug] = existing.docs[0].id
  }

  const testimonialsData = [
    {
      clientName: 'Carlos Mendoza',
      company: 'Condominio Los Robles',
      position: 'Presidente',
      testimonial: 'Excelente servicio, incidentes reducidos a cero',
      rating: 5,
      location: locationIds?.['las-condes'] || 1,
      service: [serviceIds['guardias-de-seguridad']],
      industry: industryIds['condominios'],
      isActive: true,
      isFeatured: true,
    },
    {
      clientName: 'Andrea Valenzuela',
      company: 'Hamptons Residencial',
      position: 'Administradora',
      testimonial: 'Combinación de guardias y cámaras excelente',
      rating: 5,
      location: locationIds?.['las-condes'] || 1,
      service: [serviceIds['guardias-de-seguridad'], serviceIds['camaras-de-seguridad']],
      industry: industryIds['condominios'],
      isActive: true,
      isFeatured: true,
    },
    {
      clientName: 'Roberto Fuentes',
      company: 'Kavak Chile',
      position: 'Gerente Operaciones',
      testimonial: 'GuardPod ha sido un game changer',
      rating: 5,
      location: locationIds?.['huechuraba'] || 1,
      service: [serviceIds['guardpod-proteccion-autonoma'], serviceIds['cercos-electricos']],
      industry: industryIds['industrial'],
      isActive: true,
      isFeatured: true,
    },
  ]

  for (const t of testimonialsData) {
    await upsert(
      payload,
      'testimonials',
      { clientName: { equals: t.clientName }, company: { equals: t.company } },
      t,
    )
  }
  console.log(`   ✅ ${testimonialsData.length} testimonials seeded`)

  console.log('\n🎉 Seed completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
