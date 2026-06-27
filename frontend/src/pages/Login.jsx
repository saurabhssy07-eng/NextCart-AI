import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setLoading } from '../store/authSlice';
import { authService } from '../services/api';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^\\S+@\\S+\\.\\S+$/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.password) errors.password = 'Password is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    dispatch(setLoading(true));
    setUnverifiedEmail('');

    try {
      const response = await authService.login(formData);

      if (response.success) {
        dispatch(setUser(response.user));
        toast.success('Login successful!');
        navigate('/');
      } else {
        if (response.requiresVerification) {
          setUnverifiedEmail(formData.email);
        }
        
        // Handle field specific errors from backend
        if (response.errors) {
          const errors = {};
          response.errors.forEach(err => {
            errors[err.field] = err.message;
          });
          setFormErrors(errors);
        }
        
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await authService.resendVerification(unverifiedEmail);
      if (res.success) {
        toast.success('Verification email resent! Check your inbox.');
        setUnverifiedEmail('');
      } else {
        toast.error(res.message || 'Failed to resend');
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h2>

        {unverifiedEmail && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
            <p className="mb-2">Your email address is not verified.</p>
            <button 
              onClick={handleResend} 
              disabled={isResending}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium">Password</label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            />
            {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4 dark:border-gray-600"></span>
          <span className="text-xs text-center text-gray-500 dark:text-gray-400 uppercase">or login with</span>
          <span className="border-b w-1/5 lg:w-1/4 dark:border-gray-600"></span>
        </div>

        <GoogleLoginButton />

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
