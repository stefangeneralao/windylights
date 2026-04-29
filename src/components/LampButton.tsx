import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Settings2 } from "lucide-react";
import { type Device } from "../lib/devices";
import { fetchRelayState, toggleRelay } from "../lib/api";
import { ToggleSwitch } from "./ToggleSwitch";

interface Props {
  device: Device;
  onStateChange?: (id: string, isOn: boolean | null) => void;
}

export function LampButton({ device, onStateChange }: Props) {
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

  useEffect(() => {
    onStateChange?.(device.id, isOn);
  }, [device.id, isOn, onStateChange]);

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
        "relative w-full rounded-2xl text-lg font-semibold transition-all duration-500 flex items-center border",
        isOn
          ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-900 border-amber-200/70"
          : "bg-white text-zinc-700 border-zinc-200 shadow-sm",
        loading || unknown ? "opacity-50" : "",
      ].join(" ")}
      style={
        isOn
          ? {
              boxShadow:
                "0 0 0 1px rgba(251,191,36,0.35), 0 8px 24px -8px rgba(251,191,36,0.55), 0 24px 60px -20px rgba(251,191,36,0.45)",
            }
          : {}
      }
    >
      {isOn && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-3xl opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 50%, rgba(253,224,71,0.55), transparent 70%)",
            zIndex: -1,
          }}
        />
      )}

      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex-1 flex items-center gap-4 px-5 py-4 min-h-[64px]"
      >
        <span
          className={[
            "flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-500",
            isOn
              ? "bg-yellow-400 text-yellow-800 shadow-[inset_0_-2px_4px_rgba(180,83,9,0.25),0_0_12px_rgba(253,224,71,0.8)]"
              : "bg-zinc-100 text-zinc-400",
          ].join(" ")}
        >
          <Lightbulb size={18} fill={isOn ? "currentColor" : "none"} strokeWidth={isOn ? 2.5 : 1.6} />
        </span>
        <span className="flex-1 text-left tracking-tight">
          {device.name}
          {unknown && <span className="ml-1 text-base opacity-50">…</span>}
        </span>
        <ToggleSwitch on={!!isOn} />
      </button>
      <button
        onClick={() => navigate(`/device/${device.id}`)}
        className={[
          "px-4 py-4 min-h-[64px] min-w-[52px] flex items-center justify-center border-l rounded-r-2xl transition-colors",
          isOn
            ? "border-amber-300/80 text-amber-700/80 hover:bg-amber-300/30"
            : "border-zinc-100 text-zinc-300 hover:bg-zinc-50 hover:text-zinc-500",
        ].join(" ")}
        aria-label={`${device.name} settings`}
      >
        <Settings2 size={17} />
      </button>
    </div>
  );
}
