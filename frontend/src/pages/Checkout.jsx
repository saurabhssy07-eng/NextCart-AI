import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/orderSlice';
import { orderService, cartService } from '../services/api';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    locality: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    phoneNumber: '',
    paymentMethod: 'cod',
  });

  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    // UPI
    upiId: '',
    selectedUpiApp: '',
    // Card
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    // Net Banking
    selectedBank: '',
    // Wallet
    selectedWallet: '',
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  // Wallets
  const WALLETS = [
    { id: 'paytm_wallet', name: 'Paytm Wallet', icon: '💙' },
    { id: 'amazon_pay_wallet', name: 'Amazon Pay Balance', icon: '🧡' },
    { id: 'mobikwik', name: 'MobiKwik', icon: '💚' },
    { id: 'freecharge', name: 'Freecharge', icon: '🔶' },
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
    } else if (name === 'paymentMethod') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setShowPaymentForm(value !== 'cod');
      // Reset payment details
      setPaymentDetails({
        upiId: '',
        selectedUpiApp: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: '',
        selectedBank: '',
        selectedWallet: '',
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const validatePaymentDetails = () => {
    const method = formData.paymentMethod;

    if (method === 'upi') {
      const upiId = paymentDetails.upiId || paymentDetails.selectedUpiApp;
      if (!upiId) {
        toast.error('Please enter UPI ID or select a UPI app');
        return false;
      }
      if (paymentDetails.upiId && !paymentDetails.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g., name@upi)');
        return false;
      }
    }

    if (method === 'credit_card' || method === 'debit_card') {
      const cardClean = paymentDetails.cardNumber.replace(/\s/g, '');
      if (cardClean.length < 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      if (!paymentDetails.cardName) {
        toast.error('Please enter the cardholder name');
        return false;
      }
      if (paymentDetails.cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (paymentDetails.cardCvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }

    if (method === 'net_banking' && !paymentDetails.selectedBank) {
      toast.error('Please select your bank');
      return false;
    }

    if (method === 'wallet' && !paymentDetails.selectedWallet) {
      toast.error('Please select your wallet');
      return false;
    }

    return true;
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

    if (showPaymentForm && !validatePaymentDetails()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        paymentDetails: showPaymentForm ? paymentDetails : null,
      };

      const response = await orderService.createOrder(orderData, accessToken);

      if (response.success) {
        dispatch(clearCart());
        dispatch(addOrder(response.data));
        toast.success('Order placed successfully!');
        navigate(`/orders/${response.data._id}`);
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

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cod': return '💵';
      case 'upi': return '📱';
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'net_banking': return '🏦';
      case 'wallet': return '👛';
      default: return '💳';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
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

            {/* Payment Method Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                💰 Payment Method
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
                  { value: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                  { value: 'debit_card', label: 'Debit Card', icon: '💳', desc: 'All banks' },
                  { value: 'credit_card', label: 'Credit Card', icon: '💳', desc: 'All cards' },
                  { value: 'net_banking', label: 'Net Banking', icon: '🏦', desc: 'All banks' },
                  { value: 'wallet', label: 'Digital Wallet', icon: '👛', desc: 'Paytm, Amazon Pay' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-3xl mb-2">{method.icon}</span>
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{method.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{method.desc}</span>
                    {formData.paymentMethod === method.value && (
                      <span className="absolute top-2 right-2 text-blue-500 text-lg">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Detail Forms */}
            {showPaymentForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {getPaymentIcon(formData.paymentMethod)} Payment Details
                </h2>

                {/* UPI Form */}
                {formData.paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Pay via UPI using any UPI app. Enter your UPI ID or select an app.
                    </p>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setPaymentDetails((prev) => ({ ...prev, selectedUpiApp: app.id, upiId: '' }))}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            paymentDetails.selectedUpiApp === app.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <span className="text-2xl block">{app.icon}</span>
                          <span className="text-xs mt-1 block text-gray-900 dark:text-gray-100">{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      name="upiId"
                      placeholder="Enter UPI ID (e.g., name@upi)"
                      value={paymentDetails.upiId}
                      onChange={handlePaymentDetailChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    />
                    {paymentDetails.selectedUpiApp && !paymentDetails.upiId && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        You'll be redirected to {UPI_APPS.find(a => a.id === paymentDetails.selectedUpiApp)?.name} to complete payment.
                      </p>
                    )}
                  </div>
                )}

                {/* Card Form (Debit & Credit) */}
                {(formData.paymentMethod === 'debit_card' || formData.paymentMethod === 'credit_card') && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enter your {formData.paymentMethod === 'credit_card' ? 'credit' : 'debit'} card details securely.
                    </p>

                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 text-white mb-4 min-h-[180px] relative overflow-hidden shadow-lg">
                      <div className="absolute top-4 right-4 text-2xl">
                        {formData.paymentMethod === 'credit_card' ? '💳' : '🏦'}
                      </div>
                      <div className="mt-8">
                        <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Card Number</p>
                        <p className="text-xl font-mono tracking-wider">
                          {paymentDetails.cardNumber || '•••• •••• •••• ••••'}
                        </p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Card Holder</p>
                          <p className="font-medium">{paymentDetails.cardName || 'Your Name'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Expires</p>
                          <p className="font-medium">{paymentDetails.cardExpiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number (16 digits)"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setPaymentDetails((prev) => ({ ...prev, cardNumber: formatted }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 font-mono"
                    />
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={paymentDetails.cardName}
                      onChange={handlePaymentDetailChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 uppercase"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={paymentDetails.cardExpiry}
                        onChange={(e) => {
                          const formatted = formatExpiry(e.target.value);
                          setPaymentDetails((prev) => ({ ...prev, cardExpiry: formatted }));
                        }}
                        maxLength={5}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <input
                        type="text"
                        name="cardCvv"
                        placeholder="CVV"
                        value={paymentDetails.cardCvv}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setPaymentDetails((prev) => ({ ...prev, cardCvv: cleaned }));
                        }}
                        maxLength={4}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking Form */}
                {formData.paymentMethod === 'net_banking' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select your bank to pay via Net Banking.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {INDIAN_BANKS.map((bank) => (
                        <label
                          key={bank}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentDetails.selectedBank === bank
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedBank"
                            value={bank}
                            checked={paymentDetails.selectedBank === bank}
                            onChange={handlePaymentDetailChange}
                            className="accent-blue-600"
                          />
                          <span className="text-gray-900 dark:text-gray-100 text-sm">{bank}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Digital Wallet Form */}
                {formData.paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select your digital wallet to pay.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {WALLETS.map((wallet) => (
                        <label
                          key={wallet.id}
                          className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentDetails.selectedWallet === wallet.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedWallet"
                            value={wallet.id}
                            checked={paymentDetails.selectedWallet === wallet.id}
                            onChange={handlePaymentDetailChange}
                            className="sr-only"
                          />
                          <span className="text-3xl mb-2">{wallet.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{wallet.name}</span>
                          {paymentDetails.selectedWallet === wallet.id && (
                            <span className="text-blue-500 text-sm mt-1">✓ Selected</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  {formData.paymentMethod === 'cod' ? '🔒 Place Order' : `💳 Pay ₹${finalPrice.toLocaleString('en-IN')}`}
                </span>
              )}
            </button>
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
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
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
                  <span>₹{finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>
                  {formData.paymentMethod === 'cod' && '💵 Pay with cash on delivery'}
                  {formData.paymentMethod === 'upi' && '📱 Pay with UPI'}
                  {formData.paymentMethod === 'credit_card' && '💳 Pay with Credit Card'}
                  {formData.paymentMethod === 'debit_card' && '💳 Pay with Debit Card'}
                  {formData.paymentMethod === 'net_banking' && '🏦 Pay via Net Banking'}
                  {formData.paymentMethod === 'wallet' && '👛 Pay with Digital Wallet'}
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
