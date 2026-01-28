"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiHomeAccount,
  mdiFileEditOutline,
  mdiFileAccount,
  mdiBullhorn,
  mdiAccountMultiple,
  mdiHelpCircle,
  mdiLogout,
  mdiAlertBox,
  mdiBullseyeArrow,
  mdiTownHall,
  mdiDomain,
} from "@mdi/js";
import { signOut } from "next-auth/react";
import { useTheme } from "../../ThemeContext";

function NavbarMain() {
  const { fontSize, bgColor, bgColorMain2 } = useTheme();

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  const searchParams = useSearchParams();
  const path = searchParams.get("path");

  const mainRoute = "/iw";

  // ✅ เมนูหลัก (เหมือนของใหม่)
  const menuItems = [
    {
      id: 1,
      label: "หน้าแรก",
      icon: mdiHomeAccount,
      link: `${mainRoute}`,
      activeWhen: () => path === null,
    },
    {
      id: 2,
      label: "แก้ไขประวัติส่วนตัว",
      icon: mdiFileEditOutline,
      link: `${mainRoute}/edit?stepper=1&path=edit`,
      activeWhen: () => path === "edit",
    },
    {
      id: 3,
      label: "สร้างเรซูเม่ (สำหรับผู้ที่ไม่มีเรซูเม่)",
      icon: mdiFileAccount,
      link: `${mainRoute}/resume?path=resume`,
      activeWhen: () => path === "resume",
    },
    {
      id: 4,
      label: "ประชาสัมพันธ์จากบริษัท",
      icon: mdiBullhorn,
      link: `${mainRoute}?path=posts`,
      activeWhen: () => path === "posts",
    },
    // เกี่ยวกับเรา (ทำเป็นเมนูย่อยด้านล่าง)
    {
      id: 6,
      label: "ติดต่อเรา",
      icon: mdiHelpCircle,
      link: `${mainRoute}/help?path=help`,
      activeWhen: () => path === "help",
    },
  ];

  // ✅ เมนูย่อย “เกี่ยวกับเรา” (แบบไฟล์เก่า)
  const aboutSubItems = [
    {
      id: "about-origin",
      label: "ที่มา",
      icon: mdiAlertBox,
      link: `${mainRoute}/about/origin?path=about`,
    },
    {
      id: "about-mission",
      label: "พันธกิจ",
      icon: mdiBullseyeArrow,
      link: `${mainRoute}/about/mission?path=about`,
    },
    {
      id: "about-university",
      label: "มหาวิทยาลัย",
      icon: mdiTownHall,
      link: `${mainRoute}/about/university?path=about`,
    },
    {
      id: "about-employer",
      label: "นายจ้าง/สถานประกอบการ",
      icon: mdiDomain,
      link: `${mainRoute}/about/employer?path=about`,
    },
  ];

  const baseItem =
    "cursor-pointer flex items-center px-7 gap-5 py-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const hoverItem = "hover:bg-[#fee2d9] hover:text-[#ff7201]";
  const activeItem = "bg-[#fee2d9] text-[#ff7201]";

  // ✅ About dropdown state (รองรับ click + keyboard + click outside)
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const aboutWrapRef = useRef(null);
  const aboutBtnId = "about-menu-button";
  const aboutMenuId = "about-submenu";

  useEffect(() => {
    function onDocClick(e) {
      if (!aboutWrapRef.current) return;
      if (!aboutWrapRef.current.contains(e.target)) setIsAboutOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setIsAboutOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  const isAboutActive = path === "about";

  return (
    <nav
      aria-label="เมนูหลัก"
      className={`${bgColorMain2} ${bgColor} w-full md:w-[18rem] shrink-0 border-r`}
    >
      <div role="menu" className="py-2">
        {/* เมนูทั่วไป */}
        {menuItems.slice(0, 4).map((item) => {
          const isActive = item.activeWhen?.() ?? false;

          return (
            <Link
              key={item.id}
              href={item.link}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              className={`${fontSize} ${baseItem} ${
                isActive ? activeItem : hoverItem
              }`}
            >
              <Icon path={item.icon} size={1} aria-hidden="true" />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}

        {/* ✅ เกี่ยวกับเรา (dropdown เมนูย่อย) */}
        <div ref={aboutWrapRef} className="relative">
          <button
            id={aboutBtnId}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-controls={aboutMenuId}
            aria-expanded={isAboutOpen}
            onClick={() => setIsAboutOpen((v) => !v)}
            onKeyDown={(e) => {
              // Enter/Space เปิด/ปิด
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsAboutOpen((v) => !v);
              }
            }}
            className={`${fontSize} ${baseItem} ${
              isAboutActive ? activeItem : hoverItem
            } w-full text-left`}
          >
            <Icon path={mdiAccountMultiple} size={1} aria-hidden="true" />
            <p
              className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}
            >
              เกี่ยวกับเรา
            </p>
          </button>

          {isAboutOpen && (
            <div
              id={aboutMenuId}
              role="menu"
              aria-labelledby={aboutBtnId}
              className={`${bgColorMain2} ${bgColor} min-w-[15rem] absolute left-full top-0 z-10 rounded-lg border shadow`}
            >
              {aboutSubItems.map((sub) => (
                <Link
                  key={sub.id}
                  href={sub.link}
                  role="menuitem"
                  className={`${fontSize} hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-4 py-3`}
                  onClick={() => setIsAboutOpen(false)}
                >
                  <Icon path={sub.icon} size={0.9} aria-hidden="true" />
                  <span className={`${fontSize} font-extrabold whitespace-nowrap`}>
                    {sub.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* เมนูหลัง about */}
        {menuItems.slice(4).map((item) => {
          const isActive = item.activeWhen?.() ?? false;

          return (
            <Link
              key={item.id}
              href={item.link}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              className={`${fontSize} ${baseItem} ${
                isActive ? activeItem : hoverItem
              }`}
            >
              <Icon path={item.icon} size={1} aria-hidden="true" />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}

        {/* ออกจากระบบ */}
        <button
          type="button"
          onClick={handleLogout}
          className={`${fontSize} ${baseItem} ${hoverItem} w-full text-left`}
          aria-label="ออกจากระบบ"
        >
          <Icon path={mdiLogout} size={1} aria-hidden="true" />
          <span
            className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}
          >
            ออกจากระบบ
          </span>
        </button>
      </div>
    </nav>
  );
}

export default NavbarMain;
