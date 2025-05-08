import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Card,
  Typography,
  Space,
  Button,
  Input,
  Tag,
  Spin,
  Alert,
  Tooltip,
  Empty,
  Dropdown,
  Menu,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  MoreOutlined,
  DownloadOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useRequesters } from "../../../services/useRequesters";
import { debounce } from "lodash";
import { ENDPOINTS } from "../../../../utils/endpoints";
import { toast } from "sonner";

const { Title, Text } = Typography;

interface Requester {
  id: number;
  username: string;
  email: string;
  status?: "active" | "inactive";
}

interface ApiResponse {
  content: Requester[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

const statusColors = {
  active: "green",
  inactive: "red",
};

const RequestersTable: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { fetchAllRequesters, resetPassword, loading, message, error } =
    useRequesters(token);

  const [data, setData] = useState<Requester[]>([]);
  const [filteredData, setFilteredData] = useState<Requester[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchData = async (page = 1, pageSize = 10, search = "") => {
    try {
      setRefreshing(true);
      const response: ApiResponse | any = await fetchAllRequesters(
        `${ENDPOINTS.GET_REQUESTERS}?page=${
          page - 1
        }&size=${pageSize}&search=${search}`
      );

      if (response?.content) {
        setData(response.content);
        setFilteredData(response.content);
        setPagination({
          current: response.pageable.pageNumber + 1,
          pageSize: response.pageable.pageSize,
          total: response.totalElements,
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchData(1, pagination.pageSize, searchValue);
    }, 500),
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleRefresh = () => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const actionMenu = (record: Requester) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<LockOutlined />}
        onClick={async () => {
          await resetPassword(record.id);
          message.isSuccess
            ? toast.success(message.content)
            : toast.error(message.content);
        }}
      >
        Reset Password
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: (
        <Space>
          <IdcardOutlined />
          <span>ID</span>
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: number) => <Tag color="geekblue">#{id}</Tag>,
      sorter: true,
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Username</span>
        </Space>
      ),
      dataIndex: "username",
      key: "username",
      render: (text: string, record: Requester) => (
        <Space>
          <Text strong>{text}</Text>
          {record.status && (
            <Badge
              color={statusColors[record.status]}
              text={record.status}
              className="capitalize"
            />
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: (
        <Space>
          <MailOutlined />
          <span>Email</span>
        </Space>
      ),
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <Tooltip title="Click to email">
          <a
            href={`mailto:${email}`}
            className="text-blue-500 hover:text-blue-700"
          >
            {email}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_: any, record: Requester) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="shadow-xl rounded-2xl border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-6 bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Title level={3} className="mb-0">
                Requesters Management
              </Title>
              <Text type="secondary">
                {pagination.total} requesters in system
              </Text>
            </motion.div>

            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
            >
              <Input
                placeholder="Search requesters..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
              <Space>
                <Tooltip title="Refresh data">
                  <Button
                    icon={<ReloadOutlined spin={refreshing} />}
                    onClick={handleRefresh}
                    loading={refreshing}
                  />
                </Tooltip>
                {/*       <Button icon={<DownloadOutlined />}>Export</Button> */}
                <Button type="primary" icon={<FilterOutlined />}>
                  Filters
                </Button>
              </Space>
            </motion.div>
          </div>
        </div>

        <Spin
          spinning={loading}
          tip="Loading requesters..."
          indicator={<ReloadOutlined spin />}
          className="pt-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`table-${pagination.current}-${searchText}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                rowSelection={rowSelection}
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      Showing {range[0]}-{range[1]} of {total} requesters
                    </Text>
                  ),
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                  className: "px-6 py-3",
                }}
                onChange={handleTableChange}
                scroll={{ x: true }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Text type="secondary">
                          {searchText
                            ? "No matching requesters found"
                            : "No requesters available"}
                        </Text>
                      }
                    />
                  ),
                }}
                className="ant-table-striped"
                rowClassName={(record, index) =>
                  `hover:bg-blue-50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`
                }
              />
            </motion.div>
          </AnimatePresence>
        </Spin>
      </Card>
    </motion.div>
  );
};

export default RequestersTable;
