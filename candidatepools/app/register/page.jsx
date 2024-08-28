"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountEdit, mdiArrowDownDropCircle, mdiCloseCircle } from '@mdi/js';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NavbarLogo from '../components/NavbarLogo';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import { useSession } from 'next-auth/react';

function Register() {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [typeUser, setTypeUser] = useState('');
    const [university, setUniversity] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    //validate session
    const { status, data: session } = useSession();
    const router = useRouter()
    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (session) {
            router.replace('/main')
        };
    }, [session], [router])

    //loader
    const [loader, setLoader] = useState(true)
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

    //submit register
    async function handleRegister(e) {
        e.preventDefault();
        setLoader(true);

        if (!user || !password || !confirmPassword || !firstName || !lastName || !typeUser || !university || !email) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            setLoader(false);
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์พิเศษอย่างน้อย 1 ตัว และความยาวไม่ต่ำกว่า 8 ตัวอักษร');
            setLoader(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            setLoader(false);
            return;
        }

        if (typeUser === '0') {
            setError('กรุณาเลือกประเภทความพิการ');
            setLoader(false);
            return;
        }

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

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, password, firstName, lastName, typeUser, university, email })
            })

            if (res.ok) {
                setLoader(false);
                Swal.fire({
                    title: "ลงทะเบียนสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#0d96f8",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/');
                    }
                });
            } else {
                setLoader(false);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#f27474",
                });
            }



        } catch (err) {
            setLoader(false);
            console.log(err);
        }


    }

    return (
        <div>
            <NavbarLogo />
            <div className='text-sm flex justify-center mt-10'>
                <form onSubmit={handleRegister} className='flex flex-col justify-center items-center'>
                    <div className='w-96 self-end text-center'>
                        <h1 className='text-2xl font-bold'>ลงทะเบียนเข้าใช้งาน</h1>
                    </div>
                    <div className=' mt-7 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> Username:</label>
                        <input onChange={(e) => setUser(e.target.value)} type="text" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกรายละเอียด' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> Password:</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> Password Confirm:</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='ยืนยันรหัสผ่าน' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> ชื่อ:</label>
                        <input onChange={(e) => setFirstName(e.target.value)} type="text" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกรายละเอียด' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> สกุล:</label>
                        <input onChange={(e) => setLastName(e.target.value)} type="text" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกรายละเอียด' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label> ประเภทความพิการ:</label>
                        <div className="relative ">
                            <select onChange={(e) => setTypeUser(e.target.value)} className='cursor-pointer w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                <option value="0">เลือกประเภทความพิการ</option>
                                <option value="พิการทางการมองเห็น">พิการทางการมองเห็น</option>
                                <option value="พิการทางการได้ยินหรือสื่อความหมาย">พิการทางการได้ยินหรือสื่อความหมาย</option>
                                <option value="พิการทางการเคลื่อนไหวหรือทางร่างกาย">พิการทางการเคลื่อนไหวหรือทางร่างกาย</option>
                                <option value="พิการทางจิตใจหรือพฤติกรรม">พิการทางจิตใจหรือพฤติกรรม</option>
                                <option value="พิการทางสติปัญญา">พิการทางสติปัญญา</option>
                                <option value="พิการทางการเรียนรู้">พิการทางการเรียนรู้</option>
                                <option value="พิการทางการออทิสติก">พิการทางการออทิสติก</option>
                            </select>
                            <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                        </div>

                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label>มหาวิทยาลัย:</label>
                        <input onChange={(e) => setUniversity(e.target.value)} type="text" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกรายละเอียด' />
                    </div>
                    <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                        <label>Email:</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" className='w-96 border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                    </div>
                    {error ? (
                        <div className="mt-3  text-red-400  w-96 self-end">
                            *{error}
                        </div>
                    ) : null}
                    <div className=' w-96 self-end mt-10 flex justify-between'>
                        <Link href="/" className='hover:cursor-pointer bg-[#F97201] text-white py-1 px-10 rounded-lg flex justify-center items-center gap-1'>
                            <Icon path={mdiCloseCircle} size={1} />
                            <p>ยกเลิก</p>
                        </Link>
                        <button type='submit' className='hover:cursor-pointer bg-[#75C7C2] text-white py-1 px-10 rounded-lg flex justify-center items-center gap-1'>
                            <Icon path={mdiAccountEdit} size={1} />
                            <p>ลงทะเบียน</p>
                        </button>
                    </div>
                </form>
            </div>
            <div className={loader ? "" : "hidden"}>
                <Loader />
            </div>
        </div>
    )
}

export default Register
