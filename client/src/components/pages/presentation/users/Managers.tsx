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
  Avatar,
  Badge,
  Modal
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
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CrownOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import useManagers, { Manager } from "../../../services/useManagers";

const { Title, Text } = Typography;

const statusColors = {
  active: 'green',
  inactive: 'red'
};

const roleColors = {
  admin: 'purple',
  manager: 'blue',
  supervisor: 'cyan'
};

const ManagersTable: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { fetchManagers, loading, error } = useManagers(token);
  
  const [data, setData] = useState<Manager[]>([]);
  const [filteredData, setFilteredData] = useState<Manager[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchData = async (page = 1, pageSize = 10, search = "") => {
    try {
      setRefreshing(true);
      const response = await fetchManagers(page - 1, pageSize, search);
      
      if (response?.content) {
        const managersWithStatus = response.content.map(manager => ({
          ...manager,
          status: manager.status || 'active',
          role: manager.role || 'manager'
        }));
        
        setData(managersWithStatus);
        setFilteredData(managersWithStatus);
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

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleRefresh = () => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSubmit = () => {
    // Add your create manager logic here
    setIsCreateModalVisible(false);
    fetchData(); // Refresh the table
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const actionMenu = (record: Manager) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit Manager
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Deactivate
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
          <span>Manager</span>
        </Space>
      ),
      dataIndex: "username",
      key: "username",
      render: (text: string, record: Manager) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text}</div>
            {record.role && (
              <Tag color={roleColors[record.role.toLowerCase()] || 'default'} className="text-xs">
                {record.role}
              </Tag>
            )}
          </div>
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
          <a href={`mailto:${email}`} className="text-blue-500 hover:text-blue-700">
            {email}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={
            <span className="capitalize">
              {status === 'active' ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </span>
          } 
        />
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: any, record: Manager) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: Manager) => (
        <Dropdown overlay={actionMenu(record)} trigger={['click']}>
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
                Managers Dashboard
              </Title>
              <Text type="secondary">
                {pagination.total} managers in system
              </Text>
            </motion.div>

            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
            >
              <Input
                placeholder="Search managers..."
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
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={showCreateModal}
                >
                  Create Manager
                </Button>
              </Space>
            </motion.div>
          </div>

          {/* <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert
                  message="Error loading data"
                  description={error.toString()}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError(null)}
                />
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>

        <Spin 
          spinning={loading} 
          tip="Loading managers..." 
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
                      Showing {range[0]}-{range[1]} of {total} managers
                    </Text>
                  ),
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ['bottomRight'],
                  className: 'px-6 py-3'
                }}
                onChange={handleTableChange}
                scroll={{ x: true }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Text type="secondary">
                          {searchText ? 'No matching managers found' : 'No managers available'}
                        </Text>
                      }
                    />
                  ),
                }}
                className="ant-table-striped"
                rowClassName={(record, index) => 
                  `hover:bg-blue-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }`
                }
              />
            </motion.div>
          </AnimatePresence>
        </Spin>
      </Card>

      {/* Create Manager Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Create New Manager</span>
          </Space>
        }
        visible={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={[
          <Button key="back" onClick={handleCreateCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleCreateSubmit}
            icon={<CheckCircleOutlined />}
          >
            Create Manager
          </Button>,
        ]}
        width={700}
      >
        <div className="p-4">
          <p>Manager creation form would go here with all required fields.</p>
          {/* Add your form components here */}
        </div>
      </Modal>
    </motion.div>
  );
};

export default ManagersTable;