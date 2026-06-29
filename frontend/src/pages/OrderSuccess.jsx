import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { getEstimatedDelivery } from '../utils/dateUtils';
import { orderService } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id, accessToken);
        if (response.success) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, accessToken]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700 transform transition-all">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {order.paymentMethod === 'cod' ? 'Order Successful' : 'Payment Successful'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
          Thank you for your purchase!
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4">
            <span className="text-gray-500 dark:text-gray-400">Order Number</span>
            <span className="font-bold text-gray-900 dark:text-white">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Package className="w-5 h-5" />
              <span>Estimated Delivery</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {getEstimatedDelivery(order.createdAt)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to={`/orders/${order._id}`}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            View Order <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/products"
            className="w-full block bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
