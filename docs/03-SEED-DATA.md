# 🌱 SEED DATA - Guardman Gateway Beta

> **Fuentes:** market_research.md, seo-seguridad-privada-santiago.md, guardman.cl, investigación web

---

## 1. BRAND DNA

```json
{
  "companyName": "Guardman",
  "legalName": "Guardman Chile SPA",
  "toneOfVoice": "B2B, profesional, persuasivo, no alarmista. Experto en seguridad con enfoque tecnológico.",
  "coreDifferentiators": [
    "GuardPod® V1: Sistema autónomo con 15 meses de batería y visión 360°",
    "Guardias con curso OS-10 vigente y certificación Ley 21.659",
    "Supervisión nocturna con tecnología de última generación",
    "Modelo híbrido: guardias humanos + tecnología IA",
    "Clientes premium: Courtyard Marriott, Hamptons, Kavak, Embajadas"
  ],
  "strictRules": [
    "Siempre mencionar acreditación OS-10 y Ley 21.659",
    "Nunca usar tono alarmista ni sensacionalista",
    "Siempre incluir CTA con teléfono y WhatsApp",
    "Mencionar GuardPod® V1 como diferenciador único",
    "NAP consistente en todas las páginas"
  ],
  "headquartersAddress": "Av. Américo Vespucio Norte 1980, Of. 501-01, Providencia, Santiago",
  "latitude": -33.4114,
  "longitude": -70.6053,
  "primaryPhone": "(2) 29461824",
  "whatsappNumber": "+56 9 300 000 10",
  "supportEmail": "info@guardman.cl",
  "colorPalette": { "primary": "#1B2B3A", "secondary": "#C49A2A", "accent": "#E8E0D0" }
}
```

---

## 2. SERVICES (7)

| # | title | slug | icon | isHighlighted |
|---|-------|------|------|---------------|
| 1 | Guardias de Seguridad | `guardias-de-seguridad` | 🛡️ | ✅ |
| 2 | Alarmas Monitoreadas | `alarmas` | 🚨 | ✅ |
| 3 | Cámaras de Seguridad (CCTV) | `camaras-de-seguridad` | 📹 | ✅ |
| 4 | Control de Acceso | `control-de-acceso` | 🔐 | |
| 5 | Cercos Eléctricos | `cercos-electricos` | ⚡ | |
| 6 | GuardPod® Protección Autónoma | `guardpod-proteccion-autonoma` | 🤖 | ✅ |
| 7 | Patrullaje y Drones | `patrullaje-y-drones` | 🚁 | |

---

## 3. INDUSTRIES (5)

| # | name | slug | icon |
|---|------|------|------|
| 1 | Condominios y Comunidades | `condominios` | 🏘️ |
| 2 | Corporativo y Oficinas | `corporativo` | 🏢 |
| 3 | Industrial y Logística | `industrial` | 🏭 |
| 4 | Retail y Comercial | `retail` | 🏪 |
| 5 | Embajadas y Diplomático | `embajadas` | 🏛️ |

---

## 4. PERSONAS (6)

| # | name | title | incomeLevel | decisionTimeline |
|---|------|-------|-------------|------------------|
| 1 | Juan Administrador | Administrador de Condominio | medium | short |
| 2 | Marcela Presidente | Presidente Comunidad Vecinal | high | medium |
| 3 | Roberto Gerente | Gerente General | premium | medium |
| 4 | Carolina Seguridad | Encargada de Seguridad Corporativa | high | short |
| 5 | Pedro Propietario | Dueño de Casa | medium | immediate |
| 6 | **Fernando Dueño** | **Dueño de Galpones / Empresario Industrial** | **premium** | **medium** |

### Fernando Dueño (NUEVO)
- **Descripción:** Empresario dueño de galpones, bodegas o plantas industriales. Tiene operaciones en zonas como Lampa, Quilicura, Renca, Pudahuel o Huechuraba. Toma decisiones de inversión en seguridad con ticket alto. Busca protección de activos, control de acceso vehicular y vigilancia perimetral 24/7.
- **painPoints:** Robos/Portonazos, Sin Monitoreo Tecnológico, Falta Control Acceso
- **preferredServices:** GuardPod, Cercos Eléctricos, CCTV, Guardias
- **needs:** Protección de activos de alto valor, Control de camiones e inventario, Cobertura nocturna autónoma, SLA garantizado, Facturación empresarial
- **goals:** Reducir merma por robo, Cumplir normativa de seguridad, Proteger personal e instalaciones
- **demographics:** { ageRange: "40-60", location: "Las Condes / Vitacura (vive) + Lampa / Quilicura (opera)", incomeLevel: "premium" }
- **communication:** { preferredChannel: 'email', tone: 'formal' }
- **relatedIndustries:** Industrial y Logística
- **scoring:** { baseScore: 25, urgencyWeight: 20 }

> **Nota Estratégica:** Fernando es el ejemplo perfecto de "Cross-Location Intent" — vive en Las Condes pero sus galpones están en Lampa/Quilicura. El SEO debe capturarlo en ambas ubicaciones.

---

## 5. PROBLEMS (5)

| # | name | slug |
|---|------|------|
| 1 | Robos y Portonazos | `robos-portonazos` |
| 2 | Falta de Control de Acceso | `falta-control-acceso` |
| 3 | Seguridad Nocturna Deficiente | `seguridad-nocturna` |
| 4 | Alta Rotación de Guardias | `alta-rotacion-guardias` |
| 5 | Sin Monitoreo Tecnológico | `sin-monitoreo-tecnologico` |

---

## 6. SOLUTIONS (3)

| # | title | slug | industry | targetPersonas |
|---|-------|------|----------|----------------|
| 1 | Seguridad Integral para Condominios | `seguridad-integral-condominios` | Condominios | Juan, Marcela, Pedro |
| 2 | Protección Corporativa Premium | `proteccion-corporativa-premium` | Corporativo | Roberto, Carolina |
| 3 | Vigilancia Industrial Autónoma | `vigilancia-industrial-autonoma` | Industrial | **Fernando**, Roberto |

---

## 7. LOCATIONS (14 comunas)

### Región Metropolitana (12 comunas)

| # | name | slug | geoZone | tier | economicDriver | priorityScore | Perfil |
|---|------|------|---------|------|----------------|---------------|--------|
| 1 | **Lampa** | `lampa` | norte | emerging | industrial | 90 | Mega zona industrial, 400+ empresas, galpones, centro logístico norte de Santiago. Población 100k+. Parques industriales en expansión. |
| 2 | **Quilicura** | `quilicura` | norte | medium | industrial | 88 | Gran polo industrial y logístico. Bodegas, centros de distribución, zona franca. Ruta 5 Norte. |
| 3 | **Conchalí** | `conchali` | norte | emerging | mixto_masivo | 60 | Mixto residencial-comercial. Oficina actual de Guardman. Conectividad norte. |
| 4 | **Huechuraba** | `huechuraba` | norte | medium | industrial | 85 | Ciudad Empresarial + zona industrial. Parques de oficinas premium y bodegas. Gran potencial B2B. |
| 5 | **Las Condes** | `las-condes` | oriente | premium | corporativo_premium | 100 | Corporativo premium. El Golf, embajadas, retail de lujo. Donde viven los tomadores de decisiones. |
| 6 | **Vitacura** | `vitacura` | oriente | premium | residencial_premium | 98 | Residencial alto y embajadas. Casas de lujo, condominios exclusivos. |
| 7 | **Lo Barnechea** | `lo-barnechea` | nororiente | premium | residencial_premium | 95 | Condominios exclusivos, parcelas extensas. Seguridad perimetral prioritaria. |
| 8 | **La Reina** | `la-reina` | oriente | high | residencial_premium | 80 | Residencial arbolado, condominios de buen nivel. Conectividad metro. |
| 9 | **Renca** | `renca` | norte | emerging | industrial | 82 | Parque Industrial El Montijo (200+ hectáreas). Galpones, logística, acceso a Ruta 5 y Vespucio. Reconversión industrial en curso. |
| 10 | **Pudahuel** | `pudahuel` | poniente | emerging | industrial | 75 | Aeropuerto, zona industrial, bodegas de carga. Enlink Logístico, crecimiento urbano. |
| 11 | **La Pintana** | `la-pintana` | sur | emerging | mixto_masivo | 55 | 849+ establecimientos industriales. Manufactura, bodegas, pymes. Comuna en desarrollo con demanda de seguridad básica. |
| 12 | **Santiago Centro** | `santiago-centro` | centro | medium | comercial_alta_densidad | 89 | Centro financiero y comercial. Bancos, retail, oficinas gubernamentales. Alto tráfico, alta demanda. |

### Región de Valparaíso (2 comunas)

| # | name | slug | geoZone | tier | economicDriver | priorityScore | Perfil |
|---|------|------|---------|------|----------------|---------------|--------|
| 13 | **Los Andes** | `los-andes` | aconcagua | medium | industrial | 78 | Capital provincial de Aconcagua. Minería (Codelco Andina, cobre), agroindustria, transporte cordillerano. Población ~70k. Demanda de seguridad industrial y minera. |
| 14 | **San Felipe** | `san-felipe` | aconcagua | emerging | industrial | 70 | Agroindustria, fruticultura de exportación, gestión de residuos industriales. Población ~84k. Zona rural-urbana con crecimiento de bodegas y frigoríficos. |

> **Nota:** Los Andes y San Felipe requieren `region: 'valparaiso'` en el schema de Locations. Se agrega la opción al campo `region`.

---

## 8. PROMPTS GLM (4)

| identifier | Propósito |
|------------|-----------|
| `analyze_location` | Analiza una comuna para SEO de seguridad privada |
| `outline_cluster` | Genera estructura de Topic Cluster por comuna |
| `write_hero_section` | Escribe Hero Section transaccional para SeoPage |
| `write_faq` | Genera 5 FAQ SEO-optimizadas por SeoPage |

*(Ver detalles completos de systemPrompt, userPromptTemplate y expectedOutputSchema en la versión anterior del documento o en la DB)*

---

## 9. TESTIMONIALS (3)

| clientName | company | location | service |
|------------|---------|----------|---------|
| Carlos Mendoza | Condominio Los Robles, Providencia | Las Condes *(cercano)* | Guardias |
| Andrea Valenzuela | Hamptons Residencial | Las Condes | Guardias, CCTV |
| Roberto Fuentes | Kavak Chile | Huechuraba | GuardPod, Cercos |
