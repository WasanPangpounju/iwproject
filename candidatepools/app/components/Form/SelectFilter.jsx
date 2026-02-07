import React from "react";
import Icon from "@mdi/react";
import { mdiArrowDownDropCircle } from "@mdi/js";
import { useTheme } from "@/app/ThemeContext";

function SelectFilter({ setValue, data, tailwind='w-64', value }) {
  //Theme
  const { bgColorMain } = useTheme();
  return (
    <div className="relative col w-fit mt-1">
      <select
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        className={`cursor-pointer ${bgColorMain} ${tailwind}  border border-gray-400 py-1 px-4 rounded-lg`}
        style={{ appearance: "none" }}
      >
        {data.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <Icon
        className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
        path={mdiArrowDownDropCircle}
        size={0.6}
      />
    </div>
  );
}

export default SelectFilter;
