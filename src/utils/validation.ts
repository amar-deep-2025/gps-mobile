export const validation = {
  required(value: string, fieldName: string): string | null {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }

    return null;
  },

  name(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Name is required";
    }

    if (trimmedValue.length < 2) {
      return "Name must be at least 2 characters";
    }

    if (trimmedValue.length > 50) {
      return "Name must not exceed 50 characters";
    }

    if (!/^[a-zA-Z]+(?:[ .'-][a-zA-Z]+)*$/.test(trimmedValue)) {
      return "Name can contain only letters, spaces, dots, hyphens and apostrophes";
    }

    return null;
  },

  email(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Email is required";
    }

    if (trimmedValue.length > 254) {
      return "Email must not exceed 254 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return "Please provide a valid email address";
    }

    return null;
  },

  phone(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Phone number is required";
    }

    if (!/^(?:(?:\+91|91)[ -]?)?[6-9]\d{9}$/.test(trimmedValue)) {
      return "Please provide a valid 10 digit Indian mobile number";
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

  deviceName(value:string): string | null {
    const name=value.trim();
    if (!name){
      return "Device name is required"
    }
    if (name.length>30){
      return "Device name must not exceed 30 characters";
    }
    return null;
  },

  serialNumber(value:string): string | null {
    const serial=value.trim();

    if (!serial){
      return "Serial number is required";
    }
    if (serial.length>30){
      return "Serial number must not exceed 50 characters";
    }
    return null;
  },
   imei(value: string): string | null {
    const imei = value.trim();

    if (!/^\d{15}$/.test(imei)) {
      return "IMEI must contain exactly 15 digits";
    }

    return null;
  },

  firmwareVersion(value: string): string | null {
    if (value.trim().length > 30) {
      return "Firmware version must not exceed 30 characters";
    }

    return null;
  },
  
};
