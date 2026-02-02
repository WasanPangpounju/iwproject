"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiCheckboxMarkedCircleOutline } from "@mdi/js";

export default function UniversitySection() {
  const { bgColorNavbar, bgColorMain2, inputTextColor } = useTheme();

  const emphasisText = inputTextColor === "text-white" ? "text-[#0c5c9b]" : "";

  return (
    <section id="university" aria-labelledby="about-university-title">
      <h2 id="about-university-title" className="sr-only">
        มหาวิทยาลัย
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
          <div className="text-xl sm:text-2xl font-extrabold flex w-full items-start lg:items-center">
            <div className="w-fit flex flex-col gap-1">
              <p>ร่วมกับศูนย์บริการนักศึกษาพิการ</p>
              <p>(Disability Support Service - DSS)</p>
              <p>เตรียมความพร้อมให้กับนักศึกษาพิการ</p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 px-4 sm:px-8 lg:px-16 leading-relaxed">
          <p>
            <span className={emphasisText}>โดยส่งเสริมนักศึกษาพิการที่ตั้งใจเรียน ต้องการพัฒนาตนเอง</span>{" "}
            ให้มีความมั่นใจ สามารถคิด วิเคราะห์ แก้ปัญหา ตัดสินใจที่ดี และ{" "}
            <span className={emphasisText}>ได้ทำงานระหว่างเรียน (Work and Study) ที่ศูนย์ฯ DSS หรือหน่วยงานในมหาวิทยาลัย</span>{" "}
            เพื่อฝึกทักษะความรับผิดชอบ การจัดการเวลา การสื่อสาร การประสานงาน และทำงานเป็นทีม โดยทำงานสัปดาห์ละ 15-20 ชั่วโมง ตลอด 12 เดือน
            มีรายได้จากองค์กรนายจ้าง (สัญญามาตรา 35-จ้างเหมาบริการ)
          </p>
        </div>

        <div className="mt-6 sm:mt-10 px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex flex-col w-fit items-center gap-2">
              <p className="font-bold text-lg sm:text-xl whitespace-nowrap">สนับสนุนให้</p>
              <Image
                className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0"
                src="/image/hand.PNG"
                height={1000}
                width={1000}
                priority
                alt="ภาพประกอบการสนับสนุน"
              />
            </div>

            <div className={`max-w-xl ${emphasisText}`}>
              <p className="text-lg font-bold">นักศึกษาพิการ</p>
              <ul className="flex flex-col gap-2 mt-2">
                <li className="flex gap-2 items-start">
                  <Icon className="flex-shrink-0 mt-0.5" path={mdiCheckboxMarkedCircleOutline} size={0.8} aria-hidden="true" />
                  <span>ตั้งเป้าหมายอาชีพรายบุคคล (Individual Career Plan-ICP)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <Icon className="flex-shrink-0 mt-0.5" path={mdiCheckboxMarkedCircleOutline} size={0.8} aria-hidden="true" />
                  <span>เข้าค่ายเยาวชนพิการ เตรียมพร้อมสู่การทำงานจริง (Youth-Able Camp)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <Icon className="flex-shrink-0 mt-0.5" path={mdiCheckboxMarkedCircleOutline} size={0.8} aria-hidden="true" />
                  <span>อบรมพัฒนาทักษะเชิงปฏิบัติการ Soft/Hard/RUN Skills</span>
                </li>
              </ul>
            </div>

            <div className={`max-w-xl ${inputTextColor === "text-white" ? "text-[#fe7e16]" : ""}`}>
              <p className="text-lg font-bold">เจ้าหน้าที่</p>
              <ul className="flex flex-col gap-2 mt-2">
                <li className="flex gap-2 items-start">
                  <Icon className="flex-shrink-0 mt-0.5" path={mdiCheckboxMarkedCircleOutline} size={0.8} aria-hidden="true" />
                  <span>สร้างชุมชนการเรียนรู้เจ้าหน้าที่ มหาวิทยาลัย (Community of Practice-COP)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <Icon className="flex-shrink-0 mt-0.5" path={mdiCheckboxMarkedCircleOutline} size={0.8} aria-hidden="true" />
                  <span>อบรมความรู้การเตรียมพร้อม คนพิการสู่การทำงาน และการให้ Feedback / Coaching / Counseling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 px-4 sm:px-8 lg:px-16">
          <p className="text-lg font-bold">ผลลัพธ์ที่เกิดขึ้นกับนักศึกษาพิการ</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {[
              "มีความเชื่อมั่นในตนเองกล้าแสดงออก",
              "มีการวางแผนอาชีพ",
              "มีความเป็นผู้นำ (Active Student)",
              "เกิดความมั่นใจในการหางาน / สมัครงาน",
              "มีความรับผิดชอบต่อการเรียน/การทำงาน",
              "เตรียม Resume ให้โดนใจนายจ้าง",
              "มีรายได้แบ่งเบาภาระครอบครัว",
              "ได้ฝึกสัมภาษณ์งานเพื่อได้รับการจ้างงานมากขึ้น",
            ].map((text) => (
              <li key={text} className="flex items-start gap-2">
                <span
                  className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 ${
                    bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                  }`}
                  aria-hidden="true"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 sm:mt-10">
          <Image
            className="w-full h-auto"
            src="/image/list_university.PNG"
            height={1000}
            width={1000}
            priority
            alt="รายชื่อมหาวิทยาลัยที่เข้าร่วมโครงการ"
          />
        </div>
      </div>
    </section>
  );
}
