const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

export async function fetchRelayState(deviceId: string): Promise<boolean | null> {
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/relay/0?status`);
    const data = await res.json();
    return data.ison as boolean;
  } catch {
    return null;
  }
}

export async function toggleRelay(deviceId: string): Promise<void> {
  await fetch(`${PROXY_URL}/${deviceId}/relay/0?turn=toggle`).catch(() => {});
}

export interface ScheduleRule {
  time: string;   // "HH:MM"
  days: string;   // e.g. "1234567"
  action: "on" | "off";
}

function parseRules(raw: string[]): ScheduleRule[] {
  return raw.flatMap((r) => {
    const parts = r.split("-");
    if (parts.length < 3) return [];
    const [hhmm, days, action] = parts;
    if (action !== "on" && action !== "off") return [];
    const time = `${hhmm.slice(0, 2)}:${hhmm.slice(2, 4)}`;
    return [{ time, days, action }];
  });
}

function formatRules(rules: ScheduleRule[]): string {
  return rules
    .map((r) => `${r.time.replace(":", "")}-${r.days}-${r.action}`)
    .join(",");
}

export async function fetchSchedule(deviceId: string): Promise<ScheduleRule[] | null> {
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/settings/relay/0`);
    const data = await res.json();
    const raw: string[] = data.schedule_rules ?? [];
    return parseRules(raw);
  } catch {
    return null;
  }
}

export async function saveSchedule(deviceId: string, rules: ScheduleRule[]): Promise<boolean> {
  try {
    const encoded = encodeURIComponent(formatRules(rules));
    const url = `${PROXY_URL}/${deviceId}/settings/relay/0?schedule=true&schedule_rules=${encoded}`;
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}
