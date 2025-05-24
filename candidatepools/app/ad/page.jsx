"use client";

import React, { useEffect, useState } from "react";

import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";

import Dashboard from "../components/Dashboard/Dashboard";
function page() {
  const { dataStudents, dataUser } = useUserStore();
  const { dataEducationAll } = useEducationStore();

  const [studentByUni, setStudentByUni] = useState();
  const [educationByUni, setEducationByUni] = useState();
  useEffect(() => {
    if (!dataStudents || !dataUser?.university || !dataEducationAll) return;
    const tempStudent = dataStudents.filter((item) =>
      item.university.includes(dataUser.university)
    );
    setStudentByUni(tempStudent);
    setEducationByUni(
      dataEducationAll.filter((item) => tempStudent.find(std => std.uuid === item.uuid))
    );
  }, [dataStudents, dataUser, dataEducationAll]);

  return (
    <Dashboard dataStudents={studentByUni} dataEducationAll={educationByUni} />
  );
}

export default page;
