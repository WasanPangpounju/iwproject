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

  useFetchUserDataById(id); 

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ManageStudentForm rootPath={"/su/students"}>
        {children}
      </ManageStudentForm>
    </div>
  );
}
