import { type ScheduleRule } from "../lib/api";
import { RuleRow } from "./RuleRow";
import { AddRuleForm } from "./AddRuleForm";
import { Card } from "./Card";

type SaveStatus = "idle" | "saving" | "ok" | "error";

export function ScheduleSection({
  rules,
  saveStatus,
  onDelete,
  onEdit,
  onAdd,
}: {
  rules: ScheduleRule[] | null;
  saveStatus: SaveStatus;
  onDelete: (index: number) => void;
  onEdit: (index: number, rule: ScheduleRule) => void;
  onAdd: (rule: ScheduleRule) => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <Card className="flex flex-col">
        <div className="flex items-baseline gap-2 px-5 pt-5 pb-3 border-b border-zinc-100">
          <h2 className="text-base font-black text-zinc-800">Schedule</h2>
          {saveStatus === "saving" && (
            <span className="text-xs text-zinc-400">Saving…</span>
          )}
          {saveStatus === "ok" && (
            <span className="text-xs text-amber-600 font-semibold">Saved</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-500">Failed to save</span>
          )}
          <span className="ml-auto text-[11px] font-bold tabular-nums text-zinc-400">
            {rules?.length ?? 0} {(rules?.length ?? 0) === 1 ? "rule" : "rules"}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-3">
          {rules === null ? (
            <p className="text-zinc-400 text-sm px-1 py-1">Loading…</p>
          ) : rules.length === 0 ? (
            <p className="text-zinc-400 text-sm px-1 py-1">No schedule rules set.</p>
          ) : (
            rules.map((rule, i) => (
              <RuleRow
                key={i}
                rule={rule}
                onDelete={() => onDelete(i)}
                onEdit={(updated) => onEdit(i, updated)}
              />
            ))
          )}
        </div>
      </Card>

      {rules !== null && (
        <Card className="flex flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
            <h2 className="text-base font-black text-zinc-800">Add rule</h2>
          </div>
          <div className="p-4">
            <AddRuleForm onAdd={onAdd} />
          </div>
        </Card>
      )}
    </section>
  );
}
