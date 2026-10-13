
import { StyleSheet, Text, View } from "react-native";
import AppTextInput from "../common/AppTextInput";
import AppButton from "../common/AppButton";
import type { RegisterRequest } from "../../types/Auth";

interface Props {
  form: RegisterRequest;
  loading: boolean;
  error: string | null;
  onChange: (field: keyof RegisterRequest, value: string) => void;
  onSubmit: () => void;
}

export default function RegisterForm({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}: Props) {
  return (
    <View style={styles.card}>
      <AppTextInput
        label="Full Name"
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(v) => onChange("name", v)}
        autoCapitalize="words"
        maxLength={50}
        editable={!loading}
      />

      <AppTextInput
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(v) => onChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={100}
        editable={!loading}
      />

      <AppTextInput
        label="Password"
        placeholder="Create a password"
        value={form.password}
        onChangeText={(v) => onChange("password", v)}
        secureTextEntry
        autoCapitalize="none"
        maxLength={30}
        editable={!loading}
      />

      <AppTextInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={form.phone}
        onChangeText={(v) => onChange("phone", v)}
        keyboardType="phone-pad"
        editable={!loading}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <AppButton
        title="Create Account"
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 8,
  },
});
