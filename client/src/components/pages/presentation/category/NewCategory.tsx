import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useCategory } from "../../../services/useCategory";
import {
  LoadingOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface CreateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const NewCategory: React.FC<CreateCategoryProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const { token } = useSelector((state: any) => state.auth);
  const {
    categories,
    setCategories,
    createCategory,
    error,
    loading,
    fetchCategories,
  } = useCategory(token);
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
            <span>Category created successfully!</span>
          </motion.div>
        ),
        duration: 2,
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
                <span>{field.errors[0]}</span>
              </motion.div>
            ),
            duration: 3,
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
                className="text-2xl font-bold text-gray-800"
              >
                Create New Category
              </motion.div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            className="rounded-2xl overflow-hidden"
            width={600}
            styles={{
              body: { padding: "24px" },
              header: { borderBottom: "1px solid #f0f0f0" },
            }}
          >
            <Form form={form} layout="vertical">
              {/* Category Name Input with Validation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <Form.Item
                  name="categoryName"
                  label={
                    <motion.span
                      className="text-gray-700 font-medium flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      Category Name <span className="text-red-500 ml-1">*</span>
                    </motion.span>
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
                    className="rounded-xl h-12 px-4 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                  />
                </Form.Item>
              </motion.div>

              {/* Error Message Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r-lg"
                >
                  <p className="text-red-700">
                    {error.message || "An error occurred"}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex justify-end space-x-3 mt-8"
              >
                <Button
                  onClick={() => {
                    form.resetFields();
                    onCancel();
                  }}
                  className="h-12 px-6 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 flex items-center"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={handleSave}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : null}
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
