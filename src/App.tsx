import { useState, useCallback } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { devices } from "./lib/devices";
import { LampButton } from "./components/LampButton";
import { DeviceDetail } from "./components/DeviceDetail";
import { Header } from "./components/Header";
import { ScheduleOverview } from "./components/ScheduleOverview";
import { setRelay } from "./lib/api";

function Home() {
  const [lampStates, setLampStates] = useState<Record<string, boolean | null>>({});

  const handleStateChange = useCallback((id: string, isOn: boolean | null) => {
    setLampStates((prev) => ({ ...prev, [id]: isOn }));
  }, []);

  const knownStates = Object.values(lampStates).filter((v): v is boolean => v !== null);
  const onCount = knownStates.filter(Boolean).length;

  async function allOff() {
    await Promise.all(devices.map((d) => setRelay(d.id, false, d.gen ?? 1)));
    setLampStates(
      Object.fromEntries(
        devices.map((d) => [d.id, lampStates[d.id] !== null ? false : null]),
      ),
    );
  }

  async function allOn() {
    await Promise.all(devices.map((d) => setRelay(d.id, true, d.gen ?? 1)));
    setLampStates(
      Object.fromEntries(
        devices.map((d) => [d.id, lampStates[d.id] !== null ? true : null]),
      ),
    );
  }

  return (
    <main className="relative min-h-dvh bg-zinc-100 flex flex-col items-center overflow-x-hidden">
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: knownStates.length > 0 ? Math.min(1, onCount / 4) : 0,
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(253,224,71,0.35), transparent 60%), radial-gradient(80% 50% at 50% 100%, rgba(251,191,36,0.18), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-sm flex flex-col px-6 pt-12 pb-6 gap-4">
        <Header />
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-800 tabular-nums">{onCount}</span>
            <span className="text-sm font-semibold text-zinc-500">of {devices.length} on</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={allOff}
              className="px-3 h-9 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              ALL OFF
            </button>
            <button
              onClick={allOn}
              className="px-3 h-9 rounded-full bg-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-400 transition-colors shadow-[0_0_12px_rgba(253,224,71,0.6)]"
            >
              ALL ON
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {devices.map((d) => (
            <LampButton key={d.id} device={d} onStateChange={handleStateChange} />
          ))}
        </div>
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
        <Route path="/schedule" element={<ScheduleOverview />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
