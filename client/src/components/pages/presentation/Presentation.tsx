import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

function Presentation() {
  return (
    <div className="w-full h-screen flex items-cente justify-center bg-secondary p-6 overflow-auto z-10">
      <Sidebar />
      <div className="flex-1 ml-[6rem]">
        <div className="sticky top-0 z-10 left-[7.5rem] right-5">
          <Navbar />
        </div>
        <div className="mt-32">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Presentation;