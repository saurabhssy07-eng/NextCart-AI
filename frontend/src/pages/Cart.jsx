import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCart, removeItem, updateItemQuantity, clearCart, setLoading } from '../store/cartSlice';
import { cartService } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingCart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CartSkeleton } from '../components/ui/LoadingSkeleton';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalDiscount, finalPrice, isLoading } = useSelector((state) => state.cart);
  const { accessToken } = useSelector((state) => state.auth);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    dispatch(setLoading(true));
    try {
      const response = await cartService.getCart(accessToken);
      if (response.success) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateQuantity = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId, variantId);
      return;
    }
    if (newQuantity > 3) {
      toast.warning('Maximum 3 items allowed per order');
      return;
    }

    try {
      const response = await cartService.updateCartItem(productId, newQuantity, variantId);
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Cart updated');
      }
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId, variantId) => {
    try {
      const response = await cartService.removeFromCart(productId, variantId);
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Item removed');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      try {
        const response = await cartService.clearCart(accessToken);
        if (response.success) {
          dispatch(setCart(response.data));
          toast.success('Cart cleared');
        }
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {isLoading ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Start Shopping"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.variantId || 'base'}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-4 relative">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={item.product.image || item.product.images?.[0]?.url || 'https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image'}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x400/1a1a1a/ffffff?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.product._id}${item.selectedOptions ? `?${new URLSearchParams(item.selectedOptions).toString()}` : ''}`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 pr-8"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <span key={key} className="bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300">
                            {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.variantId, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          -
                        </button>
                        <span className="px-2 py-1.5 min-w-[2rem] text-center text-sm font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.variantId, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="flex flex-col items-end">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatPrice(item.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.product._id, item.variantId)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            <div className="flex gap-4 mt-6">
              <Link
                to="/products"
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleClearCart}
                className="px-6 py-2.5 text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items):</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(finalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
