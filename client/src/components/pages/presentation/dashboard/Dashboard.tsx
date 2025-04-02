import React from "react";
import RequestTable from "../request/RequestTable";
import Cards from "./Cards";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Cards/>
      <RequestTable/>
    </div>
  );
};

export default Dashboard;
