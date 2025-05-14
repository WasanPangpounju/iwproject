"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";

//components
import ManageStudentForm from "@/app/components/Form/ManageStudentForm/ManageStudentForm";

//hooks
import { useFetchUserDataById } from "@/hooks/useFetchUserDataById";
import { useParams } from "next/navigation";

export default function RootLayout({ children }) {
  const { bgColorMain2, bgColor } = useTheme();
  const { id } = useParams();

  //15/05/68 เปลี่ยนจากเก็บข้อมูลใน context ไปใช้ zustand เก็บแทนแต่ยังไมเคลียร์ data ตอนที่ไม่ได้เข้ามาทำให้เกิดข้อมูลเก่าโชว์แวบนึง
  useFetchUserDataById(id); 

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ManageStudentForm rootPath={"/su/students"}>
        {children}
      </ManageStudentForm>
    </div>
  );
}
