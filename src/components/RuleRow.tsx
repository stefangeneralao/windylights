import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { type ScheduleRule } from "../lib/api";
import { DAY_LABELS, DAY_DIGITS } from "../lib/days";
import { AddRuleForm } from "./AddRuleForm";

export function RuleRow({
  rule,
  onDelete,
  onEdit,
}: {
  rule: ScheduleRule;
  onDelete: () => void;
  onEdit: (rule: ScheduleRule) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="flex flex-col rounded-xl bg-zinc-100 border border-zinc-200/60 px-4 py-3 gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-500">Edit rule</span>
          <button
            onClick={() => setEditing(false)}
            className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Cancel edit"
          >
            <X size={15} />
          </button>
        </div>
        <AddRuleForm
          initialRule={rule}
          submitLabel="Save rule"
          onAdd={(updated) => {
            onEdit(updated);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl bg-zinc-100 px-4 py-3 gap-2 border border-zinc-200/60">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-mono font-bold text-zinc-800 tabular-nums">{rule.time}</span>
          <span
            className={[
              "text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full",
              rule.action === "on"
                ? "bg-amber-300 text-amber-900"
                : "bg-zinc-300 text-zinc-700",
            ].join(" ")}
          >
            {rule.action.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center -mr-2">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Edit rule"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="text-zinc-400 hover:text-red-500 transition-colors p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Delete rule"
          >
            <X size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAY_DIGITS.map((d) => (
          <div
            key={d}
            className={[
              "py-1 rounded-md text-[11px] font-bold text-center",
              rule.days.includes(d) ? "text-zinc-800" : "text-zinc-300",
            ].join(" ")}
          >
            {DAY_LABELS[parseInt(d)]}
          </div>
        ))}
      </div>
    </div>
  );
}
