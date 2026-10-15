
import * as SecureStore from "expo-secure-store";

import type {
  CreateDeviceModelRequest,
  DeviceModel,
} from "../../types/DeviceModel";

const DEVICE_MODEL_BASE_URL =
  process.env.EXPO_PUBLIC_DEVICE_MODELS_SERVICE_URL;

if (!DEVICE_MODEL_BASE_URL) {
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

  const response = await fetch(DEVICE_MODEL_BASE_URL, {
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


export async function getDeviceModels(): Promise<DeviceModel[]> {
  const accessToken =
    await SecureStore.getItemAsync("accessToken");

  if (!accessToken) {
    throw new Error(
      "Access token not found. Please login again."
    );
  }

  const response = await fetch(DEVICE_MODEL_BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch device models (${response.status})`
    );
  }

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected device models response format."
    );
  }

  return data as DeviceModel[];
}
export async function getDeviceModelById(
  modelId: string
): Promise<DeviceModel> {
  const accessToken =
    await SecureStore.getItemAsync("accessToken");

  if (!accessToken) {
    throw new Error(
      "Access token not found. Please login again."
    );
  }

  const response = await fetch(
    `${DEVICE_MODEL_BASE_URL}/${encodeURIComponent(modelId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  const responseText = await response.text();

  let data: unknown;

  try {
    data = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Unable to fetch device model (${response.status})`
    );
  }

  return data as DeviceModel;
}
