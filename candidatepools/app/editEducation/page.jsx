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
import { mdiAccountEdit, mdiContentSave, mdiArrowDownDropCircle, mdiCloseCircle } from '@mdi/js';

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
    const [file, setFile] = useState([]);
    const [nameFile, setNameFile] = useState([]);
    const [sizeFile, setSizeFile] = useState([]);
    const [nameDocumentUser, setNameDucumentUser] = useState([]);
    const [documentUser, setDucumentUser] = useState([]);

    const [newTypePerson, setNewTypePerson] = useState("");
    const [newSetUniversity, setNewUniversity] = useState("");
    const [newSetCampus, setNewCampus] = useState("");
    const [newSetFaculty, setNewFaculty] = useState("");
    const [newSetBranch, setNewBranch] = useState("");
    const [newSetLevel, setNewLevel] = useState("");
    const [newSetEducationLevel, setNewEducationLevel] = useState("");
    const [newSetGrade, setNewGrade] = useState("");
    const [newSetYearGraduation, setNewYearGraduation] = useState("");
    const [newSetFile, setNewFile] = useState("");
    const [newSetNameFile, setNewNameFile] = useState("");
    const [newSetSizeFile, setNewSizeFile] = useState("");
    const [newSetNameDocumentUser, setNewNameDocumentUser] = useState("");
    const [newSetDocumentUser, setNewDocumentUser] = useState("");


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


    //upload profile
    const [imageUrl, setImageUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputFileRef = useRef(null);

    const openFileDialog = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    function handleDocument(event) {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `users/profile/${session?.user?.email}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    // Error
                    console.error('Error uploading file:', error);
                },
                () => {
                    // Complete
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            setImageUrl(url);
                            setUploadProgress(0); // Reset progress
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                }
            );
        }
    }

    useEffect(() => {
        if (imageUrl) {
            setFile(imageUrl); // Assume setProfile is a function that updates profile state or context
        }

    }, [imageUrl]);

    async function handleSubmit(e) {
        e.preventDefault();

        console.log("typePerson: " + typePerson);
        console.log("university: " + university);
        console.log("campus: " + campus);
        console.log("faculty: " + faculty);
        console.log("branch: " + branch);
        console.log("level: " + level);
        console.log("educationLevel: " + educationLevel);
        console.log("grade: " + grade);
        console.log("yearGraduation: " + yearGraduation);
        console.log("file: " + file);
        console.log("nameFile: " + nameFile);
        console.log("sizeFile: " + sizeFile);
        console.log("nameDocumentUser: " + nameDocumentUser);
        console.log("documentUser: ", documentUser);
    }
    return (
        <div>
            <NavbarLogo dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    <div className=" bg-white rounded-lg p-5">
                        <form onSubmit={handleSubmit} className=" flex gap-x-10 gap-y-5 gap- flex-wrap">
                            <div className=" flex flex-col w-full">
                                <label>ประเภทบุลคล</label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => setNewTypePerson(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-64  border border-gray-400 py-2 px-4 rounded-lg`}
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

                            <div className=" flex flex-col">
                                <label>ระดับชั้น</label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => setNewEducationLevel(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-36  border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                        value={educationLevel || "0"}
                                    >
                                        <option value="0">-</option>
                                        <option value="ปริญญาตรี">ปริญญาตรี</option>
                                        <option value="ปริญญาโท">ปริญญาโท</option>
                                        <option value="ปริญญาเอก">ปริญญาเอก</option>
                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>สถาบันการศึกษา/มหาวิทยาลัย </label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setNewUniversity(e.target.value) }}
                                    defaultValue={university || ""}
                                    readOnly={!editMode}
                                    placeholder="ระบุสถานศึกษา"
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>วิทยาเขต </label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setNewCampus(e.target.value) }}
                                    defaultValue={campus || ""}
                                    readOnly={!editMode}
                                    placeholder="ระบุวิทยาเขตการศึกษา"
                                />
                            </div>


                            <div className="flex col flex-col">
                                <label>คณะ </label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setNewFaculty(e.target.value) }}
                                    defaultValue={faculty || ""}
                                    readOnly={!editMode}
                                    placeholder="คณะที่สังกัด"
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>สาขา </label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setNewBranch(e.target.value) }}
                                    defaultValue={branch || ""}
                                    readOnly={!editMode}
                                    placeholder="สาขาที่สังกัด"
                                />
                            </div>
                            {typePerson === "บัณฑิตพิการ" ? (
                                <div className=" flex flex-col">
                                    <label>ปีที่จบการศึกษา</label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            onChange={(e) => setNewYearGraduation(e.target.value)}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={yearGraduation || "0"}
                                        >
                                            <option value="0">-</option>
                                            {years.map((y, index) => (
                                                <option key={index} value={y}>{y}</option>
                                            ))}
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                            ) : (
                                <div className=" flex flex-col">
                                    <label>ชั้นปี</label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            onChange={(e) => setNewLevel(e.target.value)}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-32  border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={level || "0"}
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
                                    onChange={(e) => { setNewGrade(e.target.value) }}
                                    defaultValue={grade || ""}
                                    readOnly={!editMode}
                                    placeholder="Ex. 3.12"
                                />
                            </div>
                            <hr className="w-full my-3" />
                            <div className="flex col flex-col">
                                <label className="mb-3">เอกสารเพิ่มเติม</label>
                                {editMode && (
                                    <>
                                        <div className="flex gap-5 flex-wrap">
                                            < input
                                                type="text"
                                                className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                                onChange={(e) => { setNewNameDocumentUser(e.target.value) }}
                                                placeholder="ชื่อเอกสาร"
                                                readOnly={!editMode}
                                            />
                                            <div className={`mt-1 flex items-center`}>
                                                <input
                                                    id="chooseProfile"
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
                                            <p><span className="text-red-500 font-bold">ตัวอย่าง</span>&nbsp;&nbsp;&nbsp;&nbsp;หนังสือรับรองผลการเรียน ปีที่ 1</p>
                                            <Icon className={`cursor-pointer text-gray-400 mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="w-full mt-5">
                                <p>ชื่อ</p>
                                <hr className="w-full my-3" />
                                <div className="my-5">
                                    <div className="flex justify-between ">
                                        <p>หนังสือรับรอง</p>
                                        <p>7.5 MB</p>
                                        <div className="flex">
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                    <hr className="w-full my-1" />
                                </div>
                                <div className="my-5">
                                    <div className="flex justify-between ">
                                        <p>หนังสือรับรอง</p>
                                        <p>7.5 MB</p>
                                        <div className="flex">
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                            <Icon className={`cursor-pointer text-gray-40 mx-1`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                    <hr className="w-full my-1" />
                                </div>
                            </div>

                            {editMode ? (
                                <div className="flex gap-10 w-full justify-center mt-10">
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
