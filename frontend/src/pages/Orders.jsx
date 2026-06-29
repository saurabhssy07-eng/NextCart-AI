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
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'packed': return 'primary';
      case 'shipped': return 'secondary';
      case 'out for delivery': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'returned': return 'warning';
      case 'refunded': return 'success';
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
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-shadow hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Order #{order.orderNumber}
                    </h3>
                    <Badge variant={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{order.orderSummary.total.toLocaleString('en-IN')}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {order.items.length} Item{order.items.length !== 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;