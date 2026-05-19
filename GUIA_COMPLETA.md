# CloserAI — Guía Completa de Deploy
# Creado por: Ornella Olmos Motos | Partner: Dev Remoto USD

## ESTRUCTURA DEL PROYECTO

```
closerAI/
├── src/
│   ├── App.tsx                          ← Router principal con guards de auth
│   ├── main.tsx                         ← Entry point con providers
│   ├── globals.css                      ← Estilos globales + Tailwind
│   │
│   ├── pages/
│   │   ├── landing/
│   │   │   └── LandingPage.tsx          ← LANDING PAGE PÚBLICA COMPLETA
│   │   ├── auth/
│   │   │   └── AuthPages.tsx            ← Login + Signup
│   │   ├── onboarding/
│   │   │   └── OnboardingPage.tsx       ← Wizard BYOK 3 pasos
│   │   └── app/
│   │       ├── CRMApp.tsx               ← CRM principal (Pipeline Kanban)
│   │       ├── CommsApp.tsx             ← Motor de comunicaciones
│   │       └── MembersPage.tsx          ← Gestión de equipo
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   └── GlobePulse.tsx           ← Globe interactivo LATAM+USA
│   │   └── app/
│   │       ├── TrialBanner.tsx          ← Banner de trial con días restantes
│   │       └── FeatureGate.tsx          ← Bloqueo de features por plan
│   │
│   ├── context/
│   │   ├── AuthContext.tsx              ← Auth + workspace + feature flags
│   │   └── LangContext.tsx             ← ES/EN automático
│   │
│   └── lib/
│       ├── supabase.ts                  ← Cliente Supabase + callEdgeFunction()
│       ├── api.ts                       ← Servicios → Edge Functions
│       ├── plans.ts                     ← PLANES, ROLES, LÍMITES (listo para Stripe)
│       └── i18n.ts                      ← Traducciones ES+EN
│
├── supabase/
│   ├── schema.sql                       ← Schema PostgreSQL completo con RLS
│   └── functions/                       ← 12 Edge Functions Deno
│       ├── _shared/utils.ts             ← Crypto AES-256, CORS, auth
│       ├── save-keys/                   ← Guarda keys BYOK encriptadas
│       ├── verify-keys/                 ← Verifica Resend/Evolution/Twilio
│       ├── send-message/                ← Envía WA/SMS/Email
│       ├── twilio-token/                ← JWT para dialer de voz
│       ├── webhook-wa/                  ← Mensajes WhatsApp entrantes
│       ├── webhook-twilio/              ← SMS + llamadas
│       ├── webhook-resend/              ← Bounces de email
│       ├── enroll-sequence/             ← Enrolla contacto en secuencia
│       ├── sequence-runner/             ← Motor pg_cron (sin n8n)
│       ├── stripe-checkout/             ← PREPARADO (activar cuando tengas Stripe)
│       ├── stripe-portal/               ← PREPARADO
│       └── stripe-webhook/              ← PREPARADO
│
├── package.json                         ← Dependencias del proyecto
├── vite.config.ts                       ← Config de Vite
├── tailwind.config.js                   ← Config de Tailwind
├── vercel.json                          ← Config de deploy en Vercel
├── .env.example                         ← Template de variables de entorno
└── .gitignore                           ← Archivos a ignorar en Git

```

---

## PASO 1 — INSTALAR LO NECESARIO (una sola vez)

### En Windows:
1. Ir a **nodejs.org** → descargar **Node.js LTS** → instalar como cualquier programa
2. Ir a **git-scm.com** → descargar → instalar (todo "next")
3. Ir a **code.visualstudio.com** → descargar VS Code → instalar

### Verificar instalación (abrir cmd/terminal):
```bash
node --version    # debe mostrar v18.x.x o mayor
git --version     # debe mostrar git version x.x.x
```

---

## PASO 2 — CREAR CUENTAS GRATUITAS

1. **GitHub** → github.com → Sign up → crear cuenta
2. **Supabase** → supabase.com → Start your project → crear con GitHub  
3. **Vercel** → vercel.com → Sign up → crear con GitHub

---

## PASO 3 — PREPARAR EL PROYECTO

1. Descomprimí el ZIP en una carpeta: `Documents/closerAI`
2. Abrí VS Code → File → Open Folder → elegís esa carpeta
3. Abrí la terminal en VS Code: **View → Terminal**
4. Ejecutá:
```bash
npm install
```
*(esto instala todas las dependencias — tarda 1-2 minutos)*

Para activar el globe 3D interactivo (opcional):
```bash
npm install cobe
```

---

## PASO 4 — CONFIGURAR SUPABASE

1. Ir a **supabase.com** → New Project → nombre "closerAI"
2. Anotar la **Project URL** y la **Anon Key** (Settings → API)
3. Ir a **SQL Editor** → pegar todo el contenido de `supabase/schema.sql` → **Run**
4. Authentication → Settings → habilitar **Email/Password**

---

## PASO 5 — CONFIGURAR VARIABLES DE ENTORNO

En la carpeta del proyecto, crear el archivo `.env.local` (si no existe, crearlo):

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...TU_ANON_KEY...
VITE_APP_URL=http://localhost:5173
```

*(Reemplazá los valores con los de tu proyecto de Supabase)*

---

## PASO 6 — PROBAR LOCALMENTE

```bash
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

Deberías ver la landing page de CloserAI con:
- Navbar con toggle ES/EN
- Hero con warm glow dorado
- Dashboard preview animado (ContainerScroll)
- Sección "Por qué elegirla"
- Integraciones BYOK con costos
- Demo de estilo de escritura IA
- Estadísticas con fuentes
- Casos de éxito (Lucas, Sarah, Dev Remoto USD)
- Testimonios scroll infinito
- Precios Growth/Pro/Agency
- FAQ con acordeón
- Captura de emails beta
- Soporte + comunidad
- Footer con Ornella Olmos Motos + Dev Remoto USD

---

## PASO 7 — SUBIR A GITHUB

```bash
git init
git add .
git commit -m "CloserAI v1.0 — Beta"
```

En github.com → **New repository** → nombre "closerAI" → **Create repository**

Copiar el comando que dice `git remote add origin...` y ejecutarlo:
```bash
git remote add origin https://github.com/TU_USUARIO/closerAI.git
git push -u origin main
```

---

## PASO 8 — DEPLOY EN VERCEL

1. Ir a **vercel.com** → **Add New Project** → Import Git Repository → elegir "closerAI"
2. En **Environment Variables** agregar:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu Anon Key
3. Click en **Deploy** → esperar 2 minutos
4. Vercel te da una URL tipo `closerAI.vercel.app` ← **tu app está live**

---

## PASO 9 — DEPLOY DE EDGE FUNCTIONS

Instalar Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref TU_PROJECT_REF
```
*(el project ref está en Supabase → Settings → General)*

Agregar secrets en Supabase → Settings → Edge Functions → Secrets:
```
ENCRYPTION_KEY = (generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
WEBHOOK_SECRET = texto-largo-aleatorio-seguro
CRON_SECRET    = otro-texto-largo-aleatorio
CLOSER_AI_DOMAIN = https://closerAI.vercel.app
```

Deployar todas las Edge Functions:
```bash
supabase functions deploy
```

---

## PASO 10 — CONFIGURAR WEBHOOKS

**Evolution API (WhatsApp):**
- URL: `https://TU_PROYECTO.supabase.co/functions/v1/webhook-wa?secret=TU_WEBHOOK_SECRET`
- Events: `messages.upsert`, `connection.update`

**Twilio (SMS + Voz):**
- URL: `https://TU_PROYECTO.supabase.co/functions/v1/webhook-twilio`

**Resend (Email):**
- URL: `https://TU_PROYECTO.supabase.co/functions/v1/webhook-resend`
- Events: sent, delivered, opened, bounced

---

## SISTEMA DE PLANES (ya configurado en src/lib/plans.ts)

| Plan | Precio | Workspaces | Usuarios | Contactos |
|------|--------|------------|----------|-----------|
| Growth | $9/mes | 1 | 1 | 500 |
| Pro | $29/mes | 3 | 3 | 2.500 |
| Agency | $79/mes | Ilimitados | Ilimitados | Ilimitados |

**Descuento anual: −20%** → $7 / $23 / $63

### ¿Cómo funciona el equipo Setter + Closer?
El **owner** (quien paga) configura las APIs una sola vez.
Los setters y closers que invita usan las mismas APIs automáticamente.
- **Setter**: solo ve sus propios leads
- **Closer**: ve todos los leads para cerrar

---

## PARA CONECTAR STRIPE (cuando estés lista)

1. Crear cuenta en **stripe.com**
2. Crear 3 productos: Growth ($9/$7), Pro ($29/$23), Agency ($79/$63)
3. En `src/lib/plans.ts` completar los `STRIPE_PRICE_IDS` donde dice `"price_COMPLETAR"`
4. En Supabase secrets agregar `STRIPE_SECRET_KEY`
5. En Stripe → Webhooks → URL: `https://TU_PROYECTO.supabase.co/functions/v1/stripe-webhook`

**Todo lo demás ya está construido y esperando.**

---

## BETA SIN STRIPE (para los primeros clientes)

Crear usuarios manualmente en Supabase:
- Authentication → Users → **Invite user** → ingresar email
- En la tabla `workspace_members` setear el plan directamente

---

## COMPONENTES INTEGRADOS EN LA LANDING

| Componente | Fuente | Sección |
|-----------|--------|---------|
| **ContainerScroll** | Código adjunto | App Preview (scroll 3D animado) |
| **TestimonialsColumn** | Código adjunto | Testimonios (scroll infinito 3 columnas) |
| **GlobePulse** | Código adjunto adaptado | Mercados LATAM+USA |
| **AnimatePresence** | Framer Motion | Navbar mobile + FAQ |
| **Motion variants** | Framer Motion | Todas las secciones (fade-in al scroll) |

---

## CRÉDITOS

**Creado por:** Ornella Olmos Motos  
**Partner oficial:** [Dev Remoto USD](https://www.skool.com/dev-remoto-usd)  
**Stack:** React + TypeScript + Vite + Supabase + Vercel



---

## ACTUALIZACIONES — Versión 2 (mayo 2026)

### NUEVAS FUNCIONES EN ESTA VERSIÓN

#### 1. ADN de Escritura (Voice DNA)
El sistema aprende la voz real del usuario para que los mensajes no suenen a IA genérica.
- Nuevos campos en el perfil: `writingTone`, `sentenceLength`, `usesEmoji`, `usesHumor`
- `avoidWords` — palabras que la IA nunca va a usar
- `signaturePhrase` — muletilla recurrente del usuario
- `writingSample1/2/3` — mensajes reales del usuario (la IA aprende el estilo)
- `originStory` — historia personal para emails narrativos
- `dreamClientDescription` — cómo el usuario describe a su cliente ideal con sus palabras
- La función `build_voice_dna()` inyecta esto en TODOS los prompts automáticamente

#### 2. Email Marketing (pantalla nueva en la app)
- **9 tipos de secuencia**: welcome, nurturing, launch, reengagement, hormozi, story, origin_story, cold_outreach, followup
- **5 tipos de story email**: origin, hero_journey, storybrand, micro_story, case_study
- **5 estilos de prospección**: Félix Fernández, Hormozi, 5 Actos, A-C-A, Consultor
- Generador de lead magnets con principios de Hormozi
- Recomendador de embudo con proyección de revenue

#### 3. Base de Conocimiento $100M Leads
- Framework A-C-A completo (Acknowledge → Compliment → Ask)
- Ecuación de Valor con los 4 elementos (Dream Outcome, Likelihood, Time, Effort)
- Los 6 tipos de lead magnet con criterios de selección
- Los 4 canales Core Four con benchmarks reales de Hormozi
- Hero's Journey adaptado a email marketing
- StoryBrand (Donald Miller) completo
- Reglas de deliverability y anti-spam

#### 4. Nuevas tablas en Supabase
Ejecutar en SQL Editor después del schema principal:
- `lead_memory` — historial de conversaciones para agentes LangGraph
- `api_usage` — analytics de uso de IA
- `email_sequences` — secuencias generadas guardadas
- `user_voice_profiles` — ADN de escritura por usuario

### ORDEN DE ARCHIVOS A USAR
- `closerAI_final/` → Frontend React (deploy en Vercel)
- `closerAI_api/` → Backend FastAPI (deploy en Railway)
- `closerAI_final/supabase/schema.sql` → Ejecutar en Supabase (incluye todas las tablas nuevas)
- `closerAI_api/supabase_migration.sql` → Ya incluido en schema.sql, no duplicar
