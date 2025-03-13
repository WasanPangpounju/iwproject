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
import PieChart from '@/app/supervisor/components/ChartDisabled'



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
            getDataEducations();
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

    //get data educations
    const [allEducations, setAllEducations] = useState([])
    async function getDataEducations() {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setAllEducations(data.educations || {});
        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //catalog_user
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

    //level
    const count_level1 = allEducations?.filter((edu) => edu.level[0] === '1')?.length;
    const count_level2 = allEducations?.filter((edu) => edu.level[0] === '2')?.length;
    const count_level3 = allEducations?.filter((edu) => edu.level[0] === '3')?.length;
    const count_level4 = allEducations?.filter((edu) => edu.level[0] === '4')?.length;

    //student age
    const currentYear = new Date().getFullYear();
    const count_age11_20 = allUser?.filter((user) => {
        const birthYear = Number(user?.yearBirthday)
        const age = currentYear - birthYear;
        return age >= 11 && age <= 20;
    })?.length;
    const count_age21_30 = allUser?.filter((user) => {
        const birthYear = Number(user?.yearBirthday)
        const age = currentYear - birthYear;
        return age >= 21 && age <= 30;
    })?.length;
    const count_age31_40 = allUser?.filter((user) => {
        const birthYear = Number(user?.yearBirthday)
        const age = currentYear - birthYear;
        return age >= 31 && age <= 40;
    })?.length;
    const count_age41_50 = allUser?.filter((user) => {
        const birthYear = Number(user?.yearBirthday)
        const age = currentYear - birthYear;
        return age >= 41 && age <= 50;
    })?.length;
    const count_age50 = allUser?.filter((user) => {
        const birthYear = Number(user?.yearBirthday)
        const age = currentYear - birthYear;
        return age > 50;
    })?.length;

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
                                <div className={`mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2`}>
                                    <div className='flex flex-col justify-center gap-3 p-5 bg-gray-200 max-w-96'>
                                        <div className='bg-[#ffa152] rounded-sm py-2  flex flex-col justify-center items-center gap-1'>
                                            <p>ทั้งหมด</p>
                                            <p className='text-xl'>{count_allUser}</p>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='bg-[#ffa152] py-2 rounded-sm flex flex-col items-center gap-1 w-[50%]'>
                                                <Icon className='' path={mdiAccountSchool} size={1.2} />
                                                <div className='flex flex-col justify-center items-center gap-1'>
                                                    <p>บัณฑิต {count_graduation}</p>
                                                </div>
                                            </div>
                                            <div className='bg-[#ffa152] py-2  rounded-sm flex flex-col justify-center items-center gap-1 w-[50%]'>
                                                <Icon className='' path={mdiAccountEdit} size={1.2} />
                                                <div className='flex flex-col justify-center items-center gap-1'>
                                                    <p>นักศึกษา {count_students}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col bg-gray-200 gap-3 p-5 max-w-96'>
                                        <div className='bg-[#8aceff]  rounded-sm gap-1 py-2 flex flex-col justify-center items-center'>
                                            <div className='flex items-center gap-2'>
                                                <Icon className='' path={mdiFaceMan} size={1} />
                                                <p>ชาย</p>
                                            </div>
                                            <p className='text-xl'>{count_male}</p>
                                        </div>
                                        <div className='bg-[#ffdddc]  rounded-sm gap-1 py-2 flex flex-col justify-center items-center'>

                                            <div className='flex items-center gap-2'>
                                                <Icon className='' path={mdiFaceWoman} size={1} />
                                                <p>หญิง</p>
                                            </div>
                                            <p className='text-xl'>{count_female}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col bg-gray-200 gap-3 p-5 max-w-96'>
                                        <div className='bg-[#78dfc7]  rounded-sm gap-1 py-2 px-5 flex flex-col justify-center'>
                                            <p>ระดับชั้น</p>
                                            <div className='flex justify-between'>
                                                <p>ปี 1</p>
                                                <p>{`${count_level1 === 0 ? "-" : `${count_level1} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>ปี 2</p>
                                                <p>{`${count_level2 === 0 ? "-" : `${count_level2} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>ปี 3</p>
                                                <p>{`${count_level3 === 0 ? "-" : `${count_level3} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>ปี 4</p>
                                                <p>{`${count_level4 === 0 ? "-" : `${count_level4} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>อื่นๆ</p>
                                                <p>{`${count_graduation === 0 ? "-" : `${count_graduation} คน`} `}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col bg-gray-200 gap-3 p-5 max-w-96'>
                                        <div className='bg-[#a9eef9]  rounded-sm gap-1 py-2 px-5 flex flex-col justify-center'>
                                            <p>ช่วงอายุ</p>
                                            <div className='flex justify-between'>
                                                <p>11-20 ปี</p>
                                                <p>{`${count_age11_20 === 0 ? "-" : `${count_age11_20} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>21-30 ปี</p>
                                                <p>{`${count_age21_30 === 0 ? "-" : `${count_age21_30} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>31-40 ปี</p>
                                                <p>{`${count_age31_40 === 0 ? "-" : `${count_age31_40} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>41-50 ปี</p>
                                                <p>{`${count_age41_50 === 0 ? "-" : `${count_age41_50} คน`} `}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p>{`< 50`}</p>
                                                <p>{`${count_age50 === 0 ? "-" : `${count_age50} คน`} `}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mt-5 overflow-scroll'>
                                    <PieChart d1={count_d1} d2={count_d2} d3={count_d3} d4={count_d4} d5={count_d5} d6={count_d6} d7={count_d7} allStudents={count_graduation + count_students} />

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

