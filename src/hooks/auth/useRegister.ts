
import { useState } from "react";
import { registerUser } from "../../services/auth/authService";
import type { RegisterRequest } from "../../types/Auth";
import { validation } from "../../utils/validation";

export default function useRegister() {
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField(
    field: keyof RegisterRequest,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  function validateForm(): string | null {
    return (
      validation.required(form.name, "Name") ??
      validation.maxLength(form.name, 50, "Name") ??
      validation.required(form.email, "Email") ??
      validation.email(form.email) ??
      validation.maxLength(form.email, 100, "Email") ??
      validation.required(form.password, "Password") ??
      validation.passwordLength(form.password) ??
      validation.required(form.phone, "Phone number")
    );
  }

  async function submitRegister(): Promise<boolean> {
    if (loading) {
      return false;
    }

    setError(null);
    setSuccess(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);

    try {
      const message = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });

      setSuccess(message);

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
      });

      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
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
    success,
    updateField,
    submitRegister,
  };
}
