# 📋 TAREAS DE IMPLEMENTACIÓN - V3

> **Workflow:** Commit → Cloudflare Workers → Test en producción
> **Retomable:** Cada tarea es independiente. Busca el último `[ ]` no marcado.

---

## FASE 1: Limpieza y Restructuración

### 1.1 Eliminar Colecciones Redundantes

- [x] **T1.1** Eliminar `src/collections/Content/FormSubmissions.ts`
- [x] **T1.2** Eliminar `src/collections/Content/Forms.ts`
- [x] **T1.3** Eliminar `src/collections/CRM/ScoringRules.ts`
- [x] **T1.4** Eliminar `src/collections/CRM/LeadDuplicates.ts`
- [x] **T1.5** Eliminar `src/collections/Geography/Neighborhoods.ts`
- [x] **T1.6** Eliminar `src/collections/System/Settings.ts`
- [x] **T1.7** Eliminar hooks sin uso: `src/hooks/neighborhoods/`
- [x] **T1.8** Actualizar `src/collections/index.ts` (remover imports/exports eliminados)

### 1.2 Migrar Settings → BrandDNA

- [x] **T1.9** Agregar tab "Social Media" a BrandDNA: `facebook`, `instagram`, `linkedin`, `youtube`
- [x] **T1.10** Agregar tab "API Config" a BrandDNA: `glmConfig`, `limits`
- [x] **T1.11** Agregar `siteDescription` a BrandDNA Core Identity
- [x] **T1.12** Migrar `leadsConfig` de Settings a BrandDNA

### 1.3 Renombrar Admin Groups

- [x] **T1.13** Services, Industries, Personas, Problems, Solutions → `group: 'Empresa'`
- [x] **T1.14** Locations, SeoPages, Keywords, Blog, Testimonials → `group: 'Marketing'`
- [x] **T1.15** Leads → `group: 'CRM'`

### 1.4 Fix Relaciones

- [x] **T1.16** Solutions.`targetPersonas`: `array[text]` → `relationship` a `personas`
- [x] **T1.17** Leads.`detectedPersona`: `select` → `relationship` a `personas`
- [x] **T1.18** Leads.`detectedProblems`: `array[text]` → `relationship` a `problems`
- [x] **T1.19** Leads: eliminar `source.neighborhood`

### 1.5 Fix Location Multi-Región

- [x] **T1.20** Location.`region`: agregar opción `valparaiso` (para Los Andes, San Felipe)

### 1.6 Fix Seguridad

- [x] **T1.21** Users.`role`: agregar `saveToJWT: true`

### 1.7 Validación Fase 1

- [x] **T1.22** `tsc --noEmit` → 0 errores
- [x] **T1.23** `payload generate:importmap` sin errores
- [ ] **T1.24** Commit, deploy a Cloudflare, verificar admin carga

---

## FASE 2: Fix Pipeline de Enriquecimiento

- [x] **T2.1** Debug `src/hooks/locations/triggerAsyncEnrichment.ts`
- [x] **T2.2** Re-habilitar `enrichProblemAfterChange` en Problems.ts
- [x] **T2.3** Implementar pipeline síncrono (Serper → GLM → update Location)
- [x] **T2.4** Guardar cada paso en EnrichmentHistory y ApiCache
- [ ] **T2.5** Deploy, crear Location de prueba, verificar enrichment completa

---

## FASE 3: Seed Data Beta

### 3.1 BrandDNA

- [ ] **T3.1** Seed BrandDNA con datos completos de Guardman Chile SPA

### 3.2 Catálogo Empresa

- [ ] **T3.2** Seed 7 servicios (ver `03-SEED-DATA.md`)
- [ ] **T3.3** Seed 5 industrias
- [ ] **T3.4** Seed 6 personas (incluye Dueño de Galpones/Industria)
- [ ] **T3.5** Seed 5 problemas
- [ ] **T3.6** Seed 3 soluciones

### 3.3 Marketing

- [ ] **T3.7** Seed 14 comunas (Lampa, Quilicura, Conchalí, Huechuraba, Las Condes, Vitacura, Lo Barnechea, La Reina, Renca, Pudahuel, La Pintana, Santiago Centro, Los Andes, San Felipe)
- [ ] **T3.8** Seed 4 prompts GLM
- [ ] **T3.9** Seed 3 testimonios de ejemplo

### 3.4 Validación

- [ ] **T3.10** Commit, deploy, verificar datos en admin
- [ ] **T3.11** Verificar relaciones cargan correctamente

---

## FASE 4: Verificación Final

- [ ] **T4.1** `tsc --noEmit` → 0 errores
- [ ] **T4.2** Build funciona sin errores
- [ ] **T4.3** Admin panel carga los 4 grupos
- [ ] **T4.4** BrandDNA global editable
- [ ] **T4.5** Crear lead de prueba → hooks ejecutan
- [ ] **T4.6** Todas las relaciones son clickeables
- [ ] **T4.7** Deploy final a Cloudflare Workers

---

## NOTAS PARA RETOMAR

- **Orden:** FASE 1 → 2 → 3 → 4. No saltar fases.
- **Rollback:** `git stash` o `git checkout -- <file>`.
- **Docs:** `00-AUDIT`, `01-ARCHITECTURE`, `03-SEED-DATA`, `04-TESTS`
