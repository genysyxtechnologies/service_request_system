import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate,  } from "react-router-dom";

interface Security {
  children: ReactNode | any;
}

const RouterSecurity: React.FC<Security> = ({ children }) => {
  const { token } = useSelector((state: any) => state.auth);
  return token ? children : Navigate({to: '/', replace: true});
};

export default RouterSecurity;
