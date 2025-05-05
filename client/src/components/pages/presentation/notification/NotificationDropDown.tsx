// components/NotificationDropdown.tsx
import { Badge, Dropdown, List, Avatar, Button, Empty } from "antd";
import { IoIosNotifications } from "react-icons/io";
import { motion } from "framer-motion";
import { useEffect } from "react";
import useNotification from "../../../services/useNotification";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  const { token } = useSelector((state: any) => state.auth);
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    pagination,
  } = useNotification(token);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notificationItems = [
    {
      key: "notifications",
      label: (
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
      ),
      children: (
        <div className="w-80 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
              className="p-4"
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${
                    !item.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(item.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.icon || null}
                        icon={!item.icon && <IoIosNotifications />}
                      />
                    }
                    title={
                      <div className="flex justify-between">
                        <span className={!item.read ? "font-semibold" : ""}>
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {dayjs(item.createdAt).fromNow()}
                        </span>
                      </div>
                    }
                    description={
                      <span className={!item.read ? "font-medium" : ""}>
                        {item.message}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          {pagination.totalElements > 10 && (
            <div className="p-2 border-t text-center">
              <Button
                type="link"
                onClick={() =>
                  fetchNotifications(pagination.number + 1, pagination.size)
                }
                disabled={pagination.last || loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: notificationItems }}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="notification-dropdown"
      onOpenChange={(open) => open && fetchNotifications()}
    >
      <motion.div whileHover={{ scale: 1.05 }} className="relative">
        <Badge count={unreadCount} overflowCount={9}>
          <IoIosNotifications className="text-3xl text-[#9C9C9C] hover:text-[#7a7a7a] transition-colors duration-300" />
        </Badge>
      </motion.div>
    </Dropdown>
  );
};

export default NotificationDropdown;