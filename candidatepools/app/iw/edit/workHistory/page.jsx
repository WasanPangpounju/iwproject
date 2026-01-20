"use client";

import React from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

//component
import HistoryWorkForm from "@/app/components/Form/HistoryWorkForm";

import { useTheme } from "@/app/ThemeContext";

function Page() {
  const { bgColorMain2 } = useTheme();
  const { dataUser } = useUserStore();
  const { dataHistoryWork } = useHistoryWorkStore();

  return (
    <main className="w-full" aria-labelledby="historywork-page-title">
      {/* ชื่อหน้าให้ screen reader (ไม่เปลี่ยนดีไซน์) */}
      <h1 id="historywork-page-title" className="sr-only">
        แก้ไขประวัติการทำงาน
      </h1>

      {/* คง card เดิม แต่เพิ่ม responsive spacing */}
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <div className={`${bgColorMain2} rounded-lg p-4 sm:p-5`}>
          <HistoryWorkForm id={dataUser?.uuid} dataHistoryWork={dataHistoryWork} />
        </div>
      </div>
    </main>
  );
}

export default Page;
