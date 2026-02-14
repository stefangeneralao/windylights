import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { devices } from "./devices";
import { fetchSchedule, saveSchedule, type ScheduleRule } from "./api";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_DIGITS = ["0", "1", "2", "3", "4", "5", "6"];

function formatDays(days: string): string {
  if (days === "1234567") return "Every day";
  if (days === "12345") return "Weekdays";
  if (days === "06") return "Weekends";
  return DAY_DIGITS.filter((d) => days.includes(d))
    .map((d) => DAY_LABELS[parseInt(d)])
    .join(", ");
}

function RuleRow({
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

function AddRuleForm({ onAdd }: { onAdd: (rule: ScheduleRule) => void }) {
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
      <div className="flex gap-2 flex-wrap">
        {DAY_DIGITS.map((d) => (
          <button
            key={d}
            onClick={() => toggleDay(d)}
            className={[
              "w-10 h-10 rounded-full text-sm font-semibold transition-colors",
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

export function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const device = devices.find((d) => d.id === id);

  const [rules, setRules] = useState<ScheduleRule[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    if (!id) return;
    fetchSchedule(id).then(setRules);
  }, [id]);

  if (!device) {
    return (
      <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
        <p className="text-zinc-500">Device not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-blue-500 underline">
          Back
        </button>
      </main>
    );
  }

  async function handleSave() {
    if (!id || rules === null) return;
    setSaving(true);
    setSaveStatus("idle");
    const ok = await saveSchedule(id, rules);
    setSaveStatus(ok ? "ok" : "error");
    setSaving(false);
  }

  function handleAdd(rule: ScheduleRule) {
    setRules((prev) => (prev ? [...prev, rule] : [rule]));
    setSaveStatus("idle");
  }

  function handleDelete(index: number) {
    setRules((prev) => (prev ? prev.filter((_, i) => i !== index) : []));
    setSaveStatus("idle");
  }

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col p-6 gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center text-xl"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {device.name}
        </h1>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Schedule
        </h2>

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

        {rules !== null && (
          <>
            <AddRuleForm onAdd={handleAdd} />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-yellow-400 text-yellow-900 font-semibold py-3 min-h-[44px] disabled:opacity-50 transition-colors hover:bg-yellow-300"
            >
              {saving ? "Saving…" : "Save schedule"}
            </button>
            {saveStatus === "ok" && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center">
                Schedule saved.
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-500 text-sm text-center">
                Failed to save. Are you on the home network?
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
