import React, { useState, useEffect } from 'react';
import { ImageOff, RefreshCw } from 'lucide-react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  skeletonClassName = 'bg-gray-200 dark:bg-gray-800 animate-pulse',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      // We consider it 'loaded' if the fallback loads successfully
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 z-0 ${skeletonClassName}`}></div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-xs">Image unavailable</span>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setHasError(false);
              setImgSrc(src); // Retry
            }}
            className="mt-2 text-primary-500 hover:text-primary-600 flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs shadow-sm"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {!hasError && (
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
