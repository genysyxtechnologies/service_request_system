import {
  Table,
  Input,
  Button,
  Space,
  Spin,
  Tag,
  Tooltip,
  Select,
  message,
} from "antd";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import useDepartment from "../../../services/useDepartment";
import { useSelector } from "react-redux";

interface DepartmentItem {
  key: string;
  name: string;
  code: string;
}

type DataIndex = keyof DepartmentItem;

const Department = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filterMode, setFilterMode] = useState<"search" | "select">("search");
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const searchInput = useRef<any>(null);
  const { token } = useSelector((state: any) => state.auth);
  const { syncDepartments, loading, fetchDepartments, departments, setDepartments } = useDepartment(token);

  // Mock data - replace with your actual data fetching logic
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: DepartmentItem[] = [
        { key: "1", name: "Human Resources", code: "HR" },
        { key: "2", name: "Information Technology", code: "IT" },
        { key: "3", name: "Finance", code: "FIN" },
        { key: "4", name: "Marketing", code: "MKT" },
        { key: "5", name: "Operations", code: "OPS" },
        { key: "6", name: "Research and Development", code: "R&D" },
        { key: "7", name: "Customer Support", code: "CS" },
        { key: "8", name: "Sales", code: "SALES" },
        { key: "9", name: "Legal", code: "LEGAL" },
        { key: "10", name: "Quality Assurance", code: "QA" },
      ];
    }, 1000);
  }, [token]);

  // fetch departments
  useEffect(() => {
    (async () => {
     const departments = await fetchDepartments();
      setDepartments(departments!);
    })();
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
        className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-full"
      >
        {filterMode === "search" ? (
          <div className="flex flex-col space-y-2">
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
              className="w-64"
            />
            <div className="flex justify-between">
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(selectedKeys as string[], confirm, dataIndex)
                }
                icon={<SearchOutlined />}
                size="small"
                className="bg-blue-500"
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setFilterMode("select");
                  setSelectedFilter(selectedKeys as string[]);
                }}
              >
                Switch to Select
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Select
              mode="multiple"
              placeholder={`Select ${dataIndex}`}
              value={selectedFilter}
              onChange={(value) => setSelectedFilter(value)}
              options={Array.from(
                new Set(departments.map((item) => item[dataIndex]))
              ).map((value) => ({ value, label: value }))}
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            <div className="flex justify-between">
              <Button
                type="primary"
                onClick={() => {
                  setSelectedKeys(selectedFilter);
                  handleSearch(selectedFilter, confirm, dataIndex);
                }}
                size="small"
                className="bg-blue-500"
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  setSelectedFilter([]);
                  clearFilters && handleReset(clearFilters);
                }}
                size="small"
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => setFilterMode("search")}
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
        <motion.div whileHover={{ scale: 1.1 }}>
          <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
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
      searchedColumn === dataIndex ? <Tag color="blue">{text}</Tag> : text,
  });

  const handleSync = async () => {
    message.loading({ content: "Synchronizing departments...", key: "sync" });
    await syncDepartments().then(() => {
      message.success({
        content: "Departments synchronized successfully!",
        key: "sync",
      });
    });
  };

  const columns = [
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
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
          className="font-medium text-gray-800"
          whileHover={{ x: 5 }}
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Department Code",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
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
          whileHover={{ scale: 1.1 }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {text}
        </motion.span>
      ),
    },
    {
      title: "Actions",
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Tooltip title="Synchronize Department">
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={handleSync}
              className="bg-green-500 hover:bg-green-600 border-green-500"
            />
          </Tooltip>
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col p-6"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <motion.h2
          className="text-2xl md:text-3xl text-gray-700 font-semibold"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          Departments
        </motion.h2>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            duration: 0.15,
          }}
        >
          <Button
            onClick={handleSync}
            type="primary"
            icon={<SyncOutlined />}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium h-10 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Synchronize All
          </Button>
        </motion.div>
      </div>

      <Spin spinning={loading} tip="Loading departments..." size="large">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Table
            columns={columns}
            dataSource={departments}
            pagination={{ pageSize: 10 }}
            className="rounded-xl shadow-sm border border-gray-200"
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
                      backgroundColor: "rgba(249, 250, 251, 0.8)",
                      transition: { duration: 0.1 },
                    }}
                    className="group"
                  >
                    {children}
                  </motion.tr>
                ),
              },
            }}
          />
        </motion.div>
      </Spin>
    </motion.div>
  );
};

export default Department;
