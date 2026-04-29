import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useScheduleRules, type DeviceRule } from "../hooks/useScheduleRules";
import { devices } from "../lib/devices";

// Mon–Sun order (app-internal: 0=Sun, 1=Mon, …, 6=Sat)
const ORDERED: number[] = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function todayDigit(): number {
  return new Date().getDay();
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function rulesForDay(rules: DeviceRule[], dayDigit: number): DeviceRule[] {
  return rules.filter((r) => r.days.includes(String(dayDigit)));
}

interface LitWindow {
  start: number;
  end: number;
}

function buildLitWindows(deviceId: string, dayRules: DeviceRule[]): LitWindow[] {
  const rs = dayRules
    .filter((r) => r.deviceId === deviceId)
    .sort((a, b) => a.time.localeCompare(b.time));
  if (rs.length === 0) return [];
  let lit = rs[0].action === "off";
  let start: number | null = lit ? 0 : null;
  const out: LitWindow[] = [];
  for (const r of rs) {
    const m = timeToMinutes(r.time);
    if (r.action === "on" && !lit) {
      lit = true;
      start = m;
    } else if (r.action === "off" && lit) {
      lit = false;
      if (start !== null) out.push({ start, end: m });
      start = null;
    }
  }
  if (lit && start !== null) out.push({ start, end: 24 * 60 });
  return out;
}

function GanttRow({
  deviceId,
  deviceName,
  dayRules,
  nowMin,
  isToday,
}: {
  deviceId: string;
  deviceName: string;
  dayRules: DeviceRule[];
  nowMin: number;
  isToday: boolean;
}) {
  const windows = buildLitWindows(deviceId, dayRules);
  const events = dayRules.filter((r) => r.deviceId === deviceId);
  const total = 24 * 60;

  return (
    <div className="flex items-center gap-2.5 py-2">
      <div className="w-[88px] shrink-0 text-right">
        <div className="text-[13px] font-bold text-zinc-800 truncate leading-tight">
          {deviceName}
        </div>
        <div className="text-[10px] font-semibold text-zinc-400 tabular-nums">
          {events.length} {events.length === 1 ? "event" : "events"}
        </div>
      </div>
      <div className="relative flex-1 h-9 rounded-lg bg-zinc-100 border border-zinc-200/80 overflow-hidden">
        {[6, 12, 18].map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 w-px bg-zinc-200"
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}
        {windows.map((w, i) => {
          const left = (w.start / total) * 100;
          const width = ((w.end - w.start) / total) * 100;
          return (
            <div
              key={i}
              className="absolute top-1 bottom-1 rounded-md"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background: "linear-gradient(180deg, #fde047, #facc15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 0 12px rgba(253,224,71,0.55)",
              }}
            />
          );
        })}
        {isToday && (
          <div
            className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-zinc-900 z-10"
            style={{ left: `${(nowMin / total) * 100}%` }}
          >
            <div className="absolute -top-1 -left-[3px] w-2 h-2 rounded-full bg-zinc-900" />
          </div>
        )}
      </div>
    </div>
  );
}

export function ScheduleOverview() {
  const navigate = useNavigate();
  const allRules = useScheduleRules();
  const today = todayDigit();
  const [activeDay, setActiveDay] = useState(today);

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const dayRules = useMemo(
    () => (allRules ? rulesForDay(allRules, activeDay) : []),
    [allRules, activeDay],
  );

  const onCount = dayRules.filter((r) => r.action === "on").length;
  const offCount = dayRules.length - onCount;

  const sortedEvents = useMemo(
    () => [...dayRules].sort((a, b) => a.time.localeCompare(b.time)),
    [dayRules],
  );

  return (
    <main className="h-dvh bg-zinc-100 flex flex-col overflow-hidden">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(80% 35% at 50% 0%, rgba(253,224,71,0.22), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 pt-10 pb-2 max-w-sm w-full mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-zinc-500 hover:text-zinc-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
          aria-label="Back"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[34px] leading-none font-black tracking-tight text-zinc-800">
          Schedule
        </h1>
      </div>

      {/* Day strip */}
      <div className="relative max-w-sm w-full mx-auto px-4 mt-2">
        <div className="grid grid-cols-7 gap-1.5">
          {ORDERED.map((d, i) => {
            const isActive = d === activeDay;
            const isToday = d === today;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={[
                  "relative flex flex-col items-center justify-center py-2 rounded-xl border transition-all",
                  isActive
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50",
                ].join(" ")}
              >
                <span className="text-[10px] font-bold tracking-wider opacity-60">
                  {DAY_SHORT[d]}
                </span>
                <span className="text-base font-black tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {isToday && !isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day summary */}
      <div className="relative max-w-sm w-full mx-auto px-4 mt-5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-zinc-900">{DAY_NAMES[activeDay]}</span>
          {activeDay === today && (
            <span className="text-[10px] font-extrabold tracking-wider text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-full">
              TODAY
            </span>
          )}
        </div>
        {allRules && (
          <div className="flex items-center gap-4 mt-1 text-xs font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-amber-400 shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
              {onCount} on
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-zinc-400" />
              {offCount} off
            </span>
          </div>
        )}
      </div>

      {allRules === null ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-400 text-sm">Loading…</p>
        </div>
      ) : (
        <>
          {/* Gantt chart */}
          <div className="relative max-w-sm w-full mx-auto px-4 mt-4">
            <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm p-3">
              {/* Hour scale */}
              <div className="flex items-end gap-2.5 mb-1">
                <div className="w-[88px] shrink-0" />
                <div className="relative flex-1 h-4">
                  {[0, 6, 12, 18, 24].map((h) => (
                    <div
                      key={h}
                      className="absolute -translate-x-1/2 text-[10px] font-mono font-bold text-zinc-400 tabular-nums"
                      style={{ left: `${(h / 24) * 100}%` }}
                    >
                      {String(h).padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>
              {/* Device rows */}
              <div className="divide-y divide-zinc-100">
                {devices.map((d) => (
                  <GanttRow
                    key={d.id}
                    deviceId={d.id}
                    deviceName={d.name}
                    dayRules={dayRules}
                    nowMin={nowMin}
                    isToday={activeDay === today}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Event list */}
          <div className="relative flex-1 min-h-0 overflow-y-auto mt-3">
            <div className="max-w-sm mx-auto px-4 pb-8">
              <div className="text-[11px] font-extrabold tracking-wider text-zinc-400 px-1 pb-2">
                EVENTS
              </div>
              {sortedEvents.length === 0 ? (
                <p className="text-sm text-zinc-400 px-1 py-2">No events scheduled.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {sortedEvents.map((r, i) => {
                    const past = activeDay === today && timeToMinutes(r.time) < nowMin;
                    return (
                      <div
                        key={i}
                        className={[
                          "flex items-center gap-3 rounded-xl border px-4 py-2.5",
                          past
                            ? "bg-zinc-50 border-zinc-100 opacity-60"
                            : "bg-white border-zinc-200",
                        ].join(" ")}
                      >
                        <span className="font-mono font-bold text-zinc-800 tabular-nums w-12 text-sm">
                          {r.time}
                        </span>
                        <span
                          className={[
                            "text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full shrink-0",
                            r.action === "on"
                              ? "bg-amber-300 text-amber-900"
                              : "bg-zinc-200 text-zinc-700",
                          ].join(" ")}
                        >
                          {r.action.toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm font-semibold text-zinc-700 truncate">
                          {r.deviceName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
