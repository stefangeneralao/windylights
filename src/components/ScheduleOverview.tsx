import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { devices } from "../lib/devices";
import { fetchSchedule, type ScheduleRule } from "../lib/api";

interface DeviceRule extends ScheduleRule {
  deviceName: string;
  deviceId: string;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Mon–Sun order (matching DAY_DIGITS: ["1","2","3","4","5","6","0"])
const ORDERED_DIGITS = ["1", "2", "3", "4", "5", "6", "0"];

function todayDigit(): string {
  // JS getDay(): 0=Sun,1=Mon,...,6=Sat — same as our digit format
  return String(new Date().getDay());
}

export function ScheduleOverview() {
  const navigate = useNavigate();
  const [allRules, setAllRules] = useState<DeviceRule[] | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all(
      devices.map((d) =>
        fetchSchedule(d.id, d.gen ?? 1).then((rules) =>
          (rules ?? []).map((r) => ({ ...r, deviceName: d.name, deviceId: d.id }))
        )
      )
    ).then((results) => setAllRules(results.flat()));
  }, []);

  // Scroll carousel to today on load
  useEffect(() => {
    if (!carouselRef.current) return;
    const todayIndex = ORDERED_DIGITS.indexOf(todayDigit());
    if (todayIndex === -1) return;
    const card = carouselRef.current.children[todayIndex] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
  }, []);

  // Group rules by day digit
  const byDay: Record<string, DeviceRule[]> = {};
  for (const digit of ORDERED_DIGITS) byDay[digit] = [];
  if (allRules) {
    for (const rule of allRules) {
      for (const digit of rule.days.split("")) {
        byDay[digit]?.push(rule);
      }
    }
    for (const digit of ORDERED_DIGITS) {
      byDay[digit].sort((a, b) => a.time.localeCompare(b.time));
    }
  }

  const today = todayDigit();

  return (
    <main className="h-dvh bg-zinc-100 dark:bg-zinc-900 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 max-w-sm w-full mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-zinc-800 dark:text-zinc-100">Schedule</h1>
      </div>

      {allRules === null ? (
        <p className="text-zinc-500 dark:text-zinc-400 px-8">Loading…</p>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
        <div
          ref={carouselRef}
          className="flex h-full overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-8 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {ORDERED_DIGITS.map((digit) => {
            const dayIndex = parseInt(digit);
            const rules = byDay[digit];
            const isToday = digit === today;
            return (
              <div
                key={digit}
                className="snap-center shrink-0 w-[85vw] max-w-sm h-full flex flex-col rounded-2xl bg-white dark:bg-zinc-800 overflow-hidden"
              >
                <div className={[
                  "px-5 pt-5 pb-3 flex items-baseline gap-2",
                  isToday ? "border-b border-zinc-100 dark:border-zinc-700" : "",
                ].join(" ")}>
                  <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-100">
                    {DAY_NAMES[dayIndex]}
                  </h2>
                  {isToday && (
                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                      Today
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3">
                  {rules.length === 0 ? (
                    <p className="text-sm text-zinc-400 dark:text-zinc-600 py-2">No events</p>
                  ) : (
                    Object.entries(
                      rules.reduce<Record<string, DeviceRule[]>>((acc, rule) => {
                        (acc[rule.time] ??= []).push(rule);
                        return acc;
                      }, {})
                    ).map(([time, group]) => (
                      <div key={time} className="rounded-xl bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                        <div className="px-4 pt-3 pb-1">
                          <span className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-100">
                            {time}
                          </span>
                        </div>
                        {group.map((rule, i) => (
                          <button
                            key={i}
                            onClick={() => navigate(`/device/${rule.deviceId}`)}
                            className="flex items-center gap-3 px-4 py-2 text-left w-full active:bg-zinc-200 dark:active:bg-zinc-600 transition-colors last:pb-3"
                          >
                            <span
                              className={[
                                "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                                rule.action === "on"
                                  ? "bg-yellow-300 text-yellow-900"
                                  : "bg-zinc-300 text-zinc-700 dark:bg-zinc-500 dark:text-zinc-100",
                              ].join(" ")}
                            >
                              {rule.action.toUpperCase()}
                            </span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                              {rule.deviceName}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </main>
  );
}
