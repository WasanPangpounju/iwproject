"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarSupervisor from './components/NavbarSupervisor'
import Image from 'next/image'
import Loader from '../components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../ThemeContext'
import Icon from '@mdi/react'
import { mdiAccountSchool, mdiAccountEdit, mdiFaceMan, mdiFaceWoman, mdiPlus, mdiContentSave, mdiCloseThick } from '@mdi/js'
import BarChart from '@/app/supervisor/components/ChartDisabled'



function SupervisorPage() {
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
        inputGrayColor,
    } = useTheme();

    const [loader, setLoader] = useState(false)

    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState([])

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

        if (session?.user?.id) {
            getUser(session.user.id);
            getDataAllUser();
        } else {
            router.replace("/agreement");
        }

        if (session?.user?.role === "user") {
            router.replace("/main");
        } else if (session?.user?.role === "admin") {
            router.replace("/admin");
        }

    }, [status, session, router]);

    //get data from user
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

    //get allUser
    const [allUser, setAllUser] = useState([])
    async function getDataAllUser() {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/students`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setAllUser(data.user || {});
        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    const count_allUser = allUser?.length;
    const count_graduation = allUser?.filter((user) => user?.typePerson === "บัณฑิตพิการ")?.length;
    const count_students = allUser?.filter((user) => user?.typePerson === "นักศึกษาพิการ")?.length;
    const count_male = allUser?.filter((user) => user?.sex === "ชาย")?.length;
    const count_female = allUser?.filter((user) => user?.sex === "หญิง")?.length;

    //count disabled
    const count_d1 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางการมองเห็น")
    )?.length;
    const count_d2 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางการได้ยินหรือสื่อความหมาย")
    )?.length;
    const count_d3 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางการเคลื่อนไหวหรือทางร่างกาย")
    )?.length;
    const count_d4 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางจิตใจหรือพฤติกรรม")
    )?.length;
    const count_d5 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางสติปัญญา")
    )?.length;
    const count_d6 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางการเรียนรู้")
    )?.length;
    const count_d7 = allUser?.filter((user) =>
        user?.typeDisabled?.some((disa) => disa === "พิการทางการออทิสติก")
    )?.length;

    console.log(
        allUser
    )
    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
            <NavbarLogo dataUser={dataUser} />
            <div className="flex">
                <NavbarSupervisor status="main" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        {allUser?.length <= 0 ? (
                            <p>กำลังโหลด...</p>
                        ) : (
                            <>
                                <p className='font-bold'>ข้อมูลผู้ใช้งานทั้งหมด</p>
                                <div className={`${bgColorWhite} mt-5 flex justify-center gap-x-10 gap-y-7 flex-wrap`}>
                                    <div className='bg-[#299d8f] rounded-sm py-2 w-64 flex flex-col justify-center items-center gap-1'>
                                        <p>ทั้งหมด</p>
                                        <p className='text-xl'>{count_allUser}</p>
                                    </div>
                                    <div className='bg-[#f4a261] rounded-sm px-10 py-2 w-64 gap-7 flex justify-center items-center'>
                                        <Icon className='' path={mdiAccountSchool} size={2} />
                                        <div className='flex flex-col justify-center items-center gap-1'>
                                            <p>บัณฑิต</p>
                                            <p className='text-xl'>{count_graduation}</p>
                                        </div>
                                    </div>
                                    <div className='bg-[#e9c46a]  rounded-sm px-10 py-2 w-64 gap-7 flex justify-center items-center'>
                                        <Icon className='' path={mdiAccountEdit} size={2} />
                                        <div className='flex flex-col justify-center items-center gap-1'>
                                            <p>นักศึกษา</p>
                                            <p className='text-xl'>{count_students}</p>
                                        </div>
                                    </div>
                                    <div className='bg-[#5494ca]  rounded-sm px-10 py-2 w-64 gap-7 flex justify-center items-center'>
                                        <Icon className='' path={mdiFaceMan} size={2} />
                                        <div className='flex flex-col justify-center items-center gap-1'>
                                            <p>ชาย</p>
                                            <p className='text-xl'>{count_male}</p>
                                        </div>
                                    </div>
                                    <div className='bg-[#f8a9a9]  rounded-sm px-10 py-2 w-64 gap-7 flex justify-center items-center'>
                                        <Icon className='' path={mdiFaceWoman} size={2} />
                                        <div className='flex flex-col justify-center items-center gap-1'>
                                            <p>หญิง</p>
                                            <p className='text-xl'>{count_female}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mt-10 overflow-scroll'>
                                    <BarChart d1={count_d1} d2={count_d2} d3={count_d3} d4={count_d4} d5={count_d5} d6={count_d6} d7={count_d7} allStudents={count_graduation+count_students}/>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default SupervisorPage

