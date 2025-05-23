"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

//sweetalert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//components
import InputLogin from "../components/Login/InputLogin";
import HeaderLogo from "../components/HeaderLogo";
import TextError from "../components/TextError";

import { useTheme } from "../ThemeContext";

//store
import { useCredentialStore } from "@/stores/useCredentialStore";

//toast
import { toast } from "react-toastify";

const MySwal = withReactContent(Swal);

function page() {
  const { bgColorMain, bgColor, bgColorMain2, fontSize } = useTheme();

  const router = useRouter();
  //store
  const { resetPassword } = useCredentialStore();

  //params
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setError("");

    const { ok, error: apiError } = await resetPassword({
      token,
      newPassword: password,
    });

    if (ok) {
      toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      router.push("/");
    } else {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <>
      <HeaderLogo />
      <div
        className={`${bgColorMain} ${bgColor} flex h-screen w-screen justify-center`}
      >
        <form
          onSubmit={handleSubmit}
          className={`${bgColorMain2}  rounded-b-lg p-5 w-fit h-fit flex flex-col gap-3 rounded-lg mt-24`}
        >
          <p className="text-center">รีเซ็ครหัสผ่านใหม่</p>
          <div className="flex flex-col gap-1 mt-2">
            <label>รหัสผ่านใหม่</label>
            <InputLogin
              value={password}
              setValue={setPassword}
              type={"password"}
              placeholder="กรอกรหัสผ่านใหม่ของคุณ"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>ยืนยันรหัสผ่านใหม่</label>
            <InputLogin
              value={confirmPassword}
              setValue={setConfirmPassword}
              type={"password"}
              placeholder="กรอกรหัสผ่านใหม่ของคุณอีกครั้ง"
            />
          </div>
          {error && <TextError text={error} />}
          <button
            type="submit"
            className={`${fontSize} bg-[#F97201] text-white py-2 px-5 rounded-lg mt-5`}
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </>
  );
}

export default page;
