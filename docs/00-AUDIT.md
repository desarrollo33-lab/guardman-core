# 🔍 AUDITORÍA COMPLETA - Guardman Gateway

> **Fecha:** 18 Marzo 2026 | **Versión:** V2 → V3
> **Deploy:** Cloudflare Workers (commit → deploy → test en producción)

---

## 1. INVENTARIO ACTUAL (22 colecciones + 1 global)

| Grupo | Colecciones | Estado |
|-------|-------------|--------|
| **Business** (5) | Services, Industries, Personas, Problems, Solutions | ✅ Con relaciones |
| **CRM** (3) | Leads, LeadDuplicates, ScoringRules | ⚠️ Sobre-ingeniería |
| **Content** (3) | Blog, Forms, FormSubmissions | ⚠️ Forms sin uso |
| **Geography** (2) | Locations, Neighborhoods | ⚠️ Neighborhoods vacía |
| **SEO** (3) | SeoPages, Keywords, Testimonials | ✅ Core funcional |
| **System** (6) | Users, Settings, Prompts, EnrichmentHistory, ApiCache, Media | ⚠️ Settings duplica BrandDNA |
| **Global** (1) | BrandDNA | ✅ Bien estructurado |

---

## 2. PROBLEMAS CRÍTICOS

### 🔴 P1: Pipeline de Enriquecimiento Roto
- Hook `triggerAsyncEnrichment` en Locations no ejecuta
- Hook `enrichProblem` está **comentado** en Problems
- `enrichment-history` vacía, APIs nunca se llaman
- Rutas API no se deployan correctamente

### 🔴 P2: Settings Duplica BrandDNA
Logo, teléfono, dirección, email existen en ambos. Settings es una Collection (puede tener múltiples registros) cuando debería ser Global.

### 🔴 P3: Demasiadas Colecciones (22 para un MVP)
6 grupos en sidebar, colecciones vacías, nombres inconsistentes (Forms en "CMS", Blog en "Contenido").

### 🟠 P4: Relaciones Rotas
- Solutions.`targetPersonas`: `array[text]` en vez de `relationship`
- Leads.`detectedPersona`: `select` hardcodeado en vez de `relationship`
- Leads.`detectedProblems`: `array[text]` en vez de `relationship`

### 🟠 P5: Location solo soporta "Región Metropolitana"
El campo `region` tiene solo opción `rm`. Se necesita soporte para Valparaíso (Los Andes, San Felipe).

### 🟠 P6: Sin BI ni Dashboard de métricas

### 🟡 P7: Users.role no tiene `saveToJWT: true`

---

## 3. PLAN: 22 → 15 colecciones + 1 global

### Eliminar (6):
| Colección | Razón |
|-----------|-------|
| Settings | Duplicado de BrandDNA |
| Neighborhoods | Demasiado granular, vacía |
| Forms | Sin form builder implementado |
| FormSubmissions | Depende de Forms |
| ScoringRules | Sobre-ingeniería |
| LeadDuplicates | Puede ser lógica en hook |

### Reorganizar en 4 grupos:
| Grupo | Colecciones |
|-------|-------------|
| 🏢 **Empresa** | Services, Industries, Personas, Problems, Solutions |
| 📊 **Marketing** | Locations, SeoPages, Keywords, Blog, Testimonials |
| 💼 **CRM** | Leads |
| ⚙️ **Sistema** | Users, Media, Prompts, ApiCache, EnrichmentHistory |
| 🌐 **Global** | BrandDNA (absorbe Settings) |
