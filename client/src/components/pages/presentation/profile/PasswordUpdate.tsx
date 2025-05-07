import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Space, 
  Card, 
  Alert, 
  Progress, 
  Typography, 
  Divider 
} from 'antd';
import { 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  CheckOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import zxcvbn from 'zxcvbn'; 

const { Title, Text } = Typography;

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const getPasswordStrength = () => {
    if (!password) return 0;
    const result = zxcvbn(password);
    return result.score * 25; 
  };

  const strength = getPasswordStrength();
  let status: 'exception' | 'normal' | 'active' | 'success' = 'exception';
  if (strength >= 75) status = 'success';
  else if (strength >= 50) status = 'active';
  else if (strength >= 25) status = 'normal';

  const requirements = [
    { text: 'At least 8 characters', validator: (p: string) => p.length >= 8 },
    { text: 'At least 1 uppercase letter', validator: (p: string) => /[A-Z]/.test(p) },
    { text: 'At least 1 lowercase letter', validator: (p: string) => /[a-z]/.test(p) },
    { text: 'At least 1 number', validator: (p: string) => /[0-9]/.test(p) },
    { text: 'At least 1 special character', validator: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  return (
    <div className="mt-4">
      <Progress 
        percent={strength} 
        status={status} 
        showInfo={false} 
        strokeColor={
          strength >= 75 ? '#52c41a' : 
          strength >= 50 ? '#1890ff' : 
          strength >= 25 ? '#faad14' : '#ff4d4f'
        }
      />
      <div className="flex justify-between mb-2">
        <Text type={strength >= 25 ? 'secondary' : 'danger'}>Weak</Text>
        <Text type={strength >= 50 ? 'secondary' : 'danger'}>Moderate</Text>
        <Text type={strength >= 75 ? 'success' : 'secondary'}>Strong</Text>
      </div>
      
      <Divider orientation="left" plain className="text-xs">
        Password Requirements
      </Divider>
      
      <ul className="list-none pl-0">
        {requirements.map((req, i) => {
          const isValid = password ? req.validator(password) : false;
          return (
            <li key={i} className="flex items-center mb-1">
              {isValid ? (
                <CheckOutlined className="text-green-500 mr-2" />
              ) : (
                <CloseOutlined className="text-red-500 mr-2" />
              )}
              <Text type={isValid ? 'success' : 'secondary'}>{req.text}</Text>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');

  const onFinish = async (values: ChangePasswordFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
   
      await new Promise(resolve => setTimeout(resolve, 1500));
   
      
      setSuccess(true);
      form.resetFields();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card
        title={
          <Title level={3} className="text-center">
            Change Password
          </Title>
        }
        bordered={false}
        className="shadow-lg rounded-lg overflow-hidden"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert 
              message={error} 
              type="error" 
              showIcon 
              closable 
              onClose={() => setError(null)}
              className="mb-4"
            />
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert 
              message="Password changed successfully!" 
              type="success" 
              showIcon 
              className="mb-4"
            />
          </motion.div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please input your current password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Current password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('New password must be different from current password!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="New password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <PasswordRequirements password={password} />

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm new password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="mt-2"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordForm;