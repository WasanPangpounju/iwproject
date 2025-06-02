"use client";

import React from "react";
import { useParams } from "next/navigation";
import CompanyForm from "@/app/components/Form/CompanyForm";

//store
import { useCompanyStore } from "@/stores/useCompanyStore";

function EditCompany() {
  //Theme
  const { id } = useParams();
  //store
  const {
    companyById,
  } = useCompanyStore();

 
  return (
    <div>
      <CompanyForm dataCompany={companyById} id={id} isEdit={true} />
    </div>
  );
}

export default EditCompany;
