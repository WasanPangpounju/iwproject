"use client";

import React from "react";

// hooks
import { useTheme } from "@/app/ThemeContext";
import EducationForm from "@/app/components/Form/EducationForm";

// stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";

export default function EditEducationPage() {
  const { bgColorMain2 } = useTheme();

  const { dataUser } = useUserStore();
  const { dataEducations } = useEducationStore();

  return (
    <main
      className="w-full"
      aria-labelledby="edit-education-title"
    >
      {/* ชื่อหน้าให้ screen reader (ไม่เปลี่ยนดีไซน์) */}
      <h1 id="edit-education-title" className="sr-only">
        แก้ไขข้อมูลการศึกษา
      </h1>

      {/* คงดีไซน์เดิม: card + rounded + p-5 แต่ทำให้ responsive มากขึ้น */}
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <div className={`${bgColorMain2} rounded-lg p-4 sm:p-5`}>
          <EducationForm dataUser={dataUser} dataEducations={dataEducations} />
        </div>
      </div>
    </main>
  );
}
