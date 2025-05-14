"use client";

import React from "react";

//component
import SkillForm from "@/app/components/Form/SkillForm";

//hooks
import { useUserStore } from "@/stores/useUserStore";
import { useSkillStore } from "@/stores/useSkillStore";

function page() {
  const { dataSkillById } = useSkillStore();
  const { dataUserById } = useUserStore();

  return (
    <div className="mt-5">
      <SkillForm dataSkills={dataSkillById} id={dataUserById?.uuid} />
    </div>
  );
}

export default page;
