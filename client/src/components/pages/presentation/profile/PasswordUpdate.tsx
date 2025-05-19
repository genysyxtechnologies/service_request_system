import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Typography,
  Divider,
  theme,
  Space,
  Tooltip,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckOutlined,
  CloseOutlined,
  SafetyOutlined,
  IeOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import zxcvbn from "zxcvbn";
import { ChangePasswordFormValues } from "../../../../utils/types";
import { useAuth } from "../../../services/useAuth";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { useToken } = theme;

interface PasswordRequirementsProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<{ strength: number }> = ({
  strength,
}) => {
  const { token } = useToken();

  const segments = [
    { color: token.colorError, width: 25, label: "Weak" },
    { color: token.colorWarning, width: 50, label: "Fair" },
    { color: token.colorInfo, width: 75, label: "Good" },
    { color: token.colorSuccess, width: 100, label: "Strong" },
  ];

  const activeSegment =
    segments.find((seg) => strength <= seg.width) || segments[3];
    
  const getStrengthLabel = () => {
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="relative mb-4">
      <div className="flex justify-between mb-1 items-center">
        <div className="flex items-center">
          <SafetyOutlined className="mr-2 text-blue-500" />
          <Text strong>Password Strength:</Text>
          <Text 
            className="ml-2 px-2 py-0.5 rounded-md text-xs font-medium" 
            style={{
              backgroundColor: activeSegment.color + '20',
              color: activeSegment.color,
            }}
          >
            {getStrengthLabel()}
          </Text>
        </div>
      </div>
      
      <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ backgroundColor: activeSegment.color }}
        />
      </div>
      
      <div className="flex justify-between mt-1 px-1">
        {segments.map((segment, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="text-xs"
            style={{ color: strength > (index * 25) ? segment.color : token.colorTextQuaternary }}
          >
            {segment.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  const { token } = useToken();
  
  const getPasswordStrength = () => {
    if (!password) return 0;
    const result = zxcvbn(password);
    return result.score * 25;
  };

  const strength = getPasswordStrength();

  const requirements = [
    { text: "Minimum 8 characters", validator: (p: string) => p.length >= 8, icon: "🔢" },
    {
      text: "1 uppercase letter",
      validator: (p: string) => /[A-Z]/.test(p),
      icon: "🔠",
    },
    {
      text: "1 lowercase letter",
      validator: (p: string) => /[a-z]/.test(p),
      icon: "🔡",
    },
    { text: "1 number", validator: (p: string) => /[0-9]/.test(p), icon: "🔢" },
    {
      text: "1 special character",
      validator: (p: string) => /[^A-Za-z0-9]/.test(p),
      icon: "🔣",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="mt-6 mb-2 bg-gray-50 p-4 rounded-xl border border-gray-100"
    >
      <PasswordStrengthMeter strength={strength} />

      <Divider 
        orientation="center" 
        className="my-4"
      >
        <div className="flex items-center text-xs text-gray-500 font-medium">
          <IeOutlined className="mr-1.5" />
          <span>Password Requirements</span>
        </div>
      </Divider>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {requirements.map((req, i) => {
          const isValid = password ? req.validator(password) : false;
          return (
            <motion.div
              key={i}
              className={`flex items-center p-2 rounded-lg ${isValid ? 'bg-green-50 border-green-100' : 'bg-gray-100 border-gray-200'} border`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 500, damping: 30 }}
            >
              <motion.div
                className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isValid ? 'bg-green-100' : 'bg-gray-200'}`}
                animate={{
                  scale: isValid ? [1, 1.3, 1] : 1,
                  backgroundColor: isValid ? [token.colorSuccess + '20', token.colorSuccess + '40', token.colorSuccess + '20'] : token.colorBgContainerDisabled,
                }}
                transition={{ duration: 0.4 }}
              >
                {isValid ? (
                  <CheckOutlined className="text-green-600 text-base" />
                ) : (
                  <span className="text-gray-400 text-xs">{req.icon}</span>
                )}
              </motion.div>
              <Text 
                className={`text-sm ${isValid ? 'text-green-700 font-medium' : 'text-gray-500'}`}
              >
                {req.text}
              </Text>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-600 flex items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <InfoCircleOutlined className="text-blue-500 mr-2 mt-0.5" />
        <div>
          A strong password helps protect your account from unauthorized access. Consider using a password manager to generate and store complex passwords.
        </div>
      </motion.div>
    </motion.div>
  );
};

const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const { token } = useToken();

  const { updatePassword, message } = useAuth();
  const { token: authToken } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (password.length > 0) {
      setShowRequirements(true);
    } else {
      setShowRequirements(false);
    }
  }, [password]);

  const onFinish = async (values: ChangePasswordFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await updatePassword(values, authToken);
      setSuccess(true);
      form.resetFields();
      setPassword("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      className="max-w-md mx-auto"
    >
      <Card
        title={
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="text-center"
          >
            <Space direction="vertical" size={4}>
              <div className="flex justify-center mb-2">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 10 }}
                >
                  <KeyOutlined className="text-3xl text-blue-500" />
                </motion.div>
              </div>
              <Title level={3} className="m-0 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Update Your Password
              </Title>
              <Text type="secondary" className="text-sm">
                Secure your account with a new password
              </Text>
            </Space>
          </motion.div>
        }
        bordered={false}
        className="shadow-2xl rounded-2xl overflow-hidden border-0 hover:shadow-blue-100 transition-shadow duration-500"
        headStyle={{
          background: `linear-gradient(135deg, ${token.colorPrimary}f0 0%, ${token.colorPrimaryActive} 100%)`,
          color: token.colorTextLightSolid,
          border: "none",
          padding: "28px 24px",
          borderBottom: `1px solid ${token.colorPrimaryBorder}20`,
        }}
        bodyStyle={{ padding: "28px" }}
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                message={<span className="font-medium">{error}</span>}
                description="Please try again or contact support if the problem persists."
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                className="mb-6 border border-red-200 shadow-sm"
                icon={<ExclamationCircleOutlined className="text-red-500 text-lg" />}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                message={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-medium"
                  >
                    {message.updated ? "Password Updated Successfully" : "Update Failed"}
                  </motion.div>
                }
                description={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {message.text}
                  </motion.div>
                }
                type={message.updated ? "success" : "error"}
                showIcon
                className="mb-6 border shadow-sm"
                style={{
                  borderColor: message.updated ? token.colorSuccess + '40' : token.colorError + '40',
                  backgroundColor: message.updated ? token.colorSuccess + '10' : token.colorError + '10',
                }}
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Item
              name="oldPassword"
              label={
                <div className="flex items-center">
                  <Text strong className="text-gray-700 mr-1">
                    Current Password
                  </Text>
                  <span className="text-red-500">*</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400" />
                }
                placeholder="Enter current password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500 h-11"
                autoComplete="current-password"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Form.Item
              name="newPassword"
              label={
                <div className="flex items-center">
                  <Text strong className="text-gray-700 mr-1">
                    New Password
                  </Text>
                  <span className="text-red-500">*</span>
                  <Tooltip title="Your password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters">
                    <InfoCircleOutlined className="text-blue-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
              }
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("oldPassword") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "New password must be different from current password!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400" />
                }
                placeholder="Create new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500 h-11"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                autoComplete="new-password"
              />
            </Form.Item>
          </motion.div>

          <AnimatePresence>
            {showRequirements && <PasswordRequirements password={password} />}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Form.Item
              name="confirmPassword"
              label={
                <div className="flex items-center">
                  <Text strong className="text-gray-700 mr-1">
                    Confirm New Password
                  </Text>
                  <span className="text-red-500">*</span>
                </div>
              }
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400" />
                }
                placeholder="Re-enter new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500 h-11"
                autoComplete="new-password"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Form.Item>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="rounded-xl h-12 font-semibold transition-all flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
                    boxShadow: `0 8px 20px ${token.colorPrimary}30`,
                    border: 'none',
                  }}
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center"
                    >
                      <span className="mr-2">Updating Security</span>
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ...
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IeOutlined className="mr-2" />
                      <span>Update Password</span>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
              
              {!loading && (
                <motion.div 
                  className="text-center mt-4 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  You'll be required to sign in again after changing your password
                </motion.div>
              )}
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordForm;
