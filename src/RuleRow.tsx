import { type ScheduleRule } from "./api";
import { formatDays } from "./days";

export function RuleRow({
  rule,
  onDelete,
}: {
  rule: ScheduleRule;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-200 dark:bg-zinc-700 px-4 py-3 gap-3">
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
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatDays(rule.days)}
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
  );
}
