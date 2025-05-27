// components/Navbar.tsx
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";

function Navbar() {
  const { user} = useSelector((state: any) => state.auth);


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#fff] rounded-xl flex items-center justify-center h-[5rem] px-4 shadow-sm"
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <CiSearch className="text-5xl text-[#9C9C9C] hover:text-[#7a7a7a] transition-colors duration-300" />
            </motion.div>
            <Input
              readOnly
              placeholder="Search"
              variant="borderless"
              className="placeholder:text-[#9C9C9C] placeholder:text-xl focus:placeholder-opacity-0 transition-all duration-300"
            />
          </div>
        </div>

        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              damping: 6,
              stiffness: 300,
            }}
          >
            <Avatar
              shape="square"
              size="large"
              icon={<UserOutlined />}
              className="shadow-sm hover:shadow-md transition-shadow duration-300"
            />
          </motion.div>
          <motion.span
            className="font-medium text-gray-700"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {user.fullName}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Navbar;
