"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "../ThemeContext";

function MainPage() {
  const {
    fontHeadSize,
    fontSize,
    bgColor,
    bgColorMain2,
  } = useTheme();

  return (
    <>
      <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
        <p className={`${fontHeadSize} font-bold`}>ข่าวประชาสัมพันธ์</p>
        <div className="mt-5 flex justify-between border flex-wrap">
          <div>
            <p className={`font-bold ${fontSize}`}>
              ยินดีรับสมัครนักศึกษาจบใหม่เข้าร่วมงาน
            </p>
            <p className="mt-3">
              บริษัท ยินดีรับศึกษาจบใหม่เข้าร่วมงาน....................อ่านต่อ
            </p>
          </div>
          <Image
            className="rounded-lg w-96 h-64 border bg-red-400"
            src="/image/main/postermain.png"
            height={1000}
            width={1000}
            priority
            alt="photo-post"
          ></Image>
        </div>
        <div className="mt-5 flex justify-between border flex-wrap">
          <div>
            <p className={`font-bold ${fontSize}`}>
              ยินดีรับสมัครนักศึกษาจบใหม่เข้าร่วมงาน
            </p>
            <p className="mt-3">
              บริษัท ยินดีรับศึกษาจบใหม่เข้าร่วมงาน....................อ่านต่อ
            </p>
          </div>
          <Image
            className="rounded-lg w-96 h-64 border bg-red-400"
            src="/image/main/postermain.png"
            height={1000}
            width={1000}
            priority
            alt="photo-post"
          ></Image>
        </div>
      </div>
    </>
  );
}

export default MainPage;
