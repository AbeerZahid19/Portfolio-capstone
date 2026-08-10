"use client";

import { useState } from "react";

type ChatInputFormProps = {
  onSubmit: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
};

export function ChatInputForm({ onSubmit, isStreaming, onStop }: ChatInputFormProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 pb-[env(safe-area-inset-bottom)]"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        aria-label="Message"
        className="flex-1 border rounded px-3 py-2"
        disabled={isStreaming}
      />
      {isStreaming ? (
        <button type="button" onClick={onStop} className="bg-red-600 text-white px-4 py-2 rounded">
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
  );
}