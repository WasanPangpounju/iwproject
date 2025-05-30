"use client"

import React from "react";

import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";

import Dashboard from "../components/Dashboard/Dashboard";
function page() {
  const { dataStudents, dataUserAll } = useUserStore();
  const { dataEducationAll } = useEducationStore();
  return (
    <Dashboard
      dataStudents={dataUserAll}
      dataEducationAll={dataEducationAll}
    />
  );
}

export default page;
