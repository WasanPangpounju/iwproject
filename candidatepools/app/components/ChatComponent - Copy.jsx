"use client"

import React from 'react'
import Icon from "@mdi/react";
import { mdiForum, mdiSend, mdiClose, mdiCheck, mdiShieldAccount } from "@mdi/js";
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';

function ChatComponent({ id, dataUser }) {

    useEffect(() => {
        getMessage();
    }, [id])

    //Theme
    const {
        bgColorNavbar,
        bgColor,
        bgColorWhite,
        bgColorMain2,
    } = useTheme();

    const [openChat, setOpenChat] = useState(false);

    //latest chat
    const chatEndRef = useRef(null);

    useEffect(() => {
        // เลื่อนลงไปที่ข้อความล่าสุดทันทีเมื่อเปิด
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [openChat]); // ใช้ dependency array เป็น [] เพื่อให้ทำงานเฉพาะครั้งแรก

    //sendMessage
    const [input, setInput] = useState("")
    const [message, setMessage] = useState([])
    const [dataMessage, setDataMessage] = useState(null)
    const [loaderMessage, setLoaderMessage] = useState(false)

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) {
            return;
        }
        setLoaderMessage(true);

        // เพิ่มข้อความใหม่ลงใน message ที่มีอยู่แล้ว
        setMessage((prevMessages) => [
            ...(Array.isArray(prevMessages) ? prevMessages : []), // ตรวจสอบ prevMessages ว่าเป็น array หรือไม่
            {
                message: input, // ข้อความที่ผู้ใช้ส่ง
                senderRole: "user", // role ของผู้ส่งข้อความ
            },
        ]);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: id, message: input, senderRole: "user", statusRead: false, statusReadAdmin: true }),
                }
            );

            if (res.ok) {
                const data = await res.json(); // รับข้อมูลที่ได้จาก API

                setLoaderMessage(false);
                // ตรวจสอบว่า prevMessages เป็น array หรือไม่
                setMessage(data.data.roomChat);
                setDataMessage(data.data)
                setInput(''); // เคลียร์ input หลังจากส่ง
            }
        } catch (err) {
            console.error("Error fetching API", err);
            alert("เกิดข้อผิดพลาด")
            window.location.reload();
        }
    }

    async function getMessage() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${id}`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setMessage(data.chats?.roomChat || {});
            setDataMessage(data.chats)

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //show time
    const [showTime, setShowTime] = useState(null)

    function handleShowTime(index) {
        if (showTime === index + 1) {
            setShowTime(null);
            return;
        }
        setShowTime(index + 1)
    }

    async function handleUpdateStatusRead(id) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ statusRead: false }),
                });
            if (res.ok) {
                const data = await res.json(); // รับข้อมูลที่ได้จาก API
                setDataMessage(data?.data)
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='fixed bottom-0 right-0 m-5 lg:m-10 '>
            {openChat ? (
                <form onSubmit={sendMessage} className='border w-80 shadow overflow-hidden'>
                    <div className={`${bgColorWhite} ${bgColorNavbar} flex justify-between py-2 px-4 cursor-pointer shadow-md items-center`}
                        onClick={() => setOpenChat(false)}
                    >
                        <div className='flex gap-2 items-center'>
                            <Icon className={`cursor-pointer`} path={mdiShieldAccount} size={1} />
                            <p>สนทนากับเจ้าหน้าที่</p>
                        </div>
                        <Icon className='' path={mdiClose} size={.8} aria-hidden="true" aria-label="close_chat" />
                    </div>
                    <div className={`${bgColorMain2} h-80 pb-3 px-4 flex flex-col gap-1`}
                        style={{
                            overflowY: "auto",
                            scrollbarWidth: "none", // สำหรับ Firefox
                            msOverflowStyle: "none", // สำหรับ IE
                        }}>
                        {message?.length > 0 && message?.map((chat, index) => {
                            const isDifferentRole = index === 0 || chat.senderRole !== message[index - 1].senderRole;
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
                                <div key={index} className={`${isDifferentRole ? "mt-2" : ""} flex items-end gap-2 ${chat.senderRole === "user" ? "self-end" : `flex-row-reverse self-start`}`}>

                                    <div className='flex flex-col items-end '>
                                        <div className={`${chat.senderRole === "user" ? "":"self-start"} text-[10px]`}>
                                            {formattedDate}, {formattedTime}
                                        </div>
                                        <div className={`${chat.senderRole === "user" ? "":"self-start"}  flex flex-col items-end gap-1`}>

                                            <div
                                                className={`border py-1 px-2 rounded-xl ${bgColor} w-fit ${chat.senderRole === "user" ? "self-end rounded-tr-none" : `rounded-tl-none self-start ${bgColorNavbar} ${bgColorWhite}`}`}
                                            // onClick={() => handleShowTime(index)} // คลิกที่ข้อความเพื่อแสดง/ซ่อนเวลา
                                            >

                                                <p className='max-w-44 break-words'>{chat.message}</p>
                                            </div>
                                            {/* {showTime && showTime === index + 1 && (
                                            <div className='flex gap-2 items-center'>
                                                <p className='text-[9px] '>{formattedTime} {formattedDate}</p>
                                            </div>
                                        )} */}
                                        </div>
                                        {chat.senderRole === "user" && showTime !== message?.length && index === message?.length - 1 && (
                                            <div className='mt-1'>
                                                {loaderMessage ? (
                                                    <ClipLoader color="" size={10} />
                                                ) : dataMessage?.statusReadAdmin ? (
                                                    <div className='flex gap-1 items-center'>
                                                        <p className='text-[10px]'>ส่งแล้ว</p>
                                                    </div>
                                                ) : (
                                                    <div className='flex gap-1 items-center'>
                                                        <p className='text-[10px]'>เห็นแล้ว</p>
                                                    </div>

                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className='self-start '>
                                        {chat?.senderRole === "user" ? (
                                            <Image priority alt="icon" className='w-5 h-5 shadow flex-shrink-0 rounded-full border'
                                                src={dataUser?.profile || "/image/main/user.png"}
                                                height={1000} width={1000}
                                            />
                                        ) : (
                                            <Icon className={`cursor-pointer`} path={mdiShieldAccount} size={.8} />

                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={chatEndRef} />
                    </div>
                    <div className={`py-2 px-4 ${bgColor} flex justify-between items-center gap-2 shadow-lg`}>
                        <textarea
                            type="text"
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}  // อัปเดตค่า input
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className={`${bgColorMain2} w-full py-1 px-4 rounded-xl resize-none border`}
                            placeholder='พิมพ์ข้อความ'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage(e);
                                }
                            }}
                        />
                        <button type='submit'>
                            <Icon className='cursor-pointer' path={mdiSend} size={1} aria-hidden="true" aria-label="close_chat" />
                        </button>
                    </div>
                </form>
            ) : (
                <div
                    onClick={() => {
                        setOpenChat(true)
                        handleUpdateStatusRead(id)
                    }}
                    className='cursor-pointer relative '
                >
                    {dataMessage?.statusRead && (
                        <div className={`${bgColorNavbar === "bg-[#F97201]" ? "bg-red-500" : `${bgColorNavbar}`} w-2 h-2 rounded-full absolute top-0 right-0`}></div>
                    )}
                    <Icon className={`${bgColorNavbar === "bg-[#F97201]" ? "text-[#F97201]" : `${bgColor}`} `} path={mdiForum} size={2} aria-hidden="true" aria-label="open_chat" />
                </div>
            )}

        </div>
    )
}

export default ChatComponent
