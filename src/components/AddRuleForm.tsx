import { useState } from "react";
import { type ScheduleRule } from "../lib/api";
import { DAY_LABELS, DAY_DIGITS } from "../lib/days";

export function AddRuleForm({ onAdd }: { onAdd: (rule: ScheduleRule) => void }) {
  const [time, setTime] = useState("22:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["1", "2", "3", "4", "5", "6", "0"]);
  const [action, setAction] = useState<"on" | "off">("off");

  function toggleDay(d: string) {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function handleAdd() {
    if (!time || selectedDays.length === 0) return;
    const days = DAY_DIGITS.filter((d) => selectedDays.includes(d)).join("");
    onAdd({ time, days, action });
  }

  return (
    <div className="rounded-xl bg-zinc-200 dark:bg-zinc-700 px-4 py-4 flex flex-col gap-3">
      <div className="flex gap-3 items-center">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-base font-mono border border-zinc-300 dark:border-zinc-600 min-h-[44px]"
        />
        <div className="flex rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-600">
          {(["on", "off"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={[
                "px-4 py-2 text-sm font-semibold min-h-[44px] transition-colors",
                action === a
                  ? a === "on"
                    ? "bg-yellow-300 text-yellow-900"
                    : "bg-zinc-500 text-white"
                  : "bg-white dark:bg-zinc-800 text-zinc-500",
              ].join(" ")}
            >
              {a.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_DIGITS.map((d) => (
          <button
            key={d}
            onClick={() => toggleDay(d)}
            className={[
              "w-full min-h-[44px] rounded-xl text-sm font-semibold transition-colors",
              selectedDays.includes(d)
                ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
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
        className="w-full rounded-xl bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-3 min-h-[44px] disabled:opacity-40 transition-colors"
      >
        Add rule
      </button>
    </div>
  );
}
