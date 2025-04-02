import { useEffect, useState } from "react";
import NewRequest from "./NewRequest";
import Tables from "./HomeTable";
import { useSelector } from "react-redux";
import Dashboard from "../dashboard/Dashboard";
function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, token, isAdmin } = useSelector((state: any) => state.auth);

  useEffect(() => {
    console.log("TOKEN", token);
    console.log("USER", user);
    console.log("ISADMIN", isAdmin);
  }, []);

  const handleSubmit = (values: any) => {
    console.log("Form submitted:", values);
  };

  return (
    <div className="w-full">
      {isAdmin ? (
        <Dashboard />
      ) : (
        <div>
          <NewRequest
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
          <Tables onItemClick={() => setIsModalOpen(true)} />
        </div>
      )}
    </div>
  );
}

export default Home;

import "./Sidebar.css";
import { Tooltip } from "antd";
import image1 from "../../../../assets/images/signin/image1.png";
import image2 from "../../../../assets/images/signin/image2.png";
import image3 from "../../../../assets/images/presentation/image1.png";
import image4 from "../../../../assets/images/presentation/image2.png";
import image5 from "../../../../assets/images/presentation/image3.png";
import image6 from "../../../../assets/images/presentation/image4.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();

  // Tooltip content for each button
  const tooltips = [
    "Home Dashboard",
    "Service Requests",
    "Manage Services",
    "Manage Categories",
    "Analytics Dashboard",
    "Settings",
  ];

  const [sideBarItems, setSideBarItems] = useState([
    {
      title: "Service Requests",
      icon: image2,
      path: "/app/request",
    },
    {
      title: "Manage Services",
      icon: image3,
      path: "/app/services",
    },
    {
      title: "Manage Categories",
      icon: image4,
      path: "/app/category",
    },
    {
      title: "Analytics Dashboard",
      icon: image6,
      path: "/app/dashboard",
    },
    {
      title: "Settings",
      icon: image5,
      path: "/app/settings",
    },
  ]);

  return (
    <div>
      <div className="bg-white w-20 fixed top-6 bottom-6 left-6 rounded-xl flex justify-center py-4 transition-all duration-300 select-none shadow-md">
        <div className="flex flex-col items-center gap-6">
          {/* Home Button */}
          <Tooltip
            title={tooltips[0]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app")}
              className="cursor-pointer group"
            >
              <img
                src={image1}
                alt="Home"
                className="w-12 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>

          <div className="w-full h-px bg-gray-300"></div>

          {/* Service Requests Button */}
          <Tooltip
            title={tooltips[1]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app/request")}
              className="cursor-pointer group"
            >
              <img
                src={image2}
                alt="Requests"
                className="w-12 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>

          {/* Manage Services Button */}
          <Tooltip
            title={tooltips[2]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app/services")}
              className="cursor-pointer group"
            >
              <img
                src={image3}
                alt="Services"
                className="w-7 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>

          {/* Manage Categories Button */}
          <Tooltip
            title={tooltips[3]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app/category")}
              className="cursor-pointer group"
            >
              <img
                src={image4}
                alt="Categories"
                className="w-7 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>

          {/* Analytics Dashboard Button */}
          <Tooltip
            title={tooltips[4]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app/dashboard")}
              className="cursor-pointer group"
            >
              <img
                src={image6}
                alt="Analytics"
                className="w-7 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>

          {/* Settings Button */}
          <Tooltip
            title={tooltips[5]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button className="cursor-pointer group">
              <img
                src={image5}
                alt="Settings"
                className="w-7 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;


import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { motion } from "framer-motion";

interface CreateCategoryProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const NewCategory: React.FC<CreateCategoryProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        onSave();
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title={
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-800"
        >
          Create New Category
        </motion.div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="rounded-xl"
      bodyStyle={{ padding: "24px" }}
    >
      <Form form={form} layout="vertical">
        {/* Category Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Form.Item
            name="categoryName"
            label={
              <span className="text-gray-700 font-medium">
                Category Name <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please enter the category name." },
            ]}
          >
            <Input
              placeholder="e.g. IT Support"
              className="rounded-lg py-2 px-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </Form.Item>
        </motion.div>

        {/* Description Input */}
       {/*  <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Form.Item
            name="description"
            label={
              <span className="text-gray-700 font-medium">
                Description <span className="text-red-500">*</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter a detailed description.",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe this category in detail..."
              className="rounded-lg py-2 px-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </Form.Item>
        </motion.div> */}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end space-x-3 mt-6"
        >
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            className="h-10 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick=k{handleSave}
            className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Create Category
          </Button>
        </motion.div>
      </Form>
    </Modal>
  );
};

export default NewCategory;
