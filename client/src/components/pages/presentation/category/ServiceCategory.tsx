import {
  Table,
  Pagination,
  Dropdown,
  Modal,
  message,
  Button,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsThreeDotsVertical, BsPencil, BsTrash } from "react-icons/bs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import NewService from "../Services/NewService";
import DeleteService from "../Services/DeleteService";


interface ServiceItem {
  key: string;
  name: string;
  category: string;
  description: string;
  status: string;
}

const ServicesCategory = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const { confirm } = Modal;

  const servicesData: ServiceItem[] = [
    {
      key: "1",
      name: "IT Support",
      category: "IT Services",
      description: "Help with tech and IT related issue",
      status: "Active",
    },
    {
      key: "2",
      name: "Network Setup",
      category: "IT Services",
      description: "Setup and configuration of network devices",
      status: "Active",
    },
    {
      key: "3",
      name: "Software Installation",
      category: "IT Services",
      description: "Installation of software applications",
      status: "Active",
    },
    {
      key: "4",
      name: "Hardware Repair",
      category: "IT Services",
      description: "Repair of hardware devices",
      status: "Active",
    },
    {
      key: "5",
      name: "Email Setup",
      category: "IT Services",
      description: "Setup and configuration of email accounts",
      status: "Active",
    },
  ];

  const handleMenuClick = (key: string, action: string) => {
    setVisibleDropdown(null);
    if (action === "edit") {
      message.info(`Editing service ${key}`);
      // Add your edit logic here
    } else if (action === "delete") {
      showDeleteConfirm(key);
    }
  };

  const showDeleteConfirm = (key: string) => {
    confirm({
      title: "Are you sure you want to delete this service?",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      className: "rounded-lg",
      onOk() {
        message.success(`Service ${key} deleted`);
        // Add your delete logic here
      },
    });
  };

  const ActionMenu = ({ record }: { record: ServiceItem }) => (
    <div className="rounded-lg shadow-xl border border-gray-200 bg-white flex flex-col space-y-1 p-2">
      <div
        key="edit"
        onClick={() => {
          setModalVisible((prev) => !prev);
        }}
        className="flex items-center px-4 py-2 hover:bg-blue-50 transition duration-200 rounded-lg cursor-pointer"
      >
        <BsPencil className="mr-2 text-blue-500 text-xl" />
        <span className="text-gray-700 font-medium">Edit Service</span>
      </div>
      <div
        key="delete"
        onClick={() => {
          setDeleteModalVisible((prev) => !prev);
        }}
        className="flex items-center px-4 py-2 hover:bg-red-50 transition duration-200 rounded-lg cursor-pointer"
      >
        <BsTrash className="mr-2 text-red-500 text-xl" />
        <span className="text-gray-700 font-medium">Delete Service</span>
      </div>
    </div>
  );

  const columnsServices = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ServiceItem, index: number) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="font-medium text-gray-800"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string, record: ServiceItem, index: number) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="text-gray-600"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: string, record: ServiceItem, index: number) => (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {text}
        </motion.span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: ServiceItem, index: number) => (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
          whileHover={{ scale: 1.05 }}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            text === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {text}
        </motion.span>
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
              visible={visibleDropdown === record.key}
              onVisibleChange={(visible) => {
                setVisibleDropdown(visible ? record.key : null);
              }}
              placement="bottomRight"
              overlayClassName="custom-dropdown"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                whileHover={{ scale: 1.1 }}
              >
                <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700" />
              </motion.div>
            </Dropdown>
          </Button>
        </Tooltip>
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
      <motion.h2
        className="text-2xl md:text-3xl mb-6 text-gray-700 font-semibold"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        Services
      </motion.h2>

      <Table
        columns={columnsServices}
        dataSource={servicesData}
        pagination={false}
        className="rounded-xl shadow-sm border border-gray-200"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex justify-center mt-6"
      >
        <Pagination
          current={currentPage}
          total={50}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          className="[&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active]:text-white"
          itemRender={(page, type, originalElement) => (
            <motion.div whileHover={{ scale: 1.1 }}>
              {originalElement}
            </motion.div>
          )}
        />
      </motion.div>
      <NewService
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      <DeleteService
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onDelete={() => {}}
      />
    </motion.div>
  );
};

export default ServicesCategory;
