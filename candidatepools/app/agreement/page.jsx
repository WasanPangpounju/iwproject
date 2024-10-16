"use client"

import React, { useState,useEffect } from 'react'
import NavbarLogo from '../components/NavbarLogo'
import Icon from '@mdi/react';
import { mdiAccountEdit } from '@mdi/js';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import Register from '../register/page';
import Loader from '../components/Loader';
import { useSession } from 'next-auth/react';
import { useTheme } from '../ThemeContext';

function Agreement() {

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

    const [statusAgreement, setStatusAgreement] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [loader,setLoader] = useState(true);

    function handleAgreement() {
        const temp = document.getElementById('checkStatus').checked

        if (temp) {
            router.replace('/register')
            setStatusAgreement(temp);
        } else {
            setError('คุณไม่ได้ยอมรับเงื่อนไขการใช่้งานบริการ');
        }
    }
    
    //check session
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState(null);
    // Validate session and fetch user data
    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        setLoader(false);

        if (session?.user?.id) {
            getUser(session.user.id);
        } 

    }, [status, session, router]);
    useEffect(() => {
        if(!dataUser) return;

        if(dataUser.university){
            router.replace("/main")
        }

    },[dataUser])

     // Fetch user data from API
     async function getUser(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`, {
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

    //loader
    useEffect(() => {
        setLoader(false);
    }, [])
    useEffect(() => {
        if (loader) {
            document.body.classList.add('no_scroll')
        } else {
            document.body.classList.remove('no_scroll')
        }
    }, [loader])

    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
            {statusAgreement ? (
                <Register statusAgreement={statusAgreement}/>
            ) : (
                <div>
                    <NavbarLogo />
                    <div className="w-full flex justify-center">
                        <div className="p-10 max-w-screen-xl">
                            <div className={`${bgColorMain2} p-10 rounded-lg`}>
                                <p className="text-lg font-extrabold text-center">เงื่อนไขข้อตกลงการใช้บริการสำหรับผู้หางาน และ/หรือ ผู้สมัคร</p>
                                <div className="my-10">
                                    <p style={{ textIndent: "2.5rem" }}>
                                        เงื่อนไขและข้อตกลงที่ระบุไว้ดังต่อไปนี้ (ต่อไปนี้จะเรียกว่า “เงื่อนไขข้อตกลงการใช้บริการ”) เป็นสัญญาระหว่าง บริษัท ทิงค์เน็ต จำกัด (ต่อไปนี้เรียกว่า “บริษัท”) ในฐานะผู้ให้บริการค้นหางาน และ/หรือ สมัครงานสำหรับผู้หางาน และค้นประวัติ และ/หรือ ประกาศรับสมัครงานสำหรับผู้ประกอบการ โดยผ่านทางเว็บไซต์ และ/หรือ แอปพลิเคชันต่าง ๆ ของ JobThai กับผู้หางาน และ/หรือ ผู้สมัคร ในฐานะผู้ใช้บริการ โปรดอ่านข้อตกลงนี้อย่างละเอียดและครบถ้วน
                                    </p>
                                    <p style={{ textIndent: "2.5rem" }}>คำจำกัดความ</p>
                                    <p>
                                        ภายใต้เงื่อนไขข้อตกลงการใช้บริการฉบับนี้ นอกจากจะกำหนดไว้เป็นอย่างอื่น “คำ” และ “ข้อความ” ใด ๆ ดังต่อไปนี้ ให้มีความหมายตามที่กำหนดไว้ด้านล่าง
                                        “JobThai”หมายถึง บริการค้นหางาน และ/หรือ สมัครงานสำหรับผู้หางาน และค้นประวัติ และ/หรือ ประกาศรับสมัครงานสำหรับผู้ประกอบการ โดยผ่านทางเว็บไซต์ และ/หรือ แอปพลิเคชัน รวมถึงผลิตภัณฑ์ต่าง ๆ ที่อาจมีขึ้นในอนาคตของ JobThai“การโฆษณา”หมายถึง การประกาศรับสมัครงานโดยมีวัตถุประสงค์เพื่อหาบุคคลเข้าทำงานในตำแหน่งใด ๆ รวมถึงการโฆษณาในรูปแบบใด ๆ ที่ปรากฏอยู่บน JobThai“ข้อมูล”หมายถึง ข้อความ ไฟล์เสียง เพลง รูปภาพ วิดีโอ และสิ่งอื่น ๆ ที่คล้ายคลึงกัน“ผู้หางาน”หมายถึง ผู้ใช้บริการ JobThai เพื่อวัตถุประสงค์ในการหางาน ซึ่งรวมถึงผู้ใช้บริการที่ได้สมัครเป็นสมาชิกกับ JobThai และผู้ใช้บริการที่ไม่ได้สมัครเป็นสมาชิกกับ JobThai“ผู้สมัคร”หมายถึง ผู้ที่ยื่นสมัครงานตามตำแหน่งที่ปรากฏหรือโฆษณาบน JobThai“ผู้ประกอบการ”หมายถึง บุคคลธรรมดา หรือนิติบุคคลที่จดทะเบียนถูกต้องตามกฎหมาย โดยรวมถึง ห้างหุ้นส่วนจำกัด บริษัทจำกัด บริษัทมหาชนจำกัด และ/หรือ นิติบุคคลตามกฎหมายชนิดอื่น ๆ ที่สมัครสมาชิกกับ JobThai“ชื่อผู้ใช้”หมายถึง อีเมลที่ผู้หางานกำหนดขึ้น และได้รับอนุมัติเพื่อใช้เข้าสู่การให้บริการของ JobThai“รหัสผ่าน”หมายถึง รหัสที่ผู้หางานกำหนดขึ้น และได้รับอนุมัติเพื่อใช้เข้าสู่การให้บริการของ JobThai“บริการ”หมายถึง บริการที่นำเสนอบน JobThai รวมถึงการนำเสนอข้อมูลข่าวสารที่เป็นประโยชน์ต่อ ผู้ประกอบการ ผู้หางาน และ/หรือ บุคคลทั่วไป โดยมีทั้งแบบมีค่าใช้จ่ายและไม่มีค่าใช้จ่าย“ประวัติ JobThai”หมายถึง ประวัติส่วนบุคคลของผู้หางาน รวมถึงประวัติการศึกษา ประสบการณ์การทำงานที่ถูกจัดทำโดยผู้หางาน ซึ่งถูกจัดเก็บไว้ในระบบ JobThai โดยความยินยอมของเจ้าของข้อมูล“ใบสมัคร”หมายถึง ใบสมัครที่ผู้หางาน และ/หรือ ผู้สมัครทำขึ้นตามตำแหน่งงานที่ปรากฏหรือโฆษณาบน JobThai
                                    </p>
                                </div>
                                <div className={`${fontSize} flex gap-3 justify-center`}>
                                    <input id="checkStatus" type="checkbox" />
                                    <p>ยอมรับเงื่อนไขการใช้บริการและอนุญาตการใช้ข้อมูล</p>
                                </div>
                                {error && (
                                    <p className="text-center text-red-500 mt-5">* {error}</p>
                                )}

                                <div className="flex justify-center mt-10">
                                    <button onClick={handleAgreement} type='submit' className='hover:cursor-pointer bg-[#75C7C2] text-white py-1 px-10 rounded-lg flex justify-center items-center gap-1'>
                                        <Icon path={mdiAccountEdit} size={1} />
                                        <p>ลงทะเบียน</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
             <div className={loader ? "" : "hidden"}>
                <Loader />
            </div>
        </div>
    )
}

export default Agreement
