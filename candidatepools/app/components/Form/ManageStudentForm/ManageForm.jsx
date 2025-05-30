"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiCloseCircle } from "@mdi/js";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";

//stores
import { useUserStore } from "@/stores/useUserStore";

//component
import BackButton from "@/app/components/Button/BackButton";
import { toast } from "react-toastify";
import Profile from "../../Profile/Profile";

function ManageForm({ children, rootPath, isUser = false }) {
  //Theme
  const { bgColorWhite, inputGrayColor } = useTheme();

  //stores
  const { dataUserById, deleteUserById } = useUserStore();

  //params
  const { id } = useParams();

  //set age
  const today = new Date();
  const yearToday = today.getFullYear();

  //set path active
  const router = useRouter();
  const rootPathId = `${rootPath}/${id}`;
  const pathName = usePathname();
  const selectNav = pathName.split(`/${id}/`)[1]?.split("/")[0] ?? "";

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
          const res = await deleteUserById(id);

          if (!res.ok) {
            throw new Error("Error getting data from API");
          }

          // let timerInterval;
          // Swal.fire({
          //   title: "กำลังลบข้อมูลบัญชี",
          //   html: "<b></b> milliseconds.",
          //   timer: 2000,
          //   timerProgressBar: true,
          //   didOpen: () => {
          //     Swal.showLoading();
          //     const timer = Swal.getPopup().querySelector("b");
          //     timerInterval = setInterval(() => {
          //       timer.textContent = `${Swal.getTimerLeft()}`;
          //     }, 100);
          //   },
          //   willClose: () => {
          //     clearInterval(timerInterval);
          //   },
          // }).then((result) => {
          //   if (result.dismiss === Swal.DismissReason.timer) {
          //     console.log("I was closed by the timer");

          //   }
          // });
          toast.success("ลบบัญชีสำเร็จ !");
          router.push(rootPath);
        } catch (err) {
          console.error("Error fetching API", err);

          toast.error("เกิดข้อผิดพลาด, ไม่สามารถลบบัญชีได้");
        }
      }
    });
  }
  return (
    <>
      <BackButton path={rootPath} />
      <div>
        {dataUserById ? (
          <div className="flex gap-10 mt-5 relative">
            <div>
              <Profile imageSrc={dataUserById.profile}/>

            </div>
            <div className="flex flex-col gap-2 justify-center">
              <p>
                {dataUserById?.prefix || ""} {dataUserById?.firstName}{" "}
                {dataUserById?.lastName}{" "}
              </p>
              <p>ชื่อเล่น: {dataUserById?.nickname || "ไม่มีข้อมูล"}</p>
              <p>
                อายุ:{" "}
                {dataUserById?.yearBirthday
                  ? `${yearToday - dataUserById?.yearBirthday} ปี`
                  : "ไม่มีข้อมูล"}{" "}
              </p>
            </div>
            <div
              className="absolute right-0 top-0 flex gap-1 items-center rounded-xl bg-red-400 py-1 px-2 text-white"
              onClick={() =>
                deletedUser(
                  dataUserById?.uuid,
                  dataUserById?.idCard,
                  dataUserById?.firstName
                )
              }
            >
              <Icon
                className={``}
                path={mdiCloseCircle}
                size={0.8}
              />
              <p>ลบ</p>
            </div>
          </div>
        ) : (
          <div>กำลังโหลดข้อมูล...</div>
        )}
        <div>
          <nav className="flex gap-2 mt-5">
            <Link
              href={`${rootPathId}`}
              className={`${
                selectNav === ""
                  ? inputGrayColor === "bg-[#74c7c2]" || ""
                    ? `bg-[#0d96f8] ${bgColorWhite}`
                    : ""
                  : ""
              }  cursor-pointer px-4 py-2 rounded-md`}
            >
              ข้อมูลส่วนบุลคล
            </Link>
            {!isUser && (
              <>
                <Link
                  href={`${rootPathId}/education`}
                  className={`${
                    selectNav === "education"
                      ? inputGrayColor === "bg-[#74c7c2]" || ""
                        ? `bg-[#0d96f8] ${bgColorWhite}`
                        : ""
                      : ""
                  } cursor-pointer px-4 py-2 rounded-md`}
                >
                  ประวัติการศึกษา
                </Link>
                <Link
                  href={`${rootPathId}/historywork`}
                  className={`${
                    selectNav === "historywork"
                      ? inputGrayColor === "bg-[#74c7c2]" || ""
                        ? `bg-[#0d96f8] ${bgColorWhite}`
                        : ""
                      : ""
                  } cursor-pointer px-4 py-2 rounded-md`}
                >
                  ประวัติการฝึกงาน/ทำงาน
                </Link>
                <Link
                  href={`${rootPathId}/skills`}
                  className={`${
                    selectNav === "skills"
                      ? inputGrayColor === "bg-[#74c7c2]" || ""
                        ? `bg-[#0d96f8] ${bgColorWhite}`
                        : ""
                      : ""
                  } cursor-pointer px-4 py-2 rounded-md`}
                >
                  ความสามารถ/การอบรม
                </Link>
                <Link
                  href={`${rootPathId}/interestedwork`}
                  className={`${
                    selectNav === "interestedwork"
                      ? inputGrayColor === "bg-[#74c7c2]" || ""
                        ? `bg-[#0d96f8] ${bgColorWhite}`
                        : ""
                      : ""
                  } cursor-pointer px-4 py-2 rounded-md`}
                >
                  ลักษณะงานที่สนใจ
                </Link>
                <Link
                  href={`${rootPathId}/resume`}
                  className={`${
                    selectNav === "resume"
                      ? inputGrayColor === "bg-[#74c7c2]" || ""
                        ? `bg-[#0d96f8] ${bgColorWhite}`
                        : ""
                      : ""
                  } cursor-pointer px-4 py-2 rounded-md`}
                >
                  เรซูเม่
                </Link>
              </>
            )}
          </nav>
        </div>
        <hr className="border-gray-500 mt-1" />
        {children}
      </div>
    </>
  );
}

export default ManageForm;
