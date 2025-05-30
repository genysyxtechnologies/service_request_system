import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Divider,
  message,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../../../services/useServices";
import { useSelector } from "react-redux";
import { useCategory } from "../../../services/useCategory";
import {
  FileTextOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  FormOutlined,
  TagsOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;
interface NewServiceProps {
  visible: boolean;
  onClose: () => void;
  categoryId: number;
}

const NewService: React.FC<NewServiceProps> = ({
  visible,
  onClose,
  categoryId,
}) => {
  const { token, user } = useSelector((state: any) => state.auth);
  const { services, setServices, createService, loading } = useServices(token);
  const { allCategories, fetchCategories } = useCategory(token, user?.roles.includes('ADMIN') || user?.roles.includes('SUPER_ADMIN'));
  const [form] = Form.useForm();
  const [, contextHolder] = message.useMessage();

  console.log(user)

  const handleSave = async () => {
    try {
      await form.validateFields();
      await createService();

      form.resetFields();
      // Reset services state to initial values
      setServices({
        name: "",
        description: "",
        categoryId: 0,
        departmentId: 0,
        isActive: true,
        fields: "",
      });
      onClose();
    } catch (errorInfo) {
      return errorInfo;
    }
  };

  // watch for visibility changes before adding categoryId
  useEffect(() => {
    if (visible) {
      // Reset form and services state when dialog opens
      form.resetFields();
      setServices({
        name: "",
        description: "",
        categoryId: categoryId,
        departmentId: 0,
        isActive: true,
        fields: "",
      });
      form.setFieldsValue({ category: categoryId });
      fetchCategories();
    }
  }, [visible, categoryId]);

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
                className="text-2xl font-bold text-gray-800 flex items-center"
              >
                <FormOutlined className="mr-3 text-blue-500" /> Create New
                Service
              </motion.div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="rounded-2xl overflow-hidden"
            width={600}
            styles={{
              body: { padding: "24px 32px" },
              header: {
                borderBottom: "1px solid #f0f0f0",
                padding: "16px 24px",
              },
              mask: {
                backdropFilter: "blur(2px)",
                background: "rgba(0, 0, 0, 0.45)",
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Text type="secondary" className="text-sm">
                Create a new service for your organization. Fill in all the
                required information below.
              </Text>
            </motion.div>

            <Divider className="my-4" />

            <Form
              form={form}
              layout="vertical"
              className="mt-4"
              requiredMark="optional"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <Form.Item
                  name="serviceName"
                  label={
                    <motion.span
                      className="text-gray-700 font-medium flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <AppstoreOutlined className="mr-2 text-blue-500" />{" "}
                      Service Name <span className="text-red-500 ml-1">*</span>
                    </motion.span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter the service name.",
                    },
                    {
                      min: 3,
                      message: "Service name must be at least 3 characters",
                    },
                    {
                      max: 50,
                      message: "Service name cannot exceed 50 characters",
                    },
                  ]}
                  tooltip={{
                    title: "Enter a descriptive name for the service",
                    icon: <InfoCircleOutlined className="text-blue-400" />,
                  }}
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Input
                    value={services.name}
                    onChange={(e) =>
                      setServices({ ...services, name: e.target.value })
                    }
                    placeholder="e.g. Network Support"
                    className="rounded-xl h-12 px-4 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                    suffix={<FileTextOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Form.Item
                  name="description"
                  label={
                    <motion.span
                      className="text-gray-700 font-medium flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <InfoCircleOutlined className="mr-2 text-blue-500" />{" "}
                      Description <span className="text-red-500 ml-1">*</span>
                    </motion.span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter the description.",
                    },
                    {
                      min: 10,
                      message: "Description must be at least 10 characters",
                    },
                    {
                      max: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  ]}
                  tooltip="Provide a detailed description of the service"
                  validateTrigger={["onChange", "onBlur"]}
                >
                  <Input.TextArea
                    value={services.description}
                    onChange={(e) =>
                      setServices({ ...services, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Describe what this service provides and any important details"
                    className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm p-3"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Form.Item
                  name="category"
                  label={
                    <motion.span
                      className="text-gray-700 font-medium flex items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <TagsOutlined className="mr-2 text-blue-500" /> Category{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </motion.span>
                  }
                  rules={[
                    { required: true, message: "Please select a category." },
                  ]}
                  tooltip="Select the appropriate category for this service"
                  validateTrigger={["onChange", "onBlur"]}
                  initialValue={categoryId}
                >
                  <Select
                    value={services.categoryId}
                    onChange={(value: number) =>
                      setServices({ ...services, categoryId: value })
                    }
                    placeholder="Select a category"
                    className="rounded-xl h-12 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-12 [&_.ant-select-selector]:flex [&_.ant-select-selector]:items-center [&_.ant-select-selector]:border-gray-300 [&_.ant-select-selector:hover]:border-blue-400 [&_.ant-select-selector]:transition-all [&_.ant-select-selector]:duration-300 [&_.ant-select-selection-item]:flex [&_.ant-select-selection-item]:items-center shadow-sm"
                    dropdownStyle={{
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    {allCategories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <Divider className="my-6" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex justify-end space-x-3 mt-8"
              >
                <Button
                  onClick={() => {
                    form.resetFields();
                    // Reset services state when canceling
                    setServices({
                      name: "",
                      description: "",
                      categoryId: 0,
                      departmentId: 0,
                      isActive: true,
                      fields: "",
                    });
                    onClose();
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
                  {loading ? "Creating..." : "Create Service"}
                </Button>
              </motion.div>
            </Form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewService;
