"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { ToolPart } from "@/components/ToolPart";
import { ChatInputForm } from "@/components/ChatInputForm";

function MessageSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg px-3 py-2 max-w-[80%] bg-gray-200 animate-pulse space-y-2 w-48">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );
}

function EmptyState({ onExample }: { onExample: (text: string) => void }) {
  const examples = [
    "Check the website https://vercel.com",
    "What does https://nextjs.org do?",
  ];
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <p className="text-gray-600 font-medium mb-2">No conversation yet</p>
      <p className="text-sm text-gray-400 mb-4">
        Try asking me to check a website:
      </p>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => onExample(ex)}
            className="text-sm border rounded px-3 py-2 hover:bg-gray-50 text-left"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    if (status !== "streaming" && status !== "submitted") {
      setRetrying(false);
    }
  }, [status]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAutoScroll(isAtBottom);
  }

  function handleRetry() {
    if (retrying) return;
    setRetrying(true);
    regenerate();
  }

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-4 border rounded p-3"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && !isStreaming && (
          <EmptyState onExample={(text) => sendMessage({ text })} />
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <div
                    key={i}
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {part.text}
                  </div>
                );
              }
              return <ToolPart key={i} part={part} />;
            })}
          </div>
        ))}

        {status === "submitted" && <MessageSkeleton />}

        {error && (
          <div className="flex justify-start">
            <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg px-3 py-2 max-w-[80%]">
              <p className="text-sm mb-2">
                Something went wrong sending that message.
              </p>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {retrying ? "Retrying..." : "Retry last message"}
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!autoScroll && (
        <button
          type="button"
          onClick={() => {
            setAutoScroll(true);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mb-2 text-sm text-blue-600 underline self-center"
        >
          Jump to latest ↓
        </button>
      )}

      <ChatInputForm
        onSubmit={(text) => sendMessage({ text })}
        isStreaming={isStreaming}
        onStop={stop}
      />
    </div>
  );
}