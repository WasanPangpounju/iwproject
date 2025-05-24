"use client";

import React from "react";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import StudentReportTable from "@/app/components/Report/StudentReportTable/StudentReportTable";

function page() {
  //store
  const { dataStudents } = useUserStore();
  const { dataEducationAll } = useEducationStore();
  const { dataWorkAll } = useInterestedWorkStore();
  const { dataHistoryWorkAll } = useHistoryWorkStore();

  const path = "/su/students";
  return (
    <div>
      <StudentReportTable
        dataStudents={dataStudents}
        dataEducationAll={dataEducationAll}
        dataWorkAll={dataWorkAll}
        dataHistoryWorkAll={dataHistoryWorkAll}
        path={path}
      />
    </div>
  );
}

export default page;
