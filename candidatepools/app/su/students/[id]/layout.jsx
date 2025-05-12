"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";

//components
import ManageStudentForm from "@/app/components/Form/ManageStudentForm/ManageStudentForm";

export default function RootLayout({ children }) {
  const { bgColorMain2, bgColor } = useTheme();

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ManageStudentForm rootPath={"/su/students"}>
        {children}
      </ManageStudentForm>
    </div>
  );
}
