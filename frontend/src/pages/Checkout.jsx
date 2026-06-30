import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/orderSlice';
import { orderService, cartService, paymentService } from '../services/api';
import { getEstimatedDelivery } from '../utils/dateUtils';
import { Truck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// Indian States list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

// UPI apps list
const UPI_APPS = [
  { id: 'google_pay', name: 'Google Pay', icon: '💚' },
  { id: 'phonepe', name: 'PhonePe', icon: '💜' },
  { id: 'paytm', name: 'Paytm', icon: '💙' },
  { id: 'amazon_pay', name: 'Amazon Pay', icon: '🧡' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳' },
  { id: 'cred', name: 'CRED', icon: '💛' },
  { id: 'other_upi', name: 'Other UPI App', icon: '📱' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, totalDiscount, finalPrice } = useSelector((state) => state.cart);
  const { accessToken, user } = useSelector((state) => state.auth);
  const { formatPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    locality: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    landmark: '',
    phoneNumber: user?.phone || '',
    paymentMethod: 'online', // Default to online
  });

  // Indian banks for net banking
  const INDIAN_BANKS = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'Canara Bank',
    'Union Bank of India',
    'Yes Bank',
    'IndusInd Bank',
    'IDFC First Bank',
  ];

  // Pre-fill from user profile if available
  useEffect(() => {
    if (user?.address) {
      setFormData((prev) => ({
        ...prev,
        street: user.address.street || '',
        locality: user.address.locality || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        landmark: user.address.landmark || '',
        phoneNumber: user.phone || '',
      }));
    }
  }, [user]);

  // Detect location based on zip code (simplified)
  const handleZipCodeChange = (e) => {
    const zipCode = e.target.value;
    setFormData((prev) => ({ ...prev, zipCode }));

    if (zipCode.length === 6) {
      if (zipCode.startsWith('11')) {
        setFormData((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
      } else if (zipCode.startsWith('40') || zipCode.startsWith('41')) {
        setFormData((prev) => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
      } else if (zipCode.startsWith('56')) {
        setFormData((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
      } else if (zipCode.startsWith('70')) {
        setFormData((prev) => ({ ...prev, city: 'Kolkata', state: 'West Bengal' }));
      } else if (zipCode.startsWith('60')) {
        setFormData((prev) => ({ ...prev, city: 'Chennai', state: 'Tamil Nadu' }));
      } else if (zipCode.startsWith('22')) {
        setFormData((prev) => ({ ...prev, city: 'Lucknow', state: 'Uttar Pradesh' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'zipCode') {
      handleZipCodeChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputChange = (e) => {
    handleChange(e);
  };

  const validatePaymentDetails = () => {
    return true; // Payments handled by Razorpay
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      toast.error('Please provide a valid 10-digit phone number');
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        paymentDetails: null, 
      };

      const response = await orderService.createOrder(orderData, accessToken);

      if (response.success) {
        dispatch(clearCart());
        dispatch(addOrder(response.data));
        
        if (formData.paymentMethod !== 'cod' && response.razorpayOrder) {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: response.razorpayOrder.amount,
            currency: response.razorpayOrder.currency,
            name: import.meta.env.VITE_APP_NAME || 'NextCart AI',
            description: 'Order Payment',
            order_id: response.razorpayOrder.id,
            handler: async function (paymentResponse) {
              try {
                const verifyRes = await paymentService.verifyPayment(response.data._id, paymentResponse);
                if (verifyRes.success) {
                  toast.success('Payment successful!');
                  navigate(`/order-success/${response.data._id}`);
                } else {
                  toast.error('Payment verification failed.');
                  navigate(`/orders/${response.data._id}`);
                }
              } catch (err) {
                toast.error('Payment verification error.');
                navigate(`/orders/${response.data._id}`);
              }
            },
            prefill: {
              name: `${user?.firstName || ''} ${user?.lastName || ''}`,
              email: user?.email,
              contact: formData.phoneNumber,
            },
            notes: {
              orderType: formData.paymentMethod
            },
            theme: {
              color: '#2563EB',
            },
            modal: {
              ondismiss: function () {
                toast.warning('Payment was not completed. You can retry from your orders page.');
                navigate(`/orders/${response.data._id}`);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', function (errResp) {
            toast.error(errResp.error.description);
          });

          rzp.open();
        } else {
          toast.success('Order placed successfully!');
          navigate(`/order-success/${response.data._id}`);
        }
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                📍 Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="street"
                  placeholder="House No., Building Name, Street Address *"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
                <input
                  type="text"
                  name="locality"
                  placeholder="Locality / Area Name"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="">Select State *</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="PIN Code *"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark (optional)"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (10 digits) *"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>💳</span> Payment Method
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'online' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">Pay Online Securely</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cards, UPI, Net Banking</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive the order</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing...
                </span>
              ) : (
                <span>
                  {formData.paymentMethod === 'cod' ? '🔒 Place Order' : `💳 Pay ${formatPrice(finalPrice)}`}
                </span>
              )}
            </button>
            {formData.paymentMethod !== 'cod' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                <span className="opacity-75">Secured by</span>
                <div className="flex items-center gap-1 font-bold text-[#3395FF]">
                  Razorpay
                </div>
                <div className="flex gap-1 ml-2 text-xl opacity-60">
                  <span>📱</span>
                  <span>💳</span>
                  <span>🏦</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📋 Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax (GST included)</span>
                <span>Included</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatPrice(finalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-4 bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30 flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">Estimated Delivery</p>
                <p className="font-bold text-gray-900 dark:text-white">Arrives: {getEstimatedDelivery()}</p>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>
                  {formData.paymentMethod === 'online' && '💳 Pay Online Securely'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
