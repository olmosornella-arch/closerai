# CloserAI — Motor B2B de Ventas con IA

> **CRM inteligente para equipos de ventas B2B que quieren prospectar, calificar y cerrar más en menos tiempo.**

🔗 **App en vivo:** [closerai-olive.vercel.app](https://closerai-olive.vercel.app)  
🛠️ **Stack:** React 18 · TypeScript · Supabase · Vite · IA Multi-proveedor  
📍 **Origen:** Mendoza, Argentina — construido por [@olmosornella](https://github.com/olmosornella-arch)

---

## ¿Qué resuelve?

Los equipos de ventas B2B pierden horas cada día en tareas que no cierran negocios:

| Problema | Solución en CloserAI |
|---|---|
| Prospección manual lenta en LinkedIn | Prospector con 17 fuentes + Apify |
| Mensajes genéricos con 2% de respuesta | Redacción IA con 5 tonos personalizados |
| Leads sin calificar que nunca van a comprar | Qualify Gate BANT con scoring automático |
| Seguimiento caótico, leads olvidados | Pipeline visual + Cadencias multicanal |
| Sin métricas reales de outreach | Dashboard con KPIs en tiempo real |

---

## Funciona. Se ve bien. Resuelve un problema real.

**✅ Funciona** — La app está deployada en Vercel con Supabase como backend. Registro, login, pipeline, IA, métricas y persistencia funcionan en producción.

**✅ Se ve bien** — Diseño "Silent Luxury": navy, esmeralda y dorado. Tipografía Cormorant Garamond + DM Sans. Dark theme. 100% responsive, instalable como PWA en Android.

**✅ Problema real** — Lo construí para resolver mi propio flujo de ventas B2B. Hoy lo uso para gestionar leads de ComUni (mi workspace actual), el nicho de Dev Remoto USD y afiliados.

---

## Demo en 5 minutos

```
1. Abrí closerai-olive.vercel.app
2. Click "Modo demo" — sin cuenta requerida
3. Explorá el Pipeline con leads reales del nicho B2B
4. Probá Redacción IA → generá un mensaje personalizado
5. Andá a Qualify Gate → calificá un lead con BANT + análisis IA
```

O creá tu cuenta gratis y empezá desde cero.

---

## Features principales

- **🎯 Pipeline CRM** — Kanban visual, drag & drop, historial de actividades
- **✦ Redacción IA** — 6 proveedores (Claude, GPT, Groq gratis, Gemini, DeepSeek), 5 tonos
- **◉ Prospector B2B** — 17 fuentes: LinkedIn, Instagram, Maps, TikTok, YouTube, Crunchbase
- **◆ Qualify Gate** — Scoring BANT 1-10 + análisis IA con probabilidad de cierre
- **⚡ Cadencias** — Secuencias multicanal LinkedIn + Email + WhatsApp
- **✉ Email Marketing** — Campañas con variables dinámicas y selección de leads
- **📥 Inbox IA** — Detecta sentiment e intención, sugiere respuesta
- **📊 Métricas** — KPIs reales: DMs, respuestas, cierres, revenue USD
- **🔑 41 integraciones** — APIs en 9 categorías configurables por workspace

---

## Stack técnico

```
Frontend:  React 18 + TypeScript + Vite
Backend:   Supabase (PostgreSQL + Auth + RLS)
Deploy:    Vercel (auto-deploy desde GitHub)
IA:        Anthropic · OpenAI · Groq · Gemini · DeepSeek · OpenRouter
Scraping:  Apify (LinkedIn, Instagram, Maps, TikTok, YouTube)
Auth:      Supabase Auth (email/password + JWT)
```

---

## Arquitectura

```
Multi-tenant: cada usuario tiene su workspace aislado
API-key-first: el usuario aporta sus propias keys de IA (costo ~$2-5 USD/mes)
Single-file: toda la app en CRMApp.tsx (~4000 líneas, arquitectura intencional)
PWA-ready: instalable en Android desde Chrome sin Play Store
```

---

## Estado actual

- ✅ Deployada en Vercel (producción)
- ✅ Backend Supabase con persistencia real
- ✅ Auth funcionando (registro + login + reset password)
- ✅ IA multi-proveedor operativa
- ✅ Pipeline con leads reales del nicho Dev Remoto USD
- 🔄 En proceso: integración de pagos Stripe (v12)
- 🔄 En proceso: app Android nativa con Capacitor.js

---

## Roadmap

| Versión | Feature | Estado |
|---|---|---|
| v11 | Supabase persistencia + Auth + IA multi-proveedor | ✅ Live |
| v12 | Stripe billing · Android nativo · Apollo import | 🔄 Q3 2026 |
| v13 | WhatsApp API nativa · iOS · Módulo afiliados | 📅 Q4 2026 |
| v14 | White-label · API pública · Señales IA | 📅 Q1 2027 |

---

## Comercialización

Modelo SaaS con 3 planes:

| Plan | Precio | Leads | IA |
|---|---|---|---|
| Starter | $29/mes | 500 | — |
| Pro | $79/mes | 5.000 | ✅ |
| Agency | $199/mes | Ilimitados | ✅ |

---

## Correr localmente

```bash
git clone https://github.com/olmosornella-arch/closerai
cd closerai
npm install

# Crear .env.local con:
# VITE_SUPABASE_URL=tu_url
# VITE_SUPABASE_ANON_KEY=tu_key

npm run dev
```

---

## Contacto

**Ornella Olmos** — AI Operations & Growth Engineer  
📍 Mendoza, Argentina  
📧 olmosornella@gmail.com  
🔗 [linkedin.com/in/ornellaolmos](https://linkedin.com/in/ornellaolmos)

---

<p align="center">
  <strong>CloserAI v11 · Motor B2B · Junio 2026</strong><br/>
  <em>Construido para closers que prospectan solos y quieren sistematizar sin perder el toque humano.</em>
</p>
