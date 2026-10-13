
export const validation = {
  required(value: string, fieldName: string): string | null {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email(value: string): string | null {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Please provide a valid email address";
    }
    return null;
  },

  maxLength(
    value: string,
    max: number,
    fieldName: string
  ): string | null {
    if (value.trim().length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return null;
  },

  passwordLength(value: string): string | null {
    if (value.length < 6 || value.length > 30) {
      return "Password must be between 6 and 30 characters";
    }
    return null;
  },
};
