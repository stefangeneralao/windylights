import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Device } from "./devices";
import { fetchRelayState, toggleRelay } from "./api";
import { ToggleSwitch } from "./ToggleSwitch";

interface Props {
  device: Device;
}

export function LampButton({ device }: Props) {
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div
      className={[
        "w-full rounded-2xl text-lg font-semibold transition-colors flex items-center",
        isOn
          ? "bg-yellow-300 text-yellow-900"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
        loading ? "opacity-50" : "",
        unknown ? "opacity-40" : "",
      ].join(" ")}
    >
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex-1 flex items-center justify-between px-6 py-4 min-h-[60px]"
      >
        <span>
          {device.name}
          {unknown && "…"}
        </span>
        <ToggleSwitch on={!!isOn} />
      </button>
      <button
        onClick={() => navigate(`/device/${device.id}`)}
        className={[
          "px-4 py-4 min-h-[60px] min-w-[44px] flex items-center justify-center border-l transition-colors",
          isOn
            ? "border-yellow-400 text-yellow-700 hover:text-yellow-900"
            : "border-zinc-300 dark:border-zinc-600 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200",
        ].join(" ")}
        aria-label={`${device.name} settings`}
      >
        ⚙
      </button>
    </div>
  );
}
