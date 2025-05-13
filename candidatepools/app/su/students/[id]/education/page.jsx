"use client"

import React from 'react'

//component
import EducationForm from '@/app/components/Form/EducationForm'

//context
import { useUserDataById } from '@/contexts/UserDataByIdContext'
function page() {
  const { dataUser, dataEducation } = useUserDataById();
  return (
    <div className="mt-5">
      <EducationForm dataEducations={dataEducation} dataUser={dataUser}/>
    </div>
  )
}

export default page
