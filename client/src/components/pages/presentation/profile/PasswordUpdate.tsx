import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Progress,
  Typography,
  Divider,
  theme,
  Space,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckOutlined,
  CloseOutlined,
  SafetyOutlined,
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
    { color: token.colorError, width: 25 },
    { color: token.colorWarning, width: 50 },
    { color: token.colorInfo, width: 75 },
    { color: token.colorSuccess, width: 100 },
  ];

  const activeSegment =
    segments.find((seg) => strength <= seg.width) || segments[3];

  return (
    <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${strength}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ backgroundColor: activeSegment.color }}
      />
    </div>
  );
};

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  const getPasswordStrength = () => {
    if (!password) return 0;
    const result = zxcvbn(password);
    return result.score * 25;
  };

  const strength = getPasswordStrength();

  const requirements = [
    { text: "Minimum 8 characters", validator: (p: string) => p.length >= 8 },
    {
      text: "1 uppercase letter",
      validator: (p: string) => /[A-Z]/.test(p),
    },
    {
      text: "1 lowercase letter",
      validator: (p: string) => /[a-z]/.test(p),
    },
    { text: "1 number", validator: (p: string) => /[0-9]/.test(p) },
    {
      text: "1 special character",
      validator: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <div className="mb-4">
        <Space className="mb-1">
          <SafetyOutlined />
          <Text strong>Password Strength</Text>
          <Text type="secondary" className="text-xs">
            {strength >= 75 ? "Strong" : strength >= 50 ? "Moderate" : "Weak"}
          </Text>
        </Space>
        <PasswordStrengthMeter strength={strength} />
      </div>

      <Divider orientation="left" plain className="text-xs">
        Password Requirements
      </Divider>

      <motion.ul className="list-none pl-0 space-y-2">
        {requirements.map((req, i) => {
          const isValid = password ? req.validator(password) : false;
          return (
            <motion.li
              key={i}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.span
                animate={{
                  scale: isValid ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isValid ? (
                  <CheckOutlined className="text-green-500 mr-2" />
                ) : (
                  <CloseOutlined className="text-red-500 mr-2" />
                )}
              </motion.span>
              <Text type={isValid ? "success" : "secondary"}>{req.text}</Text>
            </motion.li>
          );
        })}
      </motion.ul>
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-md mx-auto"
    >
      <Card
        title={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Space direction="vertical" size={0}>
              <Title level={3} className="m-0">
                Update Your Password
              </Title>
              <Text type="secondary" className="text-sm">
                Secure your account with a new password
              </Text>
            </Space>
          </motion.div>
        }
        bordered={false}
        className="shadow-xl rounded-2xl overflow-hidden border-0"
        headStyle={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
          color: token.colorTextLightSolid,
          border: "none",
          padding: "24px",
        }}
        bodyStyle={{ padding: "24px" }}
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
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                className="mb-6"
                banner
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
                  >
                    {message.text}
                  </motion.div>
                }
                type={message.updated ? "success" : "error"}
                showIcon
                className="mb-6"
                banner
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
                <Text strong className="text-gray-700">
                  Current Password
                </Text>
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
                  <LockOutlined style={{ color: token.colorTextSecondary }} />
                }
                placeholder="Enter current password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
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
                <Text strong className="text-gray-700">
                  New Password
                </Text>
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
                  <LockOutlined style={{ color: token.colorTextSecondary }} />
                }
                placeholder="Create new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => password.length > 0 && setShowRequirements(true)}
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
                <Text strong className="text-gray-700">
                  Confirm New Password
                </Text>
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
                  <LockOutlined style={{ color: token.colorTextSecondary }} />
                }
                placeholder="Re-enter new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="rounded-lg h-12 font-semibold mt-2 transition-all"
                style={{
                  background: token.colorPrimary,
                  boxShadow: `0 4px 14px ${token.colorPrimary}40`,
                }}
              >
                {loading ? (
                  <span>Updating Security...</span>
                ) : (
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Password
                  </motion.span>
                )}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordForm;
