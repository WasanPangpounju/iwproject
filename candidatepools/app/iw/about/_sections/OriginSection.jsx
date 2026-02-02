"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiCheckboxMarkedCircleOutline, mdiBullseyeArrow } from "@mdi/js";

export default function OriginSection() {
  const { bgColorNavbar, bgColorWhite, bgColorMain2, inputTextColor } = useTheme();

  const emphasisText = inputTextColor === "text-white" ? "text-[#0c5c9b]" : "";

  return (
    <section id="origin" aria-labelledby="about-origin-title">
      <h2 id="about-origin-title" className="sr-only">
        ที่มา
      </h2>

      <div
        className={`${
          bgColorNavbar === "bg-[#F97201]" ? "bg-[#ff8d2c]" : ""
        } ${bgColorWhite} rounded-lg`}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-3 p-5 px-4 sm:px-8 lg:px-10">
            <p className="text-2xl font-ex">มูลนิธินวัตกรรมทางสังคม</p>

            <p className="max-w-xl">
              มูลนิธิฯ ดำเนินการภายใต้การสนับสนุน จากสำนักงานกองทุนสนับสนุนการสร้าง เสริมสุขภาพ (สสส.)
              ริเริ่มส่งเสริมให้คน พิการในระดับการศึกษาอาชีวศึกษา และอุดมศึกษาได้รับการจ้างงานกระแสหลัก
              ทำงานตอบภารกิจขององค์กรนายจ้าง
            </p>
          </div>

          <div className={`${bgColorMain2} w-full lg:w-96 p-2 rounded-bl-3xl flex flex-col justify-center items-center gap-2`}>
            <Image
              priority
              alt="โลโก้โครงการ IW"
              className="w-auto h-20"
              src="/image/main/iw.png"
              height={1000}
              width={1000}
            />
            <div className="flex gap-5">
              <Image
                priority
                alt="โลโก้ภาคีที่เกี่ยวข้อง (1)"
                className="w-auto h-20"
                src="/image/main/eee.png"
                height={1000}
                width={1000}
              />
              <Image
                priority
                alt="โลโก้ภาคีที่เกี่ยวข้อง (2)"
                className="w-auto h-20"
                src="/image/main/sss.png"
                height={1000}
                width={1000}
              />
            </div>
          </div>
        </div>

        <div className="p-5 pt-5 px-4 sm:px-8 lg:px-10">
          <div className={`rounded-lg ${bgColorMain2} ${emphasisText} p-5`}>
            <p className="text-xl font-bold">IW การจ้างงานกระแสหลัก</p>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className={`bg-[#0c5c9b] py-1 px-2 ${bgColorWhite} rounded-lg w-fit`}>
                  <p>ยกระดับนักศึกษา/บัณฑิตพิการ</p>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex gap-2 items-start">
                    <Icon path={mdiCheckboxMarkedCircleOutline} size={1} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
                    <p>มีทักษะที่ตลาดแรงงานต้องการ</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Icon path={mdiCheckboxMarkedCircleOutline} size={1} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
                    <p>ศักยภาพพร้อมทำงาน</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Icon path={mdiCheckboxMarkedCircleOutline} size={1} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
                    <p>ทำงานได้ ทำงานเป็น ตอบโจทย์</p>
                  </div>
                </div>
              </div>

              <div>
                <div className={`bg-[#0c5c9b] py-1 px-2 ${bgColorWhite} rounded-lg w-fit`}>
                  <p>สนับสนุนนายจ้าง</p>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex gap-2 items-start">
                    <Icon path={mdiCheckboxMarkedCircleOutline} size={1} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
                    <p>เข้าถึงคนพิการที่มีคุณภาพ</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Icon path={mdiCheckboxMarkedCircleOutline} size={1} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
                    <p>เข้าใจการทำงานร่วมกันอย่างเกื้อกูล</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0 px-4 sm:px-8 lg:px-10">
          <p className="text-xl mx-0 sm:mx-5">ผลลัพธ์ของ IW</p>

          <div className={`${emphasisText} mt-1 grid grid-cols-1 lg:grid-cols-2 gap-3`}>
            {[1, 2].map((idx) => (
              <div key={idx}>
                <div className="flex items-center mx-0 sm:mx-5">
                  <div className={`${bgColorMain2} p-1 w-fit rounded-full`}>
                    <Icon path={mdiBullseyeArrow} size={1} aria-hidden="true" />
                  </div>
                  <hr className="border-white border-2 w-full" />
                </div>

                <div className={`p-5 mt-2 rounded-lg ${bgColorMain2} ${emphasisText}`}>
                  {idx === 1 ? (
                    <p>
                      ส่งเสริม<span className="font-bold">สถาบันการศึกษา</span> อาชีวศึกษาและมหาวิทยาลัย ให้เป็นเจ้าของภารกิจ
                      (Ownership) และจัดกระบวนการพัฒนาศักยภาพนักศึกษาและบัณฑิตพิการตามแนวคิด การเปลี่ยนผ่านการศึกษาสู่การมีงานทำ
                      (Transition to Work-TW) เพื่อตอบโจทย์นายจ้างอย่างยั่งยืน
                    </p>
                  ) : (
                    <p>
                      เชื่อมโยงให้เกิดสหภาคีการจ้างงานคนพิการ ระหว่างภาคีสถาบันการศึกษาและภาคีองค์กรนายจ้าง เพื่อเตรียมความพร้อมนักศึกษา
                      และบัณฑิตพิการให้ทำงานตอบโจทย์ตลาดแรงงาน (Active Development Collaboration) ขยายอัตราการจ้างงานเกิดเป็นนวัตกรรมการจ้างงานกระแสหลัก
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
