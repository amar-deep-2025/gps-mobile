import * as SecureStore from "expo-secure-store";

import type { CreateDeviceRequest, Device } from "../../types/Device";

const DEVICE_BASE_URL =
  process.env.EXPO_PUBLIC_DEVICE_SERVICE_URL;

if (!DEVICE_BASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_DEVICE_SERVICE_URL is not configured in .env"
  );
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const accessToken =
    await SecureStore.getItemAsync("accessToken");

  if (!accessToken) {
    throw new Error("Session expired. Please login again.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(
  response: Response
): Promise<T> {
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
    let message = `Request failed (${response.status})`;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      message = data.message;
    } else if (typeof data === "string" && data.trim()) {
      message = data;
    }

    throw new Error(message);
  }

  return data as T;
}


export async function getAllDevices(): Promise<Device[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(DEVICE_BASE_URL, {
    method: "GET",
    headers,
  });

  const data = await handleResponse<unknown>(response);

  if (!Array.isArray(data)) {
    throw new Error("Unexpected devices response format.");
  }

  return data as Device[];
}

export async function getDeviceById(
  publicId: string
): Promise<Device> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${DEVICE_BASE_URL}/${encodeURIComponent(publicId)}`,
    {
      method: "GET",
      headers,
    }
  );

  return handleResponse<Device>(response);
}


export async function createDevice(
  request: CreateDeviceRequest
): Promise<Device> {
  const headers = await getAuthHeaders();

  const response = await fetch(DEVICE_BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  return handleResponse<Device>(response);
}
