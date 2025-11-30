// Types for validation
export type ValidationRule<T = any> = (value: T, allValues?: any) => string | null;

// Validation function creators
export const required = (message = 'This field is required'): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    return null;
  };
};

export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    const msg = message || `Must be at least ${min} characters long`;
    if (typeof value === 'string' && value.length < min) {
      return msg;
    }
    return null;
  };
};

export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    const msg = message || `Must be no more than ${max} characters long`;
    if (typeof value === 'string' && value.length > max) {
      return msg;
    }
    return null;
  };
};

export const isEmail = (message = 'Please enter a valid email address'): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    if (typeof value !== 'string') {
      return message;
    }
    
    // Simple email regex - for production, consider using a more robust solution
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  };
};

export const isNumeric = (message = 'Please enter a valid number'): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    if (value === '' || value === null || value === undefined) {
      return null; // Let required() handle empty values
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      return message;
    }
    return null;
  };
};

export const min = (minValue: number, message?: string): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    const msg = message || `Value must be at least ${minValue}`;
    const num = Number(value);
    
    if (!isNaN(num) && num < minValue) {
      return msg;
    }
    return null;
  };
};

export const max = (maxValue: number, message?: string): ValidationRule => {
  return (value: any, _allValues?: any): string | null => {
    const msg = message || `Value must be no more than ${maxValue}`;
    const num = Number(value);
    
    if (!isNaN(num) && num > maxValue) {
      return msg;
    }
    return null;
  };
};

// Password confirmation validation helper
export const confirmPassword = (passwordFieldName: string = 'password', message = 'Passwords do not match'): ValidationRule => {
  return (value: any, allValues?: any): string | null => {
    if (!allValues) {
      return null;
    }
    
    const passwordValue = allValues[passwordFieldName];
    if (value !== passwordValue) {
      return message;
    }
    return null;
  };
};