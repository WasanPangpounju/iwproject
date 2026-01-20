import React from "react";
import Icon from "@mdi/react";
import { useTheme } from "@/app/ThemeContext";

function ButtonBG1({
  handleClick,
  mdiIcon,
  text,
  btn = false,        // เดิม: ใช้ตัดสินใจ type
  tailwind = "",
  type,               // ✅ ใหม่: ให้ parent override ได้
  ariaLabel,          // ✅ ใหม่: สำหรับ screen reader
}) {
  const { bgColorNavbar, bgColorWhite } = useTheme();

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white";

  return (
    <button
      type={type || (btn ? "submit" : "button")}
      onClick={handleClick}
      aria-label={ariaLabel || text}
      className={`${bgColorNavbar} ${bgColorWhite} ${tailwind}
        hover:cursor-pointer py-2 px-6 rounded-2xl
        flex justify-center items-center gap-1 border border-white
        ${focusRing}`}
    >
      {mdiIcon && <Icon path={mdiIcon} size={1} aria-hidden="true" />}
      {text && <span>{text}</span>}
    </button>
  );
}

export default ButtonBG1;
