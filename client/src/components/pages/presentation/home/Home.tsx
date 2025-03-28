import { useState } from "react";
import NewRequest from "./NewRequest";
import Tables from "./HomeTable";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (values: any) => {
    console.log("Form submitted:", values);
    // Handle form submission
  };

  return (
    <div className="w-full">
       <NewRequest 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <Tables onItemClick={() => setIsModalOpen(true)} />
    </div>
  );
}

export default Home;
