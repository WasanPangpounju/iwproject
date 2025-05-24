"use client"

import React from 'react'

//component
import EducationForm from '@/app/components/Form/EducationForm'

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";

function page() {
  const { dataUserById } = useUserStore();
  const { dataEducationById } = useEducationStore();
  
  return (
    <div className="mt-5">
      <EducationForm dataEducations={dataEducationById} dataUser={dataUserById}/>
    </div>
  )
}

export default page
