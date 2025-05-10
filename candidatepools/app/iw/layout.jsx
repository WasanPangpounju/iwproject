"use client";

import React, { useState, useEffect } from "react";

import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//components
import HeaderLogo from "../components/HeaderLogo";
import NavbarMain from "../components/Menu/NavbarMain";

//api
import { useUserStore } from "@/stores/useUserStore";

export default function RootLayout({ children }) {
  const {
    fontSize,
    bgColor,
    bgColorMain,
  } = useTheme();

  const { data: session } = useSession();
  const { getUser, dataUser } = useUserStore();

  useEffect(() => {
    const id = session?.user?.id
    if (id) {
      getUser(id);
    }
  }, [session]);

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
