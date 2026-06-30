import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ShoppingCart, Star, X } from 'lucide-react';
import { cartService } from '../../services/api';
import { setCart } from '../../store/cartSlice';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { useCurrency } from '../../context/CurrencyContext';

const colorMap = {
  black: '#000000', white: '#ffffff', blue: '#3b82f6', red: '#ef4444',
  green: '#22c55e', yellow: '#eab308', gray: '#6b7280', silver: '#c0c0c0',
  gold: '#ffd700', pink: '#ec4899', purple: '#a855f7'
};

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { formatPrice } = useCurrency();
  
  const [activeImage, setActiveImage] = useState(product?.images?.[0]?.url || product?.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  // Variant matching logic (same as ProductDetails)
  const currentVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(variant => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => variant.attributes[key] === value
      );
    }) || null;
  }, [product, selectedOptions]);

  const totalVariantStock = product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const currentStock = currentVariant 
    ? currentVariant.stock 
    : (product?.hasVariants ? totalVariantStock : (product?.stock ?? 0));
    
  const currentPrice = currentVariant ? currentVariant.price : (product?.discountPrice || product?.price);
  const originalPrice = product?.price;
  
  // Available option values based on selected options
  const getAvailableValues = (attributeName) => {
    if (!product?.variants) return [];
    
    // If we're selecting the first option, show all available values for it
    const otherSelectedOptions = { ...selectedOptions };
    delete otherSelectedOptions[attributeName];
    
    // Find variants that match all OTHER selected options
    const matchingVariants = product.variants.filter(variant => {
      return Object.entries(otherSelectedOptions).every(
        ([key, value]) => variant.attributes[key] === value
      );
    });
    
    // Get unique values for this attribute from the matching variants
    return [...new Set(matchingVariants.map(v => v.attributes[attributeName]))];
  };

  const handleOptionSelect = (attributeName, value) => {
    setSelectedOptions(prev => ({ ...prev, [attributeName]: value }));
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.hasVariants && !currentVariant) {
      toast.warning('Please select all options before adding to cart');
      return;
    }

    setIsAdding(true);
    try {
      const response = await cartService.addToCart(
        product._id,
        quantity,
        currentVariant ? currentVariant._id : null,
        currentVariant ? selectedOptions : null
      );
      
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Added to cart');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick View" className="max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
            <img 
              src={activeImage} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img.url 
                      ? 'border-primary-500 shadow-md' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2">
            <Badge variant="primary" className="mb-2">{product.category?.name || 'Category'}</Badge>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-bold">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="text-gray-500 text-sm">
              ({product.ratings?.count || 0} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice > currentPrice && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded-md">
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-3">
            {product.description}
          </p>

          <div className="my-6 w-full h-px bg-gray-200 dark:bg-gray-700"></div>

          {/* Variants Selection */}
          {product.hasVariants && product.attributes && product.attributes.map((attr) => (
            <div key={attr.name} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {attr.name}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {selectedOptions[attr.name] || 'Select one'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((val) => {
                  const isSelected = selectedOptions[attr.name] === val;
                  const isAvailable = getAvailableValues(attr.name).includes(val);
                  
                  if (attr.name.toLowerCase() === 'color') {
                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(attr.name, val)}
                        disabled={!isAvailable}
                        className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-all ${
                          isSelected ? 'border-primary-500 scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'
                        } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: colorMap[val.toLowerCase()] || val }}
                        title={val}
                      />
                    );
                  }

                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(attr.name, val)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 border rounded-xl font-medium transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${!isAvailable ? 'opacity-30 cursor-not-allowed bg-gray-50 dark:bg-gray-800 line-through' : ''}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity & Actions */}
          <div className="mt-auto pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Quantity</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity >= (currentStock || 1)}
                >+</button>
              </div>
              <span className="text-sm text-gray-500">
                {currentStock > 0 ? (
                  <span className="text-green-600 font-medium">{currentStock} in stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1 py-3 text-lg"
                onClick={handleAddToCart}
                disabled={isAdding || currentStock <= 0 || (product?.hasVariants && !currentVariant)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                className="py-3 px-6"
                onClick={() => {
                  onClose();
                  navigate(`/products/${product._id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
