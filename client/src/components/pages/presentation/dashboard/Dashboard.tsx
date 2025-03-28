import React from "react";
import   './Dashboard.css'
import { Card, Table, Button } from "antd";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import image1 from "../../../../assets/images/dashboard/image1.png";
import image2 from "../../../../assets/images/dashboard/image2.png";
import image3 from "../../../../assets/images/dashboard/image3.png";
import image4 from "../../../../assets/images/dashboard/image4.png";

interface Request {
  key: string;
  name: string;
  submissionDate: string;
  status: "Pending" | "In-progress" | "Completed";
}

interface StatCard {
  title: string;
  value: number;
  image: string;
  bgColor: string;
  textColor: string;
  iconBgColor?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const statCards: StatCard[] = [
  {
    title: "Total Requests",
    value: 234,
    image: image1,
    bgColor: "bg-[#3B82F6]",
    textColor: "#fff",
    iconBgColor: "white",
  },
  {
    title: "Pending Requests",
    value: 234,
    image: image2,
    bgColor: "bg-white",
    textColor: "#FFBB46",
    iconBgColor: "#FFBB46",
  },
  {
    title: "Completed Requests",
    value: 234,
    image: image3,
    bgColor: "bg-white",
    textColor: "#0B7E0F",
    iconBgColor: "#0B7E0F",
  },
  {
    title: "In-progress Requests",
    value: 234,
    image: image4,
    bgColor: "bg-white",
    textColor: "#3B82F6",
    iconBgColor: "#3B82F6",
  },
];

const recentRequests: Request[] = [
  {
    key: "1",
    name: "IT Support",
    submissionDate: "2025-03-29",
    status: "Pending",
  },
  {
    key: "2",
    name: "Network Setup",
    submissionDate: "2025-03-28",
    status: "In-progress",
  },
  {
    key: "3",
    name: "Software Installation",
    submissionDate: "2025-03-27",
    status: "Completed",
  },
  {
    key: "4",
    name: "Hardware Repair",
    submissionDate: "2025-03-26",
    status: "Pending",
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
          variants={containerVariants}
        >
          {statCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
              style={{borderColor: card.textColor}}
                whileHover={{ y: -5 }}
                className={`${card.bgColor} ${card.textColor} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div style={{ color: card.textColor }}>
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            backgroundColor: card.iconBgColor
                              ? card.iconBgColor
                              : "white",
                          }}
                          className={` w-10 h-10 rounded-full flex items-center justify-center`}
                        >
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {card.value}
                        </h3>
                      </div>
                      <p className="text-sm font-medium">{card.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
           {/* Quick Actions */}
        <motion.div
          className="flex flex-wrap gap-2"
          variants={itemVariants}
        >
          <Button
            type="primary"
            className="flex items-center h-12 px-6 bg-[#fff] hover:bg-blue-700 rounded-lg flex-1 text-primary"
            icon={<ArrowRightOutlined />}
          >
            Manage Services
          </Button>
          <Button
          type="primary"
            className="flex items-center h-12 px-6 bg-[#fff] hover:bg-blue-700 rounded-lg flex-1 text-primary"
            icon={<ArrowRightOutlined />}
          >
            Manage Requests
          </Button>
        </motion.div>
        </motion.div>

       

        {/* Recent Requests */}
        <motion.div variants={itemVariants}>
          <Card
            title={
              <h2 className="text-[30px] mb-6 text-[#6D6D6D] font-semibold">
                Recent Requests
              </h2>
            }
            className="rounded-xl shadow-sm hover:shadow-md transition-all"
            extra={
              <Button type="link" className="text-blue-600 p-0 font-medium">
                View all requests
              </Button>
            }
            bodyStyle={{ padding: 0 }}
          >
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  render: (text) => (
                    <span className="font-medium text-gray-800">{text}</span>
                  ),
                },
                {
                  title: "Submission Date",
                  dataIndex: "submissionDate",
                  key: "submissionDate",
                  render: (text) => (
                    <span className="text-gray-600">{text}</span>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => {
                    const statusStyles = {
                      Pending: "bg-yellow-100 text-yellow-800",
                      "In-progress": "bg-blue-100 text-blue-800",
                      Completed: "bg-green-100 text-green-800",
                    };
                    return (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.Pending}`}
                      >
                        {status}
                      </span>
                    );
                  },
                },
                {
                  title: "",
                  key: "action",
                  render: () => (
                    <Button
                      type="link"
                      className="flex items-center text-blue-600 p-0 font-medium"
                      icon={<ArrowRightOutlined className="ml-1" />}
                    >
                      Details
                    </Button>
                  ),
                },
              ]}
              dataSource={recentRequests}
              pagination={false}
              className="custom-table"
              rowClassName={() => "hover:bg-gray-50 cursor-pointer"}
            />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
