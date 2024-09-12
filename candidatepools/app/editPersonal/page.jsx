"use client"

import React from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'
import Loader from '../components/Loader'
import { useState, useEffect } from 'react'
import Icon from '@mdi/react';
import { mdiArrowDownDropCircle } from '@mdi/js';

function EditPersonal() {

    const [dataUser, setDataUser] = useState(null);
    const [loader, setLoader] = useState(true);

    const [typeName, setTypeName] = useState("")
    const [typeDisabled, setTypeDisabled] = useState("")

    useEffect(() => {
        setLoader(false);
    })
    return (
        <div>
            <NavbarLogo />
            <div className="flex">
                <NavbarMain status="edit" />
                <div className="w-10/12 px-7 py-5">
                    <div className=" bg-white rounded-lg p-5">
                        <form className="flex gap-x-10 gap-y-5 gap- flex-wrap">
                            <div className=" flex flex-col">
                                <label>คำนำหน้า <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select onChange={(e) => setTypeName(e.target.value)} className='w-32 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                        <option value="0"></option>
                                        <option value="นาย">นาย</option>
                                        <option value="นางสาว">นางสาว</option>
                                        <option value="นาง">นาง</option>
                                    </select>
                                    <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>ชื่อ <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>นามสกุล <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>ชื่อเล่น <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className=" flex flex-col">
                                <label>เพศ <span className="text-red-500">*</span></label>
                                <div className="mt-1 relative col w-fit">
                                    <select onChange={(e) => setTypeName(e.target.value)} className='w-32 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                        <option value="0"></option>
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                    </select>
                                    <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label>วันเกิด <span className="text-red-500">*</span></label>
                                <div className="flex gap-3">
                                    <div className="mt-1 relative col w-fit">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-20 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' style={{ appearance: 'none' }}>
                                            <option value="0">วัน</option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                    <div className="mt-1 relative col w-fit">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' style={{ appearance: 'none' }}>
                                            <option value="0">เดือน</option>

                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                    <div className="mt-1 relative col w-fit">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-32 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' style={{ appearance: 'none' }}>
                                            <option value="0">ปี</option>

                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>อายุ</label>
                                <input type="text" className='mt-1 w-32 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className=" flex flex-col">
                                <label>สัญชาติ <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select onChange={(e) => setTypeName(e.target.value)} className='w-32 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                        <option value="0"></option>
                                    </select>
                                    <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label> ศาสนา <span className="text-red-500">*</span></label>
                                <div className="relative col w-fit mt-1">
                                    <select onChange={(e) => setTypeName(e.target.value)} className='w-32 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                        <option value="0"></option>
                                    </select>
                                    <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>เลขบัตรประจำตัวประชาชน <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-64 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>เลขบัตรประจำตัวคนพิการ <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-64 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div> 
                            <div className="flex gap-x-10 flex-wrap">
                                <div className="flex col flex-col">
                                    <label>ที่อยู่ตามบัตรประชาชน <span className="text-red-500">*</span></label>
                                    <input type="text" className='mt-1 w-72 border border-gray-400 py-2 px-4 rounded-lg' />
                                </div>
                                <div className=" flex flex-col">
                                    <label>จังหวัด <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>อำเภอ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>ตำบล <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-x-10 flex-wrap">
                                <div className="flex col flex-col">
                                    <div className="flex gap-x-2">
                                        <label>ที่อยู่ปัจจุบัน <span className="text-red-500">*</span></label>
                                        <div className="flex gap-x-1">
                                            <input type="checkbox" className="cursor-pointer w-3 h-full border" />
                                            <p>(ตามบัตรประชาชน)</p>
                                        </div>
                                    </div>
                                    <input type="text" className='mt-1 w-72 border border-gray-400 py-2 px-4 rounded-lg' />
                                </div>
                                <div className=" flex flex-col">
                                    <label>จังหวัด <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>อำเภอ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>ตำบล <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col">
                                    <label>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeName(e.target.value)} className='w-36 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' placeholder='กรอกชื่อผู้ใช้' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex col flex-col">
                                <label>เบอร์ติดต่อ <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>เบอร์ติดต่อฉุกเฉิน <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>ความสัมพันธ์ <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex col flex-col">
                                <label>อีเมล์ <span className="text-red-500">*</span></label>
                                <input type="text" className='mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg' />
                            </div>
                            <div className="flex gap-x-10 flex-wrap">
                                <div className=" flex flex-col">
                                    <label>ประเภทความพิการ <span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeDisabled(e.target.value)} className='w-64 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                            <option value="พิการ1ประเภท">พิการ 1 ประเภท</option>
                                            <option value="พิการมากกว่า1ประเภท">พิการมากกว่า 1 ประเภท</option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div style={{ display: typeDisabled === "พิการ1ประเภท" ? "block" : "none" }} className=" flex flex-col">
                                    <label>เลือกความพิการ<span className="text-red-500">*</span></label>
                                    <div className="relative col w-fit mt-1">
                                        <select onChange={(e) => setTypeDisabled(e.target.value)} className='w-64 cursor-pointer border border-gray-400 py-2 px-4 rounded-lg' style={{ appearance: 'none' }}>
                                            <option value="0"></option>
                                        </select>
                                        <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                                    </div>
                                </div>
                                <div className=" flex flex-col" style={{ display: typeDisabled === "พิการมากกว่า1ประเภท" ? "block" : "none" }} >
                                    <div className="flex gap-x-3 mt-5">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางการมองเห็น</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางการได้ยินหรือสื่อความหมาย</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางการเคลื่อนไหวหรือทางร่างกาย</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางจิตใจหรือพฤติกรรม</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางสติปัญญา</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางการเรียนรู้</p>
                                    </div>
                                    <div className="flex gap-x-3 mt-2">
                                        <input type="checkbox" className="cursor-pointer w-10  border" />
                                        <p>พิการทางการออทิสติก</p>
                                    </div>
                                </div>
                                <div className="flex col flex-col ">
                                    <label>รายละเอียดเพิ่มเติม </label>
                                    <input type="text" className='mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg' />
                                </div>
                            </div>
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
    )
}

export default EditPersonal
