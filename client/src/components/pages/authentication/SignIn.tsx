import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Checkbox, Button } from "antd";
import type { CheckboxProps } from "antd";
import image1 from "../../../assets/images/signin/image1.png";
import image2 from "../../../assets/images/signin/image2.png";
import image4 from "../../../assets/images/signin/image4.png";
import "./signin.css";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [staticImages] = useState([
    {
      image: image2,
      text: "Submit Unlimited Service Requests",
    },
    {
      image: image2,
      text: "Track Request Status in Real-Time",
    },
    {
      image: image4,
      text: "Get Instant Notifications",
    },
  ]);

  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const onChange: CheckboxProps["onChange"] = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full  signin-container h-screen flex items-center justify-center py-10"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 mx-auto md:w-8/12 w-10/12 h-full rounded-lg overflow-auto "
      >
        {/* Left Section */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 bg-secondary p-8 bg-opacity-70"
        >
          <motion.div whileHover={{ scale: 1.02 }} className="flex">
            <img src={image1} alt="Logo" className="mr-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-semibold text-[#212121]">
              Welcome to Service Request System
            </h1>
            <h2 className="text-[#757575]">
              SignUp, Submit and track Service request
            </h2>
          </motion.div>

          {staticImages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex gap-4 items-center"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="bg-primary w-10 h-10 p-1 flex items-center justify-center rounded-md"
              >
                <img src={item.image} alt="" className="object-cover" />
              </motion.div>
              <span className="text-[#212121]">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#fff] rounded-r-md flex flex-col p-8 justify-around my-auto gap-6"
          style={{ height: isSignIn ? "85%" : "100%" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <motion.h1
              whileHover={{ scale: 1.01 }}
              className="text-4xl font-semibold text-gray-800"
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </motion.h1>

            {isSignIn ? (
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Email address</span>
                  <Input placeholder="Enter your email" className="py-2 mt-1" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-600">Password</span>
                  <Input.Password
                    placeholder="Enter your password"
                    className="py-2 mt-1"
                  />
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">First Name</span>
                  <Input
                    placeholder="Enter your first name"
                    className="py-2 mt-1"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Last Name</span>
                  <Input
                    placeholder="Enter your last name"
                    className="py-2 mt-1"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Email address</span>
                  <Input placeholder="Enter your email" className="py-2 mt-1" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-600">Password</span>
                  <Input.Password
                    placeholder="Enter your password"
                    className="py-2 mt-1"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-600">Confirm Password</span>
                  <Input.Password
                    placeholder="Confirm your password"
                    className="py-2 mt-1"
                  />
                </motion.div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between"
            >
              <Checkbox
                checked={checked}
                disabled={disabled}
                onChange={onChange}
              >
                <span className="text-gray-600">Remember me</span>
              </Checkbox>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-primary cursor-pointer"
              >
                Forget your password?
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-6"
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => navigate("/app")}
                type="primary"
                className={`w-full bg-primary text-[#fff] font-semibold  h-auto ${isSignIn ? "py-5" : "py-3"}`}
                size="large"
              >
                {isSignIn ? "Sign Up" : "Sign Up"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <hr className="w-full border-gray-200" />
              <span className="text-gray-400">Or</span>
              <hr className="w-full border-gray-200" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-gray-600">{isSignIn ? "Don't have an account?" : "Already have an account?"}</span>
              <motion.span
                onClick={() => setIsSignIn((p) => !p)}
                whileHover={{ scale: 1.05 }}
                className="text-primary font-semibold cursor-pointer"
              >
                {isSignIn ? "Sign UP" : "Sign In"}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SignIn;
