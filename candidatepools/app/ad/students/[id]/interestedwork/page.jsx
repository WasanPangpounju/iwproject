"use client";

import React from "react";

//component
import InterestedWorkForm from "@/app/components/Form/InterestedWorkForm";

//stores
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useUserStore } from "@/stores/useUserStore";
function page() {
  const { dataUserById } = useUserStore();
  const { dataWorkById } = useInterestedWorkStore();

  return (
    <div className={`mt-5 `}>
      <InterestedWorkForm dataWorks={dataWorkById} id={dataUserById?.uuid} />
    </div>
  );
}

export default page;
