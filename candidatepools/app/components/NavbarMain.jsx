"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@mdi/react';
import { mdiHomeAccount } from '@mdi/js';
import styles from '@/app/components/styles/NavbarMain.module.css'
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function NavbarMain({ status }) {

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
                signOut().then(() => {
                    router.replace("/");
                }).catch((err) => {
                    console.log("Sign out error :", err);
                });
            }
        });
    }

    return (
        <div className="bg-white w-60 h-dvh float-left">
            <Link href="/main" className={`${status === "main" ? "bg-[#fee2d9] text-[#ff7201] cursor-default" : "cursor-pointer hover:bg-[#fee2d9] hover:text-[#ff7201]"}  flex items-center px-7 gap-5 py-3`}>
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">หน้าหลัก</p>
            </Link>
            <div className={`${status === "edit" ? "bg-[#fee2d9] text-[#ff7201] ":"hover:bg-[#fee2d9] hover:text-[#ff7201]"} ${styles.dropdown} cursor-pointer relative flex items-center px-7 gap-5 py-3`}>
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">แก้ไขประวัติ</p>
                <div className={`${styles.dropdown_menu} w-60 bg-white absolute right-[-100%] top-0`}>
                    <Link href="/editPersonal" className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                        <Icon path={mdiHomeAccount} size={1} />
                        <p className="font-extrabold whitespace-nowrap text-ellipsis ">ข้อมูลส่วนบุลคล</p>
                    </Link>
                    <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                        <Icon path={mdiHomeAccount} size={1} />
                        <p className="font-extrabold whitespace-nowrap text-ellipsis">ประวัติการศึกษา</p>
                    </div>
                    <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                        <Icon path={mdiHomeAccount} size={1} />
                        <p className="font-extrabold whitespace-nowrap text-ellipsis">ประวัติการทำงาน/ฝึกงาน</p>
                    </div>
                    <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                        <Icon path={mdiHomeAccount} size={1} />
                        <p className="font-extrabold whitespace-nowrap text-ellipsis">ความสามารถ/การอบรม</p>
                    </div>
                </div>
            </div>
            <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">เรซูเม่/งานที่สนใจ</p>
            </div>
            <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis overflow-hidden">ประชาสัมพันธ์จากบริษัท</p>
            </div>
            <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">เกี่ยวกับเรา</p>
            </div>
            <div className="hover:bg-[#fee2d9] hover:text-[#ff7201] text-[black] cursor-pointer flex items-center px-7 gap-5 py-3">
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">ช่วยเหลือ</p>
            </div>
            <div onClick={handleLogout} className="hover:bg-[#fee2d9] hover:text-[#ff7201] cursor-pointer text-[black]cursor-pointer flex items-center px-7 gap-5 py-3">
                <Icon path={mdiHomeAccount} size={1} />
                <p className="font-extrabold whitespace-nowrap text-ellipsis">ออกจากระบบ</p>
            </div>
        </div>
    )
}

export default NavbarMain
