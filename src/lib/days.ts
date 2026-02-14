export const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const DAY_DIGITS = ["1", "2", "3", "4", "5", "6", "0"];

export const PRESETS = [
  { label: "Every day", days: ["1", "2", "3", "4", "5", "6", "0"] },
  { label: "Weekdays",  days: ["1", "2", "3", "4", "5"] },
  { label: "Weekends",  days: ["6", "0"] },
] as const;

export function matchPreset(selected: string[]): string | null {
  const key = [...selected].sort().join("");
  for (const p of PRESETS) {
    if ([...p.days].sort().join("") === key) return p.label;
  }
  return null;
}

export function formatDays(days: string): string {
  if (days === "1234567") return "Every day";
  if (days === "12345") return "Weekdays";
  if (days === "06") return "Weekends";
  return DAY_DIGITS.filter((d) => days.includes(d))
    .map((d) => DAY_LABELS[parseInt(d)])
    .join(", ");
}
