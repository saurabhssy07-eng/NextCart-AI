import React, { useEffect, useState } from 'react';
import { Bell, Info, Shield, ShoppingBag, CreditCard } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { userService } from '../../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await userService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await userService.markNotificationRead(id);
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('security')) return <Shield className="w-6 h-6 text-blue-500" />;
    if (t.includes('order')) return <ShoppingBag className="w-6 h-6 text-primary-500" />;
    if (t.includes('payment')) return <CreditCard className="w-6 h-6 text-green-500" />;
    return <Info className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        {notifications.length > 0 && (
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12">
          <EmptyState 
            icon={Bell}
            title="No notifications yet"
            subtitle="When you get updates about orders, payments, or reviews, they'll show up here."
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-6 flex items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
            >
              <div className="mt-1">{getIcon(notif.title)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
                  {notif.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notif.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
