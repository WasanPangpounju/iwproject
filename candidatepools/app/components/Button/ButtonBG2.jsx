import React from "react";

import Icon from "@mdi/react";
import { useTheme } from "@/app/ThemeContext";

function ButtonBG2({ handleClick, mdiIcon, text, btn = false }) {
  const { inputTextColor, inputGrayColor } = useTheme();

  const ButtonComponent = btn ? "button" : "div"; // ใช้ button ถ้า style เป็น "btn"

  return (
    <ButtonComponent
      onClick={() => handleClick()}
      className={` ${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`}
    >
      <Icon path={mdiIcon} size={1} />
      <p>{text}</p>
    </ButtonComponent>
  );
}

export default ButtonBG2;
