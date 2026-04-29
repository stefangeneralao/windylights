import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="w-full pt-1 pb-2 flex items-end justify-between">
      <h1 className="text-[44px] leading-[0.95] font-black tracking-tight text-zinc-800">
        Windy
        <br />
        Lights
      </h1>
      <button
        onClick={() => navigate("/schedule")}
        className="text-zinc-500 hover:text-zinc-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Schedule overview"
      >
        <CalendarDays size={28} />
      </button>
    </header>
  );
}
