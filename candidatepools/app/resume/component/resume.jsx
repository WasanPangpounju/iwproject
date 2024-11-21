"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/ThemeContext';
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js'

function Resume({ type, dataUser, id }) {

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

    // Validate session and fetch user data
    useEffect(() => {

        if (id) {
            getDataSkill(id);
            getEducation(id);
            getHistoryWork(id);
        }
    }, [dataUser]);


    const [editMode, setEditMode] = useState(false);

    //set age
    const today = new Date();
    const yearToday = today.getFullYear();

    //get skill

    const [dataSkills, setDataSkills] = useState([]);
    async function getDataSkill(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill/${id}`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataSkills(data.skills || {});

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //get data Education
    const [dataEducations, setDataEducations] = useState(null)
    async function getEducation(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${id}`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataEducations(data.educations || {});

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //getData work
    const [dataHistoryWork, setDataHistoryWork] = useState([]);
    async function getHistoryWork(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataHistoryWork(data.historyWork || {});

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    console.log(dataHistoryWork)
    return (
        <div>
            <p>รูปแบบที่ {type}</p>
            <div className='flex justify-center'>
                <form>
                    <div className={` mt-10 flex overflow-hidden min-h-[50rem] w-[42rem] border`}>
                        <div className=' text-white '>
                            <div className='bg-[#fea661] p-5 flex justify-center'>
                                <Image priority alt="icon" className='w-32 h-32' src={dataUser.profile || "/image/main/user.png"} height={1000} width={1000} />
                            </div>
                            <div className='bg-[#f48e07] h-full'>
                                <div className='p-5'>
                                    <p className='text-lg font-bold'>เกี่ยวกับฉัน</p>
                                    <div className='flex flex-col mt-2 gap-y-2'>

                                        <p>อายุ: {yearToday - dataUser.yearBirthday || "-"}</p>
                                        <div className='flex flex-wrap gap-1'>
                                            <p>ที่อยู่: </p>
                                            <p>ตำบล{dataUser.addressTambon}</p>
                                            <p>อำเภอ{dataUser.addressAmphor}</p>
                                            <p>จังหวัด{dataUser.addressProvince}</p>
                                            <p>{dataUser.addressZipCode}</p>
                                        </div>
                                        <div className='flex gap-1 whitespace-nowrap '>
                                            <label>เบอร์โทร: </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    className='inputResume'
                                                    defaultValue={dataUser.tel || ""}
                                                />
                                            ) : (
                                                <p>{dataUser.tel || "-"}</p>
                                            )}
                                        </div>
                                        <p className='whitespace-nowrap '>อีเมล์: {dataUser.email || "-"}</p>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className="p-5">
                                        <p className='text-lg font-bold'>ทักษะ</p>
                                        <div className='flex flex-col mt-2 gap-y-2'>
                                            {dataSkills?.skills?.map((skill, index) => (
                                                <div key={index}>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={skill.name || ""}
                                                        />
                                                    ) : (
                                                        <p>{skill.name || "-"}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=' p-5 px-10'>
                            <div>
                                <p className='text-2xl font-bold'>{dataUser.firstName} {dataUser.lastName}</p>
                            </div>
                            <div className='mt-10'>
                                <p className='text-lg font-bold'>การศึกษา</p>
                                <div className='mt-2 flex flex-wrap gap-5'>
                                    {dataEducations?.university?.map((education, index) => (
                                        <div key={index}>
                                            {editMode ? (
                                                <div className='flex flex-wrap gap-2'>
                                                    <p>{dataEducations.educationLevel[index] || "-"}</p>
                                                    <div>
                                                        <label>มหาวิทยาลัย: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={dataEducations.university[index] || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>คณะ: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={dataEducations.faculty[index] || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>สาขา: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={dataEducations.branch[index] || ""}
                                                        />
                                                    </div>
                                                    {dataEducations.yearGraduation[index] ? (
                                                        <div>
                                                            <label>ปีที่จบการศึกษา: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={dataEducations.yearGraduation[index] || ""}
                                                            />
                                                        </div>

                                                    ) : (
                                                        <div>
                                                            <label>กำลังศึกษาชั้นปีที่: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={dataEducations.level || ""}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label>เกรดเฉลี่ย: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={dataEducations.grade[index] || ""}
                                                        />
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className='flex flex-wrap gap-2'>

                                                    <p>{dataEducations.educationLevel[index] || "-"}</p>
                                                    <p>{dataEducations.university[index] || "-"}</p>
                                                    <p>คณะ{dataEducations.faculty[index] || "-"}</p>
                                                    <p>สาขา{dataEducations.branch[index] || "-"}</p>
                                                    {dataEducations.yearGraduation[index] ? (
                                                        <p>ปีที่จบการศึกษา: {dataEducations.yearGraduation[index] || "-"}</p>
                                                    ) : (
                                                        <p>กำลังศึกษา: ชั้นปีที่ {dataEducations.level}</p>
                                                    )}
                                                    <p>เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}</p>

                                                    <br />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-10'>
                                <p className='text-lg font-bold'>ประสบการณ์ฝึกงาน</p>
                                <div className='mt-2 flex flex-wrap gap-5'>
                                    {dataHistoryWork?.internships?.map((e, index) => (
                                        <div key={index}>
                                            {editMode ? (
                                                <div className='flex flex-wrap gap-2'>
                                                    <div className='flex'>
                                                        <input
                                                            type="text"
                                                            className='inputResume w-28'
                                                            defaultValue={e.dateStart || ""}
                                                        />
                                                        <p>-</p>
                                                        <input
                                                            type="text"
                                                            className='inputResume w-28'
                                                            defaultValue={e.dateEnd || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>สถานที่ฝึกงาน: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={e.place || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>ตำแหน่ง: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={e.position || ""}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex flex-wrap gap-2'>
                                                    <div className='w-full'>
                                                        <p>{e.dateStart} - {e.dateEnd}</p>
                                                    </div>
                                                    <p>สถานที่ฝึกงาน: {e.place}</p>
                                                    <p>ตำแหน่ง: {e.position}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-10'>
                                <p className='text-lg font-bold'>ประสบการณ์ทำงาน</p>
                                <div className='mt-2 flex flex-wrap gap-5'>
                                    {dataHistoryWork?.workExperience?.map((e, index) => (
                                        <div key={index}>
                                            {editMode ? (
                                                <div className='flex flex-wrap gap-2'>
                                                    <div className='flex'>
                                                        <input
                                                            type="text"
                                                            className='inputResume w-28'
                                                            defaultValue={e.dateStart || ""}
                                                        />
                                                        <p>-</p>
                                                        <input
                                                            type="text"
                                                            className='inputResume w-28'
                                                            defaultValue={e.dateEnd || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>สถานที่ฝึกงาน: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={e.place || ""}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>ตำแหน่ง: </label>
                                                        <input
                                                            type="text"
                                                            className='inputResume'
                                                            defaultValue={e.position || ""}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='flex flex-wrap gap-2'>
                                                    <div className='w-full'>
                                                        <p>{e.dateStart} - {e.dateEnd}</p>
                                                    </div>
                                                    <p>สถานที่ฝึกงาน: {e.place}</p>
                                                    <p>ตำแหน่ง: {e.position}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                    {editMode ? (
                        <div className="flex gap-10 w-full justify-center mt-5">
                            <div
                                onClick={() => {
                                    setEditMode(false);
                                }}
                                className={`${bgColorNavbar} ${bgColorWhite} hover:cursor-pointer bg-[#F97201] py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                            >
                                <Icon path={mdiCloseCircle} size={1} />
                                <p>ยกเลิก</p>
                            </div>
                            <button
                                type="submit"
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
                        <div className="flex gap-10 w-full justify-center mt-5">
                            <div
                                onClick={() => setEditMode(true)}
                                className={` ${bgColorNavbar} ${bgColorWhite}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                            >
                                <Icon path={mdiAccountEdit} size={1} />
                                <p>แก้ไขข้อมูล</p>
                            </div>
                            <button
                                type="submit"
                                className=
                                {
                                    `${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`
                                }
                            >
                                <Icon path={mdiContentSave} size={1} />
                                <p>Export</p>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Resume
