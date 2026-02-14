import { useState, useEffect } from "react";
import { devices } from "./devices";
import { fetchRelayState, toggleRelay } from "./api";

export function LampButton({ device }: { device: (typeof devices)[number] }) {
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
        "w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-colors",
        on
          ? "bg-yellow-300 text-yellow-900"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
        loading ? "opacity-50" : "",
        unknown ? "opacity-40" : "",
      ].join(" ")}
    >
      {device.name}
      {unknown && "…"}
    </button>
  );
}
