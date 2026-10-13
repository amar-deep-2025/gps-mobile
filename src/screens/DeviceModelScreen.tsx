import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import DeviceModelForm from "../components/DeviceModel/DeviceModelForm";

import useDeviceModel from "../hooks/deviceModel/useDeviceModel";

export default function DeviceModelScreen() {
  const {
    form,
    loading,
    error,
    success,
    updateField,
    submitDeviceModel,
  } = useDeviceModel();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Device Management</Text>
          <Text style={styles.subtitle}>
            Register a GPS device model
          </Text>
        </View>

        <DeviceModelForm
          form={form}
          loading={loading}
          error={error}
          success={success}
          onChange={updateField}
          onSubmit={submitDeviceModel}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
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
});