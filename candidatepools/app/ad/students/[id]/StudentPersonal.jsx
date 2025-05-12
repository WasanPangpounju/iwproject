"use client"

import React from "react";

//components
import PersonalForm from "@/app/components/Form/PersonalForm";
function StudentPersonal({ dataUser }) {
    
    return (
        <div className="mt-5">
            <PersonalForm dataUser={dataUser}/>
        </div>
    )
}

export default StudentPersonal
