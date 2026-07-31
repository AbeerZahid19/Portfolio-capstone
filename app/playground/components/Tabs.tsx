"use client";

import { useState, useRef } from "react";

interface Tab {
  id: string;
  label: string;
  content: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", content: "This is the Home tab content." },
  { id: "about", label: "About", content: "This is the About tab content." },
  { id: "contact", label: "Contact", content: "This is the Contact tab content." },
];

export default function Tabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent) {
    let newIndex = activeIndex;
    if (e.key === "ArrowRight") {
      newIndex = (activeIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }
    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Example Tabs" onKeyDown={handleKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === i}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === i ? 0 : -1}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: "8px 16px",
              marginRight: "4px",
              border: "1px solid #555",
              background: activeIndex === i ? "#333" : "transparent",
              color: "white",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeIndex !== i}
          tabIndex={0}
          style={{ padding: "16px", border: "1px solid #333", marginTop: "8px" }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}