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
import { mdiArrowLeftCircle, mdiSend, mdiCheck, mdiShieldAccount, mdiMagnify } from '@mdi/js'
import { ClipLoader } from 'react-spinners';

function ChatPage() {
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
        setLoader(false);
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
    const [statusChat, setStatusChat] = useState('');

    //sendMessage
    const [input, setInput] = useState("")
    const [loaderMessage, setLoaderMessage] = useState(false)

    async function sendMessage(e, id) {
        e.preventDefault();

        setLoaderMessage(true);
        if (!input.trim()) {
            return;
        }

        if (!id) {
            return;
        }

        setShowChat((prevChat) => ({
            ...prevChat,
            uuid: id,
            roomChat: [...(prevChat?.roomChat || []), {
                message: input, // ข้อความใหม่
                senderRole: "admin", // role ของผู้ส่งข้อความ
            }]
        }))

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: id, message: input, senderRole: "admin" }),
                }
            );

            if (res.ok) {
                const data = await res.json(); // รับข้อมูลที่ได้จาก API

                setLoaderMessage(false);
                setShowChat(data?.data)

                setChats((prevMessages) => {
                    if (!Array.isArray(prevMessages)) {
                        return [];
                    }

                    // สร้างอาร์เรย์ใหม่โดยแทนที่ index ที่ระบุด้วย object จาก API
                    return prevMessages.map((message, idx) =>
                        message?.uuid === id ? data.data : message
                    );
                });
                setInput(''); // เคลียร์ input หลังจากส่ง
            }
        } catch (err) {
            console.error("Error fetching API", err);
            alert("เกิดข้อผิดพลาด")
            window.location.reload();
        }
    }

    //latest chat
    const chatEndRef = useRef(null);

    useEffect(() => {
        // เลื่อนลงไปที่ข้อความล่าสุดทันทีเมื่อเปิด
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [showChat]); // ใช้ dependency array เป็น [] เพื่อให้ทำงานเฉพาะครั้งแรก

    console.log("statusChat: ", statusChat)
    // console.log(dataChats)
    console.log(chats)
    console.log(showChat)
    console.log(dataChats)
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
                                        placeholder='ค้นหา'

                                    />
                                    <Icon className={` cursor-pointer`} path={mdiMagnify} size={1} />
                                </div>
                            </div>
                            <hr className='w-full'/>
                          {!dataChats ? (
                            <div className='flex flex-col gap-2 justify-center items-center mt-3 text-xs'>
                                 <ClipLoader color="" size={15} />
                                <p>กำลังโหลด...</p>
                            </div>
                          ):(
                            <div className='flex-grow   overflow-scroll'>
                            
                            {dataChats?.map((user, index) => (
                                <div key={index} className={`${statusChat === user?.uuid ? "bg-gray-200" : ""} transition-colors flex px-5  py-2 border gap-3 items-center cursor-pointer  hover:bg-gray-200`}
                                    onClick={() => {
                                        setShowChat(chats?.find((c) => c.uuid === user?.uuid));
                                        setStatusChat(user?.uuid)
                                        setInput("")
                                    }}
                                >
                                    <Image priority alt="icon" className='w-11 h-11 flex-shrink-0 rounded-full' src={user?.profile || "/image/main/user.png"} height={1000} width={1000} />
                                    <p className={`whitespace-nowrap text-ellipsis overflow-hidden `}>{user?.firstName} {user?.lastName}</p>
                                </div>
                            ))}

                        </div>
                          )}
                        </div>
                        {/* chat */}
                        <form onSubmit={(e) => sendMessage(e, statusChat)} className={`border-l-2 w-full px-10 py-5 flex flex-col `}>
                            {!statusChat ? (
                                <div className=' h-full  flex justify-center items-center text-xs'>
                                    <p>คลิกเลือกผู้ใช้เพื่อเปิดดูข้อความ</p>
                                </div>
                            ) : (
                                <>
                                    <div className=' flex-grow  px-3 py-10  overflow-y-auto no-scrollbar'>
                                        <div className={'flex flex-col gap-1'}>
                                            {showChat && showChat?.roomChat?.map((chat, index) => (
                                                <div key={index} className={`${chat?.senderRole === "user" ? "flex-row-reverse self-start " : `self-end`} flex gap-3 items-start `}>
                                                    {chat?.senderRole === "admin" && index === showChat?.roomChat.length - 1 && (
                                                        <div className='self-end'>
                                                            {loaderMessage ? (
                                                                <ClipLoader color="" size={10} />
                                                            ) : (
                                                                <div className='flex gap-1'>

                                                                    <p className='text-[10px]'>ส่งแล้ว</p>
                                                                    <Icon className='' path={mdiCheck} size={.5} aria-hidden="true" aria-label="close_chat" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className={`${chat?.senderRole === "user" ? `${bgColorNavbar} ${bgColorWhite} rounded-tl-none` : `rounded-tr-none`} border py-1 px-2  rounded-lg ${bgColor} w-fit`}>
                                                        <p className='max-w-96 break-words'>{chat?.message}</p>
                                                    </div>
                                                    {chat?.senderRole === "user" ? (
                                                        <Image priority alt="icon" className='w-5 h-5 shadow flex-shrink-0 rounded-full border'
                                                            src={`${dataChats?.find((d) => d?.uuid === showChat?.uuid)?.profile || "/image/main/user.png"}`}
                                                            height={1000} width={1000}
                                                        />
                                                    ) : (
                                                        <Icon className={`cursor-pointer`} path={mdiShieldAccount} size={1} />

                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className=''>
                                        <div className={`flex items-end rounded-lg ${bgColor}`}>
                                            <textarea
                                                type="text"
                                                rows={3}
                                                value={input}
                                                className={`${bgColor} outline-none w-full py-2 px-4 rounded-xl resize-none`}
                                                placeholder='พิมพ์ข้อความ'
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        sendMessage(e, statusChat);
                                                        setInput("");
                                                    }
                                                }}
                                            />
                                            <button type='submit' className='p-2'>
                                                <Icon className='cursor-pointer self-end' path={mdiSend} size={1.2} aria-hidden="true" aria-label="close_chat" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </form>
                    </div >
                </div >
            </div >
            {loader && (
                <div>
                    <Loader />
                </div>
            )
            }
        </div >
    )
}

export default ChatPage
