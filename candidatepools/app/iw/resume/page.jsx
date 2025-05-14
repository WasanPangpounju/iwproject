"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";
import ResumeComponent from "@/app/components/Resume/ResumeComponent";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

function ResumePage() {
  //Theme
  const {
    bgColor,
    bgColorMain2,
  } = useTheme();

    const { dataUser } = useUserStore();
    const { dataSkills } = useSkillStore();
    const { dataEducations } = useEducationStore();
    const { dataHistoryWork } = useHistoryWorkStore();

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
    <ResumeComponent dataUser={dataUser} dataSkills={dataSkills} dataEducations={dataEducations} dataHistoryWork={dataHistoryWork}/>
    </div>
  );
}

export default ResumePage;
