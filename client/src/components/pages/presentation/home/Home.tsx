import { useState } from "react";
import NewRequest from "./NewRequest";
import Tables from "./HomeTable";

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const handleItemClick = () => {
    console.log('Hello')
    setOpenModal(true)
  };

  return (
    <div className="w-full">
      <NewRequest isOpen={openModal} />
      <Tables onItemClick={() => handleItemClick()} />
    </div>
  );
}

export default Home;
