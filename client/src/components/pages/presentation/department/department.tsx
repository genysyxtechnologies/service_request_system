import {
  Table,
  Input,
  Button,
  Spin,
  Tag,
  Tooltip,
  Select,
  message,
  Card,
  Space,
  Typography,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useContext } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  BankOutlined,
  AppstoreOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import useDepartment from "../../../services/useDepartment";
import { useSelector } from "react-redux";
import RequestContext from "../../../../context/request.context/RequestContext";

const { Title, Text } = Typography;

interface DepartmentItem {
  key: string;
  name: string;
  code: string;
  id: number;
  hod: string;
}

type DataIndex = keyof DepartmentItem;

interface DepartmentProps {
  showButton?: boolean;
}

const Department: React.FC<DepartmentProps> = ({ showButton = false }) => {
  // These state variables are used by the column search functionality
  // searchText is used in the filter functions
  const [, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filterMode, setFilterMode] = useState<"search" | "select">("search");
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const searchInput = useRef<any | null>(null);
  const { token } = useSelector(
    (state: { auth: { token: string } }) => state.auth
  );
  const { setDepartmentId } = useContext(RequestContext);
  const {
    syncDepartments,
    loading,
    fetchDepartments,
    departments,
    setDepartments,
  } = useDepartment(token);

  // fetch departments only once when component mounts
  useEffect(() => {
    (async () => {
      const departments = await fetchDepartments();
      if (departments) {
        setDepartments(departments);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
    setSelectedFilter([]);
  };

  const handleCreateService = (record: DepartmentItem) => {
    setDepartmentId(record.id);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DepartmentItem> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 w-full backdrop-blur-sm bg-white/90"
      >
        {filterMode === "search" ? (
          <div className="flex flex-col space-y-3">
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              className="w-full h-10 rounded-lg transition-all duration-300 focus:border-indigo-500 focus:shadow-md"
            />
            <div className="flex justify-between gap-2">
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys as string[], confirm, dataIndex)
                }
                icon={<SearchOutlined />}
                size="middle"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 border-0 shadow-sm transition-all duration-300"
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="middle"
                className="flex-1 hover:bg-gray-50 transition-all duration-300"
              >
                Reset
              </Button>
              <Button
                type="text"
                size="middle"
                onClick={() => {
                  setFilterMode("select");
                  setSelectedFilter(selectedKeys as string[]);
                }}
                className="flex-1 text-indigo-600 hover:text-indigo-800 transition-all duration-300"
              >
                Switch to Select
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Select
              mode="multiple"
              placeholder={`Select ${dataIndex}`}
              value={selectedFilter}
              onChange={(value) => setSelectedFilter(value)}
              options={
                Array.from(
                  new Set(departments.map((item) => item[dataIndex]))
                ).map((value) => ({ value, label: value })) || []
              }
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              className="h-10"
            />
            <div className="flex justify-between gap-2">
              <Button
                type="primary"
                onClick={() => {
                  setSelectedKeys(selectedFilter);
                  handleSearch(selectedFilter, confirm, dataIndex);
                }}
                size="middle"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 border-0 shadow-sm transition-all duration-300"
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  setSelectedFilter([]);
                  if (clearFilters) {
                    handleReset(clearFilters);
                  }
                }}
                size="middle"
                className="flex-1 hover:bg-gray-50 transition-all duration-300"
              >
                Reset
              </Button>
              <Button
                type="text"
                size="middle"
                onClick={() => setFilterMode("search")}
                className="flex-1 text-indigo-600 hover:text-indigo-800 transition-all duration-300"
              >
                Switch to Search
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    ),
    filterIcon: (filtered: boolean) => (
      <Tooltip title="Filter">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FilterOutlined
            style={{
              color: filtered ? "#1890ff" : undefined,
              fontSize: "16px",
            }}
          />
        </motion.div>
      </Tooltip>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Tag
            color="blue"
            className="text-sm font-medium px-3 py-1 rounded-full border-0 bg-indigo-100 text-indigo-800"
          >
            {text}
          </Tag>
        </motion.div>
      ) : (
        text
      ),
  });

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Error is logged by the message component
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

  const baseColumns = [
    {
      title: (
        <span className="text-gray-600 font-medium flex items-center">
          <AppstoreOutlined className="mr-2 text-indigo-500" /> Department Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string, _record: DepartmentItem, index: number) => (
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
      ...getColumnSearchProps("code"),
      render: (text: string, _record: DepartmentItem, index: number) => (
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
    {
      title: (
        <span className="text-gray-600 font-medium flex items-center">
          <BankOutlined className="mr-2 text-indigo-500" /> HOD
        </span>
      ),
      dataIndex: "hod",
      key: "hod",
      ...getColumnSearchProps("hod"),
      render: (text: string, _record: DepartmentItem, index: number) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.2,
            type: "spring",
            stiffness: 150,
          }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center"
        >
          {text === "NO HOD" ? (
            <Tag color="orange" className="px-3 py-1 rounded-lg text-sm font-medium border-0">
              {text}
            </Tag>
          ) : (
            <Tag color="blue" className="px-3 py-1 rounded-lg text-sm font-medium border-0 bg-blue-50 text-blue-700">
              {text}
            </Tag>
          )}
        </motion.div>
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
    render: (_text: string, record: DepartmentItem, index: number) => (
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

  const filteredData =
    selectedDepartments.length > 0
      ? departments.filter((dept) => selectedDepartments.includes(dept.name))
      : departments;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    >
      <Card
        className="rounded-2xl shadow-md border-0 overflow-hidden backdrop-blur-sm bg-white/95"
        bodyStyle={{ padding: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Title level={3} className="m-0 text-gray-800 flex items-center">
                <BankOutlined className="mr-3 text-indigo-600" /> Departments
              </Title>
              <Text type="secondary" className="text-sm">
                Manage departments and their Heads of Department (HOD)
              </Text>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                onClick={handleSync}
                type="primary"
                icon={<SyncOutlined spin={isSyncing} />}
                loading={isSyncing}
                className="bg-green-500 hover:bg-green-600 h-10 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                Synchronize All
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white"
        >
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Space className="w-full" direction="vertical">
                <Text
                  strong
                  className="text-gray-700 flex items-center text-base"
                >
                  <FilterOutlined className="mr-2 text-indigo-500" /> Filter
                  Departments
                </Text>
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <motion.div
                    className="flex-1 hover:bg-gray-50 transition-all duration-300"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select departments"
                      value={selectedDepartments}
                      onChange={setSelectedDepartments}
                      options={departments?.map((dept) => ({
                        value: dept.name,
                        label: dept.name,
                      }))}
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className="h-10 [&_.ant-select-selector]:rounded-lg [&_.ant-select-selection-item]:bg-indigo-50 [&_.ant-select-selection-item]:border-indigo-100 transition-all duration-300"
                      dropdownStyle={{
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        border: "1px solid rgba(229, 231, 235, 0.5)",
                      }}
                      suffixIcon={
                        <motion.div whileHover={{ rotate: 15 }}>
                          <SearchOutlined className="text-indigo-400" />
                        </motion.div>
                      }
                    />
                  </motion.div>

                  <AnimatePresence>
                    {selectedDepartments.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Button
                          onClick={() => setSelectedDepartments([])}
                          icon={<ClearOutlined />}
                          className="h-10 text-gray-500 hover:text-red-500 hover:border-red-200 transition-all duration-300"
                        >
                          Clear filters
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Space>
            </motion.div>
          </div>

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
                className="rounded-lg [&_th]:bg-gray-50 [&_th]:text-indigo-900 [&_th]:font-medium [&_th]:py-4 [&_td]:py-3 shadow-sm"
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
