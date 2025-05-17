import React, { useState, useEffect } from "react";
import { 
  Table, 
  Select, 
  Input, 
  Tag, 
  Spin, 
  Empty, 
  Card, 
  Button, 
  Tooltip, 
  Badge, 
  Statistic, 
  Row, 
  Col, 
  DatePicker
} from "antd";
import { 
  FilterOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  BarChartOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined, 
  TeamOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

// Status color mapping
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

// Static departments data
const departments = [
  { id: 1, name: "Information Technology" },
  { id: 2, name: "Human Resources" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Operations" },
  { id: 6, name: "Customer Service" },
];

// Static mock data for service requests
const mockRequests = [
  {
    id: 1,
    requestData: "Need new laptop for development work",
    serviceName: "Hardware Request",
    status: "PENDING",
    submissionDate: "2025-05-15T10:30:00",
    userName: "John Doe",
    userDepartment: "Information Technology",
    targetDepartment: "Information Technology",
    priority: "High",
    attachmentUrl: null,
  },
  {
    id: 2,
    requestData: "Request for annual leave approval",
    serviceName: "Leave Request",
    status: "APPROVED",
    submissionDate: "2025-05-14T14:20:00",
    userName: "Jane Smith",
    userDepartment: "Human Resources",
    targetDepartment: "Human Resources",
    priority: "Medium",
    attachmentUrl: "https://example.com/attachment1.pdf",
  },
  {
    id: 3,
    requestData: "Budget approval for Q3 marketing campaign",
    serviceName: "Budget Approval",
    status: "IN_PROGRESS",
    submissionDate: "2025-05-13T09:15:00",
    userName: "Robert Johnson",
    userDepartment: "Marketing",
    targetDepartment: "Finance",
    priority: "High",
    attachmentUrl: "https://example.com/attachment2.xlsx",
  },
  {
    id: 4,
    requestData: "New software license for design team",
    serviceName: "Software Request",
    status: "COMPLETED",
    submissionDate: "2025-05-12T16:45:00",
    userName: "Emily Davis",
    userDepartment: "Marketing",
    targetDepartment: "Information Technology",
    priority: "Medium",
    attachmentUrl: null,
  },
  {
    id: 5,
    requestData: "Office equipment repair",
    serviceName: "Maintenance",
    status: "REJECTED",
    submissionDate: "2025-05-11T11:30:00",
    userName: "Michael Wilson",
    userDepartment: "Operations",
    targetDepartment: "Operations",
    priority: "Low",
    attachmentUrl: "https://example.com/attachment3.jpg",
  },
  {
    id: 6,
    requestData: "New employee onboarding",
    serviceName: "Onboarding",
    status: "PENDING",
    submissionDate: "2025-05-10T13:20:00",
    userName: "Sarah Brown",
    userDepartment: "Human Resources",
    targetDepartment: "Information Technology",
    priority: "High",
    attachmentUrl: null,
  },
  {
    id: 7,
    requestData: "Customer refund processing",
    serviceName: "Refund Request",
    status: "IN_PROGRESS",
    submissionDate: "2025-05-09T10:10:00",
    userName: "David Miller",
    userDepartment: "Customer Service",
    targetDepartment: "Finance",
    priority: "High",
    attachmentUrl: "https://example.com/attachment4.pdf",
  },
  {
    id: 8,
    requestData: "Quarterly financial report access",
    serviceName: "Report Access",
    status: "COMPLETED",
    submissionDate: "2025-05-08T15:30:00",
    userName: "Jennifer Taylor",
    userDepartment: "Operations",
    targetDepartment: "Finance",
    priority: "Medium",
    attachmentUrl: null,
  },
];

const Supervisors: React.FC = () => {
  // State variables
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockRequests);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userDeptFilter, setUserDeptFilter] = useState<string>("ALL");
  const [targetDeptFilter, setTargetDeptFilter] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { RangePicker } = DatePicker;

  // Calculate statistics
  const pendingCount = mockRequests.filter(req => req.status === "PENDING").length;
  const inProgressCount = mockRequests.filter(req => req.status === "IN_PROGRESS").length;
  const completedCount = mockRequests.filter(req => req.status === "COMPLETED").length;
  const rejectedCount = mockRequests.filter(req => req.status === "REJECTED").length;

  // Filter requests based on selected filters
  useEffect(() => {
    setLoading(true);
    
    let result = [...mockRequests];
    
    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Apply user department filter
    if (userDeptFilter !== "ALL") {
      result = result.filter(req => req.userDepartment === userDeptFilter);
    }
    
    // Apply target department filter
    if (targetDeptFilter !== "ALL") {
      result = result.filter(req => req.targetDepartment === targetDeptFilter);
    }
    
    // Apply search text filter
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(
        req => 
          req.requestData.toLowerCase().includes(lowerSearchText) ||
          req.serviceName.toLowerCase().includes(lowerSearchText) ||
          req.userName.toLowerCase().includes(lowerSearchText)
      );
    }
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      result = result.filter(req => {
        const requestDate = dayjs(req.submissionDate);
        return requestDate.isAfter(dateRange[0]) && requestDate.isBefore(dateRange[1]);
      });
    }
    
    // Update filtered requests
    setFilteredRequests(result);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [statusFilter, userDeptFilter, targetDeptFilter, searchText, dateRange]);

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("ALL");
    setUserDeptFilter("ALL");
    setTargetDeptFilter("ALL");
    setSearchText("");
    setDateRange(null);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Request Details",
      dataIndex: "requestData",
      key: "request",
      render: (text: string, record: any) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <p className="font-medium text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
            {text?.length > 50 ? `${text.substring(0, 50)}...` : text}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">
              {record.serviceName}
            </span>
            <span className="text-xs text-gray-400">
              {dayjs(record.submissionDate).fromNow()}
            </span>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Submitted By",
      dataIndex: "userName",
      key: "userName",
      render: (text: string, record: any) => (
        <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
          <span className="text-gray-700">{text}</span>
          <span className="text-xs text-gray-500">{record.userDepartment}</span>
        </motion.div>
      ),
    },
    {
      title: "Target Department",
      dataIndex: "targetDepartment",
      key: "targetDepartment",
      render: (text: string) => (
        <motion.span whileHover={{ scale: 1.05 }} className="text-gray-600">
          {text}
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
              className={`px-3 py-1 rounded-full capitalize ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
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
      render: (text: string, record: any) => (
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
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm border-l-4 border-yellow-400">
                <Statistic 
                  title={<span className="flex items-center"><ClockCircleOutlined className="mr-2 text-yellow-500" /> Pending</span>}
                  value={pendingCount} 
                  valueStyle={{ color: '#d97706' }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm border-l-4 border-blue-400">
                <Statistic 
                  title={<span className="flex items-center"><BarChartOutlined className="mr-2 text-blue-500" /> In Progress</span>}
                  value={inProgressCount} 
                  valueStyle={{ color: '#3b82f6' }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm border-l-4 border-green-400">
                <Statistic 
                  title={<span className="flex items-center"><CheckCircleOutlined className="mr-2 text-green-500" /> Completed</span>}
                  value={completedCount} 
                  valueStyle={{ color: '#10b981' }}
                  suffix={<small className="text-gray-500">requests</small>}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm border-l-4 border-red-400">
                <Statistic 
                  title={<span className="flex items-center"><CloseCircleOutlined className="mr-2 text-red-500" /> Rejected</span>}
                  value={rejectedCount} 
                  valueStyle={{ color: '#ef4444' }}
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
                <Badge count={
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
              <Button 
                icon={<ReloadOutlined />} 
                onClick={resetFilters}
              />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select
                      className="w-full"
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value)}
                      options={[
                        { value: "ALL", label: "All Statuses" },
                        { value: "PENDING", label: "Pending" },
                        { value: "IN_PROGRESS", label: "In Progress" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "REJECTED", label: "Rejected" },
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Department</label>
                    <Select
                      className="w-full"
                      value={userDeptFilter}
                      onChange={(value) => setUserDeptFilter(value)}
                      options={[
                        { value: "ALL", label: "All Departments" },
                        ...departments.map(dept => ({ 
                          value: dept.name, 
                          label: dept.name 
                        }))
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Department</label>
                    <Select
                      className="w-full"
                      value={targetDeptFilter}
                      onChange={(value) => setTargetDeptFilter(value)}
                      options={[
                        { value: "ALL", label: "All Departments" },
                        ...departments.map(dept => ({ 
                          value: dept.name, 
                          label: dept.name 
                        }))
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
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
            dataSource={filteredRequests}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              showTotal: (total) => `Total ${total} items`,
              className: "[&_.ant-pagination-item-active]:bg-indigo-600 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active]:text-white"
            }}
            rowClassName={(record) =>
              `transition-all duration-200 ${
                selectedRow === record.id
                  ? "bg-indigo-50"
                  : "hover:bg-gray-50"
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
                              record.priority === "High" ? "red" : 
                              record.priority === "Medium" ? "blue" : "green"
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
                          <span className="font-medium">Target Department:</span>{" "}
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