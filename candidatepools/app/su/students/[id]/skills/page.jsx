"use client";

import React from "react";

//component
import SkillForm from "@/app/components/Form/SkillForm";

//context
import { useUserDataById } from "@/contexts/UserDataByIdContext";

function page() {
  const { dataUser, dataSkills } = useUserDataById();
  return (
    <div className="mt-5">
      <SkillForm dataSkills={dataSkills} id={dataUser?.uuid} />
    </div>
  );
}

export default page;
