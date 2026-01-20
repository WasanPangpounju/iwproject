"use client";

import React, { Suspense } from "react";
import { useTheme } from "../ThemeContext";
import { useSession } from "next-auth/react";

// components
import HeaderLogo from "../components/HeaderLogo";
import NavbarMain from "../components/Menu/NavbarMain";

// stores/hooks
import { useUserStore } from "@/stores/useUserStore";
import { useFetchUserData } from "@/hooks/useFetchUserData";

export default function RootLayout({ children }) {
  const { fontSize, bgColor, bgColorMain } = useTheme();
  const { data: session } = useSession();
  const id = session?.user?.id;

  useFetchUserData(id);
  const { dataUser } = useUserStore();

  return (
    <Suspense
      fallback={
        <div role="status" aria-live="polite" className="p-4">
          กำลังโหลด...
        </div>
      }
    >
      <div className={`${bgColorMain} ${bgColor} ${fontSize} min-h-screen`}>
        <header>
          <HeaderLogo dataUser={dataUser} />
        </header>

        <div className="flex flex-col md:flex-row">
          {/* NavbarMain เป็น nav อยู่แล้วในไฟล์ที่แก้ */}
          <NavbarMain status="main" />

          <main
            id="main-content"
            className="w-full px-4 sm:px-6 lg:px-7 py-5 overflow-x-auto"
          >
            {/* เดิมคุณ max-w-[80rem] :contentReference[oaicite:8]{index=8} */}
            <div className="w-full max-w-[80rem] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
