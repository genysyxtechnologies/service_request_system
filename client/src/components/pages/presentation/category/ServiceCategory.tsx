import {
  Table,
  Pagination,
  Dropdown,
  Modal,
  message,
  Button,
  Tooltip,
  Spin,
  Select,
} from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BsThreeDotsVertical,
  BsPencil,
  BsTrash,
  BsPlusCircle,
} from "react-icons/bs";
import DeleteService from "../Services/DeleteService";
import { useServices } from "../../../services/useServices";
import { useSelector } from "react-redux";
import UpdateServices from "./UpdateServices";
import NewRequest from "../home/NewRequest";
import useDepartment from "../../../services/useDepartment";

interface ServiceItem {
  key: string;
  id: number;
  name: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  departmentId: number;
}

interface DepartmentItem {
  id: number;
  name: string;
  code: string;
}

const ServicesCategory = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const { confirm } = Modal;
  const { fetchServices, loading, setLoading, error, deleteService } =
    useServices(token);
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [newRequestModal, setNewRequestModal] = useState<boolean>(false);
  const [serviceId, setServiceId] = useState<number>(0);
  const [departmentId, setDepartmentId] = useState<number>(0);
  const { fetchDepartments } = useDepartment(token);
  const [departmentOptions, setDepartmentOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const response = await fetchDepartments();
      if (response && response) {
        const options = response.map((dept: DepartmentItem) => ({
          value: dept.id,
          label: dept.name,
        }));
        setDepartmentOptions(options);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      loadServices(currentPage, pageSize, selectedDepartment);
    }
  }, [currentPage, pageSize, selectedDepartment]);

  const loadServices = async (
    page: number,
    size: number,
    departmentId: number
  ) => {
    try {
      const response = await fetchServices(departmentId);
      if (response && response.data) {
        const apiData = response.data.content;
        const formattedData = apiData.map((item: any) => ({
          key: item.id.toString(),
          id: item.id,
          name: item.name,
          categoryName: item.categoryName,
          categoryId: item.categoryId,
          description: item.description,
          isActive: item.isActive,
          departmentId: item.departmentId,
        }));

        setServicesData(formattedData);
        setTotalItems(response.data.totalElements || 0);
      }
    } catch (err) {
      message.error("Failed to load services");
    }
  };

  const handleDepartmentChange = (value: number) => {
    setSelectedDepartment(value);
  };

  const handleNewRequestClick = (id: number, departmentId: number) => {
    setServiceId(id);
    setDepartmentId(departmentId);
    setNewRequestModal(true);
  };

  const handleEditClick = (record: ServiceItem) => {
    setSelectedService(record);
    setModalVisible(true);
  };

  const ActionMenu = ({ record }: { record: ServiceItem }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg shadow-xl border border-gray-200 bg-white flex flex-col space-y-1 p-2"
    >
      <div
        key="edit"
        onClick={() => {
          handleEditClick(record);
        }}
        className="flex items-center px-4 py-2 hover:bg-blue-50 transition duration-200 rounded-lg cursor-pointer"
      >
        <BsPencil className="mr-2 text-blue-500 text-xl" />
        <span className="text-gray-700 font-medium">Edit Service</span>
      </div>
      <div
        key="delete"
        onClick={() => {
          setSelectedService(record);
          setDeleteModalVisible(true);
        }}
        className="flex items-center px-4 py-2 hover:bg-red-50 transition duration-200 rounded-lg cursor-pointer"
      >
        <BsTrash className="mr-2 text-red-500 text-xl" />
        <span className="text-gray-700 font-medium">Delete Service</span>
      </div>
    </motion.div>
  );

  const columnsServices = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, _: ServiceItem, index: number) => (
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string, _: ServiceItem, index: number) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            damping: 10,
          }}
          className="text-gray-600 line-clamp-2"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "category",
      render: (text: string, _: ServiceItem, index: number) => (
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
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean, record: ServiceItem, index: number) => (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.2,
            type: "spring",
          }}
          whileHover={{ scale: 1.1 }}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </motion.span>
      ),
    },
    {
      title: "New Request",
      key: "newRequest",
      render: (text: string, record: ServiceItem, index: number) => (
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
          <Button
            type="primary"
            icon={<BsPlusCircle className="mr-1" />}
            onClick={() =>
              handleNewRequestClick(record.id, record.departmentId)
            }
            className="flex items-center bg-green-500 hover:bg-green-600 border-green-500"
          >
            New Request
          </Button>
        </motion.div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: ServiceItem, index: number) => (
        <Tooltip
          title="Actions"
          placement="right"
          overlayClassName="custom-tooltip"
          color="#3b82f6"
        >
          <Button onClick={(e) => e.stopPropagation()}>
            <Dropdown
              overlay={<ActionMenu record={record} />}
              trigger={["click"]}
              open={visibleDropdown === record.key}
              onOpenChange={(visible) => {
                setVisibleDropdown(visible ? record.key : null);
              }}
              placement="bottomRight"
              overlayClassName="custom-dropdown"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.3,
                  type: "spring",
                }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700" />
              </motion.div>
            </Dropdown>
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col p-6"
    >
      <div className="flex items-center justify-between w-full">
        <motion.h2
          className="text-2xl md:text-3xl mb-6 text-gray-700 font-semibold"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          Services
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Select
            showSearch
            placeholder="Select a department"
            optionFilterProp="children"
            onChange={handleDepartmentChange}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departmentOptions}
            style={{ width: "100%", maxWidth: "400px" }}
            size="large"
          />
        </motion.div>
      </div>

      <Spin spinning={loading} tip="Loading services..." size="large">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Table
            columns={columnsServices}
            dataSource={servicesData}
            pagination={false}
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

        {!loading && servicesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mt-6"
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={["10", "20", "50", "100"]}
              className="[&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active]:text-white"
              itemRender={(page, type, originalElement) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {originalElement}
                </motion.div>
              )}
            />
          </motion.div>
        )}
      </Spin>

      <UpdateServices
        visible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedService(null);
        }}
        serviceData={selectedService}
      />

      <DeleteService
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onDelete={async () => {
          if (selectedService) {
            await deleteService(selectedService.id);
          }
        }}
      />
      <NewRequest
        serviceId={serviceId}
        departmentId={departmentId}
        isOpen={newRequestModal}
        onClose={() => setNewRequestModal(false)}
        onSubmit={() =>
          selectedDepartment &&
          loadServices(currentPage, pageSize, selectedDepartment)
        }
      />
    </motion.div>
  );
};

export default ServicesCategory;
