"use client"

import React from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

//component
import HistoryWorkForm from "@/app/components/Form/HistoryWorkForm";
function page() {
  const { dataUser } = useUserStore();
  const { dataHistoryWork } = useHistoryWorkStore();
  return (
    <div className="rounded-lg p-5">
      <HistoryWorkForm id={dataUser?.uuid} dataHistoryWork={dataHistoryWork} />
    </div>
  );
}

export default page;
