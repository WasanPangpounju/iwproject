"use client";

import React from "react";

// component
import PersonalForm from "@/app/components/Form/PersonalForm";

//hooks
import { useUserStore } from "@/stores/useUserStore";


function Page() {
  const { dataUserById } = useUserStore();

  return (
    <div className="mt-5">
      <PersonalForm dataUser={dataUserById} />
    </div>
  );
}

export default Page;
