"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";

//store
import { useSkillStore } from "@/stores/useSkillStore";
import { useUserStore } from "@/stores/useUserStore";

//component
import SkillForm from "@/app/components/Form/SkillForm";

function Page() {
  const { dataUser } = useUserStore();
  const { dataSkills } = useSkillStore();

  const { bgColorMain2 } = useTheme();

  return (
    <main className="w-full" aria-labelledby="skill-page-title">
      {/* ชื่อหน้าให้ screen reader (ไม่เปลี่ยนดีไซน์) */}
      <h1 id="skill-page-title" className="sr-only">
        แก้ไขทักษะ
      </h1>

      {/* คง card เดิม แต่ทำให้ responsive มากขึ้น */}
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <div className={`${bgColorMain2} rounded-lg p-4 sm:p-5`}>
          <SkillForm id={dataUser?.uuid} dataSkills={dataSkills} />
        </div>
      </div>
    </main>
  );
}

export default Page;
