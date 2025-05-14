"use client";

import React from "react";

//component
import ResumeComponent from "@/app/components/Resume/ResumeComponent";

//context
import { useUserDataById } from "@/contexts/UserDataByIdContext";

function page() {
  const { dataUser, dataHistoryWork, dataSkills, dataEducation } =
    useUserDataById();

  return (
    <div className="mt-5">
      <ResumeComponent
        dataUser={dataUser}
        dataEducations={dataEducation}
        dataHistoryWork={dataHistoryWork}
        dataSkills={dataSkills}
      />
    </div>
  );
}

export default page;
