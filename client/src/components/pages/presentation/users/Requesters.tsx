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
  Modal,
  Select,
  message,
  Result,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  MoreOutlined,
  LockOutlined,
  SyncOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useRequesters } from "../../../services/useRequesters";
import { debounce } from "lodash";
import { ENDPOINTS } from "../../../../utils/endpoints";

const { Title, Text } = Typography;
const { Option } = Select;

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
  const {
    fetchAllRequesters,
    resetPassword,
    fetchAllUserRoles,
    syncronizeUsers,
    assignRoleToUser,
    loading,
  } = useRequesters(token);

  const [, setData] = useState<Requester[]>([]);
  const [filteredData, setFilteredData] = useState<Requester[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [syncStatus, setSyncStatus] = useState<{
    type: "success" | "warning" | "error" | null;
    message: string | null;
  }>({
    type: null,
    message: null,
  });
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Requester | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [updateRoleStatus, setUpdateRoleStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
  }>({ status: "idle", message: null });

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
    (async () => {
      const [_, roles] = await Promise.all([fetchData(), fetchAllUserRoles()]);
      console.log("THIS IS THE ROLE: ", roles);
      if (Array.isArray(roles)) {
        setAvailableRoles(roles);
      }
    })();
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

  const handleSynchronizeUsers = async () => {
    setSyncing(true);
    // Clear previous status
    setSyncStatus({ type: null, message: null });

    try {
      const result = await syncronizeUsers();
      console.log("THIS IS NOW THE RESULT: ", result);

      // After synchronization, refresh the data
      fetchData(pagination.current, pagination.pageSize, searchText);

      // Set visible status alert
      if (result && result.success) {
        setSyncStatus({
          type: "success",
          message: result.message || "Users synchronized successfully!",
        });
      } else {
        setSyncStatus({
          type: "warning",
          message:
            result?.message ||
            "Synchronization did not complete. Please try again.",
        });
      }

      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setSyncStatus({ type: null, message: null });
      }, 5000);

      return result;
    } catch (error) {
      console.error("Error synchronizing users:", error);
      setSyncStatus({
        type: "error",
        message: "Failed to synchronize users. Please try again.",
      });

      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setSyncStatus({ type: null, message: null });
      }, 5000);
    } finally {
      setSyncing(false);
    }
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
        }}
      >
        Reset Password
      </Menu.Item>

      <Menu.Item
        key="updateRole"
        icon={<TeamOutlined />}
        onClick={() => {
          setSelectedUser(record);
          setSelectedRole(""); // Reset selected role when opening modal
          setUpdateRoleStatus({ status: "idle", message: null }); // Reset status when opening modal
          setRoleModalVisible(true);
        }}
      >
        Update Role
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

  // Function to close the modal
  const closeModal = () => {
    console.log("Closing modal...");
    setRoleModalVisible(false);
    setUpdateRoleStatus({ status: "idle", message: null });
    setSelectedRole("");
  };
  

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) {
      message.error("Please select a role");
      return;
    }

    try {
      setUpdateRoleStatus({ status: "loading", message: "Updating role..." });

      const response = await assignRoleToUser(selectedUser.id, selectedRole);

      // Check if the response indicates success (status 200)
      if (response) {
        setUpdateRoleStatus({
          status: "success",
          message: `Role successfully updated to ${selectedRole}`,
        });

        // Show success state briefly then close
        setTimeout(() => {
          // Close modal directly
          setRoleModalVisible(false);
          // Reset state
          setUpdateRoleStatus({ status: "idle", message: null });
          setSelectedRole("");
          // Refresh data
          fetchData(pagination.current, pagination.pageSize, searchText);
        }, 1500);
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setUpdateRoleStatus({
        status: "error",
        message: "Failed to update role. Please try again.",
      });
    }
  };

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
          {syncStatus.type && syncStatus.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert
                message={
                  syncStatus.type === "success"
                    ? "Success"
                    : syncStatus.type === "warning"
                    ? "Warning"
                    : "Error"
                }
                description={syncStatus.message}
                type={syncStatus.type}
                showIcon
                closable
                onClose={() => setSyncStatus({ type: null, message: null })}
                className="shadow-md"
              />
            </motion.div>
          )}
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
                <Tooltip title="Synchronize Users">
                  <Button
                    type="primary"
                    icon={<SyncOutlined spin={syncing} />}
                    onClick={handleSynchronizeUsers}
                    loading={syncing}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span>Synchronize Users</span>
                  </Button>
                </Tooltip>
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

      {/* Role Update Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined className="text-blue-500" />
            <span>Update User Role</span>
          </div>
        }
        open={roleModalVisible}
        onCancel={closeModal}
        keyboard={true}
        destroyOnClose={true}
        footer={
          updateRoleStatus.status === "success" ||
          updateRoleStatus.status === "error"
            ? null
            : [
                <Button
                  key="cancel"
                  onClick={closeModal}
                  className="transition-all duration-300 ease-in-out hover:scale-105"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  icon={
                    updateRoleStatus.status === "loading" ? (
                      <LoadingOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  loading={updateRoleStatus.status === "loading"}
                  onClick={handleUpdateRole}
                  disabled={
                    !selectedRole || updateRoleStatus.status === "loading"
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out hover:scale-105 shadow-md"
                >
                  Update Role
                </Button>,
              ]
        }
        centered
        maskClosable={true}
        className="role-update-modal"
        width={500}
        closable={true}
        transitionName="custom-modal-animation"
        maskTransitionName="custom-modal-mask-animation"
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={`modal-content-${updateRoleStatus.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            {updateRoleStatus.status === "success" ? (
              <Result
                status="success"
                title="Role Updated Successfully"
                subTitle={`User ${selectedUser?.username} now has the role of ${selectedRole}`}
                icon={
                  <CheckCircleOutlined className="text-green-500 text-6xl animate-pulse" />
                }
                className="py-6"
              />
            ) : updateRoleStatus.status === "error" ? (
              <Result
                status="error"
                title="Update Failed"
                subTitle={
                  updateRoleStatus.message ||
                  "An error occurred while updating the role"
                }
                icon={<CloseCircleOutlined className="text-red-500 text-6xl" />}
                extra={[
                  <Button
                    type="primary"
                    key="retry"
                    onClick={handleUpdateRole}
                    className="bg-blue-600 hover:bg-blue-700 mr-4 transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    Try Again
                  </Button>,
                  <Button
                    key="cancel"
                    onClick={closeModal}
                    className="transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    Cancel
                  </Button>,
                ]}
                className="py-6"
              />
            ) : (
              <>
                {selectedUser && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <UserOutlined className="text-blue-500" />
                      <Text strong>User:</Text>
                      <Text>{selectedUser.username}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailOutlined className="text-blue-500" />
                      <Text strong>Email:</Text>
                      <Text>{selectedUser.email}</Text>
                    </div>
                  </div>
                )}

                <Divider className="my-4">
                  <Space>
                    <TeamOutlined className="text-gray-400" />
                    <Text type="secondary">Role Selection</Text>
                  </Space>
                </Divider>

                <div className="mb-4">
                  <Text strong className="block mb-2">
                    Select Role:
                  </Text>
                  <Select
                    placeholder="Choose a role"
                    style={{ width: "100%" }}
                    value={selectedRole || undefined}
                    onChange={(value) => setSelectedRole(value)}
                    loading={availableRoles.length === 0}
                    className="w-full transition-all duration-300 hover:shadow-md"
                    size="large"
                    disabled={updateRoleStatus.status === "loading"}
                    showSearch
                    optionFilterProp="children"
                    dropdownClassName="role-select-dropdown"
                  >
                    {availableRoles.map((role) => (
                      <Option key={role} value={role}>
                        <div className="flex items-center gap-2 py-1">
                          <TeamOutlined className="text-blue-500" />
                          <span className="font-medium">{role}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                {updateRoleStatus.status === "loading" && (
                  <div className="mt-8 text-center">
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 36 }} spin />
                      }
                    />
                    <Text className="block mt-3 text-gray-500">
                      {updateRoleStatus.message}
                    </Text>
                  </div>
                )}

                {!selectedRole && updateRoleStatus.status === "idle" && (
                  <Alert
                    message="Please select a role"
                    type="info"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    className="mt-4 shadow-sm"
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </motion.div>
  );
};

export default RequestersTable;
