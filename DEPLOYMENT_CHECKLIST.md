\# Deployment Checklist



\- \[x] App builds with no errors (`npm run build` succeeds locally and on Vercel)

\- \[x] Live URL is reachable over HTTPS on a clean, public domain (https://abeer-zahid.vercel.app)

\- \[x] Automatic deployment wired: every push to `main` triggers a new Vercel deployment

\- \[x] Environment variables (`GROQ\_API\_KEY`) set in Vercel project settings, not committed to the repo

\- \[x] Error states verified: network failure, mid-stream failure, and a simulated 429 rate limit all show a designed error UI with a working retry, not a crash

\- \[x] Empty states verified: first-run chat shows example prompts, not a blank screen

\- \[x] Tested on mobile viewport (layout, keyboard behavior, safe-area padding for the input bar)

\- \[x] Automated tests (Vitest + Playwright) pass locally and in CI before merging to `main`

\- \[x] Performance/accessibility audited (Lighthouse 98–100 across categories, WAVE 10/10 with 0 errors)

\- \[x] Rollback plan documented: Vercel's Instant Rollback to the last known-good deployment if a push breaks production



\*\*Sign-off:\*\* Abeer Zahid — capstone deployment checklist completed and verified against the live production URL.

