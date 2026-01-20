"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";

//store
import { useSkillStore } from "@/stores/useSkillStore";
import { useUserStore } from "@/stores/useUserStore";

//component
import SkillForm from "@/app/components/Form/SkillForm";

function page() {
  const { dataUser } = useUserStore();
  const { dataSkills } = useSkillStore();

  const { bgColorMain2 } = useTheme();
  return (
    <div className={`${bgColorMain2} rounded-lg p-5`}>
      <SkillForm id={dataUser?.uuid} dataSkills={dataSkills} />
    </div>
  );
}

export default page;
