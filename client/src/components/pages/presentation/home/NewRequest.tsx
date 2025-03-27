import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Modal } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
interface modalProps {
  isOpen: boolean;
}

const NewRequest: React.FC<modalProps> = ({ isOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <>
      <Modal
        footer={null}
        title="Basic Modal"
        open={isOpen} 
        onCancel={handleCancel}
        onOk={handleOk}
        
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            service: "IT Support",
            issue: "Hardware Failure",
          }}
        >
          <div className="flex items-center w-full">
            <Form.Item
              className="w-full"
              label="Service"
              name="issue"
              rules={[{ required: true, message: "Please select a service" }]}
            >
              <Input
                placeholder="IT Support"
                className=" placeholder:text-[#6C757D]"
              />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="Issue"
              name="issue"
              rules={[{ required: true, message: "Please specify the issue" }]}
            >
              <Select style={{ width: "100%" }}>
                <Option value="Hardware Failure">Hardware Failure</Option>
                <Option value="Software Bug">Software Bug</Option>
                <Option value="Network Outage">Network Outage</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please describe the issue" }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your issue in detail here"
            />
          </Form.Item>

          <Form.Item label="Attachment" name="attachment">
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={() => false}
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Drag and drop a file here or click to browse
              </p>
            </Dragger>
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleCancel}
              color="danger"
              variant="outlined"
              className=""
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="rounded">
              Submit Request
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default NewRequest;
