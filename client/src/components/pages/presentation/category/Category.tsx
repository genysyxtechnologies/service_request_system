import { Table, Pagination, Button, Spin, ConfigProvider } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsPencilSquare, BsPlusCircle } from "react-icons/bs";
import NewCategory from "./NewCategory";
import image2 from "../../../../assets/images/services/image2.png";
import { useCategory } from "../../../services/useCategory";
import { useSelector } from "react-redux";
import NewService from "../Services/NewService";
import UpdateCategory from "./UpdateCategory";

const Services = () => {
  const { token, isAdmin } = useSelector((state: any) => state.auth);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [isServiceModalVisible, setIsServiceModalVisible] =
    useState<boolean>(false);

  const {
    fetchCategories,
    allCategories,
    loading,
    error,
    setUpdateValue,
    updateValue,
    updateCategory,
    setCategoryId,
    categoryId,
  } = useCategory(token, isAdmin);

  useEffect(() => {
    (async () => {
      await fetchCategories();
    })();
  }, []);

  const handleUpdateClick = (record: any) => {
    if (!isAdmin) {
      return;
    }
    setUpdateValue(record.name);
    setCategoryId(record.id);
    setIsUpdateModalVisible(true);
  };

  const handleNewServiceClick = (record: any) => {
    setCategoryId(record.id);
    setIsServiceModalVisible(true);
  };

  // Calculate paginated data
  const paginatedData = allCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          className="font-medium text-gray-800 flex items-center gap-3"
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-blue-600 font-semibold">
              {text.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          <span className="text-gray-700">{text}</span>
        </motion.div>
      ),
    },
    {
      title: "New Service",
      key: "newService",
      render: (record: any) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => handleNewServiceClick(record)}
            type="text"
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <BsPlusCircle className="text-lg" />
              <span className="font-medium">New Service</span>
            </motion.div>
          </Button>
        </motion.div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => handleUpdateClick(record)}
            type="text"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <BsPencilSquare className="text-lg" />
              <span className="font-medium">Update</span>
            </motion.div>
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: "#3b82f6",
            itemActiveColorDisabled: "rgba(255, 255, 255, 0.25)",
            itemBg: "#ffffff",
            itemLinkBg: "#ffffff",
          },
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between w-full mb-8">
          <motion.h2
            className="text-2xl md:text-3xl text-gray-800 font-bold"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            Categories
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
              onClick={() => setModalVisible(true)}
              type="primary"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium h-10 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              size="middle"
            >
              <motion.img
                src={image2}
                alt="Create service"
                className="h-5 w-5"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span>Create Category</span>
            </Button>
          </motion.div>
        </div>

        <Spin spinning={loading} tip="Loading categories..." size="large">
          <Table
            columns={columnsServices}
            dataSource={paginatedData}
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
                      backgroundColor: "rgba(239, 246, 255, 0.5)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
            rowClassName={() => "hover:bg-blue-50"}
          />
        </Spin>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center mt-8"
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={allCategories.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            className="custom-pagination"
            itemRender={(page, type, originalElement) => (
              <motion.div
                whileHover={{ scale: type === "page" ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                {originalElement}
              </motion.div>
            )}
            showTotal={(total, range) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 mr-4"
              >
                Showing {range[0]}-{range[1]} of {total} items
              </motion.div>
            )}
          />
        </motion.div>

        <NewCategory
          visible={isModalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={() => {}}
        />
        <NewService
          categoryId={categoryId}
          visible={isServiceModalVisible}
          onClose={() => setIsServiceModalVisible(false)}
        />

        {isUpdateModalVisible && (
          <UpdateCategory
            visible={isUpdateModalVisible}
            onCancel={() => setIsUpdateModalVisible(false)}
            onSave={async () => {
              setIsUpdateModalVisible(false);
              await updateCategory();
              await fetchCategories();
            }}
            name={updateValue}
            setName={setUpdateValue}
            loading={loading}
            error={error}
            title="Edit Category"
            successMessage="Category updated successfully!"
            buttonText="Update"
          />
        )}
      </motion.div>
    </ConfigProvider>
  );
};

export default Services;
