import type { Location } from "../../types/Locations";

const API_BASE_URL = process.env.EXPO_PUBLIC_LOCATION_SERVICE_URL;

if (!API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured");
}

export async function getLatestLocation(
  devicePublicId: string
): Promise<Location> {
  const response = await fetch(
    `${API_BASE_URL}/${devicePublicId}/latest`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch latest location: ${response.status}`
    );
  }

  return (await response.json()) as Location;
}