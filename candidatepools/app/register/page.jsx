import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountEdit } from '@mdi/js';
import { mdiCloseCircle } from '@mdi/js';

function Register() {
    return (
        <div className='flex justify-center mt-10'>
            <form className='flex flex-col justify-center items-center'>
                <div className='w-96 self-end text-center'>
                    <h1 className='text-2xl font-bold'>ลงทะเบียนเข้าใช้งาน</h1>
                </div>
                <div className='mt-7 w-[35rem] font-bold  flex justify-between items-center'>
                    <label> Username:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label> Password:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label> Password Confirm:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label> ชื่อสกุล</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label> ประเภทความพิการ:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label>มหาวิทยาลัย:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>
                <div className='mt-4 w-[35rem] font-bold  flex justify-between items-center'>
                    <label>Email:</label>
                    <input type="text" className='w-96 border border-gray-500 py-2 px-5 rounded-lg' placeholder='กรอกชื่อผู้ใช้' />
                </div>

                <div className=' w-96 self-end mt-10 flex justify-between'>
                    <div className='hover:cursor-pointer bg-[#F97201] text-white py-1 px-10 rounded-lg flex justify-center items-center gap-1'>
                        <Icon path={mdiCloseCircle} size={1} />
                        <p>ยกเลิก</p>
                    </div>
                    <div className='hover:cursor-pointer bg-[#75C7C2] text-white py-1 px-10 rounded-lg flex justify-center items-center gap-1'>
                        <Icon path={mdiAccountEdit} size={1} />
                        <p>ลงทะเบียน</p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
