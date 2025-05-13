"use client"

import React from 'react'

//component
import HistoryWorkForm from '@/app/components/Form/HistoryWorkForm';

//context
import { useUserDataById } from '@/contexts/UserDataByIdContext'

function page() {
  const { dataUser, dataHistoryWork } = useUserDataById();
  return (
    <div className="mt-5">
      <HistoryWorkForm dataHistoryWork={dataHistoryWork} id={dataUser?.uuid}/>
    </div>
  )
}

export default page
