import React from 'react'
import Image from 'next/image'

function Navbar() {
    return (
        <div>
            <div className='bg-orange-500 px-5 py-2 flex items-center '>
                <div className='bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold text-sm'>
                    A
                </div>
                <p className='text-white font-thin text-sm ms-2'>ขนาดตัวอักษร</p>
                <div className='flex gap-2 text-xs ms-4'>
                    <div className='hover:cursor-pointer bg-white py-1 px-3 rounded-lg text h-6 flex justify-center items-center'>
                        เล็ก
                    </div>
                    <div className='hover:cursor-pointer bg-white  px-3 rounded-lg text h-6 text-sm flex justify-center items-center'>
                        ปกติ
                    </div>
                    <div className='hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 text-base flex justify-center items-center'>
                        ใหญ่
                    </div>
                </div>
                <div className='ms-4 bg-white p1 w-6 h-6 rounded-full flex items-center justify-center'>
                    <Image className='w-4 h-4' src="/image/main/monitor.png" height={1000} width={1000} ></Image>
                </div>
                <p className='text-white font-thin text-sm ms-2'>แสดงผล</p>
                <div className='flex gap-2 ms-4'>
                    <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
                        อักษรขาวพื้นดำ
                    </div>
                    <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
                        อักษรขาวพื้นดำ
                    </div>
                    <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-yellow-400 py-1 px-2 text-xs font-thin'>
                        อักษรขาวพื้นดำ
                    </div>
                </div>
            </div>
            <div className='relative gap-2 flex justify-end p-6 border-b-8  border-green-300'>
                <Image className='w-14 h-14' src="/image/main/mainlogo1.png" height={1000} width={1000} ></Image>
                <Image className='w-14 h-14' src="/image/main/iw.png" height={1000} width={1000} ></Image>
                <Image className='w-14 h-14' src="/image/main/sss.png" height={1000} width={1000} ></Image>
                <div className="-z-10 bg-orange-200 w-10 h-14 rounded-tl-full absolute bottom-0 right-0"></div>
            </div>
        </div>
    )
}

export default Navbar
