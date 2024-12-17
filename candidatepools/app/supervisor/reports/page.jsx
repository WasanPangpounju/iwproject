"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '@/app/components/NavbarLogo'
import NavbarSupervisor from '@/app/supervisor/components/NavbarSupervisor'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react'
import { mdiArrowLeftCircle, mdiAlertCircle, mdiMagnify, mdiArrowDownDropCircle, mdiPlus, mdiContentSave, mdiCloseThick } from '@mdi/js'
import dataWorkType from '@/app/interestedwork/dataWorkType'
import Link from 'next/link'
import EditUser from '@/app/supervisor/usermanagement/components/EditUser'
import AddUser from '@/app/supervisor/usermanagement/components/AddUser'
import ReportAllStudent from './components/ReportAllStudent'

//table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';



function ReportPage() {
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

    //header
    const [header, setHeader] = useState("")
    return (
        <div className={`${fontSize} ${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="รายงาน" dataUser={dataUser} />
            <div className="flex">
                <NavbarSupervisor status="reports" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        <div className={`flex flex-col`}>
                            <label>
                                หัวข้อรายงาน
                            </label>
                            <div className="relative col w-fit mt-1">
                                <select
                                    onChange={(e) => {
                                        setHeader(e.target.value);
                                    }}
                                    className={`cursor-pointer ${bgColorMain} w-64  border border-gray-400 py-1 px-4 rounded-lg`}
                                    placeholder="กรอกชื่อผู้ใช้"
                                    style={{ appearance: "none" }}
                                >
                                    <option value="">เลือกหัวข้อรายงาน</option>
                                    <option value="ตามมหาวิทยาลัย">ตามมหาวิทยาลัย</option>
                                </select>
                                <Icon
                                    className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                                    path={mdiArrowDownDropCircle}
                                    size={0.6}
                                />
                            </div>
                        </div>

                        {header === "" ? (
                            <ReportAllStudent />
                        ):(
                            <>
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

export default ReportPage
