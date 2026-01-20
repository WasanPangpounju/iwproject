import React from "react";
import Icon from "@mdi/react";
import { useTheme } from "@/app/ThemeContext";

function ButtonBG2({
  handleClick,
  mdiIcon,
  text,
  btn = false,      // เดิมใช้กำหนดว่าเป็นปุ่ม submit หรือไม่
  tailwind = "",

  // ✅ เพิ่ม (ไม่กระทบของเดิม)
  type,
  ariaLabel,
  disabled = false,
}) {
  const { inputTextColor, inputGrayColor } = useTheme();

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400";

  return (
    <button
      type={type || (btn ? "submit" : "button")}
      onClick={handleClick}
      aria-label={ariaLabel || text}
      disabled={disabled}
      className={`${inputTextColor} ${inputGrayColor} ${tailwind}
        hover:cursor-pointer py-2 px-6 rounded-2xl
        flex justify-center items-center gap-1 border border-white
        disabled:opacity-60 disabled:cursor-not-allowed
        ${focusRing}`}
    >
      {mdiIcon ? <Icon path={mdiIcon} size={1} aria-hidden="true" /> : null}
      {text ? <span>{text}</span> : null}
    </button>
  );
}

export default ButtonBG2;
