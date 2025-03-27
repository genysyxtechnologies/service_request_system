import { Input, Select, Space } from "antd";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const [options, setOptions] = useState([
    { value: "jack", label: "Jack" },
    { value: "lucy", label: "Lucy" },
    { value: "Yiminghe", label: "yiminghe" },
    { value: "disabled", label: "Disabled", disabled: true },
  ]);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="bg-[#fff] rounded-xl flex items-center justify-center h-[5rem] px-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <CiSearch className="text-5xl text-[#9C9C9C]" />
            <Input
              placeholder="Search"
              variant="borderless"
              className=" placeholder:text-[#9C9C9C] placeholder:text-xl"
            />
          </div>
        </div>

        <Select
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={handleChange}
          options={options}
        />
      </div>
    </div>
  );
}

export default Navbar;
