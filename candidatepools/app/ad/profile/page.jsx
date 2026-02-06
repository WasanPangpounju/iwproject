"use client";

import React, { useEffect } from "react";

import { useTheme } from "@/app/ThemeContext";

// stores
import { useUserStore } from "@/stores/useUserStore";

// components
import PersonalForm from "@/app/components/Form/PersonalForm";
import { useSession } from "next-auth/react";

function Page() {
  const { bgColorMain2, bgColor } = useTheme();
  const { getUserById, dataUserById, clearUserById } = useUserStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      getUserById(session.user.id);
    }

    return () => {
      clearUserById(); // clear ข้อมูลเมื่อออกจากหน้า
    };
  }, [session?.user?.id, getUserById, clearUserById]);

  // แสดง loading หรือ error ได้ตามต้องการ
  if (!dataUserById) return <div>Loading...</div>;

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p className="mb-5">ตั้งค่าข้อมูลส่วนตัว</p>
      <PersonalForm dataUser={dataUserById} isStudent={false} />
    </div>
  );
}

export default Page;
