import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button, Upload, Modal, message, Progress } from "antd";
import {
  InboxOutlined,
  CloseOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useRequest } from "../../../services/useRequest";

const { TextArea } = Input;
const { Dragger } = Upload;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  serviceId: number;
  departmentId: number;
}

const NewRequest: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  serviceId,
  departmentId,
}) => {
  const [form] = Form.useForm();
  const { token } = useSelector((state: any) => state.auth);
  const {
    requestForm,
    attachment,
    handleInputChange,
    handleFileChange,
    removeFile,
    submitRequest,
    isSubmitting,
    uploadProgress,
    error,
    setError,
  } = useRequest(token);

  const handleSubmit = async () => {
    const success = await submitRequest(serviceId, departmentId);
    if (success) {
      onSubmit({
        requestData: requestForm.requestData,
        attachment: attachment.map((file) => file.name),
      });
      form.resetFields();
      onClose();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
    exit: { opacity: 0, y: 20, scale: 0.98 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const fileList = attachment.map((file, index) => ({
    uid: `${index}`,
    name: file.name,
    size: file.size,
    type: file.type,
    originFileObj: file,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          open={isOpen}
          onCancel={handleCancel}
          footer={null}
          closeIcon={
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <CloseOutlined className="text-gray-500 hover:text-gray-700 transition-colors" />
            </motion.div>
          }
          className="max-w-[95vw] w-full md:max-w-[650px]"
          width="auto"
          centered
          destroyOnClose
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="bg-gradient-to-br from-white to-blue-50 rounded-xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                New Service Request
              </motion.h2>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  className="mb-6"
                >
                  <Form.Item
                    label={
                      <motion.span
                        className="text-gray-700 font-medium text-sm md:text-base flex items-center"
                        whileHover={{ x: 3 }}
                      >
                        Request Data{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </motion.span>
                    }
                    name="requestData"
                    rules={[
                      { required: true, message: "Please enter request data" },
                      { max: 500, message: "Maximum 500 characters" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      value={requestForm.requestData}
                      onChange={(e) =>
                        handleInputChange("requestData", e.target.value)
                      }
                      placeholder="Enter detailed request information..."
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base shadow-sm"
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {error}
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  className="mb-6"
                >
                  <Form.Item
                    style={{ display: "none" }}
                    label={
                      <motion.span
                        className="text-gray-700 font-medium text-sm md:text-base  items-center hidden"
                        whileHover={{ x: 3 }}
                      >
                        Documents{" "}
                        <span className="text-blue-500 ml-1">(Optional)</span>
                      </motion.span>
                    }
                  >
                    <Dragger
                      name="files"
                      multiple
                      fileList={fileList}
                      onChange={({ fileList }) => {
                        const files = fileList
                          .filter((file) => file.originFileObj)
                          .map((file) => file.originFileObj as File);
                        handleFileChange(files);
                      }}
                      beforeUpload={() => false}
                      className="rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    >
                      <motion.div
                        className="p-6 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.p
                          className="ant-upload-drag-icon text-blue-500 mb-3"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <InboxOutlined className="text-3xl" />
                        </motion.p>
                        <motion.p
                          className="ant-upload-text font-semibold text-gray-700 text-sm md:text-base mb-1"
                          whileHover={{ scale: 1.01 }}
                        >
                          Drag & drop files or click to browse
                        </motion.p>
                        <motion.p
                          className="ant-upload-hint text-gray-500 text-xs md:text-sm"
                          whileHover={{ scale: 1.01 }}
                        >
                          Supported formats: PDF, JPG, PNG (Max 5MB each)
                        </motion.p>
                      </motion.div>
                    </Dragger>
                  </Form.Item>

                  {attachment.length > 0 && (
                    <motion.div
                      style={{ display: "none" }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-2"
                    >
                      {attachment.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100"
                          whileHover={{
                            backgroundColor: "rgba(239, 246, 255, 1)",
                          }}
                        >
                          <div className="flex items-center">
                            <PaperClipOutlined className="text-blue-500 mr-2" />
                            <span className="text-sm text-gray-700 truncate max-w-[180px]">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-3">
                      <Progress
                        percent={uploadProgress}
                        strokeColor={{
                          "0%": "#3b82f6",
                          "100%": "#8b5cf6",
                        }}
                        showInfo={false}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">
                        {uploadProgress}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading {attachment.length} file(s)...
                    </p>
                  </motion.div>
                )}

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8"
                >
                  <Button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-11 px-6 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-300 text-sm md:text-base font-medium flex items-center justify-center"
                  >
                    <motion.span whileHover={{ x: -2 }} whileTap={{ x: 2 }}>
                      Cancel
                    </motion.span>
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 text-sm md:text-base font-medium flex items-center justify-center"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </motion.span>
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
