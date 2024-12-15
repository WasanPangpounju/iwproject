"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import {
    mdiDomain,
  mdiBriefcaseOutline,
  mdiAccountSchool,
  mdiAccountGroup,
  mdiLogout,
  mdiHelpCircle,
  mdiMessageAlert,
  mdiAccountDetails,
  mdiChartBox,
  mdiFileEditOutline,
  mdiHomeAccount,
  mdiCog,
} from '@mdi/js';

import styles from "@/app/components/styles/NavbarMain.module.css";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeContext";

function NavbarSupervisor({ status }) {
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
    bgColorMain2
  } = useTheme();

  const router = useRouter();

  //set path default
  const pathDefault = '/supervisor'

  // Logout
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

  //edit menu open
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsEditMenuOpen(true); // เปิดเมนู
  };

  const handleMenuClose = () => {
    setIsEditMenuOpen(false); // ปิดเมนู
  };

  //resume menu open
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);

  const handleResumeMenuOpen = () => {
    setIsResumeMenuOpen(true); // เปิดเมนู
  };

  const handleResumeMenuClose = () => {
    setIsResumeMenuOpen(false); // ปิดเมนู
  };

  return (
    <nav className={`${bgColorMain2} ${bgColor} ${fontSize} w-60 min-h-screen`} role="navigation" aria-label="หลักการนำทาง">
      <Link
        href="/supervisor"
        className={`${status === "main"
          ? "bg-[#fee2d9] text-[#ff7201] cursor-default"
          : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } ${fontSize} flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201] `}
        role="menuitem"
        aria-label="หน้าหลัก"
      >
        <Icon path={mdiHomeAccount} size={1} aria-hidden="true" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          หน้าหลัก
        </p>
      </Link>

      <Link href={`${pathDefault}/students`}
        className={`${status === "dataStudent"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ข้อมูลนักศึกษา">
        <Icon path={mdiAccountSchool} size={1} aria-hidden="true" aria-label="ข้อมูลนักศึกษา" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
        ข้อมูลนักศึกษา
        </p>
      </Link>

      <Link href="#" 
        className={`${status === "dataAdmin"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ข้อมูลเจ้าหน้าที่">
        <Icon path={mdiAccountDetails} size={1} aria-hidden="true" aria-label="ข้อมูลเจ้าหน้าที่" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
        ข้อมูลเจ้าหน้าที่
        </p>
      </Link>

      <Link href="#" 
        className={`${status === "dataCompany"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ข้อมูลบริษัท">
        <Icon path={mdiDomain} size={1} aria-hidden="true" aria-label="ข้อมูลบริษัท" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          ข้อมูลบริษัท
        </p>
      </Link>

      <Link href={`${pathDefault}/usermanagement`}
        className={`${status === "usermanagement"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="จัดการผู้ใช้งาน">
        <Icon path={mdiAccountGroup} size={1} aria-hidden="true" aria-label="จัดการผู้ใช้งาน" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          จัดการผู้ใช้งาน
        </p>
      </Link>
      <Link href="#" 
        className={`${status === "dashbord"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="รายงาน">
        <Icon path={mdiChartBox} size={1} aria-hidden="true" aria-label="รายงาน" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
            รายงาน
        </p>
      </Link>
      <Link href="#" 
        className={`${status === "setting"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ตั้งค่าการใช้งาน">
        <Icon path={mdiCog} size={1} aria-hidden="true" aria-label="ตั้งค่าการใช้งาน" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
            ตั้งค่าการใช้งาน
        </p>
      </Link>

      <div
        onClick={handleLogout}
        className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3"
        role="button"
        aria-label="ออกจากระบบ"
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
      >
        <Icon path={mdiLogout} size={1} aria-hidden="true" aria-label="ออกจากระบบ" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          ออกจากระบบ
        </p>
      </div>
    </nav>
  );
}

export default NavbarSupervisor;
