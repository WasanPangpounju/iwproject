"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";
import PieChart from "@/app/components/Chart/ChartDisabled";

import { GENDER, TYPE_PERSON } from "@/const/enum";
import Image from "next/image";
import comeFormChoice from "@/assets/comeFormChoice";
import { Tooltip } from "@mui/material";

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
    user?.typeDisabled?.some((disa) => disa === "พิการทางออทิสติก")
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
    <div
      className={`${bgColorMain2} ${bgColor} font-bold rounded-lg p-5 max-w-[1400px]`}
    >
      {!dataStudents ? (
        <p>กำลังโหลด...</p>
      ) : (
        <>
          <p className="font-bold">ข้อมูลผู้ใช้งานทั้งหมด</p>
          <div className={`mt-5 flex gap-2 flex-wrap`}>
            <div className="flex flex-col justify-center gap-3 p-5 bg-gray-200 w-[350px]">
              <div className="bg-white border-2 border-[#ffa152] rounded-sm py-2  flex flex-col justify-center items-center gap-1">
                <p className="text-xl ">ทั้งหมด</p>
                <p className="text-2xl">{count_allUser}</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white border-2 border-[#ffa152] py-2 rounded-sm flex flex-col items-center gap-1 w-[50%]">
                  <Image
                    src="/image/graduate-hat.png"
                    width={1000}
                    height={1000}
                    priority
                    alt="icon"
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p>บัณฑิต </p>
                    <p>{count_graduation}</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-[#ffa152] py-2 rounded-sm flex flex-col justify-center items-center gap-1 w-[50%]">
                  <Image
                    src="/image/reading-book.png"
                    width={1000}
                    height={1000}
                    priority
                    alt="icon"
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p>นักศึกษา </p>
                    <p>{count_students}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center bg-gray-200 gap-3 p-5 w-[200px]">
              <div className="bg-[#cbe9ff] text-xl  rounded-sm gap-1 py-2 flex flex-col justify-center items-center h-full relative">
                <p>ชาย</p>
                <p className="">{count_male}</p>
                <Image
                  src="/image/teacher.png"
                  width={1000}
                  height={1000}
                  priority
                  alt="icon"
                  className="w-14 h-14 absolute left-0 bottom-0"
                />
              </div>
              <div className="bg-[#ffdcdc] text-xl  rounded-sm gap-1 py-2 flex flex-col justify-center items-center h-full relative">
                <p>หญิง</p>
                <p className="">{count_female}</p>
                <Image
                  src="/image/woman.png"
                  width={1000}
                  height={1000}
                  priority
                  alt="icon"
                  className="w-14 h-14 absolute right-0 bottom-0"
                />
              </div>
            </div>
            <div className="flex flex-col bg-gray-200 gap-3 p-5 w-[250px]">
              <div className="border-2 bg-white border-[#78dfc7]  rounded-sm gap-2 py-2 px-5 flex flex-col justify-center h-full">
                <p className="mb-1">ระดับชั้น</p>
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
            <div className="flex flex-col bg-gray-200 gap-3 p-5 w-[250px]">
              <div className=" bg-white border-2 border-[#ffa152] rounded-sm gap-2 py-2 px-5 flex flex-col justify-center h-full">
                <p className="mb-1 ">ช่วงอายุ</p>
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
            <div className="flex flex-col bg-gray-200 gap-3 p-5 w-[250px]">
              <div className=" bg-white border-2 border-[#caaa37] rounded-sm gap-2 py-2 px-5 flex flex-col justify-center h-full">
                <p className="mb-1 ">รู้จักจากช่องทาง</p>

                {[...comeFormChoice, "อื่นๆ"].map((item, index) => {
                  const count = dataStudents.filter((student) => {
                    if (item === "อื่นๆ") {
                      return !comeFormChoice.includes(student.comeForm);
                    }
                    return student.comeForm === item;
                  }).length;

                  return (
                    <Tooltip key={index} title={`${item}: ${count} คน`}>
                      <div className="flex justify-between">
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap w-28">
                          {item}
                        </p>
                        <p>{count} คน</p>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 ">
            <p className="font-bold">{`จำนวนนักศึกษาพิการ (แยกตามประเภท)`}</p>
            <div className="flex overflow-scroll mt-5 ">
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
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
