"use client";

import React, { useEffect } from "react";

import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";

//components
import HeaderLogo from "../components/HeaderLogo";
import NavbarSupervisor from "@/app/components/Menu/NavbarSupervisor";

//stores
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
        <NavbarSupervisor status="su" />
        <div className="w-10/12 px-7 py-5">{children}</div>
      </div>
    </div>
  );
}
