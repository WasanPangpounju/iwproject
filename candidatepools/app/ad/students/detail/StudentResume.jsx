"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Resume from '@/app/components/Resume/resume'

function StudentResume({ dataUser, id, setLoader }) {

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
        <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
            {statusResume > 0 ? (
                <Resume type={statusResume} dataUser={dataUser} id={id} setLoader={setLoader} setStatusResume={setStatusResume} />
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
    )
}

export default StudentResume
