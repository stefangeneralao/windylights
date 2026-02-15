import { ArrowLeft } from "lucide-react";

export function DeviceDetailHeader({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  return (
    <header className="pt-6 pb-2 flex items-center gap-3">
      <button
        onClick={onBack}
        className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors min-w-11 min-h-11 flex items-center justify-center"
        aria-label="Back"
      >
        <ArrowLeft size={22} />
      </button>
      <h1 className="text-4xl font-black text-zinc-800 dark:text-zinc-100">
        {name}
      </h1>
    </header>
  );
}
