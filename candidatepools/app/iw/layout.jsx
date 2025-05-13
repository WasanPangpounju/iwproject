"use client";

import React, { useState, useEffect } from "react";

import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//components
import HeaderLogo from "../components/HeaderLogo";
import NavbarMain from "../components/Menu/NavbarMain";

//stores
import { useUserStore } from "@/stores/useUserStore";

import { useFetchUserData } from "@/hooks/useFetchUserData";
export default function RootLayout({ children }) {
  const { fontSize, bgColor, bgColorMain } = useTheme();
  const { data: session } = useSession();
  const id = session?.user?.id;

  useFetchUserData(id);
  const { dataUser } = useUserStore();

  return (
    <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
      <HeaderLogo dataUser={dataUser} />
      <div className="flex">
        <NavbarMain status="main" />
        <div className="w-full px-7 py-5 max-w-[100rem]">{children}</div>
      </div>
    </div>
  );
}
