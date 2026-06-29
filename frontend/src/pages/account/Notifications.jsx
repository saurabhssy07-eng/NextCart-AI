import React from 'react';
import { Bell } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

const Notifications = () => {
  // Since there's no backend model for notifications yet, we'll display a polished empty state.
  // In a real app, you would fetch these from an API.
  const notifications = [];

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
          {notifications.map((notif, index) => (
            <div key={index} className={`p-6 flex items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
              <div className="mt-1">{notif.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
                  {notif.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {notif.time}
                </p>
              </div>
              {!notif.read && (
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
