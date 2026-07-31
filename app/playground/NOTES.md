\# Notes: Hand-built components vs shadcn/ui



I built a Modal, Tabs, and Disclosure component by hand following the ARIA Authoring Practices patterns, then compared my Modal against shadcn/ui's Dialog (built on Radix UI primitives).



\## Gaps found between my Modal and shadcn's Dialog



1\. \*\*Portal rendering\*\*: shadcn renders the dialog through a React Portal directly into `document.body`, bypassing the normal component tree. My modal renders inline within its parent, which means it could be visually clipped if a parent element has `overflow: hidden` or a low `z-index`. I didn't account for this.



2\. \*\*Body scroll lock\*\*: shadcn/Radix automatically locks scrolling on the background page while the dialog is open. My modal doesn't do this — the page behind it can still be scrolled while the modal is open, which is a real usability/accessibility gap (a keyboard or screen reader user could lose their place).



3\. \*\*aria-describedby\*\*: shadcn provides a separate `DialogDescription` component that gets linked via `aria-describedby`, in addition to the title's `aria-labelledby`. My modal only labels the title — it has no way to associate additional descriptive text with the dialog for screen reader users.



\## What I got right

My modal did correctly implement focus trapping (Tab cycles within the dialog), Escape-to-close, returning focus to the trigger element on close, and `role="dialog"` + `aria-modal="true"` — the same core behaviors Radix provides, just implemented manually.



\## Takeaway

Building these by hand made the ARIA pattern requirements concrete rather than abstract. The gaps above are the kind of edge cases (portals, scroll locking, layered ARIA relationships) that a mature library handles by default but are easy to miss when building from scratch — which is exactly why reviewing AI- or library-generated components requires understanding what "correct" looks like first.

