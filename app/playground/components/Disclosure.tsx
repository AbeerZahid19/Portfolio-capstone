"use client";

import { useState, useId } from "react";

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}

export default function Disclosure({ summary, children }: DisclosureProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <div className="border rounded p-2">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((prev) => !prev)}
        className="font-semibold w-full text-left flex justify-between items-center"
      >
        <span>{summary}</span>
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <div id={contentId} className="pt-2">
          {children}
        </div>
      )}
    </div>
  );
}