"use client"

import React, { useState, useEffect, useRef } from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'
import Image from 'next/image'
import Loader from '../components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from "../ThemeContext";
import Icon from '@mdi/react'
import { mdiPlus, mdiCloseCircle, mdiDownload } from '@mdi/js'
import Swal from "sweetalert2";

//firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { storage } from '@/app/firebaseConfig';

function WorkHistory() {
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState('')

    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState([])

    // Validate session and fetch user data
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        setLoader(false);

        if (!session) {
            router.replace("/");
            return;
        }

        if (session?.user?.id) {
            getUser(session.user.id);
        } else {
            router.replace("/register");
        }
    }, [status, session, router]);

    //get data from user
    async function getUser(id) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataUser(data.user || {});
        } catch (err) {
            console.error("Error fetching API", err);
        } finally {
            setLoader(false);
        }
    }

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
    } = useTheme();

    //add data
    const [projectName, setProjectName] = useState([]);
    const [projectDetail, setProjectDetail] = useState([]);
    const [projectFile, setProjectFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);

    const handleProjectName = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setProjectName((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };
    const handleProjectDetail = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setProjectDetail((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };

    //config field
    const [projects, setProjects] = useState([{}]);
    const [errorField, setErrorField] = useState('')

    const handleAddProject = () => {
        if (!projectName[projects.length - 1]
            || !projectDetail[projects.length - 1]
            || !projectFile[projects.length - 1]?.fileUrl) {
            setErrorField("กรุณากรอกข้อความให้ครบก่อนเพิ่มฟิลด์ใหม่")
            return;
        }
        if (projects.length >= 5) {
            setErrorField("")
            return;
        }
        setErrorField("")
        setProjects([...projects, {}]);

    };

    const handleRemoveProject = (index) => {
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
                const newProjects = [...projects];
                newProjects.splice(index, 1);
                setProjects(newProjects);

                const temp = index;

                const newTempProjectName = projectName.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
                setProjectName(newTempProjectName); // ตั้งค่าใหม่ให้ หลังจากลบ

                const newTempProjectDetail = projectDetail.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
                setProjectDetail(newTempProjectDetail); // ตั้งค่าใหม่ให้ หลังจากลบ

                const newTempProjectFile = projectFile.filter((_, i) => i !== index);
                setProjectFile(newTempProjectFile);
            }
        });
    };

    console.log("projectFile: " + projectFile);
    console.log("projectName: " + projectName);
    console.log("projectDetail: " + projectDetail);
    //upload file
    //projects
    const projectFileInputRef = useRef(null);
    const [projectUploadProgress, setProjectUploadProgress] = useState(0);

    // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
    const openFileDialog = () => {
        if (projectFileInputRef.current) {
            projectFileInputRef.current.click();
        }
    };

    const handleProfileDocument = (event, index) => {
        setLoader(true);
        const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
        if (selectedFile) {

            const fileExtension = selectedFile.name.split('.').pop(); // รับนามสกุลไฟล์
            if (fileExtension !== 'pdf') {
                setError('กรุณาอัปโหลดไฟล์ PDF เท่านั้น');
                setLoader(false);
                return;
            }

            // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

            // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
            const fileName = selectedFile.name.split('.').slice(0, -1).join('.');

            const storageRef = ref(storage, `users/documents/workHistory/${session?.user?.email}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    setError(""); // รีเซ็ตข้อความข้อผิดพลาด
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProjectUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
                },
                (error) => {
                    setLoader(false);
                    console.error('Error uploading file:', error);
                },
                () => {
                    // เมื่ออัปโหลดเสร็จสิ้น
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ files
                            const newProjectFile = {
                                fileName: fileName,
                                fileType: fileExtension,
                                fileUrl: url,
                                fileSize: fileSizeMB,
                            };

                            setProjectFile((prevProjects) => {
                                const updatedProjects = [...prevProjects];
                                updatedProjects[index] = newProjectFile; // อัปเดตตำแหน่งที่ index
                                return updatedProjects;
                            });
                            // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
                            setProjectUploadProgress(0);
                            projectFileInputRef.current.value = '';
                            setLoader(false);
                        })
                        .catch((error) => {
                            setLoader(false);
                            console.error('Error getting download URL:', error);
                        });
                }
            );
        }
    };

    return (
        <div className={`${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="ประวัติการทำงาน / ฝึกงาน" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <form className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
                        <div>
                            <p className='mb-2'>โครงงาน / ผลงาน</p>
                            <hr />
                            {projects.map((project, index) => (
                                <div key={index}>
                                    {index > 0 && (
                                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                                            <div
                                                className={` cursor-pointer  rounded-lg w-fit`}
                                                onClick={() => handleRemoveProject(index)}
                                            >
                                                <Icon className={` text-red-400`} path={mdiCloseCircle} size={1} />
                                            </div>
                                        </div>
                                    )}
                                    <div className='mt-5 flex gap-5 flex-wrap'>
                                        <div className='flex flex-col gap-1'>
                                            <label >ชื่อโครงงาน / ผลงาน</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุชื่อโครงงานหรือผลงาน"
                                                onBlur={(e) => handleProjectName(e.target.value, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >รายละเอียด</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                onBlur={(e) => handleProjectDetail(e.target.value, index)}
                                            />
                                        </div>
                                        <div className={` ${bgColorMain} flex flex-col gap-1`}>
                                            <label>เอกสารประกอบ</label>
                                            {/* input สำหรับเลือกไฟล์ */}
                                            <input
                                                id="chooseProfile"
                                                type="file"
                                                ref={projectFileInputRef} // เชื่อมต่อกับ ref
                                                onChange={(e) => handleProfileDocument(e, index)}
                                                hidden
                                            />
                                            {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                                            {projectFile[index] && projectFile[index].fileUrl !== '' ? (
                                                <div className={`mt-1 w-fit py-2 flex gap-8`}
                                                >
                                                    <div>
                                                        <p>
                                                            {projectFile[index].fileName}.{projectFile[index].fileType}
                                                        </p>
                                                    </div>
                                                    <p className='text-gray-500'>{projectFile[index].fileSize} MB</p>
                                                    <div className='cursor-pointer'>
                                                        <Icon className={` text-black mx-3`} path={mdiDownload} size={1} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={openFileDialog} // เรียกใช้ฟังก์ชันเมื่อคลิก
                                                    className="border mt-1 rounded-lg py-2 px-8 text-center bg-gray-300 cursor-pointer"
                                                >
                                                    Choose File
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            ))}
                            {errorField && (
                                <div className='mt-3 text-red-500'>
                                    *{errorField}
                                </div>
                            )}
                            {projects.length < 5 && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                        onClick={handleAddProject}
                                    >
                                        <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default WorkHistory
