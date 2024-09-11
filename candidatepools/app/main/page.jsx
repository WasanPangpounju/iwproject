"use client"

import React, { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import Link from 'next/link'; 

function MainPage() {
    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState(null);
    const [loader, setLoader] = useState(true);

    // Validate session and fetch user data
    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/');
            return;
        }

        if (session?.user?.email) {
            getUser(session.user.email);
        }else{
            router.replace('/register');
        }

    }, [status, session, router]);
    // Redirect to register if dataUser is empty or null
    useEffect(() => {
        if (dataUser === null) {
            return; 
        }

        if (!dataUser || Object.keys(dataUser).length === 0) {
            router.replace('/register');
        }


    }, [dataUser, router, session]);

    // Fetch user data from API
    async function getUser(email) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${email}`, {
                method: "GET",
                cache: "no-store"
            });

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

    // Manage loader state
    useEffect(() => {
        document.body.classList.toggle('no_scroll', loader);
    }, [loader]);

    //logout
    function handleLogout() {
        Swal.fire({
            title: "ออกจากระบบสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#0d96f8",
        }).then((result) => {
            if (result.isConfirmed) {
                signOut().then(() => {
                    router.replace("/");
                }).catch((err) => {
                    console.log("Sign out error :", err);
                });
            }
        });
    }

    return (
        <div>
            <button className="border p-3 bg-red-400" onClick={handleLogout}>Signout</button>
            {/* <Image className="w-10 h-10 rounded-full" src={session?.user?.image || ""} height={1000} width={1000} alt="profile" priority /> */}
            {loader ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div>
                    <p>Username: <span>{dataUser?.user || "-"}</span></p>
                    <p>Email: {dataUser?.email || session?.user?.email || "-"}</p>
                    <p>ชื่อ: {dataUser?.firstName || "-"} {dataUser?.lastName || ""}</p>
                    <p>ประเภทความพิการ: {dataUser?.typeUser || "-"}</p>
                    <p>มหาวิทยาลัย: {dataUser?.university || "-"}</p>
                </div>
            )}
        </div>
    );
}

export default MainPage;
