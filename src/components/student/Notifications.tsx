import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/localStorage';
import type { Notification } from '../../types';
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = storage.getNotifications();
    const myNotifications = allNotifications
      .filter((n) => n.userId === user?.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    setNotifications(myNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const allNotifications = storage.getNotifications();
    const updated = allNotifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    storage.setNotifications(updated);
    loadNotifications();
  };

  const markAllAsRead = () => {
    const allNotifications = storage.getNotifications();
    const updated = allNotifications.map((n) =>
      n.userId === user?.id ? { ...n, read: true } : n
    );
    storage.setNotifications(updated);
    loadNotifications();
  };

  const deleteNotification = (notificationId: string) => {
    const allNotifications = storage.getNotifications();
    const filtered = allNotifications.filter((n) => n.id !== notificationId);
    storage.setNotifications(filtered);
    loadNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-600">
            You're all caught up! Check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-md border-l-4 ${
                notification.type === 'success'
                  ? 'border-green-500'
                  : notification.type === 'warning'
                  ? 'border-yellow-500'
                  : 'border-blue-500'
              } p-4 hover:shadow-lg transition-shadow ${
                !notification.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-gray-900 ${
                      !notification.read ? 'font-semibold' : ''
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
