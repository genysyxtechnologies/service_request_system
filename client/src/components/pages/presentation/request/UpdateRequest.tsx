import React, { useState } from "react";
import { Radio, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useRequest } from "../../../services/useRequest";
import { useSelector } from "react-redux";

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
  const { token } = useSelector((state: any) => state.auth);
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateStatus } = useRequest(token);

  const handleOk = async () => {
    console.log(status);
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await updateStatus(status, requestId);
      }
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
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
  );
};

export default UpdateRequestStatusModal;
