import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 
 export const metadata: Metadata = {
  title: {
    default: "Abeer Zahid — Frontend Engineer",
    template: "%s | Abeer Zahid",
  },
  description:
    "I design and build clean, usable websites for small business owners who need a professional online presence but don't have an in-house developer. Frontend engineer building AI-assisted features I actually test before shipping.",
  metadataBase: new URL("https://abeer-zahid.vercel.app"),
  openGraph: {
    title: "Abeer Zahid — Frontend Engineer",
    description:
      "I design and build clean, usable websites for small business owners who need a professional online presence but don't have an in-house developer.",
    url: "https://abeer-zahid.vercel.app",
    siteName: "Abeer Zahid",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Abeer Zahid — Frontend Engineer",
    description:
      "I design and build clean, usable websites for small business owners who need a professional online presence but don't have an in-house developer.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b px-6 py-4">
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
