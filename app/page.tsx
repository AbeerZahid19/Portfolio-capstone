export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">A website that looks like you hired a whole team. You didn&apos;t.</h1>
        <p className="text-lg text-muted-foreground mb-8">I design and build clean, usable websites for small business owners who need a professional online presence but don&apos;t have an in-house developer.</p>

        <a href="/work" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium mb-16">See My Work</a>

        <div className="border rounded-lg p-6 text-left mb-8">
          <p className="text-sm text-muted-foreground mb-2">Featured case</p>
          <h2 className="text-xl font-semibold mb-2">Vague vs. Precise Prompting: Proving the Gap Between &quot;Looks Done&quot; and &quot;Is Done&quot;</h2>
          <p className="text-sm text-muted-foreground mb-4">Built the same feature twice to prove that AI-written code that looks finished and code that&apos;s actually verified are not the same thing.</p>
          <a href="/work" className="text-sm underline">View case study &rarr;</a>
        </div>

        <p className="text-sm text-muted-foreground mb-4">I&apos;m a CS student working as a frontend engineer, building AI-assisted features I actually test before shipping.</p>
        <a href="/about" className="text-sm underline mb-16 inline-block">More about me &rarr;</a>

        <div className="mt-12">
          <a href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">Contact Me</a>
        </div>
      </div>
    </div>
  );
}