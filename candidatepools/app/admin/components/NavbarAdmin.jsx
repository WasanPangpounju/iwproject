"use client";

import React, { useState, useEffect } from "react";
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
  mdiForum,
} from '@mdi/js';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeContext";

function NavbarAdmin({ status }) {
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

  useEffect(() => {
    getChats();
    // แก้ปัญหาหน้าแรกไม่ scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, [])

  //set path default
  const pathDefault = '/admin'

  // Logout
  function handleLogout() {

    signOut({ redirect: false })
      .then(() => {
        console.log("ออกจากระบบสำเร็จ");
        window?.location?.reload();
      })
      .catch((err) => {
        console.log("Sign out error:", err);
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

  //get chats
  const [chats, setChats] = useState([]);
  async function getChats() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Error getting data from API");
      }

      const data = await res.json();
      setChats(data.chats || {});
    } catch (err) {
      console.log(err)
    }
  }

  const sumChatNotRead = chats?.reduce((count, chat) => {
    return chat?.statusReadAdmin ? count + 1 : count;
  }, 0)

  return (
    <nav className={`${bgColorMain2} ${bgColor} ${fontSize} w-60 min-h-screen`} role="navigation" aria-label="หลักการนำทาง">
      <Link
        href="/admin"
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
      <Link href={`${pathDefault}/reports`}
        className={`${status === "reports"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ข้อมูลนักศึกษา">
        <Icon path={mdiChartBox} size={1} aria-hidden="true" aria-label="ข้อมูลนักศึกษา" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          รายงาน
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

export default NavbarAdmin;
