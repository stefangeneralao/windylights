import { useState } from "react";
import { Plus } from "lucide-react";
import { type ScheduleRule } from "../lib/api";
import { DAY_LABELS, DAY_DIGITS, PRESETS, matchPreset } from "../lib/days";
import { ToggleSwitch } from "./ToggleSwitch";

export function AddRuleForm({
  onAdd,
  initialRule,
  submitLabel = "Add rule",
}: {
  onAdd: (rule: ScheduleRule) => void;
  initialRule?: ScheduleRule;
  submitLabel?: string;
}) {
  const [time, setTime] = useState(initialRule?.time ?? "22:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialRule ? initialRule.days.split("") : ["1", "2", "3", "4", "5", "6", "0"],
  );
  const [action, setAction] = useState<"on" | "off">(initialRule?.action ?? "off");

  const activePreset = matchPreset(selectedDays);

  function toggleDay(d: string) {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function handleAdd() {
    if (!time || selectedDays.length === 0) return;
    const days = DAY_DIGITS.filter((d) => selectedDays.includes(d)).join("");
    onAdd({ time, days, action });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Time + action row */}
      <div className="flex gap-3 items-stretch">
        <div className="flex-1 flex items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 px-4 min-h-[56px]">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-transparent text-2xl font-mono font-bold text-zinc-800 tabular-nums outline-none w-full text-center"
          />
        </div>
        <button
          onClick={() => setAction(action === "on" ? "off" : "on")}
          className={[
            "flex flex-col items-center justify-center gap-1 px-4 min-w-[88px] rounded-xl border transition-colors",
            action === "on"
              ? "bg-amber-300/30 border-amber-300 text-amber-900"
              : "bg-zinc-100 border-zinc-200 text-zinc-700",
          ].join(" ")}
          style={action === "on" ? { boxShadow: "0 0 20px rgba(253,224,71,0.4)" } : {}}
          aria-label={`Toggle action, currently ${action}`}
        >
          <ToggleSwitch on={action === "on"} />
          <span className="text-[11px] font-extrabold tracking-wider">{action.toUpperCase()}</span>
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setSelectedDays([...p.days])}
            className={[
              "flex-1 rounded-lg text-xs font-bold py-2.5 transition-colors",
              activePreset === p.label
                ? "bg-amber-300 text-amber-900"
                : "bg-zinc-100 text-zinc-500 border border-zinc-200",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_DIGITS.map((d) => (
          <button
            key={d}
            onClick={() => toggleDay(d)}
            className={[
              "min-h-[44px] rounded-lg text-sm font-bold transition-colors",
              selectedDays.includes(d)
                ? "bg-amber-300 text-amber-900 shadow-[0_4px_10px_-4px_rgba(253,224,71,0.7)]"
                : "bg-zinc-100 text-zinc-400 border border-zinc-200",
            ].join(" ")}
          >
            {DAY_LABELS[parseInt(d)]}
          </button>
        ))}
      </div>

      <button
        onClick={handleAdd}
        disabled={selectedDays.length === 0}
        className="w-full rounded-xl bg-zinc-900 text-white font-bold py-3.5 min-h-[48px] hover:bg-zinc-800 disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={16} />
        {submitLabel}
      </button>
    </div>
  );
}
