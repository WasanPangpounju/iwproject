"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiAccountSchool,
  mdiAccountEdit,
  mdiFaceMan,
  mdiFaceWoman,
} from "@mdi/js";
import PieChart from "@/app/components/Chart/ChartDisabled";

import { GENDER, TYPE_PERSON } from "@/const/enum";

function Dashboard({ dataStudents, dataEducationAll }) {
  //Theme
  const { bgColor, bgColorMain2 } = useTheme();

  //catalog_user
  const count_allUser = dataStudents?.length;
  const count_graduation = dataStudents?.filter(
    (user) => user?.typePerson === TYPE_PERSON.GRADUATION
  )?.length;
  const count_students = dataStudents?.filter(
    (user) => user?.typePerson === TYPE_PERSON.STUDENT
  )?.length;
  const count_male = dataStudents?.filter(
    (user) => user?.sex === GENDER.MALE
  )?.length;
  const count_female = dataStudents?.filter(
    (user) => user?.sex === GENDER.FEMALE
  )?.length;

  //count disabled
  const count_d1 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some((disa) => disa === "พิการทางการมองเห็น")
  )?.length;
  const count_d2 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some(
      (disa) => disa === "พิการทางการได้ยินหรือสื่อความหมาย"
    )
  )?.length;
  const count_d3 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some(
      (disa) => disa === "พิการทางการเคลื่อนไหวหรือทางร่างกาย"
    )
  )?.length;
  const count_d4 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some((disa) => disa === "พิการทางจิตใจหรือพฤติกรรม")
  )?.length;
  const count_d5 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some((disa) => disa === "พิการทางสติปัญญา")
  )?.length;
  const count_d6 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some((disa) => disa === "พิการทางการเรียนรู้")
  )?.length;
  const count_d7 = dataStudents?.filter((user) =>
    user?.typeDisabled?.some((disa) => disa === "พิการทางการออทิสติก")
  )?.length;

  //level
  const count_level1 = dataEducationAll?.filter(
    (edu) => edu.level[0] === "1"
  )?.length;
  const count_level2 = dataEducationAll?.filter(
    (edu) => edu.level[0] === "2"
  )?.length;
  const count_level3 = dataEducationAll?.filter(
    (edu) => edu.level[0] === "3"
  )?.length;
  const count_level4 = dataEducationAll?.filter(
    (edu) => edu.level[0] === "4"
  )?.length;

  //student age
  const currentYear = new Date().getFullYear();
  const count_age11_20 = dataStudents?.filter((user) => {
    const birthYear = Number(user?.yearBirthday);
    const age = currentYear - birthYear;
    return age >= 11 && age <= 20;
  })?.length;
  const count_age21_30 = dataStudents?.filter((user) => {
    const birthYear = Number(user?.yearBirthday);
    const age = currentYear - birthYear;
    return age >= 21 && age <= 30;
  })?.length;
  const count_age31_40 = dataStudents?.filter((user) => {
    const birthYear = Number(user?.yearBirthday);
    const age = currentYear - birthYear;
    return age >= 31 && age <= 40;
  })?.length;
  const count_age41_50 = dataStudents?.filter((user) => {
    const birthYear = Number(user?.yearBirthday);
    const age = currentYear - birthYear;
    return age >= 41 && age <= 50;
  })?.length;
  const count_age50 = dataStudents?.filter((user) => {
    const birthYear = Number(user?.yearBirthday);
    const age = currentYear - birthYear;
    return age > 50;
  })?.length;

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      {!dataStudents ? (
        <p>กำลังโหลด...</p>
      ) : (
        <>
          <p className="font-bold">ข้อมูลผู้ใช้งานทั้งหมด</p>
          <div
            className={`mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2`}
          >
            <div className="flex flex-col justify-center gap-3 p-5 bg-gray-200 max-w-96">
              <div className="bg-[#ffa152] rounded-sm py-2  flex flex-col justify-center items-center gap-1">
                <p>ทั้งหมด</p>
                <p className="text-xl">{count_allUser}</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-[#ffa152] py-2 rounded-sm flex flex-col items-center gap-1 w-[50%]">
                  <Icon className="" path={mdiAccountSchool} size={1.2} />
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p>บัณฑิต </p>
                    <p>{count_graduation}</p>
                  </div>
                </div>
                <div className="bg-[#ffa152] py-2 rounded-sm flex flex-col justify-center items-center gap-1 w-[50%]">
                  <Icon className="" path={mdiAccountEdit} size={1.2} />
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p>นักศึกษา </p>
                    <p>{count_students}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-gray-200 gap-3 p-5 max-w-96">
              <div className="bg-[#8aceff]  rounded-sm gap-1 py-2 flex flex-col justify-center items-center">
                <div className="flex items-center gap-2">
                  <Icon className="" path={mdiFaceMan} size={1} />
                  <p>ชาย</p>
                </div>
                <p className="text-xl">{count_male}</p>
              </div>
              <div className="bg-[#ffdddc]  rounded-sm gap-1 py-2 flex flex-col justify-center items-center">
                <div className="flex items-center gap-2">
                  <Icon className="" path={mdiFaceWoman} size={1} />
                  <p>หญิง</p>
                </div>
                <p className="text-xl">{count_female}</p>
              </div>
            </div>
            <div className="flex flex-col bg-gray-200 gap-3 p-5 max-w-96">
              <div className="bg-[#78dfc7]  rounded-sm gap-1 py-2 px-5 flex flex-col justify-center">
                <p>ระดับชั้น</p>
                <div className="flex justify-between">
                  <p>ปี 1</p>
                  <p>{`${count_level1 === 0 ? "-" : `${count_level1} คน`} `}</p>
                </div>
                <div className="flex justify-between">
                  <p>ปี 2</p>
                  <p>{`${count_level2 === 0 ? "-" : `${count_level2} คน`} `}</p>
                </div>
                <div className="flex justify-between">
                  <p>ปี 3</p>
                  <p>{`${count_level3 === 0 ? "-" : `${count_level3} คน`} `}</p>
                </div>
                <div className="flex justify-between">
                  <p>ปี 4</p>
                  <p>{`${count_level4 === 0 ? "-" : `${count_level4} คน`} `}</p>
                </div>
                <div className="flex justify-between">
                  <p>อื่นๆ</p>
                  <p>{`${
                    count_graduation === 0 ? "-" : `${count_graduation} คน`
                  } `}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-gray-200 gap-3 p-5 max-w-96">
              <div className="bg-[#a9eef9]  rounded-sm gap-1 py-2 px-5 flex flex-col justify-center">
                <p>ช่วงอายุ</p>
                <div className="flex justify-between">
                  <p>11-20 ปี</p>
                  <p>{`${
                    count_age11_20 === 0 ? "-" : `${count_age11_20} คน`
                  } `}</p>
                </div>
                <div className="flex justify-between">
                  <p>21-30 ปี</p>
                  <p>{`${
                    count_age21_30 === 0 ? "-" : `${count_age21_30} คน`
                  } `}</p>
                </div>
                <div className="flex justify-between">
                  <p>31-40 ปี</p>
                  <p>{`${
                    count_age31_40 === 0 ? "-" : `${count_age31_40} คน`
                  } `}</p>
                </div>
                <div className="flex justify-between">
                  <p>41-50 ปี</p>
                  <p>{`${
                    count_age41_50 === 0 ? "-" : `${count_age41_50} คน`
                  } `}</p>
                </div>
                <div className="flex justify-between">
                  <p>{`< 50`}</p>
                  <p>{`${count_age50 === 0 ? "-" : `${count_age50} คน`} `}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-5 overflow-scroll">
            <PieChart
              d1={count_d1}
              d2={count_d2}
              d3={count_d3}
              d4={count_d4}
              d5={count_d5}
              d6={count_d6}
              d7={count_d7}
              allStudents={count_graduation + count_students}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
