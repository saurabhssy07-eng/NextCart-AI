import React from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToastContent = ({ title, type = 'success', actionText, onAction, onUndo }) => {
  const navigate = useNavigate();
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
      </div>
      {(actionText || onUndo) && (
        <div className="flex gap-4 ml-8 mt-1">
          {onUndo && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUndo(); toast.dismiss(); }} 
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Undo
            </button>
          )}
          {actionText && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (typeof onAction === 'string') navigate(onAction);
                else if (onAction) onAction();
                toast.dismiss();
              }} 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const notification = {
  success: (title, options = {}) => {
    toast(<ToastContent title={title} type="success" {...options} />, {
      className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg',
      ...options.toastProps
    });
  },
  error: (title, options = {}) => {
    toast(<ToastContent title={title} type="error" {...options} />, {
      className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg',
      ...options.toastProps
    });
  },
  info: (title, options = {}) => {
    toast(<ToastContent title={title} type="info" {...options} />, {
      className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg',
      ...options.toastProps
    });
  }
};
