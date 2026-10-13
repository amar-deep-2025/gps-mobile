
import { StyleSheet, Text, View } from "react-native";

import AppTextInput from "../common/AppTextInput";
import AppButton from "../common/AppButton";
import type { LoginRequest } from "../../types/Auth";

interface Props {
  form: LoginRequest;
  loading: boolean;
  error: string | null;
  onChange: (field: keyof LoginRequest, value: string) => void;
  onSubmit: () => void | Promise<unknown>;
}

export default function LoginForm({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}: Props) {
  return (
    <View style={styles.card}>
      <AppTextInput
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(value) => onChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={100}
        editable={!loading}
      />

      <AppTextInput
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(value) => onChange("password", value)}
        secureTextEntry
        autoCapitalize="none"
        maxLength={30}
        editable={!loading}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <AppButton
        title="Login"
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
