import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import useDevices from "../hooks/useDevice";
import type { Device } from "../types/Device";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DeviceListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    devices,
    loading,
    error,
    refreshDevices,
  } = useDevices();

  const renderDevice = useCallback(
    ({ item }: { item: Device }) => (
      <Pressable
        style={({ pressed }) => [
          styles.deviceCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          navigation.navigate("DeviceDetail", {
            publicId: item.publicId,
          })
        }
      >
        <View style={styles.deviceIcon}>
          <Text style={styles.deviceIconText}>GPS</Text>
        </View>

        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName} numberOfLines={1}>
            {item.deviceName || "Unnamed Device"}
          </Text>

          <Text style={styles.deviceId} numberOfLines={1}>
            Device ID: {item.serialNumber || "N/A"}
          </Text>
        </View>

        <Text style={styles.chevron}>›</Text>
      </Pressable>
    ),
    [navigation]
  );

  if (loading && devices.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Loading devices...</Text>
      </View>
    );
  }

  if (error && devices.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={refreshDevices}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Devices</Text>
          <Text style={styles.subtitle}>
            {devices.length} {devices.length === 1 ? "device" : "devices"}
            {" registered"}
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("AddDevice")}
        >
          <Text style={styles.addButtonText}>+ Add Device</Text>
        </Pressable>
      </View>

      {error ? (
        <Text style={styles.warningText}>{error}</Text>
      ) : null}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.publicId}
        renderItem={renderDevice}
        contentContainerStyle={[
          styles.listContent,
          devices.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshDevices}
            colors={["#2563EB"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No devices found</Text>
            <Text style={styles.emptyMessage}>
              Add a GPS device to see it here.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:20,
    marginBottom: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
  },
  cardPressed: {
    opacity: 0.75,
  },
  deviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  deviceIconText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  deviceId: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
  },
  chevron: {
    fontSize: 28,
    color: "#94A3B8",
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  warningText: {
    color: "#B45309",
    fontSize: 13,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptyMessage: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
});
