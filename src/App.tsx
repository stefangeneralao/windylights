import { devices } from "./devices";
import { LampButton } from "./LampButton";

function App() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-4 p-6">
      {devices.map((d) => (
        <LampButton key={d.id} device={d} />
      ))}
    </main>
  );
}

export default App;
