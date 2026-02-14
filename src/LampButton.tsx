import { useState, useEffect } from "react";
import { type Device } from "./devices";
import { fetchRelayState, toggleRelay } from "./api";
import { ToggleSwitch } from "./ToggleSwitch";

interface Props {
  device: Device;
}

export function LampButton({ device }: Props) {
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRelayState(device.id).then(setIsOn);
    const interval = setInterval(() => {
      fetchRelayState(device.id).then(setIsOn);
    }, 5000);
    return () => clearInterval(interval);
  }, [device.id]);

  async function handleToggle() {
    if (isOn === null) return;
    setLoading(true);
    await toggleRelay(device.id);
    setIsOn((prev) => (prev === null ? null : !prev));
    setLoading(false);
  }

  const unknown = isOn === null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={[
        "w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-between",
        isOn
          ? "bg-yellow-300 text-yellow-900"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
        loading ? "opacity-50" : "",
        unknown ? "opacity-40" : "",
      ].join(" ")}
    >
      <span>
        {device.name}
        {unknown && "…"}
      </span>
      <ToggleSwitch on={!!isOn} />
    </button>
  );
}
