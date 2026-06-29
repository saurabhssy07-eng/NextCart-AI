import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentOrder, setLoading } from '../store/orderSlice';
import { orderService, paymentService } from '../services/api';
import { getEstimatedDelivery } from '../utils/dateUtils';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    dispatch(setLoading(true));
    try {
      const response = await orderService.getOrderById(id, accessToken);
      if (response.success) {
        dispatch(setCurrentOrder(response.data));
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await orderService.cancelOrder(id, accessToken);
        if (response.success) {
          dispatch(setCurrentOrder(response.data));
          toast.success('Order cancelled successfully');
        } else {
          toast.error(response.message || 'Failed to cancel order');
        }
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const handleRetryPayment = async () => {
    try {
      const response = await paymentService.retryPayment(id);
      
      if (response.success && response.data.razorpayOrderId) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: import.meta.env.VITE_APP_NAME || 'NextCart AI',
          description: 'Order Payment',
          order_id: response.data.razorpayOrderId,
          handler: async function (paymentResponse) {
            try {
              const verifyRes = await paymentService.verifyPayment(id, paymentResponse);
              if (verifyRes.success) {
                toast.success('Payment successful!');
                loadOrder(); // Refresh the order
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
              toast.error('Payment verification error.');
            }
          },
          prefill: {
            name: `${currentOrder.user?.firstName || ''} ${currentOrder.user?.lastName || ''}`,
            email: currentOrder.user?.email,
          },
          theme: { color: '#2563EB' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (errResp) {
          toast.error(errResp.error.description);
        });
        rzp.open();
      } else {
        toast.error('Failed to initiate payment retry');
      }
    } catch (error) {
      console.error('Retry payment error:', error);
      toast.error('Failed to initiate payment retry');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      toast.info('Downloading invoice...', { autoClose: 2000 });
      const blob = await orderService.downloadInvoice(id, accessToken);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${currentOrder.invoiceNumber || currentOrder.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!currentOrder) {
    return <div className="container mx-auto px-4 py-12 text-center">Order not found</div>;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'out for delivery': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'returned': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timelineSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  const normalizedStatus = currentOrder.orderStatus?.charAt(0).toUpperCase() + currentOrder.orderStatus?.slice(1).toLowerCase();
  const currentStepIndex = timelineSteps.indexOf(normalizedStatus);
  
  const isCancelled = currentOrder.orderStatus === 'Cancelled';
  const isReturned = currentOrder.orderStatus === 'Returned';
  const isRefunded = currentOrder.orderStatus === 'Refunded';
  
  const shouldShowTimeline = !isCancelled && !isReturned && !isRefunded;

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/orders')}
        className="text-blue-600 hover:underline mb-8"
      >
        ← Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Retry Payment Banner */}
          {currentOrder.paymentStatus === 'Pending' && currentOrder.paymentMethod !== 'cod' && !isCancelled && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-600 text-xl mr-3">⚠</span>
                  <div>
                    <h3 className="text-yellow-800 font-bold">Payment Pending</h3>
                    <p className="text-sm text-yellow-700 mt-1">Please complete your payment to process this order.</p>
                  </div>
                </div>
                <button
                  onClick={handleRetryPayment}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Retry Payment
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order {currentOrder.orderNumber}</h1>
                <p className="text-gray-600">
                  Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {shouldShowTimeline && ['Pending', 'Confirmed', 'pending', 'confirmed'].includes(currentOrder.orderStatus) && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-white border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={handleDownloadInvoice}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Download Invoice
                </button>
              </div>
            </div>
            
            {currentOrder.timeline && currentOrder.timeline.length > 0 ? (
              <div className="mt-8 mb-4 border-t pt-6">
                <h3 className="font-bold mb-4 text-lg">Order Timeline</h3>
                <div className="space-y-4">
                  {currentOrder.timeline.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mt-1.5 ring-4 ring-primary-50"></div>
                        {index !== currentOrder.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {new Date(event.createdAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : shouldShowTimeline ? (
              <div className="mt-8 mb-4">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentStepIndex / (timelineSteps.length - 1)) * 100)}%` }}
                  ></div>
                  
                  <div className="relative flex justify-between">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isActive = index === currentStepIndex;
                      
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 ${
                            isCompleted ? 'bg-primary-500 border-primary-100 text-white' : 'bg-gray-300 border-white text-transparent'
                          }`}>
                            {isCompleted && <span className="text-[10px]">✓</span>}
                          </div>
                          <span className={`text-xs mt-2 font-medium hidden sm:block ${
                            isActive ? 'text-primary-700 font-bold' : (isCompleted ? 'text-gray-700' : 'text-gray-400')
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 border-t pt-4">
                <span className={`px-4 py-2 rounded border font-medium inline-block mt-2 ${getStatusColor(currentOrder.orderStatus)}`}>
                  {currentOrder.orderStatus}
                </span>
              </div>
            )}
            
            {currentOrder.trackingNumber && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-gray-700 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Tracking Number</span>
                  <strong className="font-mono text-lg">{currentOrder.trackingNumber}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Product</th>
                  <th className="text-center px-4 py-2">Quantity</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item) => (
                  <tr key={item.product._id} className="border-t">
                    <td className="px-4 py-2">{item.product.name}</td>
                    <td className="text-center px-4 py-2">{item.quantity}</td>
                    <td className="text-right px-4 py-2">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="text-right px-4 py-2">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p>{currentOrder.shippingAddress.street}</p>
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}{' '}
                {currentOrder.shippingAddress.zipCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
              {currentOrder.shippingAddress.phoneNumber && (
                <p>{currentOrder.shippingAddress.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{currentOrder.orderSummary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {currentOrder.orderSummary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{currentOrder.orderSummary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{currentOrder.orderSummary.tax.toLocaleString('en-IN')}</span>
              </div>
              {currentOrder.orderSummary.shipping > 0 && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{currentOrder.orderSummary.shipping.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{currentOrder.orderSummary.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-primary-50 p-6 rounded-lg shadow-md border border-primary-100">
            <h3 className="font-bold mb-2 text-primary-900">Delivery Estimate</h3>
            <p className="text-primary-800 font-medium text-lg">
              {['Delivered', 'Cancelled', 'Returned', 'Refunded'].includes(currentOrder.orderStatus) 
                ? 'Delivery Completed / Cancelled' 
                : `Arrives: ${getEstimatedDelivery(currentOrder.createdAt)}`} 
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold mb-2">Payment Method</h3>
            <p className="text-gray-600 capitalize">{currentOrder.paymentMethod.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium capitalize">{currentOrder.paymentStatus}</span>
            </p>
            {['Pending', 'Failed'].includes(currentOrder.paymentStatus) && currentOrder.paymentMethod !== 'cod' && (
              <button
                onClick={handleRetryPayment}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Retry Payment
              </button>
            )}
          </div>

          {/* Cancel Button */}
          {['Pending', 'Confirmed', 'pending', 'confirmed'].includes(currentOrder.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              className="w-full px-4 py-3 text-red-600 font-medium border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;