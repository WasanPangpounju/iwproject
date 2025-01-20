"use client";

import React, { useState, useEffect } from "react";
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
  mdiBriefcaseAccount,
} from '@mdi/js';

import styles from "@/app/components/styles/NavbarMain.module.css";
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
    bgColorMain2
  } = useTheme();

  const router = useRouter();


  // Logout
  function handleLogout() {
    // Swal.fire({
    //   title: "ออกจากระบบสำเร็จ",
    //   icon: "success",
    //   confirmButtonText: "ตกลง",
    //   confirmButtonColor: "#0d96f8",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     signOut({ redirect: false })
    //       .then(() => {
    //         console.log("ออกจากระบบสำเร็จ");
    //       })
    //       .catch((err) => {
    //         console.log("Sign out error:", err);
    //       });
    //   }
    // });
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

  return (
    <nav className={`${bgColorMain2} ${bgColor} ${fontSize} w-60 min-h-screen`} role="navigation" aria-label="หลักการนำทาง">
      <Link
        href="/main"
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

      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${status === "edit"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isEditMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === 'Escape') {
            handleMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon path={mdiFileEditOutline} size={1} aria-hidden="true" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          แก้ไขประวัติ
        </p>
        {isEditMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`} role="menu">
            <Link href="/editPersonal" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ข้อมูลส่วนบุคคล">
              <Icon path={mdiAccount} size={1} aria-hidden="true" aria-label="ข้อมูลส่วนบุคคล" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>ข้อมูลส่วนบุคคล</p>
            </Link>
            <Link href="/editEducation" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ประวัติการศึกษา">
              <Icon path={mdiSchool} size={1} aria-hidden="true" aria-label="ประวัติการศึกษา" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>ประวัติการศึกษา</p>
            </Link>
            <Link href="/workHistory" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ประวัติการทำงาน/ฝึกงาน">
              <Icon path={mdiBriefcaseOutline} size={1} aria-hidden="true" aria-label="ประวัติการทำงาน/ฝึกงาน" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>ประวัติการทำงาน/ฝึกงาน</p>
            </Link>
            <Link href="/editSkill" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ความสามารถ/การอบรม">
              <Icon path={mdiCertificate} size={1} aria-hidden="true" aria-label="ความสามารถ/การอบรม" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>ความสามารถ/การอบรม</p>
            </Link>
          </div>
        )}
      </div>

      <div
        tabIndex="0" // ทำให้สามารถเข้าถึงได้ด้วยการกด Tab
        role="menuitem"
        className={`${status === "resume"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } ${fontSize} cursor-pointer relative flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-haspopup="true"
        aria-expanded={isResumeMenuOpen} // แสดงสถานะว่าเปิดหรือปิดเมนู
        onMouseEnter={handleResumeMenuOpen} // เปิดเมนูเมื่อ mouse hover
        onMouseLeave={handleResumeMenuClose} // ปิดเมนูเมื่อ mouse ออกจากพื้นที่เมนู
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleResumeMenuOpen(); // เปิดเมนูเมื่อกด Enter
          }
          if (e.key === 'Escape') {
            handleResumeMenuClose(); // ปิดเมนูเมื่อกด Escape
          }
        }}
      >
        <Icon path={mdiFileAccount} size={1} aria-hidden="true" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          เรซูเม่/งานที่สนใจ
        </p>
        {isResumeMenuOpen && ( // แสดงเมนูถ้า isEditMenuOpen เป็น true
          <div className={`${bgColorMain2} ${bgColor}  max-w-fit absolute left-full top-0 z-10`} role="menu">
            <Link href="/resume" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ข้อมูลส่วนบุคคล">
              <Icon path={mdiAccount} size={1} aria-hidden="true" aria-label="เรซูเม่" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>เรซูเม่</p>
            </Link>
            <Link href="/interestedwork" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-5 gap-5 py-3" role="menuitem" aria-label="ประวัติการศึกษา">
              <Icon path={mdiBriefcaseAccount} size={1} aria-hidden="true" aria-label="ลักษณะงานที่สนใจ" />
              <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>ลักษณะงานที่สนใจ</p>
            </Link>
          </div>
        )}
      </div>


      <Link href="#" className="hover:bg-[#fee2d9] hover:text-[#ff7201] focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3" role="menuitem" aria-label="ประชาสัมพันธ์จากบริษัท">
        <Icon path={mdiBullhorn} size={1} aria-hidden="true" aria-label="ประชาสัมพันธ์จากบริษัท" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis overflow-hidden`}>
          ประชาสัมพันธ์จากบริษัท
        </p>
      </Link>

      <Link href="/aboutMe"
        className={`${status === "about"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="เกี่ยวกับเรา">
        <Icon path={mdiMessageAlert} size={1} aria-hidden="true" aria-label="เกี่ยวกับเรา" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          เกี่ยวกับเรา
        </p>
      </Link>

      <Link href="/help"
        className={`${status === "help"
          ? "bg-[#fee2d9] text-[#ff7201]"
          : "hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } focus:bg-[#fee2d9] focus:text-[#ff7201] cursor-pointer flex items-center px-7 gap-5 py-3`} role="menuitem" aria-label="ช่วยเหลือ">
        <Icon path={mdiHelpCircle} size={1} aria-hidden="true" aria-label="ช่วยเหลือ" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          ติดต่อเรา
        </p>
      </Link>

      {/* <Link
        href="/graph"
        className={`${status === "graph"
          ? "bg-[#fee2d9] text-[#ff7201] cursor-default"
          : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"
          } flex items-center px-7 gap-5 py-3 focus:bg-[#fee2d9] focus:text-[#ff7201]`}
        aria-label="flowchage"
      >
        <Icon path={mdiHomeAccount} size={1} aria-hidden="true" aria-label="flowchage" />
        <p className={`${fontSize} font-extrabold whitespace-nowrap text-ellipsis`}>
          flowchage
        </p>
      </Link> */}

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

export default NavbarMain;
