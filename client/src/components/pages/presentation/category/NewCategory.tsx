import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { motion } from "framer-motion";

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

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        onSave();
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title={
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-800"
        >
          Create New Category
        </motion.div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="rounded-xl"
      bodyStyle={{ padding: "24px" }}
    >
      <Form form={form} layout="vertical">
        {/* Category Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Form.Item
            name="categoryName"
            label={
              <span className="text-gray-700 font-medium">
                Category Name <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "Please enter the category name." }]}
          >
            <Input
              placeholder="e.g. IT Support"
              className="rounded-lg py-2 px-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </Form.Item>
        </motion.div>

        {/* Description Input */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Form.Item
            name="description"
            label={
              <span className="text-gray-700 font-medium">
                Description <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please enter a detailed description." },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe this category in detail..."
              className="rounded-lg py-2 px-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </Form.Item>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end space-x-3 mt-6"
        >
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            className="h-10 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Create Category
          </Button>
        </motion.div>
      </Form>
    </Modal>
  );
};

export default NewCategory;