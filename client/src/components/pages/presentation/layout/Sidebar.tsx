import image1 from "../../../../assets/images/signin/image1.png";
import image2 from "../../../../assets/images/signin/image2.png";
import image3 from "../../../../assets/images/presentation/image1.png";
import image4 from "../../../../assets/images/presentation/image2.png";
import image5 from "../../../../assets/images/presentation/image3.png";
import NewRequest from "../home/NewRequest";

interface SidebarProps {
  onImageClick: (imageIndex: number) => void; 
}

function Sidebar({ onImageClick }: SidebarProps) {
  return (
    <div>
      
      <div className="bg-[#fff] w-[5rem] fixed my-auto top-6 bottom-6 left-6 rounded-xl flex justify-center py-4">
        <div className="flex flex-col items-center gap-6">
          <div className="cursor-pointer">
            <img src={image1} alt="image" className="w-12" />
          </div>
          <div className="w-full h-[0.1rem] bg-[#9C9C9C] cursor-pointer"></div>
          <div onClick={() => onImageClick(1)}>
            <img src={image2} alt="image" className="w-12 cursor-pointer" />
          </div>
          <div>
            <img src={image3} alt="image" className="w-7 cursor-pointer" />
          </div>
          <div>
            <img src={image4} alt="image" className="w-7 cursor-pointer" />
          </div>
          <div>
            <img src={image5} alt="image" className="w-7 cursor-pointer" />
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Sidebar;
