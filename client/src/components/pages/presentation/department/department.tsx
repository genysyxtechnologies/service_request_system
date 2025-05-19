import {
  Table,
  Input,
  Button,
  Spin,
  Card,
  message,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  BankOutlined,
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import useDepartment from "../../../services/useDepartment";
import RequestContext from "../../../../context/request.context/RequestContext";

const { Title, Text } = Typography;

interface DepartmentItem {
  key: string;
  name: string;
  code: string;
  id: number;
}

interface DepartmentProps {
  showButton?: boolean;
}

const Department: React.FC<DepartmentProps> = ({ showButton = false }) => {
  // State for the search functionality and department data
  const [searchText, setSearchText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Get the auth token from Redux store
  const { token } = useSelector(
    (state: { auth: { token: string } }) => state.auth
  );
  
  // Get the setDepartmentId function from the RequestContext
  const { setDepartmentId } = useContext(RequestContext);
  
  // Get department-related functions and data from the useDepartment hook
  const { syncDepartments, loading, fetchDepartments, departments, setDepartments } = useDepartment(token);

  // Fetch departments when the component mounts
  useEffect(() => {
    (async () => {
      const departmentsData = await fetchDepartments();
      if (departmentsData) {
        setDepartments(departmentsData);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle creating a service for a department
  const handleCreateService = (record: DepartmentItem) => {
    setDepartmentId(record.id);
  };

  // Handle synchronizing departments with the server
  const handleSync = async () => {
    setIsSyncing(true);
    message.loading({
      content: "Synchronizing departments...",
      key: "sync",
      duration: 0,
    });
    
    try {
      await syncDepartments();
      message.success({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Departments synchronized successfully!
          </motion.div>
        ),
        key: "sync",
        duration: 2,
      });
    } catch (_) {
      // Error handling
      message.error({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Failed to synchronize departments
          </motion.div>
        ),
        key: "sync",
        duration: 2,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Define the base columns for the department table
  const baseColumns = [
    {
      title: (
        <span className="text-gray-600 font-medium flex items-center">
          <BankOutlined className="mr-2 text-indigo-500" /> Department Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a: DepartmentItem, b: DepartmentItem) => a.name.localeCompare(b.name),
      render: (text: string, record: DepartmentItem, index: number) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            type: "spring",
            stiffness: 100,
          }}
          className="font-medium text-gray-800 flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: (
        <span className="text-gray-600 font-medium flex items-center">
          <AppstoreOutlined className="mr-2 text-indigo-500" /> Department Code
        </span>
      ),
      dataIndex: "code",
      key: "code",
      sorter: (a: DepartmentItem, b: DepartmentItem) => a.code.localeCompare(b.code),
      render: (text: string, record: DepartmentItem, index: number) => (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.15,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm"
        >
          {text}
        </motion.span>
      ),
    },
  ];

  const actionColumn = {
    title: (
      <span className="text-gray-600 font-medium flex items-center">
        <PlusOutlined className="mr-2 text-indigo-500" /> Actions
      </span>
    ),
    key: "actions",
    render: (text: string, record: DepartmentItem, index: number) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.25,
          type: "spring",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleCreateService(record)}
          className="bg-indigo-600 hover:bg-indigo-700 border-0 h-9 shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Create Service
        </Button>
      </motion.div>
    ),
  };

  const columns = showButton ? [...baseColumns, actionColumn] : baseColumns;

  // Format department data to include key property required by DepartmentItem
  const formattedDepartments = departments
    ? departments.map(dept => ({
        ...dept,
        key: dept.id.toString()
      }))
    : [];

  // Filter departments based on search text
  const filteredData = formattedDepartments.filter(
    (dept) =>
      !searchText ||
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="rounded-2xl shadow-md border-0 overflow-hidden backdrop-blur-sm bg-white/95"
        bodyStyle={{ padding: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 border-b border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Title level={4} className="m-0 text-gray-800">
                Departments
              </Title>
              <Text type="secondary">
                View and manage departments for service requests
              </Text>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Search departments..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                className="w-64 rounded-lg transition-all duration-300 focus:border-indigo-500 focus:shadow-md"
                allowClear
              />
              <Button
                icon={<SyncOutlined spin={isSyncing} />}
                onClick={handleSync}
                loading={isSyncing}
                className="flex items-center h-10 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Sync Departments
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white"
        >

          <Spin
            spinning={loading}
            tip="Loading departments..."
            size="large"
            indicator={
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <SyncOutlined
                  style={{ fontSize: 28 }}
                  className="text-indigo-600"
                />
              </motion.div>
            }
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  position: ["bottomRight"],
                  className: "px-6 py-4",
                  showTotal: (total) => (
                    <Text className="text-gray-500">
                      Showing {filteredData.length} of {total} departments
                    </Text>
                  ),
                }}
                className="rounded-lg [&_th]:bg-gray-50 [&_th]:text-indigo-900 [&_th]:font-medium [&_th]:py-4 [&_td]:py-3"
                loading={loading}
                components={{
                  body: {
                    row: ({ children, ...props }) => (
                      <motion.tr
                        {...props}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          backgroundColor: "rgba(238, 242, 255, 0.5)",
                          scale: 1.005,
                          transition: { duration: 0.2 },
                        }}
                        className="group"
                      >
                        {children}
                      </motion.tr>
                    ),
                  },
                }}
                rowClassName={() =>
                  "hover:bg-indigo-50/30 transition-all duration-300 border-b border-gray-100"
                }
              />
            </motion.div>
          </Spin>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default Department;
