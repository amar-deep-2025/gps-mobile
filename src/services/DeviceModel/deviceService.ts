import * as SecureStore from "expo-secure-store";

import { CreateDeviceModelRequest } from "../../types/DeviceModel";

const DEVICE_BASE_URL =
  process.env.EXPO_PUBLIC_DEVICE_SERVICE_URL;

if (!DEVICE_BASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_DEVICE_SERVICE_URL is not configured in .env"
  );
}

export async function createDeviceModel(
  request: CreateDeviceModelRequest
): Promise<unknown> {
  const accessToken =
    await SecureStore.getItemAsync("accessToken");

  if (!accessToken) {
    throw new Error(
      "Access token not found. Please login again."
    );
  }

  const response = await fetch(DEVICE_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Failed to create device model (${response.status})`;

    throw new Error(message);
  }

  return data;
}
