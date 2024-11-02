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
import { mdiAttachment, mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js'
import Swal from "sweetalert2";

//firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { storage } from '@/app/firebaseConfig';
import { saveAs } from 'file-saver';

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
            getDataSkill(session.user.id);
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
        inputGrayColor,
        setInputGrayColor,
        inputTextColor
    } = useTheme();

    //Mode
    const [editMode, setEditMode] = useState(false);

    //add data
    const [skillType, setSkillType] = useState([]);
    const [skillName, setSkillName] = useState([]);
    const [skillDetail, setSkillDetail] = useState([]);
    const [getSkillType, setGetSkillType] = useState([]);
    const [getSkillName, setGetSkillName] = useState([]);
    const [getSkillDetail, setGetSkillDetail] = useState([]);

    const handleSkillType = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setSkillType((prevTemp) => {
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

    const handleSkillName = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setSkillName((prevTemp) => {
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

    const handleSkillDetail = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setSkillDetail((prevTemp) => {
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

    //config field
    const [skills, setSkills] = useState([{}]);
    const [errorFieldSkill, setErrorFieldSkill] = useState('')

    const handleAddSkill = () => {
        // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล skill ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
        if ((!skillType[skills.length - 1] || !skillName[skills.length - 1] || !skillDetail[skills.length - 1])
            &&
            (!getSkillType[skills.length - 1] || !getSkillName[skills.length - 1] || !getSkillDetail[skills.length - 1])) {
            setErrorFieldSkill("กรุณากรอกข้อมูลทักษะให้ครบก่อนเพิ่มข้อมูลใหม่");
            return;
        }

        // จำกัดจำนวนทักษะไม่ให้เกิน 5 รายการ
        if (skills.length >= 5) {
            setErrorFieldSkill("");
            return;
        }

        setErrorFieldSkill("");
        setSkills([...skills, {}]); // เพิ่มออบเจกต์ว่างใน skills
    };

    const handleRemoveSkill = (index) => {
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
                const newSkills = [...skills];
                newSkills.splice(index, 1);
                setSkills(newSkills);

                const temp = index;

                setErrorFieldSkill("");

                // ลบข้อมูลจาก skillType, skillName, และ skillDetail
                setSkillType((prev) => prev.filter((_, i) => i !== temp));
                setSkillName((prev) => prev.filter((_, i) => i !== temp));
                setSkillDetail((prev) => prev.filter((_, i) => i !== temp));

                // ลบข้อมูลจาก getSkillType, getSkillName, และ getSkillDetail
                setGetSkillType((prev) => prev.filter((_, i) => i !== temp));
                setGetSkillName((prev) => prev.filter((_, i) => i !== temp));
                setGetSkillDetail((prev) => prev.filter((_, i) => i !== temp));
            }
        });
    };

    //data train
    const [trainName, setTrainName] = useState([]);
    const [trainDetail, setTrainDetail] = useState([]);
    const [trainFile, setTrainFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);
    const [getTrainName, setGetTrainName] = useState([]);
    const [getTrainDetail, setGetTrainDetail] = useState([]);
    const [getTrainFile, setGetTrainFile] = useState([{
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileSize: '',
    }]);

    const handleTrainName = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setTrainName((prevTemp) => {
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

    const handleTrainDetail = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setTrainDetail((prevTemp) => {
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


    //config field
    const [trains, setTrains] = useState([{}]);
    const [errorFieldTrain, setErrorFieldTrain] = useState('')

    const handleAddTrain = () => {
        // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล train ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
        if ((!trainName[trains.length - 1]
            || !trainDetail[trains.length - 1])
            &&
            (!getTrainName[trains.length - 1]
                || !getTrainDetail[trains.length - 1])) {
            setErrorFieldTrain("กรุณากรอกข้อมูลการอบรมให้ครบก่อนเพิ่มข้อมูลใหม่");
            return;
        }

        // จำกัดจำนวน train ไม่ให้เกิน 5 รายการ
        if (trains.length >= 5) {
            setErrorFieldTrain("");
            return;
        }

        setErrorFieldTrain("");
        setTrains([...trains, {}]); // เพิ่มออบเจกต์ว่างใน trains
    };

    const handleRemoveTrain = (index) => {
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
                const newTrains = [...trains];
                newTrains.splice(index, 1);
                setTrains(newTrains);

                const temp = index;

                setErrorFieldTrain("");

                // ลบข้อมูลจาก trainName, trainDetail, และ trainFile
                setTrainName((prev) => prev.filter((_, i) => i !== temp));
                setTrainDetail((prev) => prev.filter((_, i) => i !== temp));
                setTrainFile((prev) => prev.filter((_, i) => i !== temp));

                // ลบข้อมูลจาก getTrainName, getTrainDetail, และ getTrainFile
                setGetTrainName((prev) => prev.filter((_, i) => i !== temp));
                setGetTrainDetail((prev) => prev.filter((_, i) => i !== temp));
                setGetTrainFile((prev) => prev.filter((_, i) => i !== temp));
            }
        });
    };


    //upload file
    const trainFileInputRef = useRef(null);
    const [trainUploadProgress, setTrainUploadProgress] = useState(0);
    // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
    const openFileDialogTrain = () => {
        if (trainFileInputRef.current) {
            trainFileInputRef.current.click();
        }
    };

    const handleTrainDocument = (event, index) => {
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

            // ใช้ชื่อไฟล์ที่กำหนดเอง
            const fileName = selectedFile.name.split('.').slice(0, -1).join('.');

            const storageRef = ref(storage, `users/documents/trainHistory/${session?.user?.email}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    setError(""); // รีเซ็ตข้อความข้อผิดพลาด
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setTrainUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
                },
                (error) => {
                    setLoader(false);
                    console.error('Error uploading file:', error);
                },
                () => {
                    // เมื่ออัปโหลดเสร็จสิ้น
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ trainFile
                            const newTrainFile = {
                                fileName: fileName,
                                fileType: fileExtension,
                                fileUrl: url,
                                fileSize: fileSizeMB,
                            };

                            setTrainFile((prevTrainFiles) => {
                                const updatedTrainFiles = [...prevTrainFiles];
                                updatedTrainFiles[index] = newTrainFile; // อัปเดตตำแหน่งที่ index
                                return updatedTrainFiles;
                            });
                            // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
                            setTrainUploadProgress(0);
                            trainFileInputRef.current.value = '';
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

    //hadle array
    function mergeArrayValues(nonGetArray, getArray) {
        // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
        if (nonGetArray.length === 0) {
            return getArray;
        }

        if (nonGetArray.length > getArray.length) {
            return nonGetArray.map((value, index) => {
                return (value ?? getArray[index]) || '';
            });
        } else {
            return getArray.map((value, index) => {
                return (nonGetArray[index] ?? value) || '';
            });
        }
    }
    function mergeArrayObjects(nonGetArray, getArray) {
        const maxLength = Math.max(nonGetArray.length, getArray.length);

        return Array.from({ length: maxLength }, (_, index) => {
            const nonGetItem = nonGetArray[index] || {}; // ใช้ค่าจาก nonGetArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง
            const getItem = getArray[index] || {};       // ใช้ค่าจาก getArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง

            // รวมค่าในตำแหน่งเดียวกันจากทั้งสองอาร์เรย์ โดยให้ข้อมูลที่มีค่าจริงจาก nonGetItem มีความสำคัญกว่า getItem
            return {
                fileName: nonGetItem.fileName || getItem.fileName || "",
                fileSize: nonGetItem.fileSize || getItem.fileSize || "",
                fileType: nonGetItem.fileType || getItem.fileType || "",
                fileUrl: nonGetItem.fileUrl || getItem.fileUrl || "",
                _id: nonGetItem._id || getItem._id || "",
            };
        });
    }

    //function submit
    async function handleSubmit(e, fieldSkills, fieldTrains) {
        e.preventDefault();

        setLoader(false);

        const mergedSkillType = mergeArrayValues(skillType, getSkillType);
        const mergedSkillName = mergeArrayValues(skillName, getSkillName);
        const mergedSkillDetail = mergeArrayValues(skillDetail, getSkillDetail);

        const mergedTrainName = mergeArrayValues(trainName, getTrainName);
        const mergedTrainDetail = mergeArrayValues(trainDetail, getTrainDetail);
        const mergedTrainFile = mergeArrayObjects(trainFile, getTrainFile);

        // ลดค่าตัวนับของแต่ละฟิลด์ลง 1
        fieldSkills -= 1;
        fieldTrains -= 1;

        // ตรวจสอบข้อมูลโครงงาน / ผลงาน
        const hasAnySkillField =
            mergedSkillType[fieldSkills] ||
            mergedSkillName[fieldSkills] ||
            mergedSkillDetail[fieldSkills];

        const isSkillFieldComplete =
            mergedSkillType[fieldSkills] &&
            mergedSkillName[fieldSkills] &&
            mergedSkillDetail[fieldSkills];

        if (hasAnySkillField && !isSkillFieldComplete) {
            setError("กรุณาระบุข้อมูล ความสามารถ ให้ครบทุกช่อง");
            setLoader(false);
            return;
        }

        const hasAnyTrainField =
            mergedTrainName[fieldTrains] ||
            mergedTrainDetail[fieldTrains];

        const isTrainFieldComplete =
            mergedTrainName[fieldTrains] &&
            mergedTrainDetail[fieldTrains];

        // ตรวจสอบข้อมูลการฝึกงาน
        if (hasAnyTrainField && !isTrainFieldComplete) {
            setError("กรุณาระบุข้อมูล การอบรม ให้ครบทุกช่อง");
            setLoader(false);
            return;
        }

        const hasAnyField = hasAnySkillField || hasAnyTrainField;
        // หากไม่มีข้อมูลเลยในทุกส่วน
        if (!hasAnyField) {
            setError("ไม่มีข้อมูลที่บันทึก");
            setLoader(false);
            return;
        }

        // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
        setError('');

        // จัดเตรียมข้อมูลที่จะส่งไปยัง API
        const data = {
            uuid: session?.user?.id,
            skills: mergedSkillName.map((name, index) => ({
                type: mergedSkillType[index],
                name,
                detail: mergedSkillDetail[index],
            })),
            trains: mergedTrainName.map((name, index) => ({
                name,
                detail: mergedTrainDetail[index],
                files: [
                    {
                        fileName: mergedTrainFile[index].fileName || "",
                        fileType: mergedTrainFile[index].fileType || "",
                        fileUrl: mergedTrainFile[index].fileUrl || "",
                        fileSize: mergedTrainFile[index].fileSize || "",
                    }
                ]
            })),
        };

        try {
            // ส่งข้อมูลไปยัง API ด้วย fetch
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/skill`,
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

    //set default value 
    const [dataSkills, setDataSkills] = useState([]);
    useEffect(() => {
        if (!dataSkills) return;

        // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
        setGetSkillType(dataSkills.skills?.map(skill => skill.type) || []);
        setGetSkillName(dataSkills.skills?.map(skill => skill.name) || []);
        setGetSkillDetail(dataSkills.skills?.map(skill => skill.detail) || []);

        setGetTrainName(dataSkills.trains?.map(train => train.name) || []);
        setGetTrainDetail(dataSkills.trains?.map(train => train.detail) || []);
        setGetTrainFile(dataSkills.trains?.flatMap(train => train.files) || []);

        // set ฟิลด์เริ่มต้น
        if (Array.isArray(dataSkills.skills) && dataSkills.skills.length > 0) {
            setSkills(dataSkills.skills);
        }
        if (Array.isArray(dataSkills.trains) && dataSkills.trains.length > 0) {
            setTrains(dataSkills.trains);
        }

    }, [dataSkills]);


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
        } finally {
            setLoader(false);
        }
    }

    //Download file
    const handleDownloadFile = async (filePath, fileName) => {
        const storage = getStorage();
        const fileRef = ref(storage, filePath);

        try {
            // ดึง URL ของไฟล์
            const downloadURL = await getDownloadURL(fileRef);

            // ใช้ fetch เพื่อดาวน์โหลดไฟล์
            const response = await fetch(downloadURL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob(); // แปลงเป็น Blob
            saveAs(blob, fileName); // ใช้ file-saver เพื่อดาวน์โหลดไฟล์
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
        }
    };

    //openfile
    function openFile(fileUrl) {
        window.open(fileUrl, '_blank');
    }

    //deleteFile
    async function handleDeleteFile(name, index) {
        const result = await Swal.fire({
            title: "ลบข้อมูล",
            text: `คุณต้องการลบไฟล์ ${name}?`,
            icon: "warning",
            confirmButtonText: "ใช่",
            confirmButtonColor: "#f27474",
            showCancelButton: true,
            cancelButtonText: "ไม่"
        });

        const mergedTrainFile = mergeArrayObjects(trainFile, getTrainFile);

        if (result.isConfirmed) {
            const updatedTrainFiles = [...mergedTrainFile];
            updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

            setTrainFile(updatedTrainFiles);
            setGetTrainFile(updatedTrainFiles);
            Swal.fire("ลบไฟล์สำเร็จ", `${name} ถูกลบเรียบร้อยแล้ว`, "success");
        }
    }

    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
            <NavbarLogo title="ความสามารถ / การอบรม" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    {/* <div className={`bg-white rounded-lg p-5`}> */}
                    <form onSubmit={(e) => handleSubmit(e, skills.length, trains.length)} className={`${bgColorMain2} ${bgColor} rounded-lg p-5 flex flex-col gap-16`}>
                        <div>
                            <p className='mb-2'>ความสามารถ</p>
                            <hr />
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    {index > 0 && editMode && (
                                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                                            <div
                                                className={` cursor-pointer  rounded-lg w-fit`}
                                                onClick={() => handleRemoveSkill(index)}
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
                                            <label >ทักษะที่มี <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                            <div className="relative col w-fit mt-1">
                                                <select
                                                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                                    style={{ appearance: 'none' }}
                                                    onChange={(e) => handleSkillType(e.target.value, index)}
                                                    value={skillType[index] || getSkillType[index] || ""}
                                                    disabled={!editMode}
                                                >
                                                    <option value="0">-</option>
                                                    <option value="LowSkill">Low Skill</option>
                                                    <option value="MediumSkill">Medium Skill</option>
                                                    <option value="HardSkill">Hard Skill</option>
                                                </select>
                                                <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label >ทักษะ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                            <input
                                                type="text"
                                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                readOnly={!editMode}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                defaultValue={getSkillName[index] || ""}
                                                onBlur={(e) => handleSkillName(e.target.value, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >อธิบายรายละเอียด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                            <input
                                                type="text"
                                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain}  mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                readOnly={!editMode}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                defaultValue={getSkillDetail[index] || ""}
                                                onBlur={(e) => handleSkillDetail(e.target.value, index)}
                                            />
                                        </div>

                                    </div>

                                </div>

                            ))}
                            {errorFieldSkill && (
                                <div className='mt-3 text-red-500'>
                                    *{errorFieldSkill}
                                </div>
                            )}
                            {skills.length < 5 && editMode && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                        onClick={handleAddSkill}
                                    >
                                        <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className='mb-2'>การอบรม</p>
                            <hr />
                            {trains.map((train, index) => (
                                <div key={index}>
                                    {index > 0 && editMode && (
                                        <div className={` flex col flex-col justify-end w-full mt-5`}>
                                            <div
                                                className={` cursor-pointer  rounded-lg w-fit`}
                                                onClick={() => handleRemoveTrain(index)}
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
                                            <label >เรื่อง <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                            <input
                                                type="text"
                                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="ระบุชื่อเรื่องการอบรม"
                                                onBlur={(e) => handleTrainName(e.target.value, index)}
                                                defaultValue={getTrainName[index] || ""}
                                                readOnly={!editMode}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label >รายละเอียด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                                            <input
                                                type="text"
                                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                                placeholder="รายละเอียดเพิ่มเติม"
                                                onBlur={(e) => handleTrainDetail(e.target.value, index)}
                                                defaultValue={getTrainDetail[index] || ""}
                                                readOnly={!editMode}
                                            />
                                        </div>
                                        <div className={` ${bgColorMain} flex flex-col gap-1`}>
                                            {trainFile[index]?.fileUrl || getTrainFile[index]?.fileUrl || editMode ? (
                                                <label>เอกสารประกอบ / ใบประกาศ</label>
                                            ) : null}
                                            {/* input สำหรับเลือกไฟล์ */}

                                            {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                                            {(trainFile[index] && trainFile[index]?.fileUrl !== '') || (getTrainFile[index] && getTrainFile[index]?.fileUrl !== '') ? (
                                                <div className={`mt-1 w-fit py-2 flex gap-8`}
                                                >
                                                    <div className='cursor-pointer' onClick={() => openFile(trainFile[index]?.fileUrl || getTrainFile[index]?.fileUrl)}>
                                                        <p>
                                                            {trainFile[index]?.fileName || getTrainFile[index]?.fileName}.{trainFile[index]?.fileType || getTrainFile[index].fileType}
                                                        </p>
                                                    </div>
                                                    <p className='text-gray-500'>{trainFile[index]?.fileSize || getTrainFile[index]?.fileSize} MB</p>
                                                    <div className='cursor-pointer flex gap-2'>
                                                        <Icon
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    trainFile[index]?.fileUrl || getTrainFile[index]?.fileUrl,
                                                                    trainFile[index]?.fileName || getTrainFile[index]?.fileName
                                                                )
                                                            }
                                                            className="text-black"
                                                            path={mdiDownload}
                                                            size={1}
                                                        />
                                                        {editMode && (
                                                            <Icon
                                                                onClick={() => handleDeleteFile(trainFile[index]?.fileName || getTrainFile[index]?.fileName, index)}
                                                                className={` text-black`}
                                                                path={mdiDelete}
                                                                size={1}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                editMode && (
                                                    <div
                                                        onClick={editMode ? openFileDialogTrain : undefined} // เรียกใช้ฟังก์ชันเมื่อ editMode เป็น true
                                                        // className={`border mt-1 rounded-lg py-2 px-8 text-center ${editMode ? 'bg-gray-300 cursor-pointer' : 'bg-gray-100 cursor-not-allowed'
                                                        //     }`}
                                                        className={`border mt-1 rounded-lg py-2 px-8 text-center ${inputEditColor} ${editMode ? ' cursor-pointer' : ' cursor-not-allowed'
                                                            }`}
                                                        style={{ pointerEvents: editMode ? 'auto' : 'none' }} // ปิดการคลิกเมื่อ editMode เป็น false
                                                    >
                                                        <input
                                                            id="chooseTrainFile"
                                                            type="file"
                                                            ref={trainFileInputRef} // เชื่อมต่อกับ ref
                                                            onChange={(e) => handleTrainDocument(e, index)}
                                                            hidden
                                                        />
                                                        Choose File
                                                    </div>
                                                )

                                            )}

                                        </div>
                                    </div>

                                </div>

                            ))}
                            {errorFieldTrain && (
                                <div className='mt-3 text-red-500'>
                                    *{errorFieldTrain}
                                </div>
                            )}
                            {trains.length < 5 && editMode && (
                                <div className={` flex col flex-col justify-end w-full mt-5`}>
                                    <div
                                        className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                        onClick={handleAddTrain}
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
