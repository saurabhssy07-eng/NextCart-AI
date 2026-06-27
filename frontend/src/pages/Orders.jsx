import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setOrders, setLoading } from '../store/orderSlice';
import { orderService } from '../services/api';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    dispatch(setLoading(true));
    try {
      const response = await orderService.getUserOrders({}, accessToken);
      if (response.success) {
        dispatch(setOrders({
          orders: response.data,
          page: response.pagination.page,
          totalPages: response.pagination.pages,
        }));
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      dispatch(setLoading(false));
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3">Order Number</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-right px-6 py-3">Total</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{order.items.length} item(s)</td>
                  <td className="text-right px-6 py-4 font-semibold">
                    ₹{order.orderSummary.total.toLocaleString('en-IN')}
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;