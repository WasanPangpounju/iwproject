"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";

export default function EmployerSection() {
  const { bgColorNavbar, bgColorWhite, bgColorMain2 } = useTheme();

  return (
    <section id="employer" aria-labelledby="about-employer-title">
      <h2 id="about-employer-title" className="sr-only">
        นายจ้าง/สถานประกอบการ
      </h2>

      <div className={`${bgColorMain2} pt-5 rounded-lg`}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full px-4 sm:px-8 lg:px-16">
          <Image
            priority
            alt="โลโก้โครงการ IW"
            className="w-auto h-20 sm:h-24 lg:h-28"
            src="/image/main/iw.png"
            height={1000}
            width={1000}
          />
          <div className="text-xl sm:text-2xl font-extrabold flex w-full items-start lg:items-end">
            <div className="w-fit flex flex-col gap-1 font-bold text-2xl sm:text-3xl max-w-[30rem]">
              <p>ให้บริการสนับสนุนองค์กรนายจ้างในการจ้างงานคนพิการแบบครบวงจร</p>
            </div>
          </div>
        </div>

        <div
          className={`${bgColorWhite} ${
            bgColorNavbar === "bg-[#F97201]" ? "bg-[#ff8d2c]" : ""
          } rounded-br-lg rounded-bl-lg px-4 sm:px-8 lg:px-16 py-5 pb-10 mt-6 sm:mt-10`}
        >
          <div>
            <p>
              ประสานงานกับมหาวิทยาลัย/วิทยาลัยที่มีนักศึกษาพิการ เพื่อให้นายจ้างเข้าถึงแหล่งบัณฑิตพิการ ที่มีศักยภาพ
              โดยให้คำแนะนำเกี่ยวกับกฎหมายการจ้างงานคนพิการกระบวนการจ้างงานคนพิการ ตั้งแต่การสรรหาคนพิการ
              อบรมพัฒนาคนพิการ สนับสนุนหลังการจ้าง ให้ความรู้เรื่องคนพิการ/ความพิการ (DisabilityAwareness- DA )
              และให้คำปรึกษาในการออกแบบงานให้ตรงกับ ความต้องการสอดคล้องกับศักยภาพและความพิการ
            </p>
          </div>

          <div className="mt-5">
            <Image
              priority
              alt="โปสเตอร์ประชาสัมพันธ์โครงการ IW"
              className="w-full rounded-lg"
              src="/image/poster_iw.JPG"
              height={1000}
              width={1000}
            />
          </div>

          <div className="mt-5 flex flex-col lg:flex-row justify-center gap-6 lg:gap-10">
            <div className="text-2xl xl:text-3xl">
              <p>
                ตั้งแต่ปี <span className="text-4xl xl:text-5xl font-bold">2562</span> ถึง{" "}
                <span className="text-4xl xl:text-5xl font-bold">2568</span>
              </p>
              <p>
                มีนายจ้างกว่า <span className="text-4xl xl:text-5xl font-bold">60</span> แห่ง
              </p>
            </div>

            <div className="w-full lg:w-80">
              <p>
                สนับสนุนให้นักศึกษาและบัณฑิตพิการ ที่มีความพร้อมทำงานในองค์กรมากขึ้น โดยจ้างงานในมาตรา 33 และ 35
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Image
              priority
              alt="ภาพสรุปผู้สนับสนุน/สปอนเซอร์"
              className="w-full rounded-lg"
              src="/image/sponser.JPG"
              height={1000}
              width={1000}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
