# Form Validation Hook

A powerful, reusable React hook for form validation with TypeScript support.

## Features

- ✅ **Comprehensive validation**: Support for required fields, min/max length, email format, numeric validation, and custom rules
- ✅ **TypeScript support**: Fully typed with excellent IntelliSense
- ✅ **Flexible validation timing**: Validate on change, blur, or submission
- ✅ **Form state management**: Tracks values, errors, touched state, and overall validity
- ✅ **Easy integration**: Simple API that works with any form inputs
- ✅ **Reusable**: Design pattern that can be used across different components

## Installation

This hook is included in the project. To use it in other projects, copy the following files:
- `src/hooks/useFormValidation.ts`
- `src/validation/validationRules.ts`
- `src/formValidation.ts` (for convenient imports)

## Quick Start

```tsx
import { useFormValidation, required, minLength, isEmail } from './formValidation';

function MyForm() {
  const form = useFormValidation({
    initialValues: {
      name: '',
      email: '',
    },
    validationRules: {
      name: [required(), minLength(2)],
      email: [required(), isEmail()],
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <input
        type="text"
        value={form.values.name || ''}
        onChange={form.handleChange('name')}
        onBlur={form.handleBlur('name')}
      />
      {form.errors.name && form.touched.name && (
        <span>{form.errors.name}</span>
      )}
      
      <input
        type="email"
        value={form.values.email || ''}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
      />
      {form.errors.email && form.touched.email && (
        <span>{form.errors.email}</span>
      )}
      
      <button type="submit" disabled={!form.isValid}>
        Submit
      </button>
    </form>
  );
}
```

## Available Validation Rules

### Built-in Rules

```tsx
import { 
  required, 
  minLength, 
  maxLength, 
  isEmail, 
  isNumeric, 
  min, 
  max 
} from './formValidation';

// Example usage
const validationRules = {
  name: [required('Name is required'), minLength(2, 'Too short')],
  email: [required(), isEmail()],
  age: [required(), isNumeric(), min(18, 'Must be 18+')],
  bio: [maxLength(500, 'Bio too long')],
};
```

### Custom Validation Rules

```tsx
// Create custom validation functions
const passwordMatch = (confirmPassword: string) => (value: string) => {
  return value === confirmPassword ? null : 'Passwords do not match';
};

// Use in validation config
const validationRules = {
  password: [required(), minLength(8)],
  confirmPassword: [required(), passwordMatch(form.values.password)],
};
```

## Hook API

### Options

```tsx
interface UseFormValidationOptions {
  initialValues?: FieldValue;           // Initial form values
  validationRules?: ValidationConfig;   // Validation rules object
  validateOnChange?: boolean;          // Validate when field changes (default: true)
  validateOnBlur?: boolean;           // Validate when field loses focus (default: true)
}
```

### Return Value

```tsx
interface UseFormValidationReturn {
  // State
  values: FieldValue;           // Current form values
  errors: FieldErrors;          // Current validation errors
  touched: FieldTouched;        // Which fields have been interacted with
  isValid: boolean;            // Overall form validity
  isSubmitted: boolean;        // Whether form has been submitted

  // Actions
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string | null) => void;
  setTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => string | null;
  validateForm: () => boolean;
  resetForm: () => void;
  resetField: (name: string) => void;
  
  // Convenience handlers
  handleChange: (name: string) => (event: ChangeEvent) => void;
  handleBlur: (name: string) => () => void;
  handleSubmit: (onSubmit: (values: FieldValue) => void) => (event: FormEvent) => void;
}
```

## Advanced Usage

### Conditional Validation

```tsx
const form = useFormValidation({
  initialValues: { type: 'email', contact: '' },
  validationRules: {
    type: [required()],
    contact: [
      required(),
      (value: string) => {
        if (form.values.type === 'email') {
          return isEmail()(value);
        } else if (form.values.type === 'phone') {
          // Custom phone validation
          return /^\d{10}$/.test(value) ? null : 'Invalid phone number';
        }
        return null;
      }
    ],
  },
});
```

### Dynamic Field Management

```tsx
// Add/remove validation rules dynamically
const addField = (fieldName: string, rules: ValidationRule[]) => {
  form.setValue(fieldName, '');
  // Update validation rules (would need additional state management)
};

// Reset specific field
const clearField = (fieldName: string) => {
  form.resetField(fieldName);
};
```

## Demo

Run the project to see a complete demo:

```bash
npm install
npm run dev
```

The demo includes:
- Name validation (required, minimum length)
- Email validation (required, email format)
- Age validation (required, numeric, minimum value)
- Password validation (required, minimum length)
- Password confirmation (required, must match password)

## TypeScript Support

The hook is fully typed with TypeScript, providing:
- Type safety for form values and errors
- IntelliSense for validation rules
- Type checking for event handlers
- Generic support for custom validation functions

## Browser Support

Works with all modern browsers that support:
- React 16.8+ (hooks)
- ES6+ features (arrow functions, destructuring, etc.)

## License

MIT License