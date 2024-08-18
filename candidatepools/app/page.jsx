import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex text-sm justify-center gap-32 mt-10 items-center ">
      <Image className="w-80 h-80" src="/image/main/postermain.png" height={1000} width={1000} priority></Image>
      <div >
        <div className="flex ">
          <div className="hover:cursor-pointer text-center w-6/12 bg-[#F97201] text-white font-thin px-7 rounded-lg py-3">
            นักศึกษาพิการ
          </div>
          <div className="hover:cursor-pointer text-center w-6/12 bg-[#75C7C2] text-white font-thin px-7 rounded-lg py-3">
            ผู้ดูแลระบบ
          </div>
        </div>
        <form className="relative bottom-[5px] rounded-lg bg-white p-14 flex flex-col justify-center items-center ">
          <p>เข้าสู่ระบบสำหรับผู้ใช้งาน</p>
          <div className="mt-7 flex flex-col gap-5">
            <input className="w-72 border py-2 px-5 rounded-lg" type="text" placeholder="อีเมล์" />
            <div className="relative">
              <input className="w-72 border py-2 px-5 rounded-lg" type="password" placeholder="รหัสผ่าน" />
              <Image className="hover:cursor-pointer absolute top-[11px] right-5 w-4 h-4" src="/image/main/eye.png" height={1000} width={1000} priority></Image>
            </div>
          </div>
          <div className="self-end mt-4">
            <Link className="text-blue-500 hover:cursor-pointer hover:underline" href="#">ลืมรหัสผ่าน ?</Link>
          </div>
          <div className="mt-5">
            <button className="bg-[#F97201] text-white py-2 px-5 rounded-lg" type="submit">เข้าสู่ระบบ</button>
          </div>
          <p className="mt-4">ยังไม่ได้เป็นสมาชิก?
            <Link className="mx-2 text-[#F97201] hover:cursor-pointer hover:underline" href="/register">
              สมัครสมาชิก
            </Link>
          </p>
          <div className="mt-5 flex  justify-center flex-col items-center">
            <hr className="border-black border  w-64" />
            <p className="bg-white p-1 absolute">หรือ</p>
          </div>
          <div className="mt-8 text-gray-400 flex flex-col gap-3">
            <div className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex">
              <Image className="w-5 h-5" src="/image/main/google.png" height={1000} width={1000} priority></Image>
              <p >เข้าสู่ระบบด้วย Google</p>
            </div>
            <div  className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex">
              <Image className="w-5 h-5" src="/image/main/line.png" height={1000} width={1000} priority></Image>
              <p >เข้าสู่ระบบด้วย Line</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
