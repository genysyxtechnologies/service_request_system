import "./Sidebar.css";
import { Tooltip } from "antd";
import { motion } from "framer-motion";
import image2 from "../../../../assets/images/signin/image2.png";
import image5 from "../../../../assets/images/presentation/image3.png";
import image6 from "../../../../assets/images/signin/image5.svg";
import image7 from "../../../../assets/images/user/image1.svg";
import image8 from "../../../../assets/images/presentation/image5.svg";
import supervisorsIcon from "../../../../assets/images/supervisors-icon.svg";
import departmentIcon from "../../../../assets/images/dashboard/image1.png";
import serviceCategoryIcon from "../../../../assets/images/presentation/image4.png";
import categoryIcon from "../../../../assets/images/services/image1.png";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { isUserAuthorized, ROLES } from "../../../../utils/roles";

function Sidebar() {
  const navigate = useNavigate();
  const { isAdmin, roles } = useSelector((state: any) => state.auth);

  // Tooltip content for each button
  const tooltips = [
    "Service Requests",
    "Manage Requests",
    "Departments",
    "Service Categories",
    "Categories",
    "Notifications",
    "Manage Users",
    "Supervisors",
    "Manage Account",
    "Logout",
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sideBarItems, _] = useState([
    {
      title: "Service Requests",
      icon: image2,
      path: "/app/request",
    },
    {
      title: "Manage Requests",
      icon: image2,
      path: "/app/manage-requests",
      disable: !isAdmin && !isUserAuthorized(roles, ROLES.HOD),
      hidden: !isAdmin && !isUserAuthorized(roles, ROLES.HOD),
    },
    {
      title: "Departments",
      icon: departmentIcon,
      path: "/app/department",
      disable: !isAdmin,
      hidden: !isAdmin,
    },
    {
      title: "Service Categories",
      icon: serviceCategoryIcon,
      path: "/app/service-category",
    },
    {
      title: "Categories",
      icon: categoryIcon,
      path: "/app/categories",
      disable: !isAdmin,
      hidden: !isAdmin,
    },
    {
      title: "Notification",
      icon: image8,
      path: "/app/notification",
    },
    {
      title: "Manage Users",
      icon: image7,
      path: "/app/users",
      disable: !isAdmin,
      hidden: !isAdmin,
    },
    {
      title: "Supervisors",
      icon: supervisorsIcon,
      path: "/app/supervisor",
      disable: !isAdmin && !isUserAuthorized(roles, ROLES.SUPERVISOR),
      hidden: !isAdmin && !isUserAuthorized(roles, ROLES.SUPERVISOR),
    },
    {
      title: "Manage Account",
      icon: image5,
      path: "/app/profile",
      disable: false,
    },
    {
      title: "Logout",
      icon: image6,
      path: "/",
    },
  ]);

  // Animation variants for sidebar items
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div>
      <motion.div
        className="bg-white w-20 h-auto overflow-y-auto fixed top-6 bottom-6 left-6 rounded-xl flex py-6 transition-all duration-300 select-none shadow-lg flex-col items-center gap-7"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Tooltip
            title={tooltips[0]}
            placement="right"
            overlayClassName="custom-tooltip"
            color="#3b82f6"
          >
            <button
              onClick={() => navigate("/app")}
              className="cursor-pointer relative overflow-hidden rounded-full p-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
              <img
                src="https://ug.nsuk.edu.ng/api/global/logo"
                alt="Home"
                className="w-12 transition-all duration-300"
              />
            </button>
          </Tooltip>
        </motion.div>

        <div className="w-full h-px bg-gray-200"></div>

        <motion.div
          className="flex flex-col items-center gap-7 w-full"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          {sideBarItems.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`${item.hidden ? "hidden" : ""}`}
            >
              <Tooltip
                title={item.title}
                placement="right"
                color="#3b82f6"
                overlayClassName="sidebar-tooltip"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative flex justify-center items-center w-12 h-12 rounded-xl
                    ${
                      item.disable
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                    ${isActive ? "nav-item-active" : ""}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-blue-50 rounded-xl z-0"
                          layoutId="activeBackground"
                          initial={{ borderRadius: 12 }}
                          animate={{ borderRadius: 12 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <motion.div
                        className="relative z-10 flex items-center justify-center"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <img
                          src={item.icon}
                          alt={item.title}
                          className={`w-6 h-6 ${
                            isActive ? "filter-active" : ""
                          }`}
                        />
                        {isActive && (
                          <motion.div
                            className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </motion.div>
                    </>
                  )}
                </NavLink>
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Sidebar;
