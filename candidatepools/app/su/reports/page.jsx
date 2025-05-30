"use client"

import React from "react";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";

import ReportTablePage from "@/app/components/Report/ReportTablePage/ReportTablePage";
function page() {
  //store
  const { dataStudents } = useUserStore();
  const { dataEducationAll } = useEducationStore();
  const { dataWorkAll } = useInterestedWorkStore();
  const { dataHistoryWorkAll } = useHistoryWorkStore();
  const { dataSkillAll} = useSkillStore();
  
  return (
    <div>
      <ReportTablePage
        dataStudents={dataStudents}
        dataEducationAll={dataEducationAll}
        dataWorkAll={dataWorkAll}
        dataHistoryWorkAll={dataHistoryWorkAll}
        dataSkillAll={dataSkillAll}
      />
    </div>
  );
}

export default page;
