import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="w-full max-w-sm pt-6 pb-2 flex items-center justify-between">
      <h1 className="text-5xl font-black text-zinc-800 dark:text-zinc-100">
        Windy Lights
      </h1>
      <button
        onClick={() => navigate("/schedule")}
        className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Schedule overview"
      >
        <CalendarDays size={24} />
      </button>
    </header>
  );
}
