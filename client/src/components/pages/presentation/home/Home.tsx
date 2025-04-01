import { useSelector } from "react-redux";
import Dashboard from "../dashboard/Dashboard";
import Request from "../request/Request";
function Home() {
  const { isAdmin } = useSelector((state: any) => state.auth);

  return <div className="w-full">{isAdmin ? <Dashboard /> : <Request />}</div>;
}

export default Home;
