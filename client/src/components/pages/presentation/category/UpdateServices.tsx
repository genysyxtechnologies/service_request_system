import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useSelector } from "react-redux";
import { ServiceData } from "../../../../utils/types";
import { useServices } from "../../../services/useServices";
import AuthAnimation from "../../../animations/AuthAnimation";


const { Option } = Select;

interface UpdateServicesProps {
  visible: boolean;
  onClose: () => void;
  serviceData: ServiceData | null;
 
}

const UpdateServices: React.FC<UpdateServicesProps> = ({
  visible,
  onClose,
  serviceData,

}) => {
  const [form] = Form.useForm();
  const token = useSelector((state: any) => state.auth.token);
  const { updateService, loading } = useServices(token);

  useEffect(() => {
    if (visible && serviceData) {
      form.setFieldsValue({
        name: serviceData.name,
        description: serviceData.description,
        fields: JSON.stringify(""),
        isActive: serviceData.isActive,
        category: serviceData.categoryName,
        categoryId: serviceData.categoryId,
      });
    } else {
      form.resetFields();
    }
  }, [visible, serviceData]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.fields = JSON.stringify("");
      values.categoryId = serviceData?.categoryId;
      await updateService(values, serviceData?.id!);

      message.success("Service updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update service");
    }
  };

  return (
    <Modal
      title="Update Service"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label="Service Name"
          rules={[
            { required: true, message: "Please enter the service name." },
          ]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description." }]}
        >
          <Input.TextArea rows={4} placeholder="Enter service description" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category." }]}
        >
          <Select placeholder="Select a category">
            <Option value="IT Support">IT Support</Option>
            <Option value="Consulting">Consulting</Option>
            <Option value="Development">Development</Option>
            <Option value="NEW REQUEST">NEW REQUEST</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end mt-5">
          <Button
            className="bg-red-500 text-white border-none hover:bg-red-600 mr-2"
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
          <Button
            className="bg-blue-500 text-white border-none hover:bg-blue-600"
            type="primary"
            onClick={handleSave}
          >
            {loading ? <AuthAnimation/> : 'Update Service'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateServices;
