"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import Link from 'next/link';
import NavbarLogo from '../components/NavbarLogo';
import NavbarMain from '../components/NavbarMain';
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiContentSave, mdiArrowDownDropCircle, mdiCloseCircle, mdiPlus } from '@mdi/js';

//firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { storage } from '@/app/firebaseConfig';


function editEducation() {
    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState(null);
    const [loader, setLoader] = useState(true);

    //value data user
    const [typePerson, setTypePerson] = useState("");
    const [university, setUniversity] = useState([]);
    const [campus, setCampus] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [branch, setBranch] = useState([]);
    const [level, setLevel] = useState([]);
    const [educationLevel, setEducationLevel] = useState([]);
    const [grade, setGrade] = useState([]);
    const [yearGraduation, setYearGraduation] = useState([]);

    const [error, setError] = useState('')
    const [errorEducation, setErrorEducation] = useState('')

    //get data Education
    const [dataEducations, setDataEducations] = useState(null)
    async function getEducation(email) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations/${email}`, {
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
        } finally {
            setLoader(false);
        }
    }

    const [defaultField, setDefaultField] = useState([])
    //set Default Educations
    useEffect(() => {
        if (!dataEducations) return;

        setUniversity(dataEducations.university)
        setTypePerson(dataEducations.typePerson)
        setCampus(dataEducations.campus)
        setFaculty(dataEducations.faculty)
        setBranch(dataEducations.branch)
        setLevel(dataEducations.level)
        setEducationLevel(dataEducations.educationLevel)
        setGrade(dataEducations.grade)
        setYearGraduation(dataEducations.yearGraduation)
        setFiles(dataEducations.fileDocument)
        setNameFiles(dataEducations.nameDocument)
        setSizeFiles(dataEducations.sizeDocument)

        setDefaultField(dataEducations.university)

    }, [dataEducations])

    //add array
    const handleUniversity = (e, index) => {
        const newUniversity = e; // ค่าที่ได้รับจาก input
        setUniversity((prevUniversities) => {
            const updatedUniversities = [...prevUniversities]; // ทำสำเนาของ array เดิม
            updatedUniversities[index] = newUniversity; // อัปเดตค่าใหม่
            // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
            return updatedUniversities.filter(uni => uni !== "").concat(Array(updatedUniversities.length - updatedUniversities.filter(uni => uni !== "").length).fill(""));
        });
    };

    const handleFaculty = (e, index) => {
        const newFaculty = e; // ค่าที่ได้รับจาก input
        setFaculty((prevFaculties) => {
            const updatedFaculties = [...prevFaculties]; // ทำสำเนาของ array เดิม
            updatedFaculties[index] = newFaculty; // อัปเดตค่าใหม่
            // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
            return updatedFaculties.filter(fac => fac !== "").concat(Array(updatedFaculties.length - updatedFaculties.filter(fac => fac !== "").length).fill(""));
        });
    };

    const handleBranch = (e, index) => {
        const newBranch = e; // ค่าที่ได้รับจาก input
        setBranch((prevBranches) => {
            const updatedBranches = [...prevBranches]; // ทำสำเนาของ array เดิม
            updatedBranches[index] = newBranch; // อัปเดตค่าใหม่
            // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
            return updatedBranches.filter(branch => branch !== "").concat(Array(updatedBranches.length - updatedBranches.filter(branch => branch !== "").length).fill(""));
        });
    };

    const handleCampus = (e, index) => {
        const newCampus = e; // ค่าที่ได้รับจาก input
        setCampus((prevCampuses) => {
            const updatedCampuses = [...prevCampuses]; // ทำสำเนาของ array เดิม
            updatedCampuses[index] = newCampus; // อัปเดตค่าใหม่
            // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
            return updatedCampuses.filter(campus => campus !== "").concat(Array(updatedCampuses.length - updatedCampuses.filter(campus => campus !== "").length).fill(""));
        });
    };

    const handleGrade = (e, index) => {
        const newGrade = e; // ค่าที่ได้รับจาก input
        setGrade((prevGrades) => {
            const updatedGrades = [...prevGrades]; // ทำสำเนาของ array เดิม
            updatedGrades[index] = newGrade; // อัปเดตค่าใหม่
            // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
            return updatedGrades.filter(grade => grade !== "").concat(Array(updatedGrades.length - updatedGrades.filter(grade => grade !== "").length).fill(""));
        });
    };

    //add field
    const [fields, setFields] = useState([]);
    const addField = (n) => {

        const temp = n;
        console.log(temp);
        if (typePerson === "0" || !typePerson) {
            setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
            return;
        }
        if (!university[temp] || !branch[temp] || !faculty[temp] || !educationLevel[temp] || !grade[temp]) {
            setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
            return;
        } else if (typePerson === "นักศึกษาพิการ") {
            if (!level[0] || !campus[0]) {
                setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
                return;
            }
        } else if (typePerson === "บัณฑิตพิการ") {
            if (!yearGraduation[temp]) {
                setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
                return;
            }
        }

        setErrorEducation("");

        if (defaultField.length - fields.length >= 3) return;
        setFields([...fields, `Field ${fields.length + 1}`]);
    };

    const deleteField = (index) => {

        const temp = university.length-index;
        // console.log(university.length);
        // console.log(index);
        // console.log(temp);
        setErrorEducation("");

        // ลบฟิลด์ที่มี index ตรงกัน
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields); // ตั้งค่าใหม่ให้ fields หลังจากลบ

        const newUniversities = university.filter((_, i) => i !== temp); // ลบมหาวิทยาลัยที่มี index ตรงกัน
        setUniversity(newUniversities); // ตั้งค่าใหม่ให้ university หลังจากลบ

        const newEducationLevels = educationLevel.filter((_, i) => i !== temp);
        setEducationLevel(newEducationLevels);

        const newFaculty = faculty.filter((_, i) => i !== temp);
        setFaculty(newFaculty);

        const newBranch = branch.filter((_, i) => i !== temp);
        setBranch(newBranch);

        const newCampus = campus.filter((_, i) => i !== temp);
        setCampus(newCampus);

        const newGrade = grade.filter((_, i) => i !== temp);
        setGrade(newGrade);

        const newYearGraduation = yearGraduation.filter((_, i) => i !== temp);
        setYearGraduation(newYearGraduation);

    };


    const [editMode, setEditMode] = useState(true);

    const today = new Date();
    const yearToday = today.getFullYear();
    // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
    const years = Array.from({ length: 101 }, (_, i) => yearToday - i);

    // Validate session and fetch user data
    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/');
            return;
        }

        if (session?.user?.email) {
            getUser(session.user.email);
            getEducation(session.user.email)
        } else {
            router.replace('/register');
        }

    }, [status, session, router]);
    // Redirect to register if dataUser is empty or null
    useEffect(() => {
        if (dataUser === null) {
            return;
        }

        if (!dataUser || Object.keys(dataUser).length === 0) {
            router.replace('/register');
        }


    }, [dataUser, router, session]);

    // Fetch user data from API
    async function getUser(email) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${email}`, {
                method: "GET",
                cache: "no-store"
            });

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

    // Manage loader state
    useEffect(() => {
        document.body.classList.toggle('no_scroll', loader);
    }, [loader]);


    //upload file
    const [file, setFiles] = useState([]); // อาร์เรย์ของไฟล์ที่อัปโหลด
    const [nameFile, setNameFiles] = useState([]); // อาร์เรย์ของชื่อไฟล์
    const [sizeFile, setSizeFiles] = useState([]); // อาร์เรย์ของขนาดไฟล์
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputFileRef = useRef(null);
    const [inputNameFile, setInputNameFile] = useState('');

    const openFileDialog = () => {
        if (!inputNameFile) {
            setError("กรุณาระบุชื่อเอกสารก่อนทำการอัพโหลด");
            return;
        }

        setError(""); // รีเซ็ตข้อความข้อผิดพลาด

        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDocument = (event) => {
        const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
        if (selectedFile) {
            // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
            setSizeFiles((prevSizes) => [...prevSizes, fileSizeMB]); // เพิ่มขนาดไฟล์ลงในอาร์เรย์

            // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
            const fileName = inputNameFile || selectedFile.name;
            setNameFiles((prevNames) => [...prevNames, fileName]); // เพิ่มชื่อไฟล์ลงในอาร์เรย์

            const storageRef = ref(storage, `users/documents/${session?.user?.email}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
                },
                (error) => {
                    console.error('Error uploading file:', error);
                },
                () => {
                    // เมื่ออัปโหลดเสร็จสิ้น
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ files
                            setFiles((prevFiles) => [...prevFiles, url]);

                            // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
                            setUploadProgress(0);
                            setInputNameFile('');
                            inputFileRef.current.value = '';
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                }
            );
        }
    };

    async function handleSubmit(e, n) {
        e.preventDefault();


        console.log("typePerson: " + typePerson);
        console.log("university: " + university);
        console.log("faculty: " + faculty);
        console.log("branch: " + branch);
        console.log("campus: " + campus);
        console.log("grade: " + grade);
        console.log("level: " + level);
        console.log("EducationLevel: " + educationLevel);
        console.log("YearGraduation: " + yearGraduation);
        console.log("File: ");
        file.map((e) => {
            console.log(e);
        })
        console.log("FileSize: " + sizeFile);
        console.log("----------- End -----------");

        if (uploadProgress !== 0) {
            setError("เอกสารกำลังอัพโหลด")

        }

        if (typePerson === "0" || !typePerson) {
            setError("ระบุข้อมูลให้ครบทุกช่อง");
            return;
        }
        if (!university[n] || !branch[n] || !faculty[n] || !educationLevel[n] || !grade[n]) {
            setError("ระบุข้อมูลให้ครบทุกช่อง");
            return;
        } else if (typePerson === "นักศึกษาพิการ") {
            if (!level[0] || !campus[0]) {
                setError("ระบุข้อมูลให้ครบทุกช่อง");
                return;
            }
        } else if (typePerson === "บัณฑิตพิการ") {
            if (!yearGraduation[n]) {
                setError("ระบุข้อมูลให้ครบทุกช่อง");
                return;
            }
        }

        setError("")

        const bodyEducation = {
            email: session?.user?.email,
            typePerson,
            university,
            campus,
            faculty,
            branch,
            level,
            educationLevel,
            grade,
            yearGraduation,
            file,
            nameFile,
            sizeFile,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyEducation)
            })

            if (!res.ok) {
                setLoader(false);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                }).then(() => {
                    window.location.reload();
                })
                return;
            }

            setLoader(false);
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
        <div>
            <NavbarLogo title="ประวัติการศึกษา" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    <div className=" bg-white rounded-lg p-5">
                        <form onSubmit={(e) => handleSubmit(e, fields.length)} className=" flex gap-x-10 gap-y-5 gap- flex-wrap">
                            <div className=" flex flex-col w-full">
                                <label>ประเภทบุลคล</label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => setTypePerson(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-40  border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                        value={typePerson || "0"}
                                    >
                                        <option value="0">-</option>
                                        <option value="นักศึกษาพิการ">นักศึกษาพิการ</option>
                                        <option value="บัณฑิตพิการ">บัณฑิตพิการ</option>
                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>

                            {defaultField.map((n, index) => (
                                <div key={index} className=" flex gap-x-10 gap-y-5 gap- flex-wrap" >
                                    {index > 0 &&(
                                        <div className={`w-full flex gap-5 items-end`}>
                                            <div onClick={() => deleteField(index)} className={`${!editMode ? "hidden" : ""} w-fit cursor-pointer `}>
                                                <Icon className={` text-red-400 `} path={mdiCloseCircle} size={1} />
                                            </div>
                                        </div>
                                    )}
                                    <div className=" flex flex-col">
                                        <label>ระดับชั้น</label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    let newEducationLevels = [...educationLevel]; // คัดลอก array
                                                    newEducationLevels[index] = e.target.value; // อัปเดตค่าตาม index
                                                    setEducationLevel(newEducationLevels); // ตั้งค่าใหม่
                                                }}
                                                className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-40  border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={educationLevel[index] || "0"}
                                            >
                                                <option value="0">-</option>
                                                <option value="ปริญญาตรี">ปริญญาตรี</option>
                                                <option value="ปริญญาโท">ปริญญาโท</option>
                                                <option value="ปริญญาเอก">ปริญญาเอก</option>
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                    {typePerson === "บัณฑิตพิการ" || index > 0 && (
                                        <div className=" flex flex-col">
                                            <label>ปีที่จบการศึกษา</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    onChange={(e) => {
                                                        let newData = [...yearGraduation]; // คัดลอก array
                                                        newData[index] = e.target.value; // อัปเดตค่าตาม index
                                                        setYearGraduation(newData); // ตั้งค่าใหม่
                                                    }}
                                                    className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    disabled={!editMode}
                                                    value={yearGraduation[index] || "0"}
                                                >
                                                    <option value="0">-</option>
                                                    {years.map((y, index) => (
                                                        <option key={index} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                                <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex col flex-col">
                                        <label>สถาบันการศึกษา/มหาวิทยาลัย </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleUniversity(e.target.value, index)}
                                            defaultValue={university[index] || ""}
                                            readOnly={!editMode}
                                            placeholder="ระบุสถานศึกษา"
                                        />
                                    </div>
                                    {typePerson === 'นักศึกษาพิการ' && index === 0 && (
                                        <div className="flex col flex-col">
                                            <label>วิทยาเขต </label>
                                            <input
                                                type="text"
                                                className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                                onBlur={(e) => handleCampus(e.target.value, index)}
                                                defaultValue={campus[index] || ""}
                                                readOnly={!editMode}
                                                placeholder="ระบุวิทยาเขตการศึกษา"
                                            />
                                        </div>
                                    )}
                                    <div className="flex col flex-col">
                                        <label>คณะ </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleFaculty(e.target.value, index)}
                                            defaultValue={faculty[index] || ""}
                                            readOnly={!editMode}
                                            placeholder="คณะที่สังกัด"
                                        />
                                    </div>
                                    <div className="flex col flex-col">
                                        <label>สาขา </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleBranch(e.target.value, index)}
                                            defaultValue={branch[index] || ""}
                                            readOnly={!editMode}
                                            placeholder="สาขาที่สังกัด"
                                        />
                                    </div>

                                    {typePerson === "นักศึกษาพิการ" && index === 0 && (
                                        <div className=" flex flex-col">
                                            <label>ชั้นปี</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    onChange={(e) => {
                                                        let newData = [...level]; // คัดลอก array
                                                        newData[index] = e.target.value; // อัปเดตค่าตาม index
                                                        setLevel(newData); // ตั้งค่าใหม่
                                                    }}
                                                    className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-32  border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    disabled={!editMode}
                                                    value={level[index] || "0"}
                                                >
                                                    <option value="0">-</option>
                                                    <option value="1">ชั้นปี1</option>
                                                    <option value="2">ชั้นปี2</option>
                                                    <option value="3">ชั้นปี3</option>
                                                    <option value="4">ชั้นปี4</option>
                                                </select>
                                                <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex col flex-col">
                                        <label>เกรดเฉลี่ย </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-24 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleGrade(e.target.value, index)}
                                            defaultValue={grade || ""}
                                            readOnly={!editMode}
                                            placeholder="Ex. 3.12"
                                        />
                                    </div>
                                </div>
                            ))}

                            {fields.map((field, index) => (
                                <div className=" flex gap-x-10 gap-y-5 gap- flex-wrap" key={index}>
                                    <div className={`w-full flex gap-5 items-end`}>
                                        <div onClick={() => deleteField(index)} className={`${!editMode ? "hidden" : ""} w-fit cursor-pointer `}>
                                            <Icon className={` text-red-400 `} path={mdiCloseCircle} size={1} />
                                        </div>
                                    </div>
                                    <div className=" flex flex-col">
                                        <label>ระดับชั้น</label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    let newEducationLevels = [...educationLevel]; // คัดลอก array
                                                    newEducationLevels[index + 1 + (defaultField.length - 1)] = e.target.value; // อัปเดตค่าตาม index
                                                    setEducationLevel(newEducationLevels); // ตั้งค่าใหม่
                                                }}
                                                className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-40  border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={educationLevel[index + 1 + (defaultField.length - 1)] || "0"}
                                            >
                                                <option value="0">-</option>
                                                <option value="ปริญญาตรี">ปริญญาตรี</option>
                                                <option value="ปริญญาโท">ปริญญาโท</option>
                                                <option value="ปริญญาเอก">ปริญญาเอก</option>
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                    <div className=" flex flex-col">
                                        <label>ปีที่จบการศึกษา</label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    let newData = [...yearGraduation]; // คัดลอก array
                                                    newData[index + 1 + (defaultField.length - 1)] = e.target.value; // อัปเดตค่าตาม index
                                                    setYearGraduation(newData); // ตั้งค่าใหม่
                                                }}
                                                className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={yearGraduation[index + 1 + (defaultField.length - 1)] || "0"}
                                            >
                                                <option value="0">-</option>
                                                {years.map((y, index) => (
                                                    <option key={index} value={y}>{y}</option>
                                                ))}
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                    <div className="flex col flex-col">
                                        <label>สถาบันการศึกษา/มหาวิทยาลัย </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleUniversity(e.target.value, index + 1 + (defaultField.length - 1))}
                                            defaultValue={university[index + 1 + (defaultField.length - 1)] || ""}
                                            readOnly={!editMode}
                                            placeholder="ระบุสถานศึกษา"
                                        />
                                    </div>

                                    <div className="flex col flex-col">
                                        <label>คณะ </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleFaculty(e.target.value, index + 1 + (defaultField.length - 1))}
                                            defaultValue={faculty[index + 1 + (defaultField.length - 1)] || ""}
                                            readOnly={!editMode}
                                            placeholder="คณะที่สังกัด"
                                        />
                                    </div>
                                    <div className="flex col flex-col">
                                        <label>สาขา </label>
                                        <input
                                            type="text"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleBranch(e.target.value, index + 1 + (defaultField.length - 1))}
                                            defaultValue={branch[index + 1 + (defaultField.length - 1)] || ""}
                                            readOnly={!editMode}
                                            placeholder="สาขาที่สังกัด"
                                        />
                                    </div>
                                    <div className="flex col flex-col">
                                        <label>เกรดเฉลี่ย </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-24 border border-gray-400 py-2 px-4 rounded-lg`}
                                            onBlur={(e) => handleGrade(e.target.value, index + 1 + (defaultField.length - 1))}
                                            defaultValue={grade[index + 1 + (defaultField.length - 1)] || ""}
                                            readOnly={!editMode}
                                            placeholder="Ex. 3.12"
                                        />
                                    </div>
                                </div>
                            ))}
                            {errorEducation && (
                                <div className="w-full">
                                    <p className="text-red-500">* {errorEducation}</p>
                                </div>
                            )}
                            <div className={`${fields.length + defaultField >= 3 ? "hidden" : ""} flex col flex-col justify-end w-full`}>
                                <div onClick={() => addField(fields.length)} className={`${!editMode ? "hidden" : ""}  cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}>
                                    <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                                </div>
                            </div>

                            <hr className="w-full my-3" />
                            <div className="flex col flex-col">
                                <label className="mb-3">เอกสารเพิ่มเติม</label>
                                {editMode && (
                                    <>
                                        <div className="flex gap-5 flex-wrap">
                                            <input
                                                type="text"
                                                className={`${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                                onChange={(e) => setInputNameFile(e.target.value)} // ตั้งชื่อไฟล์
                                                placeholder="ชื่อเอกสาร"
                                                readOnly={!editMode}
                                                value={inputNameFile}
                                            />
                                            <div className={`mt-1 flex items-center`}>
                                                <input
                                                    id="chooseFile"
                                                    ref={inputFileRef}
                                                    onChange={handleDocument}
                                                    type="file"
                                                    className=""
                                                    hidden
                                                />
                                                <div
                                                    onClick={openFileDialog}
                                                    className="border rounded-lg py-2 px-4 text-center bg-gray-300 cursor-pointer"
                                                >
                                                    Choose File
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex mt-5">
                                            <p>
                                                <span className="text-red-500 font-bold">ตัวอย่าง</span>
                                                &nbsp;&nbsp;&nbsp;&nbsp;หนังสือรับรองผลการเรียน ปีที่ 1
                                            </p>
                                            <Icon className={`cursor-pointer text-gray-400 mx-3`} path={mdiArrowDownDropCircle} size={0.8} />
                                        </div>
                                        {uploadProgress > 0 && (
                                            <div className="mt-2">
                                                <p>กำลังดาวน์โหลด: {uploadProgress.toFixed(2)}%</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {file.length > 0 ? (
                                <div className="w-full mt-5">
                                    <p>ชื่อ</p>
                                    <hr className="w-full my-3" />
                                    {file.map((n, index) => (
                                        <div key={index} className="my-5">
                                            <div className="flex justify-between ">
                                                <p>{nameFile[index]}</p>
                                                <p>{sizeFile[index]} MB</p>
                                                <div className="flex">
                                                    <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                                    <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                                    <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                                </div>
                                            </div>
                                            <hr className="w-full my-1" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full text-center text-gray-300">ยังไม่มีไฟล์ที่อัพโหลด</div>
                            )}

                            {error && (
                                <div className="w-full text-center">
                                    <p className="text-red-500">* {error}</p>
                                </div>
                            )}
                            {editMode ? (
                                <div className="flex gap-10 w-full justify-center mt-5">
                                    <div onClick={() => {
                                        setEditMode(false)
                                        window.location.reload()
                                    }
                                    } className='hover:cursor-pointer bg-[#F97201] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'>
                                        <Icon path={mdiCloseCircle} size={1} />
                                        <p>ยกเลิก</p>
                                    </div>
                                    <button type='submit' className='hover:cursor-pointer bg-[#75C7C2] text-white py-2 px-6 rounded-2xl flex justify-center items-center gap-1'>
                                        <Icon path={mdiContentSave} size={1} />
                                        <p>บันทึก</p>
                                    </button>
                                </div>
                            ) : (
                                <div className=" flex w-full justify-center mt-10">
                                    <div onClick={() => setEditMode(true)} className='hover:cursor-pointer bg-[#F97201] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'>
                                        <Icon path={mdiAccountEdit} size={1} />
                                        <p>แก้ไขข้อมูล</p>
                                    </div>
                                </div>
                            )}
                        </form>

                    </div>
                </div>
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    );
}

export default editEducation;
