import { Button, Table } from "antd";
import { motion } from "framer-motion";

interface SidebarProps {
  onItemClick: () => void;
}

const ServicesCategory = ({ onItemClick }: SidebarProps) => {
  const servicesData = [
    {
      key: "1",
      name: "IT Support",
      category: "IT Services",
    },
    {
      key: "2",
      name: "Network Setup",
      category: "IT Services",
    },
    {
      key: "3",
      name: "Software Installation",
      category: "IT Services",
    },
    {
      key: "4",
      name: "Hardware Repair",
      category: "IT Services",
    },
    {
      key: "5",
      name: "Email Setup",
      category: "IT Services",
    },
    {
      key: "6",
      name: "Security Audit",
      category: "Security",
    },
    {
      key: "7",
      name: "Data Backup",
      category: "IT Services",
    },
    {
      key: "8",
      category: "Cloud Services",
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
      )
    },
    { 
      title: "Category", 
      dataIndex: "category", 
      key: "category",
      render: (text: string, record: any, index: number) => (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
          whileHover={{ scale: 1.05 }}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            text === "IT Services" ? "bg-blue-100 text-blue-800" :
            text === "Security" ? "bg-red-100 text-red-800" :
            "bg-purple-100 text-purple-800"
          }`}
        >
          {text}
        </motion.span>
      )
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => onItemClick()} 
              type="primary"
              className="shadow-md hover:shadow-lg transition-all"
            >
              New request
            </Button>
          </motion.div>
        </motion.div>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  backgroundColor: "rgba(245, 245, 245, 0.8)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 }
                }}
                className="group"
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
  );
};

export default ServicesCategory;