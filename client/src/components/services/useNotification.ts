// services/useNotification.ts
import { useState } from "react";
import NotificationRepository from "../../repositories/notification.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: number[];
  requestId?: number;
  status?: string;
  userId?: number;
}

export interface PaginationData {
  content: Notification[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  size: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

const useNotification = (token: string, userId: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 0,
    size: 10,
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      offset: 0,
      unpaged: false,
    },
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
  });

  const notificationRepository = new NotificationRepository(token);

  const fetchNotifications = async (page: number = 0, size: number = 10) => {
    setLoading(true);
    try {
      const response = await notificationRepository.getServices(
        `${ENDPOINTS.GET_NOTIFICATIONS}?page=${page}&size=${size}`
      );

      if ((response as AxiosData).status === 200) {
        const data = (response as AxiosData).data;
        setNotifications(data.content);
        setPagination(data as PaginationData);

        // Calculate unread count
        const unread = data.content.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
        return data;
      }
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async (userId: number) => {
    setLoading(true);
    try {
      const response = await notificationRepository.getServices(
        `${ENDPOINTS.GET_UNREAD_NOTIFICATIONS}/${userId}/unread`
      );

      if ((response as AxiosData).status === 200) {
        const data = (response as AxiosData).data;
        setNotifications(data.content);
        setUnreadCount(data.content.length);
        return data;
      }
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await notificationRepository.updateNotification(
        `${ENDPOINTS.MARK_NOTIFICATION_READ}/${notificationId}/read`
      );
      if ((response as AxiosData).status === 200) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      setError(error);
      return error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationRepository.updateService(
        `${ENDPOINTS.MARK_NOTIFICATION_READ}/read`,
        userId,
        {}
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      return response;
    } catch (error) {
      setError(error);
      return error;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotification;
