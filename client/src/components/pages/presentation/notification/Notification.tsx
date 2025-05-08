// components/Notification/Notification.tsx
import React, { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Space,
  Card,
  Collapse,
  Spin,
  Empty,
  Pagination,
  Switch,
} from "antd";
import { motion } from "framer-motion";
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Notification,
  PaginationData,
} from "../../../services/useNotification";
import { useSelector } from "react-redux";

const { Panel } = Collapse;

interface NotificationProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  pagination: PaginationData;
  fetchNotifications: (page: number, size: number) => void;
  fetchUnreadNotifications: (userId: number) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  notifications,
  unreadCount,
  loading,
  pagination,
  fetchNotifications,
  fetchUnreadNotifications,
  markAsRead,
  markAllAsRead,
}) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(["1"]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const handleTableChange = (pagination: any) => {
    fetchNotifications(pagination.current - 1, pagination.pageSize);
  };

  const formatDate = (dateArray: number[]) => {
    const [year, month, day, hour, minute, second, millisecond] = dateArray;
    return dayjs(
      new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        millisecond / 1000000
      )
    ).format("YYYY-MM-DD HH:mm:ss");
  };

  const { user } = useSelector((state: any) => state.auth);

  const columns = [
    {
      title: "Status",
      dataIndex: "read",
      key: "read",
      width: 100,
      render: (read: boolean) => (
        <Badge
          status={read ? "default" : "processing"}
          text={read ? "Read" : "Unread"}
        />
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string, record: Notification) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {formatDate(record.createdAt)}
          </div>
        </motion.div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: any, record: Notification) => (
        <Space size="small">
          {!record.read && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(record.id);
              }}
            >
              Mark as read
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: Notification) => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 bg-gray-50 rounded-lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Request ID:</p>
            <p>{record.requestId || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <Badge
              status={
                record.status === "PENDING"
                  ? "processing"
                  : record.status === "COMPLETED"
                  ? "success"
                  : "error"
              }
              text={record.status || "N/A"}
            />
          </div>
          <div>
            <p className="font-semibold">Created At:</p>
            <p>{formatDate(record.createdAt)}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const toggleUnreadOnly = (checked: boolean) => {
    setShowUnreadOnly(checked);
    if (checked) {
      fetchUnreadNotifications(user.id);
    } else {
      fetchNotifications(0, pagination.size);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BellOutlined className="text-xl mr-2" />
              <span className="text-xl font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  style={{ backgroundColor: "#1890ff", marginLeft: 10 }}
                />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2">Show unread only</span>
                <Switch
                  checked={showUnreadOnly}
                  onChange={toggleUnreadOnly}
                  loading={loading}
                />
              </div>
              {/* <Button
                type="primary"
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || loading}
                icon={<CheckOutlined />}
              >
                Mark all as read
              </Button> */}
            </div>
          </div>
        }
        bordered={false}
        className="shadow-lg rounded-lg overflow-hidden"
      >
        <Collapse
          activeKey={activeKey}
          onChange={(keys) => setActiveKey(keys)}
          ghost
          expandIconPosition="right"
        >
          <Panel
            header={
              <div className="flex items-center">
                <span className="font-medium">Notification List</span>
                {loading && (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 16, marginLeft: 10 }}
                        spin
                      />
                    }
                  />
                )}
              </div>
            }
            key="1"
          >
            <Table
              columns={columns}
              dataSource={notifications}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pagination.number + 1,
                pageSize: pagination.size,
                total: pagination.totalElements,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              onChange={handleTableChange}
              expandable={{
                expandedRowRender,
                expandedRowKeys,
                onExpand: (expanded, record) => {
                  setExpandedRowKeys(expanded ? [record.id] : []);
                },
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      showUnreadOnly
                        ? "No unread notifications"
                        : "No notifications available"
                    }
                  />
                ),
              }}
              className="rounded-lg overflow-hidden"
            />
          </Panel>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default NotificationComponent;
