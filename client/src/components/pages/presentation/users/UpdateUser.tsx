import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Avatar } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import useManagers from "../../../services/useManagers";

interface UserUpdateFormProps {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  onUpdate?: (values: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  avatar?: string;
}

const UpdateUserForm: React.FC<UserUpdateFormProps> = ({
  username: initialUsername,
  email: initialEmail,
  firstName: initialFirstName,
  lastName: initialLastName,
  onUpdate,
  avatar,
}) => {
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  const { token, user } = useSelector((state: any) => state.auth);
  const { updateUser } = useManagers(token);

  useEffect(() => {
    form.setFieldsValue({
      username: initialUsername,
      email: initialEmail,
      firstName: initialFirstName,
      lastName: initialLastName,
    });
  }, [initialUsername, initialEmail, form]);

  const handleSubmit = async (values: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(values);
      }
      await updateUser({ ...values, id: user.id });
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full p-4"
    >
      <Card
        title={
          <motion.div
            variants={itemVariants}
            custom={0}
            className="text-xl font-semibold text-gray-800 flex items-center gap-3"
          >
            <Avatar
              size={40}
              src={currentAvatar}
              icon={<UserOutlined />}
              className="bg-blue-100 text-blue-600"
            />
            Update Profile
          </motion.div>
        }
        bordered={false}
        className="shadow-lg rounded-lg overflow-hidden border border-gray-100"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            custom={0}
            className="flex gap-4 items-center"
          >
            <Form.Item
              className="flex-1"
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please input your first name!" },
                {
                  min: 2,
                  message: "First name must be at least 2 characters!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="First Name"
                className="py-2 px-3 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please input your last name!" },
                {
                  min: 2,
                  message: "Last name must be at least 2 characters!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="First Name"
                className="py-2 px-3 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants} custom={1}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, message: "Username must be at least 3 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
                className="py-2 px-3 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants} custom={2}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                className="py-2 px-3 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants} custom={3}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 border-none h-10 font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01]"
              >
                Update Profile
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default UpdateUserForm;
