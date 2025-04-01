import React from "react";
import { Modal, Button } from "antd";
import image1 from "../../../../assets/images/services/image1.png";

interface DeleteServiceProps {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteService: React.FC<DeleteServiceProps> = ({
  visible,
  onCancel,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="custom-delete-modal"
    >
      <div className="text-center">
        {/* Icon */}
        <div className="mb-4">
          <img src={image1} alt="Delete" className="mx-auto w-2/12" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#FF8B8B]">Delete Service</h2>

        {/* Description */}
        <p className="text-[#1E1E1E] mt-2 w-2/3 text-center mx-auto">
          Are you sure you want to delete this service? This action cannot be
          undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-blue-500 text-white border-none hover:bg-blue-600 mr-4"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#FF8B8B] text-white border-none hover:bg-[#FF8B8B]"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteService;
