import { ChevronLeft } from "lucide-react";

export function DeviceDetailHeader({
  name,
  isOn,
  onBack,
}: {
  name: string;
  isOn?: boolean | null;
  onBack: () => void;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-10 pb-4 max-w-sm w-full mx-auto">
      <button
        onClick={onBack}
        className="text-zinc-500 hover:text-zinc-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
        aria-label="Back"
      >
        <ChevronLeft size={26} />
      </button>
      <h1 className="text-[34px] leading-none font-black tracking-tight text-zinc-800">
        {name}
      </h1>
      {isOn !== undefined && isOn !== null && (
        <div className="ml-auto flex items-center gap-2 mr-1">
          <span
            className={`w-2 h-2 rounded-full ${isOn ? "bg-amber-400 shadow-[0_0_8px_rgba(253,224,71,0.8)]" : "bg-zinc-300"}`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            {isOn ? "On" : "Off"}
          </span>
        </div>
      )}
    </header>
  );
}
