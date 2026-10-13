
import { useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useLogin from "../hooks/auth/useLogin";
import type { RootStackParamList } from "../navigation/AppNavigator";
import LoginForm from "../components/auth/LoginForm";

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();

  const {
    form,
    loading,
    error,
    loginData,
    updateField,
    submitLogin,
  } = useLogin();

  useEffect(() => {
    if (!loginData) {
      return;
    }

    let cancelled = false;

    async function saveSession() {
      try {
        await SecureStore.setItemAsync(
          "accessToken",
          loginData!.accessToken
        );

        await SecureStore.setItemAsync(
          "refreshToken",
          loginData!.refreshToken
        );

        await SecureStore.setItemAsync(
          "publicId",
          loginData!.publicId
        );

        await SecureStore.setItemAsync(
          "tokenType",
          loginData!.tokenType
        );

        if (!cancelled) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        }
      } catch {
        if (!cancelled) {
          Alert.alert(
            "Session Error",
            "Login succeeded, but the session could not be saved securely. Please try again."
          );
        }
      }
    }

    void saveSession();

    return () => {
      cancelled = true;
    };
  }, [loginData, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to access your GPS tracking dashboard.
          </Text>
        </View>

        <LoginForm
          form={form}
          loading={loading}
          error={error}
          onChange={updateField}
          onSubmit={submitLogin}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            disabled={loading}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#172554",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  registerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
});
