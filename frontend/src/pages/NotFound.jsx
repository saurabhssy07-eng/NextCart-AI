import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Page not found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" /> Home Page
        </Link>
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        Looking for products? <Link to="/products" className="text-primary-600 hover:underline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default NotFound;
