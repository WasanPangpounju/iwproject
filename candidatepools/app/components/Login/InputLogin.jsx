import React from "react";

import { useTheme } from "@/app/ThemeContext";
function InputLogin({ value, setValue, type, placeholder }) {
  const { bgColorMain, fontSize } = useTheme();
  return (
    <input
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      className={`${bgColorMain} ${fontSize} w-72 border py-2 px-5 rounded-lg`}
      type={type}
      placeholder={placeholder}
    />
  );
}

export default InputLogin;
