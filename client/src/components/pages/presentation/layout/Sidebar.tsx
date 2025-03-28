import './Sidebar.css'
import { Tooltip } from "antd";
import image1 from "../../../../assets/images/signin/image1.png";
import image2 from "../../../../assets/images/signin/image2.png";
import image3 from "../../../../assets/images/presentation/image1.png";
import image4 from "../../../../assets/images/presentation/image2.png";
import image5 from "../../../../assets/images/presentation/image3.png";
import image6 from "../../../../assets/images/presentation/image4.png";
import { useNavigate } from "react-router-dom";


function Sidebar() {
  const navigate = useNavigate();

  // Tooltip content for each button
  const tooltips = [
    "Home Dashboard",
    "Service Requests",
    "Manage Services",
    "Manage Categories",
    "Analytics Dashboard",
    "Settings"
  ];

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