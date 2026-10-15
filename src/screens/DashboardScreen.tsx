import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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

import { getAllDevices } from "../services/Device/DeviceService";

import type { Location } from "../types/Locations";

import type { Device } from "../types/Device";

import type { RootStackParamList } from "../navigation/AppNavigator";

import useLogout from "../hooks/useLogout";

type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
    null
  );

  const [location, setLocation] = useState<Location | null>(null);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loading: logoutLoading, submitLogout } = useLogout();

  // Load devices belonging to the logged-in user.
  const loadDevices = useCallback(async () => {
    setDevicesLoading(true);
    setError(null);

    try {
      const result = await getAllDevices();

      setDevices(result);

      setSelectedDeviceId((currentId) => {
        if (currentId && result.some((device) => device.publicId === currentId)) {
          return currentId;
        }

        return result[0]?.publicId ?? null;
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load devices. Please try again."
      );
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  // Fetch the selected device's latest location every 10 seconds.
  useEffect(() => {
    if (!selectedDeviceId) {
      setLocation(null);
      setLocationLoading(false);
      return;
    }

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function loadLocation() {
      if (isMounted) {
        setLocationLoading(true);
        setError(null);
      }

      try {
        const result = await getLatestLocation(selectedDeviceId!);

        if (isMounted) {
          setLocation(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to fetch GPS location."
          );
        }
      } finally {
        if (isMounted) {
          setLocationLoading(false);
          timeoutId = setTimeout(() => {
            void loadLocation();
          }, 10000);
        }
      }
    }

    setLocation(null);
    void loadLocation();

    return () => {
      isMounted = false;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedDeviceId]);

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

  function formatTimestamp(value: string | null | undefined) {
    if (!value) {
      return "Unavailable";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  }

  const selectedDevice = devices.find(
    (device) => device.publicId === selectedDeviceId
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Pressable onPress={()=>navigation.navigate("Home")}> <Text style={styles.title}>GPS Tracker</Text></Pressable>
          <Text style={styles.subtitle}>Live Device Dashboard</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddDevice")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>+ Add Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listButton}
            onPress={() => navigation.navigate("DeviceList")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>My Devices</Text>
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
            <Text style={styles.buttonText}>
              {logoutLoading ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Device selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Device</Text>

        {devicesLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : devices.length === 0 ? (
          <Text style={styles.muted}>
            No devices registered yet. Add your first GPS device.
          </Text>
        ) : (
          <View style={styles.deviceOptions}>
            {devices.map((device) => {
              const isSelected = device.publicId === selectedDeviceId;

              return (
                <TouchableOpacity
                  key={device.publicId}
                  style={[
                    styles.deviceOption,
                    isSelected && styles.selectedDeviceOption,
                  ]}
                  onPress={() => setSelectedDeviceId(device.publicId)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.deviceOptionTitle,
                      isSelected && styles.selectedDeviceText,
                    ]}
                  >
                    {device.deviceName}
                  </Text>

                  <Text
                    style={[
                      styles.deviceOptionSubtitle,
                      isSelected && styles.selectedDeviceText,
                    ]}
                  >
                    {device.status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Unable to load data</Text>
          <Text style={styles.error}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (devices.length === 0) {
                void loadDevices();
              } else if (selectedDeviceId) {
                setSelectedDeviceId(null);
                setTimeout(() => {
                  setSelectedDeviceId(selectedDeviceId);
                }, 0);
              }
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!devicesLoading && devices.length > 0 && locationLoading && !location && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.muted}>Fetching device location...</Text>
        </View>
      )}

      {!devicesLoading && devices.length > 0 && !location && !locationLoading && !error && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Unavailable</Text>
          <Text style={styles.muted}>
            No location has been received for this device yet.
          </Text>
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
                title={selectedDevice?.deviceName ?? "GPS Tracker"}
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

            {locationLoading && (
              <ActivityIndicator size="small" color="#2563EB" />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Device Information</Text>

            <Text style={styles.label}>Device Name</Text>
            <Text style={styles.value}>
              {selectedDevice?.deviceName ?? "Unavailable"}
            </Text>

            <Text style={styles.label}>Device Public ID</Text>
            <Text style={styles.value}>
              {location.devicePublicId}
            </Text>

            <Text style={styles.label}>Device Status</Text>
            <Text style={styles.value}>
              {selectedDevice?.status ?? "Unavailable"}
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
    marginBottom: 20,
  },
  headerText: {
    marginBottom: 16,
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
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  listButton: {
    backgroundColor: "#0F766E",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
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
  deviceOptions: {
    gap: 10,
  },
  deviceOption: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  selectedDeviceOption: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  deviceOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  deviceOptionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  selectedDeviceText: {
    color: "#FFFFFF",
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
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
