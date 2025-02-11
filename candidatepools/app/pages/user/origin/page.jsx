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
    mdiBullseyeArrow,
} from '@mdi/js';

function OriginPage() {
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
        <div className={`${bgColorMain} ${bgColor} ${fontSize} xl:text-lg`}>
            <NavbarLogo title="ที่มา" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="about" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorNavbar === "bg-[#F97201]" ? "bg-[#ff8d2c]":""} ${bgColorWhite} rounded-lg `}>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-3 p-5 px-10 '>
                                <p className='text-2xl font-ex'>
                                    มูลนิธินวัตกรรมทางสังคม
                                </p>
                                <p className='w-96'>
                                    มูลนิธิฯ ดำเนินการภายใต้การสนับสนุน
                                    จากสำนักงานกองทุนสนับสนุนการสร้าง
                                    เสริมสุขภาพ (สสส.) ริเริ่มส่งเสริมให้คน
                                    พิการในระดับการศึกษาอาชีวศึกษา
                                    และอุดมศึกษาได้รับการจ้างงานกระแสหลัก
                                    ทำงานตอบภารกิจขององค์กรนายจ้าง
                                </p>
                            </div>
                            <div className={`${bgColorMain2}  w-96 p-2 rounded-bl-3xl flex flex-col justify-center items-center gap-2`}>
                                <Image priority alt="icon" className='w-auto h-20' src="/image/main/iw.png" height={1000} width={1000} />
                                <div className='flex gap-5'>
                                    <Image priority alt="icon" className='w-auto h-20' src="/image/main/eee.png" height={1000} width={1000} />
                                    <Image priority alt="icon" className='w-auto h-20' src="/image/main/sss.png" height={1000} width={1000} />
                                </div>
                            </div>
                        </div>
                        <div className='p-5 pt-5'>
                            <div className={`rounded-lg ${bgColorMain2}  ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}  p-5`}>
                                <p className='text-xl font-bold '>IW การจ้างงานกระแสหลัก</p>
                                <div className='flex'>
                                    <div className='w-[50%]'>
                                        <div className={`bg-[#0c5c9b] py-1 px-2 mt-3 ${bgColorWhite} rounded-lg w-fit`}>
                                            <p>ยกระดับนักศึกษา/บัณฑิตพิการ</p>
                                        </div>
                                        <div className='flex flex-col gap-2 mt-3'>
                                            <div className='flex gap-2 items-end '>
                                                <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
                                                <p>มีทักษะที่ตลาดแรงงานต้องการ</p>
                                            </div>
                                            <div className='flex gap-2 items-end '>
                                                <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
                                                <p>ศักยภาพพร้อมทำงาน</p>
                                            </div>
                                            <div className='flex gap-2 items-end '>
                                                <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
                                                <p>ทำงานได้ ทำงานเป็น ตอบโจทย์</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-[50%]'>
                                        <div className={`bg-[#0c5c9b] py-1 px-2 mt-3 ${bgColorWhite} rounded-lg w-fit`}>
                                            <p>สนับสนุนนายจ้าง</p>
                                        </div>
                                        <div className='flex flex-col gap-2 mt-3'>
                                            <div className='flex gap-2 items-end '>
                                                <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
                                                <p>เข้าถึงคนพิการที่มีคุณภาพ</p>
                                            </div>
                                            <div className='flex gap-2 items-end '>
                                                <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
                                                <p>เข้าใจการทำงานร่วมกันอย่างเกื้อกูล</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-5 pt-0'>
                            <p className='text-xl mx-5'>ผลลัพธ์ของ IW</p>
                            <div className={`${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""} mt-1 flex gap-3`}>
                                <div>
                                    <div className='flex items-center mx-5 '>
                                        <div className={`${bgColorMain2} p-1 w-fit rounded-full`}>
                                            <Icon path={mdiBullseyeArrow} size={1} />
                                        </div>
                                        <hr className={` border-white border-2 w-full`} />
                                    </div>
                                    <div className={`p-5 mt-2 rounded-lg ${bgColorMain2} ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>
                                        <p>
                                            ส่งเสริม<span className='font-bold'>สถาบันการศึกษา</span>อาชีวศึกษาและมหาวิทยาลัย ให้เป็นเจ้าของภารกิจ (Ownership)
                                            และจัดกระบวนการพัฒนาศักยภาพนักศึกษาและบัณฑิตพิการตามแนวคิด
                                            การเปลี่ยนผ่านการศึกษาสู่การมีงานทำ (Transition to Work-TW)
                                            เพื่อตอบโจทย์นายจ้างอย่างยั่งยืน
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex items-center mx-5 '>
                                        <div className={`${bgColorMain2} p-1 w-fit rounded-full`}>
                                            <Icon path={mdiBullseyeArrow} size={1} />
                                        </div>
                                        <hr className={` border-white border-2 w-full`} />
                                    </div>
                                    <div className={`p-5 mt-2 rounded-lg ${bgColorMain2} ${inputTextColor === "text-white" ? "text-[#0c5c9b]" : ""}`}>
                                        <p>
                                            เชื่อมโยงให้เกิดสหภาคีการจ้างงานคนพิการ ระหว่างภาคี สถาบันการศึกษาและภาคีองค์กรนายจ้าง เพื่อ เตรียม
                                            ความพร้อมนักศึกษาและบัณฑิตพิการให้ทำงานตอบโจทย์ตลาดแรงงาน (Active Development Collaboration) ขยายอัตราการจ้างงานเกิดเป็น
                                            นวัตกรรมการจ้างงานกระแสหลัก
                                        </p>
                                    </div>
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

export default OriginPage

