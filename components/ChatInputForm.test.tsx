import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatInputForm } from "./ChatInputForm";

describe("ChatInputForm", () => {
  it("disables the send button when the input is empty", () => {
    render(<ChatInputForm onSubmit={vi.fn()} isStreaming={false} onStop={vi.fn()} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("enables the send button once text is typed", async () => {
    const user = userEvent.setup();
    render(<ChatInputForm onSubmit={vi.fn()} isStreaming={false} onStop={vi.fn()} />);
    await user.type(screen.getByLabelText(/message/i), "hello");
    expect(screen.getByRole("button", { name: /send/i })).toBeEnabled();
  });

  it("calls onSubmit with the typed text and clears the input", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ChatInputForm onSubmit={handleSubmit} isStreaming={false} onStop={vi.fn()} />);

    const input = screen.getByLabelText(/message/i);
    await user.type(input, "hello there");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(handleSubmit).toHaveBeenCalledWith("hello there");
    expect(input).toHaveValue("");
  });

  it("shows a Stop button and disables the input while streaming", () => {
    render(<ChatInputForm onSubmit={vi.fn()} isStreaming={true} onStop={vi.fn()} />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeDisabled();
  });

  it("calls onStop when the Stop button is clicked", async () => {
    const user = userEvent.setup();
    const handleStop = vi.fn();
    render(<ChatInputForm onSubmit={vi.fn()} isStreaming={true} onStop={handleStop} />);
    await user.click(screen.getByRole("button", { name: /stop/i }));
    expect(handleStop).toHaveBeenCalled();
  });
});