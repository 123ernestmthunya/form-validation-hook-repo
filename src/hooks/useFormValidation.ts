import { useState, useCallback, useMemo } from 'react';
import type { ValidationRule } from '../validation/validationRules';

// Types for the hook
export type FieldValue = Record<string, unknown>;

export interface FieldErrors {
  [key: string]: string | null;
}

export interface FieldTouched {
  [key: string]: boolean;
}

export interface ValidationConfig {
  [fieldName: string]: ValidationRule[];
}

export interface FormState {
  values: FieldValue;
  errors: FieldErrors;
  touched: FieldTouched;
  isValid: boolean;
  isSubmitted: boolean;
}

export interface FormActions {
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string | null) => void;
  setTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => string | null;
  validateForm: () => boolean;
  resetForm: () => void;
  resetField: (name: string) => void;
  handleChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (name: string) => () => void;
  handleSubmit: (onSubmit: (values: FieldValue) => void) => (event: React.FormEvent) => void;
  getFieldProps: (name: string) => {
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
}

export interface UseFormValidationOptions {
  initialValues?: FieldValue;
  validationRules?: ValidationConfig;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn extends FormState, FormActions {}

export const useFormValidation = (options: UseFormValidationOptions = {}): UseFormValidationReturn => {
  const {
    initialValues = {},
    validationRules = {},
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  // State management
  const [values, setValues] = useState<FieldValue>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouchedState] = useState<FieldTouched>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate a single field
  const validateField = useCallback((name: string, currentValues?: FieldValue): string | null => {
    const fieldRules = validationRules[name];
    const valuesToUse = currentValues || values;
    const fieldValue = valuesToUse[name];

    if (!fieldRules || fieldRules.length === 0) {
      return null;
    }

    // Run through all validation rules for this field
    for (const rule of fieldRules) {
      // Pass all current values to the validation rule for cross-field validation
      const error = rule(fieldValue, valuesToUse);
      if (error) {
        return error;
      }
    }

    return null;
  }, [values, validationRules]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: FieldErrors = {};
    let isFormValid = true;

    // Validate all fields that have rules
    Object.keys(validationRules).forEach((fieldName) => {
      const fieldError = validateField(fieldName, values);
      newErrors[fieldName] = fieldError;
      
      if (fieldError) {
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [validateField, validationRules, values]);

  // Check if form is valid (computed)
  const isValid = useMemo(() => {
    return Object.keys(validationRules).every((fieldName) => {
      const error = validateField(fieldName, values);
      return !error;
    });
  }, [validateField, validationRules, values]);

  // Set field value
  const setValue = useCallback((name: string, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate on change if enabled
    if (validateOnChange) {
      const rules = validationRules[name];
      if (rules) {
        const newValues = { ...values, [name]: value };
        const error = validateField(name, newValues);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    }
  }, [validateField, validateOnChange, validationRules, values, errors]);

  // Set field error
  const setError = useCallback((name: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Set field touched state
  const setTouched = useCallback((name: string, isTouched: boolean) => {
    setTouchedState(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  // Reset entire form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitted(false);
  }, [initialValues]);

  // Reset specific field
  const resetField = useCallback((name: string) => {
    setValues(prev => ({ ...prev, [name]: initialValues[name] || '' }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setTouchedState(prev => ({ ...prev, [name]: false }));
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback((name: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type, checked } = event.target as HTMLInputElement;
      
      // Handle different input types
      let fieldValue: string | number | boolean = value;
      if (type === 'checkbox') {
        fieldValue = checked;
      } else if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      }

      setValue(name, fieldValue);
    };
  }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((name: string) => {
    return () => {
      setTouched(name, true);
      
      // Validate on blur if enabled
      if (validateOnBlur) {
        const error = validateField(name, values);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    };
  }, [setTouched, validateField, validateOnBlur, values]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: FieldValue) => void) => {
    return (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitted(true);

      // Mark all fields as touched
      const allFieldsTouched: FieldTouched = {};
      Object.keys(validationRules).forEach(fieldName => {
        allFieldsTouched[fieldName] = true;
      });
      setTouchedState(allFieldsTouched);

      // Validate form
      const isFormValid = validateForm();

      if (isFormValid) {
        onSubmit(values);
      }
    };
  }, [values, validationRules, validateForm]);

  const getFieldProps = (name: string) => ({
    name,
    value: (values[name] ?? '') as string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(name, e.target.value),
    onBlur: handleBlur(name),
  });

  return {
    // State
    values,
    errors,
    touched,
    isValid,
    isSubmitted,
    
    // Actions
    setValue,
    setError,
    setTouched,
    validateField,
    validateForm,
    resetForm,
    resetField,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  };
};