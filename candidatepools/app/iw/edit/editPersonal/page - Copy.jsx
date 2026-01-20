"use client";

import React from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";

//hooks
import { useTheme } from "@/app/ThemeContext";

//components
import PersonalForm from "@/app/components/Form/PersonalForm";

function EditPersonal() {
  //hooks
  const { bgColorMain2 } = useTheme();

  //stores
  const { dataUser } = useUserStore();

  return (
    <div className={`${bgColorMain2} rounded-lg p-5 pb-10`}>
      <PersonalForm dataUser={dataUser} />
    </div>
  );
}

export default EditPersonal;
