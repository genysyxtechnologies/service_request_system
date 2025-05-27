import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Checkbox, Button } from "antd";
import type { CheckboxProps } from "antd";
import image2 from "../../../assets/images/signin/image2.png";
import image4 from "../../../assets/images/signin/image4.png";
import "./signin.css";
import { useAuth } from "../../services/useAuth";
import AuthAnimation from "../../animations/AuthAnimation";
import { reset } from "../../../utils/reset";

function SignIn() {
  reset();
  const {
    signup,
    user,
    setUser,
    loading,
    signin,
    signUser,
    setSignUser,
    isSignIn,
    setIsSignIn,
    fieldErrors,
  } = useAuth();

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

  const onChange: CheckboxProps["onChange"] = (e) => {
    setChecked(e.target.checked);
  };

  // Animation variants
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  };

  const getInputClassName = (fieldName: string) => {
    return fieldErrors[fieldName]
      ? "py-2 mt-1 border-red-500 focus:border-red-500 focus:shadow-red-200"
      : "py-2 mt-1 border-gray-300 hover:border-blue-400 focus:border-blue-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full signin-container h-screen flex items-center justify-center py-10"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 mx-auto md:w-8/12 w-11/12 h-full rounded-lg overflow-auto"
      >
        {/* Left Section */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col gap-6 bg-secondary p-8 bg-opacity-70"
        >
          <motion.div whileHover={{ scale: 1.02 }} className="flex">
            <img src="https://ug.nsuk.edu.ng/api/global/logo" style={{height: '80px'}} alt="Logo" className="mr-8" />
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
          className={`bg-white rounded-r-md flex flex-col p-8 justify-center my-auto gap-6 ${isSignIn ? '' : 'h-full'}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <motion.h1
              whileHover={{ scale: 1.01 }}
              className="text-3xl font-bold text-gray-800"
            >
              {isSignIn ? "Sign In" : "Create Account"}
            </motion.h1>

            {isSignIn ? (
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Identifier</span>
                  <motion.div
                    animate={fieldErrors.identifier ? shakeAnimation : {}}
                  >
                    <Input
                      value={signUser.identifier}
                      onChange={(e) =>
                        setSignUser({ ...signUser, identifier: e.target.value })
                      }
                      placeholder="Email or username"
                      className={getInputClassName("identifier")}
                      size="large"
                    />
                  </motion.div>
                  {fieldErrors.identifier && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {fieldErrors.identifier}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-600">Password</span>
                  <motion.div
                    animate={fieldErrors.password ? shakeAnimation : {}}
                  >
                    <Input.Password
                      value={signUser.password}
                      onChange={(e) =>
                        setSignUser({ ...signUser, password: e.target.value })
                      }
                      placeholder="Enter your password"
                      className={getInputClassName("password")}
                      size="large"
                    />
                  </motion.div>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-gray-600">First Name</span>
                    <motion.div
                      animate={fieldErrors.firstName ? shakeAnimation : {}}
                    >
                      <Input
                        placeholder="First name"
                        value={user.firstName}
                        onChange={(e) =>
                          setUser({ ...user, firstName: e.target.value })
                        }
                        className={getInputClassName("firstName")}
                        size="large"
                      />
                    </motion.div>
                    {fieldErrors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {fieldErrors.firstName}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-gray-600">Last Name</span>
                    <motion.div
                      animate={fieldErrors.lastName ? shakeAnimation : {}}
                    >
                      <Input
                        value={user.lastName}
                        onChange={(e) =>
                          setUser({ ...user, lastName: e.target.value })
                        }
                        placeholder="Last name"
                        className={getInputClassName("lastName")}
                        size="large"
                      />
                    </motion.div>
                    {fieldErrors.lastName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {fieldErrors.lastName}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Username</span>
                  <motion.div
                    animate={fieldErrors.username ? shakeAnimation : {}}
                  >
                    <Input
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      placeholder="Choose a username"
                      className={getInputClassName("username")}
                      size="large"
                    />
                  </motion.div>
                  {fieldErrors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {fieldErrors.username}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-600">Email address</span>
                  <motion.div animate={fieldErrors.email ? shakeAnimation : {}}>
                    <Input
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className={getInputClassName("email")}
                      size="large"
                    />
                  </motion.div>
                  {fieldErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-gray-600">Password</span>
                  <motion.div
                    animate={fieldErrors.password ? shakeAnimation : {}}
                  >
                    <Input.Password
                      placeholder="At least 6 characters"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      className={getInputClassName("password")}
                      size="large"
                    />
                  </motion.div>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {fieldErrors.password}
                    </motion.p>
                  )}
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
              {isSignIn && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-primary cursor-pointer"
                >
                  Forgot password?
                </motion.span>
              )}
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
                onClick={() => (isSignIn ? signin() : signup())}
                type="primary"
                className={`w-full bg-primary hover:bg-primary-dark text-white font-semibold h-12 text-lg`}
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <AuthAnimation />
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <hr className="w-full border-gray-200" />
              {/* <span className="text-gray-400">Or</span>
              <hr className="w-full border-gray-200" /> */}
            </motion.div>

           {/*  <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-gray-600">
                {isSignIn
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <motion.span
                onClick={() => setIsSignIn((p) => !p)}
                whileHover={{ scale: 1.05 }}
                className="text-primary font-semibold cursor-pointer"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </motion.span>
            </motion.div> */}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SignIn;
