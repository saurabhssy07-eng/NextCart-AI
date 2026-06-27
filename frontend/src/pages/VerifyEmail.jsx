import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await authService.verifyEmail(token);
        if (data.success) {
          setStatus('success');
          toast.success('Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          toast.error(data.message || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        toast.error('An error occurred during verification');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'verifying' && <h2 className="text-2xl font-bold dark:text-white">Verifying Email...</h2>}
        {status === 'success' && <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>}
        {status === 'error' && <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>}
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {status === 'success' 
            ? 'You will be redirected to login shortly.' 
            : status === 'verifying' 
              ? 'Please wait while we verify your email address.' 
              : 'The token might be expired or invalid. Please request a new link.'}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
