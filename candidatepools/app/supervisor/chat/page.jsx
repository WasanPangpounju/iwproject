"use client"

import React, { useState, useEffect, useRef } from 'react'
import NavbarLogo from '@/app/components/NavbarLogo'
import NavbarSupervisor from '@/app/supervisor/components/NavbarSupervisor'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react'
import { mdiArrowLeftCircle, mdiSend } from '@mdi/js'

function ChatPage() {
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
            getChats();
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

    const [chats, setChats] = useState([]);
    const [dataChats, setDataChats] = useState([])

    async function getChats() {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setChats(data.chats || {});
        } catch (err) {
            console.log(err)
        }
    }

    //users
    const loadedChatIds = useRef(new Set()); // ใช้ set เพื่อติดตาม uuid ที่โหลดแล้ว

    useEffect(() => {
        if (Array.isArray(chats) && chats.length > 0) {
            chats.forEach(chat => {
                if (chat?.uuid && !loadedChatIds.current.has(chat.uuid)) {
                    // ถ้ายังไม่มีใน loadedChatIds, เพิ่มแล้วเรียก getUserChat
                    loadedChatIds.current.add(chat.uuid);
                    getUserChat(chat.uuid);
                }
            });
        }
    }, [chats]);

    async function getUserChat(id) {
        setLoader(true);
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
            // ตรวจสอบว่า data.user ไม่เป็น null และเป็น object
            if (data?.user && typeof data.user === "object") {
                setDataChats((prev) => [...prev, data.user]); // เพิ่ม object เข้าไปในอาร์เรย์
            } else {
                console.error("Expected 'data.user' to be a valid object but got:", data?.user);
            }
        } catch (err) {
            console.error("Error fetching API", err);
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    //show chat
    const [showChat, setShowChat] = useState([]);
    const [statusChat, setStatusChat] = useState(null);

    console.log(showChat)
    return (
        <div className={`${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="ข้อความ" dataUser={dataUser} />
            <div className="flex">
                <NavbarSupervisor status="chat" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <div className={`${bgColorMain2} ${bgColor} rounded-lg flex h-screen`}>
                        {/* sender */}
                        <div className=' max-w-72 flex flex-col '>
                            <div className='p-5'>
                                <div className={`${bgColor} border w-fit flex rounded-lg items-center gap-2 px-2 py-1`}>
                                    <input type="text" className={`${bgColor} px-2  outline-none `}
                                        placeholder='ค้นหา' />
                                    <Icon className={`text-black cursor-pointer`} path={mdiArrowLeftCircle} size={1} />
                                </div>
                            </div>
                            <div className='flex-grow   overflow-scroll'>
                                {dataChats?.map((user, index) => (
                                    <div key={index} className={`${statusChat === index ? "bg-gray-200":""} transition-colors flex px-5  py-2 border gap-3 items-center cursor-pointer  hover:bg-gray-200`}
                                        onClick={() => {
                                            setShowChat(chats[index]);
                                            setStatusChat(index)
                                        }}
                                    >
                                        <Image priority alt="icon" className='w-11 h-11 flex-shrink-0 rounded-full' src={user?.profile || "/image/main/user.png"} height={1000} width={1000} />
                                        <p className={`whitespace-nowrap text-ellipsis overflow-hidden `}>{user?.firstName} {user?.lastName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* chat */}
                        <form className={`border w-full px-10 py-5 flex flex-col `}>
                            <div className=' flex-grow  px-3 py-10  overflow-y-auto '>
                                <div className='flex flex-col items-end gap-1'>
                 
                                    {showChat && showChat?.roomChat?.map((chat, index) => (
                                        <div key={index} className='flex gap-3 items-center'>
                                            <div className={`border py-1 px-2 rounded-xl ${bgColor} w-fit`}>
                                                <p className='max-w-44 break-words'>{chat?.message}</p>
                                            </div>
                                            <Image priority alt="icon" className='w-5 h-5 shadow flex-shrink-0 rounded-full' src={"/image/main/user.png"} height={1000} width={1000} />
                                        </div>
                                    ))}
                                </div>

                            </div>
                            <div className=''>
                                <div className={`flex items-end rounded-lg ${bgColor}`}>
                                    <textarea
                                        type="text"
                                        rows={3}
                                        className={`${bgColor} outline-none w-full py-2 px-4 rounded-xl resize-none`}
                                        placeholder='พิมพ์ข้อความ'
                                    />
                                    <button type='submit' className='p-2'>
                                        <Icon className='cursor-pointer self-end' path={mdiSend} size={1.2} aria-hidden="true" aria-label="close_chat" />
                                    </button>
                                </div>
                            </div>
                        </form>
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

export default ChatPage
