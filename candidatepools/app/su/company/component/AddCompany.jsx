"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from "@/app/ThemeContext";
import Icon from '@mdi/react'
import { mdiAttachment, mdiPlus, mdiCloseCircle, mdiDownload, mdiArrowDownDropCircle, mdiPencil, mdiContentSave, mdiDelete } from '@mdi/js'
import Swal from "sweetalert2";
import useProvinceData from '@/app/components/province';
import dataWorkType from '@/assets/dataWorkType'
import dates from '@/app/data/date.json'

//firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { storage } from '@/app/firebaseConfig';
import { saveAs } from 'file-saver';


function AddCompany({ setAddCompany, dataUse, setLoader }) {
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

    //address data
    const [addressIdCard, setAddressIdCard] = useState(null);
    const [addressIdCardProvince, setAddressIdCardProvince] = useState(null);
    const [addressIdCardAmphor, setAddressIdCardAmphor] = useState(null);
    const [addressIdCardTambon, setAddressIdCardTambon] = useState(null);
    const [addressIdCardZipCode, setAddressIdCardZipCode] = useState(null);
    const [getAddressIdCard, setGetAddressIdCard] = useState("");
    const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
    const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
    const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");
    const [getAddressIdCardProvince, setGetAddressIdCardProvince] = useState("");
    const [getAddressIdCardAmphor, setGetAddressIdCardAmphor] = useState("");
    const [getAddressIdCardTambon, setGetAddressIdCardTambon] = useState("");
    const [getAddressIdCardZipCode, setGetAddressIdCardZipCode] = useState("");
    const dataProvince = useProvinceData();

    const [error, setError] = useState('')

    //dataCompany
    const [dataCompany, setDataCompany] = useState([])
    //worktype
    const [workType, setWorkType] = useState('');
    const [workDetail, setWorkDetail] = useState('');
    const [getWorkType, setGetWorkType] = useState('');
    const [getWorkDetail, setGetWorkDetail] = useState('');

    //dateWork
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [getDateStart, setGetDateStart] = useState('');
    const [getDateEnd, setGetDateEnd] = useState('');


    //time
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [getTimeStart, setGetTimeStart] = useState('');
    const [getTimeEnd, setGetTimeEnd] = useState('');

    //welfare
    const [welfare, setWelfare] = useState([])
    const [getWelfare, setGetWelfare] = useState([])

    const handleGetArray = (e, index) => {
        const newTemp = e; // ค่าที่ได้รับจาก input
        setWelfare((prevTemp) => {
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
    useEffect(() => {
        // if (!dataCompany) return;

        // // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
        // setGetSkillType(dataCompany.fieldwalfare?.map(skill => skill.type) || []);
        // setGetSkillName(dataCompany.fieldwalfare?.map(skill => skill.name) || []);
        // setGetSkillDetail(dataCompany.fieldwalfare?.map(skill => skill.detail) || []);

        // setGetTrainName(dataCompany.trains?.map(train => train.name) || []);
        // setGetTrainDetail(dataCompany.trains?.map(train => train.detail) || []);
        // setGetTrainFile(dataCompany.trains?.flatMap(train => train.files) || []);

        // set ฟิลด์เริ่มต้น
        if (Array.isArray(dataCompany.fieldwalfare) && dataCompany.fieldwalfare.length > 0) {
            setGetFieldwalfare(dataCompany.fieldwalfare);
        }
    }, [dataCompany]);

    const [fieldwalfare, setGetFieldwalfare] = useState([{}]);
    const [errorFieldWalfare, setErrorFieldWalfare] = useState('')
    const handleAddField = () => {
        // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล skill ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
        if ((!welfare[fieldwalfare.length - 1])
            &&
            (!getWelfare[fieldwalfare.length - 1])) {
            setErrorFieldWalfare("กรุณากรอกข้อมูลทักษะให้ครบก่อนเพิ่มข้อมูลใหม่");
            return;
        }

        setErrorFieldWalfare("");
        setGetFieldwalfare([...fieldwalfare, {}]); // เพิ่มออบเจกต์ว่างใน fieldwalfare
    };

    const handleRemoveField = (index) => {
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
                const newSkills = [...fieldwalfare];
                newSkills.splice(index, 1);
                setGetFieldwalfare(newSkills);

                const temp = index;

                setErrorFieldWalfare("");

                // ลบข้อมูลจาก skillType, skillName, และ skillDetail
                setWelfare((prev) => prev.filter((_, i) => i !== temp));
                setGetWelfare((prev) => prev.filter((_, i) => i !== temp));

            }
        });
    };

    //Coordinator
    const [coordinator, setCoordinator] = useState('')
    const [getCoordinator, setGetCoordinator] = useState('')
    const [telCoordinator, setTelCoordinator] = useState('')
    const [getTetCoordinator, setGetTelCoordinator] = useState('')

    //name company
    const [nameCompany, setNameCompany] = useState('')
    const [getNameCompany, setGetNameCompany] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();

        setLoader(true);
        if (!nameCompany || !addressIdCard || !addressIdCardProvince || !addressIdCardAmphor || !addressIdCardTambon || !addressIdCardZipCode ||
            !dateStart || !dateEnd || !timeStart || !timeEnd || !welfare || !coordinator || !telCoordinator) {
            setError('กรุณกรอกข้อมูลให้ครบทุกช่อง');
            setLoader(false);
            return;
        }

        // console.log("nameCompany: ", nameCompany)
        // console.log("address: ", addressIdCard)
        // console.log("province: ", addressIdCardProvince)
        // console.log("amphor: ", addressIdCardAmphor)
        // console.log("tambon: ", addressIdCardTambon)
        // console.log("zipcode: ", addressIdCardZipCode)
        // console.log("dateStart: ", dateStart)
        // console.log("dateEnd: ", dateEnd)
        // console.log("timeStart: ", timeStart)
        // console.log("timeEnd: ", timeEnd)
        // console.log("welfare: ", welfare)
        // console.log("coordinator: ", coordinator)
        // console.log("tel coordinator: ", telCoordinator)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/company`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nameCompany: nameCompany,
                        address: addressIdCard,
                        province: addressIdCardProvince,
                        amphor: addressIdCardAmphor,
                        tambon: addressIdCardTambon,
                        zipcode: addressIdCardZipCode,
                        work_type: workType,
                        work_detail: workDetail,
                        date_start: dateStart,
                        date_end: dateEnd,
                        time_start: timeStart,
                        time_end: timeEnd,
                        welfare: welfare,
                        coordinator: coordinator,
                        coordinator_tel: telCoordinator
                    }),
                }
            )

            if (!res.ok) {
                setLoader(false);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                }).then(() => {
                    setAddCompany(false);
                    setError('')
                });
                setLoader(false);
                return;
            }
            setLoader(false);
            Swal.fire({
                title: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#0d96f8",
            }).then(() => {
                setAddCompany(false);
                window.location.reload();
                setError('')
            });
        
            setLoader(false);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='mt-5'>
            <form onSubmit={handleSubmit} className={`${bgColorMain2} ${bgColor} rounded-lg flex flex-col gap-7`}>
                <div className='flex gap-y-5 gap-x-10 flex-wrap'>
                    <div className='flex flex-col gap-1'>
                        <label >ชื่อบริษัท <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            type="text"
                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                            readOnly={!editMode}
                            placeholder="ตัวอย่าง: บริษัทเฟรนลี่เดฟ จำกัด"
                            onChange={(e) => setNameCompany(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
                        <div className="flex col flex-col">
                            <label>
                                ที่ตั้ง{" "}
                                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <input
                                type="text"
                                className={` ${!editMode
                                    ? `${inputEditColor} cursor-default focus:outline-none`
                                    : ""
                                    } ${bgColorMain} w-96 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                onChange={(e) => {
                                    setAddressIdCard(e.target.value);
                                }}
                                defaultValue={getAddressIdCard || ""}
                                placeholder={`สถานที่ใกล้สถานีรถไฟฟ้า พหลโยธิน 59`}
                                readOnly={!editMode}
                            />
                        </div>
                        <div className=" flex flex-col ">
                            <label>
                                จังหวัด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <div className="relative col w-fit mt-1">
                                <select
                                    onChange={(e) => {
                                        setIDAddressIdCardProvince(e.target.value);
                                        setIDAddressIdCardAmphor("");
                                        setIDAddressIdCardTambon("");
                                        setAddressIdCardAmphor("");
                                        setAddressIdCardTambon("");
                                        setAddressIdCardZipCode("");
                                        setAddressIdCardProvince(
                                            dataProvince.find(
                                                (p) => p.id === parseInt(e.target.value)
                                            ).name_th
                                        );
                                    }}
                                    className={`${!editMode
                                        ? `${inputEditColor} cursor-default`
                                        : `${bgColorMain} cursor-pointer`
                                        } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                    style={{ appearance: "none" }}
                                    disabled={!editMode}
                                    value={
                                        dataProvince.find(
                                            (p) => p.id === parseInt(IDaddressIdCardProvince)
                                        )?.id || "0"
                                    }
                                >
                                    <option value="0">-</option>
                                    {dataProvince.map((d, index) => (
                                        <option key={index} value={d.id}>
                                            {d.name_th}
                                        </option>
                                    ))}
                                </select>
                                <Icon
                                    className={`${!editMode ? "hidden" : ""
                                        } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                    path={mdiArrowDownDropCircle}
                                    size={0.8}
                                />
                            </div>
                        </div>
                        {IDaddressIdCardProvince ? (
                            <div className=" flex flex-col">
                                <label>
                                    อำเภอ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                                </label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => {
                                            setIDAddressIdCardAmphor(e.target.value);
                                            setIDAddressIdCardTambon("");
                                            setAddressIdCardTambon("");
                                            setAddressIdCardZipCode("");
                                            setAddressIdCardAmphor(
                                                dataProvince
                                                    .find(
                                                        (p) =>
                                                            p.id === parseInt(IDaddressIdCardProvince)
                                                    )
                                                    .amphure.find(
                                                        (a) => a.id === parseInt(e.target.value)
                                                    ).name_th
                                            );
                                        }}
                                        className={`${!editMode
                                            ? `${inputEditColor} cursor-default`
                                            : `${bgColorMain} cursor-pointer`
                                            } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: "none" }}
                                        disabled={!editMode}
                                        value={
                                            dataProvince
                                                .find(
                                                    (p) => p.id === parseInt(IDaddressIdCardProvince)
                                                )
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                                                )?.id || "0"
                                        }
                                    >
                                        <option value="0">-</option>
                                        {dataProvince
                                            .find(
                                                (p) => p.id === parseInt(IDaddressIdCardProvince)
                                            )
                                            .amphure.map((d, index) => (
                                                <option key={index} value={d.id}>
                                                    {d.name_th}
                                                </option>
                                            ))}
                                    </select>
                                    <Icon
                                        className={`${!editMode ? "hidden" : ""
                                            } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                        path={mdiArrowDownDropCircle}
                                        size={0.8}
                                    />
                                </div>
                            </div>
                        ) : null}
                        {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
                            <div className=" flex flex-col">
                                <label>
                                    ตำบล <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                                </label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => {
                                            setIDAddressIdCardTambon(e.target.value);
                                            setAddressIdCardTambon(
                                                dataProvince
                                                    .find(
                                                        (p) =>
                                                            p.id === parseInt(IDaddressIdCardProvince)
                                                    )
                                                    .amphure.find(
                                                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                                                    )
                                                    .tambon.find(
                                                        (t) => t.id === parseInt(e.target.value)
                                                    ).name_th
                                            );
                                            setAddressIdCardZipCode(
                                                dataProvince
                                                    .find(
                                                        (p) =>
                                                            p.id === parseInt(IDaddressIdCardProvince)
                                                    )
                                                    .amphure.find(
                                                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                                                    )
                                                    .tambon.find(
                                                        (t) => t.id === parseInt(e.target.value)
                                                    ).zip_code
                                            );
                                        }}
                                        className={`${!editMode
                                            ? `${inputEditColor} cursor-default`
                                            : `${bgColorMain} cursor-pointer`
                                            } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: "none" }}
                                        disabled={!editMode}
                                        value={
                                            dataProvince
                                                .find(
                                                    (p) => p.id === parseInt(IDaddressIdCardProvince)
                                                )
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                                                )
                                                .tambon.find(
                                                    (t) => t.id === parseInt(IDaddressIdCardTambon)
                                                )?.id || "0"
                                        }
                                    >
                                        <option value="0">-</option>
                                        {dataProvince
                                            .find(
                                                (p) => p.id === parseInt(IDaddressIdCardProvince)
                                            )
                                            .amphure.find(
                                                (a) => a.id === parseInt(IDaddressIdCardAmphor)
                                            )
                                            .tambon.map((d, index) => (
                                                <option key={index} value={d.id}>
                                                    {d.name_th}
                                                </option>
                                            ))}
                                    </select>
                                    <Icon
                                        className={`${!editMode ? "hidden" : ""
                                            } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                        path={mdiArrowDownDropCircle}
                                        size={0.8}
                                    />
                                </div>
                            </div>
                        ) : null}
                        {IDaddressIdCardProvince &&
                            IDaddressIdCardAmphor &&
                            IDaddressIdCardTambon ? (
                            <div className=" flex flex-col ">
                                <label>
                                    รหัสไปรษณีย์ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                                </label>
                                <div className=" col w-fit mt-1">
                                    <p
                                        className={`${inputEditColor}  focus:outline-none cursor-default w-36 ${bgColorMain}  border border-gray-400 py-2 px-4 rounded-lg`}
                                    >
                                        {addressIdCardZipCode || "-"}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label >ประเภทงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <div className="relative col w-fit mt-1">
                            <select
                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                style={{ appearance: 'none' }}
                                onChange={(e) => setWorkType(e.target.value)}
                                value={workType || getWorkType || ""}
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
                        <label >รายละเอียดเกี่ยวกับงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            type="text"
                            className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                            readOnly={!editMode}
                            placeholder="ระบุรายละเอียด"
                            onChange={((e) => setWorkDetail(e.target.value))}
                        />
                    </div>
                    <div className='flex gap-x-10 gap-y-5 '>
                        <div className='flex flex-col gap-1'>
                            <label >วันที่ทำงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                            <div className='flex items-center gap-x-3'>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        onChange={(e) => setDateStart(e.target.value)}
                                        value={dateStart || getDateStart || ""}
                                        disabled={!editMode}
                                    >
                                        <option value="0">-</option>
                                        {dates.map((date, index) => (
                                            <option key={index} value={date}>{date}</option>
                                        ))}
                                    </select>
                                    <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                                <p>ถึง</p>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        onChange={(e) => setDateEnd(e.target.value)}
                                        value={dateEnd || getDateEnd || ""}
                                        disabled={!editMode}
                                    >
                                        <option value="0">-</option>
                                        {dates.map((date, index) => (
                                            <option key={index} value={date}>{date}</option>
                                        ))}
                                    </select>
                                    <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-x-10 gap-y-5 '>
                        <div className='flex flex-col gap-1'>
                            <label >เวลาทำงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                            <div className='flex items-center gap-x-3'>
                                <div className="relative col w-fit mt-1">
                                    <input
                                        type="time"
                                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        readOnly={!editMode}
                                        placeholder="เวลาเริ่ม"
                                        onChange={(e) => setTimeStart(e.target.value)}
                                        defaultValue={timeStart || getTimeStart || ""}
                                    />
                                </div>
                                <p>ถึง</p>
                                <div className="relative col w-fit mt-1">
                                    <input
                                        type="time"
                                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        readOnly={!editMode}
                                        placeholder="เวลาเลิก"
                                        onChange={(e) => setTimeEnd(e.target.value)}
                                        defaultValue={timeEnd || getTimeEnd || ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <label >สวัสดีการ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        {fieldwalfare.map((skill, index) => (
                            <div key={index} className=''>
                                <div className='flex-col'>
                                    {index > 0 && !editMode && (
                                        <hr className='mt-5' />
                                    )}
                                    <div className='mt-2 flex gap-5 flex-wrap '>
                                        <div className='flex gap-5 items-center'>
                                            <input
                                                type="text"
                                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain}  mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg`}
                                                readOnly={!editMode}
                                                placeholder="ตัวอย่าง: ค่าเดินทาง, ค่าอาหารกลางวัน, ..."
                                                defaultValue={getWelfare[index] || ""}
                                                onBlur={(e) => handleGetArray(e.target.value, index)}
                                            />
                                            {index > 0 && editMode && (
                                                <div className={``}>
                                                    <div
                                                        className={` cursor-pointer rounded-lg`}
                                                        onClick={() => handleRemoveField(index)}
                                                    >
                                                        <Icon className={` text-red-500`} path={mdiCloseCircle} size={1} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {errorFieldWalfare && (
                            <div className='mt-3 text-red-500'>
                                *{errorFieldWalfare}
                            </div>
                        )}
                        {fieldwalfare.length < 10 && editMode && (
                            <div className={`mt-2`}>
                                <div
                                    className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                                    onClick={handleAddField}
                                >
                                    <Icon className={` text-white mx-3`} path={mdiPlus} size={1} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='w-full flex flex-wrap gap-y-5 gap-x-10'>
                        <div className='flex flex-col gap-1'>
                            <label >ผู้ประสานงาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                            <input
                                type="text"
                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                                readOnly={!editMode}
                                placeholder="ตัวอย่าง: คุณสมชาย มานะ"
                                onChange={(e) => setCoordinator(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label >เบอร์ติดต่อ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="\d{10}"
                                maxLength={10}
                                className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} mt-1 w-64 border border-gray-400 py-2 px-4 rounded-lg`}
                                readOnly={!editMode}
                                placeholder={`ระบุเฉพาะตัวเลข เช่น " 0923235223 "`}
                                onChange={(e) => setTelCoordinator(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-7'>
                    {error && (
                        <div className="w-full text-center">
                            <p className="text-red-500">* {error}</p>
                        </div>
                    )}
                    {editMode ? (
                        <div className="flex gap-10 w-full justify-center mt-5">
                            <div onClick={() => {
                                setAddCompany(false);
                                setError('');
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
    )
}

export default AddCompany
