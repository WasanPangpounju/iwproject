"use client";

import React from "react";
import Icon from "@mdi/react";
import { mdiMonitor } from "@mdi/js";
import { useTheme } from "../ThemeContext";

function Navbar({ }) {
  // Accept setBgColor as a prop
  // console.log('bgColorNavbar',bgColorNavbar);
  // console.log('fontSize',fontSize);

  const {
    setFontSize,
    fontHeadSize,
    setFontHeadSize,
    setBgColor,
    setBgColorNavbar,
    setBgColorWhite,
    setBgColorMain,
    setBgColorMain2,
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
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
    inputTextColor,
    setInputTextColor,
    setTextColorKey,
    textColorKey
  } = useTheme();

  return (
    // <div className='`${setBgColor}` px-5 py-2 flex items-center '>
    <nav className={`${bgColorNavbar} px-5 py-2 flex items-center flex-wrap gap-x-5 gap-y-3`}>
      {/* <div className={`bg-white text-black rounded-full w-6 h-6 flex items-center justify-center  font-bold ${fontSize}`}> */}
      <div className="flex items-center gap-1">
        <div
          className={`${bgColor} rounded-full w-6 h-6 flex items-center justify-center  font-bold ${fontSize}`}
        >
          A
        </div>
        <p className={`${bgColorWhite} font-thin  ms-2 ${fontSize}`}>
          ขนาดตัวอักษร
        </p>
      </div>
      <div className="flex gap-2 ">
        <div
          onClick={() => {
            setFontSize("small-font");
            setFontHeadSize("text-xl");
          }}
          className={`small-font hover:cursor-pointer ${bgColor} py-1 px-3 rounded-lg h-6 flex justify-center items-center`}
        >
          เล็ก
        </div>
        <div
          onClick={() => {
            setFontSize("normal-font");
            setFontHeadSize("text-2xl");
          }}
          className={`normal-font hover:cursor-pointer ${bgColor} px-3 rounded-lg h-6 flex justify-center items-center`}
        >
          ปกติ
        </div>
        <div
          onClick={() => {
            setFontSize("big-font");
            setFontHeadSize("text-3xl");
          }}
          className={`big-font hover:cursor-pointer ${bgColor} py-1 px-3 rounded-lg h-6 flex justify-center items-center`}
        >
          ใหญ่
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <div
          className={` ${bgColor} w-6 h-6 rounded-full flex items-center justify-center`}
        >
          <Icon path={mdiMonitor} size={0.7} />
        </div>
        <p className={`${bgColorWhite} ${fontSize}`}>แสดงผล</p>
      </div>
      <div className={`${fontSize} flex gap-2`}>
        <div
          onClick={() => {
            setBgColor("bg-black text-white"); // Change background to black and text to white
            setTextColorKey('white')
            setBgColorNavbar("bg-black");
            setBgColorWhite("text-white");
            setBgColorMain("bg-black");
            setBgColorMain2("bg-black");
            setLineBlack("border-white");
            setTextBlue("text-white-500");
            setRegisterColor("text-white");
            setInputEditColor("bg-black-200");
            setInputGrayColor("bg-black");
            setInputTextColor("text-white")
          }}
          className="hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2  font-thin"
        >
          อักษรขาวพื้นดำ
        </div>
        <div
          onClick={() => {
            setBgColor("bg-black text-[#e7e703]"); // Change background to black and text to yellow
            setTextColorKey('#e7e703')
            setBgColorNavbar("bg-black"); // Change navbar background to black
            setBgColorWhite("text-[#e7e703]");
            setBgColorMain("bg-black");
            setBgColorMain2("bg-black");
            setLineBlack("border-white");
            setTextBlue("text-[#e7e703]-500");
            setRegisterColor("text-[#e7e703]");
            setInputEditColor("bg-black-200");
            setInputGrayColor("bg-black");
            setInputTextColor("text-[#e7e703]")

          }}
          className="hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2  font-thin"
        >
          อักษรเหลืองพื้นดำ
        </div>
        <div
          onClick={() => {
            setBgColor("bg-[#F4F6FA] text-black"); // Reset to default background and text color
            setTextColorKey('black')
            setBgColorNavbar("bg-[#F97201]");
            // setBgColorNavbar("bg-white");
            setBgColorWhite("text-white");
            setBgColorMain("#e6ffff");
            setBgColorMain2("bg-white");
            setLineBlack("border-black");
            setTextBlue("text-blue-500");
            setRegisterColor("text-[#F97201]");
            setInputEditColor("bg-gray-200");
            setInputGrayColor("bg-[#74c7c2]");
            setInputTextColor("text-white")

          }}
          className="hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2  font-thin"
        >
          ปกติ
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
