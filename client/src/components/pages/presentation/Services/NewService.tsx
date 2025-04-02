import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useServices } from "../../../services/useServices";
import AuthAnimation from "../../../animations/AuthAnimation";
import { useSelector } from "react-redux";

const { Option } = Select;
interface NewServiceProps {
  visible: boolean;
  onClose: () => void;
  categoryId: number;
}

const NewService: React.FC<NewServiceProps> = ({
  visible,
  onClose,
  categoryId,
}) => {
  const { token } = useSelector((state: any) => state.auth);
  const { services, setServices,  createService, loading, error } =
    useServices(token);
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then(async () => {
        await createService();
        form.resetFields();
        onClose();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        return errorInfo;
      });
  };

  // watch for visibility canges before adding categiryId
  useEffect(() => {
    if (visible) {
      setServices({...services, categoryId})
    }
  }, [visible]);

  return (
    <Modal
      title="Create Service"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="serviceName"
          label="Service Name"
          rules={[
            { required: true, message: "Please enter the service name." },
          ]}
        >
          <Input
            value={services.name}
            onChange={(e) => setServices({ ...services, name: e.target.value })}
            placeholder="Enter service name"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description." }]}
        >
          <Input.TextArea
            value={services.description}
            onChange={(e) =>
              setServices({ ...services, description: e.target.value })
            }
            rows={4}
            placeholder="Enter service description"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category." }]}
        >
          <Select
            value={services.fields}
            onChange={(value) => setServices({ ...services, fields: JSON.stringify("") })}
            placeholder="Select a category"
          >
            <Option value="IT Support">IT Support</Option>
            <Option value="Consulting">Consulting</Option>
            <Option value="Development">Development</Option>
          </Select>
        </Form.Item>

        {/*  <Form.Item
          name="activeStatus"
          label="Active Status"
          rules={[{ required: true, message: "Please select the status." }]}
        >
          <Select placeholder="Select active status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item> */}

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
            {loading ? <AuthAnimation /> : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewService;
