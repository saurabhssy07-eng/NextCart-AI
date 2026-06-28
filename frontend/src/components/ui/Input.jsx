import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
          error 
            ? 'border-danger focus:ring-danger/20 focus:border-danger' 
            : 'border-border-light dark:border-border-dark focus:ring-primary-500/20 focus:border-primary-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
