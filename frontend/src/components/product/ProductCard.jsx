import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye, BarChart2, Star } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleCompare } from '../../store/compareSlice';

const colorMap = {
  black: '#000000',
  white: '#ffffff',
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  gray: '#6b7280',
  silver: '#c0c0c0',
  gold: '#ffd700',
  pink: '#ec4899',
  purple: '#a855f7'
};

const ProductCard = ({
  product,
  showWishlist = true,
  showCompare = true,
  showQuickView = true,
  showRating = true,
  showDiscount = true,
  showMoveToCart = false,
  showAddToCart = true,
  compact = false,
  onWishlistToggle,
  onAddToCart,
  onMoveToCart,
  onQuickView,
  onCompare,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Handle case where wishlist is populated (array of objects) or not (array of strings)
  const isWishlisted = user?.wishlist?.some(item => 
    (typeof item === 'string' ? item : item._id) === product._id
  );
  
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare?.items || []);
  const isCompared = compareItems.some(item => item._id === product._id);
  
  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
  const isOutOfStock = product.stock <= 0;

  // Extract unique colors from variants
  let availableColors = [];
  if (product.variants?.length > 0) {
    const colorSet = new Set();
    product.variants.forEach(v => {
      if (v.attributes?.Color) {
        colorSet.add(v.attributes.Color);
      }
    });
    availableColors = Array.from(colorSet);
  }

  return (
    <motion.div
      className={`group relative hover:z-20 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800 flex ${compact ? 'h-40 flex-row' : 'h-[420px] flex-col'}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={`relative shrink-0 ${compact ? 'w-40 h-full' : 'w-full h-[220px]'}`}>
        
        {/* Inner container for clipping image */}
        <div className={`absolute inset-0 bg-gray-50 dark:bg-gray-800/80 overflow-hidden ${compact ? 'rounded-l-xl' : 'rounded-t-xl'}`}>
          <Link to={`/products/${product._id}`} className="block w-full h-full">
            <img
              src={product.image || product.images?.[0]?.url || 'https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image';
              }}
            />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {showDiscount && hasDiscount && (
            <Badge variant="danger">-{discountPercent}%</Badge>
          )}
          {isNew && <Badge variant="success">New</Badge>}
        </div>

        {/* Wishlist Button (Mobile Only) */}
        {showWishlist && (
          <div className="md:hidden">
            <Tooltip content={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"} position="left">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-sm border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-100 dark:border-red-900/30' 
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onWishlistToggle?.(product._id);
                  }}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
            </Tooltip>
          </div>
        )}

        {/* Quick Actions Overlay (Desktop only) */}
        {!compact && (
          <AnimatePresence>
            {isHovered && !isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-2 bottom-2 flex flex-col gap-2 z-10 hidden md:flex"
              >
                {showQuickView && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white text-gray-800 dark:bg-gray-800/90 dark:text-gray-200"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onQuickView) onQuickView(product);
                      else toast.info('Quick View coming in Phase 5.8!');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Quick View
                  </Button>
                )}
                
                <div className="flex gap-2">
                  {showWishlist && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className={`flex-1 rounded-lg bg-white/90 backdrop-blur-sm border hover:bg-white dark:bg-gray-800/90 ${isWishlisted ? 'text-red-500 border-red-200 dark:border-red-900/50' : 'text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onWishlistToggle?.(product._id);
                      }}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} /> Wishlist
                    </Button>
                  )}
                  {showCompare && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className={`flex-1 rounded-lg backdrop-blur-sm border transition-colors ${
                        isCompared 
                          ? 'bg-blue-50/90 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
                          : 'bg-white/90 border-gray-200 hover:bg-white text-gray-700 dark:bg-gray-800/90 dark:border-gray-700 dark:text-gray-200'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onCompare) {
                          onCompare(product);
                        } else {
                          dispatch(toggleCompare(product));
                        }
                      }}
                    >
                      {isCompared ? (
                        <>
                          <span className="w-4 h-4 mr-2 flex items-center justify-center font-bold text-lg">✓</span> 
                          Added
                        </>
                      ) : (
                        <>
                          <BarChart2 className="w-4 h-4 mr-2" /> Compare
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Badge variant="danger" className="text-sm px-3 py-1">Out of Stock</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 flex flex-col ${compact ? 'flex-1 justify-center' : 'flex-1'}`}>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
          {product.category?.name || product.brand}
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors h-10">
            {product.name}
          </h3>
        </Link>

        {showRating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {availableColors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-gray-500">Available in:</span>
            <div className="flex -space-x-1">
              {availableColors.slice(0, 3).map(color => (
                <div 
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                  style={{ backgroundColor: colorMap[color.toLowerCase()] || color }}
                  title={color}
                />
              ))}
              {availableColors.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-400 shadow-sm">
                  +{availableColors.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`${compact ? 'mt-auto' : 'mt-auto pt-2'}`}>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{(hasDiscount ? discountPrice : price).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through mb-0.5">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Add to Cart & Move to Cart */}
        {showMoveToCart && (
          <Button 
            className="w-full mt-3" 
            size="sm"
            onClick={() => onMoveToCart?.(product._id)}
            disabled={isOutOfStock}
          >
            Move to Cart
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
