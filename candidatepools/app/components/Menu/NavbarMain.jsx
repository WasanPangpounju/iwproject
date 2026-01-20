"use client";

import React, { useEffect } from "react";
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
} from "@mdi/js";
import { signOut } from "next-auth/react";
import { useTheme } from "../../ThemeContext"; // ✅ ปรับ path ให้ตรงกับโปรเจกต์คุณ (ถ้าอยู่ app/ThemeContext ให้ใช้ ../ThemeContext)

function NavbarMain() {
  const { fontSize, bgColor, bgColorMain2 } = useTheme();

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  const searchParams = useSearchParams();
  const path = searchParams.get("path");

  const mainRoute = "/iw";

  // ✅ แบบ B: เหลือเมนูหลักเท่านั้น
  const menuItems = [
    { id: 1, label: "หน้าแรก", icon: mdiHomeAccount, link: `${mainRoute}` , activeWhen: () => path === null },
    // แก้ไขข้อมูล: ให้ไปหน้าแรกของหมวด (เช่น stepper=1)
    { id: 2, label: "แก้ไขประวัติส่วนตัว", icon: mdiFileEditOutline, link: `${mainRoute}/edit?stepper=1&path=edit`, activeWhen: () => path === "edit" },
    // เรซูเม่/งานที่สนใจ: ไปหน้าหลักของหมวด
    { id: 3, label: "สร้างเรซูเม่ (สำหรับผู้ที่ไม่มีเรซูเม่)", icon: mdiFileAccount, link: `${mainRoute}/resume?path=resume`, activeWhen: () => path === "resume" },
    // ประชาสัมพันธ์: (ถ้าคุณมี route เฉพาะให้แก้ได้)
    { id: 4, label: "ประชาสัมพันธ์จากบริษัท", icon: mdiBullhorn, link: `${mainRoute}?path=posts`, activeWhen: () => path === "posts" },
    // เกี่ยวกับเรา: ไปหน้าหลักของหมวด (เช่น source)
    { id: 5, label: "เกี่ยวกับเรา", icon: mdiAccountMultiple, link: `${mainRoute}/about/source?path=about`, activeWhen: () => path === "about" },
    // ติดต่อเรา
    { id: 6, label: "ติดต่อเรา", icon: mdiHelpCircle, link: `${mainRoute}/help?path=help`, activeWhen: () => path === "help" },
  ];

  const baseItem =
    "cursor-pointer flex items-center px-7 gap-5 py-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const hoverItem = "hover:bg-[#fee2d9] hover:text-[#ff7201]";
  const activeItem = "bg-[#fee2d9] text-[#ff7201]";

  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <nav
      aria-label="เมนูหลัก"
      className={`${bgColorMain2} ${bgColor} w-full md:w-[18rem] shrink-0 border-r`}
    >
      <div role="menu" className="py-2">
        {menuItems.map((item) => {
          const isActive = item.activeWhen?.() ?? false;

          return (
            <Link
              key={item.id}
              href={item.link}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              className={`${fontSize} ${baseItem} ${isActive ? activeItem : hoverItem}`}
            >
              <Icon path={item.icon} size={1} aria-hidden="true" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}>
                {item.label}
              </p>
            </Link>
          );
        })}

        {/* ออกจากระบบ (ต้องเป็น button เพื่อ WCAG) */}
        <button
          type="button"
          onClick={handleLogout}
          className={`${fontSize} ${baseItem} ${hoverItem} w-full text-left`}
          aria-label="ออกจากระบบ"
        >
          <Icon path={mdiLogout} size={1} aria-hidden="true" />
          <span className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}>
            ออกจากระบบ
          </span>
        </button>
      </div>
    </nav>
  );
}

export default NavbarMain;
