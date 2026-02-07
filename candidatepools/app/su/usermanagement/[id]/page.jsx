"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";

import { useTheme } from "@/app/ThemeContext";

// stores
import { useUserStore } from "@/stores/useUserStore";

// components
import PersonalForm from "@/app/components/Form/PersonalForm";
import ManageForm from "@/app/components/Form/ManageStudentForm/ManageForm";

function Page() {
  const { bgColorMain2, bgColor } = useTheme();
  const { getUserById, dataUserById, clearUserById } = useUserStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getUserById(id);
    }

    return () => {
      clearUserById(); // clear ข้อมูลเมื่อออกจากหน้า
    };
  }, [id, getUserById, clearUserById]);

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <ManageForm rootPath={"/su/usermanagement"} isUser={true}>
        <div className="mt-5">
          <PersonalForm dataUser={dataUserById} isStudent={false} />
        </div>
      </ManageForm>
    </div>
  );
}

export default Page;
