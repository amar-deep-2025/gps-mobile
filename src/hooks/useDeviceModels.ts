
import { useCallback, useEffect, useState } from "react";

import { getDeviceModels } from "../services/DeviceModel/DeviceModelService";
import type { DeviceModel } from "../types/DeviceModel";

export default function useDeviceModels() {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDeviceModels();
      setModels(response);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch device models."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
  };
}
