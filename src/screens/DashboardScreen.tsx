import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getLatestLocation } from "../services/Location/locationService";
import type { Location } from "../types/Locations";
import useLogout from "../hooks/auth/useLogout";
import type { RootStackParamList } from "../navigation/AppNavigator";

type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const DEVICE_PUBLIC_ID = "7bdb6fbe-b26d-4dbf-b6eb-1ab6225dcfa3";

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    loading: logoutLoading,
    submitLogout,
  } = useLogout();

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
      } catch (err: unknown) {
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
          timeoutId = setTimeout(loadLocation, 10000);
        }
      }
    }

    void loadLocation();

    return () => {
      isMounted = false;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  async function handleLogout() {
    const success = await submitLogout();

    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return;
    }

    Alert.alert(
      "Logout Failed",
      "Unable to log out. Please check your connection and try again."
    );
  }

  function formatTimestamp(value: string) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>GPS Tracker</Text>
          <Text style={styles.subtitle}>Live Device Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.deviceModelButton}
          onPress={() => navigation.navigate("DeviceModel")}
          activeOpacity={0.8}
        >
          <Text style={styles.deviceModelButtonText}>
            Add Model
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            logoutLoading && styles.disabledButton,
          ]}
          onPress={handleLogout}
          disabled={logoutLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>
            {logoutLoading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>

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
                description={`Speed: ${
                  location.speed ?? "Unavailable"
                } km/h`}
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
            <Text style={styles.value}>
              {location.devicePublicId}
            </Text>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  headerText: {
    flex: 1,
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
  },
  deviceModelButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deviceModelButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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

