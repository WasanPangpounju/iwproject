import React from "react";
import Icon from "@mdi/react";
import { mdiArrowDownDropCircle } from "@mdi/js";
import { useTheme } from "@/app/ThemeContext";

function SelectForm({ setValue, value, editMode, options, tailwind }) {
  const { inputEditColor, bgColorMain } = useTheme();

  return (
    <div className="relative col w-fit">
      <select
        onChange={(e) => setValue(e.target.value)}
        className={`${
          !editMode ? `${inputEditColor} cursor-default` : `cursor-pointer`
        } ${bgColorMain} ${tailwind} border border-gray-400 py-2 px-4 rounded-lg`}
        style={{ appearance: "none" }}
        disabled={!editMode}
        value={value || ""}
      >
        <option value="">-</option>
        {options?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.value}
          </option>
        ))}
      </select>
      <Icon
        className={`${
          !editMode ? "hidden" : ""
        } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
        path={mdiArrowDownDropCircle}
        size={0.8}
      />
    </div>
  );
}

export default SelectForm;