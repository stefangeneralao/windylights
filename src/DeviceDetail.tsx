import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { devices } from "./devices";
import { fetchSchedule, saveSchedule, type ScheduleRule } from "./api";
import { RuleRow } from "./RuleRow";
import { AddRuleForm } from "./AddRuleForm";

export function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const device = devices.find((d) => d.id === id);

  const [rules, setRules] = useState<ScheduleRule[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");

  useEffect(() => {
    if (!id) return;
    fetchSchedule(id).then(setRules);
  }, [id]);

  async function save(updated: ScheduleRule[]) {
    if (!id) return;
    setSaveStatus("saving");
    const ok = await saveSchedule(id, updated);
    setSaveStatus(ok ? "ok" : "error");
  }

  if (!device) {
    return (
      <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
        <p className="text-zinc-500">Device not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-500 underline"
        >
          Back
        </button>
      </main>
    );
  }

  function handleAdd(rule: ScheduleRule) {
    const updated = rules ? [...rules, rule] : [rule];
    setRules(updated);
    save(updated);
  }

  function handleDelete(index: number) {
    const updated = (rules ?? []).filter((_, i) => i !== index);
    setRules(updated);
    save(updated);
  }

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col p-6 gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-44 min-h-44 flex items-center justify-center text-xl"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {device.name}
        </h1>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Schedule
          </h2>
          {saveStatus === "saving" && (
            <span className="text-xs text-zinc-400">Saving…</span>
          )}
          {saveStatus === "ok" && (
            <span className="text-xs text-green-600 dark:text-green-400">
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-500">Failed to save</span>
          )}
        </div>

        {rules === null ? (
          <p className="text-zinc-400 text-sm">Loading…</p>
        ) : rules.length === 0 ? (
          <p className="text-zinc-400 text-sm">No schedule rules set.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rules.map((rule, i) => (
              <RuleRow key={i} rule={rule} onDelete={() => handleDelete(i)} />
            ))}
          </div>
        )}

        {rules !== null && <AddRuleForm onAdd={handleAdd} />}
      </section>
    </main>
  );
}
