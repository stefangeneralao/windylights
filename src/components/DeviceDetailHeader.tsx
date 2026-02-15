import { ChevronLeft } from "lucide-react";

export function DeviceDetailHeader({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-10 pb-4 max-w-sm w-full mx-auto">
      <button
        onClick={onBack}
        className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
        aria-label="Back"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-3xl font-black text-zinc-800 dark:text-zinc-100">
        {name}
      </h1>
    </header>
  );
}
