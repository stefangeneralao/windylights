import { useNavigate } from "react-router-dom";
import type { DeviceRule } from "../hooks/useScheduleRules";

interface Props {
  time: string;
  rules: DeviceRule[];
}

export function TimeGroup({ time, rules }: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <span className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-100">
          {time}
        </span>
      </div>
      {rules.map((rule, i) => (
        <button
          key={i}
          onClick={() => navigate(`/device/${rule.deviceId}`)}
          className="flex items-center gap-3 px-4 py-2 text-left w-full active:bg-zinc-200 dark:active:bg-zinc-600 transition-colors last:pb-3"
        >
          <span
            className={[
              "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
              rule.action === "on"
                ? "bg-yellow-300 text-yellow-900"
                : "bg-zinc-300 text-zinc-700 dark:bg-zinc-500 dark:text-zinc-100",
            ].join(" ")}
          >
            {rule.action.toUpperCase()}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            {rule.deviceName}
          </span>
        </button>
      ))}
    </div>
  );
}
