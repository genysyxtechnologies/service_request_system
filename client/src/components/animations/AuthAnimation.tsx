import React from "react";
import "./AuthAnimation.css";

interface AuthAnimate {
  background?: any, 
}

const AuthAnimation: React.FC <AuthAnimate> = ({background}) => {
  return <div className={`loader ${background ? background : 'bg-white'}`}></div>;
};

export default AuthAnimation;
