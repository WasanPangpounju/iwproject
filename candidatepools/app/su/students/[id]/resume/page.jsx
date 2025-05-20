"use client";

import React from "react";

//component
import ResumeComponent from "@/app/components/Resume/ResumeComponent";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useResumeStore } from "@/stores/useResumeStore";

function page() {

  const { dataUserById } = useUserStore();
  const { dataEducationById } = useEducationStore();
  const { dataHistoryWorkById } = useHistoryWorkStore();
  const { dataSkillById } = useSkillStore();
  const { resumeFiles } = useResumeStore();

  return (
    <div className="mt-5">
      <ResumeComponent
        dataUser={dataUserById}
        dataEducations={dataEducationById}
        dataHistoryWork={dataHistoryWorkById}
        dataSkills={dataSkillById}
        resumeFiles={resumeFiles}
      />
    </div>
  );
}

export default page;
