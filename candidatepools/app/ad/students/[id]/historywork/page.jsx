"use client"

import React from 'react'

//component
import HistoryWorkForm from '@/app/components/Form/HistoryWorkForm';

//stores
import { useHistoryWorkStore } from '@/stores/useHistoryWorkStore';
import { useUserStore } from '@/stores/useUserStore';

function page() {
  const { dataHistoryWorkById } = useHistoryWorkStore();
  const { dataUserById } = useUserStore();
  
  return (
    <div className="mt-5">
      <HistoryWorkForm dataHistoryWork={dataHistoryWorkById} id={dataUserById?.uuid}/>
    </div>
  )
}

export default page
