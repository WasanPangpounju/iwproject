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
import { mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave } from '@mdi/js'
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
            getHistoryWork(session.user.id);
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
        if ((!projectName[projects.length - 1]
            || !projectDetail[projects.length - 1]
            || !projectFile[projects.length - 1]?.fileUrl)
            &&
            (!getProjectName[projects.length - 1]
                || !getProjectDetail[projects.length - 1]
                || !getProjectFile[projects.length - 1]?.fileUrl)) {
            setErrorField("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่")
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

                setErrorField("")
                const newTempProjectName = projectName.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
                setProjectName(newTempProjectName); // ตั้งค่าใหม่ให้ หลังจากลบ

                const newTempProjectDetail = projectDetail.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
                setProjectDetail(newTempProjectDetail); // ตั้งค่าใหม่ให้ หลังจากลบ

                const newTempProjectFile = projectFile.filter((_, i) => i !== index);
                setProjectFile(newTempProjectFile);
            }
        });
    };

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
            if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
                setError('กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น');
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

    //create year value
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (v, i) => currentYear - i);

    //set internship
    //add data
    const [dateStartInternship, setDateStartInternship] = useState([]);
    const [dateEndInternship, setDateEndInternship] = useState([]);
    const [placeInternship, setPlaceInternship] = useState([]);
    const [positionInternship, setPositionInternship] = useState([]);
    const [internshipFile, setInternshipFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);

    const handleDateStartInternship = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setDateStartInternship((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };
    const handleDateEndInternship = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setDateEndInternship((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };
    const handlePlaceInternship = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setPlaceInternship((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };
    const handlePositionInternship = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setPositionInternship((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
            updatedTemp[index] = newTemp; // อัปเดตค่าใหม่
            return updatedTemp.filter(temp => temp !== "").concat(Array(updatedTemp.length - updatedTemp.filter(temp => temp !== "").length).fill(""));
        });
    };

    //config field
    const [internships, setInternships] = useState([{}]);
    const [errorFieldInterships, setErrorFieldInterships] = useState('')

    const handleAddInterships = () => {
        if (!dateStartInternship[internships.length - 1]
            || !dateEndInternship[internships.length - 1]
            || !placeInternship[internships.length - 1]
            || !positionInternship[internships.length - 1]
            || !internshipFile[internships.length - 1]?.fileUrl) {
            setErrorFieldInterships("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่")
            return;
        }
        if (internships.length >= 5) {
            setErrorFieldInterships("")
            return;
        }
        setErrorFieldInterships("")
        setInternships([...internships, {}]);

    };

    const handleRemoveInternship = (index) => {
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
                const newProjects = [...internships];
                newProjects.splice(index, 1);
                setInternships(newProjects);

                const temp = index;

                setErrorFieldInterships("")
                setDateStartInternship((prev) => prev.filter((_, i) => i !== temp));
                setDateEndInternship((prev) => prev.filter((_, i) => i !== temp));
                setPlaceInternship((prev) => prev.filter((_, i) => i !== temp));
                setPositionInternship((prev) => prev.filter((_, i) => i !== temp));
                setInternshipFile((prev) => prev.filter((_, i) => i !== temp));
            }
        });
    };

    //upload file
    //projects
    const internFileInputRef = useRef(null);
    const [internshipFileUploadProgress, setInternshipUploadProgress] = useState(0);

    // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
    const openFileDialogInternship = () => {
        if (internFileInputRef.current) {
            internFileInputRef.current.click();
        }
    };

    const handleInternshipDocument = (event, index) => {
        setLoader(true);
        const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
        if (selectedFile) {

            const fileExtension = selectedFile.name.split('.').pop(); // รับนามสกุลไฟล์
            if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
                setError('กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น');
                setLoader(false);
                return;
            }

            // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

            // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
            const fileName = selectedFile.name.split('.').slice(0, -1).join('.');

            const storageRef = ref(storage, `users/documents/internship/${session?.user?.email}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    setError(""); // รีเซ็ตข้อความข้อผิดพลาด
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setInternshipUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
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

                            setInternshipFile((prevProjects) => {
                                const updatedProjects = [...prevProjects];
                                updatedProjects[index] = newProjectFile; // อัปเดตตำแหน่งที่ index
                                return updatedProjects;
                            });
                            // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
                            setInternshipUploadProgress(0);
                            internFileInputRef.current.value = '';
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

    //set work
    const [dateStartWork, setDateStartWork] = useState([]);
    const [dateEndWork, setDateEndWork] = useState([]);
    const [placeWork, setPlaceWork] = useState([]);
    const [positionWork, setPositionWork] = useState([]);
    const [workFile, setWorkFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);

    const handleDateStartWork = (e, index) => {
        const newTemp = e;
        setDateStartWork((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    const handleDateEndWork = (e, index) => {
        const newTemp = e;
        setDateEndWork((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    const handlePlaceWork = (e, index) => {
        const newTemp = e;
        setPlaceWork((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    const handlePositionWork = (e, index) => {
        const newTemp = e;
        setPositionWork((prevTemp) => {
            const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
            updatedTemp[index] = newTemp;
            return updatedTemp;
        });
    };

    // config field
    const [works, setWorks] = useState([{}]);
    const [errorFieldWorks, setErrorFieldWorks] = useState('');

    const handleAddWork = () => {
        if (!dateStartWork[works.length - 1]
            || !dateEndWork[works.length - 1]
            || !placeWork[works.length - 1]
            || !positionWork[works.length - 1]
            || !workFile[works.length - 1]?.fileUrl) {
            setErrorFieldWorks("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่");
            return;
        }
        if (works.length >= 5) {
            setErrorFieldWorks("");
            return;
        }
        setErrorFieldWorks("");
        setWorks([...works, {}]);
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

                setErrorFieldWorks("");
                setDateStartWork((prev) => prev.filter((_, i) => i !== index));
                setDateEndWork((prev) => prev.filter((_, i) => i !== index));
                setPlaceWork((prev) => prev.filter((_, i) => i !== index));
                setPositionWork((prev) => prev.filter((_, i) => i !== index));
                setWorkFile((prev) => prev.filter((_, i) => i !== index));
            }
        });
    };

    //upload file
    const workFileInputRef = useRef(null);
    const [workFileUploadProgress, setWorkFileUploadProgress] = useState(0);

    const openFileDialogWork = () => {
        if (workFileInputRef.current) {
            workFileInputRef.current.click();
        }
    };

    const handleWorkDocument = (event, index) => {
        setLoader(true);
        const selectedFile = event.target.files[0];
        if (selectedFile) {

            const fileExtension = selectedFile.name.split('.').pop();
            if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
                setError('กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น');
                setLoader(false);
                return;
            }

            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
            const fileName = selectedFile.name.split('.').slice(0, -1).join('.');

            const storageRef = ref(storage, `users/documents/work/${session?.user?.email}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    setError("");
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setWorkFileUploadProgress(progress);
                },
                (error) => {
                    setLoader(false);
                    console.error('Error uploading file:', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            const newWorkFile = {
                                fileName: fileName,
                                fileType: fileExtension,
                                fileUrl: url,
                                fileSize: fileSizeMB,
                            };

                            setWorkFile((prevFiles) => {
                                const updatedFiles = [...prevFiles];
                                updatedFiles[index] = newWorkFile;
                                return updatedFiles;
                            });
                            setWorkFileUploadProgress(0);
                            workFileInputRef.current.value = '';
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

    const [editMode, setEditMode] = useState(false)

    //submit
    async function handleSubmit(e) {
        e.preventDefault();

        setLoader(true);


        // หลังจากตั้งค่าแล้ว ดำเนินการตรวจสอบข้อมูล
        const isProjectFilled = projectName.length || projectDetail.length || projectFile[projectName.length - 1]?.fileUrl;
        const isProjectComplete = projectName.length && projectDetail.length && projectFile[projectName.length - 1]?.fileUrl;

        const isInternshipFilled = dateStartInternship.length || dateEndInternship.length || placeInternship.length || positionInternship.length || internshipFile[dateStartInternship.length - 1]?.fileUrl;
        const isInternshipComplete = dateStartInternship.length && dateEndInternship.length && placeInternship.length && positionInternship.length && internshipFile[dateStartInternship.length - 1]?.fileUrl;

        const isWorkFilled = dateStartWork.length || dateEndWork.length || placeWork.length || positionWork.length || workFile[dateStartWork.length - 1]?.fileUrl;
        const isWorkComplete = dateStartWork.length && dateEndWork.length && placeWork.length && positionWork.length && workFile[dateStartWork.length - 1]?.fileUrl;

        // ตรวจสอบว่าแต่ละกลุ่มครบหรือไม่ครบ
        if (isProjectFilled && !isProjectComplete) {
            setError("กรุณากรอกข้อมูล โครงงาน/ผลงาน ให้ครบทุกฟิลด์");
            setLoader(false);
            return;
        }

        if (isInternshipFilled && !isInternshipComplete) {
            setError("กรุณากรอกข้อมูล การฝึกงาน ให้ครบทุกฟิลด์");
            setLoader(false);
            return;
        }

        if (isWorkFilled && !isWorkComplete) {
            setError("กรุณากรอกข้อมูล การทำงาน ให้ครบทุกฟิลด์");
            setLoader(false);
            return;
        }

        // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
        setError('');

        // console.log("--- project ---");
        // console.log("project : " + projectName);
        // console.log("detailProject : " + projectDetail);
        // console.log("FileProject : " + projectFile[0].fileName);
        // console.log("--- internship ---");
        // console.log("dateStart : " + dateStartInternship);
        // console.log("dateEnd : " + dateEndInternship);
        // console.log("placeInternship : " + placeInternship);
        // console.log("positionInternship : " + positionInternship);
        // console.log("internshipFile : " + internshipFile[0].fileName);
        // console.log("--- work ---");
        // console.log("dateStart : " + dateStartWork);
        // console.log("dateEnd : " + dateEndWork);
        // console.log("placeWork : " + placeWork);
        // console.log("positionWork : " + positionWork);
        // console.log("WorkFile : " + workFile[0].fileName);

        // จัดเตรียมข้อมูลที่จะส่งไปยัง API
        const data = {
            uuid: session?.user?.id,
            projects: projectName.map((name, index) => ({
                name,
                detail: projectDetail[index],
                files: [projectFile[index]],
            })),
            internships: dateStartInternship.map((dateStart, index) => ({
                dateStart,
                dateEnd: dateEndInternship[index],
                place: placeInternship[index],
                position: positionInternship[index],
                files: [internshipFile[index]],
            })),
            workExperience: dateStartWork.map((dateStart, index) => ({
                dateStart,
                dateEnd: dateEndWork[index],
                place: placeWork[index],
                position: positionWork[index],
                files: [workFile[index]],
            })),
        };

        try {
            // ส่งข้อมูลไปยัง API ด้วย fetch
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork`,
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
                    window.location.reload();
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
                    window.location.reload();
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
                window.location.reload();
            });
            setLoader(false);
        }
    }

    //get Default value
    const [dataHistoryWork, setDataHistoryWork] = useState(null);
    const [getProjectName, setGetProjectName] = useState([]);
    const [getProjectDetail, setGetProjectDetail] = useState([]);
    const [getProjectFile, setGetProjectFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);
    const [getDateStartInternship, setGetDateStartInternship] = useState([]);
    const [getDateEndInternship, setGetDateEndInternship] = useState([]);
    const [getPlaceInternship, setGetPlaceInternship] = useState([]);
    const [getPositionInternship, setGetPositionInternship] = useState([]);
    const [getInternshipFile, setGetInternshipFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);
    const [getDateStartWork, setGetDateStartWork] = useState([]);
    const [getDateEndWork, setGetDateEndWork] = useState([]);
    const [getPlaceWork, setGetPlaceWork] = useState([]);
    const [getPositionWork, setGetPositionWork] = useState([]);
    const [getWorkFile, setGetWorkFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);

    useEffect(() => {
        // ถ้าไม่มีข้อมูลใน dataHistoryWork ให้หยุดการทำงานของ useEffect
        if (!dataHistoryWork) return;

        // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
        setGetProjectName(dataHistoryWork.projects?.map(project => project.name) || []);
        setGetProjectDetail(dataHistoryWork.projects?.map(project => project.detail) || []);
        setGetProjectFile(dataHistoryWork.projects?.flatMap(project => project.files) || []);

        setGetDateStartInternship(dataHistoryWork.internships?.map(internship => internship.dateStart) || []);
        setGetDateEndInternship(dataHistoryWork.internships?.map(internship => internship.dateEnd) || []);
        setGetPlaceInternship(dataHistoryWork.internships?.map(internship => internship.place) || []);
        setGetPositionInternship(dataHistoryWork.internships?.map(internship => internship.position) || []);
        setGetInternshipFile(dataHistoryWork.internships?.flatMap(internship => internship.files) || []);

        setGetDateStartWork(dataHistoryWork.workExperience?.map(work => work.dateStart) || []);
        setGetDateEndWork(dataHistoryWork.workExperience?.map(work => work.dateEnd) || []);
        setGetPlaceWork(dataHistoryWork.workExperience?.map(work => work.place) || []);
        setGetPositionWork(dataHistoryWork.workExperience?.map(work => work.position) || []);
        setGetWorkFile(dataHistoryWork.workExperience?.flatMap(work => work.files) || []);

        //set ฟิลด์เริ่มต้น
        if (Array.isArray(dataHistoryWork.projects) && dataHistoryWork.projects.length > 0) {
            setProjects(dataHistoryWork.projects);
        }
        if (Array.isArray(dataHistoryWork.internships) && dataHistoryWork.internships.length > 0) {
            setInternships(dataHistoryWork.internships);
        }
        if (Array.isArray(dataHistoryWork.workExperience) && dataHistoryWork.workExperience.length > 0) {
            setWorks(dataHistoryWork.workExperience);
        }

    }, [dataHistoryWork]);


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
        } finally {
            setLoader(false);
        }
    }


console.log(projects);
console.log(internships);
    return (
        <div className={`${bgColorMain} ${bgColor}`}>
            <NavbarLogo title="ประวัติการทำงาน / ฝึกงาน" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <form onSubmit={handleSubmit} className={`${bgColorMain2} ${bgColor} rounded-lg p-5 flex flex-col gap-10`}>
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
                                                defaultValue={getProjectName[index] || ""}
                                                onBlur={(e) => handleProjectName(e.target.value, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >รายละเอียด</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                defaultValue={getProjectDetail[index] || ""}
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
                                            {(projectFile[index] && projectFile[index]?.fileUrl !== '') || (getProjectFile[index] && getProjectFile[index]?.fileUrl !== '') ? (
                                                <div className={`mt-1 w-fit py-2 flex gap-8`}
                                                >
                                                    <div>
                                                        <p>
                                                            {projectFile[index]?.fileName || getProjectFile[index]?.fileName}.{projectFile[index]?.fileType || getProjectFile[index].fileType}
                                                        </p>
                                                    </div>
                                                    <p className='text-gray-500'>{projectFile[index]?.fileSize || getProjectFile[index]?.fileSize} MB</p>
                                                    <div className='cursor-pointer flex gap-2'>
                                                        {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                                                        <Icon className={` text-black`} path={mdiDownload} size={1} />
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
                        <div>
                            <p className='mb-2'>การฝึกงาน</p>
                            <hr />
                            {internships.map((project, index) => (
                                <div key={index}>
                                    {index > 0 && (
                                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                                            <div
                                                className={` cursor-pointer  rounded-lg w-fit`}
                                                onClick={() => handleRemoveInternship(index)}
                                            >
                                                <Icon className={` text-red-400`} path={mdiCloseCircle} size={1} />
                                            </div>
                                        </div>
                                    )}
                                    <div className='mt-5 flex gap-5 flex-wrap'>
                                        <div className='flex flex-col gap-1'>
                                            <label >ตั้งแต่</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    className={`cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    onBlur={(e) => handleDateStartInternship(e.target.value, index)}
                                                >
                                                    <option value="0">-</option>
                                                    {years.map((year, index) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                                <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >ถึง</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    className={`cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    onBlur={(e) => handleDateEndInternship(e.target.value, index)}
                                                >
                                                    <option value="0">-</option>
                                                    {years.map((year, index) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                                <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >สถานที่ฝึกงาน</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุสถานฝึกงาน"
                                                onBlur={(e) => handlePlaceInternship(e.target.value, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >ตำแหน่ง</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุตำแหน่งที่ฝึกงาน"
                                                onBlur={(e) => handlePositionInternship(e.target.value, index)}
                                            />
                                        </div>
                                        <div className={` ${bgColorMain} flex flex-col gap-1`}>
                                            <label>เอกสารประกอบ</label>
                                            {/* input สำหรับเลือกไฟล์ */}
                                            <input
                                                id="chooseProfile"
                                                type="file"
                                                ref={internFileInputRef} // เชื่อมต่อกับ ref
                                                onChange={(e) => handleInternshipDocument(e, index)}
                                                hidden
                                            />
                                            {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                                            {internshipFile[index] && internshipFile[index].fileUrl !== '' ? (
                                                <div className={`mt-1 w-fit py-2 flex gap-8`}
                                                >
                                                    <div>
                                                        <p>
                                                            {internshipFile[index].fileName}.{internshipFile[index].fileType}
                                                        </p>
                                                    </div>
                                                    <p className='text-gray-500'>{internshipFile[index].fileSize} MB</p>
                                                    <div className='cursor-pointer flex gap-2'>
                                                        {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                                                        <Icon className={` text-black`} path={mdiDownload} size={1} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={openFileDialogInternship} // เรียกใช้ฟังก์ชันเมื่อคลิก
                                                    className="border mt-1 rounded-lg py-2 px-8 text-center bg-gray-300 cursor-pointer"
                                                >
                                                    Choose File
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            ))}
                            {errorFieldInterships && (
                                <div className='mt-3 text-red-500'>
                                    *{errorFieldInterships}
                                </div>
                            )}
                            {projects.length < 5 && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                        onClick={handleAddInterships}
                                    >
                                        <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className='mb-2'>การทำงาน</p>
                            <hr />
                            {works.map((project, index) => (
                                <div key={index}>
                                    {index > 0 && (
                                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                                            <div
                                                className={` cursor-pointer  rounded-lg w-fit`}
                                                onClick={() => handleRemoveWork(index)}
                                            >
                                                <Icon className={` text-red-400`} path={mdiCloseCircle} size={1} />
                                            </div>
                                        </div>
                                    )}
                                    <div className='mt-5 flex gap-5 flex-wrap'>
                                        <div className='flex flex-col gap-1'>
                                            <label >ตั้งแต่</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    className={`cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    onBlur={(e) => handleDateStartWork(e.target.value, index)}
                                                >
                                                    <option value="0">-</option>
                                                    {years.map((year, index) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                                <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >ถึง</label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    className={`cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    onBlur={(e) => handleDateEndWork(e.target.value, index)}
                                                >
                                                    <option value="0">-</option>
                                                    {years.map((year, index) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                                <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >สถานที่ทำงาน</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุสถานที่ทำงาน"
                                                onBlur={(e) => handlePlaceWork(e.target.value, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >ตำแหน่ง</label>
                                            <input
                                                type="text"
                                                className={`mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุตำแหน่งงาน"
                                                onBlur={(e) => handlePositionWork(e.target.value, index)}
                                            />
                                        </div>
                                        <div className={` ${bgColorMain} flex flex-col gap-1`}>
                                            <label>เอกสารประกอบ</label>
                                            {/* input สำหรับเลือกไฟล์ */}
                                            <input
                                                id="chooseProfile"
                                                type="file"
                                                ref={workFileInputRef} // เชื่อมต่อกับ ref
                                                onChange={(e) => handleWorkDocument(e, index)}
                                                hidden
                                            />
                                            {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                                            {workFile[index] && workFile[index].fileUrl !== '' ? (
                                                <div className={`mt-1 w-fit py-2 flex gap-8`}
                                                >
                                                    <div>
                                                        <p>
                                                            {workFile[index].fileName}.{workFile[index].fileType}
                                                        </p>
                                                    </div>
                                                    <p className='text-gray-500'>{workFile[index].fileSize} MB</p>
                                                    <div className='cursor-pointer flex gap-2'>
                                                        {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                                                        <Icon className={` text-black`} path={mdiDownload} size={1} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={openFileDialogWork} // เรียกใช้ฟังก์ชันเมื่อคลิก
                                                    className="border mt-1 rounded-lg py-2 px-8 text-center bg-gray-300 cursor-pointer"
                                                >
                                                    Choose File
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            ))}
                            {errorFieldWorks && (
                                <div className='mt-3 text-red-500'>
                                    *{errorFieldWorks}
                                </div>
                            )}
                            {works.length < 5 && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                        onClick={handleAddWork}
                                    >
                                        <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
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
                                    <div onClick={() => setEditMode(true)} className='hover:cursor-pointer bg-[#ffb74c] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'>
                                        <Icon path={mdiPencil} size={.8} />
                                        <p>แก้ไข</p>
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
