"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";

//components
import ManageStudentForm from "@/app/components/Form/ManageStudentForm/ManageForm";

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
      <ManageForm rootPath={"/su/students"}>
        {children}
      </ManageForm>
    </div>
  );
}
