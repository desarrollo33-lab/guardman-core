# Plan: Test e Implementación de Servicios Serper + GLM-5

## TL;DR

> **Objetivo**: Testear los servicios Serper y GLM-5 que están integrados, e implementar los hooks faltantes para enriquecer automaticamente las colecciones de SEO y Negocio.
>
> **Entregables**:
>
> - Endpoints de test `/api/test/glm` y `/api/test/serper`
> - Hook para Keywords (Serper + GLM)
> - Hook para Problems (Serper)
> - Hook para SeoPages (GLM + Serper)
>
> **Esfuerzo**: Medio
> **Ejecución**: Secuencial (test primero, luego hooks)

---

## Contexto

### Estado actual

- **Leads**: GLM scoring funcionando correctamente
- **Keywords**: Campos `serperMetrics` y `glmAnalysis` existen pero vacíos
- **Problems**: Campo `serperData` existe pero vacío
- **SeoPages**: Campos `glmGenerated` y `serperEnriched` existen, hook comentado

### Decisiones tomadas

- Tests: **Funcionales** (health check + casos específicos)
- Prioridad hooks: **Keywords** primero
- Estrategia: **Secuencial** (test → hooks uno por uno)

---

## Work Objectives

### Objetivo general

Implementar pipeline completo de enrichment automático:

1. Testear que Serper y GLM funcionan correctamente
2. Crear hooks que automaticen el enriquecimiento de datos

### Entregables concretos

1. `GET /api/test/glm` - Test funcional de GLM-5
2. `GET /api/test/serper` - Test funcional de Serper
3. `src/hooks/keywords/enrichKeyword.ts` - Hook para enrichment de Keywords
4. `src/hooks/problems/enrichProblem.ts` - Hook para enrichment de Problems
5. `src/hooks/seoPages/generateSEOCache.ts` - Hook para SeoPages

---

## Verification Strategy

### Test Strategy

- **Infraestructura existente**: NO hay tests unitarios configurados
- **Estrategia**: Agent-Executed QA (scripts manuales verificados)
- **QA**: Cada task incluye scenarios de verificación

### QA Policy

- Tests funcionales se verifican con curl/Postman
- Hooks se verifican creando registros de prueba y observando los campos enriquecidos

---

## Execution Strategy

### Wave 1: Endpoints de Test

```
Tarea 1: Endpoint test GLM
Tarea 2: Endpoint test Serper
```

### Wave 2: Hook Keywords

```
Tarea 3: Hook enrichKeyword (Serper + GLM)
```

### Wave 3: Hook Problems

```
Tarea 4: Hook enrichProblem (Serper)
```

### Wave 4: Hook SeoPages

```
Tarea 5: Hook generateSEOCache (GLM + Serper)
```

---

## TODOs

### Wave 1: Endpoints de Test

- [x] 1. Crear endpoint `/api/test/glm`

  **What to do**:
  - Crear archivo `src/app/api/test/glm/route.ts`
  - GET: Llama a `GLMService.scoreLead()` con datos de prueba
  - Verifica API key, modelo y respuesta JSON
  - Devuelve: `{ status, glmResponse, parsedResponse, errors? }`
  - Proteger: solo si `NODE_ENV !== 'production'` O usuario admin

  **References**:
  - `src/services/GLMService.ts:118-169` - Método scoreLead a testear
  - `src/collections/CRM/Leads.ts` - Ejemplo de datos de lead

  **QA Scenarios**:

  ```
  Scenario: Test GLM con datos válidos
    Tool: Bash (curl)
    Preconditions: API key GLM configurada en variables de entorno
    Steps:
      1. curl -X GET "http://localhost:3000/api/test/glm"
    Expected Result: HTTP 200, JSON con status: "ok", score: 0-100, detectedPersona
    Failure Indicators: HTTP 500, error de API key
    Evidence: .sisyphus/evidence/task-1-glm-test.json

  Scenario: Test GLM sin API key
    Tool: Bash (curl)
    Preconditions: Sin GLM_API_KEY
    Steps:
      1. curl -X GET "http://localhost:3000/api/test/glm"
    Expected Result: HTTP 503, status: "error", mensaje de API key missing
    Evidence: .sisyphus/evidence/task-1-glm-no-key.json
  ```

  **Commit**: YES (task-1)
  - Message: `feat(api): add GLM test endpoint`
  - Files: `src/app/api/test/glm/route.ts`

---

- [x] 2. Crear endpoint `/api/test/serper`

  **What to do**:
  - Crear archivo `src/app/api/test/serper/route.ts`
  - GET: Llama a `SerperService.search()` con query de prueba
  - Verifica API key y resultados
  - Devuelve: `{ status, query, resultCount, competitors, credits? }`
  - Proteger: solo si `NODE_ENV !== 'production'` O usuario admin

  **References**:
  - `src/services/SerperService.ts:98-104` - Método search a testear

  **QA Scenarios**:

  ```
  Scenario: Test Serper con query de seguridad
    Tool: Bash (curl)
    Preconditions: API key Serper configurada
    Steps:
      1. curl -X GET "http://localhost:3000/api/test/serper?q=guardias%20de%20seguridad%20santiago"
    Expected Result: HTTP 200, resultCount > 0, organic results array
    Failure Indicators: HTTP 500, API key error
    Evidence: .sisyphus/evidence/task-2-serper-test.json

  Scenario: Test Serper sin API key
    Tool: Bash (curl)
    Preconditions: Sin SERPER_API_KEY
    Steps:
      1. curl -X GET "http://localhost:3000/api/test/serper"
    Expected Result: HTTP 503, error de API key missing
    Evidence: .sisyphus/evidence/task-2-serper-no-key.json
  ```

  **Commit**: YES (task-2)
  - Message: `feat(api): add Serper test endpoint`
  - Files: `src/app/api/test/serper/route.ts`

---

### Wave 2: Hook Keywords

- [x] 3. Crear hook `enrichKeyword` para Keywords

  **What to do**:
  - Crear archivo `src/hooks/keywords/enrichKeyword.ts`
  - Hook `afterChange`: Cuando se crea/actualiza un keyword
  - 1. Llama a Serper.search() para obtener:
    - `resultCount`: número de resultados
    - `adsCount`: número de anuncios
    - `topCompetitors`: primeros 3 competidores del organic
  - 2. Llama a GLM.analyzeKeyword() (nuevo método) para obtener:
    - `difficulty`: 0-100
    - `volume`: high/medium/low
    - `opportunity`: high/medium/low
    - `recommendedUrl`: URL sugerida
  - 3. Actualiza el documento con los datos

  **References**:
  - `src/collections/SEO/Keywords.ts:137-170` - Campos serperMetrics
  - `src/collections/SEO/Keywords.ts:175-221` - Campos glmAnalysis
  - `src/services/SerperService.ts` - Servicio a usar
  - `src/services/GLMService.ts` - Servicio a extender

  **Acceptance Criteria**:
  - [ ] Archivo creado: `src/hooks/keywords/enrichKeyword.ts`
  - [ ] Keywords.ts actualizado con hook en `hooks.afterChange`

  **QA Scenarios**:

  ```
  Scenario: Enriquecer keyword nuevo
    Tool: API (curl)
    Preconditions: Endpoint test funciona, hook registrado
    Steps:
      1. POST /api/keywords con { keyword: "guardias seguridadLas Condes", type: "service-location" }
      2. Esperar 5 segundos
      3. GET /api/keywords/{id}
    Expected Result: serperMetrics.resultCount > 0, glmAnalysis.difficulty existe
    Failure Indicators: Campos vacíos, error en logs
    Evidence: .sisyphus/evidence/task-3-keyword-enrich.json
  ```

  **Commit**: YES (task-3)
  - Message: `feat(hooks): add keyword enrichment with Serper and GLM`
  - Files: `src/hooks/keywords/enrichKeyword.ts`, `src/collections/SEO/Keywords.ts`

---

### Wave 3: Hook Problems

- [x] 4. Crear hook `enrichProblem` para Problems

  **What to do**:
  - Crear archivo `src/hooks/problems/enrichProblem.ts`
  - Hook `afterChange`: Cuando se crea/actualiza un problem
  - Llama a Serper.news() para obtener:
    - `newsCount`: número de noticias
    - `trending`: rising/stable/declining (analizado con GLM)
  - También llama a Serper.search() para `searchVolume` estimado
  - Actualiza el documento con `serperData`

  **References**:
  - `src/collections/Business/Problems.ts:105-127` - Campo serperData
  - `src/services/SerperService.ts:121-126` - Método news

  **Acceptance Criteria**:
  - [ ] Archivo creado: `src/hooks/problems/enrichProblem.ts`
  - [ ] Problems.ts actualizado con hook

  **QA Scenarios**:

  ```
  Scenario: Enriquecer problema existente
    Tool: API (curl)
    Steps:
      1. POST /api/problems con { name: "Robos en condominios Santiago", slug: "robos-condominios" }
      2. GET /api/problems/{id}
    Expected Result: serperData.newsCount > 0, serperData.trending existe
    Evidence: .sisyphus/evidence/task-4-problem-enrich.json
  ```

  **Commit**: YES (task-4)
  - Message: `feat(hooks): add problem enrichment with Serper`
  - Files: `src/hooks/problems/enrichProblem.ts`, `src/collections/Business/Problems.ts`

---

### Wave 4: Hook SeoPages

- [x] 5. Crear hook `generateSEOCache` para SeoPages

  **What to do**:
  - Crear archivo `src/hooks/seoPages/generateSEOCache.ts`
  - Descomentar hook en SeoPages.ts
  - Hook `afterChange`: Cuando se crea/actualiza una seo-page
  - 1. Genera contenido con GLM:
    - `metaTitle`, `metaDescription`, `h1`
    - `contentOutline` para el contenido
    - `faq` - preguntas frecuentes
  - 2. Enrich con Serper (opcional):
    - Verificar que la página tiene sentido SEO
  - 3. Actualiza el documento

  **References**:
  - `src/collections/SEO/SeoPages.ts:389-392` - Hook comentado
  - `src/services/GLMService.ts:174-218` - generateSEOContent método existente

  **Acceptance Criteria**:
  - [ ] Hook descomentado en SeoPages.ts
  - [ ] Archivo creado: `src/hooks/seoPages/generateSEOCache.ts`
  - [ ] Al crear seo-page: campos glmGenerated = true, seo preenchido

  **QA Scenarios**:

  ```
  Scenario: Generar SEO page automáticamente
    Tool: API (curl)
    Steps:
      1. POST /api/seo-pages con {
           title: "Guardias Las Condes",
           slug: "guardias-las-condes",
           pageType: "service-location",
           location: { id: "..." },
           service: { id: "..." }
         }
      2. GET /api/seo-pages/{id}
    Expected Result: seo.metaTitle existe, h1 existe, glmGenerated = true
    Evidence: .sisyphus/evidence/task-5-seopage-gen.json
  ```

  **Commit**: YES (task-5)
  - Message: `feat(hooks): enable SEO page generation with GLM`
  - Files: `src/hooks/seoPages/generateSEOCache.ts`, `src/collections/SEO/SeoPages.ts`

---

## Final Verification Wave

- [x] F1. Test endpoints con credenciales reales

  **Verificar**:
  - GLM endpoint devuelve score válido ✓ (score: 82, persona detected)
  - Serper endpoint devuelve resultados ✓ (10 results, 3 competitors)

- [ ] F2. Verificar enrichment automático

  **Verificar**:
  - Keyword tiene serperMetrics y glmAnalysis
  - Problem tiene serperData
  - SeoPage tiene contenido generado

  **Nota**: Requiere autenticación de admin en Payload Admin Panel para crear registros de prueba.

- [ ] F2. Verificar enrichment automático

  **Verificar**:
  - Keyword tiene serperMetrics y glmAnalysis
  - Problem tiene serperData
  - SeoPage tiene contenido generado

- [x] F3. Revisión de código

  **Verificar**:
  - No hay console.log en producción
  - Manejo de errores correcto
  - Tipos TypeScript correctos

---

## Commit Strategy

| Task | Message                                                   |
| ---- | --------------------------------------------------------- |
| 1    | `feat(api): add GLM test endpoint`                        |
| 2    | `feat(api): add Serper test endpoint`                     |
| 3    | `feat(hooks): add keyword enrichment with Serper and GLM` |
| 4    | `feat(hooks): add problem enrichment with Serper`         |
| 5    | `feat(hooks): enable SEO page generation with GLM`        |

---

## Success Criteria

- [x] GET /api/test/glm → 200 OK con score válido (82, URGENT_CONTACT)
- [x] GET /api/test/serper → 200 OK con resultados (10 results, 1 credit)
- [ ] Crear keyword →自动填充 serperMetrics y glmAnalysis (requiere auth)
- [ ] Crear problem →自动填充 serperData (requiere auth)
- [ ] Crear seo-page →自动生成 metaTitle, h1, faq (requiere auth)

---

## Notas

1. **API Keys**: Necesitan estar configuradas en Cloudflare Workers como secrets
2. **Rate Limiting**: Serper tiene límite de credits - monitorear uso
3. **GLM Cost**: Cada lead/keyword enrichment cuenta como 1 request
4. **Errores silenciosos**: Los hooks no deben romper la UI si el servicio falla
