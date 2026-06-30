import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Star, Sparkles, ChevronRight, ShieldCheck, Truck, RefreshCw, AlertCircle, Lock, Zap } from 'lucide-react';
import { setCurrentProduct, setLoading } from '../store/productSlice';
import { setCart } from '../store/cartSlice';
import { productService, cartService, userService } from '../services/api';
import { setUser } from '../store/authSlice';
import { useCurrency } from '../context/CurrencyContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ProductCardSkeleton } from '../components/ui/LoadingSkeleton';
import ProductCard from '../components/product/ProductCard';
import ReviewSection from '../components/product/ReviewSection';
import AiShoppingAssistant from '../components/product/AiShoppingAssistant';
import { getEstimatedDelivery } from '../utils/dateUtils';

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

const ProductDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { formatPrice } = useCurrency();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(null);
  
  // Variant Selection State
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Sync selectedOptions from URL when product loads or URL changes
  useEffect(() => {
    if (currentProduct?.variants?.length > 0) {
      const initialOptions = {};
      for (const [key, value] of searchParams.entries()) {
        initialOptions[key] = value;
      }
      setSelectedOptions(initialOptions);
    }
  }, [searchParams, currentProduct]);

  const loadProduct = async () => {
    dispatch(setLoading(true));
    try {
      const response = await productService.getProductById(id);
      if (response.success) {
        dispatch(setCurrentProduct(response.data));
        setActiveImage(response.data.image || response.data.images?.[0]?.url);
        
        // Setup initial default variants if not in URL
        if (response.data.variants?.length > 0 && Array.from(searchParams.entries()).length === 0) {
          const defaultVariant = response.data.variants.find(v => v.isDefault) || response.data.variants[0];
          if (defaultVariant && defaultVariant.attributes) {
            setSearchParams(defaultVariant.attributes, { replace: true });
          }
        }

        try {
          const productData = {
            _id: response.data._id,
            name: response.data.name,
            image: response.data.image || (response.data.images && response.data.images[0]?.url) || 'https://via.placeholder.com/300',
            price: response.data.price,
            discountPrice: response.data.discountPrice,
            rating: response.data.rating,
            reviews: response.data.reviews,
            category: response.data.category,
            brand: response.data.brand
          };
          let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
          viewed = viewed.filter(p => p._id !== productData._id);
          viewed.unshift(productData);
          if (viewed.length > 10) viewed.pop();
          localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
        } catch (e) {
          console.error('Error saving recently viewed', e);
        }
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOptionSelect = (attributeName, value) => {
    const newOptions = { ...selectedOptions, [attributeName]: value };
    setSelectedOptions(newOptions);
    setSearchParams(newOptions, { replace: true });
    setQuantity(1); // reset quantity on variant change
  };

  // Derive all unique attributes and their possible values
  const availableAttributes = useMemo(() => {
    if (!currentProduct?.variants) return {};
    const attrs = {};
    currentProduct.variants.forEach(variant => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    Object.keys(attrs).forEach(key => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [currentProduct]);

  // Derive the selected variant based on current options
  const selectedVariant = useMemo(() => {
    if (!currentProduct?.variants) return null;
    return currentProduct.variants.find(variant => {
      if (!variant.attributes) return false;
      return Object.keys(availableAttributes).every(
        key => variant.attributes[key] === selectedOptions[key]
      );
    });
  }, [currentProduct, selectedOptions, availableAttributes]);

  // Update active image if variant changes and has its own image
  useEffect(() => {
    if (selectedVariant?.images?.[0]?.url) {
      setActiveImage(selectedVariant.images[0].url);
    }
  }, [selectedVariant]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (currentProduct.variants?.length > 0 && !selectedVariant) {
      toast.error('Please select all options before adding to cart');
      return false;
    }

    try {
      const response = await cartService.addToCart(
        id, 
        quantity, 
        selectedVariant?._id || null, 
        selectedVariant?.attributes || null
      );
      
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Added to cart!');
        return true;
      } else {
        toast.error(response.message || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      navigate('/checkout');
    }
  };

  const handleToggleWishlist = async (productId) => {
    const targetId = typeof productId === 'string' ? productId : id;
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      // We keep wishlist product-level as requested
      const res = await userService.toggleWishlist(targetId);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(res.message);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductCardSkeleton />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return <div className="container mx-auto px-4 py-12 text-center text-xl font-medium">Product not found</div>;
  }

  const isWishlisted = user?.wishlist?.some(item => 
    (typeof item === 'string' ? item : item._id) === currentProduct._id
  );
  
  // Dynamic Display Values
  const displayPrice = selectedVariant ? (selectedVariant.compareAtPrice || selectedVariant.price) : currentProduct.price;
  const displayDiscountPrice = selectedVariant ? selectedVariant.price : currentProduct.discountPrice;
  const displayStock = selectedVariant ? selectedVariant.stock : currentProduct.stock;
  const displaySku = selectedVariant?.sku || currentProduct.sku;

  const hasDiscount = displayDiscountPrice && displayDiscountPrice < displayPrice;
  const finalPrice = hasDiscount ? displayDiscountPrice : displayPrice;

  const allOptionsSelected = Object.keys(availableAttributes).every(key => selectedOptions[key]);
  const canAddToCart = (currentProduct.variants?.length > 0 ? (allOptionsSelected && selectedVariant && displayStock > 0) : displayStock > 0);

  // Collect all images for the gallery
  let galleryImages = [];
  if (currentProduct.image) galleryImages.push(currentProduct.image);
  if (currentProduct.images?.length > 0) {
    galleryImages = [...galleryImages, ...currentProduct.images.map(img => img.url)];
  }
  if (currentProduct.variants?.length > 0) {
    currentProduct.variants.forEach(v => {
      if (v.images?.length > 0) {
        galleryImages = [...galleryImages, ...v.images.map(img => img.url)];
      }
    });
  }
  galleryImages = [...new Set(galleryImages)]; // deduplicate
  if (galleryImages.length === 0) galleryImages.push('https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image');

  const mainImageUrl = activeImage || galleryImages[0];

  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter(p => p._id !== id).slice(0, 4);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-4">
        <div className="container max-w-[1400px] mx-auto px-4 flex items-center text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-primary-600">Home</button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <button onClick={() => navigate('/products')} className="hover:text-primary-600">
            {currentProduct.category?.name || 'Category'}
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-gray-200 truncate max-w-[200px]">{currentProduct.name}</span>
        </div>
      </div>

      <div className="container max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 md:p-10 shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Image Gallery */}
            <div className="lg:col-span-6 flex flex-col md:flex-row-reverse gap-4">
              
              {/* Main Image */}
              <div className="relative flex-1 w-full max-w-[700px]">
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform border border-border-light dark:border-border-dark"
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`} />
                </button>
                
                <div className="group aspect-[4/5] md:aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-border-light dark:border-border-dark mb-4 flex items-center justify-center p-6 shadow-sm">
                  <img
                    src={mainImageUrl}
                    alt={currentProduct.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-[1.35] cursor-crosshair"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image';
                    }}
                  />
                </div>
              </div>
              
              {/* Vertical Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto p-1 hide-scrollbar w-full md:w-24 shrink-0 max-h-[600px]">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      onMouseEnter={() => setActiveImage(img)}
                      className={`relative w-20 h-20 md:w-full md:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-primary-600 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover bg-white" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-6 flex flex-col">
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                {currentProduct.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div 
                  className="flex items-center gap-1 cursor-pointer group" 
                  onClick={() => {
                    setActiveTab('reviews');
                    window.scrollBy({ top: 400, behavior: 'smooth' });
                  }}
                >
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white ml-2">{currentProduct.rating || '4.5'}</span>
                  <span className="text-gray-500 group-hover:text-primary-600 transition-colors ml-1 underline decoration-dashed underline-offset-4">({currentProduct.reviews || 167} Reviews)</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sold by</span>
                  <span className="font-semibold text-primary-600">NextCart Official</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                <span className="text-sm text-gray-500">SKU: {displaySku || 'N/A'}</span>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                <span className={`font-medium flex items-center gap-1 ${displayStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {displayStock > 0 ? <><ShieldCheck className="w-4 h-4" /> In Stock</> : <><AlertCircle className="w-4 h-4"/> Out of Stock</>}
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {formatPrice(finalPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through mb-1">
                      {formatPrice(displayPrice)}
                    </span>
                  )}
                  {hasDiscount && (
                    <Badge variant="danger" className="ml-2 mb-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                      {Math.round(((displayPrice - displayDiscountPrice)/displayPrice)*100)}% OFF
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Variants Selector UI */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="space-y-6 mb-8 py-6 border-y border-border-light dark:border-border-dark">
                  {Object.entries(availableAttributes).map(([attrName, values]) => {
                    const isColor = attrName.toLowerCase() === 'color';
                    
                    return (
                      <div key={attrName}>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex justify-between">
                          <span>{attrName}</span>
                          <span className="text-primary-600 font-medium normal-case">
                            {selectedOptions[attrName] ? (
                              <span className="flex items-center gap-2">
                                {isColor && <div className="w-3 h-3 rounded-full border border-gray-300" style={{backgroundColor: colorMap[selectedOptions[attrName].toLowerCase()] || selectedOptions[attrName]}} />}
                                {selectedOptions[attrName]} <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="text-gray-400 font-normal">Please select</span>
                            )}
                          </span>
                        </h4>
                        
                        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={`Select ${attrName}`}>
                          {values.map(value => {
                            const isSelected = selectedOptions[attrName] === value;
                            
                            if (isColor) {
                              const cssColor = colorMap[value.toLowerCase()] || value;
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleOptionSelect(attrName, value)}
                                  role="radio"
                                  aria-checked={isSelected}
                                  aria-label={`${value} color`}
                                  className={`w-12 h-12 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center justify-center ${
                                    isSelected ? 'border-primary-600 scale-110 shadow-md ring-primary-500 ring-2 ring-offset-2' : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: cssColor }}
                                  title={value}
                                >
                                  {isSelected && <span className={`w-3 h-3 rounded-full ${['white', 'yellow', 'silver'].includes(value.toLowerCase()) ? 'bg-black' : 'bg-white'}`}></span>}
                                </button>
                              );
                            }
                            
                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionSelect(attrName, value)}
                                role="radio"
                                aria-checked={isSelected}
                                className={`min-w-[4rem] px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                  isSelected 
                                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 ring-1 ring-primary-600' 
                                    : 'border-border-light dark:border-border-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                {value} {isSelected && '✓'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {!allOptionsSelected && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      <AlertCircle className="w-4 h-4" /> Please select all options to purchase.
                    </p>
                  )}
                  {allOptionsSelected && !selectedVariant && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      <AlertCircle className="w-4 h-4" /> This specific combination is currently unavailable.
                    </p>
                  )}
                </div>
              )}

              {/* Estimated Delivery */}
              <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30 mb-6 flex items-center gap-4">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                  <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">Estimated Delivery</p>
                  <p className="font-bold text-gray-900 dark:text-white">Arrives: {getEstimatedDelivery()}</p>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border-light dark:border-border-dark rounded-xl h-14 bg-white dark:bg-gray-800 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!canAddToCart}
                    aria-label="Decrease quantity"
                    className="px-5 h-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                  >-</button>
                  <span className="w-12 text-center font-medium text-lg" aria-label="Quantity">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(3, displayStock, quantity + 1))}
                    disabled={!canAddToCart || quantity >= 3}
                    aria-label="Increase quantity"
                    className="px-5 h-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                  >+</button>
                </div>
                
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="flex-1 h-14 text-lg border-2"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  leftIcon={<ShoppingCart className="w-5 h-5" />}
                >
                  Add to Cart
                </Button>

                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg"
                  onClick={handleBuyNow}
                  disabled={!canAddToCart}
                  leftIcon={<Zap className="w-5 h-5" />}
                >
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-border-light dark:border-border-dark mb-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">7 Days Return</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                    <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {/* AI Shopping Assistant Panel */}
        <AiShoppingAssistant 
          productId={currentProduct._id} 
          productRating={currentProduct.rating || 0} 
          isAuthenticated={isAuthenticated} 
        />

        {/* Tabs for Specs, Reviews */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm overflow-hidden mb-12">
          <div className="flex border-b border-border-light dark:border-border-dark overflow-x-auto">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-semibold text-sm capitalize whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? 'text-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {currentProduct.description}
                </p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Technical Specifications</h3>
                <div className="space-y-4">
                  {currentProduct.specifications ? Object.entries(currentProduct.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 py-3 border-b border-border-light dark:border-border-dark">
                      <div className="text-gray-500 font-medium">{key}</div>
                      <div className="col-span-2 text-gray-900 dark:text-gray-200">{value}</div>
                    </div>
                  )) : (
                    <p className="text-gray-500">No specifications available for this product.</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <ReviewSection product={currentProduct} />
            )}
          </div>
        </div>

        {/* Recently Viewed / Similar Products */}
        {recentlyViewed.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map(product => (
                <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Check icon component for variant active state
const Check = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ProductDetails;
