import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Select, Button, Upload, Modal } from "antd";
import { InboxOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const NewRequest: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          open={isOpen}
          onCancel={handleCancel}
          footer={null}
          closeIcon={
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <CloseOutlined className="text-gray-500 hover:text-gray-700 transition-colors" />
            </motion.div>
          }
          className="max-w-[95vw] w-full md:max-w-[600px]"
          width="auto"
          centered
          destroyOnClose
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5">
                New Service Request
              </h2>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  service: "IT Support",
                  issue: "Hardware Failure",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5">
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                          Service <span className="text-red-500">*</span>
                        </span>
                      }
                      name="service"
                      rules={[
                        { 
                          required: true, 
                          message: "Please select a service" 
                        },
                      ]}
                    >
                      <Input
                        placeholder="IT Support"
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm md:text-base"
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                          Issue Type <span className="text-red-500">*</span>
                        </span>
                      }
                      name="issue"
                      rules={[
                        { 
                          required: true, 
                          message: "Please specify the issue" 
                        },
                      ]}
                    >
                      <Select
                        className="w-full text-sm md:text-base"
                        dropdownClassName="rounded-lg shadow-lg border border-gray-200"
                      >
                        <Option value="Hardware Failure">
                          Hardware Failure
                        </Option>
                        <Option value="Software Bug">Software Bug</Option>
                        <Option value="Network Outage">Network Outage</Option>
                        <Option value="Account Issue">Account Issue</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-5"
                >
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium text-sm md:text-base">
                        Description <span className="text-red-500">*</span>
                      </span>
                    }
                    name="description"
                    rules={[
                      { 
                        required: true, 
                        message: "Please describe the issue" 
                      },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Describe your issue in detail..."
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm md:text-base"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6"
                >
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium text-sm md:text-base">
                        Attachment
                      </span>
                    }
                    name="attachment"
                  >
                    <Dragger
                      name="file"
                      multiple={false}
                      beforeUpload={() => false}
                      className="rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                    >
                      <div className="p-4 md:p-5">
                        <p className="ant-upload-drag-icon text-blue-500 mb-2">
                          <InboxOutlined className="text-2xl" />
                        </p>
                        <p className="ant-upload-text font-medium text-gray-700 text-sm md:text-base mb-1">
                          Drag and drop a file here or click to browse
                        </p>
                        <p className="ant-upload-hint text-gray-500 text-xs md:text-sm">
                          Supports: PDF, JPG, PNG (Max: 5MB)
                        </p>
                      </div>
                    </Dragger>
                  </Form.Item>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col-reverse sm:flex-row justify-end gap-3"
                >
                  <Button
                    onClick={handleCancel}
                    className="h-10 px-4 md:px-5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="h-10 px-4 md:px-5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm text-sm md:text-base"
                  >
                    Submit Request
                  </Button>
                </motion.div>
              </Form>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default NewRequest;