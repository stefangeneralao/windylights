import { type ScheduleRule } from "../lib/api";
import { RuleRow } from "./RuleRow";
import { AddRuleForm } from "./AddRuleForm";

type SaveStatus = "idle" | "saving" | "ok" | "error";

const CARD = "bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700";

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
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
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

        <div className={`flex flex-col gap-2 p-3 ${CARD}`}>
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
      </div>

      {rules !== null && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Add rule
          </h2>
          <div className={`p-4 ${CARD}`}>
            <AddRuleForm onAdd={onAdd} />
          </div>
        </div>
      )}
    </section>
  );
}
