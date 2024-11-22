"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from '@/app/ThemeContext';
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiFilePdfBox, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js';
import Swal from 'sweetalert2';
import PDFFile from './PDFFile';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

function Resume({ type, dataUser, id, setLoader }) {

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

    //setArray
    const handleArray = (e, index, setTemp) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setTemp((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

            // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
            while (updatedTemp.length <= index) {
                updatedTemp.push(""); // เพิ่มค่าว่างเพื่อคงขนาดอาร์เรย์
            }

            // อัปเดตค่าใหม่ในตำแหน่งที่กำหนด
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    //new data
    //dataUser
    const [newTel, setNewTel] = useState('');

    //skill
    const [newSkill, setNewSkill] = useState([]);

    //education
    const [newUniversity, setNewUniversity] = useState([]);
    const [newFaculty, setNewFaculty] = useState([]);
    const [newBranch, setNewBranch] = useState([]);
    const [newLevel, setNewLevel] = useState([]);
    const [newGrade, setNewGrade] = useState([]);
    const [newYearGraduation, setNewYearGraduation] = useState([]);

    //historyWork
    const [newInternshipDateStart, setNewInternshipDateStart] = useState([]);
    const [newInternshipDateEnd, setNewInternshipDateEnd] = useState([]);
    const [newInternshipPlace, setNewInternshipPlace] = useState([]);
    const [newInternshipPosition, setNewInternshipPosition] = useState([]);

    const [newWorkDateStart, setNewWorkDateStart] = useState([]);
    const [newWorkDateEnd, setNewWorkDateEnd] = useState([]);
    const [newWorkPlace, setNewWorkPlace] = useState([]);
    const [newWorkPosition, setNewWorkPosition] = useState([]);

    //handleSubmit
    //handle object
    function mergeArrayObject(nonGetArray, getArray, key) {
        // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
        if (nonGetArray.length === 0) {
            return getArray;
        }

        // ตรวจสอบความยาวของทั้งสองอาร์เรย์
        return nonGetArray.map((item, index) => {
            // ถ้า newSkill (getArray) มีค่าใหม่ ให้แทนที่ค่า name
            if (getArray[index]) {
                return {
                    ...item,
                    [key]: getArray[index] // แทนที่ค่า key (เช่น name) ด้วยค่าจาก getArray
                };
            }
            // ถ้าไม่มีค่าใหม่จาก getArray ให้ใช้ค่าจาก nonGetArray (ค่าเก่า)
            return item;
        });
    }
    //handle array
    function mergeArray(nonGetArray, getArray) {
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

    async function handleSubmit(e) {
        e.preventDefault();

        setLoader(true);
        const tempTel = newTel || dataUser?.tel;
        const bodyDataUser = {
            tel: tempTel
        }

        //skill
        let tempSkill = mergeArrayObject(dataSkills?.skills, newSkill, 'name');
        const bodySkill = {
            uuid: dataSkills?.uuid,
            skills: tempSkill,
            trains: dataSkills?.trains,
        };
        // education
        const tempUniversity = mergeArray(newUniversity, dataEducations?.university);
        const tempFaculty = mergeArray(newFaculty, dataEducations?.faculty);
        const tempBranch = mergeArray(newBranch, dataEducations?.branch);
        const tempGrade = mergeArray(newGrade, dataEducations?.grade);
        const tempYearGraduation = mergeArray(newYearGraduation, dataEducations?.yearGraduation);
        const tempLevel = mergeArray(newLevel, dataEducations?.level);
        const bodyEducation = {
            uuid: dataEducations.uuid,
            typePerson: dataEducations.typePerson,
            university: tempUniversity,
            campus: dataEducations.campus,
            faculty: tempFaculty,
            branch: tempBranch,
            level: tempLevel,
            educationLevel: dataEducations.educationLevel,
            grade: tempGrade,
            yearGraduation: tempYearGraduation,
            file: dataEducations.file,
            nameFile: dataEducations.nameFile,
            sizeFile: dataEducations.sizeFile,
            typeFile: dataEducations.typeFile
        };
        //internships
        let tempInternship = mergeArrayObject(dataHistoryWork?.internships, newInternshipDateStart, 'dateStart');
        tempInternship = mergeArrayObject(tempInternship, newInternshipDateEnd, 'dateEnd');
        tempInternship = mergeArrayObject(tempInternship, newInternshipPlace, 'place');
        tempInternship = mergeArrayObject(tempInternship, newInternshipPosition, 'position');

        //work
        let tempWork = mergeArrayObject(dataHistoryWork?.workExperience, newWorkDateStart, 'dateStart');
        tempWork = mergeArrayObject(tempWork, newWorkDateEnd, 'dateEnd');
        tempWork = mergeArrayObject(tempWork, newWorkPlace, 'place');
        tempWork = mergeArrayObject(tempWork, newWorkPosition, 'position');

        const bodyHistoryWork = {
            uuid: dataHistoryWork?.uuid,
            projects: dataHistoryWork?.projects,
            internships: tempInternship,
            workExperience: tempWork,
        };


        try {
            const resDataUser = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyDataUser),
                }
            );

            const resSkill = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodySkill),
                });

            const resEducation = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyEducation)
            });

            const resHistoryWork = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyHistoryWork),
                });


            if (!resDataUser.ok || !resSkill.ok || !resEducation.ok || !resHistoryWork.ok) {
                setLoader(false);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                }).then(() => {
                    setLoader(false);
                });
                return;
            }


            Swal.fire({
                title: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#0d96f8",
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className='min-h-screen'>
            <p>รูปแบบที่ {type}</p>
            {dataUser && dataHistoryWork?.internships?.length > 0 ? (
                <div className='flex justify-center'>
                    <form onSubmit={handleSubmit}>
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
                                                        onChange={(e) => setNewTel(e.target.value)}
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
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewSkill)}
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
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewUniversity)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>คณะ: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={dataEducations.faculty[index] || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewFaculty)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>สาขา: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={dataEducations.branch[index] || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewBranch)}
                                                            />
                                                        </div>
                                                        {dataEducations.yearGraduation[index] ? (
                                                            <div>
                                                                <label>ปีที่จบการศึกษา: </label>
                                                                <input
                                                                    type="text"
                                                                    className='inputResume'
                                                                    defaultValue={dataEducations.yearGraduation[index] || ""}
                                                                    onBlur={(e) => handleArray(e.target.value, index, setNewYearGraduation)}
                                                                />
                                                            </div>

                                                        ) : (
                                                            <div>
                                                                <label>กำลังศึกษาชั้นปีที่: </label>
                                                                <input
                                                                    type="text"
                                                                    className='inputResume'
                                                                    defaultValue={dataEducations.level || ""}
                                                                    onBlur={(e) => handleArray(e.target.value, index, setNewLevel)}
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <label>เกรดเฉลี่ย: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={dataEducations.grade[index] || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewGrade)}
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
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewInternshipDateStart)}
                                                            />
                                                            <p>-</p>
                                                            <input
                                                                type="text"
                                                                className='inputResume w-28'
                                                                defaultValue={e.dateEnd || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewInternshipDateEnd)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>สถานที่ฝึกงาน: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={e.place || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewInternshipPlace)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>ตำแหน่ง: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={e.position || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewInternshipPosition)}
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
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewWorkDateStart)}
                                                            />
                                                            <p>-</p>
                                                            <input
                                                                type="text"
                                                                className='inputResume w-28'
                                                                defaultValue={e.dateEnd || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewWorkDateEnd)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>สถานที่ฝึกงาน: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={e.place || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewWorkPlace)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>ตำแหน่ง: </label>
                                                            <input
                                                                type="text"
                                                                className='inputResume'
                                                                defaultValue={e.position || ""}
                                                                onBlur={(e) => handleArray(e.target.value, index, setNewWorkPosition)}
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
                                <div
                                    className=
                                    {
                                        `${inputTextColor} ${inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#0d96f8]" : ""} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`
                                    }
                                >
                                    <Icon path={mdiFilePdfBox} size={1} />
                                    <p>Export PDF</p>
                                </div>
                            </div>
                        )}
                    </form>
                    <div className="border m-5 w-screen h-screen">
                        <PDFViewer className='w-full h-full'>
                            <PDFFile dataUser={dataUser} dataSkills={dataSkills} dataEducations={dataEducations} dataHistoryWork={dataHistoryWork} yearToday={yearToday} />
                        </PDFViewer>
                    </div>
                </div>

            ) : (
                <div className='mt-10 text-center'>
                    <p>กำลังโหลด...</p>
                </div>
            )}
        </div>
    )
}

export default Resume
