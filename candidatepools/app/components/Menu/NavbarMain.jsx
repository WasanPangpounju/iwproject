"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiDomain,
  mdiBullseyeArrow,
  mdiAccount,
  mdiLogout,
  mdiHelpCircle,
  mdiAlertBox,
  mdiBullhorn,
  mdiFileAccount,
  mdiFileEditOutline,
  mdiHomeAccount,
  mdiBriefcaseAccount,
  mdiAccountMultiple,
  mdiTownHall,
  mdiSchool,
  mdiBriefcaseOutline,
  mdiCertificate,
} from "@mdi/js";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../ThemeContext";
import { usePathname } from "next/navigation";

function NavbarMain() {
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
    bgColorMain2,
  } = useTheme();

  const router = useRouter();

  useEffect(() => {
    // แก้ปัญหาหน้าแรกไม่ scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

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

  //aboutme menu open
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);

  const handleAboutMenuOpen = () => {
    setIsAboutMenuOpen(true); // เปิดเมนู
  };

  const handleAboutMenuClose = () => {
    setIsAboutMenuOpen(false); // ปิดเมนู
  };

  const pathname = usePathname();
  const activePath = pathname.split("/iw/")[1]?.split("/")[0] || "";
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(activePath);
  }, [activePath]);

  const mainRoute = "/iw";
  const menuItems = [
    {
      id: 1,
      link: `${mainRoute}`,
    },
    {
      id: 2,
      link: `${mainRoute}/edit/editPersonal`,
    },
    {
      id: 3,
      link: `${mainRoute}/edit/editEducation`,
    },
    {
      id: 4,
      link: `${mainRoute}/edit/workHistory`,
    },
    {
      id: 5,
      link: `${mainRoute}/edit/editSkill`,
    },
    {
      id: 6,
      link: `${mainRoute}/resume`,
    },
    {
      id: 7,
      link: `${mainRoute}/resume/interestedwork`,
    },
    {
      id: 8,
      link: `${mainRoute}/about/origin`,
    },
    {
      id: 9,
      link: `${mainRoute}/about/mission`,
    },
    {
      id: 10,
      link: `${mainRoute}/about/university`,
    },
    {
      id: 11,
      link: `${mainRoute}/about/employer`,
    },
    {
      id: 12,
      link: `${mainRoute}/help`,
    },
  ];

  return (
    <nav
      className={`${bgColorMain2} ${bgColor} ${fontSize} w-60 min-h-screen`}
      role="navigation"
      aria-label="หลักการนำทาง"
    >
      <Link
        href={menuItems.find((item) => item.id === 1).link}
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

      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${
          status === "edit"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isEditMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === "Escape") {
            handleMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon path={mdiFileEditOutline} size={1} aria-hidden="true" />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          แก้ไขประวัติ
        </p>
        {isEditMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div
            className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`}
            role="menu"
          >
            <Link
              href={menuItems.find((item) => item.id === 2).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ข้อมูลส่วนบุคคล"
            >
              <Icon
                path={mdiAccount}
                size={1}
                aria-hidden="true"
                aria-label="ข้อมูลส่วนบุคคล"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ข้อมูลส่วนบุคคล
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 3).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการศึกษา"
            >
              <Icon
                path={mdiSchool}
                size={1}
                aria-hidden="true"
                aria-label="ประวัติการศึกษา"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ประวัติการศึกษา
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 4).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการทำงาน/ฝึกงาน"
            >
              <Icon
                path={mdiBriefcaseOutline}
                size={1}
                aria-hidden="true"
                aria-label="ประวัติการทำงาน/ฝึกงาน"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ประวัติการทำงาน/ฝึกงาน
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 5).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ความสามารถ/การอบรม"
            >
              <Icon
                path={mdiCertificate}
                size={1}
                aria-hidden="true"
                aria-label="ความสามารถ/การอบรม"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ความสามารถ/การอบรม
              </p>
            </Link>
          </div>
        )}
      </div>

      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${
          status === "resume"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isResumeMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleResumeMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleResumeMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleResumeMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === "Escape") {
            handleResumeMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon path={mdiFileAccount} size={1} aria-hidden="true" />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          เรซูเม่/งานที่สนใจ
        </p>
        {isResumeMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div
            className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`}
            role="menu"
          >
            <Link
              href={menuItems.find((item) => item.id === 6).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ข้อมูลส่วนบุคคล"
            >
              <Icon
                path={mdiAccount}
                size={1}
                aria-hidden="true"
                aria-label="เรซูเม่"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                เรซูเม่
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 7).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการศึกษา"
            >
              <Icon
                path={mdiBriefcaseAccount}
                size={1}
                aria-hidden="true"
                aria-label="ลักษณะงานที่สนใจ"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ลักษณะงานที่สนใจ
              </p>
            </Link>
          </div>
        )}
      </div>

      <Link
        href="#"
        className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3"
        role="menuitem"
        aria-label="ประชาสัมพันธ์จากบริษัท"
      >
        <Icon
          path={mdiBullhorn}
          size={1}
          aria-hidden="true"
          aria-label="ประชาสัมพันธ์จากบริษัท"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}
        >
          ประชาสัมพันธ์จากบริษัท
        </p>
      </Link>

      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${
          status === "about"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isAboutMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleAboutMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleAboutMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAboutMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === "Escape") {
            handleAboutMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon
          path={mdiAccountMultiple}
          size={1}
          aria-hidden="true"
          aria-label="เกี่ยวกับเรา"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          เกี่ยวกับเรา
        </p>
        {isAboutMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div
            className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`}
            role="menu"
          >
            <Link
              href={menuItems.find((item) => item.id === 8).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ข้อมูลส่วนบุคคล"
            >
              <Icon
                path={mdiAlertBox}
                size={1}
                aria-hidden="true"
                aria-label="เรซูเม่"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                ที่มา
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 9).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการศึกษา"
            >
              <Icon
                path={mdiBullseyeArrow}
                size={1}
                aria-hidden="true"
                aria-label="ลักษณะงานที่สนใจ"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                พันธกิจ
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 10).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการศึกษา"
            >
              <Icon
                path={mdiTownHall}
                size={1}
                aria-hidden="true"
                aria-label="ลักษณะงานที่สนใจ"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                มหาวิทยาลัย
              </p>
            </Link>
            <Link
              href={menuItems.find((item) => item.id === 11).link}
              className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3"
              role="menuitem"
              aria-label="ประวัติการศึกษา"
            >
              <Icon
                path={mdiDomain}
                size={1}
                aria-hidden="true"
                aria-label="ลักษณะงานที่สนใจ"
              />
              <p
                className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
              >
                นายจ้าง
              </p>
            </Link>
          </div>
        )}
      </div>

      <Link
        href={menuItems.find((item) => item.id === 12).link}
        className={`${
          status === "help"
            ? "bg-[#fee2d9] text-[#ff7201]"
            : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
        } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`}
        role="menuitem"
        aria-label="ช่วยเหลือ"
      >
        <Icon
          path={mdiHelpCircle}
          size={1}
          aria-hidden="true"
          aria-label="ช่วยเหลือ"
        />
        <p
          className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}
        >
          ติดต่อเรา
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

export default NavbarMain;
