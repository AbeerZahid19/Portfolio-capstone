 "use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";

function ToolPart({ part }: { part: any }) {
  if (part.type !== "tool-fetchMetaTags") return null;

  if (part.state === "input-streaming") {
    return (
      <div className="text-sm text-gray-500 italic border rounded p-2 my-1">
        Preparing to check a website...
      </div>
    );
  }

  if (part.state === "input-available") {
    return (
      <div className="text-sm text-blue-600 border rounded p-2 my-1">
        🔍 Checking website: {part.input?.url}
      </div>
    );
  }

  if (part.state === "output-available") {
    const output = part.output;
    return (
      <div className="border rounded-lg p-3 my-1 bg-green-50">
        <p className="font-semibold text-sm">Website Info</p>
        <p className="text-xs text-gray-500 break-all">{output.url}</p>
        <p className="mt-1"><strong>Title:</strong> {output.title || "Not found"}</p>
        <p><strong>Description:</strong> {output.description || "Not found"}</p>
      </div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div className="border rounded-lg p-3 my-1 bg-red-50 text-red-700">
        ⚠️ Couldn't check that website: {part.errorText}
      </div>
    );
  }

  return null;
}

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
  const [input, setInput] = useState("");
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  function handleRetry() {
    if (retrying) return; // guard against double-click
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

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 pb-[env(safe-area-inset-bottom)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}