"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

function fakeSend(): Promise<void> {
  const delay = 800 + Math.random() * 700;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error("failed"));
      } else {
        resolve();
      }
    }, delay);
  });
}

function SendButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleClick() {
    if (status === "loading") return; // interruptible guard: ignore spam clicks mid-flight

    setStatus("loading");
    setShake(false);

    try {
      await fakeSend();
      setStatus("success");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("error");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  const layerBase =
    "send-btn-layer absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-out";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      aria-live="polite"
      className={[
        "relative w-44 h-12 rounded-lg font-medium select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
        "transition-colors duration-300",
        status === "error"
          ? "bg-destructive text-white"
          : status === "success"
          ? "bg-green-600 text-white"
          : "bg-primary text-primary-foreground hover:opacity-90",
        status === "loading" ? "cursor-wait opacity-90" : "cursor-pointer",
        shake ? "send-btn-shake" : "",
      ].join(" ")}
      style={shake ? { animation: "shake 400ms ease-in-out" } : undefined}
    >
      {/* idle layer */}
      <span
        className={[
          layerBase,
          status === "idle"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        Send
      </span>

      {/* loading layer */}
      <span
        className={[
          layerBase,
          status === "loading"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <span
          className="send-btn-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
          style={{ animation: "spin 700ms linear infinite" }}
        />
        Sending...
      </span>

      {/* success layer */}
      <span
        className={[
          layerBase,
          status === "success"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        <span
          className="send-btn-check inline-block"
          style={
            status === "success"
              ? { animation: "checkPop 350ms ease-out" }
              : undefined
          }
        >
          ✓
        </span>
        Sent
      </span>

      {/* error layer */}
      <span
        className={[
          layerBase,
          status === "error"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none",
        ].join(" ")}
      >
        Retry
      </span>
    </button>
  );
}

export default function ButtonDemoPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Send Button — State Choreography</h1>
      <p className="text-muted-foreground mb-10">
        Click the button below. It has a 20% random chance of failing, so click it a
        few times to see both the success and error paths.
      </p>

      <div className="flex items-center gap-6 mb-12">
        <SendButton />
      </div>

      <div className="border rounded-lg p-6 text-sm leading-relaxed">
        <h2 className="font-semibold mb-2">Duration & Easing Notes</h2>
        <p className="mb-2">
          State content crossfades with a 300ms ease-out transition on opacity and
          transform (translateY) only — no width or layout properties are animated,
          so the button never causes layout thrash. 300ms felt like the right length
          for a state that&apos;s being read, not just glanced at.
        </p>
        <p className="mb-2">
          The loading spinner uses a fast 700ms linear rotation, since a spinner
          needs to read as continuous motion rather than an eased one.
        </p>
        <p className="mb-2">
          On error, a single 400ms shake plays once (via transform: translateX) to
          draw attention, then settles — it never repeats, so it doesn&apos;t feel
          alarming. The button stays red with a &quot;Retry&quot; label as the
          persistent feedback, so the state is still clear even if the shake is
          skipped.
        </p>
        <p>
          The button is disabled during the loading state, which prevents
          spam-clicking from starting overlapping requests. All motion respects{" "}
          <code>prefers-reduced-motion</code>: transitions and animations are cut to
          near-zero duration, but the color and text-label changes (Send → Sending...
          → Sent / Retry) still communicate every state change.
        </p>
      </div>
    </div>
  );
}