# 🏗️ ARQUITECTURA V3 - Guardman Gateway

> **Objetivo:** 22 → 15 colecciones, 3 dominios claros, pipeline funcional, beta seedeada.
> **Deploy:** Commit → Cloudflare Workers → Test en producción. No hay servidor local.

---

## 1. ESTRUCTURA FINAL

### 🏢 Empresa (catálogo de Guardman)
| Colección | Slug | Propósito |
|-----------|------|-----------|
| Services | `services` | 7 servicios de seguridad |
| Industries | `industries` | Segmentos de mercado |
| Personas | `personas` | 6 buyer personas B2B |
| Problems | `problems` | Problemas de seguridad |
| Solutions | `solutions` | Paquetes por industria |

### 📊 Marketing (captura tráfico)
| Colección | Slug | Propósito |
|-----------|------|-----------|
| Locations | `locations` | 14 comunas (RM + Valparaíso) |
| SeoPages | `seo-pages` | Páginas SEO generadas |
| Keywords | `keywords` | Intelligence SEO |
| Blog | `blog` | Autoridad temática |
| Testimonials | `testimonials` | Social proof |

### 💼 CRM
| Colección | Slug | Propósito |
|-----------|------|-----------|
| Leads | `leads` | Pipeline comercial |

### ⚙️ Sistema
| Colección | Slug | Propósito |
|-----------|------|-----------|
| Users | `users` | Auth + roles |
| Media | `media` | Uploads R2 |
| Prompts | `prompts` | Templates GLM |
| ApiCache | `api-cache` | Cache Serper/GLM |
| EnrichmentHistory | `enrichment-history` | Auditoría IA |

### 🌐 Global: BrandDNA (absorbe Settings)

---

## 2. CAMBIOS CLAVE

### Location: Soporte Multi-Región
```diff
  { name: 'region', type: 'select', options: [
    { label: 'Región Metropolitana', value: 'rm' },
+   { label: 'Región de Valparaíso', value: 'valparaiso' },
  ]}
```

### Solutions: Fix relación
```diff
- { name: 'targetPersonas', type: 'array', fields: [{ name: 'persona', type: 'text' }] }
+ { name: 'targetPersonas', type: 'relationship', relationTo: 'personas', hasMany: true }
```

### Leads: Fix relaciones IA
```diff
- { name: 'detectedPersona', type: 'select', options: [...hardcoded] }
+ { name: 'detectedPersona', type: 'relationship', relationTo: 'personas' }
- { name: 'detectedProblems', type: 'array', fields: [{ name: 'problem', type: 'text' }] }
+ { name: 'detectedProblems', type: 'relationship', relationTo: 'problems', hasMany: true }
```

### Users: Fix JWT
```diff
- { name: 'role', type: 'select', options: [...] }
+ { name: 'role', type: 'select', saveToJWT: true, options: [...] }
```

### Admin Groups
```diff
- group: 'Negocio'     → group: 'Empresa'
- group: 'Geografía'   → group: 'Marketing'
- group: 'SEO'         → group: 'Marketing'
- group: 'Contenido'   → group: 'Marketing'
```

---

## 3. PIPELINE DE ENRIQUECIMIENTO

```
Admin crea Location (solo nombre) → auto-genera slug
  → Serper: busca "seguridad privada {location}" → ApiCache
  → GLM: analiza competencia → rellena tier, characteristics, coordinates
  → Location.enrichmentStatus = 'completed'
```

---

## 4. SIDEBAR RESULTADO

```
Empresa (25 items)
  ├── Services (7)
  ├── Industries (5)
  ├── Personas (6) ← +1 Dueño
  ├── Problems (5)
  └── Solutions (3)

Marketing (14+ items)
  ├── Locations (14)
  ├── SEO Pages (generadas)
  ├── Keywords (generados)
  ├── Blog
  └── Testimonials (3)

CRM
  └── Leads

Sistema
  ├── Users, Media
  ├── Prompts (4)
  ├── API Cache (auto)
  └── Enrichment History (auto)

── Brand DNA (global)
```
