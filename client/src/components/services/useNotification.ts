// services/useNotification.ts
import { useState } from "react";
import NotificationRepository from "../../repositories/notification.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface PaginationData {
  content: Notification[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

const useNotification = (token: string) => {
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
        setPagination({
          content: data.content,
          empty: data.empty,
          first: data.first,
          last: data.last,
          number: data.number,
          numberOfElements: data.numberOfElements,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        });
        
        // Calculate unread count
        const unread = data.content.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };




  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
  };
};

export default useNotification;