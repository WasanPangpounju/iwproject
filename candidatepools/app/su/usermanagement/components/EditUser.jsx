"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react';
import { mdiCloseCircle, mdiFilePdfBox, mdiArrowLeftCircle, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js';
import StudentPersonal from '@/app/su/students/detail/StudentPersonal'
import StudentEducation from '@/app/su/students/detail/StudentEducation'
import StudentHistoryWork from '@/app/su/students/detail/StudentHistoryWork'
import StudentSkills from '@/app/su/students/detail/StudentSkills'
import UserPersonal from '@/app/su/usermanagement/components/UserPersonal'
import Swal from 'sweetalert2'

function EditUser({ id, setIdDetail, setLoader, page }) {

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
    const [selectNav, setSelectNav] = useState('ข้อมูลส่วนบุคคล')

    //delete account
    async function deletedUser(id, idCard, name) {
        Swal.fire({
            title: `คุณต้องการลบบัญชี \n"${name}" ?`,
            text: `ใส่เลขบัตรประชาชน "${idCard}" ของบัญชีเพื่อยืนยัน`,
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ยืนยัน",
            confirmButtonColor: "#f27474",
            showLoaderOnConfirm: true,
            preConfirm: async (input) => {
                try {
                    if (input !== idCard) {
                        throw new Error("ID Card ไม่ถูกต้อง.");
                    }
                    return { status: "success", message: "ID Card matches." };
                } catch (error) {
                    Swal.showValidationMessage(`
                ${error.message}
              `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
                        {
                            method: "DELETE",
                            cache: "no-store",
                        }
                    );


                    if (!res.ok) {
                        throw new Error("Error getting data from API");
                    }

                    let timerInterval;
                    Swal.fire({
                        title: "กำลังลบข้อมูลบัญชี",
                        html: "<b></b> milliseconds.",
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                            const timer = Swal.getPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log("I was closed by the timer");
                            window.location.reload();
                        }
                    });

                } catch (err) {
                    console.error("Error fetching API", err);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลบบัญชีได้",
                        icon: "error"
                    });
                }
            }
        });
    }

    return (
        <div>
            {dataUser ? (
                <div className='flex gap-10 mt-5 relative'>
                    <div>
                        <Image priority alt="icon" className='w-28 h-28' src={dataUser.profile || "/image/main/user.png"} height={1000} width={1000} />
                    </div>
                    <div className='flex flex-col gap-2 justify-center'>
                        <p>{dataUser?.prefix || ""} {dataUser?.firstName} {dataUser?.lastName} </p>
                        <p>ชื่อเล่น: {dataUser?.nickname || "ไม่มีข้อมูล"}</p>
                        <p>ตำแหน่ง: {dataUser?.position || "ไม่มีข้อมูล"} </p>
                    </div>
                    <div className='absolute right-0 top-0'>
                        <Icon onClick={() => deletedUser(dataUser?._id, dataUser?.idCard, dataUser?.firstName)} className={` cursor-pointer text-red-400 mx-2`} path={mdiCloseCircle} size={.8} />
                    </div>
                </div>
            ) : (
                <div>
                    กำลังโหลดข้อมูล...
                </div>
            )}
            <div>
                <nav className='flex gap-2 mt-5'>
                    <div
                        className={`${selectNav === "ข้อมูลส่วนบุคคล" ? inputGrayColor === "bg-[#74c7c2]" || "" ? `bg-[#0d96f8] ${bgColorWhite}` : "" : ""}  cursor-pointer px-4 py-2 rounded-md`}
                        onClick={() => setSelectNav('ข้อมูลส่วนบุคคล')}
                    >
                        ข้อมูลส่วนบุคคล
                    </div>
                    {/* {dataUser?.role === "user" && (
                        <>
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
                        </>
                    )} */}
                </nav>
            </div>
            <hr className='border-gray-500 mt-1' />
            {/* {dataUser?.role === "user" ? (
                selectNav === "ข้อมูลส่วนบุคคล" ? (
                    <StudentPersonal dataUser={dataUser} setLoader={setLoader} />
                ) : selectNav === "ประวัติการศึกษา" ? (
                    <StudentEducation dataUser={dataUser} id={id} setLoader={setLoader} />
                ) : selectNav === "ประวัติการฝึกงาน/ทำงาน" ? (
                    <StudentHistoryWork dataUser={dataUser} id={id} setLoader={setLoader} />
                ) : selectNav === "ความสามารถ/การอบรม" ? (
                    <StudentSkills dataUser={dataUser} id={id} setLoader={setLoader} />
                ) : (
                    <div>เกิดข้อผิดพลาด</div>
                )
            ) : (
                selectNav === "ข้อมูลส่วนบุคคล" && (
                    <UserPersonal dataUser={dataUser} setLoader={setLoader} />
                )
            )} */}
            {selectNav === "ข้อมูลส่วนบุคคล" && (
                <UserPersonal dataUser={dataUser} setLoader={setLoader} page={page} />
            )}
        </div>
    )
}

export default EditUser
