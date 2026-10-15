import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getDeviceById } from "../services/Device/DeviceService";
import type { Device } from "../types/Device";
import type { RootStackParamList } from "../navigation/AppNavigator";

type DetailRoute = RouteProp<RootStackParamList, "DeviceDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DeviceDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRoute>();
  const { publicId } = route.params;

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDevice() {
      setLoading(true);
      setError(null);

      try {
        const result = await getDeviceById(publicId);

        console.log(
          "Device API response:",
          JSON.stringify(result, null, 2)
        );

        if (!result) {
          throw new Error("Device details were not returned by the API.");
        }

        if (mounted) {
          setDevice(result);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch device:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load device details."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDevice();

    return () => {
      mounted = false;
    };
  }, [publicId]);

  function formatDate(value?: string | null): string {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderDetail(label: string, value?: string | null) {
    return (
      <View style={styles.detailRow} key={label}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "Not available"}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Loading device details...</Text>
      </View>
    );
  }

  if (error || !device) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Unable to load device</Text>

        <Text style={styles.error}>
          {error ?? "Device not found."}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isActive = device.status?.toUpperCase() === "ACTIVE";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>← Back to My Devices</Text>
      </Pressable>

      <View style={styles.deviceHeader}>
        <View style={styles.deviceIcon}>
          <Text style={styles.deviceIconText}>GPS</Text>
        </View>

        <View style={styles.deviceHeading}>
          <Text style={styles.title}>
            {device.deviceName || "Unnamed Device"}
          </Text>

          <Text style={styles.subtitle}>
            Device ID: {device.serialNumber || "Not available"}
          </Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>DEVICE STATUS</Text>

        <Text
          style={[
            styles.statusValue,
            { color: isActive ? "#15803D" : "#DC2626" },
          ]}
        >
          {device.status || "UNKNOWN"}
        </Text>

        <View style={styles.lifecycleBadge}>
          <Text style={styles.lifecycle}>
            {device.lifecycleState || "Unknown lifecycle"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Device Information</Text>

        {renderDetail("Device Name", device.deviceName)}
        {renderDetail("Device ID", device.serialNumber)}
        {renderDetail("Public ID", device.publicId)}
        {renderDetail("Serial Number", device.serialNumber)}
        {renderDetail("IMEI", device.imei)}
        {renderDetail("Device Model ID", device.deviceModelId)}
        {renderDetail("Firmware Version", device.firmwareVersion)}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Registration Information
        </Text>

        {renderDetail("Registered At", formatDate(device.registeredAt))}
        {renderDetail("Activated At", formatDate(device.activatedAt))}
        {renderDetail("Last Seen At", formatDate(device.lastSeenAt))}
        {renderDetail("Created At", formatDate(device.createdAt))}
        {renderDetail("Updated At", formatDate(device.updatedAt))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F7FB",
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop:30,
    marginBottom: 24,
    paddingVertical: 8,
  },

  back: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  deviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },

  deviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#173B8F",
    alignItems: "center",
    justifyContent: "center",
  },

  deviceIconText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  deviceHeading: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#172033",
  },

  subtitle: {
    color: "#687386",
    fontSize: 12,
    marginTop: 6,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },

  statusLabel: {
    fontSize: 11,
    color: "#687386",
    fontWeight: "800",
    letterSpacing: 1,
  },

  statusValue: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 9,
  },

  lifecycleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 10,
  },

  lifecycle: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 10,
  },

  detailRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F6",
  },

  label: {
    fontSize: 12,
    color: "#687386",
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    lineHeight: 21,
    color: "#172033",
    fontWeight: "600",
  },

  message: {
    color: "#687386",
    marginTop: 10,
  },

  errorTitle: {
    color: "#172033",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },

  error: {
    color: "#DC2626",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
