export interface Device {
  id: string;
  name: string;
  gen?: 1 | 3;
}

export const devices: Device[] = [
  { id: "shelly-0", name: "Plantor" },
  { id: "shelly-1", name: "MUST" },
  { id: "shelly-2", name: "Aniniput", gen: 3 },
  { id: "shelly-3", name: "Kontor" },
  { id: "shelly-4", name: "Hylla" },
  { id: "shelly-5", name: "Soffa" },
  { id: "shelly-6", name: "Slinga sovrum", gen: 3 },
];
