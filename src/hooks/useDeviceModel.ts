import { useState } from "react";

import {createDeviceModel } from "../services/DeviceModel/DeviceModelService";

import type { CreateDeviceModelRequest } from "../types/DeviceModel";

const initialForm: CreateDeviceModelRequest = {
  manufacturer: "",
  modelName: "",
  modelNumber: "",
  protocol: "TCP",
  capabilities: "",
};

export default function useDeviceModel() {
  const [form, setForm] =
    useState<CreateDeviceModelRequest>(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField(
    field: keyof CreateDeviceModelRequest,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  async function submitDeviceModel(): Promise<boolean> {
    if (loading) return false;

    const requiredFields: Array<
      keyof CreateDeviceModelRequest
    > = [
      "manufacturer",
      "modelName",
      "modelNumber",
      "protocol",
      "capabilities",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        setError(`${field} is required`);
        return false;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createDeviceModel({
        manufacturer: form.manufacturer.trim(),
        modelName: form.modelName.trim(),
        modelNumber: form.modelNumber.trim(),
        protocol: form.protocol.trim(),
        capabilities: form.capabilities.trim(),
      });

      const message =
        typeof response === "object" &&
        response !== null &&
        "message" in response &&
        typeof response.message === "string"
          ? response.message
          : "Device model created successfully";

      setSuccess(message);
      setForm(initialForm);

      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create device model"
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    success,
    updateField,
    submitDeviceModel,
  };
}
