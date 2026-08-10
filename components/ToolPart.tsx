export function ToolPart({ part }: { part: any }) {
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