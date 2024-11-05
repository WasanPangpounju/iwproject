"use client"

import React, { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import Link from 'next/link';
import NavbarLogo from '../components/NavbarLogo';
import NavbarMain from '../components/NavbarMain';
import Image from 'next/image';
import { useTheme } from '../ThemeContext';

function MainPage() {

    const {
        setFontSize,
        fontHeadSize,
    setFontHeadSize,
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
      } = useTheme();

    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState(null);
    const [loader, setLoader] = useState(false);

    // Validate session and fetch user data
    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/');
            return;
        }

        if (session?.user?.id) {
            getUser(session.user.id);
        } else {
            router.replace('/agreement');
        }

    }, [status, session, router]);
    // Redirect to register if dataUser is empty or null
    useEffect(() => {
        if (dataUser === null) {
            return;
        }

        if (!dataUser || Object.keys(dataUser).length === 0) {
            router.replace('/agreement');
        }


    }, [dataUser, router, session]);

    // Fetch user data from API
    async function getUser(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`, {
                method: "GET",
                cache: "no-store"
            });

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

    // Manage loader state
    useEffect(() => {
        document.body.classList.toggle('no_scroll', loader);
    }, [loader]);

    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
            <NavbarLogo dataUser={dataUser}/>
            <div className="flex">
                <NavbarMain status="main"/>
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        <p className={`${fontHeadSize} font-bold`}>ข่าวประชาสัมพันธ์</p>
                        <div className="mt-5 flex justify-between border flex-wrap">
                            <div >
                                <p className={`font-bold ${fontSize}`}>ยินดีรับสมัครนักศึกษาจบใหม่เข้าร่วมงาน</p>
                                <p className="mt-3">บริษัท ยินดีรับศึกษาจบใหม่เข้าร่วมงาน....................อ่านต่อ</p>
                            </div>
                            <Image className="rounded-lg w-96 h-64 border bg-red-400" src="/image/main/postermain.png" height={1000} width={1000} priority alt="photo-post"></Image>
                        </div>
                        <div className="mt-5 flex justify-between border flex-wrap">
                            <div >
                                <p className={`font-bold ${fontSize}`}>ยินดีรับสมัครนักศึกษาจบใหม่เข้าร่วมงาน</p>
                                <p className="mt-3">บริษัท ยินดีรับศึกษาจบใหม่เข้าร่วมงาน....................อ่านต่อ</p>
                            </div>
                            <Image className="rounded-lg w-96 h-64 border bg-red-400" src="/image/main/postermain.png" height={1000} width={1000} priority alt="photo-post"></Image>
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
    );
}

export default MainPage;
