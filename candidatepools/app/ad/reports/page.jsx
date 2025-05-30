"use client";

import React, { useEffect, useState } from "react";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";

import ReportTablePage from "@/app/components/Report/ReportTablePage/ReportTablePage";
function page() {
  //store
  const { dataStudents, dataUser } = useUserStore();
  const { dataEducationAll } = useEducationStore();
  const { dataWorkAll } = useInterestedWorkStore();
  const { dataHistoryWorkAll } = useHistoryWorkStore();
  const { dataSkillAll } = useSkillStore();

  const [studentByUni, setStudentByUni] = useState();
  const [educationByUni, setEducationByUni] = useState();
  const [workByUniUni, setWorkByUni] = useState();
  const [historyWorkByUni, setHistoryWorkByUni] = useState();
  const [skillByUni, setSkillByUni] = useState();

  useEffect(() => {
    if (!dataStudents || !dataUser?.university || !dataEducationAll) return;
    const tempStudent = dataStudents.filter((item) =>
      item.university.includes(dataUser.university)
    );
    setStudentByUni(tempStudent);
    setEducationByUni(
      dataEducationAll.filter((item) =>
        tempStudent.find((std) => std.uuid === item.uuid)
      )
    );
    setWorkByUni(
      dataWorkAll.filter((item) =>
        tempStudent.find((std) => std.uuid === item.uuid)
      )
    );
    setHistoryWorkByUni(
      dataHistoryWorkAll.filter((item) =>
        tempStudent.find((std) => std.uuid === item.uuid)
      )
    );

    setSkillByUni(
      dataSkillAll.filter((item) =>
        tempStudent.find((std) => std.uuid === item.uuid)
      )
    );
  }, [
    dataStudents,
    dataUser,
    dataEducationAll,
    dataHistoryWorkAll,
    dataWorkAll,
    dataSkillAll
  ]);
  return (
    <div>
      <ReportTablePage
        dataStudents={studentByUni}
        dataEducationAll={educationByUni}
        dataWorkAll={workByUniUni}
        dataHistoryWorkAll={historyWorkByUni}
        dataSkillAll={skillByUni}
      />
    </div>
  );
}

export default page;
