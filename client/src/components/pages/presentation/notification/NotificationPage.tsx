// pages/NotificationsPage.tsx
import React, { useEffect } from "react";
import useNotification from "../../../services/useNotification";
import NotificationComponent from "./Notification";
import { useSelector } from "react-redux";
const NotificationsPage: React.FC = () => {
  // In a real app, you would get these from your auth context or similar

  const { token, user } = useSelector((state: any) => state.auth);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotification(token, user.id);

  useEffect(() => {
    (async () => {
      await Promise.all([fetchNotifications()]);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NotificationComponent
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        pagination={pagination}
        fetchNotifications={fetchNotifications}
        fetchUnreadNotifications={fetchUnreadNotifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
      />
    </div>
  );
};

export default NotificationsPage;
