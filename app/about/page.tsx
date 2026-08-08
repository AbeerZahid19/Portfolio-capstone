export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">About</h1>

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          I&apos;m a Computer Science student, currently working as a frontend engineer through
          a hands-on internship where I build real features — chat interfaces, accessible
          components, deployment pipelines — and ship them to production, not just a course
          project sitting on my laptop.
        </p>
        <p>
          I design and build clean, usable websites for small business owners who need a
          professional online presence but don&apos;t have an in-house developer.
        </p>
        <p>
          <strong>How I work:</strong> I use AI as a build partner, but I don&apos;t take its
          output on faith — every feature gets checked, tested, and I make sure I can explain
          how it works before it ships. That habit came directly out of one of the projects
          on my Work page: proving that code which &quot;looks done&quot; and code that&apos;s
          actually verified are not the same thing.
        </p>
        <p>
          Outside of client-style projects, I&apos;m especially interested in UX research and
          cybersecurity, and I&apos;m building toward a freelance and software development
          career.
        </p>
      </div>

      <a href="/contact" className="inline-block mt-8 text-sm underline">
        Ready to start? Contact me →
      </a>
    </div>
  );
}