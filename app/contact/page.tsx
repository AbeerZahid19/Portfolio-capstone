export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-muted-foreground mb-8">
        Have a project in mind, or just want to talk through an idea? Send me a message and I will get back to you.
      </p>
      <a href="mailto:mehbaaabeerr@gmail.com" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">Email Me</a>
      <p className="text-xs text-muted-foreground mt-6">
        I usually reply within a day or two.
      </p>
    </div>
  );
}