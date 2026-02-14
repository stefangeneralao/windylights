import { HashRouter, Routes, Route } from "react-router-dom";
import { devices } from "./lib/devices";
import { LampButton } from "./components/LampButton";
import { DeviceDetail } from "./components/DeviceDetail";
import { Header } from "./components/Header";

function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center p-6 gap-4">
      <Header />
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
