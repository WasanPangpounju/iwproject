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
    <main aria-label="แก้ไขข้อมูลส่วนตัว" className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto w-full max-w-4xl">
        <section className={`${bgColorMain2} rounded-lg p-4 sm:p-5 lg:p-6 pb-8`}>
          <PersonalForm
            dataUser={dataUser}
            // ส่ง flag ไปให้ PersonalForm ทำการ sync เลขบัตรอัตโนมัติ
            autoSyncDisabilityCardFromIdCard
          />
        </section>
      </div>
    </main>
  );
}

export default EditPersonal;
