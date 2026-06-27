import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import { setUser } from '../store/authSlice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const data = await authService.googleLogin(credentialResponse.credential);
      if (data.success) {
        dispatch(setUser(data.user));
        toast.success(data.message || 'Google Login successful');
        navigate('/');
      } else {
        toast.error(data.message || 'Google Login Failed');
      }
    } catch (err) {
      toast.error('Network error during Google Login');
    }
  };

  const handleError = () => {
    toast.error('Google Login Failed');
  };

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Google sign-in is currently unavailable.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="rectangular"
        size="large"
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
