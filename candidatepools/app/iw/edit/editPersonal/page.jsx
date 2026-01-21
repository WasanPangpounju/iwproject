"use client";

import React from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";

//hooks
import { useTheme } from "@/app/ThemeContext";

//components
import PersonalForm from "@/app/components/Form/PersonalForm";

function EditPersonal() {
  const { bgColorMain2 } = useTheme();
  const { dataUser } = useUserStore();

  return (
    <main className="w-full" aria-labelledby="edit-personal-title">
      {/* สำหรับ screen reader (ไม่กระทบดีไซน์) */}
      <h1 id="edit-personal-title" className="sr-only">
        แก้ไขข้อมูลส่วนตัว
      </h1>

      {/* ✅ ใช้ wrapper แนวเดิม: ไม่บังคับ max-width และไม่ใส่ padding ที่ทำให้เพี้ยน */}
      <div className={`${bgColorMain2} py-5 flex justify-center px-5 pb-10`}>
        <div className="w-full">
          <PersonalForm
            dataUser={dataUser}
            // ส่ง flag ไปให้ PersonalForm ทำการ sync เลขบัตรอัตโนมัติ
            autoSyncDisabilityCardFromIdCard
          />
        </div>
      </div>
    </main>
  );
}

export default EditPersonal;
