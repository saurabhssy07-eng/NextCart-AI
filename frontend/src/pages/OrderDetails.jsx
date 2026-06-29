import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentOrder, setLoading } from '../store/orderSlice';
import { orderService } from '../services/api';
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
      case 'packed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out for delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'returned': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'refunded': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timelineSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  const currentStepIndex = timelineSteps.indexOf(currentOrder.orderStatus);
  
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
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-2">Order {currentOrder.orderNumber}</h1>
            <p className="text-gray-600 mb-6">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            
            {shouldShowTimeline ? (
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
              <div className="mt-4">
                <span className={`px-4 py-2 rounded border font-medium ${getStatusColor(currentOrder.orderStatus)}`}>
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
          </div>

          {/* Cancel Button */}
          {['Pending', 'Confirmed'].includes(currentOrder.orderStatus) && (
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