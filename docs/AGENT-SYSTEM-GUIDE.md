# Sistema de Agentes, Orquestador y Skills

Guia completa para entender como funcionan los agentes especializados, el orquestador central y las skills en este proyecto.

---

## Tabla de Contenidos

1. [Vision General](#vision-general)
2. [El Orquestador](#el-orquestador)
3. [Los Agentes Especializados](#los-agentes-especializados)
4. [Las Skills](#las-skills)
5. [Como Trabajan Juntos](#como-trabajan-juntos)
6. [Flujos de Trabajo Reales](#flujos-de-trabajo-reales)
7. [Estructura de Archivos](#estructura-de-archivos)
8. [Memoria Persistente](#memoria-persistente)

---

## Vision General

El sistema funciona como un **equipo de desarrollo virtual** donde cada miembro tiene un rol especifico:

```
                        Tu solicitud
                             |
                             v
                   +-------------------+
                   |   ORQUESTADOR     |  <-- Analiza que necesitas
                   | (frontend-agent-  |      y decide quien trabaja
                   |  orchestrator)    |
                   +-------------------+
                      |    |    |    |
            +---------+    |    |    +---------+
            v              v    v              v
       +---------+   +---------+  +---------+  +---------+
       | Agente  |   | Agente  |  | Agente  |  | Agente  |
       |   A     |   |   B     |  |   C     |  |   D     |
       +---------+   +---------+  +---------+  +---------+
            |              |           |             |
            v              v           v             v
        Resultado      Resultado   Resultado     Resultado
                   \       |       /
                    v      v      v
               Respuesta final al usuario
```

Hay **3 piezas clave**:

| Pieza | Que es | Analogia |
|-------|--------|----------|
| **Orquestador** | Decide que agentes usar y en que orden | Director de proyecto |
| **Agentes** | Ejecutan tareas especificas (8 disponibles) | Desarrolladores especializados |
| **Skills** | Conocimiento tecnico que los agentes consultan | Manuales de referencia |

---

## El Orquestador

**Archivo:** `.claude/agents/frontend-agent-orchestrator.md`
**Modelo:** Opus (el mas potente, para decisiones complejas)

### Que hace

El orquestador es el **cerebro central**. Cuando haces una solicitud:

1. **Analiza tu intent** - Entiende que estas pidiendo
2. **Clasifica la tarea** - Feature nueva, bug, review, optimizacion, etc.
3. **Selecciona agentes** - Elige el minimo necesario (no sobrecarga)
4. **Define el orden** - Establece quien va primero y quien depende de quien
5. **Asigna skills** - Recomienda que skills debe consultar cada agente

### Lo que NO hace

- NO escribe codigo
- NO resuelve problemas directamente
- NO ejecuta tareas tecnicas

### Ejemplo de salida del orquestador

Cuando le pides "Agrega un boton de wishlist al producto", el orquestador produce algo asi:

```
## Intent
Implementar nueva funcionalidad de wishlist en la pagina de producto

## Selected Agents
1. senior-frontend-specialist
2. frontend-code-reviewer

## Execution Order
| Step | Agent                      | Task                              | Skills                    | Constraint          |
|------|----------------------------|-----------------------------------|---------------------------|---------------------|
| 1    | senior-frontend-specialist | Implementar componente y hook     | tanstack-query            | Seguir patrones     |
| 2    | frontend-code-reviewer     | Revisar el codigo implementado    | vercel-react-best-practices | Solo codigo nuevo |

## Rationale
Solo se necesitan 2 agentes: uno para construir y otro para validar.
No se requiere security guardian porque no hay input de usuario sensible.
```

### Arbol de decision del orquestador

```
Solicitud del usuario
    |
    +-- Es solo codigo nuevo? --> Frontend Specialist (+ Code Reviewer despues)
    |
    +-- Es un bug? --> Debug Analyst (+ Frontend Specialist si necesita fix)
    |
    +-- Es una review? --> Code Reviewer (+ otros segun contexto)
    |
    +-- Es sobre rendimiento? --> React Perf Auditor
    |
    +-- Es arquitectura? --> Architecture Reviewer
    |
    +-- Es sobre seguridad? --> Security Guardian
    |
    +-- Es sobre UX? --> UX/UI Reviewer
    |
    +-- Es complejo/mixto? --> Multiples agentes en orden
```

---

## Los Agentes Especializados

Hay **8 agentes**, cada uno con un rol unico. Piensa en ellos como especialistas en una consultora:

### 1. Frontend Specialist (El Constructor)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/senior-frontend-specialist.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Todas (lee, escribe, edita, busca) |
| **Rol** | Escribe codigo. Es el UNICO agente que modifica archivos |

**Que hace:**
- Implementa features nuevas
- Refactoriza componentes
- Crea hooks, stores, servicios
- Aplica fixes recomendados por el Debug Analyst

**Reglas clave:**
- Siempre explica su enfoque ANTES de escribir codigo
- Usa TypeScript estricto (cero `any`)
- React Query para estado del servidor, Zustand solo para estado del cliente
- Todas las llamadas API van por la capa de servicios

### 2. Debug Analyst (El Detective)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/frontend-debug-analyst.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura (Glob, Grep, Read, WebFetch, WebSearch) |
| **Rol** | Diagnostica bugs. NUNCA modifica codigo |

**Que hace:**
- Documenta sintomas
- Formula hipotesis
- Traza el codigo para encontrar la causa raiz
- Sugiere fixes conceptuales (sin escribir codigo)

**Metodologia (6 pasos):**
```
1. Documentar sintomas observables
2. Formular 1-3 hipotesis
3. Trazar el codigo (leer archivos, seguir flujo de datos)
4. Identificar causa raiz exacta (archivo + linea)
5. Explicar POR QUE ocurre tecnicamente
6. Sugerir 1-3 estrategias de fix (en lenguaje natural, sin codigo)
```

**Tiene 8 patrones de bugs especificos del proyecto que siempre verifica:**
- Cache invalidation de React Query
- Race conditions de sesion Supabase
- Schema stale en Zustand persist
- Lifecycle de Stripe Elements
- Auth race conditions en TanStack Router
- Variables de entorno sin prefijo `VITE_`
- Optional chaining faltante en respuestas de Supabase
- Cleanup faltante en `onAuthStateChange`

### 3. Code Reviewer (El Critico)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/frontend-code-reviewer.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura |
| **Rol** | Revisa codigo como en un PR. NUNCA reescribe |

**Que produce:**
- Issues criticos (bugs, crashes, vulnerabilidades)
- Mejoras recomendadas (arquitectura, tipos, legibilidad)
- Sugerencias opcionales (nice-to-have)
- Veredicto final: Approve / Approve with Comments / Request Changes

**Criterios de review (en orden de prioridad):**
1. Bugs y crashes
2. Arquitectura y diseno
3. Calidad de TypeScript
4. Legibilidad
5. Tailwind y estilos
6. Performance
7. Over-engineering
8. Edge cases

### 4. Security Guardian (El Auditor de Seguridad)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/frontend-security-guardian.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura |
| **Rol** | Identifica vulnerabilidades REALES y explotables |

**7 areas de analisis:**
- XSS (dangerouslySetInnerHTML, datos de usuario sin sanitizar)
- Input inseguro (uploads, redirects abiertos)
- Exposicion de datos sensibles (API keys en logs, PII)
- Manejo de tokens y autenticacion
- Seguridad de storage (localStorage, Zustand persist)
- Dependencias de terceros
- Headers de seguridad (CSP, clickjacking)

**Regla importante:** No reporta amenazas hipoteticas. Solo vulnerabilidades reales encontradas en el codigo.

### 5. Performance Auditor (El Optimizador)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/react-perf-auditor.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura |
| **Rol** | Encuentra cuellos de botella de rendimiento |

**6 dominios de analisis:**
1. Re-renders innecesarios
2. Hooks mal usados (deps incorrectas, useEffect innecesarios)
3. Memoizacion faltante o excesiva
4. Componentes demasiado grandes
5. Estado ineficiente (estado del servidor en Zustand)
6. CSS costoso (shadows, blurs, animaciones no-GPU)

### 6. Architecture Reviewer (El Arquitecto)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/frontend-architecture-reviewer.md` |
| **Modelo** | Opus (mas potente, para decisiones arquitectonicas) |
| **Herramientas** | Solo lectura |
| **Rol** | Evalua la arquitectura general del proyecto |

**Produce un scorecard de 5 dimensiones (1-5 estrellas cada una):**
1. Estructura de carpetas y modulos
2. Separacion de responsabilidades
3. Escalabilidad y extensibilidad
4. Patrones arquitectonicos
5. Deuda tecnica y riesgos

### 7. DX Standards Guardian (El Guardian de Estandares)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/dx-standards-guardian.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura |
| **Rol** | Revisa experiencia de desarrollador y consistencia |

**6 dimensiones de revision:**
1. Convenciones de nombres (PascalCase, camelCase, prefijos use/on/handle/is)
2. Consistencia de tipos (zero `any`, return types explicitos)
3. Compliance ESLint/Prettier
4. Complejidad cognitiva (funciones largas, nesting profundo)
5. Patrones repetidos (logica duplicada)
6. Documentacion implicita (magic numbers, TODOs)

### 8. UX/UI Reviewer (El Disenador)

| Propiedad | Valor |
|-----------|-------|
| **Archivo** | `.claude/agents/ux-ui-reviewer.md` |
| **Modelo** | Sonnet |
| **Herramientas** | Solo lectura |
| **Rol** | Evalua la experiencia de usuario desde el codigo |

**5 dimensiones:**
1. Claridad de componentes
2. Estados de carga/error/vacio
3. Accesibilidad (ARIA, keyboard nav, contraste)
4. Consistencia visual con Tailwind
5. Friccion en flujos de usuario

### Resumen visual de agentes

```
+---------------------------+-------------------+------------------+
| Agente                    | Puede escribir?   | Modelo           |
+---------------------------+-------------------+------------------+
| Frontend Specialist       | SI (el unico)     | Sonnet           |
| Debug Analyst             | NO (solo lectura)  | Sonnet           |
| Code Reviewer             | NO (solo lectura)  | Sonnet           |
| Security Guardian         | NO (solo lectura)  | Sonnet           |
| Performance Auditor       | NO (solo lectura)  | Sonnet           |
| Architecture Reviewer     | NO (solo lectura)  | Opus             |
| DX Standards Guardian     | NO (solo lectura)  | Sonnet           |
| UX/UI Reviewer            | NO (solo lectura)  | Sonnet           |
+---------------------------+-------------------+------------------+
```

> Solo 1 de 8 agentes escribe codigo. Los otros 7 analizan, diagnostican y recomiendan.

---

## Las Skills

Las skills son **bases de conocimiento especializadas** que los agentes consultan para tomar mejores decisiones. No son agentes ni ejecutan acciones. Son documentos de referencia.

### Skills disponibles

| Skill | Archivo | Para que sirve |
|-------|---------|----------------|
| **tanstack-query** | `.agents/skills/tanstack-query/` | React Query v5: patrones, errores comunes, migracion v4->v5 |
| **tanstack-router** | `.agents/skills/tanstack-router/` | TanStack Router: routing type-safe, 20 errores documentados |
| **typescript-advanced-types** | `.agents/skills/typescript-advanced-types/` | Tipos avanzados: generics, conditional types, mapped types |
| **vercel-react-best-practices** | `.agents/skills/vercel-react-best-practices/` | 57 reglas de optimizacion de Vercel Engineering |
| **gsap** | `.agents/skills/gsap/` | Animaciones GSAP en React con limpieza y accesibilidad |
| **frontend-design** | `.agents/skills/frontend-design/` | Diseno de interfaces distintivo, anti-"AI slop" |
| **react-email** | `.agents/skills/react-email/` | Templates de email HTML con componentes React |

### Que contiene cada skill

Cada skill tiene al menos un archivo `SKILL.md` con:

- **Versiones recomendadas** de librerias
- **Patrones correctos** de implementacion (con codigo)
- **Anti-patrones** que evitar (con codigo incorrecto)
- **Errores documentados** especificos y como prevenirlos
- **Templates** reutilizables

Algunas skills tienen contenido adicional:

```
.agents/skills/tanstack-query/
    SKILL.md              <-- Documento principal
    templates/            <-- Codigo reutilizable
    references/           <-- Documentacion adicional
    rules/                <-- Reglas individuales
    scripts/              <-- Scripts de utilidad
    assets/               <-- Recursos
```

### Como se conectan skills y agentes

El orquestador decide que skill recomienda a cada agente:

```
Solicitud: "Agrega paginacion infinita a la pagina de browse"

Orquestador decide:
  - Frontend Specialist -> consulta skill: tanstack-query (useInfiniteQuery)
  - Frontend Specialist -> consulta skill: tanstack-router (search params)
  - Code Reviewer -> consulta skill: vercel-react-best-practices
```

Los agentes no tienen las skills "cargadas" por defecto. El orquestador las asigna segun la tarea.

---

## Como Trabajan Juntos

### Protocolos de Handoff

Los agentes no trabajan aislados. Tienen **protocolos de transferencia** definidos para pasar informacion entre ellos:

#### Debug Analyst -> Frontend Specialist

Cuando el Debug Analyst encuentra un bug, genera un **Handoff Summary**:

```
Handoff Summary for Implementation:
- Root Cause: [1 oracion]
- Affected Files: [lista con que cambiar en cada uno]
- Recommended Fix Approach: [estrategia en lenguaje natural]
- Constraints: [que NO tocar]
- Priority: [critical/high/medium/low]
```

El Frontend Specialist lee este summary y ejecuta el fix sin re-investigar.

#### Architecture Reviewer -> Frontend Specialist

Cuando el Architecture Reviewer disena una estructura, genera un **Architecture Decision Summary**:

```
Architecture Decision Summary:
- Scope: [que archivos/features afecta]
- Structural Decisions: [ubicacion de archivos, jerarquia de componentes, state management, data flow, routing]
- Patterns to Follow: [referencias a archivos existentes]
- Constraints: [limites]
- Open Questions: [decisiones pendientes]
```

### Deconfliccion de alcance

Cuando multiples agentes trabajan en la misma solicitud, cada uno **evita duplicar** el trabajo del otro:

```
Ejemplo: Code Reviewer + Security Guardian + UX/UI Reviewer

Code Reviewer:    Revisa TODO excepto seguridad y UX (los otros lo cubren)
Security Guardian: Solo revisa seguridad
UX/UI Reviewer:   Solo revisa experiencia de usuario
```

Cada agente sabe que otros estan asignados y reduce su alcance para no repetir comentarios.

---

## Flujos de Trabajo Reales

### Flujo 1: Feature nueva

```
Usuario: "Quiero agregar una pagina de wishlist"

1. ORQUESTADOR analiza:
   - Intent: nueva feature
   - Selecciona: Architecture Reviewer -> Frontend Specialist -> Code Reviewer
   - Skills: tanstack-query, tanstack-router

2. ARCHITECTURE REVIEWER (Paso 1):
   - Lee la estructura del proyecto
   - Define donde van los archivos nuevos
   - Produce: Architecture Decision Summary

3. FRONTEND SPECIALIST (Paso 2):
   - Lee el Architecture Decision Summary
   - Implementa: componentes, hooks, servicios, rutas
   - Consulta skills de tanstack-query y tanstack-router

4. CODE REVIEWER (Paso 3):
   - Revisa SOLO el codigo recien escrito
   - Produce: lista de issues + veredicto
```

### Flujo 2: Bug report

```
Usuario: "El carrito muestra el total incorrecto al remover items"

1. ORQUESTADOR analiza:
   - Intent: bug fix
   - Selecciona: Debug Analyst -> Frontend Specialist

2. DEBUG ANALYST (Paso 1):
   - Traza cartStore.ts, CartSummary.tsx, CartItem.tsx
   - Encuentra: el metodo removeItem no recalcula el total
   - Produce: Handoff Summary

3. FRONTEND SPECIALIST (Paso 2):
   - Lee el Handoff Summary
   - Aplica el fix en cartStore.ts
```

### Flujo 3: Pre-deploy review

```
Usuario: "Vamos a deployar. Revisar todo"

1. ORQUESTADOR analiza:
   - Intent: review completa
   - Selecciona: Code Reviewer + Security Guardian + Performance Auditor + UX/UI Reviewer
   - Todos en paralelo (no hay dependencia entre ellos)

2. CODE REVIEWER:      Revisa calidad general (sin seguridad ni perf)
   SECURITY GUARDIAN:  Audita vulnerabilidades
   PERFORMANCE AUDITOR: Busca cuellos de botella
   UX/UI REVIEWER:     Evalua experiencia de usuario

3. Cada uno produce su reporte independiente
```

### Flujo 4: Consulta de arquitectura

```
Usuario: "Deberiamos migrar de Zustand a Redux Toolkit?"

1. ORQUESTADOR analiza:
   - Intent: decision arquitectonica
   - Selecciona: Architecture Reviewer (solo)

2. ARCHITECTURE REVIEWER:
   - Analiza uso actual de Zustand en el proyecto
   - Evalua impacto de migracion
   - Produce scorecard + recomendacion
```

---

## Estructura de Archivos

```
merchanding/
├── .claude/
│   ├── agents/                              <-- Definiciones de agentes
│   │   ├── frontend-agent-orchestrator.md   <-- Orquestador central
│   │   ├── senior-frontend-specialist.md    <-- El que escribe codigo
│   │   ├── frontend-debug-analyst.md        <-- Diagnostica bugs
│   │   ├── frontend-code-reviewer.md        <-- Revisa codigo
│   │   ├── frontend-security-guardian.md    <-- Audita seguridad
│   │   ├── react-perf-auditor.md            <-- Optimiza rendimiento
│   │   ├── frontend-architecture-reviewer.md <-- Evalua arquitectura
│   │   ├── dx-standards-guardian.md         <-- Guarda estandares
│   │   └── ux-ui-reviewer.md               <-- Revisa UX/UI
│   │
│   └── agent-memory/                        <-- Memoria persistente (por agente)
│       ├── frontend-agent-orchestrator/
│       ├── senior-frontend-specialist/
│       ├── frontend-debug-analyst/
│       ├── frontend-code-reviewer/
│       ├── frontend-security-guardian/
│       ├── react-perf-auditor/
│       ├── frontend-architecture-reviewer/
│       ├── dx-standards-guardian/
│       └── ux-ui-reviewer/
│
├── .agents/
│   └── skills/                              <-- Skills (bases de conocimiento)
│       ├── tanstack-query/
│       │   ├── SKILL.md
│       │   └── templates/
│       ├── tanstack-router/
│       │   ├── SKILL.md
│       │   ├── templates/
│       │   ├── references/
│       │   └── rules/
│       ├── typescript-advanced-types/
│       │   └── SKILL.md
│       ├── vercel-react-best-practices/
│       │   ├── SKILL.md
│       │   ├── AGENTS.md                    <-- 57 reglas compiladas
│       │   └── rules/                       <-- 57 archivos de reglas
│       ├── gsap/
│       │   ├── SKILL.md
│       │   └── references/
│       ├── frontend-design/
│       │   └── SKILL.md
│       └── react-email/
│           ├── SKILL.md
│           ├── TESTS.md
│           └── references/
│
└── CLAUDE.md                                <-- Configuracion global del proyecto
```

---

## Memoria Persistente

Cada agente tiene un directorio de memoria en `.claude/agent-memory/<nombre>/`. Si existe un archivo `MEMORY.md` ahi, su contenido se carga automaticamente en el contexto del agente en cada sesion.

### Para que sirve

- Recordar decisiones arquitectonicas tomadas
- Guardar preferencias del equipo
- Registrar patrones estables del proyecto
- Evitar repetir analisis en sesiones futuras

### Como usarla

Puedes pedirle a cualquier agente que "recuerde" algo:

```
"Recuerda que decidimos usar date-fns en vez de dayjs"
```

El agente guarda eso en su `MEMORY.md` y lo tendra presente en futuras sesiones.

### Que NO guardar

- Contexto de una sola sesion
- Informacion incompleta o especulativa
- Duplicados de lo que ya esta en CLAUDE.md

---

## Resumen Rapido

| Pregunta | Respuesta |
|----------|-----------|
| Quien decide que agentes usar? | El **Orquestador** |
| Quien escribe codigo? | Solo el **Frontend Specialist** |
| Los otros 7 agentes que hacen? | Analizan, diagnostican y recomiendan (solo lectura) |
| Que son las skills? | Documentos de referencia tecnica que los agentes consultan |
| Pueden los agentes comunicarse entre si? | Si, via **protocolos de handoff** estructurados |
| Los agentes recuerdan entre sesiones? | Si, via el sistema de **memoria persistente** |
| Cuantos agentes se usan por tarea? | El **minimo necesario** (el orquestador optimiza esto) |
