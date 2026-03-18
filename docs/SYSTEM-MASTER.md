# 🧠 GUARDMAN - Sistema de Inteligencia SEO Neuronal

> **Documento Maestro** - Versión Final Actualizada
> Arquitectura de Topic Clusters, Enriquecimiento B2B Modular y Aprovechamiento Total de Serper + GLM

---

## 1. PRINCIPIOS FUNDAMENTALES Y EL "Brand DNA"

### 1.1. Nodo Cero: El ADN de la Marca (Brand DNA)
El sistema no operará en el vacío. Todas las generaciones de contenido (GLM) y meta-datos estarán anclados a una colección Global en Payload llamada `BrandDNA`.
- **Qué aporta:** Tono de voz B2B, diferenciadores principales (GuardPod V1 de 15 meses de autonomía, Supervisión nocturna), y directrices obligatorias (Ej: "Mencionar siempre: Guardias con curso OS-10 vigente, Ley 21.659").
- **Escalabilidad (GBP Ready):** Almacenará coordenadas (Lat/Long), horarios, logo, y datos de contacto para la integración futura con Google Business Profile y estructuración JSON-LD LocalBusiness.

### 1.2. De "Combinaciones Planas planas" a "Topic Clusters" (Hub & Spoke)
El enfoque histórico que generaba miles de cruces hiper-específicos planos quedará reemplazado por **Hub & Spoke**.
- **Pillar Pages (El "Hub"):** Contenido de alta autoridad, E-E-A-T. Ej: "Soluciones de Seguridad Privada Integral".
- **Spoke Pages (Clusters):** Cubren temas específicos y FAQ (Mid-Funnel). Ej: "Cámaras vs Alarmas para Condominios en Chile".
- **Local PSEO Pages (Lead Gen):** Combinación de Servicio × Ubicación (Bottom-Funnel) con intención hiper-transaccional.

### 1.3. La Colección "Prompts"
GLM ya no dependerá de un "Súper Prompt" harcodeado en el backend que suele inducir a la IA a alucinar. En su lugar, Payload tendrá una colección llamada `Prompts` donde el administrador afinará modularmente:
- `systemPrompt`: Rol de la IA y constraints.
- `userPromptTemplate`: Las variables inyectadas (`{{location}}`, `{{service}}`, etc.).
- `expectedOutputSchema`: El esquema JSON de salida deseado.

---

## 2. EL FACTOR B2B: "Value-Based Tiering" y "Cross-Location"

El dinero y el ticket promedio definen los Tiers (categorías), no solo la clase social residencial. Además, los tomadores de decisiones de una empresa suelen vivir y realizar búsquedas fuera de la comuna industrial donde ubican sus operaciones.

### 2.1. Nueva Clasificación (Economic Driver)
Al crear una `Location` en Payload, el administrador debe seleccionar su "Motor Económico".
- **Tier 1 (Alto Valor B2B Industrial):** Ej. Huechuraba, San Bernardo, Quilicura. Foco SEO: Seguridad industrial externa, control de camiones, GuardPod V1.
- **Tier 1 (Alto Valor Corporativo/Residencial):** Ej. Las Condes, Vitacura, Providencia. Foco SEO: Protección corporativa, embajadas, condominios exclusivos, prevención anti-portonazos.
- **Tier 2 (Comercial / Masivo):** Ej. Maipú, La Florida. Foco SEO: Seguridad masiva, Pymes, comercio.

### 2.2. Intención Cruzada (Cross-Location Intent)
Para atrapar a clientes B2B, el cruce Semántico-Geográfico será dinámico en los "Spokes".
Ejemplo: Un Topic Cluster de "Seguridad Industrial para Grandes Empresas en Santiago" apuntará estratégicamente con enlazado interno PSEO y CTA dinámicos al *Decision Maker* en Las Condes que tiene sus galpones en Quilicura. 

---

## 3. ARQUITECTURA NEURONAL (SISTEMA NERVIOSO Y QUEUES)

Para no colgar el Admin Panel de Payload CMS con largos tiempos de peticiones HTTP a OpenAI/Google, la generación será *asíncrona* usando Cloudflare Queues / Edge Functions.

### 3.1 Pipeline de Generación Modular (Small GLM Executions)

1. **Trigger:** Usuario marca `autoEnrich: true` en una `Location` o `Problem`.
2. **Hook (Background Job):** Payload envía el ID de la ubicación a un *Job Worker* asíncrono y libera al usuario de inmediato.
3. **Step 1 - Scrape Serper (endpoint `/search`, `/news`, `/autocomplete`):** Detecta competidores locales y "People Also Ask" (FAQ).
4. **Step 2 - Análisis Estratégico (GLM):** Combina Serper Data + Location Info + `BrandDNA`. Define la oportunidad semántica.
5. **Step 3 - Mapeo de Clúster (GLM):** Armado de `[{ slug, title, type }]`. Se inyectan borradores en `SeoPages` sin copy.
6. **Step 4 - Llenado de Contenido Enfocado (GLM):** Un prompt distinto escribe la Hero Section transaccional, luego *otro* prompt distinto redacta las FAQs usando lenguaje B2B. Todo va a parar a los borradores de SeoPages.

---

## 4. KNOWLEDGE BASE - SCHEMA COMPLETO (Auditoría Anti-Errores)

La ejecución neural será supervisada por una nueva entidad `EnrichmentHistory`.

```typescript
// Estructura de src/collections/System/EnrichmentHistory.ts
{
  slug: 'enrichment-history',
  fields: [
    { name: 'sourceCollection', type: 'select', options: ['locations', 'services', 'problems', 'seo-pages'] },
    { name: 'sourceId', type: 'text' },
    
    // SERPER DATA
    { name: 'serperRawData', type: 'json' },
    
    // GLM DATA MODULAR
    { name: 'glmPromptIdentifier', type: 'relationship', relationTo: 'prompts' },
    { name: 'glmResponse', type: 'json' },
    { name: 'tokensUsed', type: 'number' },
    
    // HEALTH
    { name: 'wasSuccessful', type: 'checkbox' },
    { name: 'errorMessage', type: 'text' }
  ]
}
```
*Si GLM se cae, suelta un timeout, o responde con un JSON inválido, será atrapado por el Hook y el error quedará persistido acá sin romper la vista del usuario.*

---

## 5. MÉTRICAS DE ÉXITO B2B / CRO

1. **Ratio de Clústeres (Hub/Spoke):** Al menos 1 Pillar completo (exhaustivo) por cada 5/8 Local PSEO generadas.
2. **Local Leads CPA:** Medición del coste de adquisición desde Local PSEO segmentadas (Vía Analytics/CRM).
3. **Rankeo de Keywords Long-Tail con Baja Competencia:** (Ej. "Guardias Seguridad Bodegas San Bernardo").
4. **Acreditación Constante (E-E-A-T):** 100% de las landings mencionan la normativa vigente y el perfil OS-10.

---

## 6. PRÓXIMOS PASOS (FASE DE IMPLEMENTACIÓN ACTUAL)

1. **Crear nodo maestro (Global):** Desarrollar `BrandDNA` configurado y con validaciones listas para GBP.
2. **Crear nodo de control (Collection):** Armar la colección de afinación `Prompts`.
3. **Migrar relaciones geográficas:** Añadir `economicDriver` a la colección `Locations`.
4. **Implementar Queues / Workers:** Preparar hooks `afterChange` de Payload en conjunto con la infraestructura Serverless que delegue la orquestación a Cloudflare D1 en segundo plano.
