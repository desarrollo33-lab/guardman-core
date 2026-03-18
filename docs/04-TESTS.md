# 🧪 PLAN DE TESTS - Guardman Gateway V3

> **Workflow:** Commit → Deploy a Cloudflare Workers → Test en producción
> **No hay servidor local.** Todos los tests se hacen en la URL deployada.

---

## FASE 1: Limpieza y Restructuración

### Test F1.1: TypeScript Compila
```bash
npx tsc --noEmit
# ✅ 0 errores
```

### Test F1.2: Import Map
```bash
npx payload generate:importmap
# ✅ Sin errores
```

### Test F1.3: Deploy y Admin Panel
```
1. Commit + deploy a Cloudflare
2. Ir a https://guardman-core.oficinadesarrollo33.workers.dev/admin
3. Verificar sidebar: 4 grupos (Empresa, Marketing, CRM, Sistema)
4. Verificar NO aparecen: Forms, FormSubmissions, ScoringRules, LeadDuplicates, Neighborhoods, Settings
5. Verificar BrandDNA aparece como global
```

### Test F1.4: Relaciones Fix
```
1. Empresa > Solutions > cualquier solución → "Personas objetivo" es selector de relationship
2. CRM > Leads > cualquier lead → "Persona Detectada" es relationship a personas
3. CRM > Leads → "Problemas Detectados" es relationship a problems
```

---

## FASE 2: Pipeline de Enriquecimiento

### Test F2.1: Hook Ejecuta
```
1. Marketing > Locations > Crear "Test Location"
2. Verificar enrichmentStatus cambia (sidebar del formulario)
3. Sistema > Enrichment History → debe tener registro
```

### Test F2.2: Caches
```
1. Después de crear Location
2. Sistema > API Cache → al menos 1 registro con service='serper'
3. Sistema > Enrichment History → registro con sourceCollection='locations'
```

---

## FASE 3: Seed Data

### Test F3.1: Inventario
```
En admin, verificar conteos:
- Empresa > Services: 7
- Empresa > Industries: 5
- Empresa > Personas: 6 (incluye Fernando Dueño)
- Empresa > Problems: 5
- Empresa > Solutions: 3
- Marketing > Locations: 14
- Sistema > Prompts: 4
- Marketing > Testimonials: 3
```

### Test F3.2: Relaciones Cruzadas
```
1. Empresa > Solutions > "Vigilancia Industrial Autónoma"
   → targetPersonas incluye "Fernando Dueño"
   → relatedServices incluye "GuardPod"
2. Empresa > Personas > "Fernando Dueño"
   → painPoints incluye "Robos y Portonazos"
   → preferredServices incluye "GuardPod", "Cercos Eléctricos"
3. Marketing > Locations > "Los Andes"
   → region = "valparaiso" (no "rm")
```

### Test F3.3: BrandDNA
```
1. Brand DNA > Core Identity
   → companyName: "Guardman"
   → coreDifferentiators: 5 items
   → strictRules: 5 items
2. Brand DNA > Contact & Location
   → headquartersAddress contiene "Américo Vespucio"
```

---

## FASE 4: Verificación Final

```bash
# Build
npx tsc --noEmit     # 0 errores

# Deploy final
# Commit → Cloudflare → Admin funcional
```

### Test F4.1: Lead de Prueba
```
1. CRM > Leads > Crear:
   - name: "Test Lead Beta"
   - phone: "+56912345678"
   - message: "Necesito seguridad para galpón en Lampa"
   - source.location: Lampa
   - source.service: GuardPod
2. Guardar → verificar score, status='new'
```

---

## CHECKLIST RÁPIDO POST-CAMBIO

```bash
# 1. TypeScript
npx tsc --noEmit

# 2. Import map
npx payload generate:importmap

# 3. Commit + Deploy
git add . && git commit -m "V3: [description]" && git push
# → Cloudflare auto-deploys → Test en producción
```
