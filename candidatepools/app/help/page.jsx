"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'
import Image from 'next/image'
import Loader from '../components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from "../ThemeContext";
import Link from 'next/link'

function HelpPage() {
    const [loader, setLoader] = useState(true)

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
    } = useTheme();

    return (
        <div className={`${fontSize} ${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="ติดต่อเรา" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="help" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        <div className={`flex flex-col gap-5 `}>
                            <div>
                                <p>ที่ทำการ</p>
                                <p>มูลนิธินวัตกรรมทางสังคม เลขที่ 286 อาคารราฟเฟิล คอร์ท ถนนรัชดาภิเษก 20 (ซอยรุ่งเรือง) แขวงสามเสนนอก เขตห้วยขวาง กรุงเทพฯ 10310</p>
                            </div>
                            <div>
                                <p>เบอร์ติดต่อ</p>
                                <p>โทรศัพท์ 02-279-9385</p>
                                <p>โทรสาร 02-279-9345</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>ติดตามเรา</p>
                                <Link
                                    className='underline'
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    href="https://www.facebook.com/konpikanthai/">
                                    คนพิการต้องมีงานทำ
                                </Link>
                                <Link
                                    className='underline'
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    href="https://www.facebook.com/socialinnovationfoundation/">
                                    มูลนิธินวัตกรรมทางสังคม
                                </Link>
                                <Link
                                    className='underline'
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    href="https://www.youtube.com/embed/kndCcFWHy-c?list=PLwffPXXUDsmFZb6R8WFAjFTp0Dvkro4bv">
                                    คนพิการต้องมีงานทำ
                                </Link>
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

export default HelpPage
