import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

function Presentation() {

  return (
    <div className="w-full h-screen bg-secondary p-6">
      <Sidebar />
      <div className="flex-1 ml-[6rem] mt-12">
       <div className="fixed top-6 z-10 left-[8rem] right-12">
       <Navbar />
       </div>
        <div className="mt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Presentation;
