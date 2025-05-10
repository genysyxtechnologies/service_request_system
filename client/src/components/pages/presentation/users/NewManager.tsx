import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  message,
  Divider,
  Alert,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  IdcardOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import useManagers from "../../../services/useManagers";
import { ManagerValues } from "../../../../utils/types";

const { Title, Text } = Typography;

const ManagerCreationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);

  const { token } = useSelector((state: any) => state.auth);
  const { createManager, loading } = useManagers(token);

  const onFinish = async (values: ManagerValues) => {
    try {
      const response = await createManager(values);
      if (response?.created) {
        message.success("Manager created successfully!");
        setSuccess(true);
        form.resetFields();
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, scale: 0.98 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full"
    >
      <Card
        className="shadow-2xl rounded-2xl overflow-hidden border-0"
        headStyle={{
          background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
          border: "none",
          padding: "24px",
        }}
        bodyStyle={{ padding: "24px" }}
        title={
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Space direction="vertical" size={2} className="w-full">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="text-white hover:text-white hover:bg-white/10 p-0 mb-2"
              />
              <Title level={3} className="text-white mb-0">
                Create New Manager
              </Title>
              <Text type="secondary" className="text-white/80">
                Add a new manager to this system
              </Text>
            </Space>
          </motion.div>
        }
      >
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Alert
                message="Manager created successfully!"
                type="success"
                showIcon
                closable
                onClose={() => setSuccess(false)}
                className="border-0 bg-green-50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Row gutter={16}>
            <Col span={12}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Form.Item
                  name="firstName"
                  label={
                    <Text strong className="text-gray-700">
                      First Name
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please input first name!" },
                    { min: 2, message: "Must be at least 2 characters" },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="Enter first name"
                    size="large"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500 transition-all"
                  />
                </Form.Item>
              </motion.div>
            </Col>
            <Col span={12}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Form.Item
                  name="lastName"
                  label={
                    <Text strong className="text-gray-700">
                      Last Name
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please input last name!" },
                    { min: 2, message: "Must be at least 2 characters" },
                  ]}
                >
                  <Input
                    prefix={<SolutionOutlined className="text-gray-400" />}
                    placeholder="Enter last name"
                    size="large"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500 transition-all"
                  />
                </Form.Item>
              </motion.div>
            </Col>
          </Row>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Form.Item
              name="username"
              label={
                <Text strong className="text-gray-700">
                  Username
                </Text>
              }
              rules={[
                { required: true, message: "Please input the username!" },
                { min: 3, message: "Username must be at least 3 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter username"
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500 transition-all"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-4"
          >
            <Form.Item
              name="email"
              label={
                <Text strong className="text-gray-700">
                  Email Address
                </Text>
              }
              rules={[
                { required: true, message: "Please input the email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter email address"
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500 transition-all"
              />
            </Form.Item>
          </motion.div>

          <Divider className="my-6" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="rounded-lg h-12 font-semibold mt-2 shadow-lg hover:shadow-xl transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  border: "none",
                }}
                icon={!loading && <CheckCircleOutlined />}
              >
                {loading ? "Creating..." : "Create Manager"}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center"
      ></motion.div>
    </motion.div>
  );
};

export default ManagerCreationForm;
