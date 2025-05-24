"use client";

import React, { useEffect } from "react";

import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";

//components
import HeaderLogo from "../components/HeaderLogo";
import NavbarAdmin from "../components/Menu/NavbarAdmin";

//stores
import { useUserStore } from "@/stores/useUserStore";

//hooks
import { useFetchUserData } from "@/hooks/useFetchUserData";

//utils
import { fetchAllUserData, clearAllUserData } from "@/utils/fetchUsersByRole";

export default function RootLayout({ children }) {
  const { fontSize, bgColor, bgColorMain } = useTheme();
  const { data: session } = useSession();
  const id = session?.user?.id;

  useEffect(() => {
    fetchAllUserData();

    return () => {
      clearAllUserData();
    };
  }, []);

  useFetchUserData(id);
  const { dataUser } = useUserStore();

  return (
    <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
      <HeaderLogo dataUser={dataUser} />
      <div className="flex">
        <NavbarAdmin status="ad" />
        <div className="overflow-x-auto w-10/12 px-7 py-5">{children}</div>
      </div>
    </div>
  );
}
