import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Avatar, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'antd/es/form/Form';

interface UserUpdateFormProps {
  username: string;
  email: string;
  avatar?: string;
  onUpdate?: (values: { username: string; email: string }) => Promise<void>;
}

const UpdateUserForm: React.FC<UserUpdateFormProps> = ({ 
  username: initialUsername, 
  email: initialEmail,
  avatar,
  onUpdate
}) => {
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  useEffect(() => {
    form.setFieldsValue({
      username: initialUsername,
      email: initialEmail
    });
  }, [initialUsername, initialEmail, form]);

  const handleSubmit = async (values: { username: string; email: string }) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(values);
      }
      message.success({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Profile updated successfully!
          </motion.div>
        ),
        duration: 2,
      });
      setIsEditing(false);
    } catch (error) {
      message.error({
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Failed to update profile. Please try again.
          </motion.div>
        ),
        duration: 2,
      });
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
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.01,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-gray-50"
    >
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        className="w-full max-w-md"
      >
        <Card
          title={
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar 
                  size={64} 
                  src={currentAvatar} 
                  icon={<UserOutlined />} 
                  className="bg-blue-100 text-blue-600 shadow-md"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
                  <p className="text-gray-500 text-sm">Update your account information</p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Button>
              )}
            </motion.div>
          }
          bordered={false}
          className="shadow-lg rounded-2xl overflow-hidden border border-gray-100 bg-white"
          headStyle={{ borderBottom: 'none' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {isEditing ? (
                <>
                  <motion.div
                    key="editing-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div variants={itemVariants}>
                      <Form.Item
                        name="username"
                        label={<span className="text-gray-600 font-medium">Username</span>}
                        rules={[
                          { required: true, message: 'Please input your username!' },
                          { min: 3, message: 'Username must be at least 3 characters!' }
                        ]}
                      >
                        <Input 
                          prefix={<UserOutlined className="text-gray-400" />} 
                          placeholder="Enter your username" 
                          className="py-3 px-4 rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:shadow-blue-100"
                        />
                      </Form.Item>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Form.Item
                        name="email"
                        label={<span className="text-gray-600 font-medium">Email</span>}
                        rules={[
                          { required: true, message: 'Please input your email!' },
                          { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined className="text-gray-400" />} 
                          placeholder="Enter your email" 
                          className="py-3 px-4 rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:shadow-blue-100"
                        />
                      </Form.Item>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="flex justify-end gap-3 pt-2"
                    >
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="h-10 px-6 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        icon={<CheckOutlined />}
                        className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 border-none font-medium shadow-md transition-all duration-300"
                      >
                        Save Changes
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  key="view-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <div className="mb-1 text-sm text-gray-500 font-medium">Username</div>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                      {initialUsername}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="mb-1 text-sm text-gray-500 font-medium">Email</div>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                      {initialEmail}
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    className="pt-4"
                  >
                    <Divider className="my-4" />
                    <div className="text-xs text-gray-400 text-center">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UpdateUserForm;