export interface Device {
  id: string;
  name: string;
  gen?: 1 | 3;
}

export const devices: Device[] = [
  { id: "shelly-0", name: "Plantor" },
  { id: "shelly-1", name: "Lampa MUST" },
  { id: "shelly-2", name: "Aniniput", gen: 3 },
  { id: "shelly-3", name: "Lampa kontor" },
  { id: "shelly-4", name: "Lampa hylla" },
  { id: "shelly-5", name: "Lampa soffa" },
];
