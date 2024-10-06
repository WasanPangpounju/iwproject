"use client"

import React from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'
import Loader from '../components/Loader'
import { useState, useEffect, useRef } from 'react'
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiContentSave, mdiArrowDownDropCircle, mdiCloseCircle } from '@mdi/js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image'

//firebase
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebaseConfig';

import { PulseLoader } from 'react-spinners';
import { set } from 'mongoose'

function EditPersonal() {

    const [dataUser, setDataUser] = useState(null);
    const [loader, setLoader] = useState(true);
    const [selectTypeDisabled, setSelectTypeDisabled] = useState("");
    const router = useRouter();
    const { status, data: session } = useSession();

    // Validate session and fetch user data
    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        setLoader(false);

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


    //data value
    const [typePerson, setTypePerson] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profile, setProfile] = useState("");
    const [typeDisabled, setTypeDisabled] = useState([]);
    const [detailDisabled, setDetailDisabled] = useState("");
    const [university, setUniversity] = useState("");
    const [email, setEmail] = useState("");
    const [prefix, setPrefix] = useState("");
    const [nickname, setNickname] = useState("");
    const [sex, setSex] = useState("");
    const [dateBirthday, setDateBirthday] = useState("");
    const [monthBirthday, setMonthBirthday] = useState("");
    const [yearBirthday, setYearBirthday] = useState("");
    const [nationality, setNationality] = useState("");
    const [religion, setReligion] = useState("");
    const [idCard, setIdCard] = useState("");
    const [idCardDisabled, setIdCardDisabled] = useState("");
    const [addressIdCard, setAddressIdCard] = useState("");
    const [addressIdCardProvince, setAddressIdCardProvince] = useState("");
    const [addressIdCardAmphor, setAddressIdCardAmphor] = useState("");
    const [addressIdCardTambon, setAddressIdCardTambon] = useState("");
    const [addressIdCardZipCode, setAddressIdCardZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [addressProvince, setAddressProvince] = useState("");
    const [addressAmphor, setAddressAmphor] = useState("");
    const [addressTambon, setAddressTambon] = useState("");
    const [addressZipCode, setAddressZipCode] = useState("");
    const [tel, setTel] = useState("");
    const [telEmergency, setTelEmergency] = useState("");
    const [relationship, setRelationship] = useState("");

    useEffect(() => {
        setLoader(false);
    }, []);


    // สร้าง Date object สำหรับวันที่ปัจจุบัน
    const today = new Date();

    // ดึงวันปัจจุบันในรูปแบบต่าง ๆ
    const dayOfMonth = today.getDate(); // วันที่ของเดือน (1-31)
    const monthToday = today.getMonth(); // เดือน (0-11, 0 คือ มกราคม, 11 คือ ธันวาคม)
    const yearToday = today.getFullYear();
    // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
    const years = Array.from({ length: 101 }, (_, i) => yearToday - i);
    const [monthNameToday, setMonthNameToday] = useState('')
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
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
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

    const apiurl = "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"

    //รับข้อมูลจังหวัด
    async function getDataProvince() {
        try {
            const res = await fetch(apiurl)

            if (!res.ok) {
                alert("fetch api failed.")
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
    }, [])

    //set default data in sesstion

    useEffect(() => {
        if (!dataUser) return;

        setUser(dataUser.user || "");
        setPassword(dataUser.password || "");
        setFirstName(dataUser.firstName || "");
        setLastName(dataUser.lastName || "");
        setProfile(dataUser.profile || "");
        setTypeDisabled(dataUser.typeDisabled || []);
        setDetailDisabled(dataUser.detailDisabled || "");
        setUniversity(dataUser.university || "");
        setEmail(dataUser.email || "");
        setPrefix(dataUser.prefix || "");
        setNickname(dataUser.nickname || "");
        setSex(dataUser.sex || "");
        setDateBirthday(dataUser.dateBirthday || "");
        setMonthBirthday(dataUser.monthBirthday || "");
        setYearBirthday(dataUser.yearBirthday || "");
        setNationality(dataUser.nationality || "");
        setReligion(dataUser.religion || "");
        setIdCard(dataUser.idCard || "");
        setIdCardDisabled(dataUser.idCardDisabled || "");
        setAddressIdCard(dataUser.addressIdCard || "");
        setAddressIdCardProvince(dataUser.addressIdCardProvince || "");
        setAddressIdCardAmphor(dataUser.addressIdCardAmphor || "");
        setAddressIdCardTambon(dataUser.addressIdCardTambon || "");
        setAddressIdCardZipCode(dataUser.addressIdCardZipCode || "");
        setAddress(dataUser.address || "");
        setAddressProvince(dataUser.addressProvince || "");
        setAddressAmphor(dataUser.addressAmphor || "");
        setAddressTambon(dataUser.addressTambon || "");
        setAddressZipCode(dataUser.addressZipCode || "");
        setTel(dataUser.tel || "");
        setTelEmergency(dataUser.telEmergency || "");
        setRelationship(dataUser.relationship || "");
        setTypePerson(dataUser.typePerson || "");

        setIDAddressIdCardProvince(dataProvince.find(p => p.name_th === dataUser.addressIdCardProvince)?.id || null);
        setIDAddressIdCardAmphor(
            dataProvince.find(p => p.name_th === dataUser.addressIdCardProvince)
                ?.amphure.find(a => a.name_th === dataUser.addressIdCardAmphor)?.id || null
        );
        setIDAddressIdCardTambon(
            dataProvince.find(p => p.name_th === dataUser.addressIdCardProvince)
                ?.amphure.find(a => a.name_th === dataUser.addressIdCardAmphor)
                ?.tambon.find(t => t.name_th === dataUser.addressIdCardTambon)?.id || null
        );

        setIDAddressProvince(dataProvince.find(p => p.name_th === dataUser.addressProvince)?.id || null);
        setIDAddressAmphor(
            dataProvince.find(p => p.name_th === dataUser.addressProvince)
                ?.amphure.find(a => a.name_th === dataUser.addressAmphor)?.id || null
        );
        setIDAddressTambon(
            dataProvince.find(p => p.name_th === dataUser.addressProvince)
                ?.amphure.find(a => a.name_th === dataUser.addressAmphor)
                ?.tambon.find(t => t.name_th === dataUser.addressTambon)?.id || null
        );

        if (dataUser.typeDisabled.length > 1) {
            setSelectTypeDisabled('พิการมากกว่า 1 ประเภท');
        } else {
            setSelectTypeDisabled('พิการ 1 ประเภท');
        }
    }, [dataUser])

    //get data from user
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

    //checkbox in address add to array
    const handleCheckboxChange = (value) => {
        setTypeDisabled(prevState => {
            if (prevState.includes(value)) {
                // หากค่าอยู่ใน array แล้ว, ลบออก
                return prevState.filter(item => item !== value);
            } else {
                // หากค่าไม่อยู่ใน array, เพิ่มเข้าไป
                return [...prevState, value];
            }
        });
    };

    //value for validate filed
    const [error, setError] = useState("");
    const [errorFirstName, setErrorFirstName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorProfile, setErrorProfile] = useState("");
    const [errorTypeDisabled, setErrorTypeDisabled] = useState("");
    const [errorDetailDisabled, setErrorDetailDisabled] = useState("");
    const [errorUniversity, setErrorUniversity] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPrefix, setErrorPrefix] = useState("");
    const [errorSex, setErrorSex] = useState("");
    const [errorDateBirthday, setErrorDateBirthday] = useState("");
    const [errorNationality, setErrorNationality] = useState("");
    const [errorReligion, setErrorReligion] = useState("");
    const [errorIdCard, setErrorIdCard] = useState("");
    const [errorIdCardDisabled, setErrorIdCardDisabled] = useState("");
    const [errorAddressIdCard, setErrorAddressIdCard] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [errorTel, setErrorTel] = useState("");
    const [errorTelEmergency, setErrorTelEmergency] = useState("");
    const [errorRelationship, setErrorRelationship] = useState("");

    //submit edit
    async function handleEditSubmit(e) {
        e.preventDefault();

        setLoader(true);

        console.log("in submit");

        // console.log("user:", user);
        // console.log("password:", password);
        // console.log("firstName:", firstName);
        // console.log("lastName:", lastName);
        // console.log("profile:", profile);
        // console.log("typeDisabled:", typeDisabled);
        // console.log("detailDisabled:", detailDisabled);
        // console.log("university:", university);
        // console.log("email:", email);
        // console.log("prefix:", prefix);
        // console.log("nickname:", nickname);
        // console.log("sex:", sex);
        // console.log("dateBirthday:", dateBirthday);
        // console.log("monthBirthday:", monthBirthday);
        // console.log("yearBirthday:", yearBirthday);
        // console.log("nationality:", nationality);
        // console.log("religion:", religion);
        // console.log("idCard:", idCard);
        // console.log("idCardDisabled:", idCardDisabled);
        // console.log("addressIdCard:", addressIdCard);
        // console.log("addressIdCardProvince:", addressIdCardProvince);
        // console.log("addressIdCardAmphor:", addressIdCardAmphor);
        // console.log("addressIdCardTambon:", addressIdCardTambon);
        // console.log("addressIdCardZipCode:", addressIdCardZipCode);
        // console.log("address:", address);
        // console.log("addressProvince:", addressProvince);
        // console.log("addressAmphor:", addressAmphor);
        // console.log("addressTambon:", addressTambon);
        // console.log("addressZipCode:", addressZipCode);
        // console.log("tel:", tel);
        // console.log("telEmergency:", telEmergency);
        // console.log("relationship:", relationship);
        // console.log("profile:", profile);

        if (
            !user ||
            !password ||
            !firstName ||
            !lastName ||
            !typeDisabled.length ||
            !university ||
            !email ||
            !prefix ||
            !sex ||
            !dateBirthday ||
            !monthBirthday ||
            !yearBirthday ||
            !nationality ||
            !religion ||
            !idCard ||
            !idCardDisabled ||
            !addressIdCard ||
            !addressIdCardProvince ||
            !addressIdCardAmphor ||
            !addressIdCardTambon ||
            !addressIdCardZipCode ||
            !address ||
            !addressProvince ||
            !addressAmphor ||
            !addressTambon ||
            !addressZipCode ||
            !tel ||
            !selectTypeDisabled ||
            !profile ||
            !typePerson
        ) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่องที่มี *");
            setLoader(false);
            return;
        }

        //validate name
        if (firstName.length < 2 || lastName.length < 2) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }
        if (firstName.trim() !== firstName || lastName.trim() != lastName) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }
        const invalidWhitespacePattern = /(?:^|\s)\s+|\s+(?=\s|$)/;
        if (invalidWhitespacePattern.test(firstName) || invalidWhitespacePattern.test(lastName)) {
            setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
            setLoader(false);
            return;
        }

        //validate nickname
        if (nickname.length > 0) {
            if (nickname.length < 2) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
            if (nickname.trim() !== nickname) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
            if (invalidWhitespacePattern.test(nickname)) {
                setError("ใส่ชื่อเล่นที่ถูกต้อง");
                setLoader(false);
                return;
            }
        }

        //validate date birthday
        if (
            (monthBirthday === 'เมษายน' ||
                monthBirthday === 'กันยายน' ||
                monthBirthday === 'พฤศจิกายน') &&
            Number(dateBirthday) > 30
        ) {
            setError("วันเกิดไม่ถูกต้อง ");
            setLoader(false);
            return;
        }
        if (
            monthBirthday === 'กุมภาพันธ์' &&
            Number(yearBirthday) % 4 === 0 &&
            Number(dateBirthday) > 29
        ) {
            setError("วันเกิดไม่ถูกต้อง");
            setLoader(false);
            return;
        } else if (
            monthBirthday === 'กุมภาพันธ์' &&
            Number(yearBirthday) % 4 !== 0 &&
            Number(dateBirthday) > 28
        ) {
            setError("วันเกิดไม่ถูกต้อง");
            setLoader(false);
            return;
        }

        //validate idCard and idCardDisabled
        if (idCard.length < 13 || idCard.length > 13 || !/^\d+$/.test(idCard)) {
            setErrorIdCard("เลขบัตรประจำตัวประชาชนให้ถูกต้อง");
            setError("เลขบัตรประจำตัวประชาชนให้ถูกต้อง");
            setLoader(false);
            return;
        }
        if (idCardDisabled.length < 13 || idCardDisabled.length > 13 || !/^\d+$/.test(idCardDisabled)) {
            setErrorIdCardDisabled("เลขบัตรประจำตัวเลขบัตรประจำตัวคนพิการให้ถูกต้อง");
            setError("เลขบัตรประจำตัวเลขบัตรประจำตัวคนพิการให้ถูกต้อง");
            setLoader(false);
            return;
        }

        //validate address
        if (addressIdCard.length < 2) {
            setError("ระบุที่อยู่ที่ตามบัตรประชาชนที่ถูกต้อง");
            setLoader(false);
            return;
        }
        if (address.length < 2) {
            setError("ระบุที่อยู่ที่ปัจจุบันที่ถูกต้อง");
            setLoader(false);
            return;
        }

        // //validate prefix
        // if(prefix){
        //     setErrorPrefix(false);
        // }


        const bodyData = {
            user,
            password,
            firstName,
            lastName,
            profile,
            typeDisabled,
            detailDisabled,
            university,
            email,
            prefix,
            nickname,
            sex,
            dateBirthday,
            monthBirthday,
            yearBirthday,
            nationality,
            religion,
            idCard,
            idCardDisabled,
            addressIdCard,
            addressIdCardProvince,
            addressIdCardAmphor,
            addressIdCardTambon,
            addressIdCardZipCode,
            address,
            addressProvince,
            addressAmphor,
            addressTambon,
            addressZipCode,
            tel,
            telEmergency,
            relationship,
            typePerson,
        };

        try {
            if (idCard !== dataUser.idCard || idCardDisabled !== dataUser.idCardDisabled) {
                const resCheckID = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkId`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ idCard, idCardDisabled })
                })

                if (!resCheckID.ok) {
                    setLoader(false);

                    throw new Error("Error fetch api checkuser.");
                }
                const { idCard: idCardExists, idCardDisabled: idCardDisabledExists } = await resCheckID.json();
                if (idCard !== dataUser.idCard && idCardDisabled !== dataUser.idCardDisabled) {

                    if (idCardExists && idCardDisabledExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }
                    if (idCardExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }
                    if (idCardDisabledExists) {
                        setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
                        setLoader(false);
                        return;
                    }
                } else if (idCard !== dataUser.idCard) {
                    if (idCardExists) {
                        setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
                        setErrorIdCardDisabled("");
                        setLoader(false);
                        return;
                    }
                } else if (idCardDisabled !== dataUser.idCardDisabled) {
                    if (idCardDisabledExists) {
                        setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
                        setErrorIdCard("");
                        setLoader(false);
                        return;
                    }
                }
            } else {
                setErrorIdCard("");
                setErrorIdCardDisabled("");
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${session?.user?.email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
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

        console.log("as");
    }

    //upload profile
    const [imageUrl, setImageUrl] = useState('');
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
            setProfile(imageUrl); // Assume setProfile is a function that updates profile state or context
        }

    }, [imageUrl]);


    //EditMode
    const [editMode, setEditMode] = useState(false);

    return (
        <div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
            <NavbarLogo title="ข้อมูลส่วนบุลคล" dataUser={dataUser} />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    <div className=" bg-white rounded-lg p-5 pb-10">

                        <form onSubmit={handleEditSubmit} className=" flex gap-x-10 gap-y-5 gap- flex-wrap">
                            <div className=" flex flex-col">
                                <label>คำนำหน้า <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => {
                                            setPrefix(e.target.value)
                                            setSex(e.target.value === "0" ? "" : e.target.value === "นาย" ? "ชาย" : "หญิง")
                                        }}
                                        className={` ${!editMode ? "  bg-gray-200 cursor-default " : "cursor-pointer"} w-32  border border-gray-400 py-2 px-4 rounded-lg`}
                                        placeholder='กรอกชื่อผู้ใช้'
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                        value={prefix || "0"}
                                    >
                                        <option value="0">-</option>
                                        <option value="นาย">นาย</option>
                                        <option value="นางสาว">นางสาว</option>
                                        <option value="นาง">นาง</option>

                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>ชื่อ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                    defaultValue={firstName || ""}
                                    readOnly={!editMode}
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>นามสกุล <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setLastName(e.target.value) }}
                                    defaultValue={lastName || ""}
                                    readOnly={!editMode}
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>ชื่อเล่น </label>
                                <input
                                    type="text"
                                    className={`placeholder ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} border-gray-400 mt-1 w-56 border py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setNickname(e.target.value) }}
                                    defaultValue={nickname || ""}
                                    placeholder="ระบุชื่อเล่น"
                                    readOnly={!editMode}
                                />
                            </div>
                            {prefix !== "0" && prefix && (
                                <div className="flex col flex-col">
                                    <label>เพศ</label>
                                    <p
                                        type="text"
                                        className='mt-1 w-32 border bg-gray-200 cursor-default border-gray-400 py-2 px-4 rounded-lg'
                                    >
                                        {sex}
                                    </p>
                                </div>
                            )}
                            {/* <div className=" flex flex-col">
                                <label>เพศ <span className="text-red-500">*</span></label>
                                <div className="mt-1 relative col w-fit">
                                    <select
                                        onChange={(e) => setSex(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default " : "cursor-pointer"} w-32 border border-gray-500 py-2 px-4 rounded-lg`}
                                        placeholder='กรอกชื่อผู้ใช้'
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                    >
                                        <option value="0">{sex || "-"}</option>
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div> */}
                            <div className=" flex flex-col ">
                                <label>วันเกิด <span className="text-red-500">*</span></label>
                                <div className="flex gap-3 flex-wrap">
                                    <div className="mt-1 relative col w-fit">
                                        <select
                                            onChange={(e) => setYearBirthday(e.target.value)}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={yearBirthday || "0"}
                                        >
                                            <option value="0">-</option>
                                            {years.map((y, index) => (
                                                <option key={index} value={y}>{y}</option>
                                            ))}
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                    <div className="mt-1 relative col w-fit">
                                        <select
                                            onChange={(e) => setMonthBirthday(e.target.value)}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={monthBirthday || "0"}
                                        >
                                            <option value="0">-</option>
                                            {yearToday === Number(yearBirthday) ? (
                                                filteredMonths.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            ) : (
                                                months.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            )}
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                    <div className="mt-1 relative col w-fit">
                                        <select
                                            onChange={(e) => setDateBirthday(e.target.value)}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-28 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={dateBirthday || "0"}
                                        >
                                            <option value="0">-</option>
                                            {yearToday === Number(yearBirthday) && monthNameToday === monthBirthday ? (
                                                filteredDate.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            ) : monthBirthday === 'เมษายน' || monthBirthday === 'กันยายน' || monthBirthday === 'มิถุนายน' || monthBirthday === 'พฤศจิกายน' ? (
                                                filteredDate30.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            ) : monthBirthday === 'กุมภาพันธ์' && Number(yearBirthday) % 4 === 0 ? (
                                                filteredDate29.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            ) : monthBirthday === 'กุมภาพันธ์' ? (
                                                filteredDate28.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            ) : (
                                                filteredDate31.map((m, index) => (
                                                    <option key={index} value={m}>{m}</option>
                                                ))
                                            )}

                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                            </div>
                            {yearBirthday !== "0" && monthBirthday !== "0" && dateBirthday !== "0" &&
                                yearBirthday && monthBirthday && dateBirthday && (
                                    <div className="flex col flex-col">
                                        <label>อายุ</label>
                                        <p
                                            type="text"
                                            className='mt-1 w-32 border bg-gray-200 cursor-default border-gray-400 py-2 px-4 rounded-lg'
                                        >
                                            {yearToday - yearBirthday} ปี
                                        </p>
                                    </div>
                                )}
                            <div className=" flex flex-col">
                                <label>สัญชาติ <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => setNationality(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                        value={nationality || "0"}
                                    >
                                        <option value="0">-</option>
                                        <option value="ไทย">ไทย</option>
                                        <option value="ฝรั่งเศษ">ฝรั่งเศษ</option>
                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label> ศาสนา <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select
                                        onChange={(e) => setReligion(e.target.value)}
                                        className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                                        style={{ appearance: 'none' }}
                                        disabled={!editMode}
                                        value={religion || "0"}
                                    >
                                        <option value="0">-</option>
                                        <option value="พุทธ">พุทธ</option>
                                        <option value="อิสลาม">อิสลาม</option>
                                        <option value="คริสต์">คริสต์</option>
                                    </select>
                                    <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className="flex col flex-col w-64">
                                <label>เลขบัตรประจำตัวประชาชน <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{13}"
                                    maxLength={13}
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setIdCard(e.target.value) }}
                                    defaultValue={idCard || ""}
                                    placeholder="เลขบัตร 13 หลัก"
                                    readOnly={!editMode}
                                />
                                {errorIdCard && (
                                    <div className="text-xs text-red-500 w-full text-end mt-1 ">
                                        {errorIdCard}
                                    </div>
                                )}
                            </div>
                            <div className="flex col flex-col w-64">
                                <label>เลขบัตรประจำตัวคนพิการ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{13}"
                                    maxLength={13}
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setIdCardDisabled(e.target.value) }}
                                    defaultValue={idCardDisabled || ""}
                                    placeholder="เลขบัตร 13 หลัก"
                                    readOnly={!editMode}
                                />
                                {errorIdCardDisabled && (
                                    <div className="text-xs text-red-500 w-full text-end mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                                        {errorIdCardDisabled}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
                                <div className="flex col flex-col">
                                    <label>ที่อยู่ตามบัตรประชาชน <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} w-72 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                        onChange={(e) => { setAddressIdCard(e.target.value) }}
                                        defaultValue={addressIdCard || ""}
                                        placeholder="บ้านเลขที่, หมู่บ้าน, หอพัก"
                                        readOnly={!editMode}
                                    />
                                </div>
                                <div className=" flex flex-col ">
                                    <label>จังหวัด <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            onChange={(e) => {
                                                setIDAddressIdCardProvince(e.target.value);
                                                setIDAddressIdCardAmphor("");
                                                setIDAddressIdCardTambon("");
                                                setAddressIdCardAmphor("");
                                                setAddressIdCardTambon("");
                                                setAddressIdCardZipCode("");
                                                setAddressIdCardProvince(dataProvince.find(p => p.id === parseInt(e.target.value))
                                                    .name_th)
                                            }}
                                            className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince))?.id || "0"}
                                        >
                                            <option value="0">-</option>
                                            {dataProvince.map((d, index) => (
                                                <option key={index} value={d.id}>{d.name_th}</option>
                                            ))}
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                {IDaddressIdCardProvince ? (
                                    <div className=" flex flex-col">
                                        <label>อำเภอ <span className="text-red-500">*</span></label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    setIDAddressIdCardAmphor(e.target.value);
                                                    setIDAddressIdCardTambon("");
                                                    setAddressIdCardTambon("");
                                                    setAddressIdCardZipCode("");
                                                    setAddressIdCardAmphor(dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince))
                                                        .amphure.find(a => a.id === parseInt(e.target.value)).name_th)
                                                }}
                                                className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor))?.id || "0"}
                                            >
                                                <option value="0">-</option>
                                                {dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.map((d, index) => (
                                                    <option key={index} value={d.id}>{d.name_th}</option>
                                                ))}
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                ) : null}
                                {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
                                    <div className=" flex flex-col">
                                        <label>ตำบล <span className="text-red-500">*</span></label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    setIDAddressIdCardTambon(e.target.value);
                                                    setAddressIdCardTambon(dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor))
                                                        .tambon.find(t => t.id === parseInt(e.target.value)).name_th)
                                                    setAddressIdCardZipCode(dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor))
                                                        .tambon.find(t => t.id === parseInt(e.target.value)).zip_code)
                                                }}
                                                className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor)).tambon.find(t => t.id === parseInt(IDaddressIdCardTambon))?.id || "0"}
                                            >
                                                <option value="0">-</option>
                                                {dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor)).tambon.map((d, index) => (
                                                    <option key={index} value={d.id}>{d.name_th}</option>
                                                ))}
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                ) : null}
                                {IDaddressIdCardProvince && IDaddressIdCardAmphor && IDaddressIdCardTambon ? (
                                    <div className=" flex flex-col ">
                                        <label>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                                        <div className=" col w-fit mt-1">
                                            <p
                                                className='focus:outline-none cursor-default w-36 bg-gray-200  border border-gray-400 py-2 px-4 rounded-lg'
                                            >
                                                {
                                                    addressIdCardZipCode || "-"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
                                <div className="flex col flex-col">
                                    <div className="flex gap-x-2">
                                        <label>ที่อยู่ปัจจุบัน <span className="text-red-500">*</span></label>
                                        <div className={`${!editMode ? "hidden" : ""} flex gap-x-1`}>
                                            <input
                                                onChange={(e) => CheckAddressSameIDCard(e.target.checked)}
                                                type="checkbox"
                                                className={`cursor-pointer w-3 h-full border`}
                                                checked={statusSameAddress}
                                            />
                                            <p>(ตามบัตรประชาชน)</p>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} w-72 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                        onChange={(e) => { setAddress(e.target.value) }}
                                        defaultValue={statusSameAddress ? addressIdCard : address || ""}
                                        placeholder="บ้านเลขที่, หมู่บ้าน, หอพัก"
                                        readOnly={!editMode}
                                    />
                                </div>
                                <div className=" flex flex-col">
                                    <label>จังหวัด <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            onChange={(e) => {
                                                setIDAddressProvince(e.target.value);
                                                setIDAddressAmphor("");
                                                setIDAddressTambon("");
                                                setAddressAmphor("");
                                                setAddressTambon("");
                                                setAddressZipCode("");
                                                setAddressProvince(dataProvince.find(p => p.id === parseInt(e.target.value))
                                                    .name_th)
                                            }}
                                            className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={statusSameAddress ?
                                                dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince))?.id
                                                : dataProvince.find(p => p.id === parseInt(IDaddressProvince))?.id || "0"}
                                        >
                                            <option value="0">-</option>
                                            {dataProvince.map((d, index) => (
                                                <option key={index} value={d.id}>{d.name_th}</option>
                                            ))}
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                {IDaddressProvince ? (
                                    <div className=" flex flex-col">
                                        <label>อำเภอ <span className="text-red-500">*</span></label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    setIDAddressAmphor(e.target.value);
                                                    setIDAddressTambon("");
                                                    setAddressTambon("");
                                                    setAddressZipCode("");
                                                    setAddressAmphor(dataProvince.find(p => p.id === parseInt(IDaddressProvince))
                                                        .amphure.find(a => a.id === parseInt(e.target.value)).name_th)
                                                }}
                                                className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={statusSameAddress ?
                                                    dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor))?.id
                                                    : dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.find(a => a.id === parseInt(IDaddressAmphor))?.id || "0"}
                                            >
                                                <option value="0">-</option>
                                                {dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.map((d, index) => (
                                                    <option key={index} value={d.id}>{d.name_th}</option>
                                                ))}
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                ) : null}
                                {(IDaddressProvince && IDaddressAmphor) ? (
                                    <div className=" flex flex-col">
                                        <label>ตำบล <span className="text-red-500">*</span></label>
                                        <div className="relative col w-fit mt-1">
                                            <select
                                                onChange={(e) => {
                                                    setIDAddressTambon(e.target.value);
                                                    setAddressTambon(dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.find(a => a.id === parseInt(IDaddressAmphor))
                                                        .tambon.find(t => t.id === parseInt(e.target.value)).name_th)
                                                    setAddressZipCode(dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.find(a => a.id === parseInt(IDaddressAmphor))
                                                        .tambon.find(t => t.id === parseInt(e.target.value)).zip_code)
                                                }}
                                                className={`${!editMode ? " bg-gray-200 cursor-default" : "cursor-pointer"} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                                                style={{ appearance: 'none' }}
                                                disabled={!editMode}
                                                value={statusSameAddress ?
                                                    dataProvince.find(p => p.id === parseInt(IDaddressIdCardProvince)).amphure.find(a => a.id === parseInt(IDaddressIdCardAmphor)).tambon.find(t => t.id === parseInt(IDaddressIdCardTambon))?.id
                                                    : dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.find(a => a.id === parseInt(IDaddressAmphor)).tambon.find(t => t.id === parseInt(IDaddressTambon))?.id || "0"}
                                            >
                                                <option value="0">-</option>
                                                {dataProvince.find(p => p.id === parseInt(IDaddressProvince)).amphure.find(a => a.id === parseInt(IDaddressAmphor)).tambon.map((d, index) => (
                                                    <option key={index} value={d.id}>{d.name_th}</option>
                                                ))}
                                            </select>
                                            <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                        </div>
                                    </div>
                                ) : null}
                                {(IDaddressProvince && IDaddressAmphor && IDaddressTambon) ? (
                                    <div className=" flex flex-col ">
                                        <label>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                                        <div className=" col w-fit mt-1">
                                            <p
                                                className={`focus:outline-none cursor-default w-36 bg-gray-200  border border-gray-400 py-2 px-4 rounded-lg`}
                                            >
                                                {
                                                    statusSameAddress ? addressIdCardZipCode : addressZipCode || "-"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex col flex-col">
                                <label>เบอร์ติดต่อ <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="\d{10}"
                                    maxLength={10}
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setTel(e.target.value) }}
                                    defaultValue={tel || ""}
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
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setTelEmergency(e.target.value) }}
                                    defaultValue={telEmergency || ""}
                                    placeholder="หมายเลขโทรศัพท์ 10 หลัก"
                                    readOnly={!editMode}
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>ความสัมพันธ์ </label>
                                <input
                                    type="text"
                                    className={` ${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : ""} w-60 mt-1 border border-gray-400 py-2 px-4 rounded-lg`}
                                    onChange={(e) => { setRelationship(e.target.value) }}
                                    defaultValue={relationship || ""}
                                    placeholder="บุลคลใกล้ชิด"
                                    readOnly={!editMode}
                                />
                            </div>
                            <div className="flex col flex-col">
                                <label>อีเมล์ <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className={`bg-gray-200 cursor-default focus:outline-none mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg`}
                                    value={email}
                                    readOnly
                                />
                            </div>
                            <div className="flex gap-x-10 gap-y-5 flex-wrap">
                                <div className=" flex flex-col">
                                    <label>ประเภทความพิการ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => {
                                            setSelectTypeDisabled(e.target.value);
                                        }}
                                            className={`${!editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} w-64  border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={selectTypeDisabled || "0"}
                                        >
                                            <option value="0">-</option>
                                            <option value="พิการ 1 ประเภท">พิการ 1 ประเภท</option>
                                            <option value="พิการมากกว่า 1 ประเภท">พิการมากกว่า 1 ประเภท</option>
                                        </select>
                                        <Icon className={`${!editMode ? "hidden" : ""} cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`} path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div style={{ display: selectTypeDisabled === "พิการ 1 ประเภท" ? "block" : "none" }} className=" flex flex-col">
                                    <label>เลือกความพิการ<span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select
                                            onChange={(e) => setTypeDisabled([e.target.value])}
                                            className={`${typeDisabled && !editMode ? "bg-gray-200 cursor-default" : "cursor-pointer"} whitespace-nowrap text-ellipsis overflow-hidden w-64  border border-gray-400 py-2 px-4 rounded-lg`}
                                            style={{ appearance: 'none' }}
                                            disabled={!editMode}
                                            value={typeDisabled[0] || "0"}
                                        >
                                            <option value="0">-</option>
                                            <option value="พิการทางการมองเห็น">พิการทางการมองเห็น</option>
                                            <option value="พิการทางการได้ยินหรือสื่อความหมาย">พิการทางการได้ยินหรือสื่อความหมาย</option>
                                            <option value="พิการทางการเคลื่อนไหวหรือทางร่างกาย">พิการทางการเคลื่อนไหวหรือทางร่างกาย</option>
                                            <option value="พิการทางจิตใจหรือพฤติกรรม">พิการทางจิตใจหรือพฤติกรรม</option>
                                            <option value="พิการทางสติปัญญา">พิการทางสติปัญญา</option>
                                            <option value="พิการทางการเรียนรู้">พิการทางการเรียนรู้</option>
                                            <option value="พิการทางการออทิสติก">พิการทางการออทิสติก</option>
                                        </select>
                                    </div>
                                </div>
                                <div className=" flex flex-col my-5" style={{ display: selectTypeDisabled === "พิการมากกว่า 1 ประเภท" ? "block" : "none" }} >
                                    <div className={`${!typeDisabled.includes('พิการทางการมองเห็น') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className={`cursor-pointer w-10  border`}
                                            onChange={() => handleCheckboxChange('พิการทางการมองเห็น')}
                                            checked={typeDisabled.includes('พิการทางการมองเห็น')}
                                            hidden={!editMode}
                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางการมองเห็น</p>
                                    </div>
                                    <div className={`${!typeDisabled.includes('พิการทางการได้ยินหรือสื่อความหมาย') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางการได้ยินหรือสื่อความหมาย')}
                                            checked={typeDisabled.includes('พิการทางการได้ยินหรือสื่อความหมาย')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางการได้ยินหรือสื่อความหมาย</p>
                                    </div>
                                    <div className={`${!typeDisabled.includes('พิการทางการเคลื่อนไหวหรือทางร่างกาย') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางการเคลื่อนไหวหรือทางร่างกาย')}
                                            checked={typeDisabled.includes('พิการทางการเคลื่อนไหวหรือทางร่างกาย')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางการเคลื่อนไหวหรือทางร่างกาย</p>
                                    </div>
                                    <div className={`${!typeDisabled.includes('พิการทางจิตใจหรือพฤติกรรม') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางจิตใจหรือพฤติกรรม')}
                                            checked={typeDisabled.includes('พิการทางจิตใจหรือพฤติกรรม')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางจิตใจหรือพฤติกรรม</p>
                                    </div>
                                    <div className={`${!typeDisabled.includes('พิการทางสติปัญญา') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางสติปัญญา')}
                                            checked={typeDisabled.includes('พิการทางสติปัญญา')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางสติปัญญา</p>
                                    </div>

                                    <div className={`${!typeDisabled.includes('พิการทางการเรียนรู้') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางการเรียนรู้')}
                                            checked={typeDisabled.includes('พิการทางการเรียนรู้')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางการเรียนรู้</p>
                                    </div>
                                    <div className={`${!typeDisabled.includes('พิการทางการออทิสติก') && !editMode ? "hidden" : ""} flex gap-x-3 mt-2`}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer w-10  border"
                                            onChange={() => handleCheckboxChange('พิการทางการออทิสติก')}
                                            checked={typeDisabled.includes('พิการทางการออทิสติก')}
                                            hidden={!editMode}

                                        />
                                        <p className="text-ellipsis overflow-hidden whitespace-nowrap"><span className={`${editMode ? "hidden" : ""}`}>-</span> พิการทางการออทิสติก</p>
                                    </div>
                                </div>
                                <div className="flex col flex-col ">
                                    <label>รายละเอียดเพิ่มเติม </label>
                                    <input
                                        type="text"
                                        className={`${!editMode ? "bg-gray-200 cursor-default focus:outline-none" : " "} border-gray-400 mt-1 w-60 border py-2 px-4 rounded-lg`}
                                        onChange={(e) => { setDetailDisabled(e.target.value) }}
                                        defaultValue={detailDisabled || ""}
                                        placeholder="เพิ่มเติม (ถ้ามี)"
                                        readOnly={!editMode}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex">
                                <div className="flex col flex-col ">
                                    <label className={`${!editMode ? "hidden" : ""}`}>อัปโหลดรูปโปรไฟล์ <span className="text-red-500">*</span></label>

                                    <div className="w-32 h-32 relative my-1">
                                        <Image onClick={editMode ? openFileDialog: null}  
                                            className="w-full h-full cursor-pointer"
                                            src={profile || imageUrl || "/image/main/user.png"}
                                            height={1000}
                                            width={1000}
                                            alt="profile"
                                            priority
                                        />
                                        {(uploadProgress > 0 && uploadProgress < 100) && (
                                            <div className="text-white absolute  border top-0 w-full flex flex-col justify-center items-center h-full bg-black opacity-40">
                                                <PulseLoader color="#F97201" size={10} />
                                            </div>
                                        )}

                                    </div>

                                    <div className={`${!editMode ? "hidden" : ""} mt-1 flex items-center`}>
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
                            {error ? (
                                <div className="text-red-500">
                                    * {error}
                                </div>
                            ) : null}
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
                                <div className=" flex w-full justify-center mt-5">
                                    <div onClick={() => setEditMode(true)} className='hover:cursor-pointer bg-[#ffb74c] text-white py-2 px-6  rounded-2xl flex justify-center items-center gap-1'>
                                        <Icon path={mdiAccountEdit} size={1} />
                                        <p>แก้ไขข้อมูล</p>
                                    </div>
                                </div>
                            )}

                        </form>


                    </div>
                </div>
            </div >


        </div >
    )
}

export default EditPersonal