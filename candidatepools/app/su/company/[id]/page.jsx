"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiCloseCircle, mdiArrowLeftCircle } from "@mdi/js";
import Swal from "sweetalert2";
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import CompanyForm from "@/app/components/Form/CompanyForm";

//store
import { useCompanyStore } from "@/stores/useCompanyStore";

function EditCompany() {
  //Theme
  const { bgColor, bgColorWhite, bgColorMain2, inputGrayColor } = useTheme();

  const { id } = useParams();
  const router = useRouter();

  //store
  const {
    fetchCompanies,
    deleteCompany,
    fetchCompanyById,
    companyById,
    clearCompanyById,
  } = useCompanyStore();

  //get company data
  const fetchCompanyByIdData = (id) => {
    fetchCompanyById(id);
  };
  useEffect(() => {
    if (id) {
      fetchCompanyByIdData(id);
    }
    return () => {
      clearCompanyById();
    };
  }, [id]);

  //deleted company
  async function deletedUser(id, name) {
    Swal.fire({
      title: `คุณต้องการลบ \n"${name}" ?`,
      text: `ใส่ชื่อของ "${name}" เพื่อยืนยัน`,
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
          if (input !== name) {
            throw new Error("ชื่อบริษัทไม่ถูกต้อง.");
          }
          return { status: "success", message: "ยืนยัน." };
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
          const res = await deleteCompany(id);

          if (!res.ok) {
            throw new Error("Error getting data from API");
          }

          await fetchCompanies();

          toast.success("ลบบริษัทสำเร็จ !");
          router.push("/su/company");
        } catch (err) {
          toast.error("เกิดข้อผิดพลาด, ไม่สามารถลบบัญชีได้ !");
          console.error("Error fetching API", err);
        }
      }
    });
  }

  const [selectNav, setSelectNav] = useState("ข้อมูลบริษัท");
  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <Link
        href={"/su/company"}
        className="cursor-pointer flex gap-2 items-center "
      >
        <Icon className="" path={mdiArrowLeftCircle} size={1} />
        <p>ย้อนกลับ</p>
      </Link>
      <div className="mt-10">
        {companyById ? (
          <div className="flex gap-10 mt-5 relative">
            <div>
              <Image
                priority
                alt="icon"
                className="w-48 h-max-32"
                src={"/image/main/work.jpg"}
                height={1000}
                width={1000}
              />
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <p>ชื่อบริษัท: {companyById?.nameCompany || "ไม่มีข้อมูล"} </p>
              <p>
                เวลาทำงาน: {companyById?.date_start || "-"}-
                {companyById?.date_end || ""} {companyById?.time_start || ""}-
                {companyById?.time_end || "-"} น.
              </p>
              <p>สถานที่: {companyById?.address || "-"} </p>
            </div>
            <div
              className="absolute right-0 top-0 flex gap-1 items-center rounded-xl bg-red-400 py-1 px-2 text-white"
              onClick={() =>
                deletedUser(companyById?._id, companyById?.nameCompany)
              }
            >
              <Icon className={``} path={mdiCloseCircle} size={0.8} />
              <p>ลบ</p>
            </div>
          </div>
        ) : (
          <div>กำลังโหลดข้อมูล...</div>
        )}
        <div>
          <nav className="flex gap-2 mt-5">
            <div
              className={`${
                selectNav === "ข้อมูลบริษัท"
                  ? inputGrayColor === "bg-[#74c7c2]" || ""
                    ? `bg-[#0d96f8] ${bgColorWhite}`
                    : ""
                  : ""
              }  cursor-pointer px-4 py-2 rounded-md`}
              onClick={() => setSelectNav("ข้อมูลบริษัท")}
            >
              ข้อมูลบริษัท
            </div>
          </nav>
        </div>
        <hr className="border-gray-500 mt-1" />
        <div className="mt-5">
          {companyById?.length !== 0 ? (
            <CompanyForm dataCompany={companyById} id={id} isEdit={true} />
          ) : (
            <div>กำลังโหลด...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCompany;
