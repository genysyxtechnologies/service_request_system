import React, { useState, useEffect } from "react";
import { Radio, Button, Modal, Input, Form } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useRequest } from "../../../services/useRequest";
import { useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface UpdateRequestStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate?: (status: string) => void;
  initialStatus?: "PENDING" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  requestId: number;
}

const UpdateRequestStatusModal: React.FC<UpdateRequestStatusModalProps> = ({
  visible,
  onClose,
  onUpdate,
  initialStatus = "PENDING",
  requestId,
}) => {
  const { token } = useSelector((state: Record<string, unknown>) => state.auth);
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [form] = Form.useForm();
  const { updateStatus } = useRequest(token);

  useEffect(() => {
    // Reset rejection reason when modal is opened/closed
    if (!visible) {
      setRejectionReason("");
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = async () => {
    // If status is REJECTED and no rejection modal has been shown yet, show it
    if (status === "REJECTED" && !rejectionReason) {
      setRejectionModalVisible(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await updateStatus(status, requestId, status === "REJECTED" ? rejectionReason : undefined);
      }
    } finally {
      setIsSubmitting(false);
      onClose();
      // Reset rejection reason
      setRejectionReason("");
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setRejectionReason("");
    form.resetFields();
    onClose();
  };
  
  const handleRejectionSubmit = async () => {
    try {
      await form.validateFields();
      setRejectionModalVisible(false);
      // Continue with the update process
      handleOk();
    } catch (error) {
      // Form validation failed
    }
  };
  
  const handleRejectionCancel = () => {
    setRejectionModalVisible(false);
    // Reset status to previous value if user cancels rejection reason
    setStatus(initialStatus);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel();
              }
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Request Status
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500 text-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4 mb-6">
                  <Radio.Group
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
                    <div className="flex flex-col gap-4">
                      <Radio
                        value="PENDING"
                        className="[&>.ant-radio-inner]:w-5 [&>.ant-radio-inner]:h-5 [&>.ant-radio-checked>.ant-radio-inner]:bg-blue-500 [&>.ant-radio]:hover [&>.ant-radio-inner]:border-gray-300"
                      >
                        <span className="text-gray-700 text-base">Pending</span>
                      </Radio>
                      <Radio
                        value="REJECTED"
                        className="[&>.ant-radio-inner]:w-5 [&>.ant-radio-inner]:h-5 [&>.ant-radio-checked>.ant-radio-inner]:bg-blue-500 [&>.ant-radio]:hover [&>.ant-radio-inner]:border-gray-300"
                      >
                        <span className="text-gray-700 text-base">Rejected</span>
                      </Radio>
                      <Radio
                        value="IN_PROGRESS"
                        className="[&>.ant-radio-inner]:w-5 [&>.ant-radio-inner]:h-5 [&>.ant-radio-checked>.ant-radio-inner]:bg-blue-500 [&>.ant-radio]:hover [&>.ant-radio-inner]:border-gray-300"
                      >
                        <span className="text-gray-700 text-base">
                          In Progress
                        </span>
                      </Radio>
                      <Radio
                        value="COMPLETED"
                        className="[&>.ant-radio-inner]:w-5 [&>.ant-radio-inner]:h-5 [&>.ant-radio-checked>.ant-radio-inner]:bg-blue-500 [&>.ant-radio]:hover [&>.ant-radio-inner]:border-gray-300"
                      >
                        <span className="text-gray-700 text-base">Completed</span>
                      </Radio>
                    </div>
                  </Radio.Group>
                </div>

                <Button
                  type="primary"
                  onClick={handleOk}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full h-11 font-medium rounded-lg transition-all"
                >
                  Update Status
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <Modal
        title={
          <div className="flex items-center py-1">
            <ExclamationCircleOutlined className="text-amber-500 mr-3 text-xl" />
            <span className="text-gray-800 font-semibold text-lg">Rejection Reason Required</span>
          </div>
        }
        open={rejectionModalVisible}
        onOk={handleRejectionSubmit}
        onCancel={handleRejectionCancel}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          loading: isSubmitting,
          className: "bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-md h-9 px-5 rounded-lg"
        }}
        cancelButtonProps={{
          className: "border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 h-9 px-4 rounded-lg"
        }}
        className="rejection-reason-modal"
        centered
        maskStyle={{ backdropFilter: "blur(4px)" }}
        width={500}
        styles={{
          header: {
            padding: "16px 24px",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
            borderRadius: "8px 8px 0 0"
          },
          body: { padding: "24px" },
          footer: { padding: "16px 24px", borderTop: "1px solid #f0f0f0" },
          content: {
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
            borderRadius: "12px",
            overflow: "hidden"
          }
        }}
      >
        <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md">
          <p className="text-amber-800 text-sm">
            You are about to reject this request. Please provide a detailed explanation for the rejection 
            to help the requester understand the decision.
          </p>
        </div>
        
        <Form form={form} layout="vertical" className="rejection-form">
          <Form.Item
            name="rejectionReason"
            label={
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <span>Reason for rejection</span>
                <span className="text-red-500 ml-1">*</span>
              </div>
            }
            rules={[
              {
                required: true,
                message: "Rejection reason is required",
              },
              {
                min: 10,
                message: "Reason must be at least 10 characters",
              },
            ]}
            validateTrigger={["onChange", "onBlur"]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter detailed reason for rejection..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                form.setFieldsValue({ rejectionReason: e.target.value });
              }}
              className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
              maxLength={500}
              showCount
              autoFocus
            />
          </Form.Item>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>The rejection reason will be visible to the requester and cannot be changed after submission.</p>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateRequestStatusModal;
