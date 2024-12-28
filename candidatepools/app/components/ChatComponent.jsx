"use client"

import React from 'react'
import Icon from "@mdi/react";
import { mdiForum, mdiSend, mdiClose } from "@mdi/js";
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext'


function ChatComponent() {

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

    const [openChat, setOpenChat] = useState(false);

    const testChat = [
        {
            role: "user",
            message: "ขอความช่วยเหลือครับ"
        },
        {
            role: "admin",
            message: "แจ้งปัญหามาได้เลยครับ"
        },
        {
            role: "admin",
            message: "asdasdasdlajsdlajsdalsjdalskdjalsdjalsdjalsdjalasjkal"
        },
        {
            role: "user",
            message: "asdasdasdlajsdlajsdalsjdalskdjalsdjalsdjalsdjalasjkal"
        },
        {
            role: "admin",
            message: "asdasdasdlajsdlajsdalsjdalskdjalsdjalsdjalsdjalasjkal"
        },
        {
            role: "user",
            message: "asdasdasdlajsdlajsdalsjdalskdjalsdjalsdjalsdjalasjkal"
        },
    ]

    //latest chat
    const chatEndRef = useRef(null);

    useEffect(() => {
        // เลื่อนลงไปที่ข้อความล่าสุดทันทีเมื่อเปิด
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [testChat]); // ใช้ dependency array เป็น [] เพื่อให้ทำงานเฉพาะครั้งแรก


    function sendMessage(e) {
        e.preventDefault();
    }

    return (
        <div className='fixed bottom-0 right-0 m-5 lg:m-10 '>
            {openChat ? (
                <form onSubmit={sendMessage} className='border w-72 shadow overflow-hidden'>
                    <div className={`${bgColorWhite} ${bgColorNavbar} flex justify-between py-2 px-4 cursor-pointer shadow-md`}
                        onClick={() => setOpenChat(false)}
                    >
                        <p>สนทนากับเจ้าหน้าที่</p>
                        <Icon className='' path={mdiClose} size={.8} aria-hidden="true" aria-label="close_chat" />
                    </div>
                    <div className={`${bgColorMain2} h-72 pb-3 px-4 flex flex-col overflow-y-auto`} >
                        {testChat?.map((chat, index) => {
                            const isDifferentRole = index === 0 || chat.role !== testChat[index - 1].role;
                            return (
                                <div key={index}
                                    className={`border py-1 px-2 rounded-xl ${bgColor} w-fit ${chat.role === "user" ? "self-end" : `self-start ${bgColorNavbar} ${bgColorWhite}`}
                                        ${isDifferentRole ? "mt-2" : ""}`}
                                >
                                    <p className='max-w-36 break-words'>{chat.message}</p>
                                </div>
                            )
                        })}
                        <div ref={chatEndRef} />
                    </div>
                    <div className={`py-2 px-4 ${bgColor} flex justify-between items-center gap-2 shadow-lg`}>
                        <textarea
                            type="text"
                            rows={1}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className={`${bgColorMain2} w-full py-1 px-4 rounded-xl resize-none border`}
                            placeholder='พิมพ์ข้อความ'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); 
                      
                                    e.target.value = '';
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
                    onClick={() => setOpenChat(true)}
                    className='cursor-pointer'
                >
                    <Icon className={`${bgColorNavbar === "bg-[#F97201]" ? "text-[#F97201]" : `${bgColor}`} `} path={mdiForum} size={2} aria-hidden="true" aria-label="open_chat" />
                </div>
            )}

        </div>
    )
}

export default ChatComponent
