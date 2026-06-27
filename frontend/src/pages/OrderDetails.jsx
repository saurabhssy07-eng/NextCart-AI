import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentOrder, setLoading } from '../store/orderSlice';
import { orderService } from '../services/api';

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
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <p className="text-gray-600">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className={`px-4 py-2 rounded font-medium ${getStatusColor(currentOrder.orderStatus)}`}>
                {currentOrder.orderStatus}
              </span>
              {currentOrder.trackingNumber && (
                <div className="text-gray-600">
                  <strong>Tracking:</strong> {currentOrder.trackingNumber}
                </div>
              )}
            </div>
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

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold mb-2">Payment Method</h3>
            <p className="text-gray-600 capitalize">{currentOrder.paymentMethod.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium capitalize">{currentOrder.paymentStatus}</span>
            </p>
          </div>

          {/* Cancel Button */}
          {['pending', 'confirmed'].includes(currentOrder.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              className="w-full px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
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