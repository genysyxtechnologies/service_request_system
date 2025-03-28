import React, { useState } from "react";
import { Table, Select, Pagination } from "antd";
import { motion } from "framer-motion";

interface Request {
  key: number;
  name: string;
  submissionDate: string;
  status: string;
  priority?: "Low" | "Medium" | "High";
}

const requests: Request[] = [
  {
    key: 1,
    name: "My Printer is Jammed",
    submissionDate: "14 Aug 2025",
    status: "In Progress",
  },
  {
    key: 2,
    name: "Software License Renewal",
    submissionDate: "13 Aug 2025",
    status: "Completed",
  },
  {
    key: 3,
    name: "VPN Access Request",
    submissionDate: "12 Aug 2025",
    status: "Completed",
  },
  {
    key: 4,
    name: "Monitor Replacement",
    submissionDate: "11 Aug 2025",
    status: "Completed",
  },
  {
    key: 5,
    name: "Password Reset",
    submissionDate: "10 Aug 2025",
    status: "Completed",
  },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-gray-100 text-gray-800",
};

const RequestTable: React.FC = () => {
  const [filter, setFilter] = useState<string>("All Requests");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const filteredRequests =
    filter === "All Requests"
      ? requests
      : requests.filter((request) => request.status === filter);

  const columns = [
    {
      title: "Request",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Request) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: record.key * 0.05 }}
          className="flex items-center"
        >
          <div>
            <p className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
              {text}
            </p>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Date",
      dataIndex: "submissionDate",
      key: "date",
      render: (priority: string) => (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityColors[priority] || " text-gray-800"
          }`}
        >
          {priority}
        </motion.span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${statusColors[status]}`}
        >
          <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
          {status}
        </motion.div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Request) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() =>
              setSelectedRow(record.key === selectedRow ? null : record.key)
            }
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {record.key === selectedRow ? "Hide Details" : "View Details"}
          </button>
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-semibold text-gray-800"
          >
            My Requests
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Select
              defaultValue="All Requests"
              className="w-full md:w-64"
              onChange={(value) => setFilter(value)}
              options={[
                { value: "All Requests", label: "All Requests" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Table
            className="rounded-xl shadow-md overflow-hidden border border-gray-200 bg-white"
            dataSource={filteredRequests}
            columns={columns}
            pagination={false}
            rowClassName={(record) =>
              `transition-all duration-200 ${
                selectedRow === record.key ? "bg-indigo-50" : "hover:bg-gray-50"
              }`
            }
            onRow={(record) => ({
              onClick: () =>
                setSelectedRow(record.key === selectedRow ? null : record.key),
            })}
            expandable={{
              expandedRowRender: (record) => (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gray-50 border-t border-gray-200"
                >
                  <h4 className="font-medium text-gray-700 mb-2">
                    Request Details
                  </h4>
                  <p className="text-gray-600">
                    Information about {record.name} 
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                      Share
                    </button>
                  </div>
                </motion.div>
              ),
              rowExpandable: (record) => record.key === selectedRow,
              expandRowByClick: true,
            }}
          />
        </motion.div>

        {/* Pagination */}
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
      </div>
    </motion.div>
  );
};

export default RequestTable;
