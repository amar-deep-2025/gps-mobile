import { useCallback, useEffect, useState } from "react";

import { getAllDevices } from "../services/Device/DeviceService";
import type { Device } from "../types/Device";

export default function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await getAllDevices();

      console.log(
        "Physical devices API response:",
        JSON.stringify(response, null, 2)
      );

      if (!Array.isArray(response)) {
        throw new Error(
          "Invalid response: expected a list of physical devices."
        );
      }

      setDevices(response);
    } catch (err: unknown) {
      console.error("Failed to fetch physical devices:", err);

      setDevices([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load devices. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  const refreshDevices = useCallback(() => {
    void fetchDevices(true);
  }, [fetchDevices]);

  return {
    devices,
    loading,
    refreshing,
    error,
    refreshDevices,
    fetchDevices,
  };
}
