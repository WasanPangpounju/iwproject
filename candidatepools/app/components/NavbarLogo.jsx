"use client"

import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


function NavbarLogo({title,dataUser,bgColorNavbar}) {

    // const { data: session } = useSession();
    // const [dataUser, setDataUser] = useState(null);

    // async function getUser(email) {
    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${email}`, {
    //             method: "GET",
    //             cache: "no-store"
    //         });

    //         if (!res.ok) {
    //             throw new Error("Error getting data from API");
    //         }

    //         const data = await res.json();
    //         setDataUser(data.user || {});

    //     } catch (err) {
    //         console.error("Error fetching API", err);
    //     }
    // }
    // useEffect(() => {
    //     if (status === 'loading') {
    //         return;
    //     }

    //     if (session?.user) {
    //         getUser(session.user.email);
    //     }
    // }, [session])


    return (
        <div className={`${bgColorNavbar} relative gap-1 flex justify-between border-b-8  border-[#75C7C2] `}>
            {dataUser ? (
                <div className=" flex items-end">
                    {/* <div className='h-full flex items-center bg-[#eeeeee] py-4 px-5 w-60 gap-5'> */}
                    <div className={`h-full flex items-center ${bgColorNavbar} py-4 px-5 w-60 gap-5`}>
                        <Image priority alt="icon" className='w-11 h-11 ' src={dataUser.profile || "/image/main/user.png"} height={1000} width={1000} />
                        <p className=' font-bold'>{dataUser.firstName} {dataUser.lastName}</p>
                    </div>
                    {title && (
                        <div className="mx-7 my-1 text-lg font-bold">
                            <p>{title}</p>
                        </div>
                    )}
                </div>
            ) : null}
            <div>
                
            </div>
            <div className=" flex py-4 px-5">
                <Image priority alt="icon" className='w-auto h-14' src="/image/main/eee.png" height={1000} width={1000} />
                <Image priority alt="icon" className='w-auto h-14' src="/image/main/iw.png" height={1000} width={1000} />
                <Image priority alt="icon" className='w-auto h-14' src="/image/main/sss.png" height={1000} width={1000} />
                <div className="-z-10 bg-orange-200 w-10 h-14 rounded-tl-full absolute bottom-0 right-0"></div>
            </div>
        </div>
    )
}

export default NavbarLogo
