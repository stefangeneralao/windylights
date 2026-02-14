import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Settings2 } from "lucide-react";
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
        "w-full rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center border border-zinc-200",
        isOn
          ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-900 shadow-lg shadow-yellow-300/50 dark:shadow-yellow-400/20"
          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm",
        loading ? "opacity-50" : "",
        unknown ? "opacity-50" : "",
      ].join(" ")}
    >
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex-1 flex items-center gap-4 px-5 py-4 min-h-[64px]"
      >
        <span
          className={[
            "flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-300",
            isOn
              ? "bg-yellow-400 text-yellow-800"
              : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500",
          ].join(" ")}
        >
          <Lightbulb size={18} strokeWidth={isOn ? 2.5 : 1.5} />
        </span>
        <span className="flex-1 text-left">
          {device.name}
          {unknown && <span className="ml-1 text-base opacity-50">…</span>}
        </span>
        <ToggleSwitch on={!!isOn} />
      </button>
      <button
        onClick={() => navigate(`/device/${device.id}`)}
        className={[
          "px-4 py-4 min-h-[64px] min-w-[52px] flex items-center justify-center border-l transition-all duration-300",
          isOn
            ? "border-yellow-300 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-300/40"
            : "border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700",
          "rounded-r-2xl",
        ].join(" ")}
        aria-label={`${device.name} settings`}
      >
        <Settings2 size={17} />
      </button>
    </div>
  );
}
