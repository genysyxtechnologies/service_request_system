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
      title: "Manage Categories",
      icon: image4,
      path: "/app/category",
    },
    {
      title: "Settings",
      icon: image5,
      path: "/app",
    },
  ]);

  return (
    <div>
      <div className="bg-white w-20 fixed top-6 bottom-6 left-6 rounded-xl flex py-4 transition-all duration-300 select-none shadow-md flex-col items-center gap-6">
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
        {sideBarItems.map((item) => (
          <Tooltip
            key={item.title}
            title={item.title}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate(item.path)}
              className="cursor-pointer group"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-8 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
