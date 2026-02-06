"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiAccountSchool,
  mdiLogout,
  mdiChartBox,
  mdiHomeAccount,
  mdiAccount,
} from "@mdi/js";

import { signOut } from "next-auth/react";
import { useTheme } from "@/app/ThemeContext";

function NavbarAdmin() {
  const {
    fontSize,
    bgColor,
    bgColorMain2,
  } = useTheme();

  useEffect(() => {
    getChats();
    // แก้ปัญหาหน้าแรกไม่ scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  //set path default
  const pathDefault = "/admin";

  // Logout
  function handleLogout() {
    signOut({ callbackUrl: "/" });
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
      console.log(err);
    }
  }

  const pathname = usePathname();
  const activePath = pathname.split("/ad/")[1]?.split("/")[0] || "";
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(activePath);
  }, [activePath]);

  const mainRoute = "/ad";
  const menuItems = [
    {
      id: 1,
      link: `${mainRoute}`,
    },
    {
      id: 2,
      link: `${mainRoute}/reports`,
    },
    {
      id: 3,
      link: `${mainRoute}/students`,
    },
    {
      id: 4,
      link: `${mainRoute}/profile`,
    }
  ];

  const getLink = (id) => {
    return menuItems.find((item) => item.id === id).link;
  };

  return (
    <nav
      className={`${bgColorMain2} ${bgColor} ${fontSize} w-60 min-h-screen`}
      role="navigation"
      aria-label="หลักการนำทาง"
    >
      <Link
        href={getLink(1)}
        className={`${
          status === ""
            ? "bg-[#fee2d9] text-[#ff7201] cursor-default"
            : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } ${fontSize} flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201] `}
        role="menuitem"
        aria-label="หน้าหลัก"
      >
        <Icon path={mdiHomeAccount} size={1} aria-hidden="true" />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          หน้าหลัก
        </p>
      </Link>

      <Link
        href={getLink(3)}
        className={`${
          status === "students"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ข้อมูลนักศึกษา"
      >
        <Icon
          path={mdiAccountSchool}
          size={1}
          aria-hidden="true"
          aria-label="ข้อมูลนักศึกษา"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ข้อมูลนักศึกษา
        </p>
      </Link>
      <Link
        href={getLink(2)}
        className={`${
          status === "reports"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ข้อมูลนักศึกษา"
      >
        <Icon
          path={mdiChartBox}
          size={1}
          aria-hidden="true"
          aria-label="ข้อมูลนักศึกษา"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          สรุปข้อมูลผู้ใช้งาน
        </p>
      </Link>

      <Link
        href={getLink(4)}
        className={`${
          status === "profile"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="แก้ไขข้อมูลส่วนตัว"
      >
        <Icon
          path={mdiAccount}
          size={1}
          aria-hidden="true"
          aria-label="แก้ไขข้อมูลส่วนตัว"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          แก้ไขข้อมูลส่วนตัว
        </p>
      </Link>

      <div
        onClick={handleLogout}
        className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3"
        role="button"
        aria-label="ออกจากระบบ"
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
      >
        <Icon
          path={mdiLogout}
          size={1}
          aria-hidden="true"
          aria-label="ออกจากระบบ"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ออกจากระบบ
        </p>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
