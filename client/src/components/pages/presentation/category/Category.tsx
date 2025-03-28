import { Table, Pagination, Button, Tooltip } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import NewCategory from "./NewCategory";

interface SidebarProps {
  onItemClick: () => void;
}

const Services = ({ onItemClick }: SidebarProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const servicesData = [
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      date: "2025-03-29",
    },
    {
      key: "2",
      name: "Network Setup",
      description: "Office network installation and configuration",
      date: "2025-03-29",
    },
    {
      key: "3",
      name: "Software Installation",
      description: "Installation of licensed software",
      date: "2025-03-29",
    },
    {
      key: "4",
      name: "Hardware Repair",
      description: "Diagnose and fix hardware issues",
      date: "2025-03-29",
    },
    {
      key: "5",
      name: "Email Setup",
      description: "Configure email clients and accounts",
      date: "2025-03-29",
    },
  ];

  const columnsServices = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any, index: number) => (
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
      render: (text: string, record: any, index: number) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="text-gray-600 text-sm"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string, record: any, index: number) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="text-gray-600 text-sm"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <Tooltip
        title="Actions"
        placement="right"
        className="custom-tooltip"
        color="#3b82f6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button
              onClick={() => {
                setModalVisible((p) => !p);
              }}
            >
              <BsThreeDotsVertical className="text-black" />
            </Button>
          </motion.div>
        </Tooltip>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <motion.h2
        className="text-[30px] mb-6 text-[#6D6D6D] font-semibold"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        Category
      </motion.h2>

      <Table
        columns={columnsServices}
        dataSource={servicesData}
        pagination={false}
        className="custom-table flex-1"
        components={{
          body: {
            row: ({ children, ...props }) => (
              <motion.tr
                {...props}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  backgroundColor: "rgba(245, 245, 245, 0.8)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                {children}
              </motion.tr>
            ),
          },
        }}
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
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
          className="ant-pagination-item-active:bg-indigo-600 ant-pagination-item-active:border-indigo-600"
          itemRender={(page, type, originalElement) => (
            <motion.div whileHover={{ scale: 1.1 }}>
              {originalElement}
            </motion.div>
          )}
        />
      </motion.div>

      <NewCategory
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={() => {}}
      />
    </motion.div>
  );
};

export default Services;
