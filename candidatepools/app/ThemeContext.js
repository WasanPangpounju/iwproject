

import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [fontSize, setFontSize] = useState("normal-font");
  const [fontHeadSize, setFontHeadSize] = useState("text-2xl");

  const [bgColor, setBgColor] = useState("bg-[#F4F6FA] text-black");
  const [textColorKey, setTextColorKey] = useState("black");
  const [bgColorNavbar, setBgColorNavbar] = useState("bg-[#F97201]");
  const [bgColorWhite, setBgColorWhite] = useState("text-white");
  const [bgColorMain, setBgColorMain] = useState("#e6ffff");
  const [bgColorMain2, setBgColorMain2] = useState("bg-white");
  const [lineBlack, setLineBlack] = useState("border-black");
  const [textBlue, setTextBlue] = useState("text-blue-500");
  const [registerColor, setRegisterColor] = useState("text-[#F97201]");
  const [inputEditColor, setInputEditColor] = useState("bg-gray-200");
  const [inputTextColor, setInputTextColor] = useState("text-white");
  const [inputGrayColor, setInputGrayColor] = useState("bg-[#74c7c2]");

  return (
    <ThemeContext.Provider value={{
      fontSize,
      setFontSize,
      fontHeadSize,
      setFontHeadSize,
      bgColor,
      setBgColor,
      bgColorNavbar,
      setBgColorNavbar,
      bgColorWhite,
      setBgColorWhite,
      bgColorMain,
      setBgColorMain,
      setBgColorMain2,
      bgColorMain2,
      setLineBlack,
      lineBlack,
      setTextBlue,
      textBlue,
      setRegisterColor,
      registerColor,
      setInputEditColor,
      inputEditColor,
      setInputGrayColor,
      inputGrayColor,
      setInputTextColor,
      inputTextColor,
      setTextColorKey,
      textColorKey
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
