import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { logoutUser } from "../../services/auth/authService";

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitLogout(): Promise<boolean> {
    if (loading) return false;

    setLoading(true);
    setError(null);

    try {
      const refreshToken =
        await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        throw new Error("Refresh token not found. Please login again.");
      }

      // Call backend logout API
      await logoutUser(refreshToken);

      // Clear locally stored session data
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("publicId");
      await SecureStore.deleteItemAsync("tokenType");

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Logout failed. Please try again.";

      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    submitLogout,
  };
}
