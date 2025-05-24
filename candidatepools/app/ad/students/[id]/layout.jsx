"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";

//hooks
import { useFetchUserDataById } from "@/hooks/useFetchUserDataById";
import { useParams } from "next/navigation";
import ManageForm from "@/app/components/Form/ManageStudentForm/ManageForm";

export default function RootLayout({ children }) {
  const { bgColorMain2, bgColor } = useTheme();
  const { id } = useParams();

  useFetchUserDataById(id); 

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ManageForm rootPath={"/ad/students"}>
        {children}
      </ManageForm>
    </div>
  );
}
