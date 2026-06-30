import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const RecentlyViewed = () => {
  const [viewedProducts, setViewedProducts] = useState([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setViewedProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recently viewed products', e);
    }
  }, []);

  if (viewedProducts.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Recently Viewed</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {viewedProducts.slice(0, 5).map((product) => (
          <Link 
            key={product._id} 
            to={`/products/${product._id}`}
            className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-square p-4 bg-gray-50 dark:bg-gray-700/50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
