import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppTextInput from "../common/AppTextInput";
import AppButton from "../common/AppButton";
import type { CreateDeviceModelRequest } from "../../types/DeviceModel";
interface Props {
  form: CreateDeviceModelRequest;
  loading: boolean;
  error: string | null;
  success: string | null;
  onChange: (
    field: keyof CreateDeviceModelRequest,
    value: string
  ) => void;
  onSubmit: () => void | Promise<unknown>;
}

export default function DeviceModelForm({
  form,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Create Device Model</Text>

      <AppTextInput
        label="Manufacturer"
        placeholder="e.g. Queclink"
        value={form.manufacturer}
        onChangeText={(value) =>
          onChange("manufacturer", value)
        }
        autoCapitalize="words"
        maxLength={100}
        editable={!loading}
      />

      <AppTextInput
        label="Model Name"
        placeholder="e.g. GV300"
        value={form.modelName}
        onChangeText={(value) =>
          onChange("modelName", value)
        }
        autoCapitalize="characters"
        maxLength={100}
        editable={!loading}
      />

      <AppTextInput
        label="Model Number"
        placeholder="e.g. GV300"
        value={form.modelNumber}
        onChangeText={(value) =>
          onChange("modelNumber", value)
        }
        autoCapitalize="characters"
        maxLength={100}
        editable={!loading}
      />

      <AppTextInput
        label="Protocol"
        placeholder="TCP, UDP or MQTT"
        value={form.protocol}
        onChangeText={(value) =>
          onChange("protocol", value.toUpperCase())
        }
        autoCapitalize="characters"
        maxLength={20}
        editable={!loading}
      />

      <AppTextInput
        label="Capabilities"
        placeholder="GPS tracking, ignition status, vehicle location"
        value={form.capabilities}
        onChangeText={(value) =>
          onChange("capabilities", value)
        }
        autoCapitalize="sentences"
        maxLength={500}
        editable={!loading}
      />

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {success && (
        <Text style={styles.success}>{success}</Text>
      )}

      <AppButton
        title="Create Device Model"
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 8,
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
  },
  success: {
    color: "#15803D",
    fontSize: 14,
  },
});
