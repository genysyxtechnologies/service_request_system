import React, { useContext, useEffect, useState } from "react";
import { Table, Select, Pagination, Tag, Spin, Empty } from "antd";
import { motion } from "framer-motion";
import { useRequest } from "../../../services/useRequest";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateRequestStatusModal from "./UpdateRequest";
import RequestContext from "../../../../context/request.context/RequestContext";

dayjs.extend(relativeTime);

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const RequestTable: React.FC = () => {
  const { refreshRequest } = useContext(RequestContext);
  const { token, isAdmin } = useSelector((state: any) => state.auth);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { requests, fetchRequests, loading, pagination } = useRequest(
    token,
    isAdmin
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requestId, setRequestId] = useState<number>(0);

  const handleStatusUpdate = async (status: string) => {};


  const handleTableChange = (pagination: any) => {
    fetchRequests(pagination.current, pagination.pageSize);
  };

  // LOAD DATA IMMEDIATELY THE COMPONENT MOUNTED
  useEffect(() => {
    fetchRequests();
  }, []);

 
// LOAD TABLE DATA AFTER A SUCCESSFULLY UPDATE OF REQUEST
  useEffect(() => {
    fetchRequests();
  }, [refreshRequest]);

  const columns = [
    {
      title: "Request Details",
      dataIndex: "requestData",
      key: "request",
      render: (text: string, record: any) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <p className="font-medium text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">
              {record.serviceName}
            </span>
            <span className="text-xs text-gray-400">
              {dayjs(record.submissionDate).fromNow()}
            </span>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
      render: (text: string) => (
        <motion.span whileHover={{ scale: 1.05 }} className="text-gray-600">
          {text}
        </motion.span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const formattedStatus = status.split("_").join(" ");
        return (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Tag
              className={`px-3 py-1 rounded-full capitalize ${statusColors[status]}`}
            >
              {formattedStatus.toLowerCase()}
            </Tag>
          </motion.div>
        );
      },
      filters: [
        { text: "All", value: "ALL" },
        { text: "Pending", value: "PENDING" },
        { text: "In Progress", value: "IN_PROGRESS" },
        { text: "Completed", value: "COMPLETED" },
        { text: "Rejected", value: "REJECTED" },
      ],
      onFilter: (value: any, record: any) => {
        if (value === "ALL") return true;
        return record.status === value;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() =>
              setSelectedRow(record.id === selectedRow ? null : record.id)
            }
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {record.id === selectedRow ? "Hide Details" : "View Details"}
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
      className="p-6 bg-white rounded-xl shadow-sm"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-semibold text-gray-800"
          >
            Service Requests
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-3 w-full md:w-auto mt-3 md:mt-0"
          >
            <Select
              defaultValue="ALL"
              className="min-w-[150px]"
              onChange={(value) => setFilter(value)}
              value={filter}
              options={[
                { value: "ALL", label: "All Requests" },
                { value: "PENDING", label: "Pending" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "COMPLETED", label: "Completed" },
                { value: "REJECTED", label: "Rejected" },
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
          <Spin spinning={loading}>
            <Table
              className="rounded-xl overflow-hidden border border-gray-100"
              dataSource={requests.filter(
                (request) => filter === "ALL" || request.status === filter
              )}
              columns={columns}
              pagination={false}
              rowKey="id"
              rowClassName={(record) =>
                `transition-all duration-200 ${
                  selectedRow === record.id
                    ? "bg-indigo-50"
                    : "hover:bg-gray-50"
                }`
              }
              onRow={(record) => ({
                onClick: () =>
                  setSelectedRow(record.id === selectedRow ? null : record.id),
              })}
              expandable={{
                expandedRowRender: (record) => (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-gray-50 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Request Details
                        </h4>
                        <p className="text-gray-600">{record.requestData}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Service Name
                        </h4>
                        <p className="text-gray-600">{record.serviceName}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Satus
                        </h4>
                        <p className="text-gray-600">{record.status}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Submitted By
                        </h4>
                        <p className="text-gray-600">{record.submittedBy}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Additional Information
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <span className="font-medium">Submitted:</span>{" "}
                            {dayjs(record.submissionDate).format(
                              "MMMM D, YYYY h:mm A"
                            )}
                          </p>
                          {record.attachmentUrl && (
                            <p className="text-gray-600">
                              <span className="font-medium">Attachment:</span>{" "}
                              <a
                                href={record.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                View File
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => {
                            setRequestId(record.id);
                            setIsModalVisible(true);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </motion.div>
                ),
                rowExpandable: (record) => record.id === selectedRow,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      <span className="text-gray-500">No requests found</span>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
            />
          </Spin>
        </motion.div>

        {/* Pagination */}
        {requests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-between items-center mt-6"
          >
            <div className="text-sm text-gray-500">
              Showing {requests.length} of {pagination.total} requests
            </div>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handleTableChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              className="[&_.ant-pagination-item-active]:bg-indigo-600 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active]:text-white"
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
      </div>
      <UpdateRequestStatusModal
        requestId={requestId}
        initialStatus="IN_PROGRESS"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onUpdate={() => handleStatusUpdate("")}
      />
    </motion.div>
  );
};

export default RequestTable;
