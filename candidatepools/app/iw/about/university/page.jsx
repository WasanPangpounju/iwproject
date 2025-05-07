"use client";

import React, { useState, useEffect } from "react";
import HeaderLogo from "@/app/components/HeaderLogo";
import NavbarMain from "@/app/components/Menu/NavbarMain";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiAccountBoxMultiple,
  mdiEmail,
  mdiPhone,
} from "@mdi/js";

function UniversityPage() {
  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const { status, data: session } = useSession();
  const [dataUser, setDataUser] = useState([]);

  // Validate session and fetch user data
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    setLoader(false);

    if (!session) {
      router.replace("/");
      return;
    }

    if (session?.user?.id) {
      getUser(session.user.id);
    } else {
      router.replace("/register");
    }
  }, [status, session, router]);

  //get data from user
  async function getUser(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Error getting data from API");
      }

      const data = await res.json();
      setDataUser(data.user || {});
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
      setLoader(false);
    }
  }

  //Theme
  const {
    setFontSize,
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
    bgColorMain2,
    setLineBlack,
    lineBlack,
    setTextBlue,
    textBlue,
    setRegisterColor,
    registerColor,
    inputEditColor,
    inputTextColor,
  } = useTheme();

  return (
    <>
      <div className={`${bgColorMain2} pt-5 rounded-lg `}>
        <div className="flex gap-10 w-full px-16">
          <Image
            priority
            alt="icon"
            className="w-auto h-28"
            src="/image/main/iw.png"
            height={1000}
            width={1000}
          />
          <div className="text-2xl font-extrabold flex w-full items-center">
            <div className="w-fit flex flex-col gap-1 whitespace-nowrap">
              <p className="">ร่วมกับศูนย์บริการนักศึกษาพิการ </p>
              <p className="">(Disability Support Service - DSS) </p>
              <p className="">เตรียมความพร้อมให้กับนักศึกษาพิการ </p>
            </div>
          </div>
        </div>
        <div className="mt-10 px-16">
          <p>
            <span
              className={` ${
                inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""
              }`}
            >
              โดยส่งเสริมนักศึกษาพิการที่ตั้งใจเรียน ต้องการพัฒนาตนเอง
            </span>{" "}
            ให้มีความมั่นใจ สามารถคิด วิเคราะห์ แก้ปัญหา ตัดสินใจที่ดี และ{" "}
            <span
              className={` ${
                inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""
              }`}
            >
              ได้ทำงานระหว่างเรียน (Work and Study) ที่ศูนย์ฯ DSS
              หรือหน่วยงานในมหาวิทยาลัย
            </span>{" "}
            เพื่อฝึกทักษะความรับผิดชอบ การจัดการเวลา การสื่อสาร การประสานงาน
            และทำงานเป็นทีม โดยทำงานสัปดาห์ละ 15-20 ชั่วโมง ตลอด 12 เดือน
            มีรายได้จากองค์กรนายจ้าง (สัญญามาตรา 35-จ้างเหมาบริการ)
          </p>
        </div>
        <div className="mt-10 flex gap-10 px-16">
          <div className="flex flex-col w-fit items-center gap-2">
            <p className="font-bold text-xl whitespace-nowrap">สนับสนุนให้</p>
            <Image
              className={`w-36 h-auto flex-shrink-0`}
              src={`/image/hand.PNG`}
              height={1000}
              width={1000}
              priority
              alt="poster"
            />
          </div>
          <div
            className={`max-w-80 ${
              inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""
            } `}
          >
            <p className="text-lg font-bold">นักศึกษาพิการ</p>
            <div className="flex flex-col gap-2  mt-1">
              <div className="flex gap-2 items-center ">
                <Icon
                  className="flex-shrink-0"
                  path={mdiCheckboxMarkedCircleOutline}
                  size={0.8}
                />
                <p>ตั้งเป้าหมายอาชีพรายบุคคล (Individual Career Plan-ICP)</p>
              </div>
              <div className="flex gap-2 items-center ">
                <Icon
                  className="flex-shrink-0"
                  path={mdiCheckboxMarkedCircleOutline}
                  size={0.8}
                />
                <p>
                  เข้าค่ายเยาวชนพิการ เตรียมพร้อมสู่การทำงานจริง (Youth-Able
                  Camp)
                </p>
              </div>
              <div className="flex gap-2 items-center ">
                <Icon
                  className="flex-shrink-0"
                  path={mdiCheckboxMarkedCircleOutline}
                  size={0.8}
                />
                <p>อบรมพัฒนาทักษะเชิงปฏิบัติการ Soft/Hard/RUN Skills</p>
              </div>
            </div>
          </div>
          <div
            className={`max-w-80 ${
              inputTextColor === "text-white" ? "text-[#fe7e16]" : ""
            } `}
          >
            <p className="text-lg font-bold">เจ้าหน้าที่</p>
            <div className="flex flex-col gap-2  mt-1">
              <div className="flex gap-2 items-center ">
                <Icon
                  className="flex-shrink-0"
                  path={mdiCheckboxMarkedCircleOutline}
                  size={0.8}
                />
                <p>
                  สร้างชุมชนการเรียนรู้เจ้าหน้าที่ มหาวิทยาลัย (Community of
                  Practice-COP)
                </p>
              </div>
              <div className="flex gap-2 items-center ">
                <Icon
                  className="flex-shrink-0"
                  path={mdiCheckboxMarkedCircleOutline}
                  size={0.8}
                />
                <p>
                  อบรมความรู้การเตรียมพร้อม คนพิการสู่การทำงาน และการให้
                  Feedback / Coaching / Counseling
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 px-16">
          <p className="text-lg font-bold">
            ผลลัพธ์ที่เกิดขึ้นกับนักศึกษาพิการ
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>มีความเชื่อมั่นในตนเองกล้าแสดงออก</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>มีการวางแผนอาชีพ</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>มีความเป็นผู้นำ (Active Student)</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>เกิดความมั่นใจในการหางาน / สมัครงาน</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>มีความรับผิดชอบต่อการเรียน/การทำงาน</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>เตรียม Resume ให้โดนใจนายจ้าง</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>มีรายได้แบ่งเบาภาระครอบครัว</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  bgColorNavbar === "bg-[#F97201]" ? "bg-[#0c5c9c]" : ""
                }`}
              ></div>
              <p>ได้ฝึกสัมภาษณ์งานเพื่อได้รับการจ้างงานมากขึ้น</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Image
            className={`w-full h-auto flex-shrink-0`}
            src={`/image/list_university.PNG`}
            height={1000}
            width={1000}
            priority
            alt="poster"
          />
        </div>
      </div>
      {loader && (
        <div>
          <Loader />
        </div>
      )}
    </>
  );
}

export default UniversityPage;
