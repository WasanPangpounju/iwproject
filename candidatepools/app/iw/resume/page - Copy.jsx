"use client";

import React, {useEffect} from "react";
import { useTheme } from "@/app/ThemeContext";
import ResumeComponent from "@/app/components/Resume/ResumeComponent";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useResumeStore } from "@/stores/useResumeStore";

function ResumePage() {
  //Theme
  const { bgColor, bgColorMain2 } = useTheme();

  const { dataUser } = useUserStore();
  const { dataSkills } = useSkillStore();
  const { dataEducations } = useEducationStore();
  const { dataHistoryWork } = useHistoryWorkStore();
  const { resumeFiles, fetchResumeFiles, clearResumeFiles } = useResumeStore();

  useEffect(() => {
    fetchResumeFiles(dataUser?.uuid);
    return () => {
      clearResumeFiles();
    };
  }, [dataUser]);

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ResumeComponent
        dataUser={dataUser}
        dataSkills={dataSkills}
        dataEducations={dataEducations}
        dataHistoryWork={dataHistoryWork}
        resumeFiles={resumeFiles}
      />
    </div>
  );
}

export default ResumePage;
