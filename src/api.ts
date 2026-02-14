const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? "";

export async function fetchRelayState(deviceId: string): Promise<boolean | null> {
  try {
    const res = await fetch(`${PROXY_URL}/${deviceId}/relay/0?status`);
    const data = await res.json();
    return data.ison as boolean;
  } catch {
    return null;
  }
}

export async function toggleRelay(deviceId: string): Promise<void> {
  await fetch(`${PROXY_URL}/${deviceId}/relay/0?turn=toggle`).catch(() => {});
}
