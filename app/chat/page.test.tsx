import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatPage from "./page";

const mockUseChat = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: () => mockUseChat(),
}));

describe("ChatPage", () => {
  beforeEach(() => {
    mockUseChat.mockReset();
  });

  it("shows the empty state when there are no messages", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<ChatPage />);
    expect(screen.getByText(/no conversation yet/i)).toBeInTheDocument();
  });

  it("shows a loading skeleton while a response is pending (submitted)", () => {
    mockUseChat.mockReturnValue({
      messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      sendMessage: vi.fn(),
      status: "submitted",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    const { container } = render(<ChatPage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders assistant text once a message streams in", () => {
    mockUseChat.mockReturnValue({
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "hi" }] },
        { id: "2", role: "assistant", parts: [{ type: "text", text: "Hello there!" }] },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: undefined,
      regenerate: vi.fn(),
    });

    render(<ChatPage />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("shows a designed error banner with a retry button when useChat reports an error", () => {
    mockUseChat.mockReturnValue({
      messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      error: new Error("network error"),
      regenerate: vi.fn(),
    });

    render(<ChatPage />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry last message/i })).toBeInTheDocument();
  });
});