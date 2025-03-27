import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

function Presentation() {
  const handleImageClick = (text: number) => {
    console.log("Hello", text);
  };
  return (
    <div className="w-full h-scree bg-secondary p-6 h-screen">
      <Sidebar onImageClick={handleImageClick} />
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
