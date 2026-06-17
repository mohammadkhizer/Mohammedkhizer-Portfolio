# Mohammed Khizer Shaikh — Portfolio

> A production-grade, AI-powered portfolio built with **Next.js 15**, **Firebase**, and **Google Genkit**.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://mohammedkhizershaikh.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Sentry](https://img.shields.io/badge/Sentry-Monitored-purple)](https://sentry.io)

## 🏗️ Architecture

This portfolio uses a **Server-First** architecture:

- **Server Components** render all portfolio content (Projects, Skills, Experience) for instant load times and maximum SEO.
- **Firebase Admin SDK** handles all privileged data access server-side — no client-side Firestore reads.
- **ISR Caching** (`unstable_cache`) with tag-based revalidation provides sub-second page loads with 1-hour data freshness.
- **Sentry** provides full-stack observability across client, server, and edge runtimes.
- **Genkit AI** powers intelligent project recommendations with a keyword-match fallback for high availability.

See [docs/architecture.md](docs/architecture.md) for detailed diagrams.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Firebase project with Firestore enabled
- Google AI API key (for Genkit)

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `MASTER_UID` | Admin user UID for privileged operations |
| `GOOGLE_GENAI_API_KEY` | Google AI API key for Genkit |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking |

### Installation

```bash
npm install
```

### Development

```bash
npm run dev          # Start Next.js dev server
npm run genkit:dev   # Start Genkit dev UI
```

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── ai/                  # Genkit AI flows and configuration
│   ├── flows/           # AI recommendation flows
│   └── genkit.ts        # Genkit initialization
├── app/                 # Next.js App Router pages
│   ├── about/
│   ├── contact/
│   ├── experience/
│   ├── projects/
│   ├── layout.tsx       # Root layout with SEO metadata
│   ├── loading.tsx      # Global skeleton (Boneyard) preloader
│   ├── page.tsx         # Home page (Server Component)
│   ├── sitemap.ts       # Dynamic sitemap generation
│   └── robots.ts        # SEO robots.txt
├── components/          # React components
│   ├── ui/              # shadcn/ui primitives
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── ...
├── lib/                 # Utilities
│   ├── db.ts            # Server-side Firestore queries (cached)
│   ├── firebase-admin.ts # Admin SDK initialization
│   ├── security-client.ts # Input sanitization
│   └── constants.ts     # Application constants
└── firebase/            # Client-side Firebase (auth only)
```

## 🔒 Security

- **Zero-Trust Data Access**: All Firestore reads go through the Admin SDK on the server.
- **Master UID Verification**: Admin operations are gated by a server-side environment variable.
- **Content Security Policy**: Strict CSP headers block XSS, clickjacking, and data exfiltration.
- **AI Prompt Hardening**: User inputs are sanitized before reaching LLM prompts, with injection detection.

## 📊 Monitoring

- **Sentry**: Client, server, and edge error tracking with session replays.
- **Google Analytics**: Page views and user engagement tracking.
- **Performance**: ISR caching, image optimization, and code splitting for Core Web Vitals.

## 📝 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run genkit:dev` | Start Genkit development UI |

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
