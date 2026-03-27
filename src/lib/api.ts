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
  days: string;   // app-internal: 0=Sun, 1–6=Mon–Sat, e.g. "0123456"
  action: "on" | "off";
}

function parseRules(raw: string[]): ScheduleRule[] {
  return raw.flatMap((r) => {
    const parts = r.split("-");
    if (parts.length < 3) return [];
    const [hhmm, rawDays, action] = parts;
    if (action !== "on" && action !== "off") return [];
    const time = `${hhmm.slice(0, 2)}:${hhmm.slice(2, 4)}`;
    // Gen1 uses 0–6 (Mon–Sun); convert to app-internal 0=Sun, 1–6=Mon–Sat
    const days = rawDays.split("").map((d) => String((parseInt(d) + 1) % 7)).join("");
    return [{ time, days, action }];
  });
}

function formatRules(rules: ScheduleRule[]): string {
  return rules
    .map((r) => {
      // App uses 0=Sun, 1–6=Mon–Sat; Gen1 expects 0=Mon, 6=Sun
      const days = r.days.split("").map((d) => String((parseInt(d) + 6) % 7)).join("");
      return `${r.time.replace(":", "")}-${days}-${r.action}`;
    })
    .join(",");
}

function gen3DowToDigits(dow: string): string {
  if (dow === "*") return "0123456";
  // Gen3 devices use ISO 8601: 1=Mon through 7=Sun
  // Convert to app format: 0=Sun, 1=Mon through 6=Sat
  return dow.split(",").map((d) => {
    const day = d.trim();
    return day === "7" ? "0" : day; // Convert ISO Sunday (7) to cron Sunday (0)
  }).sort().join("");
}

function digitsToGen3Dow(digits: string): string {
  // Convert app format (0=Sun, 1-6=Mon-Sat) to ISO 8601 (1-7=Mon-Sun)
  return digits.split("").map((d) => d === "0" ? "7" : d).join(",");
}

async function fetchScheduleGen3(deviceId: string): Promise<ScheduleRule[] | null> {
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/rpc/Schedule.List`);
    const data = await res.json();
    const jobs: unknown[] = data.jobs ?? [];
    return jobs.flatMap((job) => {
      const j = job as { timespec: string; calls?: { method: string; params?: { on?: boolean } }[] };
      const parts = j.timespec.replace(/"/g, "").split(" ");
      if (parts.length < 6) return [];
      const hh = parts[2].padStart(2, "0");
      const mm = parts[1].padStart(2, "0");
      const time = `${hh}:${mm}`;
      const days = gen3DowToDigits(parts[5]);
      const call = j.calls?.[0];
      if (!call) return [];
      const action: "on" | "off" = call.params?.on ? "on" : "off";
      return [{ time, days, action }];
    });
  } catch {
    return null;
  }
}

async function saveScheduleGen3(deviceId: string, rules: ScheduleRule[]): Promise<boolean> {
  try {
    await fetch(`${PROXY_URL}/${deviceId}/rpc/Schedule.DeleteAll`);
    for (const rule of rules) {
      const [hh, mm] = rule.time.split(":");
      const timespec = `"0 ${parseInt(mm)} ${parseInt(hh)} * * ${digitsToGen3Dow(rule.days)}"`;
      const calls = JSON.stringify([
        { method: "Switch.Set", params: { id: 0, on: rule.action === "on" } },
      ]);
      const url = `${PROXY_URL}/${deviceId}/rpc/Schedule.Create?timespec=${encodeURIComponent(timespec)}&calls=${encodeURIComponent(calls)}&enable=true`;
      const res = await fetch(url);
      if (!res.ok) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchSchedule(deviceId: string, gen: 1 | 3 = 1): Promise<ScheduleRule[] | null> {
  if (gen === 3) return fetchScheduleGen3(deviceId);
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/settings/relay/0`);
    const data = await res.json();
    const raw: string[] = data.schedule_rules ?? [];
    return parseRules(raw);
  } catch {
    return null;
  }
}

export async function saveSchedule(deviceId: string, rules: ScheduleRule[], gen: 1 | 3 = 1): Promise<boolean> {
  if (gen === 3) return saveScheduleGen3(deviceId, rules);
  try {
    const encoded = encodeURIComponent(formatRules(rules));
    const url = `${PROXY_URL}/${deviceId}/settings/relay/0?schedule=true&schedule_rules=${encoded}`;
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}
