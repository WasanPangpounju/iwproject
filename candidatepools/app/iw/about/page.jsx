"use client"

import React, { useState, useEffect } from 'react'
import HeaderLogo from '../components/HeaderLogo'
import NavbarMain from '../components/NavbarMain'
import Image from 'next/image'
import Loader from '../components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from "../ThemeContext";


function AboutPage() {
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
            router.replace("/agreement");
        }

        if (session?.user?.role === "admin") {
            router.replace("/admin");
        } else if (session?.user?.role === "supervisor") {
            router.replace("/supervisor");
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
            <HeaderLogo title="เกี่ยวกับเรา" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="about" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        <p>ข้อมูลเกี่ยวกับเรา</p>
                        <div className='mt-5'>
                            -
                        </div>
                        <div className='mt-10 flex'>
                            <video width="640" height="360" controls>
                                <source src="https://firebasestorage.googleapis.com/v0/b/iwproject-3fb0f.appspot.com/o/system%2Fvideo%2FIW%20%E0%B8%A3%E0%B8%A7%E0%B8%A1%205%20%E0%B8%9B%E0%B8%B5-Sub.mp4?alt=media&token=5c7ffc37-df11-4f0a-ab52-369fef95a89f" type="video/mp4" />
                                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                            </video>
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

export default AboutPage
