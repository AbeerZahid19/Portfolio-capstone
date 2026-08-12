\# Reflection



\*\*What was hardest, and why?\*\*



Setting up Playwright's end-to-end test on Windows was the hardest part of the whole capstone. The browser kept crashing on launch — first with a "Target page, context or browser has been closed" error, then a Windows crash dialog, then a "Target crashed" error even after reinstalling the browser. None of these were code problems; they were environment issues (GPU/sandbox behavior on Windows) that don't show up in most tutorials, which are usually written from a Mac or Linux setup. It took several rounds of adjusting the Playwright config (increasing timeouts, disabling GPU, disabling the sandbox) before a single test run actually completed. The frustrating part wasn't the debugging itself, it was not being able to tell from the error message alone whether the problem was my test, my config, or my machine.



\*\*What would I do differently next time?\*\*



I'd set up testing at the start of the build instead of at the end. I added Vitest and Playwright only in FE-09, after the chat feature, the tool calls, and the error states already existed — which meant retrofitting tests onto code that wasn't written with testability in mind (for example, I had to pull the chat input and the tool-result renderer out into separate components before I could test them in isolation). If I'd set up the test runner in week one, I could have written a test alongside each feature as I built it, instead of doing one large testing pass at the end.



\*\*One thing I learned that surprised me\*\*



I didn't expect mocking to be so simple, or so useful. Before this, I assumed testing an AI chat feature meant either calling the real API in tests (slow, unpredictable, costs money) or not really testing the AI parts at all. Learning that `vi.mock` lets me swap `useChat` for a fake version I fully control — deciding exactly what `messages`, `status`, and `error` are for a given test — meant I could test things that are genuinely hard to trigger for real, like "what does the UI look like mid-network-failure," just by setting `error` to a fake `Error` object. That reframed testing for me: it's not about recreating the real system, it's about controlling just enough of it to check one specific behavior.

