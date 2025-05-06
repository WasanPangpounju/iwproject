"use client";

import React, { useState, useEffect } from "react";

import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//components
import HeaderLogo from "../components/HeaderLogo";
import NavbarMain from "../components/Menu/NavbarMain";

export default function RootLayout({ children }) {
  const {
    setFontSize,
    setBgColor,
    setBgColorNavbar,
    setBgColorWhite,
    setBgColorMain,
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    bgColorMain2,
    lineBlack,
    textBlue,
    registerColor,
  } = useTheme();

  const router = useRouter();
  const { status, data: session } = useSession();
  const [dataUser, setDataUser] = useState(null);
  const [loader, setLoader] = useState(false);

  // Validate session and fetch user data
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.replace("/");
      return;
    }

    if (session?.user?.id) {
      getUser(session.user.id);
    } else {
      router.replace("/agreement");
    }

    if (session?.user?.role === "admin") {
      router.replace("/admin");
    } else if (session?.user?.role === "supervisor") {
      router.replace("/supervisor");
    }
  }, [status, session, router]);
  // Redirect to register if dataUser is empty or null
  useEffect(() => {
    if (dataUser === null) {
      return;
    }

    if (!dataUser || Object.keys(dataUser).length === 0) {
      router.replace("/agreement");
    }
  }, [dataUser, router, session]);

  // Fetch user data from API
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

  return (
    <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
      <HeaderLogo dataUser={dataUser} />
      <div className="flex">
        <NavbarMain status="main" />
        <div className="w-10/12 px-7 py-5">{children}</div>
      </div>
    </div>
  );
}
