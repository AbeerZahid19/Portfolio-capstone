"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ProductViewer = dynamic(
  () => import("@/components/ProductViewer").then((mod) => mod.ProductViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] rounded-lg border flex items-center justify-center bg-gray-950 text-gray-400 text-sm">
        Loading 3D scene...
      </div>
    ),
  }
);

export default function LabPage() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">3D Product Viewer</h1>
      <p className="text-muted-foreground mb-6">
          Drag to orbit, click the shape to cycle its color. 
      </p>

      {reducedMotion ? (
        <div className="w-full h-[420px] rounded-lg border flex flex-col items-center justify-center bg-gray-950 text-gray-300 gap-2">
          <div className="w-24 h-24 rounded-full bg-indigo-500" />
          <p className="text-sm">3D animation paused (reduced motion preferred)</p>
        </div>
      ) : (
        <ProductViewer />
      )}
    </div>
  );
}