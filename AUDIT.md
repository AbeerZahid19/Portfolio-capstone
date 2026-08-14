\# Accessibility \& Performance Audit (FE-10)



\## Scope

Audited the primary flow: the chat page (`/chat`), plus a WAVE scan of the site's key pages. Tested on mobile (Lighthouse mobile preset, throttled) since that's the rubric's bar.



\## Before



\*\*Lighthouse (mobile, `/chat`):\*\*

| Metric | Score |

|---|---|

| Performance | 69 |

| Accessibility | 95 |

| Best Practices | 100 |

| SEO | 100 |



Key issue flagged: Total Blocking Time of 1,350ms, driven by \~114–128 KiB of unused JavaScript and long main-thread tasks — the initial bundle was heavier than it needed to be.



\*\*WAVE:\*\* 0 errors, AIM score 10/10, 1 alert (a redundant link near the featured case card on Home, where the case title and "View case study" link both point to `/work`).



\*\*Keyboard-only pass (chat):\*\* Tab order reaches the input, example prompts, Send/Stop buttons, and the retry button in a logical order, with a visible focus ring on each — this already worked before any fixes.



\## Changes Made



1\. \*\*Added `aria-live="polite"` and `aria-relevant="additions"`\*\* to the chat message container, so screen readers announce new assistant messages as they stream in, instead of the user having to manually re-scan the page.

2\. \*\*Removed the unused `Geist\_Mono` font\*\* from the root layout — it was being loaded on every page even though no monospace text is rendered anywhere in the app.

3\. \*\*Enabled `compress: true`\*\* and \*\*disabled `productionBrowserSourceMaps`\*\* in `next.config.ts`, reducing what the production build ships to the browser.

4\. Verified the Stop button (shown while a response is streaming) is reachable and activatable by keyboard alone.



The WAVE alert (redundant link) was not changed in this pass — it's a minor, low-severity finding on the Home page rather than the chat flow this audit focused on, and is tracked as a known item.



\## After



\*\*Lighthouse (mobile, `/chat`):\*\*

| Metric | Score | Delta |

|---|---|---|

| Performance | 90 | +21 |

| Accessibility | 95 | — |

| Best Practices | 100 | — |

| SEO | 100 | — |



\*\*WAVE:\*\* still 0 errors, AIM score 10/10, 1 alert (unchanged, tracked as known/low-severity).



\*\*Keyboard-only pass (chat):\*\* re-verified after changes — input, example prompts, Send/Stop, and retry button all remain reachable and operable by keyboard, and the new `aria-live` region doesn't interfere with tab order.



\## Screenshots

See attached before/after Lighthouse screenshots.

