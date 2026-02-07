"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "../ThemeContext";
import Profile from "./Profile/Profile";
import { Tooltip, Skeleton } from "@mui/material";

function HeaderLogo({ title, dataUser }) {
  const {
    bgColorMain,
  } = useTheme();

  return (
    <nav
      className={`${bgColorMain} text-lg relative gap-1 flex justify-between border-b-8  border-[#75C7C2] `}
    >
       {dataUser && (
         <div className=" flex items-center ">
          {/* <div className='h-full flex items-center bg-[#eeeeee] py-4 px-5 w-60 gap-5'> */}
          <div
            className={`h-full flex items-center ${bgColorMain} py-4 px-5 w-60 gap-5`}
          >
            <Profile
              imageSrc={dataUser?.profile}
              tailwind="w-11 h-11"
              loading={!dataUser}
            />
            {dataUser ? (
              <Tooltip title={`${dataUser?.firstName ?? ''} ${dataUser?.lastName ?? ''}`}>
                <p className=" font-bold text-ellipsis  overflow-hidden whitespace-nowrap ">
                  {dataUser?.firstName ?? ''} {dataUser?.lastName ?? ''}
                </p>
              </Tooltip>
            ) : (
              <Skeleton variant="text" width={100} height={32} />
            )}
          </div>
          {title && (
            <div className="mx-7 my-1 font-bold ">
              {dataUser ? (
                <p>{title}</p>
              ) : (
                <Skeleton variant="text" width={80} height={28} />
              )}
            </div>
          )}
        </div>
       )}
  
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
