 # Portfolio Capstone — AI Chat with Website Lookup

A personal portfolio site with a built-in AI chat assistant that can look up and summarize any website on request, using a real tool call rather than a static chatbot.

**Live site:** https://abeer-zahid.vercel.app
**Chat demo:** https://abeer-zahid.vercel.app/chat
**Button demo:** https://abeer-zahid.vercel.app/button-demo

## Project Brief

**What problem does it solve?** Visitors (recruiters, potential clients) often want a quick way to explore a developer's work without reading a wall of text. This project pairs a real portfolio (case studies, positioning, contact info) with an AI chat feature that can actively look things up — e.g. asking the assistant to check a website pulls back its real title and description, not a guess.

**Who is it for?** Small business owners evaluating freelance frontend work, and recruiters/hiring managers reviewing an internship portfolio.

**Why this idea?** It doubles as both the portfolio *and* the proof of skill — the AI chat feature is itself one of the case studies shown on the site.

## Setup & Run Instructions

```bash
git clone https://github.com/AbeerZahid19/Portfolio-capstone.git
cd Portfolio-capstone
npm install --legacy-peer-deps
```

Create a `.env.local` file with:
GROQ_API_KEY=your_key_here


Then run:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Architecture Overview

- **`app/page.tsx`** — Home page: positioning, claim, links to LinkedIn/GitHub/CV/contact, featured case study.
- **`app/work/page.tsx`**, **`app/about/page.tsx`**, **`app/contact/page.tsx`** — static content pages.
- **`app/chat/page.tsx`** — the AI chat interface. Uses the `useChat` hook from `@ai-sdk/react` to stream messages, manage loading/error state, and render tool calls as distinct UI cards (checking / result / error).
- **`app/button-demo/page.tsx`** — a standalone demo of a state-choreographed "Send" button (idle/loading/success/error), reused from the chat's Send button pattern.
- **`app/api/chat/route.ts`** — server route that streams responses from the AI model and exposes the `fetchMetaTags` tool.
- **`components/ToolPart.tsx`** — renders the tool call's lifecycle states as UI cards.
- **`components/ChatInputForm.tsx`** — the validated chat input (disables Send on empty input, swaps to a Stop button while streaming).
- **`app/globals.css`** — Tailwind v4 theme tokens (colors, radius) plus custom keyframes for the button demo.

## AI Integration Explained

The chat route uses the **AI SDK** (`ai`, `@ai-sdk/react`, `@ai-sdk/groq`) with Groq's `llama-3.3-70b-versatile` model via `streamText`. It's given one real tool, **`fetchMetaTags`**: given a URL, it fetches the page and extracts the `<title>` and meta description. This isn't a decorative chatbot — the assistant only reports on a site's real title/description after actually calling the tool, and the UI shows every lifecycle state of that call (checking → result, or a designed error card if the fetch fails). The system prompt tells the model to use the tool whenever a user asks it to check, look up, or analyze a website.

## Known Limitations & Future Improvements

- The chat only exposes one tool (`fetchMetaTags`); it can't yet answer questions about page content beyond title/description.
- No persistent chat history — each page reload starts a new conversation.
- Contact page is a `mailto:` link rather than a working contact form.
- Only two case studies are written up on the Work page so far.
- WAVE accessibility scan flagged one minor alert (a redundant link near the featured case card) — not yet fixed.

## Testing

- **15 component tests** (Vitest + React Testing Library) covering:
  - `ToolPart` — all 4 tool lifecycle states plus a null-render case (6 tests)
  - `ChatInputForm` — validation, streaming state, Stop button (5 tests)
  - `ChatPage` — empty state, pending/loading, streamed assistant text, and error-with-retry state, with `useChat` mocked so no real API calls are made (4 tests)
- **1 Playwright end-to-end test** covering the primary flow: load the chat, type a message, send it, and see it appear in the conversation.
- **CI**: GitHub Actions runs the full suite (Vitest + Playwright) on every push to `main`. See `.github/workflows/test.yml`.

## Performance & Accessibility Audit

Audited with Google PageSpeed Insights (Lighthouse, mobile) and WAVE:

| Check | Result |
|---|---|
| Lighthouse Performance | 98/100 |
| Lighthouse Accessibility | 100/100 |
| Lighthouse Best Practices | 100/100 |
| Lighthouse SEO | 100/100 |
| WAVE Accessibility | 10/10 AIM score, 0 errors, 1 alert |

**Findings:** Lighthouse flagged render-blocking requests (~450ms potential savings) and some unused JavaScript (~29 KiB). WAVE flagged one redundant link near the featured case card on the home page (the case title and its "View case study" link both point to `/work`, which is slightly duplicative for screen reader users). Given the WCAG AA bar this project targets, the redundant-link alert is the more relevant fix — it's a small but real usability finding, not a performance nitpick.

## Deployment & Operation

- **Host:** Vercel, deployed automatically from the `main` branch via GitHub integration.
- **Live URL:** https://abeer-zahid.vercel.app
- **Error handling:** the chat route has designed error states for network failure, mid-stream failure, and rate limiting — each shows a distinct UI (not a crash) with a working "Retry last message" action. Route-level failures are caught by `app/chat/error.tsx`.
- **Rollback plan:** Vercel keeps every previous deployment; if a push breaks production, use Vercel's "Instant Rollback" on the last known-good deployment while the issue is fixed on `main`.
- **Monitoring:** relies on Vercel's built-in deployment status and CI test results on every push; no external monitoring service is wired up yet.

## Reflection

See `REFLECTION.md`.
## 3D Product Viewer (FE-AA2)

Live demo: `/lab`

An interactive 3D product-viewer-style scene built with React Three Fiber and Three.js. A torus knot mesh sits in a lit scene with orbit controls; clicking the shape cycles through a fixed set of material colors and pauses the auto-rotation, going beyond simple orbiting.

**Performance note:** the scene uses only primitive geometry (`torusKnotGeometry`) and a standard material — no external `.glb` model or HDRI environment map is loaded, so there's no asset download cost. The `<Canvas>` is dynamically imported via `next/dynamic` with `ssr: false`, so the Three.js/WebGL bundle is only fetched when the `/lab` page is actually visited, not on every page load. A `prefers-reduced-motion` check swaps the canvas for a static colored circle for users who've asked for reduced motion, instead of forcing the animation on them.

**With more time**, I'd add a small configurator panel (material color picker, wireframe toggle, auto-rotate speed) and support loading a real `.glb` model with DRACO compression, so the viewer could show an actual project screenshot mesh rather than a placeholder shape.
