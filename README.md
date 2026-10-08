# Mohammed Khizer Shaikh — Portfolio

> A production-grade, high-performance, security-hardened portfolio built with **Next.js 15 (App Router)**, **MongoDB**, **Tailwind CSS**, and **Google Genkit AI**.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://mohammedkhizershaikh.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4)](https://tailwindcss.com)
[![Sentry](https://img.shields.io/badge/Sentry-Monitored-purple)](https://sentry.io)

---

## 🚀 Features & Enhancements

- **⚡ Site Preloader**: Non-blocking initial site preloader featuring an animated brand logo, glowing aura, and real-time progress bar (`0% → 100%`).
- **📜 Scroll Progress Bar**: Viewport sticky top bar tracking reading position using GPU-accelerated CSS transforms.
- **🛡️ 20-Item Security Hardening**:
  - **CSRF Token Validation**: 32-byte cryptographically secure tokens stored in `HttpOnly`, `SameSite: strict` cookies.
  - **MongoDB Query Sanitization**: Protection against operator injection attacks (`$gt`, `$eq`).
  - **SSRF Validation**: Blocks server-side requests targeting private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254`).
  - **Webhook Signature Verification**: HMAC SHA-256 verification using constant-time string comparison.
  - **File Upload Protection**: Validates MIME types, extensions, and file sizes (5MB limit).
  - **Strict CSP Headers**: Allowlist rules for Google Fonts, Analytics, and Sentry endpoints with `hideSourceMaps: true`.
- **📊 UTM Parameter Tracking**: Automatic query parameter capture (`utm_source`, `utm_medium`, `utm_campaign`), persistent `sessionStorage` sync, and contact form auto-forwarding.
- **✉️ Form Success & Error States**: Visual confirmation card with checkmark animations, turnaround expectation notices, and field-level validation error alerts.
- **⚠️ Confirmation Mode**: Modal confirmation dialogs protecting against accidental form resets or destructive actions.
- **❓ Expandable FAQ Accordion**: Q&A section with real-time text search, Expand/Collapse All toggle, and inline Schema.org `FAQPage` JSON-LD schema.
- **♿ Skip to Content & Accessibility**: Keyboard accessible jump link (`href="#main-content"`) targeting `<main id="main-content">` for screen readers.
- **🕒 Content Freshness Badge**: Dynamic "Last updated" date badge in footer and sub-pages.
- **🤖 Genkit AI Integration**: Intelligent project recommendation flows with fallback keyword match pipelines.

---

## 🏗️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Server-First Architecture)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, Vanilla CSS custom scrollbars & micro-interactions
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JWT signed tokens stored in `HttpOnly`, `Secure`, `SameSite: strict` cookies
- **Observability**: Sentry error tracking & Google Analytics 4
- **Deployment**: Netlify (Node 22 runtime)

---

## 📁 Project Structure

```
src/
├── actions/                  # Server Actions for secure data mutations
│   ├── certs.ts
│   ├── contact.ts
│   └── projects.ts
├── ai/                       # Google Genkit AI flows and configuration
│   ├── flows/                # Recommendation flows
│   └── genkit.ts
├── app/                      # Next.js App Router pages
│   ├── about/
│   ├── contact/
│   ├── experience/
│   ├── projects/
│   ├── skills/
│   ├── globals.css           # Design system tokens & hover utilities
│   ├── layout.tsx            # Root layout with SEO & Schema.org metadata
│   ├── loading.tsx           # Global skeleton preloader
│   └── not-found.tsx         # Redesigned 404 page
├── components/               # React components
│   ├── CookieBanner.tsx      # GDPR/CCPA cookie consent banner
│   ├── FAQSection.tsx        # Expandable FAQ accordion with search
│   ├── GlobalLayoutWrapper.tsx # Client wrapper for site-wide UI features
│   ├── ScrollProgressBar.tsx # Top viewport scroll progress indicator
│   ├── SkipToContent.tsx     # Accessibility skip link
│   ├── SitePreloader.tsx     # Animated entrance preloader
│   ├── UTMTracker.tsx        # Client query string capture
│   └── ui/                   # Primitive UI components
└── lib/                      # Server & client security utilities
    ├── auth.ts               # JWT & session handling
    ├── security.ts           # CSRF, rate limiting, SSRF, & upload validation
    ├── security-client.ts    # Input sanitization
    └── utmTracker.ts         # UTM parameter parsing
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: `>= 20.0.0` (Recommended: `22.x`)
- **MongoDB**: Connection string URI
- **Resend / Email**: API key (optional for contact form email forwarding)

### Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio
JWT_SECRET=your-secure-jwt-secret-key
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compiler check
npm run typecheck

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
