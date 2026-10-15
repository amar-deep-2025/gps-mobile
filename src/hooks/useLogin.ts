
import { useState } from "react";

import { loginUser } from "../services/auth/authService";
import type { LoginRequest, LoginResponse } from "../types/Auth";
import { validation } from "../utils/validation";

export default function useLogin() {
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);

  function updateField(field: keyof LoginRequest, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError(null);
  }

  function validateForm(): string | null {
    return (
      validation.required(form.email, "Email") ??
      validation.email(form.email) ??
      validation.required(form.password, "Password")
    );
  }

  async function submitLogin(): Promise<boolean> {
    if (loading) {
      return false;
    }

    setError(null);
    setLoginData(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      setLoginData(response);
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    loginData,
    updateField,
    submitLogin,
  };
}
