"use client";

import React from "react";

// component
import PersonalForm from "@/app/components/Form/PersonalForm";

//context
import { useUserDataById } from "@/contexts/UserDataByIdContext";

function Page() {
  const { dataUser } = useUserDataById();

  return (
    <div className="mt-5">
      <PersonalForm dataUser={dataUser} />
    </div>
  );
}

export default Page;
