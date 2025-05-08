import ManagersTable from "./Managers";
import RequestersTable from "./Requesters";
import { Tabs } from "antd";

const Users: React.FC = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Requesters" key="1">
          <RequestersTable />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Managers" key="2">
          <ManagersTable />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Users;
