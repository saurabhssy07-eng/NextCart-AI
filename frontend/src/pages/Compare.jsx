import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { removeFromCompare, clearCompare } from '../store/compareSlice';
import { cartService } from '../services/api';
import { toast } from 'react-toastify';
import EmptyState from '../components/ui/EmptyState';
import OptimizedImage from '../components/ui/OptimizedImage';
import { useCurrency } from '../context/CurrencyContext';

const Compare = () => {
  const { items } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <button onClick={() => navigate('/products')} className="flex items-center text-blue-600 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12">
          <EmptyState 
            icon={Sparkles}
            title="Nothing to compare"
            subtitle="Add products to compare their features, prices, and specifications."
            actionText="Browse Products"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <button onClick={() => navigate('/products')} className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Compare Products
            <span className="text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{items.length} items</span>
          </h1>
        </div>
        <button 
          onClick={() => dispatch(clearCompare())}
          className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 w-48 min-w-[150px]">
                <span className="text-gray-500 font-medium">Features</span>
              </th>
              {items.map(item => (
                <th key={item._id} className="p-6 border-b border-l border-gray-200 dark:border-gray-700 min-w-[250px] relative group align-top">
                  <button 
                    onClick={() => dispatch(removeFromCompare(item._id))}
                    className="absolute top-4 right-4 p-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <OptimizedImage 
                      src={item.image || item.images?.[0]?.url || 'https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image'} 
                      alt={item.name} 
                      className="w-32 h-32 object-contain mb-4 bg-white rounded-lg mix-blend-multiply dark:mix-blend-normal" 
                    />
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">{formatPrice(item.price)}</p>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
              {/* Fill remaining slots if less than 4 */}
              {[...Array(4 - items.length)].map((_, idx) => (
                <th key={`empty-${idx}`} className="p-6 border-b border-l border-gray-200 dark:border-gray-700 min-w-[250px] bg-gray-50/30 dark:bg-gray-900/30">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Add Product</p>
                    <button onClick={() => navigate('/products')} className="mt-2 text-sm text-blue-600 hover:underline">Browse</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-medium text-gray-900 dark:text-white">Brand</td>
              {items.map(item => (
                <td key={item._id} className="p-4 border-b border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                  {item.brand || '-'}
                </td>
              ))}
              {[...Array(4 - items.length)].map((_, idx) => <td key={`empty-brand-${idx}`} className="p-4 border-b border-l border-gray-200 dark:border-gray-700"></td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-medium text-gray-900 dark:text-white">Category</td>
              {items.map(item => (
                <td key={item._id} className="p-4 border-b border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {item.category?.name || item.category || '-'}
                </td>
              ))}
              {[...Array(4 - items.length)].map((_, idx) => <td key={`empty-cat-${idx}`} className="p-4 border-b border-l border-gray-200 dark:border-gray-700"></td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-medium text-gray-900 dark:text-white">Rating</td>
              {items.map(item => (
                <td key={item._id} className="p-4 border-b border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{item.averageRating || 0}</span>
                    <span className="text-gray-400 text-sm">({item.numReviews || 0})</span>
                  </div>
                </td>
              ))}
              {[...Array(4 - items.length)].map((_, idx) => <td key={`empty-rate-${idx}`} className="p-4 border-b border-l border-gray-200 dark:border-gray-700"></td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-medium text-gray-900 dark:text-white">Availability</td>
              {items.map(item => (
                <td key={item._id} className="p-4 border-b border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {item.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock ({item.stock})</span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  )}
                </td>
              ))}
              {[...Array(4 - items.length)].map((_, idx) => <td key={`empty-stock-${idx}`} className="p-4 border-b border-l border-gray-200 dark:border-gray-700"></td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-medium text-gray-900 dark:text-white align-top">
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" /> AI Summary
                </div>
              </td>
              {items.map(item => (
                <td key={item._id} className="p-4 border-b border-l border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 align-top text-sm">
                  {item.description || 'No description available for this product.'}
                </td>
              ))}
              {[...Array(4 - items.length)].map((_, idx) => <td key={`empty-desc-${idx}`} className="p-4 border-b border-l border-gray-200 dark:border-gray-700"></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
