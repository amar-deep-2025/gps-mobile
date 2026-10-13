
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

import { getLatestLocation } from "../services/Location/locationService";
import type { Location } from "../types/Locations";

const DEVICE_PUBLIC_ID = "7bdb6fbe-b26d-4dbf-b6eb-1ab6225dcfa3";

export default function DashboardScreen() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function loadLocation() {
      try {
        const data = await getLatestLocation(DEVICE_PUBLIC_ID);

        if (isMounted) {
          setLocation(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to fetch GPS location"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);

          // Next request starts after the current request finishes.
          timeoutId = setTimeout(loadLocation, 10000);
        }
      }
    }

    loadLocation();

    return () => {
      isMounted = false;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>GPS Tracker</Text>
      <Text style={styles.subtitle}>Live Device Dashboard</Text>

      {loading && !location && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.muted}>Fetching device location...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Location Error</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {location && (
        <>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="GPS Tracker"
                description={`Speed: ${location.speed ?? "Unavailable"} km/h`}
              />
            </MapView>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              Latest location received
            </Text>
            {loading && (
              <ActivityIndicator size="small" color="#2563EB" />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Device Information</Text>

            <Text style={styles.label}>Device Public ID</Text>
            <Text style={styles.value}>{location.devicePublicId}</Text>

            <View style={styles.divider} />

            <View style={styles.coordinateRow}>
              <View style={styles.coordinateItem}>
                <Text style={styles.label}>Latitude</Text>
                <Text style={styles.value}>
                  {location.latitude.toFixed(6)}
                </Text>
              </View>

              <View style={styles.coordinateItem}>
                <Text style={styles.label}>Longitude</Text>
                <Text style={styles.value}>
                  {location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.label}>Speed</Text>
            <Text style={styles.speed}>
              {location.speed == null
                ? "Unavailable"
                : `${location.speed} km/h`}
            </Text>

            <Text style={styles.label}>GPS Timestamp</Text>
            <Text style={styles.value}>
              {formatTimestamp(location.gpsTimestamp)}
            </Text>

            <Text style={styles.label}>Server Received At</Text>
            <Text style={styles.value}>
              {formatTimestamp(location.receivedAt)}
            </Text>
          </View>
        </>
      )}

      {!loading && !error && !location && (
        <Text style={styles.muted}>No location available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172554",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 20,
  },
  center: {
    alignItems: "center",
    padding: 32,
  },
  muted: {
    color: "#64748B",
    marginTop: 10,
    fontSize: 14,
  },
  mapContainer: {
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  statusText: {
    color: "#166534",
    fontSize: 13,
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 12,
  },
  label: {
    color: "#64748B",
    marginTop: 12,
    fontSize: 12,
  },
  value: {
    color: "#1E293B",
    fontSize: 14,
    marginTop: 4,
  },
  speed: {
    color: "#2563EB",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  coordinateRow: {
    flexDirection: "row",
    gap: 12,
  },
  coordinateItem: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 16,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    color: "#B91C1C",
    fontWeight: "700",
    marginBottom: 6,
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
  },
});
