import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getDeviceModelById } from "../services/DeviceModel/deviceService";
import type { DeviceModel } from "../types/DeviceModel";

const MODEL_ID = "0022d45a-403a-4b69-955b-1f4335c94534";

export default function DeviceModelDetailScreen() {
  const [model, setModel] = useState<DeviceModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        const data = await getDeviceModelById(MODEL_ID);

        if (isMounted) {
          setModel(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load device model"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Device Model Details</Text>
      <Text style={styles.subtitle}>
        Information fetched from Device Service
      </Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.muted}>Loading model details...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {model && (
        <View style={styles.card}>
          <DetailRow label="Manufacturer" value={model.manufacturer} />
          <DetailRow label="Model Name" value={model.modelName} />
          <DetailRow label="Model Number" value={model.modelNumber} />
          <DetailRow label="Protocol" value={model.protocol} />
          <DetailRow label="Capabilities" value={model.capabilities} />
          <DetailRow label="Model ID" value={model.publicId} />
        </View>
      )}
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Not available"}</Text>
    </View>
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
    fontSize: 26,
    fontWeight: "700",
    color: "#172554",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },
  center: {
    alignItems: "center",
    padding: 24,
  },
  muted: {
    color: "#64748B",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  label: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
  },
  error: {
    color: "#DC2626",
  },
});
