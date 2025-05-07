"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
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
    //for system search
    const [filteredUsers, setFilteredUsers] = useState([]);

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
                setFilteredUsers((prev) => [...prev, data.user])

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
                    body: JSON.stringify({ userId: id, message: input, senderRole: "admin", statusRead: true, statusReadAdmin: false }),
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

    //serch user
    const [inputSearch, setInputSearch] = useState('');

    useEffect(() => {
        if (inputSearch.trim() === '') {
            setFilteredUsers(dataChats || []); // คืนค่าทั้งหมดถ้าไม่มีคำค้นหา
            return;
        }

        // ค้นหาใน dataChats
        const filtered = dataChats?.filter((user) => {
            const name = `${user?.firstName} ${user?.lastName}`; // รวมชื่อและนามสกุล
            return name.toLowerCase().includes(inputSearch.toLowerCase());
        });

        setFilteredUsers(filtered || []);
    }, [inputSearch])

    async function handleUpdateStatusRead(id) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ statusReadAdmin: false }),
                });
            if (res.ok) {
                const data = await res.json(); // รับข้อมูลที่ได้จาก API
                if (chats?.some((u) => u?.uuid === id)) {
                    setChats((prevUsers) =>
                        prevUsers.map((user) =>
                            user.uuid === id
                                ? { ...user, ...data.data } // อัปเดตข้อมูลที่ตรงกัน
                                : user // คงข้อมูลเดิมถ้าไม่ตรงกัน
                        )
                    );
                }

            }

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className={`${bgColorMain2} ${bgColor} rounded-lg flex h-screen`}>
        {/* sender */}
        <div className=' max-w-72 flex flex-col '>
            <div className='p-5'>
                <div className={`${bgColor} border w-fit flex rounded-lg items-center gap-2 px-2 py-1`}>
                    <input type="text" className={`${bgColor} px-2  outline-none `}
                        placeholder='ค้นหา'
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                    />
                    <Icon className={` cursor-pointer`} path={mdiMagnify} size={1} />
                </div>
            </div>
            <hr className='w-full' />
            {!filteredUsers ? (
                <div className='flex flex-col gap-2 justify-center items-center mt-3 text-xs'>
                    <ClipLoader color="" size={15} />
                    <p>กำลังโหลด...</p>
                </div>
            ) : (
                <div className='flex-grow  ' style={{
                    overflowY: "auto",
                    scrollbarWidth: "none", // สำหรับ Firefox
                    msOverflowStyle: "none", // สำหรับ IE
                }}>

                    {filteredUsers
                        ?.sort((a, b) => {
                            const chatA = chats?.find((c) => c?.uuid === a?.uuid);
                            const chatB = chats?.find((c) => c?.uuid === b?.uuid);

                            const timeA = new Date(chatA?.roomChat[chatA?.roomChat?.length - 1]?.timestamp || 0).getTime();
                            const timeB = new Date(chatB?.roomChat[chatB?.roomChat?.length - 1]?.timestamp || 0).getTime();

                            return timeB - timeA; // จัดเรียงจากเวลาล่าสุดไปยังเก่าสุด
                        })?.map((user, index) => {
                            const chatLatest = chats?.find((c) => c?.uuid === user?.uuid);
                            let sender = false;

                            if (chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]?.senderRole === "admin") {
                                sender = true
                            }
                            const isRead = chatLatest?.statusReadAdmin;

                            const date = new Date(chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]?.timestamp)
                            const formattedDate = date.toLocaleDateString('th-TH', {
                                weekday: 'short', // วันในสัปดาห์ (เช่น "จ.", "อ.", "พ.")
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            });
                            const formattedTime = date.toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                            });

                            return (
                                <div
                                    key={index}
                                    className={` ${statusChat === user?.uuid ? "bg-gray-200" : ""}  transition-colors flex px-5  py-2 border gap-3 items-center cursor-pointer  hover:bg-gray-200 relative`}
                                    onClick={(e) => {
                                        setShowChat(chats?.find((c) => c.uuid === user?.uuid));
                                        setStatusChat(user?.uuid)
                                        setInput("")
                                        handleUpdateStatusRead(user?.uuid)
                                    }}
                                >
                                    <Image priority alt="icon" className='w-11 h-11 flex-shrink-0 rounded-full' src={user?.profile || "/image/main/user.png"} height={1000} width={1000} />
                                    <div className='flex flex-col text-ellipsis overflow-hidden '>
                                        <p className={` text-[10px]`}>{formattedDate} ,{formattedTime}</p>
                                        <p className={` whitespace-nowrap text-ellipsis overflow-hidden `}>{user?.firstName} {user?.lastName}</p>
                                        <p className={`${isRead ? `` : "text-gray-400"} whitespace-nowrap text-ellipsis overflow-hidden `}>{sender ? "คุณ: " : ""} {chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]?.message}</p>
                                    </div>
                                    <div className={`${isRead ? `bg-red-500` : `bg-gray-400`} m-2  rounded-full w-3 h-3 absolute top-0 right-0`}></div>
                                </div>
                            )
                        })}

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
                    <div className=' flex-grow  px-3 py-10  ' style={{
                        overflowY: "auto",
                        scrollbarWidth: "none", // สำหรับ Firefox
                        msOverflowStyle: "none", // สำหรับ IE
                    }}>
                        <div className={'flex flex-col gap-1'}>
                            {showChat && showChat?.roomChat?.map((chat, index) => {
                                const date = new Date(chat?.timestamp)
                                const formattedDate = date.toLocaleDateString('th-TH', {
                                    weekday: 'short', // วันในสัปดาห์ (เช่น "จ.", "อ.", "พ.")
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                });
                                const formattedTime = date.toLocaleTimeString('th-TH', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                                return (
                                    <div key={index} className={`${chat?.senderRole === "user" ? "flex-row-reverse self-start " : `self-end`} flex gap-3 items-start mt-1`}>
                                        <div className='flex flex-col '>
                                            <div className='flex flex-col'>
                                                <div className={`${chat?.senderRole === "user" ? "self-start" : "self-end"} `}>
                                                    <p className={` text-[10px]`}>{formattedDate}, {formattedTime}</p>
                                                </div>
                                                <div className={`${chat?.senderRole === "user" ? `${bgColorNavbar} ${bgColorWhite} rounded-tl-none self-start` : `self-end rounded-tr-none`} border py-1 px-2  rounded-lg ${bgColor} w-fit`}>
                                                    <p className='max-w-96 break-words'>{chat?.message}</p>

                                                </div>
                                            </div>
                                            {chat?.senderRole === "admin" && index === showChat?.roomChat.length - 1 && (
                                                <div className='self-end mt-1'>
                                                    {loaderMessage ? (
                                                        <ClipLoader color="" size={10} />
                                                    ) : showChat?.statusRead ? (
                                                        <div className='flex gap-1 items-center'>
                                                            <p className='text-[10px]'>ส่งแล้ว</p>
                                                            {/* <Icon className='' path={mdiCheck} size={.5} aria-hidden="true" aria-label="close_chat" /> */}
                                                        </div>
                                                    ) : (
                                                        <div className='flex gap-1 items-center'>
                                                            <p className='text-[10px]'>เห็นแล้ว</p>
                                                            {/* <Icon className='' path={mdiCheck} size={.5} aria-hidden="true" aria-label="close_chat" /> */}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                                )
                            })}
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
    )
}

export default ChatPage
