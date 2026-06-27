import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setLoading } from '../store/authSlice';
import { authService } from '../services/api';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First Name is required';
    if (!formData.lastName) errors.lastName = 'Last Name is required';
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^\\S+@\\S+\\.\\S+$/.test(formData.email)) errors.email = 'Invalid email format';

    if (!formData.password) errors.password = 'Password is required';
    else {
      if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])/.test(formData.password)) errors.password = 'Password must contain a lowercase letter';
      else if (!/(?=.*[A-Z])/.test(formData.password)) errors.password = 'Password must contain an uppercase letter';
      else if (!/(?=.*\\d)/.test(formData.password)) errors.password = 'Password must contain a number';
      else if (!/(?=.*[@$!%*?&])/.test(formData.password)) errors.password = 'Password must contain a special character';
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await authService.register(formData);

      if (response.success) {
        dispatch(setUser(response.user));
        toast.success(response.message || 'Registration successful!');
        navigate('/');
      } else {
        if (response.errors) {
          const errors = {};
          response.errors.forEach(err => {
            errors[err.field] = err.message;
          });
          setFormErrors(errors);
        }
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.password ? (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be 8+ chars with uppercase, lowercase, number, and special character.</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.passwordConfirm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{formErrors.passwordConfirm}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4 dark:border-gray-600"></span>
          <span className="text-xs text-center text-gray-500 dark:text-gray-400 uppercase">or register with</span>
          <span className="border-b w-1/5 lg:w-1/4 dark:border-gray-600"></span>
        </div>

        <GoogleLoginButton />

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
