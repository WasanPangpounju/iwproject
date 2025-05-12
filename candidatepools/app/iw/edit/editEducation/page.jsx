"use client";

import React from "react";

//hooks
import { useTheme } from "@/app/ThemeContext";
import EducationForm from "@/app/components/Form/EducationForm";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";

function editEducation() {
  const { bgColorMain2 } = useTheme();

  //stores
  const { dataUser} = useUserStore();
  const { dataEducations } = useEducationStore();

  return (
    <div className={`${bgColorMain2} rounded-lg p-5`}>
      <EducationForm dataUser={dataUser} dataEducations={dataEducations}/>
    </div>
  );
}

export default editEducation;
