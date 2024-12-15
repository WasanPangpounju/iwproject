"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from "@/app/ThemeContext";
import Icon from '@mdi/react'
import { mdiAttachment, mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js'
import Swal from "sweetalert2";

//firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { storage } from '@/app/firebaseConfig';
import { saveAs } from 'file-saver';


function AddCompany(setAddCompany, dataUse, setLoader) {
    //Theme
    const {
        setFontSize,
        setBgColor,
        setBgColorNavbar,
        setBgColorWhite,
        setBgColorMain,
        setBgColorMain2,
        fontSize,
        bgColorNavbar,
        bgColor,
        bgColorWhite,
        bgColorMain,
        bgColorMain2,
        setLineBlack,
        lineBlack,
        setTextBlue,
        textBlue,
        setRegisterColor,
        registerColor,
        inputEditColor,
        inputGrayColor,
        setInputGrayColor,
        inputTextColor
    } = useTheme();

    const [editMode, setEditMode] = useState(true);

    return (
        <div className='mt-5'>
            <form className={`${bgColorMain2} ${bgColor} rounded-lg flex flex-col gap-7`}>
                <div className='flex gap-10 flex-wrap'>
                    <div className='flex flex-col gap-1'>
                        <label >ชื่อบริษัท <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            type="text"
                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                            readOnly={!editMode}
                            placeholder="รายละเอียดเพิ่มเติม"

                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label >ที่ตั้ง <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            type="text"
                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                            readOnly={!editMode}
                            placeholder={`ตัวอย่าง: " สถานที่ใกล้สถานีรถไฟฟ้า พหลโยธิน 59 "`}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddCompany
