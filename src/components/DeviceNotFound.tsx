export function DeviceNotFound({ onBack }: { onBack: () => void }) {
  return (
    <main className="min-h-dvh bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
      <p className="text-zinc-500">Device not found.</p>
      <button
        onClick={onBack}
        className="mt-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors underline"
      >
        Back
      </button>
    </main>
  );
}
