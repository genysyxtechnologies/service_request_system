import React from "react";
import { Modal, Form, Input, Button, message, Typography, Divider, Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useCategory } from "../../../services/useCategory";
import {
  LoadingOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  TagOutlined
} from "@ant-design/icons";

interface CreateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const { Title, Text } = Typography;

const NewCategory: React.FC<CreateCategoryProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const { token, isAdmin } = useSelector((state: any) => state.auth);
  const {
    categories,
    setCategories,
    createCategory,
    error,
    loading,
    fetchCategories,
  } = useCategory(token, isAdmin);
  const [messageApi, contextHolder] = message.useMessage();

  const validateCategoryName = (_: any, value: string) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error("Please enter a category name"));
    }
    if (value.length < 3) {
      return Promise.reject(
        new Error("Category name must be at least 3 characters")
      );
    }
    if (value.length > 50) {
      return Promise.reject(
        new Error("Category name cannot exceed 50 characters")
      );
    }
    return Promise.resolve();
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      await createCategory();
      await fetchCategories();

      messageApi.success({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <CheckCircleFilled className="text-green-500 text-lg" />
            <span className="font-medium">Category created successfully!</span>
          </motion.div>
        ),
        duration: 3,
        className: "custom-message-success",
        style: {
          marginTop: '20px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
        }
      });

      onSave();
      form.resetFields();
    } catch (errorInfo) {

      //  error messages
      if (errorInfo.errorFields) {
        errorInfo.errorFields.forEach((field) => {
          messageApi.error({
            content: (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <ExclamationCircleOutlined className="text-red-500 text-lg" />
                <span className="font-medium">{field.errors[0]}</span>
              </motion.div>
            ),
            duration: 4,
            className: "custom-message-error",
            style: {
              marginTop: '20px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
            }
          });
        });
      }
    }
  };

  return (
    <>
      {contextHolder}
      <AnimatePresence>
        {visible && (
          <Modal
            title={
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center"
              >
                <TagOutlined className="text-blue-500 mr-3 text-xl" />
                <Title level={4} style={{ margin: 0 }} className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Create New Category
                </Title>
              </motion.div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            className="rounded-2xl overflow-hidden category-modal"
            width={600}
            styles={{
              body: { padding: "28px" },
              header: { 
                borderBottom: "1px solid #f0f0f0",
                padding: "16px 24px",
                backgroundColor: "#fafafa" 
              },
              mask: { backdropFilter: "blur(4px)" },
              content: { 
                boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
                borderRadius: "16px"
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text className="text-gray-600 block mb-6">
                Create a new category to organize service requests. Categories help users find the right department for their requests.
              </Text>
              <Divider className="my-4" />
            </motion.div>
            <Form form={form} layout="vertical" className="category-form">
              {/* Category Name Input with Validation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <Form.Item
                  name="categoryName"
                  label={
                    <motion.div
                      className="text-gray-700 font-medium flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <Text strong className="mr-1">Category Name</Text>
                      <span className="text-red-500 mr-2">*</span>
                      <Tooltip title="Choose a clear, descriptive name that represents the type of service requests this category will handle.">
                        <InfoCircleOutlined className="text-blue-400 cursor-help text-sm" />
                      </Tooltip>
                    </motion.div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Category name is required",
                    },
                    {
                      validator: validateCategoryName,
                    },
                  ]}
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Input
                    value={categories.name}
                    onChange={(e) => {
                      setCategories({ ...categories, name: e.target.value });
                      // Trigger validation on change
                      form.validateFields(["categoryName"]);
                    }}
                    placeholder="e.g. IT Support"
                    prefix={<TagOutlined className="text-gray-400 mr-2" />}
                    className="rounded-xl h-12 px-4 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                    autoComplete="off"
                    maxLength={50}
                  />
                </Form.Item>
              </motion.div>

              {/* Error Message Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="bg-red-50 border border-red-200 p-4 mb-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start">
                      <ExclamationCircleOutlined className="text-red-500 text-lg mr-3 mt-0.5" />
                      <div>
                        <Text strong className="text-red-700 block mb-1">Error</Text>
                        <Text className="text-red-600">
                          {error.message || "An error occurred while creating the category"}
                        </Text>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Divider className="my-6" />
              
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex justify-end space-x-4 mt-4"
              >
                <Button
                  onClick={() => {
                    form.resetFields();
                    onCancel();
                  }}
                  className="h-12 px-6 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 flex items-center justify-center min-w-[100px]"
                  disabled={loading}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={handleSave}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center min-w-[160px]"
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : null}
                  size="large"
                >
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </motion.div>
            </Form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewCategory;
