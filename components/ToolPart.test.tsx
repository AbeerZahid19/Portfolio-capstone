import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ToolPart } from "./ToolPart";

describe("ToolPart", () => {
  it("shows a preparing message during input-streaming", () => {
    render(<ToolPart part={{ type: "tool-fetchMetaTags", state: "input-streaming" }} />);
    expect(screen.getByText(/preparing to check a website/i)).toBeInTheDocument();
  });

  it("shows the url being checked during input-available", () => {
    render(
      <ToolPart
        part={{
          type: "tool-fetchMetaTags",
          state: "input-available",
          input: { url: "https://vercel.com" },
        }}
      />
    );
    expect(screen.getByText(/checking website/i)).toBeInTheDocument();
    expect(screen.getByText(/vercel\.com/i)).toBeInTheDocument();
  });

  it("renders title and description on output-available", () => {
    render(
      <ToolPart
        part={{
          type: "tool-fetchMetaTags",
          state: "output-available",
          output: {
            url: "https://vercel.com",
            title: "Vercel",
            description: "The platform for frontend developers",
          },
        }}
      />
    );
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    expect(screen.getByText("The platform for frontend developers")).toBeInTheDocument();
  });

  it("falls back to 'Not found' when title or description is missing", () => {
    render(
      <ToolPart
        part={{
          type: "tool-fetchMetaTags",
          state: "output-available",
          output: { url: "https://example.com", title: null, description: null },
        }}
      />
    );
    expect(screen.getAllByText(/not found/i)).toHaveLength(2);
  });

  it("shows an error message on output-error", () => {
    render(
      <ToolPart
        part={{
          type: "tool-fetchMetaTags",
          state: "output-error",
          errorText: "Site unreachable",
        }}
      />
    );
    expect(screen.getByText(/couldn't check that website/i)).toBeInTheDocument();
    expect(screen.getByText(/site unreachable/i)).toBeInTheDocument();
  });

  it("renders nothing for a different tool type", () => {
    const { container } = render(
      <ToolPart part={{ type: "tool-somethingElse", state: "output-available" }} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});