import { useEffect, useState } from "react";
import { devices } from "../lib/devices";
import { fetchSchedule, type ScheduleRule } from "../lib/api";

export interface DeviceRule extends ScheduleRule {
  deviceName: string;
  deviceId: string;
}

export function useScheduleRules() {
  const [rules, setRules] = useState<DeviceRule[] | null>(null);

  useEffect(() => {
    Promise.all(
      devices.map((d) =>
        fetchSchedule(d.id, d.gen ?? 1).then((r) =>
          (r ?? []).map((rule) => ({ ...rule, deviceName: d.name, deviceId: d.id }))
        )
      )
    ).then((results) => setRules(results.flat()));
  }, []);

  return rules;
}
