"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiCloseCircle,
} from "@mdi/js";
import StudentPersonal from "./StudentPersonal";
import StudentEducation from "./StudentEducation";
import StudentHistoryWork from "./StudentHistoryWork";
import StudentSkills from "./StudentSkills";
import Swal from "sweetalert2";
import StudentInterestedWork from "./StudentInterestedWork";
import StudentResume from "./StudentResume";

//stores
import { useUserStore } from "@/stores/useUserStore";

function StudentDetail({ id, setLoader }) {
  const { getUserById } = useUserStore();

  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = await getUserById(id);
      setDataUser(user);
    }
    if (id) {
      fetchData();
    }
  }, [getUserById, id]);

  //Theme
  const {
    bgColorWhite,
    inputGrayColor,
  } = useTheme();

  //set age
  const today = new Date();
  const yearToday = today.getFullYear();

  //set selected navbar
  const [selectNav, setSelectNav] = useState("ข้อมูลส่วนบุลคล");

  //delete account
  async function deletedUser(id, idCard, name) {
    Swal.fire({
      title: `คุณต้องการลบบัญชี \n"${name}" ?`,
      text: `ใส่เลขบัตรประชาชน "${idCard}" ของบัญชีเพื่อยืนยัน`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#f27474",
      showLoaderOnConfirm: true,
      preConfirm: async (input) => {
        try {
          if (input !== idCard) {
            throw new Error("ID Card ไม่ถูกต้อง.");
          }
          return { status: "success", message: "ID Card matches." };
        } catch (error) {
          Swal.showValidationMessage(`
                ${error.message}
              `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
            {
              method: "DELETE",
              cache: "no-store",
            }
          );

          if (!res.ok) {
            throw new Error("Error getting data from API");
          }

          let timerInterval;
          Swal.fire({
            title: "กำลังลบข้อมูลบัญชี",
            html: "<b></b> milliseconds.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
              window.location.reload();
            }
          });
        } catch (err) {
          console.error("Error fetching API", err);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบบัญชีได้",
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <div>
      {dataUser ? (
        <div className="flex gap-10 mt-5 relative">
          <div>
            <Image
              priority
              alt="icon"
              className="w-28 h-28"
              src={dataUser.profile || "/image/main/user.png"}
              height={1000}
              width={1000}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <p>
              {dataUser?.prefix || ""} {dataUser?.firstName}{" "}
              {dataUser?.lastName}{" "}
            </p>
            <p>ชื่อเล่น: {dataUser?.nickname || "ไม่มีข้อมูล"}</p>
            <p>
              อายุ:{" "}
              {dataUser?.yearBirthday
                ? `${yearToday - dataUser?.yearBirthday} ปี`
                : "ไม่มีข้อมูล"}{" "}
            </p>
          </div>
          <div className="absolute right-0 top-0">
            <Icon
              onClick={() =>
                deletedUser(
                  dataUser?._id,
                  dataUser?.idCard,
                  dataUser?.firstName
                )
              }
              className={` cursor-pointer text-red-400 mx-2`}
              path={mdiCloseCircle}
              size={0.8}
            />
          </div>
        </div>
      ) : (
        <div>กำลังโหลดข้อมูล...</div>
      )}
      <div>
        <nav className="flex gap-2 mt-5">
          <div
            className={`${
              selectNav === "ข้อมูลส่วนบุลคล"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            }  cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("ข้อมูลส่วนบุลคล")}
          >
            ข้อมูลส่วนบุลคล
          </div>
          <div
            className={`${
              selectNav === "ประวัติการศึกษา"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            } cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("ประวัติการศึกษา")}
          >
            ประวัติการศึกษา
          </div>
          <div
            className={`${
              selectNav === "ประวัติการฝึกงาน/ทำงาน"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            } cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("ประวัติการฝึกงาน/ทำงาน")}
          >
            ประวัติการฝึกงาน/ทำงาน
          </div>
          <div
            className={`${
              selectNav === "ความสามารถ/การอบรม"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            } cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("ความสามารถ/การอบรม")}
          >
            ความสามารถ/การอบรม
          </div>
          <div
            className={`${
              selectNav === "ลักษณะงานที่สนใจ"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            } cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("ลักษณะงานที่สนใจ")}
          >
            ลักษณะงานที่สนใจ
          </div>
          <div
            className={`${
              selectNav === "เรซูเม่"
                ? inputGrayColor === "bg-[#74c7c2]" || ""
                  ? `bg-[#0d96f8] ${bgColorWhite}`
                  : ""
                : ""
            } cursor-pointer px-4 py-2 rounded-md`}
            onClick={() => setSelectNav("เรซูเม่")}
          >
            เรซูเม่
          </div>
        </nav>
      </div>
      <hr className="border-gray-500 mt-1" />
      {selectNav === "ข้อมูลส่วนบุลคล" ? (
        <StudentPersonal dataUser={dataUser} />
      ) : selectNav === "ประวัติการศึกษา" ? (
        <StudentEducation dataUser={dataUser} id={id} setLoader={setLoader} />
      ) : selectNav === "ประวัติการฝึกงาน/ทำงาน" ? (
        <StudentHistoryWork dataUser={dataUser} id={id} setLoader={setLoader} />
      ) : selectNav === "ความสามารถ/การอบรม" ? (
        <StudentSkills dataUser={dataUser} id={id} setLoader={setLoader} />
      ) : selectNav === "ลักษณะงานที่สนใจ" ? (
        <StudentInterestedWork
          dataUser={dataUser}
          id={id}
          setLoader={setLoader}
        />
      ) : selectNav === "เรซูเม่" ? (
        <StudentResume dataUser={dataUser} id={id} setLoader={setLoader} />
      ) : (
        <div>เกิดข้อผิดพลาด</div>
      )}
    </div>
  );
}

export default StudentDetail;
