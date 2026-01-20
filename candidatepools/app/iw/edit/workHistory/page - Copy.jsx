"use client";

import React from "react";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

//component
import HistoryWorkForm from "@/app/components/Form/HistoryWorkForm";

import { useTheme } from "@/app/ThemeContext";

function page() {
  const { bgColorMain2 } = useTheme();
  const { dataUser } = useUserStore();
  const { dataHistoryWork } = useHistoryWorkStore();
  return (
    <div className={`${bgColorMain2} rounded-lg p-5`}>
      <HistoryWorkForm id={dataUser?.uuid} dataHistoryWork={dataHistoryWork} />
    </div>
  );
}

export default page;
