import React, { useEffect } from "react";
import "./Dashboard.css";
import { Button } from "antd";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import image1 from "../../../../assets/images/dashboard/image1.png";
import image2 from "../../../../assets/images/dashboard/image2.png";
import image3 from "../../../../assets/images/dashboard/image3.png";
import image4 from "../../../../assets/images/dashboard/image4.png";
import { useSelector } from "react-redux";
import { useServices } from "../../../services/useServices";
import AuthAnimation from "../../../animations/AuthAnimation";
import { useLocation, useNavigate } from "react-router-dom";

interface StatCard {
  title: string;
  value: number;
  image: string;
  bgColor: string;
  textColor: string;
  iconBgColor?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Cards: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { fetchDashBoard, dashboad, setDashBoard, loading, isServerError } =
    useServices(token);  
    const location = useLocation();
    const navigate = useNavigate();

  // fetch dataimmediately the component mounted
  useEffect(() => {
    (async () => {
      const response = await fetchDashBoard();
      setDashBoard(response);
    })();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total Requests",
      value: dashboad?.totalRequests,
      image: image1,
      bgColor: "bg-[#3B82F6]",
      textColor: "#fff",
      iconBgColor: "white",
    },
    {
      title: "Total Requesters",
      value: dashboad?.totalRequesters,
      image: image2,
      bgColor: "bg-white",
      textColor: "#FFBB46",
      iconBgColor: "#FFBB46",
    },
    {
      title: "Total Managers",
      value: dashboad?.totalManagers,
      image: image3,
      bgColor: "bg-white",
      textColor: "#0B7E0F",
      iconBgColor: "#0B7E0F",
    },
    {
      title: "Total Services",
      value: dashboad?.totalServices,
      image: image4,
      bgColor: "bg-white",
      textColor: "#3B82F6",
      iconBgColor: "#3B82F6",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
          variants={containerVariants}
        >
          {statCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                style={{ borderColor: card.textColor }}
                whileHover={{ y: -5 }}
                className={`${card.bgColor} ${card.textColor} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div style={{ color: card.textColor }}>
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            backgroundColor: card.iconBgColor
                              ? card.iconBgColor
                              : "white",
                          }}
                          className={` w-10 h-10 rounded-full flex items-center justify-center`}
                        >
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          {loading ? (
                            <AuthAnimation background={"bg-green-600"} />
                          ) : isServerError ? (
                            <span>Error</span>
                          ) : (
                            card.value
                          )}
                        </h3>
                      </div>
                      <p className="text-sm font-medium">{card.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
          {/* Quick Actions */}
          <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
            <Button
            onClick={() => navigate('/app/category')}
              type="primary"
              className="flex items-center h-12 px-6 bg-[#fff] hover:bg-primary hover:text-white rounded-lg flex-1 text-primary"
              icon={<ArrowRightOutlined />}
            >
              Manage Services
            </Button>
            <Button
            disabled={location.pathname === '/app'}
              type="primary"
              className="flex items-center h-12 px-6 bg-[#fff] hover:bg-blue-700 rounded-lg flex-1 text-primary"
              icon={<ArrowRightOutlined />}
            >
              Manage Requests
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Cards;
