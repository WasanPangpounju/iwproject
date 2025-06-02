"use client";

import React from "react";
import { useParams } from "next/navigation";

//store
import { useCompanyStore } from "@/stores/useCompanyStore";
import CompanyForm2 from "@/app/components/Form/CompanyForm/CompanyForm2";

function EditCompany() {
  //Theme
  const { id } = useParams();
  //store
  const { companyById } = useCompanyStore();

  return (
    <div>
      <CompanyForm2 dataCompany={companyById} id={id} isEdit={true} />
    </div>
  );
}

export default EditCompany;
