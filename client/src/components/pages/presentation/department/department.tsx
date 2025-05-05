import {
  Table,
  Input,
  Button,
  Spin,
  Tag,
  Tooltip,
  Select,
  message,
} from "antd";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useContext } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import useDepartment from "../../../services/useDepartment";
import { useSelector } from "react-redux";
import RequestContext from "../../../../context/request.context/RequestContext";

interface DepartmentItem {
  key: string;
  name: string;
  code: string;
  id: number;
}

type DataIndex = keyof DepartmentItem;

interface DepartmentProps {
  showButton?: boolean;
}

const Department: React.FC<DepartmentProps> = ({ showButton = false }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filterMode, setFilterMode] = useState<"search" | "select">("search");
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const searchInput = useRef<any>(null);
  const { token } = useSelector((state: any) => state.auth);
  const { setDepartmentId } = useContext(RequestContext);
  const {
    syncDepartments,
    loading,
    fetchDepartments,
    departments,
    setDepartments,
  } = useDepartment(token);

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

  const baseColumns = [
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
  ];

  // Add the Create Service column only if showButton is true
  const columns = showButton
    ? [
        ...baseColumns,
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleCreateService(record)}
                className="bg-blue-500 hover:bg-blue-600 border-blue-500"
              >
                Create Service
              </Button>
            </motion.div>
          ),
        },
      ]
    : baseColumns;

  const filteredData =
    selectedDepartments.length > 0
      ? departments.filter((dept) => selectedDepartments.includes(dept.name))
      : departments;

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

      {/* New Department Select Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              mode="multiple"
              placeholder="Filter departments by name"
              value={selectedDepartments}
              onChange={setSelectedDepartments}
              options={departments.map((dept) => ({
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
              className="[&_.ant-select-selector]:rounded-lg [&_.ant-select-selector]:p-2 [&_.ant-select-selector]:h-auto 
                          [&_.ant-select-selector]:border [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:transition-all 
                          [&_.ant-select-selector]:duration-300 [&_.ant-select-selector:hover]:border-blue-500 
                          [&_.ant-select-selector:hover]:shadow-[0_0_0_2px_rgba(49,130,206,0.2)]
                          [&_.ant-select-selection-item]:bg-blue-50 [&_.ant-select-selection-item]:rounded-md 
                          [&_.ant-select-selection-item]:border [&_.ant-select-selection-item]:border-blue-200 
                          [&_.ant-select-selection-item]:text-blue-800
                          [&_.ant-select-selection-search-input]:h-8"
              dropdownStyle={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              suffixIcon={
                <motion.div whileHover={{ rotate: 90 }}>
                  <SearchOutlined className="text-gray-400" />
                </motion.div>
              }
            />
          </motion.div>
          {selectedDepartments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Button
                onClick={() => setSelectedDepartments([])}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <Spin spinning={loading} tip="Loading departments..." size="large">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ["bottomCenter"],
              className: "mt-4",
            }}
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
            rowClassName={() =>
              "hover:bg-gray-50 transition-colors duration-150"
            }
          />
        </motion.div>
      </Spin>
    </motion.div>
  );
};

export default Department;
