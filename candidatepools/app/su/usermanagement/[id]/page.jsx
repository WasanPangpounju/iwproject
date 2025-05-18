"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";

import { useTheme } from "@/app/ThemeContext";

// stores
import { useUserStore } from "@/stores/useUserStore";

// components
import PersonalForm from "@/app/components/Form/PersonalForm";
import BackButton from "@/app/components/Button/BackButton";

function Page() {
  const { bgColorMain2, bgColor } = useTheme();
  const { getUserById, dataUserById, clearUserById } = useUserStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getUserById(id);
    }

    return () => {
      clearUserById(); // clear ข้อมูลเมื่อออกจากหน้า
    };
  }, [id, getUserById, clearUserById]);

  // แสดง loading หรือ error ได้ตามต้องการ
  if (!dataUserById) return <div>Loading...</div>;

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <BackButton path={"/su/usermanagement"} />
      <div className="mt-5">
        <PersonalForm dataUser={dataUserById} isStudent={false} />
      </div>
    </div>
  );
}

export default Page;
