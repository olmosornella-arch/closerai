<div align="center">

# CloserAI

### B2B Sales Engine · Multi-Channel Lead Generation Platform

A full-stack SaaS that consolidates LinkedIn, Instagram, Facebook, Google Maps and web scraping into a unified prospecting workflow — with built-in CRM, AI message generation, qualification scoring, email campaigns and multi-channel cadences.

[Live Demo](https://closerai-olive.vercel.app) · [Report Bug](https://github.com/olmosornella-arch/closerai/issues) · [Request Feature](https://github.com/olmosornella-arch/closerai/issues)

![Status](https://img.shields.io/badge/status-production-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-blueviolet)
![Deploy](https://img.shields.io/badge/deploy-Vercel-black)

</div>

---

## Overview

CloserAI is a production-grade B2B prospecting platform built for solo founders, sales setters and small agencies that need to move fast across multiple lead sources without losing organization. It replaces the typical fragmented workflow (LinkedIn Sales Navigator + Apollo + Lemlist + a CRM + a spreadsheet) with one unified interface.

Built with a "Silent Luxury" design philosophy — minimalist, sophisticated, navy and gold — it ships with role-based access control, encrypted API key storage, and a multi-tenant architecture suitable for small teams.

## Key Features

### Lead Prospecting Engine
14 integrated data sources via Apify Actors:

| Platform | Sources |
|----------|---------|
| **LinkedIn** | Post commenters · Keyword search · Profile enrichment · Company employees |
| **Instagram** | Hashtag scraper · Profile scraper · Phone number extractor |
| **Facebook** | Business pages · Post commenters · Phone extractor · User search |
| **Google Maps** | Local businesses with phone, email, rating, website |
| **Multi-platform** | Web Contact Scraper · ZoomInfo alternative |

Each source displays contact chips (email, phone, LinkedIn, Instagram, Facebook, website), filters by platform, and bulk-adds to the CRM with one click.

### Full CRM Suite
- **Pipeline Kanban** with 5 customizable stages
- **Closer View** — leads sorted by score for prioritization
- **Dashboard** with daily mission and real-time KPIs
- **AI Message Generation** — direct, empathetic and VSL tones
- **Inbox Analyzer** — AI-powered response classification

### Sales Intelligence
- **Qualify Gate** — interactive BANT scoring (Budget · Authority · Need · Timeline)
- **Metrics Dashboard** — DMs sent, reply rate, meeting rate, revenue tracking
- **Funnel visualization** by stage and temperature (Hot/Warm/Cold)
- **7d / 30d** performance windows with historical charts

### Multi-Channel Outreach
- **Email Campaigns** — draft, schedule, send with open/reply tracking
- **Cadences Builder** — visual multi-channel sequences (LinkedIn → Email → WhatsApp → Call)
- **Knowledge Base** — DM templates, objection handling scripts, closing playbooks

### Team & Security
- **Role-based access control** — Admin / Member with granular permissions
- **API Keys vault** — encrypted, admin-only visibility
- **Multi-workspace support** — separate projects with isolated data
- **Row Level Security** at the database layer via Supabase RLS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Custom CSS-in-JS with design tokens (Cormorant Garant + DM Sans + DM Mono) |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Auth** | Supabase Auth (email/password + session persistence) |
| **External APIs** | Apify Actors for lead extraction |
| **Deployment** | Vercel (CI/CD via GitHub) |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CloserAI Frontend                       │
│                    (React + TypeScript)                      │
└────────────────┬────────────────────────────┬───────────────┘
                 │                            │
        ┌────────▼─────────┐         ┌────────▼─────────┐
        │    Supabase      │         │   Apify Actors   │
        │  Auth + DB + RLS │         │  (14 sources)    │
        └──────────────────┘         └──────────────────┘
                 │
        ┌────────▼─────────────────────────────────────┐
        │  PostgreSQL Schema                            │
        │  workspaces · workspace_members · leads       │
        │  api_keys · email_campaigns · cadences        │
        │  knowledge_items · metrics_daily              │
        └───────────────────────────────────────────────┘
```

## Design System

Built on a "Silent Luxury" aesthetic — minimalist, sophisticated, restrained.

```
Background:    #07090F          (deep midnight)
Surface:       rgba(255,255,255,0.035)  (subtle glass)
Accent:        #C9A84C          (muted gold)
Success:       #10b981          (emerald)
Text Primary:  #EAE6DF          (warm ivory)
Text Muted:    #8A8A8A          (graphite)

Display Font:  Cormorant Garant (serif, weight 300)
Body Font:     DM Sans
Mono Font:     DM Mono (for numbers)
```

Glassmorphism cards, generous spacing (24px+ padding), three-tier typography hierarchy, and gold accent lines for emphasis. No emojis in the UI — only typographic symbols (◈ ◐ ◉ ✦ ◆) for icon language.

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project ([create one free](https://supabase.com))
- An Apify account ([sign up](https://apify.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/olmosornella-arch/closerai.git
cd closerai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create `.env.local` at the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

API keys for Apify and other services are managed inside the app via the encrypted **Settings → API Keys** panel (admin only). They are never committed to the repository.

### Database Setup

1. Open your Supabase project → SQL Editor
2. Run the schema from `supabase_schema.sql`
3. The script creates all tables, RLS policies and triggers

### Run Locally

```bash
npm run dev
# Open http://localhost:5173
```

### Deploy to Vercel

```bash
[vercel --prod](https://closerai-olive.vercel.app/)
```

Don't forget to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel's Environment Variables settings.

## Project Structure

```
closerai/
├── src/
│   ├── pages/app/
│   │   └── CRMApp.tsx         # Main app component (single-file architecture)
│   ├── lib/                   # Utilities and helpers
│   └── main.tsx               # React entry point
├── public/                    # Static assets
├── supabase_schema.sql        # Database schema with RLS policies
├── .env.local                 # Local environment variables (gitignored)
├── package.json
└── vite.config.ts
```

## Roadmap

- [ ] Real Apify integration (currently using mock data — schema is ready)
- [ ] Native LinkedIn OAuth for personal account scraping
- [ ] Webhook integrations with n8n / Make / Zapier
- [ ] Mobile-responsive layout optimization
- [ ] Custom domain support per workspace
- [ ] Stripe billing for team plans
- [ ] AI-powered lead scoring (predicting close probability)
- [ ] Slack and Discord integration for team alerts

## Demo Mode

The app includes a demo mode that bypasses authentication — useful for portfolio reviews and quick exploration. Visit the live demo and click "Modo demo" on the login screen.

## What I Built

This is a solo project — every architectural decision, every line of code, every design token. Highlights of the engineering work:

- **Single-file React architecture** (~1600 LOC) for fast iteration and easy deployment
- **Multi-tenant database design** with Row Level Security enforced at the PostgreSQL layer
- **Role-based access control** that hides API keys from non-admin users at the database level (not just the UI)
- **Custom design system** built from scratch — no Tailwind, no Material UI, no shadcn
- **14 Apify Actor integrations** mapped to a unified Lead interface
- **Progressive enhancement** — works offline in demo mode, persists to Supabase when configured

## Why I Built This

I run B2B prospecting operations for digital communities and SaaS products. The existing tools forced me into either expensive enterprise stacks (Apollo + Outreach + Salesforce) or a chaotic patchwork of free tools that didn't talk to each other. CloserAI is the tool I wanted to use myself — and the codebase doubles as a portfolio piece demonstrating full-stack capabilities, design sensibility and product thinking.

## License

MIT © Ornella Olmos

## Connect

- **Portfolio:** (https://closerai-olive.vercel.app/)
- **LinkedIn:** www.linkedin.com/in/ornella-olmos-motos
- **Email:** olmosornella@gmail.com

---

<div align="center">

**Built with ❤️ in Mendoza, Argentina**

If you find this project interesting, consider giving it a ⭐ — it helps a lot.

</div>
