import { useState, useEffect } from "react";
import { devices } from "./devices";

const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

async function fetchRelayState(deviceId: string): Promise<boolean | null> {
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/relay/0?status`);
    const data = await res.json();
    return data.ison as boolean;
  } catch {
    return null;
  }
}

async function toggleRelay(deviceId: string): Promise<void> {
  await fetch(`${PROXY_URL}/${deviceId}/relay/0?turn=toggle`).catch(() => {});
}

function LampButton({ device }: { device: (typeof devices)[number] }) {
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRelayState(device.id).then(setIsOn);
  }, [device.id]);

  async function handleToggle() {
    if (isOn === null) return;
    setLoading(true);
    await toggleRelay(device.id);
    setIsOn((prev) => (prev === null ? null : !prev));
    setLoading(false);
  }

  const on = isOn === true;
  const unknown = isOn === null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={[
        "min-h-[44px] w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-colors",
        on
          ? "bg-yellow-300 text-yellow-900"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
        loading ? "opacity-50" : "",
        unknown ? "opacity-40" : "",
      ].join(" ")}
    >
      {device.name} — {unknown ? "…" : on ? "On" : "Off"}
    </button>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-4 p-6">
      {devices.map((d) => (
        <LampButton key={d.id} device={d} />
      ))}
    </main>
  );
}

export default App;
