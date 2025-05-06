"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProviders, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react'
import { mdiAttachment, mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js'
import dataWorkType from '@/assets/dataWorkType'
import useProvinceData from "@/app/components/province"
import Swal from 'sweetalert2'

function StudentInterestedWork({ dataUser, id, setLoader }) {

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

    useEffect(() => {
        getDataWorks(id);
    }, [])

    //set Mode 
    const [editMode, setEditMode] = useState(false);

    // งานที่สนใจ
    // เพิ่มข้อมูล
    const [workType, setWorkType] = useState([]);
    const [workDetail, setWorkDetail] = useState([]);
    const [workProvince1, setWorkProvince1] = useState([]);
    const [workProvince2, setWorkProvince2] = useState([]);
    const [workProvince3, setWorkProvince3] = useState([]);

    // จัดการการเปลี่ยนแปลงข้อมูลสำหรับประเภทงาน
    const handleWorkType = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWorkType((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
            }

            // อัปเดตค่าในตำแหน่งที่ระบุ
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    // จัดการการเปลี่ยนแปลงข้อมูลสำหรับรายละเอียดงาน
    const handleWorkDetail = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWorkDetail((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
            }

            // อัปเดตค่าในตำแหน่งที่ระบุ
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
    const handleWorkProvince1 = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWorkProvince1((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
            }

            // อัปเดตค่าในตำแหน่งที่ระบุ
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };
    // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
    const handleWorkProvince2 = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWorkProvince2((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
            }

            // อัปเดตค่าในตำแหน่งที่ระบุ
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };
    // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
    const handleWorkProvince3 = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWorkProvince3((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
            }

            // อัปเดตค่าในตำแหน่งที่ระบุ
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    // กำหนดฟิลด์
    const [works, setWorks] = useState([{}]);
    const [error, setError] = useState('');

    const handleAddWork = () => {
        // ตรวจสอบให้แน่ใจว่าทุกฟิลด์ถูกกรอกก่อนที่จะเพิ่มข้อมูลใหม่
        if ((!workType[works.length - 1] || !workDetail[works.length - 1] || !workProvince1[works.length - 1]) &&
            (!getWorkType[works.length - 1] || !getWorkDetail[works.length - 1] || !getWorkProvince1[works.length - 1])) {
            setError("กรุณากรอกข้อมูลให้ครบก่อนเพิ่มข้อมูลใหม่");
            return;
        }

        // จำกัดจำนวนงานไม่ให้เกิน 5 รายการ
        if (works.length >= 3) {
            setError("");
            return;
        }

        setError(""); // ลบข้อผิดพลาดก่อนหน้า
        setWorks([...works, {}]); // เพิ่มออบเจกต์ว่างใน works
    };

    const handleRemoveWork = (index) => {
        Swal.fire({
            title: "ลบข้อมูล",
            text: "คุณต้องการลบข้อมูลนี้?",
            icon: "warning",
            confirmButtonText: "ใช่",
            confirmButtonColor: "#f27474",
            showCancelButton: true,
            cancelButtonText: "ไม่"
        }).then((result) => {
            if (result.isConfirmed) {
                const newWorks = [...works];
                newWorks.splice(index, 1);
                setWorks(newWorks);

                const temp = index;

                // ลบข้อมูลที่เกี่ยวข้องจากอาร์เรย์สถานะ
                setWorkType((prev) => prev.filter((_, i) => i !== temp));
                setWorkDetail((prev) => prev.filter((_, i) => i !== temp));
                setWorkProvince1((prev) => prev.filter((_, i) => i !== temp));
                setWorkProvince2((prev) => prev.filter((_, i) => i !== temp));
                setWorkProvince3((prev) => prev.filter((_, i) => i !== temp));

                // ลบข้อมูลจาก get
                setGetWorkType((prev) => prev.filter((_, i) => i !== temp));
                setGetWorkDetail((prev) => prev.filter((_, i) => i !== temp));
                setGetWorkProvince1((prev) => prev.filter((_, i) => i !== temp));
                setGetWorkProvince2((prev) => prev.filter((_, i) => i !== temp));
                setGetWorkProvince3((prev) => prev.filter((_, i) => i !== temp));
            }
        });
    };

    //handleSubmit
    //hadle array
    function mergeArrayValues(nonGetArray, getArray) {
        // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
        if (nonGetArray.length === 0) {
            return getArray;
        }

        if (nonGetArray.length > getArray.length) {
            return nonGetArray.map((value, index) => {
                return value || getArray[index] || '';
            });
        } else {
            return getArray.map((value, index) => {
                return nonGetArray[index] || value || '';
            });
        }
    }

    //function submit
    async function handleSubmit(e, fieldWorks) {
        e.preventDefault();

        setLoader(true);

        const mergedWorkType = mergeArrayValues(workType, getWorkType);
        const mergedWorkDetail = mergeArrayValues(workDetail, getWorkDetail);
        const mergedWorkProvince1 = mergeArrayValues(workProvince1, getWorkProvince1);
        const mergedWorkProvince2 = mergeArrayValues(workProvince2, getWorkProvince2);
        const mergedWorkProvince3 = mergeArrayValues(workProvince3, getWorkProvince3);

        console.log(mergedWorkProvince1)
        console.log(mergedWorkProvince2)
        console.log(mergedWorkProvince3)
        // ลดค่าตัวนับของแต่ละฟิลด์ลง 1
        fieldWorks -= 1;

        // ตรวจสอบข้อมูลโครงงาน / ผลงาน
        const hasAnyWorkField =
            mergedWorkType[fieldWorks] ||
            mergedWorkDetail[fieldWorks] ||
            mergedWorkProvince1[fieldWorks];

        const isWorkFieldComplete =
            mergedWorkType[fieldWorks] &&
            mergedWorkDetail[fieldWorks] &&
            mergedWorkProvince1[fieldWorks];

        if (hasAnyWorkField && !isWorkFieldComplete) {
            setError("กรุณาระบุข้อมูลให้ครบทุกช่อง");
            setLoader(false);
            return;
        }

        for (let i = 0; i <= mergedWorkProvince1?.length; i++) {
            if (mergedWorkProvince1[i] === "0") {
                setError("กรุณาระบุข้อมูลให้ถูกต้อง");
                setLoader(false);
                return;
            }
            if (mergedWorkProvince3[i] && mergedWorkProvince3[i] !== "0" && (mergedWorkProvince2[i] === "0" || !mergedWorkProvince2[i])) {
                setError("กรุณาระบุข้อมูลให้ถูกต้อง");
                setLoader(false);
                return;
            }
        }

        // หากไม่มีข้อมูลเลยในทุกส่วน
        if (!hasAnyWorkField) {
            setError("ไม่มีข้อมูลที่บันทึก");
            setLoader(false);
            return;
        }

        // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
        setError('');

        // จัดเตรียมข้อมูลที่จะส่งไปยัง API
        const data = {
            uuid: id,
            interestedWork: mergedWorkDetail.map((detail, index) => ({
                type: mergedWorkType[index],
                detail,
                province1: mergedWorkProvince1[index],
                province2: mergedWorkProvince2[index],
                province3: mergedWorkProvince3[index],
            })),
        };

        try {
            // ส่งข้อมูลไปยัง API ด้วย fetch
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "บันทึกข้อมูลสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#0d96f8",
                }).then(() => {
                    getDataWorks(id)
                    setEditMode(false)
                });
            } else {
                console.error("Failed to submit data:", result.message);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                }).then(() => {
                    getDataWorks(id)
                });
                setLoader(false);
                return;
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                icon: "error",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#f27474",
            }).then(() => {
                getDataWorks(id)
            });
            setLoader(false);
        }
    }

    //set default value 
    const [getWorkType, setGetWorkType] = useState([]);
    const [getWorkDetail, setGetWorkDetail] = useState([]);
    const [getWorkProvince1, setGetWorkProvince1] = useState([]);
    const [getWorkProvince2, setGetWorkProvince2] = useState([]);
    const [getWorkProvince3, setGetWorkProvince3] = useState([]);

    //set default value 
    const [dataWorks, setDataWorks] = useState([]);
    useEffect(() => {
        if (!dataWorks) return;

        // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
        setGetWorkType(dataWorks.interestedWork?.map(work => work.type) || []);
        setGetWorkDetail(dataWorks.interestedWork?.map(work => work.detail) || []);
        setGetWorkProvince1(dataWorks.interestedWork?.map(work => work.province1) || []);
        setGetWorkProvince2(dataWorks.interestedWork?.map(work => work.province2) || []);
        setGetWorkProvince3(dataWorks.interestedWork?.map(work => work.province3) || []);

        // set ฟิลด์เริ่มต้น
        if (Array.isArray(dataWorks.interestedWork) && dataWorks.interestedWork.length > 0) {
            setWorks(dataWorks.interestedWork);
        }

    }, [dataWorks]);

    //getData work
    async function getDataWorks(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork/${id}`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataWorks(data.interestedWork || {});

        } catch (err) {
            console.error("Error fetching API", err);
        } finally {
            setLoader(false);
        }
    }

    //set province
    const dataProvince = useProvinceData();
    return (
        <>
            <div className="mt-5">
                <form onSubmit={(e) => handleSubmit(e, works.length)} className={`${bgColorMain2} ${bgColor} rounded-lg `}>
                    <p className='mb-2'>ลักษณะงานที่สนใจ</p>
                    <hr />
                    {works.map((work, index) => (
                        <div key={index}>
                            {index > 0 && editMode && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg w-fit`}
                                        onClick={() => handleRemoveWork(index)}
                                    >
                                        <Icon className={` text-red-500`} path={mdiCloseCircle} size={1} />
                                    </div>
                                </div>
                            )}
                            {index > 0 && !editMode && (
                                <hr className='mt-5' />
                            )}
                            <div className='mt-5 flex gap-5 flex-wrap'>
                                <div className='flex flex-col gap-1'>
                                    <label >ประเภทงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            onChange={(e) => handleWorkType(e.target.value, index)}
                                            value={workType[index] || getWorkType[index] || ""}
                                            disabled={!editMode}
                                        >
                                            <option value="0">-</option>
                                            {dataWorkType.map((work, index) => (
                                                <option key={index} value={work}>{work}</option>
                                            ))}
                                        </select>
                                        <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label >รายละเอียด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                    <input
                                        type="text"
                                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                        readOnly={!editMode}
                                        placeholder="รายละเอียดเพิ่มเติม"
                                        defaultValue={getWorkDetail[index] || ""}
                                        onBlur={(e) => handleWorkDetail(e.target.value, index)}
                                    />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label >จังหวัดที่ 1 <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            onChange={(e) => handleWorkProvince1(e.target.value, index)}
                                            value={workProvince1[index] || getWorkProvince1[index] || ""}
                                            disabled={!editMode}
                                        >
                                            <option value="0">-</option>
                                            {dataProvince.map((province, index) => (
                                                <option key={index} value={province?.name_th}>{province?.name_th}</option>
                                            ))}
                                        </select>
                                        <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label >จังหวัดที่ 2 </label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            onChange={(e) => handleWorkProvince2(e.target.value, index)}
                                            value={workProvince2[index] || getWorkProvince2[index] || ""}
                                            disabled={!editMode}
                                        >
                                            <option value="0">-</option>
                                            {dataProvince.map((province, index) => (
                                                <option key={index} value={province?.name_th}>{province?.name_th}</option>
                                            ))}
                                        </select>
                                        <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label >จังหวัดที่ 3 </label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            onChange={(e) => handleWorkProvince3(e.target.value, index)}
                                            value={workProvince3[index] || getWorkProvince3[index] || ""}
                                            disabled={!editMode}
                                        >
                                            <option value="0">-</option>
                                            {dataProvince.map((province, index) => (
                                                <option key={index} value={province?.name_th}>{province?.name_th}</option>
                                            ))}
                                        </select>
                                        <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>

                            </div>

                        </div>

                    ))}
                    {works.length < 3 && editMode && (
                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                            <div
                                className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                onClick={handleAddWork}
                            >
                                <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                            </div>
                        </div>
                    )}

                    <div>
                        {error && (
                            <div className="w-full text-center mt-5">
                                <p className="text-red-500">* {error}</p>
                            </div>
                        )}
                        {editMode ? (
                            <div className="flex gap-10 w-full justify-center mt-5">
                                <div onClick={() => {
                                    setEditMode(false)
                                }
                                }
                                    // className='hover:cursor-pointer bg-[#F97201] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'
                                    className={`
                                        ${bgColorNavbar} 
                                        ${bgColorWhite} 
                                        hover:cursor-pointer 
                                        bg-[#F97201]  
                                        py-2 px-6 
                                        rounded-2xl 
                                        flex justify-center items-center gap-1 
                                        border border-white
                                      `}
                                >
                                    <Icon path={mdiCloseCircle} size={1} />
                                    <p>ยกเลิก</p>
                                </div>
                                <button type='submit'
                                    // className='hover:cursor-pointer bg-[#75C7C2] text-white py-2 px-6 rounded-2xl flex justify-center items-center gap-1'
                                    className=
                                    {
                                        `${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`
                                    }
                                >
                                    <Icon path={mdiContentSave} size={1} />
                                    <p>บันทึก</p>
                                </button>
                            </div>
                        ) : (
                            <div className=" flex w-full justify-center mt-10">
                                <div onClick={() => setEditMode(true)}
                                    // className='hover:cursor-pointer bg-[#ffb74c] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'
                                    className={` ${bgColorNavbar} ${bgColorWhite}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                                >
                                    <Icon path={mdiPencil} size={.8} />
                                    <p>แก้ไข</p>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default StudentInterestedWork
