import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const ActionFeedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'success';
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  const configs = {
    'payment-success': {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Payment Successful',
      message: message || 'Your payment was processed successfully.',
      primaryBtn: { text: 'View Order', action: () => navigate(orderId ? `/orders/${orderId}` : '/orders') },
      secondaryBtn: { text: 'Continue Shopping', link: '/products' }
    },
    'payment-failed': {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Payment Failed',
      message: message || 'We could not process your payment. Please try again.',
      primaryBtn: { text: 'Retry Payment', action: () => navigate(orderId ? `/orders/${orderId}` : '/checkout') },
      secondaryBtn: { text: 'Contact Support', link: '/contact' }
    },
    'review-submitted': {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Review Submitted',
      message: message || 'Thank you for your feedback! Your review has been submitted.',
      primaryBtn: { text: 'Continue Shopping', action: () => navigate('/products') },
      secondaryBtn: null
    },
    'profile-updated': {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Profile Updated',
      message: message || 'Your profile information has been successfully updated.',
      primaryBtn: { text: 'Back to Profile', action: () => navigate('/account/profile') },
      secondaryBtn: null
    },
    'default': {
      icon: <Info className="w-16 h-16 text-blue-500" />,
      title: 'Action Completed',
      message: message || 'Your request has been processed.',
      primaryBtn: { text: 'Go Home', action: () => navigate('/') },
      secondaryBtn: null
    }
  };

  const config = configs[type] || configs['default'];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
        <div className="flex justify-center mb-6">
          {config.icon}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{config.message}</p>
        
        <div className="flex flex-col gap-3">
          {config.primaryBtn && (
            <button
              onClick={config.primaryBtn.action}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
            >
              {config.primaryBtn.text}
            </button>
          )}
          {config.secondaryBtn && (
            <Link
              to={config.secondaryBtn.link}
              className="w-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-lg transition-colors shadow-sm"
            >
              {config.secondaryBtn.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionFeedback;
