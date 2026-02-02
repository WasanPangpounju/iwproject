"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiAccountBoxMultiple, mdiEmail, mdiPhone } from "@mdi/js";

export default function MissionSection() {
  const { bgColorNavbar, bgColorWhite, bgColorMain2, inputTextColor } = useTheme();

  const emphasisText = inputTextColor === "text-white" ? "text-[#0c5c9b]" : "";

  return (
    <section id="mission" aria-labelledby="about-mission-title">
      <h2 id="about-mission-title" className="sr-only">
        พันธกิจ
      </h2>

      <div className={`${bgColorMain2} pt-5 pb-0 px-4 sm:px-8 lg:px-10 rounded-lg`}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
          <Image
            priority
            alt="โลโก้โครงการ IW"
            className="w-auto h-20 sm:h-24 lg:h-28"
            src="/image/main/iw.png"
            height={1000}
            width={1000}
          />

          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold flex w-full items-start lg:items-center">
            <div className="w-fit flex flex-col gap-2">
              <p>พร้อมเคียงข้าง เพื่อให้เกิด</p>
              <p className="lg:ps-32">โอกาสการจ้างงานที่ลงตัว</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <div className="px-5 py-3 border-l-8 border-[#F97201] leading-relaxed">
            <span className="font-extrabold text-[#F97201]">IW เชื่อมองค์กรนายจ้างกับคนพิการ</span>&nbsp;
            ให้นายจ้างเข้าถึงแหล่งคนพิการที่พร้อมทำงาน มั่นใจในการจ้าง เห็นความสามารถเชิงประจักษ์
            ได้รับความรู้และประสบการณ์แนวทางความสำเร็จจากบริษัทต้นแบบ
          </div>

          <div className="px-5 py-3 border-l-8 border-[#F97201] leading-relaxed">
            <p>
              <span className="font-extrabold text-[#F97201]">IW พัฒนาคนพิการ</span>&nbsp;
              ให้มีความสามารถ มีทักษะและศักยภาพในการทำงานตรงความต้องการขององค์กรนายจ้าง
              พร้อมส่งเสริมให้มหาวิทยาลัย / วิทยาลัย / องค์กรคนพิการ ได้ทำความรู้จักนายจ้างเพื่อเชื่อมประสานทำงานร่วมกัน
              ผ่านกิจกรรมกลยุทธ์ดังนี้
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
          <div className={`p-3 ${bgColorMain2 === "bg-white" ? "bg-gray-100" : ""} rounded-md`}>
            <div className="flex gap-3 items-center">
              <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>1</div>
              <p className={`font-bold ${emphasisText}`}>Inclusion Job Fair</p>
            </div>
            <div className="text-sm mt-2">
              <p className="xl:text-lg">
                มหกรรมการจ้างงานคนพิการ (Inclusion Job Fair - IJF) เพื่อให้องค์กรนายจ้าง และคนพิการได้สัมภาษณ์
                เกิดเป็นโอกาสสำคัญในการจ้างงานคนพิการ
              </p>
            </div>
          </div>

          <div className="p-3 rounded-md">
            <div className="flex gap-3 items-center">
              <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>2</div>
              <p className={`font-bold ${emphasisText}`}>Disability Awareness</p>
            </div>
            <div className="text-sm mt-2">
              <p className="xl:text-lg">
                เสริมสร้างความตระหนักรู้เรื่องคนพิการความพิการ ให้องค์กรนายจ้าง / สถาบันการศึกษา
                เพื่อรับรู้ถึงความสามารถ/ศักยภาพ ความท้าทาย แนวทางการพัฒนา คนพิการและการอยู่ร่วมกันอย่างทัดเทียมบนความหลากหลาย
              </p>
            </div>
          </div>

          <div className="p-3 rounded-md">
            <div className="flex gap-3 items-center">
              <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>3</div>
              <p className={`font-bold ${emphasisText}`}>Follow Up</p>
            </div>
            <div className="text-sm mt-2">
              <p className="xl:text-lg">
                สนับสนุนการปรับตัวและความเข้าใจอันดี ในการทำงานของพนักงานพิการ และหัวหน้างานเพื่อให้สามารถทำงานอย่างราบรื่น ครองงานได้ในระยะยาว
              </p>
            </div>
          </div>

          <div className={`p-3 ${bgColorMain2 === "bg-white" ? "bg-gray-100" : ""} rounded-md`}>
            <div className="flex gap-3 items-center">
              <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>4</div>
              <p className={`font-bold ${emphasisText}`}>Company Visit & Open House</p>
            </div>
            <div className="text-sm mt-2">
              <p className="xl:text-lg">
                ประสานให้สถาบันการศึกษา พร้อมด้วยนักศึกษาพิการเข้าดูงานในบริษัทเรียนรู้หน้างานจริง
                ทำความรู้จักและเข้าใจบริบททางธุรกิจ นำสู่การเปิดให้บัณฑิตพิการฝึกงาน (Internship) และรับเข้าทำงานร่วมกันในองค์กร
              </p>
            </div>
          </div>
        </div>

        <div className={`mt-5 ${bgColorWhite} ${bgColorNavbar === "bg-[#F97201]" ? "bg-[#ff8d2c]" : ""} p-5 rounded-tl-3xl rounded-tr-3xl grid grid-cols-1 md:grid-cols-2 gap-4`}>
          <div className="flex flex-col gap-1 px-2 sm:px-5">
            <div className="flex items-center gap-3">
              <Icon path={mdiAccountBoxMultiple} size={0.8} aria-hidden="true" />
              <p>คุณวิภาสิริ บุญชูช่วย (อ้อม)</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon path={mdiEmail} size={0.8} aria-hidden="true" />
              <p>Wipasiri@sif.or.th</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon path={mdiPhone} size={0.8} aria-hidden="true" />
              <p>เบอร์โทร 086-898-6325</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-2 sm:px-5">
            <div className="flex items-center gap-3">
              <Icon path={mdiAccountBoxMultiple} size={0.8} aria-hidden="true" />
              <p>คุณจักรีวรรณ ศุภวุฒิ (ฟาม)</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon path={mdiEmail} size={0.8} aria-hidden="true" />
              <p>Jakkreewan@sif.or.th</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon path={mdiPhone} size={0.8} aria-hidden="true" />
              <p>เบอร์โทร 063-727-2476</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
