import { Table, Button } from "antd";
import { motion } from "framer-motion";
import "./Home.css";

interface SidebarProps {
  onItemClick: () => void;
}

const Tables = ({ onItemClick }: SidebarProps) => {
  const servicesData = [
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },
    {
      key: "1",
      name: "IT Support",
      description: "Help with tech and IT related issues",
      category: "IT Services",
    },

  ];

  const requestsData = [
    {
      key: "1",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Pending",
    },
    {
      key: "2",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "In Progress",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
    {
      key: "3",
      name: "IT Support",
      submissionDate: "2025-03-29",
      status: "Completed",
    },
  ];



  // Enhanced columns with animations
  const columnsServices = [
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      render: (text: string) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {text}
        </motion.div>
      )
    },
    { 
      title: "Description", 
      dataIndex: "description", 
      key: "description",
      render: (text: string) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-gray-600"
        >
          {text}
        </motion.div>
      )
    },
    { 
      title: "Category", 
      dataIndex: "category", 
      key: "category",
      render: (text: string) => (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-sm"
        >
          {text}
        </motion.span>
      )
    },
    {
      title: "",
      key: "action",
      render: () => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => onItemClick()} 
            type="primary"
            className="shadow-md"
          >
            New request
          </Button>
        </motion.div>
      ),
    },
  ];

  const columnsRequests = [
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      render: (text: string) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {text}
        </motion.div>
      )
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      key: "submissionDate",
      render: (text: string) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-gray-600"
        >
          {text}
        </motion.div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color;
        switch (status) {
          case "Pending":
            color = "bg-yellow-100 text-yellow-800";
            break;
          case "In Progress":
            color = "bg-blue-100 text-blue-800";
            break;
          case "Completed":
            color = "bg-green-100 text-green-800";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }
        return (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}
          >
            {status}
          </motion.span>
        );
      },
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 gap-6 p-6"
    >
      {/* Services Table */}
      <motion.div 
        className="col-span-8 flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h2 
          className="text-[30px] mb-6 text-[#6D6D6D] font-semibold"
          whileHover={{ scale: 1.01 }}
        >
          Services
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
                  whileHover={{ 
                    scale: 1.005,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    zIndex: 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="hover:shadow-md"
                >
                  {children}
                </motion.tr>
              )
            }
          }}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
          }}
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div 
        className="col-span-4 flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.h2 
          className="text-[30px] mb-6 text-[#6D6D6D] font-semibold"
          whileHover={{ scale: 1.01 }}
        >
          My Requests
        </motion.h2>
        <Table
          columns={columnsRequests}
          dataSource={requestsData}
          pagination={false}
          className="custom-table flex-1"
          components={{
            body: {
              row: ({ children, ...props }) => (
                <motion.tr
                  {...props}
                  whileHover={{ 
                    scale: 1.005,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    zIndex: 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="hover:shadow-md"
                >
                  {children}
                </motion.tr>
              )
            }
          }}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Tables;