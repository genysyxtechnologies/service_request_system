import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Input,
  Tag,
  Empty,
  Card,
  Button,
  Tooltip,
  Badge,
  Statistic,
  Row,
  Col,
  DatePicker,
  Spin,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRequestSupervisors } from "../../../services/useRequestSupervisors";
import { useSelector } from "react-redux";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

// Status color mapping for different request statuses
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
};

// Define the interface for the API response
interface ApiResponse {
  content: Array<Record<string, unknown>>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Define the interface for the request data from API
interface RequestData {
  id: number;
  status: string;
  targetDepartmentName: string;
  userDepartmentName: string;
  createdAt: number[];
  // Add other fields as they become available in the API response
  requestData?: string;
  serviceName?: string;
  userName?: string;
  priority?: string;
  attachmentUrl?: string | null;
}

// Define the type for the auth state
interface AuthState {
  token: string;
}

interface RootState {
  auth: AuthState;
}

// Function to format the API response data to match our component needs
const formatRequestData = (apiData: Array<Record<string, unknown>>): RequestData[] => {
  return apiData.map(item => ({
    id: item.id as number,
    status: item.status as string,
    targetDepartmentName: item.targetDepartmentName as string,
    userDepartmentName: item.userDepartmentName as string,
    createdAt: item.createdAt as number[],
    // Set default values for fields not in the API response
    requestData: (item.requestData as string) || `Request #${item.id as number}`,
    serviceName: (item.serviceName as string) || 'Service Request',
    userName: (item.userName as string) || 'User',
    priority: (item.priority as string) || 'Medium',
    attachmentUrl: (item.attachmentUrl as string | null) || null
  }));
};

const Supervisors: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { fetchRequestForSupervisors, loading } = useRequestSupervisors(token);
  
  // Debug loading state
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);

  // State variables
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userDeptFilter, setUserDeptFilter] = useState<string>("ALL");
  const [targetDeptFilter, setTargetDeptFilter] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const { RangePicker } = DatePicker;
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRequestForSupervisors() as ApiResponse;
        if (response && response.content) {
          const formattedData = formatRequestData(response.content);
          setRequests(formattedData);
          setFilteredRequests(formattedData);
          setTotalItems(response.totalElements || formattedData.length);
          
          // Extract unique departments and statuses from the data
          const uniqueDepts = new Set<string>();
          const uniqueStatuses = new Set<string>();
          formattedData.forEach(item => {
            if (item.userDepartmentName) uniqueDepts.add(item.userDepartmentName);
            if (item.targetDepartmentName) uniqueDepts.add(item.targetDepartmentName);
            if (item.status) uniqueStatuses.add(item.status);
          });
          setDepartments(Array.from(uniqueDepts));
          setAvailableStatuses(Array.from(uniqueStatuses));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [currentPage, pageSize]);

  // Calculate statistics
  const pendingCount = requests.filter(
    (req) => req.status === "PENDING"
  ).length;
  const inProgressCount = requests.filter(
    (req) => req.status === "IN_PROGRESS"
  ).length;
  const completedCount = requests.filter(
    (req) => req.status === "COMPLETED"
  ).length;
  const rejectedCount = requests.filter(
    (req) => req.status === "REJECTED"
  ).length;

  // Filter requests based on selected filters
  useEffect(() => {
    let result = [...requests];

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((req) => req.status === statusFilter);
    }

    // Apply user department filter
    if (userDeptFilter !== "ALL") {
      result = result.filter((req) => req.userDepartmentName === userDeptFilter);
    }

    // Apply target department filter
    if (targetDeptFilter !== "ALL") {
      result = result.filter(
        (req) => req.targetDepartmentName === targetDeptFilter
      );
    }

    // Apply search text filter
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(
        (req) =>
          (req.requestData?.toLowerCase().includes(lowerSearchText) || false) ||
          (req.serviceName?.toLowerCase().includes(lowerSearchText) || false) ||
          (req.userName?.toLowerCase().includes(lowerSearchText) || false) ||
          (req.userDepartmentName?.toLowerCase().includes(lowerSearchText) || false) ||
          (req.targetDepartmentName?.toLowerCase().includes(lowerSearchText) || false) ||
          (req.id.toString().includes(lowerSearchText))
      );
    }

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      result = result.filter((req) => {
        // Convert the createdAt array to a Date object
        if (!req.createdAt || !Array.isArray(req.createdAt) || req.createdAt.length < 3) {
          return false;
        }
        
        const [year, month, day, hour, minute, second] = req.createdAt;
        const requestDate = dayjs(new Date(year, month - 1, day, hour || 0, minute || 0, second || 0));
        
        return (
          requestDate.isAfter(dateRange[0]) &&
          requestDate.isBefore(dateRange[1])
        );
      });
    }

    // Update filtered requests
    setFilteredRequests(result);
  }, [requests, statusFilter, userDeptFilter, targetDeptFilter, searchText, dateRange]);

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("ALL");
    setUserDeptFilter("ALL");
    setTargetDeptFilter("ALL");
    setSearchText("");
    setDateRange(null);
  };
  
  // Handle pagination change
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <p className="font-medium text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
            #{id}
          </p>
        </motion.div>
      ),
    },
    {
      title: "Request Details",
      dataIndex: "requestData",
      key: "request",
      render: (text: string | undefined, record: RequestData) => {
        const displayText = text && text.length > 50 ? `${text.substring(0, 50)}...` : text || `Request #${record.id}`;
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <p className="font-medium text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
              {displayText}
            </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">
              {record.serviceName || 'Service Request'}
            </span>
            <span className="text-xs text-gray-400">
              {record.createdAt && Array.isArray(record.createdAt) && record.createdAt.length >= 3 ? 
                dayjs(new Date(record.createdAt[0], record.createdAt[1] - 1, record.createdAt[2])).fromNow() : 
                'Unknown date'}
            </span>
          </div>
        </motion.div>
        );
      },
    },
    {
      title: "User Department",
      dataIndex: "userDepartmentName",
      key: "userDepartmentName",
      render: (text: string | undefined) => {
        const displayText = text || 'N/A';
        return (
          <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
            <span className="text-gray-700">{displayText}</span>
          </motion.div>
        );
      },
    },
    {
      title: "Target Department",
      dataIndex: "targetDepartmentName",
      key: "targetDepartmentName",
      render: (text: string | undefined) => (
        <motion.span whileHover={{ scale: 1.05 }} className="text-gray-600">
          {text || 'N/A'}
        </motion.span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const formattedStatus = status.split("_").join(" ");
        return (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Tag
              className={`px-3 py-1 rounded-full capitalize ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {formattedStatus.toLowerCase()}
            </Tag>
          </motion.div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: RequestData) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="link"
            onClick={() =>
              setSelectedRow(record.id === selectedRow ? null : record.id)
            }
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {record.id === selectedRow ? "Hide Details" : "View Details"}
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <TeamOutlined className="mr-3 text-indigo-600" />
          Supervisor Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage service requests across departments
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm border-l-4 border-yellow-400">
                <Statistic
                  title={
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-2 text-yellow-500" />{" "}
                      Pending
                    </span>
                  }
                  value={pendingCount}
                  valueStyle={{ color: "#d97706" }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm border-l-4 border-blue-400">
                <Statistic
                  title={
                    <span className="flex items-center">
                      <BarChartOutlined className="mr-2 text-blue-500" /> In
                      Progress
                    </span>
                  }
                  value={inProgressCount}
                  valueStyle={{ color: "#3b82f6" }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm border-l-4 border-green-400">
                <Statistic
                  title={
                    <span className="flex items-center">
                      <CheckCircleOutlined className="mr-2 text-green-500" />{" "}
                      Completed
                    </span>
                  }
                  value={completedCount}
                  valueStyle={{ color: "#10b981" }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm border-l-4 border-red-400">
                <Statistic
                  title={
                    <span className="flex items-center">
                      <CloseCircleOutlined className="mr-2 text-red-500" />{" "}
                      Rejected
                    </span>
                  }
                  value={rejectedCount}
                  valueStyle={{ color: "#ef4444" }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-5 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 md:mb-0">
            Service Requests
          </h2>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Input
              placeholder="Search requests..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="md:w-64"
              allowClear
            />

            <Tooltip title="Toggle Filters">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                type={showFilters ? "primary" : "default"}
              >
                Filters
                <Badge
                  count={
                    (statusFilter !== "ALL" ? 1 : 0) +
                    (userDeptFilter !== "ALL" ? 1 : 0) +
                    (targetDeptFilter !== "ALL" ? 1 : 0) +
                    (dateRange !== null ? 1 : 0)
                  }
                  offset={[5, -5]}
                  size="small"
                />
              </Button>
            </Tooltip>

            <Tooltip title="Reset Filters">
              <Button icon={<ReloadOutlined />} onClick={resetFilters} />
            </Tooltip>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value)}
                      className="w-full"
                      placeholder="Filter by status"
                    >
                      <Select.Option value="ALL">All Statuses</Select.Option>
                      {availableStatuses.map((status) => (
                        <Select.Option key={status} value={status}>
                          {status.split("_").join(" ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Department
                    </label>
                    <Select
                      value={userDeptFilter}
                      onChange={(value) => setUserDeptFilter(value)}
                      className="w-full"
                      placeholder="Filter by user department"
                    >
                      <Select.Option value="ALL">All Departments</Select.Option>
                      {departments.map((dept) => (
                        <Select.Option key={dept} value={dept}>
                          {dept}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Department
                    </label>
                    <Select
                      value={targetDeptFilter}
                      onChange={(value) => setTargetDeptFilter(value)}
                      className="w-full"
                      placeholder="Filter by target department"
                    >
                      <Select.Option value="ALL">All Departments</Select.Option>
                      {departments.map((dept) => (
                        <Select.Option key={dept} value={dept}>
                          {dept}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submission Date
                    </label>
                    <RangePicker
                      className="w-full"
                      value={dateRange}
                      onChange={(dates) => setDateRange(dates)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm"
      >
        
         <Spin spinning={loading}>
         <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              onChange: handlePageChange,
              position: ["bottomCenter"],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            rowClassName={(record) =>
              `transition-all duration-200 ${
                selectedRow === record.id ? "bg-indigo-50" : "hover:bg-gray-50"
              }`
            }
            expandable={{
              expandedRowRender: (record) => (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gray-50 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Request Details
                      </h4>
                      <p className="text-gray-600">{record.requestData}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Service Information
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Service:</span>{" "}
                          {record.serviceName}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Priority:</span>{" "}
                          <Tag
                            color={
                              record.priority === "High"
                                ? "red"
                                : record.priority === "Medium"
                                ? "blue"
                                : "green"
                            }
                          >
                            {record.priority}
                          </Tag>
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          {record.status}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Additional Information
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Submitted By:</span>{" "}
                          {record.userName}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">User Department:</span>{" "}
                          {record.userDepartment}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">
                            Target Department:
                          </span>{" "}
                          {record.targetDepartment}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Submitted:</span>{" "}
                          {dayjs(record.submissionDate).format(
                            "MMMM D, YYYY h:mm A"
                          )}
                        </p>
                        {record.attachmentUrl && (
                          <p className="text-gray-600">
                            <span className="font-medium">Attachment:</span>{" "}
                            <a
                              href={record.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View File
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Update Status
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Assign Request
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Add Comment
                    </motion.button>
                  </div>
                </motion.div>
              ),
              rowExpandable: (record) => record.id === selectedRow,
            }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    <span className="text-gray-500">No requests found</span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
         </Spin>
      </motion.div>
    </motion.div>
  );
};

export default Supervisors;
