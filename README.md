# Mohammed Khizer Shaikh | Portfolio

A modern, highly secure, and performance-optimized Next.js portfolio website built by Mohammed Khizer Shaikh.

---

## 🛑 CTO & Senior Project Manager Audit Report
*Brutally Honest Assessment of the Codebase*

### 1. Security & Vulnerability Defense
**Rating: 9/10 (Exceptional)**
- **The Good:**
  - Robust implementation of Next.js Server Actions with built-in CSRF (`setCsrfCookie`, `validateServerCsrfToken`) and IP-based rate limiting (`rateLimitMap`).
  - Correct execution of strict HTTP security headers including `Strict-Transport-Security`, `X-Frame-Options`, and `X-XSS-Protection`.
  - Admin login routes are gated heavily via Firestore document checks, with fallback protection via `MASTER_UID`.
  - Content-Security-Policy (CSP) explicitly whitelists Google Analytics and Firebase Auth safely.
- **The Bad (Constructive Criticism):**
  - Rate limiting is currently an in-memory `Map`. In a serverless environment (like Vercel or Netlify edge functions), memory resets per invocation. This means a dedicated attacker spamming the form could theoretically bypass the limit if their requests hit different serverless containers.
  - **CTO Recommendation:** Migrate the rate limiter to a persistent KV store like Upstash Redis for true distributed rate limiting.

### 2. Manageability & Code Health
**Rating: 8.5/10 (Strong)**
- **The Good:**
  - Clean, modular separation of concerns (e.g., `src/firebase/`, `src/components/`, `src/actions/`).
  - Elegant componentization using Shadcn UI and Tailwind CSS.
  - Strict build enforcement is active (`ignoreBuildErrors: false` and `ignoreDuringBuilds: false`), meaning your CI/CD pipeline acts as a strict gatekeeper against bad code reaching production.
- **The Bad (Constructive Criticism):**
  - There is a slight overuse of `any` types in catch blocks (e.g., `catch (error: any)` in login forms).
  - **CTO Recommendation:** Implement proper `unknown` error typing and utilize `Zod` schemas on your Server Actions to validate form data strictly at runtime. This will drastically improve maintainability as the project grows.

### 3. SEO & Discoverability
**Rating: 9.5/10 (State-of-the-Art)**
- **The Good:**
  - Excellent use of the Next.js Metadata API, with dynamically generated `sitemap.ts` and `robots.ts`.
  - Perfect OpenGraph and Twitter card integration for rich social sharing previews.
  - Active integration with the IndexNow API to proactively ping search engines (Bing/Yandex) about content changes.
  - Semantic `JSON-LD` (Person) schema injected globally.
- **The Bad (Constructive Criticism):**
  - While the global schema is great, individual projects lack specific rich-result targeting.
  - **CTO Recommendation:** To achieve a flawless 10/10, consider adding specific `SoftwareApplication` or `Article` JSON-LD schemas dynamically to your individual `/projects` or `/admin` blog pages, rather than relying solely on the global `Person` schema.

---

## 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database/Auth:** Firebase (Authentication, Firestore)
- **Deployment:** Netlify / Vercel

## 🛠 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammadkhizer/Mohammedkhizer-Portfolio.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Ensure you have a `.env` file populated with your Firebase configuration and Bing verification tokens.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
