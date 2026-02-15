import { useState } from "react";
import { type ScheduleRule } from "../lib/api";
import { DAY_LABELS, DAY_DIGITS, PRESETS, matchPreset } from "../lib/days";
import { ToggleSwitch } from "./ToggleSwitch";

export function AddRuleForm({
  onAdd,
}: {
  onAdd: (rule: ScheduleRule) => void;
}) {
  const [time, setTime] = useState("22:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "0",
  ]);
  const [action, setAction] = useState<"on" | "off">("off");

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
      <div className="flex gap-3 items-center">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-base font-mono border border-zinc-300 dark:border-zinc-600 min-h-[44px]"
        />
        <button
          onClick={() => setAction(action === "on" ? "off" : "on")}
          className="flex items-center gap-2 min-h-[44px]"
          aria-label={`Toggle action, currently ${action}`}
        >
          <ToggleSwitch on={action === "on"} />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 w-7">
            {action.toUpperCase()}
          </span>
        </button>
      </div>

      {/* Preset chips */}
      <div className="flex flex-col gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setSelectedDays([...p.days])}
            className={[
              "flex-1 rounded-xl text-sm font-semibold min-h-[44px] transition-colors",
              activePreset === p.label
                ? "bg-zinc-600 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-600",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      <hr className="border-zinc-300 dark:border-zinc-600" />

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_DIGITS.map((d) => (
          <button
            key={d}
            onClick={() => toggleDay(d)}
            className={[
              "w-full min-h-[44px] rounded-xl text-sm font-semibold transition-colors",
              selectedDays.includes(d)
                ? "bg-yellow-300 text-yellow-900"
                : "bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-600",
            ].join(" ")}
          >
            {DAY_LABELS[parseInt(d)]}
          </button>
        ))}
      </div>

      <button
        onClick={handleAdd}
        disabled={selectedDays.length === 0}
        className="w-full rounded-xl bg-zinc-600 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-3 min-h-[44px] disabled:opacity-40 transition-colors"
      >
        Add rule
      </button>
    </div>
  );
}
