import React, { useState, useEffect } from 'react';
import { WifiOff, ServerCrash } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isBackendReachable, setIsBackendReachable] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleBackendUnreachable = () => setIsBackendReachable(false);
    const handleBackendReachable = () => setIsBackendReachable(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('backend:unreachable', handleBackendUnreachable);
    window.addEventListener('backend:reachable', handleBackendReachable);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('backend:unreachable', handleBackendUnreachable);
      window.removeEventListener('backend:reachable', handleBackendReachable);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-red-600 text-white px-4 py-2 text-center flex items-center justify-center gap-2 font-medium z-50 sticky top-0 shadow-md">
        <WifiOff className="w-5 h-5" />
        No internet connection. Please check your network.
      </div>
    );
  }

  if (!isBackendReachable) {
    return (
      <div className="bg-yellow-600 text-white px-4 py-2 text-center flex items-center justify-center gap-2 font-medium z-50 sticky top-0 shadow-md">
        <ServerCrash className="w-5 h-5" />
        Cannot reach NextCart servers. 
        <button 
          className="underline ml-2 hover:text-gray-200" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
