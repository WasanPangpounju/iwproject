"use client";

import React from "react";

//component
import InterestedWorkForm from "@/app/components/Form/InterestedWorkForm";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

import { useTheme } from "@/app/ThemeContext";
function editEducation() {
  //stores
  const { dataUser } = useUserStore();
  const { dataWorks } = useInterestedWorkStore();

  const { bgColorMain2, bgColor } = useTheme();

  return (
    <div className={`mt-5 ${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <InterestedWorkForm dataUser={dataUser} dataWorks={dataWorks} />
    </div>
  );
}

export default editEducation;
