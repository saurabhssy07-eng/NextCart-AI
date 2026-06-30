import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Sign up using your Google account</p>
        
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Register;
