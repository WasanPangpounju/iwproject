"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '@/app/components/NavbarLogo'
import NavbarMain from '@/app/components/NavbarMain'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react'
import {
    mdiCheckboxMarkedCircleOutline,
    mdiAccountBoxMultiple,
    mdiEmail,
    mdiPhone
} from '@mdi/js';

function MissionPage() {
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
        } else {
            router.replace("/register");
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
        inputTextColor
    } = useTheme();

    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize} xl:xl:text-lg`}>
            <NavbarLogo title="พันธกิจ" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="about" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} pt-5 pb-0 px-10 rounded-lg `}>
                        <div className='flex gap-10 w-full'>
                            <Image priority alt="icon" className='w-auto h-28' src="/image/main/iw.png" height={1000} width={1000} />
                            <div className='text-3xl font-extrabold flex w-full items-center' >
                                <div className='w-fit flex flex-col gap-2 whitespace-nowrap'>
                                    <p className=''>พร้อมเคียงข้าง เพื่อให้เกิด </p>
                                    <p className='ps-32'>โอกาสการจ้างงานที่ลงตัว </p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 flex flex-col gap-5'>
                            <div className='px-5 py-3 border-l-8 border-[#F97201] leading-relaxed'>
                                <span className='font-extrabold text-[#F97201]'>IW เชื่อมองค์กรนายจ้างกับคนพิการ</span>
                                &nbsp;ให้นายจ้างเข้าถึงแหล่งคนพิการที่พร้อมทำงาน มั่นใจในการจ้าง เห็นความสามารถเชิงประจักษ์
                                ได้รับความรู้และประสบการณ์แนวทางความสำเร็จจากบริษัทต้นแบบ
                            </div>
                            <div className='px-5 py-3 border-l-8 border-[#F97201] leading-relaxed'>
                                <p>
                                    <span className='font-extrabold text-[#F97201]'>IW พัฒนาคนพิการ</span>
                                    &nbsp;ให้มีความสามารถ มีทักษะและศักยภาพในการทำงานตรงความต้องการขององค์กรนายจ้าง
                                    พร้อมส่งเสริมให้มหาวิทยาลัย / วิทยาลัย / องค์กรคนพิการ
                                    ได้ทำความรู้จักนายจ้างเพื่อเชื่อมประสานทำงานร่วมกัน ผ่านกิจกรรมกลยุทธ์ดังนี้
                                </p>
                            </div>
                        </div>
                        <div className='mt-5 grid grid-cols-1 md:grid-cols-2 '>
                            <div className={` p-3 ${bgColorMain2 === "bg-white" ? "bg-gray-100" : ""} rounded-md col `}>
                                <div className='flex  gap-3 items-center'>
                                    <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>
                                        1
                                    </div>
                                    <p className={` font-bold ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>Inclusion Job Fair</p>
                                </div>
                                <div className='text-sm mt-2'>
                                    <p className={`xl:text-lg`}>
                                        มหกรรมการจ้างงานคนพิการ (Inclusion Job Fair - IJF) เพื่อให้องค์กรนายจ้าง และคนพิการได้สัมภาษณ์ เกิดเป็นโอกาสสำคัญในการจ้างงานคนพิการ
                                    </p>
                                </div>
                            </div>
                            <div className={`p-3 rounded-md col `}>
                                <div className='flex gap-3 items-center'>
                                    <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>
                                        2
                                    </div>
                                    <p className={`font-bold ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>Disability Awareness</p>
                                </div>
                                <div className='text-sm mt-2'>
                                    <p className={`xl:text-lg`}>
                                        เสริมสร้างความตระหนักรู้เรื่องคนพิการความพิการ ให้องค์กรนายจ้าง / สถาบันการศึกษา เพื่อรับรู้ถึงความสามารถ/ศักยภาพ ความท้าทาย แนวทางการพัฒนา คนพิการและการอยู่ร่วมกันอย่างทัดเทียมบนความหลากหลาย
                                    </p>
                                </div>
                            </div>
                            <div className={`p-3 rounded-md col `}>
                                <div className='flex gap-3 items-center'>
                                    <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>
                                        3
                                    </div>
                                    <p className={`font-bold ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>Follow Up</p>
                                </div>
                                <div className='text-sm mt-2'>
                                    <p className={`xl:text-lg`}>
                                        สนับสนุนการปรับตัวและความเข้าใจอันดี ในการทำงานของพนักงานพิการ และหัวหน้างานเพื่อให้สามารถทำงานอย่างราบรื่น ครองงานได้ในระยะยาว
                                        ให้องค์กรนายจ้าง / สถาบันการศึกษา เพื่อรับรู้ถึงความสามารถ/ศักยภาพ ความท้าทาย แนวทางการพัฒนา คนพิการและการอยู่ร่วมกันอย่างทัดเทียมบนความหลากหลาย
                                    </p>
                                </div>
                            </div>
                            <div className={`p-3 ${bgColorMain2 === "bg-white" ? "bg-gray-100" : ""} rounded-md col `}>
                                <div className='flex gap-3 items-center'>
                                    <div className={`${bgColorNavbar} ${bgColorWhite} rounded-full h-7 w-7 p-1 text-center flex items-center justify-center`}>
                                        4
                                    </div>
                                    <p className={`font-bold ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>Company Visit & Open House</p>
                                </div>
                                <div className='text-sm mt-2'>
                                    <p className={`xl:text-lg`}>
                                        ประสานให้สถาบันการศึกษา พร้อมด้วยนักศึกษาพิการเข้าดูงานในบริษัทเรียนรู้หน้างานจริง ทำความรู้จักและเข้าใจบริบททางธุรกิจ นำสู่การเปิดให้ บัณฑิตพิการฝึกงาน (Internship) และรับเข้าทำงานร่วมกันในองค์กร
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-5 ${bgColorWhite} ${bgColorNavbar === "bg-[#F97201]" ? "bg-[#ff8d2c]" : ""} p-5 rounded-tl-3xl rounded-tr-3xl grid grid-cols-2`}>
                            <div className='flex flex-col gap-1 px-5'>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiAccountBoxMultiple} size={.8} />
                                    <p>คุณวิภาสิริ บุญชูช่วย (อ้อม)</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiEmail} size={.8} />
                                    <p>Wipasiri@sif.or.th</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiPhone} size={.8} />
                                    <p>เบอร์โทร 086-898-6325</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 px-5'>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiAccountBoxMultiple} size={.8} />
                                    <p>คุณจักรีวรรณ ศุภวุฒิ (ฟาม)</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiEmail} size={.8} />
                                    <p>Jakkreewan@sif.or.th</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Icon path={mdiPhone} size={.8} />
                                    <p>เบอร์โทร 063-727-2476</p>
                                </div>
                            </div>
                        </div>

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

export default MissionPage

