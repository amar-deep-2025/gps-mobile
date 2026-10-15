import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { createDevice } from "../services/Device/DeviceService";
import type { CreateDeviceRequest } from "../types/Device";

import { getDeviceModels } from "../services/DeviceModel/DeviceModelService";
import type { DeviceModel } from "../types/DeviceModel";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { validation } from "../utils/validation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function getModelLabel(model: DeviceModel): string {
  const manufacturer = model.manufacturer?.trim() ?? "";
  const modelName = model.modelName?.trim() ?? "";

  const label = `${manufacturer} ${modelName}`.trim();

  return label || model.modelNumber?.trim() || "Unnamed Device Model";
}

export default function AddDeviceScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [form, setForm] = useState<CreateDeviceRequest>({
    serialNumber: "",
    imei: "",
    deviceName: "",
    deviceModelId: "",
    firmwareVersion: "",
  });

  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadModels() {
      try {
        const result = await getDeviceModels();

        console.log("Device models received:", JSON.stringify(result, null, 2));

        if (mounted) {
          setModels(result);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load device models."
          );
        }
      } finally {
        if (mounted) {
          setLoadingModels(false);
        }
      }
    }

    void loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  function updateField(field: keyof CreateDeviceRequest, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError(null);
  }

  function validateForm(): string | null {
    return (
      validation.serialNumber(form.serialNumber) ??
      validation.imei(form.imei) ??
      validation.deviceName(form.deviceName) ??
      validation.required(form.deviceModelId, "Device model") ??
      validation.firmwareVersion(form.firmwareVersion ?? "")
    );
  }

  async function submitForm() {
    if (submitting) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const request: CreateDeviceRequest = {
        serialNumber: form.serialNumber.trim(),
        imei: form.imei.trim(),
        deviceName: form.deviceName.trim(),
        deviceModelId: form.deviceModelId,
        firmwareVersion: form.firmwareVersion?.trim() || null,
      };

      await createDevice(request);

      Alert.alert("Success", "GPS device registered successfully.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("DeviceList"),
        },
      ]);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to register device."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedModel = models.find(
    (model) => model.publicId === form.deviceModelId
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Add GPS Device</Text>
      <Text style={styles.subtitle}>
        Enter your tracker details to register it.
      </Text>

      <Text style={styles.label}>Device Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. My Car GPS"
        value={form.deviceName}
        onChangeText={(value) => updateField("deviceName", value)}
        maxLength={100}
      />

      <Text style={styles.label}>Serial Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter serial number"
        value={form.serialNumber}
        onChangeText={(value) => updateField("serialNumber", value)}
        autoCapitalize="characters"
        maxLength={50}
      />

      <Text style={styles.label}>IMEI</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 15-digit IMEI"
        value={form.imei}
        onChangeText={(value) =>
          updateField("imei", value.replace(/\D/g, "").slice(0, 15))
        }
        keyboardType="number-pad"
        maxLength={15}
      />

      <Text style={styles.label}>Device Model</Text>

      {loadingModels ? (
        <View style={styles.dropdownField}>
          <ActivityIndicator color="#2563EB" />
          <Text style={styles.loadingText}>Loading device models...</Text>
        </View>
      ) : (
        <>
          <Pressable
            style={[
              styles.dropdownField,
              modelDropdownOpen && styles.dropdownFieldOpen,
            ]}
            onPress={() => setModelDropdownOpen((previous) => !previous)}
          >
            <Text
              style={[
                styles.dropdownText,
                !selectedModel && styles.placeholder,
              ]}
              numberOfLines={1}
            >
              {selectedModel
                ? getModelLabel(selectedModel)
                : models.length > 0
                  ? "Select device model"
                  : "No device models available"}
            </Text>

            <Text style={styles.dropdownArrow}>
              {modelDropdownOpen ? "▲" : "▼"}
            </Text>
          </Pressable>

          {modelDropdownOpen && models.length > 0 && (
            <View style={styles.dropdownList}>
              {models.map((model) => {
                const selected = form.deviceModelId === model.publicId;

                return (
                  <Pressable
                    key={model.publicId}
                    style={[
                      styles.dropdownOption,
                      selected && styles.selectedModel,
                    ]}
                    onPress={() => {
                      updateField("deviceModelId", model.publicId);
                      setModelDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modelName,
                        selected && styles.selectedModelText,
                      ]}
                    >
                      {getModelLabel(model)}
                    </Text>

                    <Text
                      style={[
                        styles.modelInfo,
                        selected && styles.selectedModelText,
                      ]}
                    >
                      {model.protocol || "Protocol not specified"}
                      {model.modelNumber?.trim()
                        ? ` • ${model.modelNumber}`
                        : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}

      <Text style={styles.label}>Firmware Version (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1.0.0"
        value={form.firmwareVersion ?? ""}
        onChangeText={(value) => updateField("firmwareVersion", value)}
        maxLength={30}
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[
          styles.submitButton,
          (submitting || loadingModels || models.length === 0) &&
            styles.disabledButton,
        ]}
        onPress={() => void submitForm()}
        disabled={submitting || loadingModels || models.length === 0}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Register Device</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  back: {
    color: "#2563EB",
    fontSize: 16,
    marginBottom: 22,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#172033",
  },
  subtitle: {
    color: "#687386",
    marginTop: 7,
    marginBottom: 25,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE3ED",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#172033",
  },
  dropdownField: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE3ED",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownFieldOpen: {
    borderColor: "#2563EB",
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: "#172033",
  },
  placeholder: {
    color: "#94A3B8",
  },
  loadingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#64748B",
  },
  dropdownArrow: {
    color: "#64748B",
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownList: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE3ED",
    borderRadius: 10,
    padding: 8,
    gap: 6,
  },
  dropdownOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedModel: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  modelName: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "600",
  },
  modelInfo: {
    color: "#687386",
    marginTop: 5,
    fontSize: 13,
  },
  selectedModelText: {
    color: "#1D4ED8",
  },
  error: {
    color: "#DC2626",
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
