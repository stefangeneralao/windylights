import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useScheduleRules, type DeviceRule } from "../hooks/useScheduleRules";
import { DayCard } from "./DayCard";

// Mon–Sun order
const ORDERED_DIGITS = ["1", "2", "3", "4", "5", "6", "0"];

function todayDigit(): string {
  return String(new Date().getDay());
}

function groupByDay(rules: DeviceRule[]): Record<string, DeviceRule[]> {
  const byDay: Record<string, DeviceRule[]> = {};
  for (const digit of ORDERED_DIGITS) byDay[digit] = [];
  for (const rule of rules) {
    for (const digit of rule.days.split("")) {
      byDay[digit]?.push(rule);
    }
  }
  for (const digit of ORDERED_DIGITS) {
    byDay[digit].sort((a, b) => a.time.localeCompare(b.time));
  }
  return byDay;
}

export function ScheduleOverview() {
  const navigate = useNavigate();
  const allRules = useScheduleRules();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    const todayIndex = ORDERED_DIGITS.indexOf(todayDigit());
    if (todayIndex === -1) return;
    const card = carouselRef.current.children[todayIndex] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
  }, []);

  const today = todayDigit();
  const byDay = allRules ? groupByDay(allRules) : null;

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

      {byDay === null ? (
        <p className="text-zinc-500 dark:text-zinc-400 px-8">Loading…</p>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex h-full overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-8 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {ORDERED_DIGITS.map((digit) => (
              <DayCard
                key={digit}
                digit={digit}
                rules={byDay[digit]}
                isToday={digit === today}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
