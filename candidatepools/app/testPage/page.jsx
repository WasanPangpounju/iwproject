"use client"

import React from 'react'
import { signOut } from 'next-auth/react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Loader from '../components/Loader';
import Link from 'next/link'; // Import Link from Next.js

function MainPage() {
    const router = useRouter()
    const { status, data: session } = useSession();

    //validate session
    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/')
        };

        if (session?.user?.email) {
            getUser(session?.user?.email);
        };

    }, [session], [router])

    //get data user
    const [dataUser, setDataUser] = useState([]);

    async function getUser(email) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${email}`, {
                method: "GET",
                cache: "no-store"
            })

            if (!res.ok) {
                throw new Error("Error get data from api")
            }

            const data = await res.json();
            setDataUser(data.user)

        } catch (err) {
            console.log("Error fetch api myfilePage", err);
        }
    }

    //loader
    const [loader, setLoader] = useState(true)
    useEffect(() => {
        setLoader(false);
    }, [])
    useEffect(() => {
        if (loader) {
            document.body.classList.add('no_scroll')
        } else {
            document.body.classList.remove('no_scroll')
        }
    }, [loader])
    console.log(dataUser);

    return (
        <div>
            <button className="border p-3 bg-red-400" onClick={() => signOut()}>Signout</button>
            {/* <Image className="w-10 h-10 rounded-full" src={session?.user?.image ? session?.user?.image:""} height={1000} width={1000} alt="profile" priority></Image> */}
            <p>Username: <span>{dataUser ? dataUser.user : "-"}</span></p>
            <p>Email: {dataUser ? dataUser.email : session?.user?.image ? session?.user?.email : "-"}</p>
            <p>ชื่อ: {dataUser ? dataUser.firstName : "-"} {dataUser ? dataUser.lastName : ""}</p>
            <p>ประเภทความพิการ: {dataUser ? dataUser.typeUser : "-"}</p>
            <p>มหาวิทยาลัย: {dataUser ? dataUser.university : "-"}</p>
            <div className={loader ? "" : "hidden"}>
                <Loader />
            </div>
            {/* Button to navigate to testPage */}
            <Link href="/main">
                <button className="border p-3 bg-blue-400 mt-4">Go to Test Page</button>
            </Link>
        </div>
    )
}

export default MainPage
