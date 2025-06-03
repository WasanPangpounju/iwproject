"use client";

import React from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiArrowLeftCircle,
} from "@mdi/js";

import Link from "next/link";

import CompanyForm from "@/app/components/Form/CompanyForm/CompanyForm";
function AddCompany() {
  //Theme
  const {
    bgColor,
    bgColorMain2,
  } = useTheme();


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
       <CompanyForm path={"/su/company"}/>
      </div>
    </div>
  );
}

export default AddCompany;
