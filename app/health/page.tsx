async function getHealthData() {
  // Simple fetch to a public API to prove data-fetching works
  const res = await fetch("https://api.github.com/zen", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch health data");
  }
  const text = await res.text();
  return text;
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Health Check</h1>
      <p className="text-green-600 mb-2">✓ App is running</p>
      <p className="text-gray-600">
        Fetched data (proves data-fetching works): <span className="italic">"{data}"</span>
      </p>
    </div>
  );
}