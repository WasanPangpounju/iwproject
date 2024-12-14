"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '@/app/components/NavbarLogo'
import NavbarSupervisor from '@/app/supervisor/components/NavbarSupervisor'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiFilePdfBox, mdiCloseCircle, mdiArrowLeftCircle, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js';
import StudentPersonal from './StudentPersonal'
import StudentEducation from './StudentEducation'
import StudentHistoryWork from './StudentHistoryWork'
import StudentSkills from './StudentSkills'

function StudentDetail({ id, setIdDetail, setLoader }) {

    const router = useRouter();
    const { status, data: session } = useSession();

    // Validate session and fetch user data
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        setLoader(false);

        if (!session) {
            router.replace("/");
            return;
        }

        if (id) {
            getUser(id);
        } else {
            router.replace("/agreement");
        }

        if (session?.user?.role === "user") {
            router.replace("/main");
        } else if (session?.user?.role === "admin") {
            router.replace("/admin");
        }

    }, [status, session, router]);

    const [dataUser, setDataUser] = useState([])
    async function getUser(id) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataUser(data.user || {});
        } catch (err) {
            console.error("Error fetching API", err);
        } finally {
            setLoader(false);
        }
    }

    //Theme
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
        bgColorMain2,
        setLineBlack,
        lineBlack,
        setTextBlue,
        textBlue,
        setRegisterColor,
        registerColor,
        inputEditColor,
        inputGrayColor
    } = useTheme();

    //set age
    const today = new Date();
    const yearToday = today.getFullYear();

    //set selected navbar
    const [selectNav, setSelectNav] = useState('ข้อมูลส่วนบุลคล')
    return (
        <div>
            <div className='flex gap-10 mt-5'>
                <div>
                    <Image priority alt="icon" className='w-24 ' src={dataUser.profile || "/image/main/user.png"} height={1000} width={1000} />
                </div>
                <div className='flex flex-col gap-2 justify-center'>
                    <p>{dataUser?.prefix || ""} {dataUser?.firstName} {dataUser?.lastName} </p>
                    <p>ชื่อเล่น: {dataUser?.nickname || "ไม่มีข้อมูล"}</p>
                    <p>อายุ: {dataUser?.yearBirthday ? `${yearToday - dataUser?.yearBirthday} ปี` : "ไม่มีข้อมูล"} </p>
                </div>
            </div>
            <div>
                <nav className='flex gap-2 mt-5'>
                    <div
                        className={`${selectNav === "ข้อมูลส่วนบุลคล" ? inputGrayColor === "bg-[#74c7c2]" || "" ? `bg-[#0d96f8] ${bgColorWhite}` : "" : ""}  cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => setSelectNav('ข้อมูลส่วนบุลคล')}
                    >
                        ข้อมูลส่วนบุลคล
                    </div>
                    <div
                        className={`${selectNav === "ประวัติการศึกษา" ? inputGrayColor === "bg-[#74c7c2]" || "" ? `bg-[#0d96f8] ${bgColorWhite}` : "" : ""} cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => setSelectNav('ประวัติการศึกษา')}
                    >
                        ประวัติการศึกษา
                    </div>
                    <div
                        className={`${selectNav === "ประวัติการฝึกงาน/ทำงาน" ? inputGrayColor === "bg-[#74c7c2]" || "" ? `bg-[#0d96f8] ${bgColorWhite}` : "" : ""} cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => setSelectNav('ประวัติการฝึกงาน/ทำงาน')}
                    >
                        ประวัติการฝึกงาน/ทำงาน
                    </div>
                    <div
                        className={`${selectNav === "ความสามารถ/การอบรม" ? inputGrayColor === "bg-[#74c7c2]" || "" ? `bg-[#0d96f8] ${bgColorWhite}` : "" : ""} cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => setSelectNav('ความสามารถ/การอบรม')}
                    >
                        ความสามารถ/การอบรม
                    </div>
                </nav>
            </div>
            <hr className='border-gray-500 mt-1' />
            {selectNav === "ข้อมูลส่วนบุลคล" ? (
                <StudentPersonal dataUser={dataUser} setLoader={setLoader}/>
            ) : selectNav === "ประวัติการศึกษา" ?(
                <StudentEducation  dataUser={dataUser} id={id} setLoader={setLoader}/>
            ) : selectNav === "ประวัติการฝึกงาน/ทำงาน" ? (
                <StudentHistoryWork dataUser={dataUser} id={id} setLoader={setLoader}/>
            ) : selectNav === "ความสามารถ/การอบรม" ? (
                <StudentSkills dataUser={dataUser} id={id} setLoader={setLoader}/>
            ): (
                <div>เกิดข้อผิดพลาด</div>
            )}
        </div>
    )
}

export default StudentDetail
