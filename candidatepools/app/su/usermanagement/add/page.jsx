"use client";

import React from "react";
import Link from "next/link";

// component
import PersonalForm from "@/app/components/Form/PersonalForm";

//theme
import { useTheme } from "@/app/ThemeContext";

import BackButton from "@/app/components/Button/BackButton";

function Page() {
  const { bgColorMain2, bgColor } = useTheme();
  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <BackButton path={"/su/usermanagement"} />
      <div className="mt-5">
        <PersonalForm isStudent={false} isCreate={true}/>
      </div>
    </div>
  );
}

export default Page;
