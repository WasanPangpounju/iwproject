"use client";

import React from "react";

//component
import InterestedWorkForm from "@/app/components/Form/InterestedWorkForm";

//context
import { useUserDataById } from "@/contexts/UserDataByIdContext";

function page() {
  const { dataUser, dataWorks } = useUserDataById();

  return (
    <div className={`mt-5 `}>
      <InterestedWorkForm dataWorks={dataWorks} id={dataUser?.uuid} />
    </div>
  );
}

export default page;
