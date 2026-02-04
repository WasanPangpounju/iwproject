"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiDomain,
  mdiAccountSchool,
  mdiAccountGroup,
  mdiLogout,
  mdiAccountDetails,
  mdiChartBox,
  mdiHomeAccount,
  mdiCog,
  mdiForum,
  mdiClipboardTextClock,
  mdiSchool,
} from "@mdi/js";

import { signOut } from "next-auth/react";
import { useTheme } from "@/app/ThemeContext";

function NavbarSupervisor() {
  const { fontSize, bgColor, bgColorMain2 } = useTheme();

  useEffect(() => {
    // แก้ปัญหาหน้าแรกไม่ scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  // Logout
  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  const pathname = usePathname();
  const activePath = pathname.split("/su/")[1]?.split("/")[0] || "";
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(activePath);
  }, [activePath]);

  const mainRoute = "/su";
  const menuItems = [
    {
      id: 1,
      link: `${mainRoute}`,
    },
    {
      id: 2,
      link: `${mainRoute}/admin`,
    },
    {
      id: 3,
      link: `${mainRoute}/chat`,
    },
    {
      id: 4,
      link: `${mainRoute}/company`,
    },
    {
      id: 5,
      link: `${mainRoute}/reports`,
    },
    {
      id: 6,
      link: `${mainRoute}/students`,
    },
    {
      id: 7,
      link: `${mainRoute}/usermanagement`,
    },
    {
      id: 8,
      link: `${mainRoute}/system-log`,
    },
    {
      id: 9,
      link: `${mainRoute}/setting/uni`,
    },
  ];

  const getLink = (id) => {
    return menuItems.find((item) => item.id === id).link;
  };

  //resume menu open
  const [isSettingMenuOpen, setIsResumeMenuOpen] = useState(false);

  const handleSettingMenuOpen = () => {
    setIsResumeMenuOpen(true); // เปิดเมนู
  };

  const handleSettingMenuClose = () => {
    setIsResumeMenuOpen(false); // ปิดเมนู
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
        href={getLink(6)}
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
          status === "admin"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ข้อมูลเจ้าหน้าที่"
      >
        <Icon
          path={mdiAccountDetails}
          size={1}
          aria-hidden="true"
          aria-label="ข้อมูลเจ้าหน้าที่"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ข้อมูลเจ้าหน้าที่
        </p>
      </Link>

      <Link
        href={getLink(4)}
        className={`${
          status === "company"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ข้อมูลบริษัท"
      >
        <Icon
          path={mdiDomain}
          size={1}
          aria-hidden="true"
          aria-label="ข้อมูลบริษัท"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ข้อมูลบริษัท
        </p>
      </Link>

      <Link
        href={getLink(7)}
        className={`${
          status === "usermanagement"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="จัดการผู้ใช้งาน"
      >
        <Icon
          path={mdiAccountGroup}
          size={1}
          aria-hidden="true"
          aria-label="จัดการผู้ใช้งาน"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          จัดการผู้ใช้งาน
        </p>
      </Link>
      <Link
        href={getLink(8)}
        className={`${
          status === "system-log"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="บันทึกกิจกรรม"
      >
        <Icon
          path={mdiClipboardTextClock}
          size={1}
          aria-hidden="true"
          aria-label="บันทึกกิจกรรม"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          สถานะผู้ใช้งาน
        </p>
      </Link>
      <Link
        href={getLink(3)}
        className={`${
          status === "chat"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        }  focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ข้อความ"
      >
        <div className="relative">
          <Icon
            path={mdiForum}
            size={1}
            aria-hidden="true"
            aria-label="ข้อความ"
          />
          {/* <div className={`bg-red-500 w-2 h-2 rounded-full absolute right-0 top-[-4px] shadow`}></div> */}
        </div>
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ข้อความ
        </p>
      </Link>
      <Link
        href={getLink(5)}
        className={`${
          status === "reports"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="รายงาน"
      >
        <Icon
          path={mdiChartBox}
          size={1}
          aria-hidden="true"
          aria-label="รายงาน"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          รายงาน
        </p>
      </Link>
      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${
          status === "setting"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isSettingMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleSettingMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleSettingMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSettingMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === "Escape") {
            handleSettingMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon path={mdiCog} size={1} aria-hidden="true" />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ตั้งค่าการใช้งาน
        </p>
        {isSettingMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div
            className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`}
            role="menu"
          >
            <Link
              href={getLink(9)}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ตั้งค่าสถาบันการศึกษา"
            >
              <Icon path={mdiSchool} size={1} aria-hidden="true" aria-label="" />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ตั้งค่าสถาบันการศึกษา
              </p>
            </Link>
          </div>
        )}
      </div>
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
export default NavbarSupervisor;
