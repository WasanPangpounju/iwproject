"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiCertificate,
  mdiBriefcaseOutline,
  mdiSchool,
  mdiAccount,
  mdiLogout,
  mdiHelpCircle,
  mdiMessageAlert,
  mdiBullhorn,
  mdiFileAccount,
  mdiFileEditOutline,
  mdiHomeAccount,
  flowchage
} from '@mdi/js';

import styles from "@/app/components/styles/NavbarMain.module.css";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeContext";

function NavbarMain({ status }) {

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
    setLineBlack,
    lineBlack,
    setTextBlue,
    textBlue,
    setRegisterColor,
    registerColor,
  } = useTheme();


  const router = useRouter();
  //logout
  function handleLogout() {
    Swal.fire({
      title: "ออกจากระบบสำเร็จ",
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#0d96f8",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ redirect: false })
          .then(() => {
            console.log("ออกจากระบบสำเร็จ");
          })
          .catch((err) => {
            console.log("Sign out error:", err);
          });
      }
    });
  }

  return (
    // <div className="bg-black w-60 min-h-screen">
    <div className={`${bgColorNavbar} ${bgColorWhite} w-60 min-h-screen`}>
      <Link
        href="/main"
        className={`${status === "main"
          ? "bg-[#fee2d9] text-[#ff7201] cursor-default"
          : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"
          }  flex items-center px-7 gap-5 py-3`}
      >
        <Icon path={mdiHomeAccount} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          หน้าหลัก
        </p>
      </Link>
      <div
        className={`${status === "edit"
          ? "bg-[#fee2d9] text-[#ff7201] "
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } ${styles.dropdown
          } cursor-pointer relative flex items-center px-7 gap-5 py-3`}
      >
        <Icon path={mdiFileEditOutline} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          แก้ไขประวัติ
        </p>
        <div className={`${styles.dropdown_menu} ${bgColorNavbar} ${bgColorWhite} max-w-fit absolute left-full top-0`}>
          <Link href="/editPersonal" className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3">
            <Icon path={mdiAccount} size={1} />
            <p className="font-extrabold whitespace-nowrap text-ellipsis ">ข้อมูลส่วนบุลคล</p>
          </Link>
          <Link href="/editEducation" className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3">
            <Icon path={mdiSchool} size={1} />
            <p className="font-extrabold whitespace-nowrap text-ellipsis">ประวัติการศึกษา</p>
          </Link>
          <Link href="#" className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3">
            <Icon path={mdiBriefcaseOutline} size={1} />
            <p className="font-extrabold whitespace-nowrap text-ellipsis">ประวัติการทำงาน/ฝึกงาน</p>
          </Link>
          <Link href="#" className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3">
            <Icon path={mdiCertificate} size={1} />
            <p className="font-extrabold whitespace-nowrap text-ellipsis">ความสามารถ/การอบรม</p>
          </Link>
        </div>
      </div>
      <div className="hover:bg-[#fee2d9] hover:text-[#ff7201]  cursor-pointer flex items-center px-7 gap-5 py-3">
        <Icon path={mdiFileAccount} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          เรซูเม่/งานที่สนใจ
        </p>
      </div>
      <div className="hover:bg-[#fee2d9] hover:text-[#ff7201]  cursor-pointer flex items-center px-7 gap-5 py-3">
        <Icon path={mdiBullhorn} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis overflow-hidden">
          ประชาสัมพันธ์จากบริษัท
        </p>
      </div>
      <div className="hover:bg-[#fee2d9] hover:text-[#ff7201]  cursor-pointer flex items-center px-7 gap-5 py-3">
        <Icon path={mdiMessageAlert} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          เกี่ยวกับเรา
        </p>
      </div>
      <div className="hover:bg-[#fee2d9] hover:text-[#ff7201]  cursor-pointer flex items-center px-7 gap-5 py-3">
        <Icon path={mdiHelpCircle} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          ช่วยเหลือ
        </p>
      </div>
      <Link
        href="/graph"
        className={`${status === "graph"
          ? "bg-[#fee2d9] text-[#ff7201] cursor-default"
          : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"
          }  flex items-center px-7 gap-5 py-3`}
      >
        <Icon path={mdiHomeAccount} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          flowchage
        </p>
      </Link>
      <div
        onClick={handleLogout}
        className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer  flex items-center px-7 gap-5 py-3"
      >
        <Icon path={mdiLogout} size={1} />
        <p className="font-extrabold whitespace-nowrap text-ellipsis">
          ออกจากระบบ
        </p>
      </div>
    </div>
  );
}

export default NavbarMain;
