import React from "react";
import { useTheme } from "@/app/ThemeContext";

function InputForm({
  value,
  editMode,
  setValue,
  tailwind,
  disabled,
  styles,
  placeholder,
  type = "text"
}) {
  const { bgColorMain, inputEditColor } = useTheme();

  // ตั้งค่าพิเศษสำหรับแต่ละ style
  const extraProps =
    styles === "idCard"
      ? {
          inputMode: "numeric",
          pattern: "\\d{13}",
          maxLength: 13,
        }
      : styles === "tel"
      ? {
          inputMode: "numeric",
          pattern: "\\d{10}",
          maxLength: 10,
        }
      : styles === "password"
      ? {
          type: "password",
        }
      : {};

  return (
    <input
      placeholder={placeholder}
      type={type}
      className={`${
        !editMode && !disabled
          ? `${inputEditColor} cursor-default focus:outline-none`
          : ""
      } ${bgColorMain} ${
        disabled && "bg-gray-200"
      } ${tailwind} border border-gray-400 py-2 px-4 rounded-lg`}
      onChange={(e) => setValue(e.target.value)}
      value={value || ""}
      readOnly={!editMode}
      disabled={disabled}
      {...extraProps}
    />
  );
}

export default InputForm;
