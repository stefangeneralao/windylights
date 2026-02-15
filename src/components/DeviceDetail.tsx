import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { devices } from "../lib/devices";
import { fetchSchedule, saveSchedule, type ScheduleRule } from "../lib/api";
import { DeviceNotFound } from "./DeviceNotFound";
import { DeviceDetailHeader } from "./DeviceDetailHeader";
import { ScheduleSection } from "./ScheduleSection";

export function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const device = devices.find((d) => d.id === id);

  const [rules, setRules] = useState<ScheduleRule[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "ok" | "error"
  >("idle");

  useEffect(() => {
    if (!id) return;
    fetchSchedule(id, device?.gen ?? 1).then((r) =>
      setRules(r ? [...r].sort((a, b) => a.time.localeCompare(b.time)) : r),
    );
  }, [id]);

  async function save(updated: ScheduleRule[]) {
    if (!id) return;
    setSaveStatus("saving");
    const ok = await saveSchedule(id, updated, device?.gen ?? 1);
    setSaveStatus(ok ? "ok" : "error");
  }

  if (!device) {
    return <DeviceNotFound onBack={() => navigate(-1)} />;
  }

  function handleAdd(rule: ScheduleRule) {
    const updated = (rules ? [...rules, rule] : [rule]).sort((a, b) =>
      a.time.localeCompare(b.time),
    );
    setRules(updated);
    save(updated);
  }

  function handleDelete(index: number) {
    const updated = (rules ?? []).filter((_, i) => i !== index);
    setRules(updated);
    save(updated);
  }

  return (
    <main className="h-dvh bg-zinc-100 dark:bg-zinc-900 flex flex-col overflow-hidden">
      <DeviceDetailHeader name={device.name} onBack={() => navigate(-1)} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-sm mx-auto px-4 pb-28 flex flex-col gap-6">
          <ScheduleSection
            rules={rules}
            saveStatus={saveStatus}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        </div>
      </div>
    </main>
  );
}
