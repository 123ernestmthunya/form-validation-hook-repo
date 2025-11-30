export type ValidationRule = (value: unknown, allValues: Record<string, unknown>) => string | null;

export const required = (message = 'This field is required'): ValidationRule => {
  return (value: unknown): string | null => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    return null;
  };
};

export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: unknown): string | null => {
    const stringValue = String(value || '');
    if (stringValue.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  };
};

export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: unknown): string | null => {
    const stringValue = String(value || '');
    if (stringValue.length > max) {
      return message || `Must be at most ${max} characters`;
    }
    return null;
  };
};

export const pattern = (regex: RegExp, message = 'Invalid format'): ValidationRule => {
  return (value: unknown): string | null => {
    const stringValue = String(value || '');
    if (stringValue && !regex.test(stringValue)) {
      return message;
    }
    return null;
  };
};

export const email = (message = 'Invalid email address'): ValidationRule => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: unknown): string | null => {
    const stringValue = String(value || '');
    if (stringValue && !emailRegex.test(stringValue)) {
      return message;
    }
    return null;
  };
};

export const min = (minValue: number, message?: string): ValidationRule => {
  return (value: unknown): string | null => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue < minValue) {
      return message || `Must be at least ${minValue}`;
    }
    return null;
  };
};

export const max = (maxValue: number, message?: string): ValidationRule => {
  return (value: unknown): string | null => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > maxValue) {
      return message || `Must be at most ${maxValue}`;
    }
    return null;
  };
};

export const match = (fieldName: string, message?: string): ValidationRule => {
  return (value: unknown, allValues: Record<string, unknown>): string | null => {
    if (value !== allValues[fieldName]) {
      return message || `Must match ${fieldName}`;
    }
    return null;
  };
};

// Alias for password confirmation
export const confirmPassword = (message?: string): ValidationRule => {
  return match('password', message || 'Passwords do not match');
};

// Strong password validation
export const strongPassword = (message?: string): ValidationRule => {
  return (value: unknown): string | null => {
    const stringValue = String(value || '');
    
    if (!stringValue) {
      return null; // Let required() handle empty values
    }

    const hasMinLength = stringValue.length >= 8;
    const hasUpperCase = /[A-Z]/.test(stringValue);
    const hasLowerCase = /[a-z]/.test(stringValue);
    const hasNumber = /\d/.test(stringValue);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(stringValue);

    if (!hasMinLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }

    return message || null;
  };
};