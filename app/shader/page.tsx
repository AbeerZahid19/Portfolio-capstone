"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ShaderHero = dynamic(
  () => import("@/components/ShaderHero").then((mod) => mod.ShaderHero),
  { ssr: false }
);

export default function ShaderPage() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className="relative w-full h-[calc(100dvh-73px)] overflow-hidden">
      {reducedMotion ? (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgb(13,13,51), rgb(115,64,191))",
          }}
        />
      ) : (
        <div className="absolute inset-0">
          <ShaderHero />
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Abeer Zahid
        </h1>
        <p className="text-lg text-white/90 mt-4 max-w-md drop-shadow">
          Frontend engineer building AI-assisted features, one verified line at a time.
        </p>
      </div>
    </div>
  );
}