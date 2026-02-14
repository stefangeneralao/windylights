import { type ScheduleRule } from "../lib/api";
import { DAY_LABELS, DAY_DIGITS } from "../lib/days";

export function RuleRow({
  rule,
  onDelete,
}: {
  rule: ScheduleRule;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-zinc-200 dark:bg-zinc-700 px-4 py-3 gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-mono font-semibold text-zinc-800 dark:text-zinc-100">
            {rule.time}
          </span>
          <span
            className={[
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              rule.action === "on"
                ? "bg-yellow-300 text-yellow-900"
                : "bg-zinc-400 text-zinc-800 dark:bg-zinc-500 dark:text-zinc-100",
            ].join(" ")}
          >
            {rule.action.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="text-zinc-400 hover:text-red-500 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Delete rule"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_DIGITS.map((d) => (
          <div
            key={d}
            className={[
              "w-full py-1 rounded-lg text-xs font-semibold text-center",
              rule.days.includes(d)
                ? "text-zinc-800 dark:text-zinc-100"
                : "text-zinc-400 dark:text-zinc-600",
            ].join(" ")}
          >
            {DAY_LABELS[parseInt(d)]}
          </div>
        ))}
      </div>
    </div>
  );
}
