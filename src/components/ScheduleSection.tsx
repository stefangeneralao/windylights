import { type ScheduleRule } from "../lib/api";
import { RuleRow } from "./RuleRow";
import { AddRuleForm } from "./AddRuleForm";
import { Card } from "./Card";

type SaveStatus = "idle" | "saving" | "ok" | "error";

export function ScheduleSection({
  rules,
  saveStatus,
  onDelete,
  onAdd,
}: {
  rules: ScheduleRule[] | null;
  saveStatus: SaveStatus;
  onDelete: (index: number) => void;
  onAdd: (rule: ScheduleRule) => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <Card className="flex flex-col">
        <div className="flex items-baseline gap-2 px-5 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-700">
          <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-100">
            Schedule
          </h2>
          {saveStatus === "saving" && (
            <span className="text-xs text-zinc-400">Saving…</span>
          )}
          {saveStatus === "ok" && (
            <span className="text-xs text-green-500 dark:text-green-400">
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-500">Failed to save</span>
          )}
        </div>
        <div className="flex flex-col gap-2 p-3">
          {rules === null ? (
            <p className="text-zinc-400 text-sm px-1 py-1">Loading…</p>
          ) : rules.length === 0 ? (
            <p className="text-zinc-400 text-sm px-1 py-1">
              No schedule rules set.
            </p>
          ) : (
            rules.map((rule, i) => (
              <RuleRow key={i} rule={rule} onDelete={() => onDelete(i)} />
            ))
          )}
        </div>
      </Card>

      {rules !== null && (
        <Card className="flex flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-700">
            <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-100">
              Add rule
            </h2>
          </div>
          <div className="p-4">
            <AddRuleForm onAdd={onAdd} />
          </div>
        </Card>
      )}
    </section>
  );
}
