import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ArrowRight, Layers, ChevronDown } from 'lucide-react';
import { removeFromCompare, clearCompare } from '../../store/compareSlice';
import { useCurrency } from '../../context/CurrencyContext';

const CompareBar = () => {
  const { items } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('compareBarDismissed') === 'true';
  });
  const prevItemsLength = useRef(items.length);

  useEffect(() => {
    localStorage.setItem('compareBarDismissed', isDismissed);
  }, [isDismissed]);

  useEffect(() => {
    if (items.length > prevItemsLength.current) {
      setIsDismissed(false);
    }
    prevItemsLength.current = items.length;
  }, [items.length]);

  // Don't show if empty, dismissed, or already on the compare or ai-shopping page
  if (items.length === 0 || isDismissed || location.pathname === '/compare' || location.pathname === '/ai-shopping') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.2)] transform transition-transform duration-300">
      {/* Close button for the entire bar */}
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute -top-3 -right-2 md:right-4 bg-gray-800 text-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Hide Compare Bar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Items */}
        <div className="flex items-center flex-1 w-full gap-4 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="flex shrink-0 items-center gap-2 mr-4 text-gray-700 dark:text-gray-300">
            <Layers className="w-5 h-5 text-blue-500" />
            <span className="font-bold whitespace-nowrap">Compare ({items.length}/4)</span>
          </div>

          {items.map((item) => (
            <div key={item._id} className="relative shrink-0 flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 w-48 sm:w-56 group">
              <button 
                onClick={() => dispatch(removeFromCompare(item._id))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
              <img src={item.image || item.images?.[0]?.url || 'https://placehold.co/100x100/1a1a1a/ffffff?text=No+Image'} alt={item.name} className="w-10 h-10 object-cover rounded bg-white dark:bg-gray-900" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {[...Array(4 - items.length)].map((_, idx) => (
            <div key={`empty-${idx}`} className="shrink-0 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-48 sm:w-56 h-[60px] bg-gray-50/50 dark:bg-gray-800/50 text-gray-400">
              <span className="text-xs">Add Product</span>
            </div>
          ))}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button 
            onClick={() => dispatch(clearCompare())}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={items.length < 2}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md ${
              items.length >= 2 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Compare Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
