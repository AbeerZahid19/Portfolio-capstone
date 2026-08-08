export default function WorkPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Work</h1>
      <p className="text-muted-foreground mb-12">
        A couple of real builds — what the problem was, what I did, and what came of it.
      </p>

      {/* Case 1 */}
      <section className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Vague vs. Precise Prompting: Proving the Gap Between &quot;Looks Done&quot; and &quot;Is Done&quot;
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>The problem:</strong> I use AI to write code faster, but I didn&apos;t have proof
            the code was actually reliable — I just trusted whatever it gave me. I needed to find
            out the real gap between a lazy prompt and a detailed one with a verification step.
          </p>
          <p>
            <strong>What I did:</strong> I built the same settings form feature twice, on two
            separate Git branches, in fresh sessions. Round 1 used a single vague prompt with no
            context, accepted as-is. Round 2 used a detailed prompt with exact validation rules,
            accessibility requirements, and an explicit instruction to write and run tests before
            calling it done.
          </p>
          <p>
            <strong>What came of it:</strong> Round 1 looked complete but was never verified — no
            tests were written, so there was no way to know what was actually broken. Round 2
            produced 15 passing test assertions and caught, on its own, an edge case I never
            specified — whitespace-only input being accepted as valid.
          </p>
          <p className="italic">
            Looking done and being verified are not the same thing.
          </p>
        </div>
        <a href="/contact" className="inline-block mt-4 text-sm underline">
          Contact me about a similar project →
        </a>
      </section>

      {/* Case 2 */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Portfolio Capstone Skeleton: Shipping Before There Was Anything to Ship
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>The problem:</strong> I needed my capstone portfolio site live from day one,
            not at the end. If the deploy pipeline isn&apos;t proven early, you find out it&apos;s
            broken at the worst possible time — right when you actually have something to show.
          </p>
          <p>
            <strong>What I did:</strong> I scaffolded a Next.js app with placeholder pages for
            every planned screen — Home, Work, About, Contact — then added a health-check page
            that fetches real data, not just static text. That mattered because a placeholder page
            can look deployed and still be broken; a page that has to fetch data either works or
            it doesn&apos;t. I connected the repo to Vercel so every push deploys automatically,
            and checked that it held up at both mobile and desktop widths.
          </p>
          <p>
            <strong>What came of it:</strong> A live, publicly deployed site with zero build errors
            and automatic CI/CD from the first commit. When I later built the accessible components
            and the streaming chat feature, I plugged straight into this foundation — no setup, no
            deploy config, no redoing the pipeline. The early work paid for itself.
          </p>
        </div>
        <a href="/contact" className="inline-block mt-4 text-sm underline">
          Contact me about a similar project →
        </a>
      </section>
    </div>
  );
}