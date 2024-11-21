"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'
import Image from 'next/image'
import Loader from '../components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from "../ThemeContext";
import Resume from './component/resume'

function ResumePage() {
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
    } = useTheme();

    //open resume check
    const [statusResume, setStatusResume] = useState(0);

    return (
        <div className={`${fontSize} ${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="เรซูเม่" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="resume" />
                <div className="w-10/12 px-7 py-5">
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        {statusResume > 0 ? (
                            <Resume type={statusResume} dataUser={dataUser} id={session?.user?.id}/>
                        ) : (
                            <>
                                <p>สร้างเรซูเม่</p>
                                <div className='mt-5 grid grid-cols-3 gap-5 text-center'>
                                    <button
                                        className={`py-5 rounded-lg max-w-96 ${bgColorNavbar} ${bgColorWhite}`}
                                        onClick={() => setStatusResume(1)}
                                    >
                                        <p>รูปแบบที่ 1</p>
                                    </button>
                                    <button
                                        className={`py-5 rounded-lg max-w-96 ${bgColorNavbar === "bg-[#F97201]" ? "bg-[#f48e07]" : ""} ${bgColorWhite}`}
                                        onClick={() => setStatusResume(2)}
                                    >
                                        <p>รูปแบบที่ 2</p>
                                    </button>
                                    <button
                                        className={`py-5  rounded-lg max-w-96 ${bgColorNavbar === "bg-[#F97201]" ? "bg-[#feb61c]" : ""} ${bgColorWhite}`}
                                        onClick={() => setStatusResume(3)}
                                    >
                                        <p>รูปแบบที่ 3</p>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {
                loader && (
                    <div>
                        <Loader />
                    </div>
                )
            }
        </div >
    )
}

export default ResumePage
