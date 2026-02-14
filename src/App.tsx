import { HashRouter, Routes, Route } from "react-router-dom";
import { devices } from "./devices";
import { LampButton } from "./LampButton";
import { DeviceDetail } from "./DeviceDetail";

function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center p-6 gap-4">
      <header className="w-full max-w-sm pt-6 pb-2">
        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Lights</h1>
      </header>
      <div className="w-full max-w-sm flex flex-col gap-4">
        {devices.map((d) => (
          <LampButton key={d.id} device={d} />
        ))}
      </div>
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/device/:id" element={<DeviceDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
