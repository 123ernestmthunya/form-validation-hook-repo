import './App.css';
import { useFormValidation, required, minLength, isEmail, isNumeric, min, confirmPassword } from './formValidation';

function App() {
  // Initialize the form with validation rules
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
      email: [required('Email is required'), isEmail()],
      age: [required('Age is required'), isNumeric(), min(18, 'You must be at least 18 years old')],
      password: [required('Password is required'), minLength(8, 'Password must be at least 8 characters')],
      confirmPassword: [
        required('Please confirm your password'),
        confirmPassword('password'),
      ],
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleFormSubmit = (values: any) => {
    console.log('Form submitted successfully:', values);
    alert('Form submitted successfully! Check the console for values.');
  };

  const shouldShowError = (fieldName: string): boolean => {
    return !!(form.errors[fieldName] && (form.touched[fieldName] || form.isSubmitted));
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>Form Validation Hook Demo</h1>
        <p>Fill out the form below to test the validation hook:</p>
        
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="demo-form">
          {/* Name Field */}
          <div className="field-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={form.values.name || ''}
              onChange={form.handleChange('name')}
              onBlur={form.handleBlur('name')}
              className={shouldShowError('name') ? 'error' : ''}
              placeholder="Enter your name"
            />
            {shouldShowError('name') && (
              <span className="error-message">{form.errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="field-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={form.values.email || ''}
              onChange={form.handleChange('email')}
              onBlur={form.handleBlur('email')}
              className={shouldShowError('email') ? 'error' : ''}
              placeholder="Enter your email"
            />
            {shouldShowError('email') && (
              <span className="error-message">{form.errors.email}</span>
            )}
          </div>

          {/* Age Field */}
          <div className="field-group">
            <label htmlFor="age">Age:</label>
            <input
              id="age"
              type="number"
              value={form.values.age || ''}
              onChange={form.handleChange('age')}
              onBlur={form.handleBlur('age')}
              className={shouldShowError('age') ? 'error' : ''}
              placeholder="Enter your age"
              min="0"
            />
            {shouldShowError('age') && (
              <span className="error-message">{form.errors.age}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="field-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={form.values.password || ''}
              onChange={form.handleChange('password')}
              onBlur={form.handleBlur('password')}
              className={shouldShowError('password') ? 'error' : ''}
              placeholder="Enter your password"
            />
            {shouldShowError('password') && (
              <span className="error-message">{form.errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="field-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.values.confirmPassword || ''}
              onChange={form.handleChange('confirmPassword')}
              onBlur={form.handleBlur('confirmPassword')}
              className={shouldShowError('confirmPassword') ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {shouldShowError('confirmPassword') && (
              <span className="error-message">{form.errors.confirmPassword}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={!form.isValid}
            >
              Submit Form
            </button>
            <button 
              type="button" 
              onClick={form.resetForm}
              className="reset-button"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Form Status */}
        <div className="form-status">
          <h3>Form Status:</h3>
          <p>Form Valid: <span className={form.isValid ? 'valid' : 'invalid'}>{form.isValid ? 'Yes' : 'No'}</span></p>
          <p>Form Submitted: <span className={form.isSubmitted ? 'submitted' : 'not-submitted'}>{form.isSubmitted ? 'Yes' : 'No'}</span></p>
          
          <details>
            <summary>Debug Information</summary>
            <div className="debug-info">
              <h4>Values:</h4>
              <pre>{JSON.stringify(form.values, null, 2)}</pre>
              
              <h4>Errors:</h4>
              <pre>{JSON.stringify(form.errors, null, 2)}</pre>
              
              <h4>Touched:</h4>
              <pre>{JSON.stringify(form.touched, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default App;
