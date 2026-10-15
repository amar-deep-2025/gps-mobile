
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import useDeviceModels from "../hooks/useDeviceModels";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "DeviceModelList"
>;

export default function DeviceModelListScreen({
  navigation,
}: Props) {
  const { models, loading, error, refetch } = useDeviceModels();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Loading device models...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Device Models</Text>
      <Text style={styles.subtitle}>
        Select a model to view complete details.
      </Text>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={models}
          keyExtractor={(item) => item.publicId}
          onRefresh={refetch}
          refreshing={loading}
          contentContainerStyle={
            models.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.message}>
              No device models found.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate("DeviceModelDetail", {
                  publicId: item.publicId,
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>GPS</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.modelName}>
                    {item.modelName || "Unnamed Model"}
                  </Text>

                  <Text style={styles.idLabel}>Model ID</Text>

                  <Text selectable style={styles.modelId}>
                    {item.publicId}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("DeviceModel")}
      >
        <Text style={styles.addButtonText}>+ Add Model</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#172033",
  },
  subtitle: {
    fontSize: 14,
    color: "#687386",
    marginTop: 6,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E4E8F0",
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
  },
  cardContent: {
    flex: 1,
  },
  modelName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#172033",
    marginBottom: 8,
  },
  idLabel: {
    fontSize: 12,
    color: "#687386",
    marginBottom: 3,
  },
  modelId: {
    fontSize: 12,
    color: "#364152",
  },
  arrow: {
    fontSize: 28,
    color: "#687386",
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 14,
    color: "#687386",
    marginTop: 10,
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 9,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
