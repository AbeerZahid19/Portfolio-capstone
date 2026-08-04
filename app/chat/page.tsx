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

export default function ChatPage() {
  const { messages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

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

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-4 border rounded p-3"
      >
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

        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2 bg-gray-200 text-black italic">
              Thinking...
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

      <form onSubmit={handleSubmit} className="flex gap-2">
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}