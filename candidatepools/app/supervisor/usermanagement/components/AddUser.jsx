"use client"

import React from "react";
import { useState, useEffect, useRef } from "react";
import Icon from "@mdi/react";
import {
    mdiAccountEdit,
    mdiContentSave,
    mdiArrowDownDropCircle,
    mdiCloseCircle,
} from "@mdi/js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { PulseLoader } from "react-spinners";
import { set } from "mongoose";
import { useTheme } from "@/app/ThemeContext";
import universitys from '@/app/data/universitys.json'
import { v4 as uuidv4 } from 'uuid';

function AddUser({ setAddUser, dataUser, setLoader }) {
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
        setInputGrayColor,
        inputGrayColor,
        inputTextColor
    } = useTheme();

    //EditMode
    const [editMode, setEditMode] = useState(true);

    const [selectTypeDisabled, setSelectTypeDisabled] = useState("");
    //data value
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [profile, setProfile] = useState(null);
    const [typeDisabled, setTypeDisabled] = useState([]);
    const [detailDisabled, setDetailDisabled] = useState(null);
    const [position, setPosition] = useState(null);
    const [university, setUniversity] = useState(null);
    const [email, setEmail] = useState(null);
    const [prefix, setPrefix] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [sex, setSex] = useState(null);
    const [dateBirthday, setDateBirthday] = useState(null);
    const [monthBirthday, setMonthBirthday] = useState(null);
    const [yearBirthday, setYearBirthday] = useState(null);
    const [nationality, setNationality] = useState(null);
    const [religion, setReligion] = useState(null);
    const [idCard, setIdCard] = useState(null);
    const [idCardDisabled, setIdCardDisabled] = useState(null);
    const [addressIdCard, setAddressIdCard] = useState(null);
    const [addressIdCardProvince, setAddressIdCardProvince] = useState(null);
    const [addressIdCardAmphor, setAddressIdCardAmphor] = useState(null);
    const [addressIdCardTambon, setAddressIdCardTambon] = useState(null);
    const [addressIdCardZipCode, setAddressIdCardZipCode] = useState(null);
    const [address, setAddress] = useState(null);
    const [addressProvince, setAddressProvince] = useState(null);
    const [addressAmphor, setAddressAmphor] = useState(null);
    const [addressTambon, setAddressTambon] = useState(null);
    const [addressZipCode, setAddressZipCode] = useState(null);
    const [tel, setTel] = useState(null);
    const [telEmergency, setTelEmergency] = useState(null);
    const [relationship, setRelationship] = useState(null);
    const [role, setRole] = useState(null);

    // สร้าง Date object สำหรับวันที่ปัจจุบัน
    const today = new Date();

    // ดึงวันปัจจุบันในรูปแบบต่าง ๆ
    const dayOfMonth = today.getDate(); // วันที่ของเดือน (1-31)
    const monthToday = today.getMonth(); // เดือน (0-11, 0 คือ มกราคม, 11 คือ ธันวาคม)
    const yearToday = today.getFullYear();
    // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
    const years = Array.from({ length: 101 }, (_, i) => yearToday - i);
    const [monthNameToday, setMonthNameToday] = useState("");
    const [months, setMonths] = useState([]);
    const filteredMonths = months.slice(0, monthToday + 1);

    const [dates, setDates] = useState([]);
    const filteredDate = dates.slice(0, dayOfMonth + 1);
    const filteredDate31 = Array.from({ length: 31 }, (_, i) => i + 1);
    const filteredDate30 = Array.from({ length: 30 }, (_, i) => i + 1);
    const filteredDate29 = Array.from({ length: 29 }, (_, i) => i + 1);
    const filteredDate28 = Array.from({ length: 28 }, (_, i) => i + 1);

    useEffect(() => {
        const dateOptions = Array.from({ length: 31 }, (_, i) => i + 1);
        setDates(dateOptions);

        const monthNames = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ];

        setMonthNameToday(monthNames[monthToday]);

        setMonths(monthNames);
    }, []);
    //get data Province in api
    const [dataProvince, setDataprovince] = useState([]);

    const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
    const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
    const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");
    const [IDaddressProvince, setIDAddressProvince] = useState("");
    const [IDaddressAmphor, setIDAddressAmphor] = useState("");
    const [IDaddressTambon, setIDAddressTambon] = useState("");

    const apiurl =
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json";

    //รับข้อมูลจังหวัด
    async function getDataProvince() {
        try {
            const res = await fetch(apiurl);

            if (!res.ok) {
                alert("fetch api failed.");
                return;
            }

            const data = await res.json();
            setDataprovince(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDataProvince();
    }, []);


    //checkbox in address add to array
    const handleCheckboxChange = (value) => {
        setTypeDisabled((prevState) => {
            if (prevState.includes(value)) {
                // หากค่าอยู่ใน array แล้ว, ลบออก
                return prevState.filter((item) => item !== value);
            } else {
                // หากค่าไม่อยู่ใน array, เพิ่มเข้าไป
                return [...prevState, value];
            }
        });
    };

    //value for validate filed
    const [error, setError] = useState("");
    const [errorIdCard, setErrorIdCard] = useState("");


    //submit edit
    async function handleSubmit(e) {
        e.preventDefault();

        setLoader(true);

        const tempUser = user;
        const tempPassword = password;
        const tempFirstName = firstName;
        const tempLastName = lastName;
        const tempUniversity = university;
        const tempEmail = email;
        const tempPrefix = prefix;
        const tempSex = sex;
        const tempDateBirthday = dateBirthday;
        const tempMonthBirthday = monthBirthday;
        const tempYearBirthday = yearBirthday;
        const tempNationality = nationality;
        const tempReligion = religion;
        const tempIdCard = idCard;
        const tempIdCardDisabled = idCardDisabled;
        const tempAddressIdCard = addressIdCard;
        const tempAddressIdCardProvince = addressIdCardProvince;
        const tempAddressIdCardAmphor = addressIdCardAmphor;
        const tempAddressIdCardTambon = addressIdCardTambon;
        const tempAddressIdCardZipCode = addressIdCardZipCode;
        const tempAddress = address;
        const tempAddressProvince = addressProvince;
        const tempAddressAmphor = addressAmphor;
        const tempAddressTambon = addressTambon;
        const tempAddressZipCode = addressZipCode;
        const tempTel = tel;
        const tempTelEmergency = telEmergency;
        const tempRelationship = relationship;
        const tempSelectTypeDisabled = selectTypeDisabled;
        const tempProfile = profile;
        const tempTypeDisabled = typeDisabled;
        const tempDetailDisabled = detailDisabled;
        const tempNickname = nickname;
        const tempRole = role;
        const tempPosition = position;
        const tempTypePerson = "";

        // console.log("tempUser:", tempUser);
        // console.log("tempPassword:", tempPassword);
        // console.log("tempFirstName:", tempFirstName);
        // console.log("tempLastName:", tempLastName);
        // console.log("tempProfile:", tempProfile);
        // console.log("tempTypeDisabled:", tempTypeDisabled);
        // console.log("tempDetailDisabled:", tempDetailDisabled);
        // console.log("tempUniversity:", tempUniversity);
        // console.log("tempEmail:", tempEmail);
        // console.log("tempPrefix:", tempPrefix);
        // console.log("tempNickname:", tempNickname);
        // console.log("tempSex:", tempSex);
        // console.log("tempDateBirthday:", tempDateBirthday);
        // console.log("tempMonthBirthday:", tempMonthBirthday);
        // console.log("tempYearBirthday:", tempYearBirthday);
        // console.log("tempNationality:", tempNationality);
        // console.log("tempReligion:", tempReligion);
        // console.log("tempIdCard:", tempIdCard);
        // console.log("tempAddressIdCard:", tempAddressIdCard);
        // console.log("tempAddressIdCardProvince:", tempAddressIdCardProvince);
        // console.log("tempAddressIdCardAmphor:", tempAddressIdCardAmphor);
        // console.log("tempAddressIdCardTambon:", tempAddressIdCardTambon);
        // console.log("tempAddressIdCardZipCode:", tempAddressIdCardZipCode);
        // console.log("tempAddress:", tempAddress);
        // console.log("tempAddressProvince:", tempAddressProvince);
        // console.log("tempAddressAmphor:", tempAddressAmphor);
        // console.log("tempAddressTambon:", tempAddressTambon);
        // console.log("tempAddressZipCode:", tempAddressZipCode);
        // console.log("tempTel:", tempTel);
        // console.log("tempTelEmergency:", tempTelEmergency);
        // console.log("tempRelationship:", tempRelationship);
        // console.log("tempProfile:", tempProfile);
        // console.log("tempRole:", tempRole);
        // console.log("tempPosition:", tempPosition);
        // console.log("tempRole:", tempRole);

        if (role !== "user") {
            if (
                !tempUser ||
                !tempPassword ||
                !tempFirstName ||
                !tempLastName ||
                !tempUniversity ||
                !tempEmail ||
                !tempPrefix ||
                !tempSex ||
                !tempDateBirthday ||
                !tempMonthBirthday ||
                !tempYearBirthday ||
                !tempNationality ||
                !tempReligion ||
                !tempIdCard ||
                !tempAddressIdCard ||
                !tempAddressIdCardProvince ||
                !tempAddressIdCardAmphor ||
                !tempAddressIdCardTambon ||
                !tempAddressIdCardZipCode ||
                !tempAddress ||
                !tempAddressProvince ||
                !tempAddressAmphor ||
                !tempAddressTambon ||
                !tempAddressZipCode ||
                !tempTel ||
                !tempProfile ||
                !tempRole ||
                !tempPosition
            ) {
                setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
                setLoader(false);
                return;
            }
        }

        // Validate name
        if (tempFirstName.length < 2 || tempLastName.length < 2) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }
        if (tempFirstName.trim() !== tempFirstName || tempLastName.trim() !== tempLastName) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }
        const invalidWhitespacePattern = /(?:^|\s)\s+|\s+(?=\s|$)/;
        if (
            invalidWhitespacePattern.test(tempFirstName) ||
            invalidWhitespacePattern.test(tempLastName)
        ) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }

        // Validate nickname
        if (tempNickname.length > 0) {
            if (tempNickname.length < 2) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
            if (tempNickname.trim() !== tempNickname) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
            if (invalidWhitespacePattern.test(tempNickname)) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
        }

        // Validate date of birth
        if (
            (tempMonthBirthday === "เมษายน" ||
                tempMonthBirthday === "กันยายน" ||
                tempMonthBirthday === "พฤศจิกายน") &&
            Number(tempDateBirthday) > 30
        ) {
            setError("วันเกิดไม่ถูกต้อง");
            setLoader(false);
            return;
        }
        if (
            tempMonthBirthday === "กุมภาพันธ์" &&
            Number(tempYearBirthday) % 4 === 0 &&
            Number(tempDateBirthday) > 29
        ) {
            setError("วันเกิดไม่ถูกต้อง");
            setLoader(false);
            return;
        } else if (
            tempMonthBirthday === "กุมภาพันธ์" &&
            Number(tempYearBirthday) % 4 !== 0 &&
            Number(tempDateBirthday) > 28
        ) {
            setError("วันเกิดไม่ถูกต้อง");
            setLoader(false);
            return;
        }

        // Validate idCard and idCardDisabled
        if (tempIdCard.length !== 13 || !/^\d+$/.test(tempIdCard)) {
            setErrorIdCard("ระบุเลขบัตรประจำตัวประชาชนให้ถูกต้อง");
            setError("ระบุเลขบัตรประจำตัวประชาชนให้ถูกต้อง");
            setLoader(false);
            return;
        }

        // Validate address
        if (tempAddressIdCard.length < 2) {
            setError("ระบุที่อยู่ที่ตามบัตรประชาชนที่ถูกต้อง");
            setLoader(false);
            return;
        }
        if (tempAddress.length < 2) {
            setError("ระบุที่อยู่ที่ปัจจุบันที่ถูกต้อง");
            setLoader(false);
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์พิเศษอย่างน้อย 1 ตัว และความยาวไม่ต่ำกว่า 8 ตัวอักษร');
            setLoader(false);
            return;
        }

        const id = uuidv4();
        const bodyData = {
            id: id,
            user: tempUser,
            password: tempPassword,
            firstName: tempFirstName,
            lastName: tempLastName,
            profile: tempProfile,
            typeDisabled: tempTypeDisabled,
            detailDisabled: tempDetailDisabled,
            university: tempUniversity,
            email: tempEmail,
            prefix: tempPrefix,
            nickname: tempNickname,
            sex: tempSex,
            dateBirthday: tempDateBirthday,
            monthBirthday: tempMonthBirthday,
            yearBirthday: tempYearBirthday,
            nationality: tempNationality,
            religion: tempReligion,
            idCard: tempIdCard,
            idCardDisabled: tempIdCardDisabled,
            addressIdCard: tempAddressIdCard,
            addressIdCardProvince: tempAddressIdCardProvince,
            addressIdCardAmphor: tempAddressIdCardAmphor,
            addressIdCardTambon: tempAddressIdCardTambon,
            addressIdCardZipCode: tempAddressIdCardZipCode,
            address: tempAddress,
            addressProvince: tempAddressProvince,
            addressAmphor: tempAddressAmphor,
            addressTambon: tempAddressTambon,
            addressZipCode: tempAddressZipCode,
            tel: tempTel,
            telEmergency: tempTelEmergency,
            relationship: tempRelationship,
            role: tempRole,
            position: tempPosition
        };

        try {
            const resCheckUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, email })
            })

            if (!resCheckUser.ok) {
                setLoader(false);
                throw new Error("Error fetch api checkuser.");
            }

            const { user: userExists, email: emailExists } = await resCheckUser.json();

            if (userExists) {
                setError("username มีการใช้งานแล้ว");
                setLoader(false);
                return;
            }
            if (emailExists) {
                setError("email นี้มีการใช้งานแล้ว");
                setLoader(false);
                return;
            }

            const resCheckID = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkIdRegister`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idCard }),
                }
            );

            if (!resCheckID.ok) {
                setLoader(false);
                throw new Error("Error fetch api checkuser.");
            }

            const { idCard: idCardExists } = await resCheckID.json();
            if (idCardExists) {
                setError("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                setLoader(false);
                return;
            }

            if (
                tempIdCard !== dataUser.idCard ||
                tempIdCardDisabled !== dataUser.idCardDisabled
            ) {
                const resCheckID = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkId`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ idCard, idCardDisabled }),
                    }
                );

                if (!resCheckID.ok) {
                    setLoader(false);

                    throw new Error("Error fetch api checkuser.");
                }
                const { idCard: idCardExists, idCardDisabled: idCardDisabledExists } =
                    await resCheckID.json();
                if (
                    tempIdCard !== dataUser.idCard
                ) {
                    if (idCardExists && idCardDisabledExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }
                    if (idCardExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }

                } else if (idCard !== dataUser.idCard) {
                    if (idCardExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }
                }
            } else {
                setErrorIdCard("");
            }
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                }
            );

            const resEducation = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uuid: id || id, tempEmail, tempTypePerson, tempUniversity })
            })

            if (!res.ok || !resEducation.ok) {
                setLoader(false);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                }).then(() => {
                    setError('')
                });
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
                setError('')
            });
        } catch (err) {
            console.log(err);
        }
    }

    // Check address same address IDCard
    const [statusSameAddress, setSameAddress] = useState(false);

    function CheckAddressSameIDCard(e) {
        setSameAddress(e);
        if (!statusSameAddress) {
            setAddress(addressIdCard);
            setIDAddressProvince(IDaddressIdCardProvince);
            setIDAddressAmphor(IDaddressIdCardAmphor);
            setIDAddressTambon(IDaddressIdCardTambon);

            setAddressProvince(addressIdCardProvince);
            setAddressAmphor(addressIdCardAmphor);
            setAddressTambon(addressIdCardTambon);
            setAddressZipCode(addressIdCardZipCode);
        }
    }

    //upload profile
    const [imageUrl, setImageUrl] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputFileRef = useRef(null);

    const openFileDialog = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    function handleProfile(event) {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(
                storage,
                `users/profile/${email}/${file.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Progress
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    // Error
                    console.error("Error uploading file:", error);
                },
                () => {
                    // Complete
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            setImageUrl(url);
                            setUploadProgress(0); // Reset progress
                        })
                        .catch((error) => {
                            console.error("Error getting download URL:", error);
                        });
                }
            );
        }
    }

    useEffect(() => {
        if (imageUrl) {
            setProfile(imageUrl); // Assume setProfile is a function that updates profile state or context
        }
    }, [imageUrl]);

    //select university 
    const [optionUniversity, setOptionUniversity] = useState([]);
    const [isFocusUni, setIsFocusUni] = useState(false)

    function handleUniversity(uni) {
        const input = uni;
        setUniversity(input)

        // ค้นหาคำที่มีความคล้าย
        const filteredOptions = universitys.filter((uni) =>
            uni.university.toLowerCase().includes(input.toLowerCase()) // เปรียบเทียบแบบ case-insensitive
        );
        setOptionUniversity(filteredOptions);
    }
    function SeletedOption(uni) {
        setUniversity(uni);
        setOptionUniversity([]);
    }

    //eye show password
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mt-5">
            <form
                onSubmit={handleSubmit}
                className={`${fontSize} flex gap-x-10 gap-y-5 gap- flex-wrap`}
            >
                <div className={`flex flex-col`}>
                    <label>
                        คำนำหน้า <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <div className="relative col w-fit mt-1">
                        <select
                            onChange={(e) => {
                                setPrefix(e.target.value);
                                setSex(
                                    e.target.value === "0"
                                        ? ""
                                        : e.target.value === "นาย"
                                            ? "ชาย"
                                            : "หญิง"
                                );
                            }}
                            className={` ${!editMode
                                ? ` ${inputEditColor}  cursor-default `
                                : `cursor-pointer`
                                } ${bgColorMain} w-32  border border-gray-400 py-2 px-4 rounded-lg`}
                            placeholder="กรอกชื่อผู้ใช้"
                            style={{ appearance: "none" }}
                            disabled={!editMode}
                            value={prefix || "0"}
                        >
                            <option value="0">-</option>
                            <option value="นาย">นาย</option>
                            <option value="นางสาว">นางสาว</option>
                            <option value="นาง">นาง</option>
                        </select>
                        <Icon
                            className={`${!editMode ? "hidden" : ""
                                } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                            path={mdiArrowDownDropCircle}
                            size={0.8}
                        />
                    </div>
                </div>
                <div className="flex col flex-col">
                    <label>
                        ชื่อ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <input
                        type="text"
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                        defaultValue={""}
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex col flex-col">
                    <label>
                        นามสกุล <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <input
                        type="text"
                        className={`${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                        defaultValue={""}
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex col flex-col">
                    <label>ชื่อเล่น </label>
                    <input
                        type="text"
                        className={`placeholder ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setNickname(e.target.value);
                        }}
                        defaultValue={""}
                        placeholder="ระบุชื่อเล่น"
                        readOnly={!editMode}
                    />
                </div>
                {(prefix !== "0" && prefix) ? (
                    <div className="flex col flex-col">
                        <label>เพศ</label>
                        <p
                            type="text"
                            className={`mt-1 w-32 border ${inputEditColor} cursor-default border-gray-400 py-2 px-4 rounded-lg`}
                        >
                            {sex}
                        </p>
                    </div>
                ) : null}
                <div className=" flex flex-col ">
                    <label>
                        วันเกิด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        <div className="mt-1 relative col w-fit">
                            <select
                                onChange={(e) => setYearBirthday(e.target.value)}
                                className={`${!editMode
                                    ? `${inputEditColor} cursor-default`
                                    : "cursor-pointer"
                                    } ${bgColorMain} w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                                style={{ appearance: "none" }}
                                disabled={!editMode}
                                value={yearBirthday || "0"}
                            >
                                <option value="0">-</option>
                                {years.map((y, index) => (
                                    <option key={index} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <Icon
                                className={`${!editMode ? "hidden" : ""
                                    }  ${bgColorMain} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                path={mdiArrowDownDropCircle}
                                size={0.8}
                            />
                        </div>
                        <div className="mt-1 relative col w-fit">
                            <select
                                onChange={(e) => setMonthBirthday(e.target.value)}
                                className={`${!editMode
                                    ? `${inputEditColor} cursor-default`
                                    : "cursor-pointer"
                                    } ${bgColorMain} w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                style={{ appearance: "none" }}
                                disabled={!editMode}
                                value={monthBirthday || "0"}
                            >
                                <option value="0">-</option>
                                {yearToday === Number(yearBirthday)
                                    ? filteredMonths.map((m, index) => (
                                        <option key={index} value={m}>
                                            {m}
                                        </option>
                                    ))
                                    : months.map((m, index) => (
                                        <option key={index} value={m}>
                                            {m}
                                        </option>
                                    ))}
                            </select>
                            <Icon
                                className={`${!editMode ? "hidden" : ""
                                    }  ${bgColorMain} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                path={mdiArrowDownDropCircle}
                                size={0.8}
                            />
                        </div>
                        <div className="mt-1 relative col w-fit">
                            <select
                                onChange={(e) => setDateBirthday(e.target.value)}
                                className={`${!editMode
                                    ? `${inputEditColor} cursor-default`
                                    : "cursor-pointer"
                                    } ${bgColorMain} w-28 border border-gray-400 py-2 px-4 rounded-lg`}
                                style={{ appearance: "none" }}
                                disabled={!editMode}
                                value={dateBirthday || "0"}
                            >
                                <option value="0">-</option>
                                {yearToday === Number(yearBirthday) &&
                                    monthNameToday === monthBirthday
                                    ? filteredDate.map((m, index) => (
                                        <option key={index} value={m}>
                                            {m}
                                        </option>
                                    ))
                                    : monthBirthday === "เมษายน" ||
                                        monthBirthday === "กันยายน" ||
                                        monthBirthday === "มิถุนายน" ||
                                        monthBirthday === "พฤศจิกายน"
                                        ? filteredDate30.map((m, index) => (
                                            <option key={index} value={m}>
                                                {m}
                                            </option>
                                        ))
                                        : monthBirthday === "กุมภาพันธ์" &&
                                            Number(yearBirthday) % 4 === 0
                                            ? filteredDate29.map((m, index) => (
                                                <option key={index} value={m}>
                                                    {m}
                                                </option>
                                            ))
                                            : monthBirthday === "กุมภาพันธ์"
                                                ? filteredDate28.map((m, index) => (
                                                    <option key={index} value={m}>
                                                        {m}
                                                    </option>
                                                ))
                                                : filteredDate31.map((m, index) => (
                                                    <option key={index} value={m}>
                                                        {m}
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
                </div>
                {(yearBirthday !== "0" &&
                    monthBirthday !== "0" &&
                    dateBirthday !== "0" &&
                    yearBirthday &&
                    monthBirthday &&
                    dateBirthday) ? (
                    <div className="flex col flex-col">
                        <label>อายุ</label>
                        <p
                            type="text"
                            className={`mt-1 w-32 border ${inputEditColor} cursor-default border-gray-400 py-2 px-4 rounded-lg`}
                        >
                            {yearBirthday ? yearToday - yearBirthday : ""} ปี
                        </p>
                    </div>
                ) : null}
                <div className=" flex flex-col">
                    <label>
                        สัญชาติ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <div className="relative col w-fit mt-1">
                        <select
                            onChange={(e) => setNationality(e.target.value)}
                            className={`${!editMode
                                ? `${inputEditColor} cursor-default`
                                : `${bgColorMain} cursor-pointer`
                                } ${bgColorMain} w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                            style={{ appearance: "none" }}
                            disabled={!editMode}
                            value={nationality || "0"}
                        >
                            <option value="0">-</option>
                            <option value="ไทย">ไทย</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                        <Icon
                            className={`${!editMode ? "hidden" : ""
                                } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                            path={mdiArrowDownDropCircle}
                            size={0.8}
                        />
                    </div>
                </div>
                <div className=" flex flex-col">
                    <label>
                        {" "}
                        ศาสนา <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <div className="relative col w-fit mt-1">
                        <select
                            onChange={(e) => setReligion(e.target.value)}
                            className={`${!editMode
                                ? `${inputEditColor} cursor-default`
                                : `${bgColorMain} cursor-pointer`
                                } ${bgColorMain} w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                            style={{ appearance: "none" }}
                            disabled={!editMode}
                            value={religion || "0"}
                        >
                            <option value="0">-</option>
                            <option value="พุทธ">พุทธ</option>
                            <option value="คริสต์">คริสต์</option>
                            <option value="อิสลาม">อิสลาม</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                        <Icon
                            className={`${!editMode ? "hidden" : ""
                                } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                            path={mdiArrowDownDropCircle}
                            size={0.8}
                        />
                    </div>
                </div>
                <div className="flex col flex-col w-64">
                    <label>
                        เลขบัตรประจำตัวประชาชน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{13}"
                        maxLength={13}
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setIdCard(e.target.value);
                        }}
                        defaultValue={""}
                        placeholder="เลขบัตร 13 หลัก"
                        readOnly={!editMode}
                    />
                    {errorIdCard && (
                        <div className="text-xs text-red-500 w-full text-end mt-1 ">
                            {errorIdCard}
                        </div>
                    )}
                </div>

                <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
                    <div className="flex col flex-col">
                        <label>
                            ที่อยู่ตามบัตรประชาชน{" "}
                            <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>
                        <input
                            type="text"
                            className={` ${!editMode
                                ? `${inputEditColor} cursor-default focus:outline-none`
                                : ""
                                } ${bgColorMain} w-72 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                            onChange={(e) => {
                                setAddressIdCard(e.target.value);
                            }}
                            defaultValue={""}
                            placeholder="บ้านเลขที่, หมู่บ้าน, หอพัก"
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
                <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
                    <div className="flex col flex-col">
                        <div className="flex gap-x-2">
                            <label>
                                ที่อยู่ปัจจุบัน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <div
                                className={`${!editMode ? "hidden" : ""} flex gap-x-1`}
                            >
                                <input
                                    onChange={(e) =>
                                        CheckAddressSameIDCard(e.target.checked)
                                    }
                                    type="checkbox"
                                    className={`cursor-pointer w-3 h-full border`}
                                    checked={statusSameAddress}
                                />
                                <p>(ตามบัตรประชาชน)</p>
                            </div>
                        </div>
                        {statusSameAddress ? (
                            <div
                                type="text"
                                className={`  ${inputEditColor} cursor-default focus:outline-none ${bgColorMain} w-72 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                placeholder="บ้านเลขที่, หมู่บ้าน, หอพัก"
                                readOnly={!editMode || statusSameAddress}
                            >
                                {addressIdCard}
                            </div>
                        ) : (
                            <input
                                type="text"
                                className={` ${!editMode
                                    ? `${inputEditColor} cursor-default focus:outline-none`
                                    : ""
                                    } ${bgColorMain} w-72 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                                defaultValue={
                                    statusSameAddress ? addressIdCard : address
                                }
                                placeholder="บ้านเลขที่, หมู่บ้าน, หอพัก"
                                readOnly={!editMode}
                            />
                        )}
                    </div>
                    <div className=" flex flex-col">
                        <label>
                            จังหวัด <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>
                        <div className="relative col w-fit mt-1">
                            <select
                                onChange={(e) => {
                                    setIDAddressProvince(e.target.value);
                                    setIDAddressAmphor("");
                                    setIDAddressTambon("");
                                    setAddressAmphor("");
                                    setAddressTambon("");
                                    setAddressZipCode("");
                                    setAddressProvince(
                                        dataProvince.find(
                                            (p) => p.id === parseInt(e.target.value)
                                        ).name_th
                                    );
                                }}
                                className={`${!editMode || statusSameAddress
                                    ? `${inputEditColor} cursor-default`
                                    : `${bgColorMain} cursor-pointer`
                                    } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                style={{ appearance: "none" }}
                                disabled={!editMode || statusSameAddress}
                                value={
                                    statusSameAddress
                                        ? dataProvince.find(
                                            (p) => p.id === parseInt(IDaddressIdCardProvince)
                                        )?.id
                                        : dataProvince.find(
                                            (p) => p.id === parseInt(IDaddressProvince)
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
                    {IDaddressProvince ? (
                        <div className=" flex flex-col">
                            <label>
                                อำเภอ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <div className="relative col w-fit mt-1">
                                <select
                                    onChange={(e) => {
                                        setIDAddressAmphor(e.target.value);
                                        setIDAddressTambon("");
                                        setAddressTambon("");
                                        setAddressZipCode("");
                                        setAddressAmphor(
                                            dataProvince
                                                .find((p) => p.id === parseInt(IDaddressProvince))
                                                .amphure.find(
                                                    (a) => a.id === parseInt(e.target.value)
                                                ).name_th
                                        );
                                    }}
                                    className={`${!editMode || statusSameAddress
                                        ? `${inputEditColor} cursor-default`
                                        : "cursor-pointer"
                                        } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                    style={{ appearance: "none" }}
                                    disabled={!editMode || statusSameAddress}
                                    value={
                                        statusSameAddress
                                            ? dataProvince
                                                .find(
                                                    (p) =>
                                                        p.id === parseInt(IDaddressIdCardProvince)
                                                )
                                                .amphure.find(
                                                    (a) =>
                                                        a.id === parseInt(IDaddressIdCardAmphor)
                                                )?.id
                                            : dataProvince
                                                .find(
                                                    (p) => p.id === parseInt(IDaddressProvince)
                                                )
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressAmphor)
                                                )?.id || "0"
                                    }
                                >
                                    <option value="0">-</option>
                                    {dataProvince
                                        .find((p) => p.id === parseInt(IDaddressProvince))
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
                    {IDaddressProvince && IDaddressAmphor ? (
                        <div className=" flex flex-col">
                            <label>
                                ตำบล <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <div className="relative col w-fit mt-1">
                                <select
                                    onChange={(e) => {
                                        setIDAddressTambon(e.target.value);
                                        setAddressTambon(
                                            dataProvince
                                                .find((p) => p.id === parseInt(IDaddressProvince))
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressAmphor)
                                                )
                                                .tambon.find(
                                                    (t) => t.id === parseInt(e.target.value)
                                                ).name_th
                                        );
                                        setAddressZipCode(
                                            dataProvince
                                                .find((p) => p.id === parseInt(IDaddressProvince))
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressAmphor)
                                                )
                                                .tambon.find(
                                                    (t) => t.id === parseInt(e.target.value)
                                                ).zip_code
                                        );
                                    }}
                                    className={`${!editMode || statusSameAddress
                                        ? `${inputEditColor} cursor-default`
                                        : `${bgColorMain} cursor-pointer`
                                        } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                    style={{ appearance: "none" }}
                                    disabled={!editMode || statusSameAddress}
                                    value={
                                        statusSameAddress
                                            ? dataProvince
                                                .find(
                                                    (p) =>
                                                        p.id === parseInt(IDaddressIdCardProvince)
                                                )
                                                .amphure.find(
                                                    (a) =>
                                                        a.id === parseInt(IDaddressIdCardAmphor)
                                                )
                                                .tambon.find(
                                                    (t) =>
                                                        t.id === parseInt(IDaddressIdCardTambon)
                                                )?.id
                                            : dataProvince
                                                .find(
                                                    (p) => p.id === parseInt(IDaddressProvince)
                                                )
                                                .amphure.find(
                                                    (a) => a.id === parseInt(IDaddressAmphor)
                                                )
                                                .tambon.find(
                                                    (t) => t.id === parseInt(IDaddressTambon)
                                                )?.id || "0"
                                    }
                                >
                                    <option value="0">-</option>
                                    {dataProvince
                                        .find((p) => p.id === parseInt(IDaddressProvince))
                                        .amphure.find(
                                            (a) => a.id === parseInt(IDaddressAmphor)
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
                    {IDaddressProvince && IDaddressAmphor && IDaddressTambon ? (
                        <div className=" flex flex-col ">
                            <label>
                                รหัสไปรษณีย์ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                            </label>
                            <div className=" col w-fit mt-1">
                                <p
                                    className={`${inputEditColor} focus:outline-none cursor-default w-36 ${bgColorMain}   border border-gray-400 py-2 px-4 rounded-lg`}
                                >
                                    {statusSameAddress
                                        ? addressIdCardZipCode
                                        : addressZipCode || "-"}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="flex col flex-col">
                    <label>
                        เบอร์ติดต่อ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        pattern="\d{10}"
                        maxLength={10}
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setTel(e.target.value);
                        }}
                        defaultValue={""}
                        placeholder="หมายเลขโทรศัพท์ 10 หลัก"
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex col flex-col">
                    <label>เบอร์ติดต่อฉุกเฉิน </label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        pattern="\d{10}"
                        maxLength={10}
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setTelEmergency(e.target.value);
                        }}
                        defaultValue={""}
                        placeholder="หมายเลขโทรศัพท์ 10 หลัก"
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex col flex-col">
                    <label>ความสัมพันธ์ </label>
                    <input
                        type="text"
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setRelationship(e.target.value);
                        }}
                        defaultValue={""}
                        placeholder="บุลคลใกล้ชิด"
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex col flex-col">
                    <label>
                        อีเมล์ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                    </label>
                    <input
                        type="email"
                        className={` ${!editMode
                            ? `${inputEditColor} cursor-default focus:outline-none`
                            : ""
                            } ${bgColorMain} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        value={email || ""}
                        placeholder="ระบุอีเมล์ของคุณ"
                        readOnly={!editMode}
                    />
                </div>
                <div className="flex gap-x-10 gap-y-5 flex-wrap">



                    {/* สถาบันการศึกษา */}
                    <div className={`${fontSize} ${bgColorMain} flex col flex-col`}>
                        <label>สถาบันการศึกษา <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <div className='relative'>
                            <input
                                value={university || ""}
                                onChange={(e) => handleUniversity(e.target.value)}
                                onFocus={() => setIsFocusUni(true)} //
                                onBlur={() => setTimeout(() => setIsFocusUni(false))}
                                type="text"
                                className={`${!editMode
                                    ? `${inputEditColor} cursor-default focus:outline-none`
                                    : " "
                                    } ${bgColorMain} border-gray-400 mt-1 w-60 border py-2 px-4 rounded-lg`}
                                placeholder='ระบุชื่อสถานศึกษา'
                            />
                            {isFocusUni && optionUniversity?.length > 0 && (
                                <div className={`z-10 w-full absolute shadow max-h-24 overflow-scroll hide-scrollbar`}>

                                    {optionUniversity.map((uni, index) => (
                                        <div
                                            key={index}
                                            className={`px-2 py-1 border ${bgColor} hover:bg-gray-300 cursor-pointer`}
                                            onClick={() => SeletedOption(uni.university)}
                                        >
                                            {uni.university}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex col flex-col ">
                        <label>Username <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            type="text"
                            className={`${!editMode
                                ? `${inputEditColor} cursor-default focus:outline-none`
                                : " "
                                } ${bgColorMain} border-gray-400 mt-1 w-60 border py-2 px-4 rounded-lg`}
                            onChange={(e) => {
                                setUser(e.target.value);
                            }}
                            defaultValue={""}
                            placeholder="สร้าง username ของคุณ"
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="relative flex col flex-col">
                        <label>Password <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                        <input
                            defaultValue={""}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${!editMode
                                ? `${inputEditColor} cursor-default focus:outline-none`
                                : " "
                                } ${bgColorMain} border-gray-400 mt-1 w-60 border py-2 px-4 rounded-lg`}
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                        />
                        {editMode && (
                            <Image
                                onClick={(e) => setShowPassword((e) => !e)}
                                alt="icon-eye"
                                className="hover:cursor-pointer absolute top-[34px] right-5 w-4 h-4"
                                src="/image/main/eye.png"
                                height={1000}
                                width={1000}
                                priority
                            />
                        )}
                    </div>
                    <div className={`flex flex-col`}>
                        <label>
                            ประเภทผู้ใช้งาน <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>
                        <div className="relative col w-fit mt-1">
                            <select
                                onChange={(e) => {
                                    setRole(e.target.value);
                                }}
                                className={` ${!editMode
                                    ? ` ${inputEditColor}  cursor-default `
                                    : `cursor-pointer`
                                    } ${bgColorMain} w-44  border border-gray-400 py-2 px-4 rounded-lg`}
                                placeholder="ประเภท"
                                style={{ appearance: "none" }}
                                disabled={!editMode}
                                value={role || "0"}
                            >
                                <option value="0">-</option>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="supervisor">supervisor</option>
                            </select>
                            <Icon
                                className={`${!editMode ? "hidden" : ""
                                    } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                                path={mdiArrowDownDropCircle}
                                size={0.8}
                            />
                        </div>
                    </div>
                    {(role && role === "user") ? (
                        <>
                        </>
                    ) : (
                        <div className="flex col flex-col ">
                            <label>ตำแหน่ง <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span></label>
                            <input
                                type="text"
                                className={`${!editMode
                                    ? `${inputEditColor} cursor-default focus:outline-none`
                                    : " "
                                    } ${bgColorMain} border-gray-400 mt-1 w-60 border py-2 px-4 rounded-lg`}
                                onChange={(e) => {
                                    setPosition(e.target.value);
                                }}
                                defaultValue={""}
                                placeholder="ตำแหน่งงานปัจจุบัน"
                                readOnly={!editMode}
                            />
                        </div>
                    )}

                </div>

                <div className="w-full flex">
                    <div className="flex col flex-col ">
                        <label className={`${!editMode ? "hidden" : ""}`}>
                            อัปโหลดรูปโปรไฟล์ <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>

                        <div className="w-32 h-32 relative my-1">
                            <Image
                                onClick={openFileDialog}
                                className="w-full h-full cursor-pointer"
                                src={profile || imageUrl || "/image/main/user.png"}
                                height={1000}
                                width={1000}
                                alt="profile"
                                priority
                            />
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="text-white absolute  border top-0 w-full flex flex-col justify-center items-center h-full bg-black opacity-40">
                                    <PulseLoader color="#F97201" size={10} />
                                </div>
                            )}
                        </div>

                        <div
                            className={`${!editMode ? "hidden" : ""
                                } ${bgColorMain} mt-1 flex items-center`}
                        >
                            <input
                                id="chooseProfile"
                                ref={inputFileRef}
                                onChange={handleProfile}
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
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="mx-3">
                                    <p>{Math.round(uploadProgress)}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {error ? <div className="text-red-500">* {error}</div> : null}
                {editMode ? (
                    <div className="flex gap-10 w-full justify-center mt-5">
                        <div
                            onClick={() => {
                                setAddUser(false);
                                setError('')
                            }}
                            className={`${bgColorNavbar} ${bgColorWhite} hover:cursor-pointer bg-[#F97201] py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                        >
                            <Icon path={mdiCloseCircle} size={1} />
                            <p>ยกเลิก</p>
                        </div>
                        <button
                            type="submit"
                            // className="hover:cursor-pointer bg-[#75C7C2] text-white py-2 px-6 rounded-2xl flex justify-center items-center gap-1"
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
                    <div className=" flex w-full justify-center mt-5">
                        <div
                            onClick={() => setEditMode(true)}
                            className={` ${bgColorNavbar} ${bgColorWhite}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                        >
                            <Icon path={mdiAccountEdit} size={1} />
                            <p>แก้ไขข้อมูล</p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default AddUser
