import './App.css';
import { useFormValidation } from './hooks/useFormValidation';
import { required, minLength, email, min, confirmPassword, strongPassword } from './validation/validationRules';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  form: ReturnType<typeof useFormValidation>;
  shouldShowError: (fieldName: string) => boolean;
  min?: string;
}

const FormField = ({ id, label, type, placeholder, form, shouldShowError, min }: FormFieldProps) => (
  <div className="field-group">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      value={String(form.values[id] || '')}
      onChange={form.handleChange(id)}
      onBlur={form.handleBlur(id)}
      className={shouldShowError(id) ? 'error' : ''}
      placeholder={placeholder}
      min={min}
    />
    {shouldShowError(id) && (
      <span className="error-message">{form.errors[id]}</span>
    )}
  </div>
);

function App() {
  const form = useFormValidation({
    initialValues: {
      name: '',
      email: '',
      age: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      name: [required('Name is required'), minLength(2, 'Name must be at least 2 characters')],
      email: [required('Email is required'), email()],
      age: [required('Age is required'), min(18, 'You must be at least 18 years old')],
      password: [required('Password is required'), strongPassword()],
      confirmPassword: [required('Please confirm your password'), confirmPassword()],
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleFormSubmit = (values: Record<string, unknown>) => {
    console.log('Form submitted successfully:', values);
    alert('Form submitted successfully! Check the console for values.');
  };

  const shouldShowError = (fieldName: string): boolean => {
    return !!(form.errors[fieldName] && (form.touched[fieldName] || form.isSubmitted));
  };

  const formFields = [
    { id: 'name', label: 'Name:', type: 'text', placeholder: 'Enter your name' },
    { id: 'email', label: 'Email:', type: 'email', placeholder: 'Enter your email' },
    { id: 'age', label: 'Age:', type: 'number', placeholder: 'Enter your age', min: '0' },
    { id: 'password', label: 'Password:', type: 'password', placeholder: 'Enter your password' },
    { id: 'confirmPassword', label: 'Confirm Password:', type: 'password', placeholder: 'Confirm your password' },
  ];

  return (
    <div className="app">
      <div className="form-container">
        <h1>Form Validation Hook Demo</h1>
        <p>Fill out the form below to test the validation hook:</p>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="demo-form">
          {formFields.map((field) => (
            <FormField
              key={field.id}
              {...field}
              form={form}
              shouldShowError={shouldShowError}
            />
          ))}

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={!form.isValid}>
              Submit Form
            </button>
            <button type="button" onClick={form.resetForm} className="reset-button">
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
