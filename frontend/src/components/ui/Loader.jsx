import React from 'react';

// Small loader for buttons
export const ButtonLoader = ({ className = '' }) => (
  <svg 
    className={`animate-spin h-5 w-5 text-current ${className}`} 
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Medium loader for sections (e.g., forms, checkout step, reviews)
export const SectionLoader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px] text-gray-500 dark:text-gray-400">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-sm font-medium">{text}</p>
  </div>
);

// Fullscreen loader for entire page blocking (e.g., App initialization, Login)
export const FullscreenLoader = ({ text = 'Please wait...' }) => (
  <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center transition-colors">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center min-w-[200px] border border-gray-100 dark:border-gray-700">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mb-4"></div>
      <p className="text-gray-800 dark:text-gray-200 font-medium">{text}</p>
    </div>
  </div>
);
