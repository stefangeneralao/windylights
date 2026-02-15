import type { DeviceRule } from "../hooks/useScheduleRules";
import { TimeGroup } from "./TimeGroup";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  digit: string;
  rules: DeviceRule[];
  isToday: boolean;
}

function groupByTime(rules: DeviceRule[]): [string, DeviceRule[]][] {
  const groups: Record<string, DeviceRule[]> = {};
  for (const rule of rules) {
    (groups[rule.time] ??= []).push(rule);
  }
  return Object.entries(groups);
}

export function DayCard({ digit, rules, isToday }: Props) {
  const dayIndex = parseInt(digit);
  const timeGroups = groupByTime(rules);

  return (
    <div className="snap-center shrink-0 w-[85vw] max-w-sm h-full flex flex-col rounded-2xl bg-white dark:bg-zinc-800 overflow-hidden">
      <div
        className={[
          "px-5 pt-5 pb-3 flex items-baseline gap-2",
          isToday ? "border-b border-zinc-100 dark:border-zinc-700" : "",
        ].join(" ")}
      >
        <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-100">
          {DAY_NAMES[dayIndex]}
        </h2>
        {isToday && (
          <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
            Today
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3">
        {timeGroups.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600 py-2">No events</p>
        ) : (
          timeGroups.map(([time, group]) => (
            <TimeGroup key={time} time={time} rules={group} />
          ))
        )}
      </div>
    </div>
  );
}
