import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Package } from 'lucide-react';
import { setOrders, setLoading } from '../store/orderSlice';
import { orderService } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import { OrderSkeleton } from '../components/ui/LoadingSkeleton';

const Orders = () => {
  const navigate = useNavigate();
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
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'shipped': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="My Orders" subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''} found`} />

      {isLoading ? (
        <div className="space-y-4">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="You haven't placed any orders yet"
          description="When you place orders, they will appear here. Track your shipments and view order details."
          actionLabel="Start Shopping"
          onAction={() => navigate('/products')}
        />
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
                    <Badge variant={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
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