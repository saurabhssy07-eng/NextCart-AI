import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCart, removeItem, updateItemQuantity, clearCart } from '../store/cartSlice';
import { cartService } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalDiscount, finalPrice } = useSelector((state) => state.cart);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartService.getCart(accessToken);
      if (response.success) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      toast.error('Failed to load cart');
    }
  };

  const handleUpdateQuantity = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId, variantId);
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

      {items.length === 0 ? (
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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3">Product</th>
                    <th className="text-center px-6 py-3">Quantity</th>
                    <th className="text-right px-6 py-3">Price</th>
                    <th className="text-right px-6 py-3">Total</th>
                    <th className="text-center px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.product._id}-${item.variantId || 'base'}`} className="border-t border-border-light dark:border-border-dark">
                      <td className="px-6 py-4">
                        <Link
                          to={`/products/${item.product._id}${item.selectedOptions ? `?${new URLSearchParams(item.selectedOptions).toString()}` : ''}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium block mb-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {Object.entries(item.selectedOptions).map(([key, val]) => (
                              <span key={key} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{key}:</span> {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-center px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.product._id, item.variantId, parseInt(e.target.value))
                          }
                          className="w-16 px-2 py-1 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark rounded text-center focus:ring-1 focus:ring-primary-500"
                        />
                      </td>
                      <td className="text-right px-6 py-4">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="text-right px-6 py-4 font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                      <td className="text-center px-6 py-4">
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.variantId)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                to="/"
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleClearCart}
                className="px-6 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{finalPrice.toLocaleString('en-IN')}</span>
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
