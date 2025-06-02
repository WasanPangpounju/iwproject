import React from "react";

import Icon from "@mdi/react";
import { useTheme } from "@/app/ThemeContext";

function ButtonBG1({ handleClick, mdiIcon, text, btn = false, tailwind }) {
  const { bgColorNavbar, bgColorWhite } = useTheme();

  const ButtonComponent = btn ? "button" : "div"; 
  
  return (
    <ButtonComponent
      onClick={() => handleClick()}
      className={` ${bgColorNavbar} ${bgColorWhite} ${tailwind}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
    >
      <Icon path={mdiIcon} size={1} />
      <p>{text}</p>
    </ButtonComponent>
  );
}

export default ButtonBG1;
