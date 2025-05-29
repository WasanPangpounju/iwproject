"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "../ThemeContext";
import Profile from "./Profile/Profile";
import { Tooltip } from "@mui/material";

function HeaderLogo({ title, dataUser }) {
  const {
    setFontSize,
    setBgColor,
    setBgColorNavbar,
    setBgColorWhite,
    setBgColorMain,
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
  } = useTheme();

  return (
    <nav
      className={`${bgColorMain} text-lg relative gap-1 flex justify-between border-b-8  border-[#75C7C2] `}
    >
      {dataUser ? (
        <div className=" flex items-center ">
          {/* <div className='h-full flex items-center bg-[#eeeeee] py-4 px-5 w-60 gap-5'> */}
          <div
            className={`h-full flex items-center ${bgColorMain} py-4 px-5 w-60 gap-5`}
          >
            <Profile
              imageSrc={dataUser.profile}
              tailwind="w-11 h-11"
            />
            <Tooltip title={`${dataUser.firstName} ${dataUser.lastName}`}>
              <p className=" font-bold text-ellipsis  overflow-hidden whitespace-nowrap ">
                {dataUser.firstName} {dataUser.lastName}
              </p>
            </Tooltip>
          </div>
          {title && (
            <div className="mx-7 my-1 font-bold ">
              <p>{title}</p>
            </div>
          )}
        </div>
      ) : null}
      <div></div>
      <div className=" flex py-2 px-5">
        <Image
          priority
          alt="icon"
          className="w-auto h-20"
          src="/image/logoheader.png"
          height={1000}
          width={1000}
        />
        {/* <Image priority alt="icon" className='w-auto h-14' src="/image/main/eee.png" height={1000} width={1000} />
                <Image priority alt="icon" className='w-auto h-14' src="/image/main/sss.png" height={1000} width={1000} /> */}
        <div className="-z-10 bg-orange-200 w-10 h-14 rounded-tl-full absolute bottom-0 right-0"></div>
      </div>
    </nav>
  );
}

export default HeaderLogo;
