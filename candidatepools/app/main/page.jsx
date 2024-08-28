"use client"

import React from 'react'
import { signOut } from 'next-auth/react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

function MainPage() {
    const router = useRouter()
    const { data: session } = useSession();

    console.log(session);

    useEffect(() => {
        if (!session) {
            router.replace('/')
        };
    }, [session], [router])

    return (
        <div>
            <button className="border p-3 bg-red-400" onClick={() => signOut()}>Signout</button>
            <p>Email: {session?.user?.email}</p>
        </div>
    )
}

export default MainPage
