"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import { UserDataByIdContext } from "@/contexts/UserDataByIdContext";

//components
import ManageStudentForm from "@/app/components/Form/ManageStudentForm/ManageStudentForm";

//hooks
import { fetchUserDataById } from "@/hooks/useFetchUserDataById";
import { useParams } from "next/navigation";

export default function RootLayout({ children }) {
  const { bgColorMain2, bgColor } = useTheme();
  const [data, setUserData] = useState(null);
  const { id } = useParams();

  //15/05/68 ติดปัญหาเรื่องต้องรีเฟรชข้อมูลถึงอัปเดท
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserDataById(id);
      setUserData(data);
    };

    fetchData();
  }, [id]);

  if (!data) return <div>กำลังโหลด...</div>;

  return (
    <UserDataByIdContext.Provider value={data}>
      <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
        <ManageStudentForm rootPath={"/su/students"}>
          {children}
        </ManageStudentForm>
      </div>
    </UserDataByIdContext.Provider>
  );
}
