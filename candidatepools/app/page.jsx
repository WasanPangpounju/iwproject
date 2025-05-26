"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./ThemeContext";
import HeaderLogo from "./components/HeaderLogo";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Footer from "./components/Footer";
import React from "react";

//stores
import { useCredentialStore } from "@/stores/useCredentialStore";

//hooks
import useRoleRedirect from "@/hooks/useRoleRedirect";

//SweetAlert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

//store
import useAppStore from "@/stores/useAppStore";
const MySwal = withReactContent(Swal);

export default function Home() {
  //store
  const { forgotPassword } = useCredentialStore();
  const { setLoading } = useAppStore();

  const {
    fontSize,
    bgColor,
    bgColorMain,
    bgColorMain2,
    lineBlack,
    textBlue,
    registerColor,
  } = useTheme();

  useRoleRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //eye show password
  const [showPassword, setShowPassword] = useState(false);

  //set change login mod user and admin
  const [loginMod, setLoginMod] = useState("user");

  //submit login
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("กรุณากรอก อีเมลและรหัสผ่านของคุณ");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        loginMod,
        redirect: false,
      });

      if (res.error) {
        try {
          const resCheckUser = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/validateUser`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

          if (!resCheckUser.ok) {
            throw new Error("Error fetching API to check user.");
          }

          const { user } = await resCheckUser.json();

          if (user) {
            setError("รหัสผ่านของคุณไม่ถูกต้อง");
          } else {
            setError("อีเมลหรือชื่อผู้ใช้ของคุณไม่ถูกต้อง");
          }
        } catch (err) {
          setError("เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้");
          console.error("Error fetching API in register: ", err);
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดกรุณาลองใหม่ในภายหลัง");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  //forgot Password
  const handleForgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: "ลืมรหัสผ่าน",
      input: "email",
      inputLabel: "กรอกอีเมลที่ลงทะเบียนไว้",
      inputPlaceholder: "yourname@example.com",
      confirmButtonText: "ส่งลิงก์รีเซ็ตรหัสผ่าน",
      showCancelButton: true,
      confirmButtonColor: "#F97201",
      cancelButtonColor: "#ccc",
    });

    if (email) {
      try {
        const res = await forgotPassword(email);

        if (!res.ok) throw new Error(`ส่งอีเมลไม่สำเร็จ ${res.statusText}`);

        MySwal.fire({
          title: "ส่งลิงก์แล้ว",
          text: "โปรดตรวจในจดหมายขยะของคุณ",
          icon: "success",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0d96f8",
        });
      } catch (err) {
        MySwal.fire({
          title: "เกิดข้อผิดพลาด",
          text: err.message,
          icon: "error",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#f27474",
        });
      }
    }
  };
  return (
    <div className={`${bgColorMain} ${bgColor}`}>
      <HeaderLogo />
      <div className="flex text-sm justify-center gap-20 mt-10 items-center ">
        <Image
          alt="poster"
          className="w-96 h-96"
          src="/image/main/postermain.png"
          height={1000}
          width={1000}
          priority
        />
        <div className={`${bgColorMain2} rounded-b-lg`}>
          <div className="flex ">
            <div
              onClick={() => {
                setLoginMod("user");
                setEmail("");
                setPassword("");
                setError("");
              }}
              className={`${
                loginMod === "user" ? "bg-[#F97201]" : "bg-[#75C7C2]"
              } ${fontSize} hover:cursor-pointer text-center w-6/12  text-white font-thin px-7 rounded-lg py-3`}
            >
              นักศึกษาพิการ
            </div>
            <div
              onClick={() => {
                setLoginMod("admin");
                setEmail("");
                setPassword("");
                setError("");
              }}
              className={`${
                loginMod === "admin" ? "bg-[#F97201]" : "bg-[#75C7C2]"
              } ${fontSize} hover:cursor-pointer text-center w-6/12  text-white font-thin px-7 rounded-lg py-3`}
            >
              ผู้ดูแลระบบ
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className={`relative bottom-[5px] rounded-lg ${bgColorMain} p-14 flex flex-col justify-center items-center `}
          >
            <p className={`${fontSize}`}>
              {loginMod === "user"
                ? "เข้าสู่ระบบสำหรับผู้สมัครงาน"
                : "เข้าสู่ระบบสำหรับผู้ดูแลระบบ"}
            </p>
            <div className="mt-7 flex flex-col gap-5">
              <input
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                className={`${bgColorMain} ${fontSize} w-72 border py-2 px-5 rounded-lg`}
                type="text"
                placeholder="อีเมล์ หรือ ชื่อผู้ใช้"
              />
              <div className="relative">
                <input
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${bgColorMain} ${fontSize} w-72 border py-2 px-5 rounded-lg`}
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                />
                <Image
                  onClick={(e) => setShowPassword((e) => !e)}
                  alt="icon-eye"
                  className="hover:cursor-pointer absolute top-[11px] right-5 w-4 h-4"
                  src="/image/main/eye.png"
                  height={1000}
                  width={1000}
                  priority
                />
              </div>
            </div>

            {error ? (
              <div className="self-start mt-3 text-red-500">*{error}</div>
            ) : null}
            {loginMod === "user" ? (
              <div className="self-end mt-4">
                <div
                  // className="text-blue-500 hover:cursor-pointer hover:underline"
                  className={`${textBlue} ${fontSize} hover:cursor-pointer hover:underline`}
                  onClick={handleForgotPassword}
                >
                  ลืมรหัสผ่าน ?
                </div>
              </div>
            ) : (
              <div className="self-end mt-4">
                <div
                  // className="text-blue-500 hover:cursor-pointer hover:underline"
                  className={`${textBlue} ${fontSize} hover:cursor-pointer hover:underline`}
                  onClick={handleForgotPassword}
                >
                  ลืมรหัสผ่านสำหรับผู้ดูแล ?
                </div>
              </div>
            )}
            <div className="mt-10">
              <button
                type="submit"
                className={`${fontSize} bg-[#F97201] text-white py-2 px-5 rounded-lg`}
              >
                เข้าสู่ระบบ
              </button>
            </div>
            {loginMod === "user" && (
              <>
                <p className={`mt-4 ${fontSize}`}>
                  ยังไม่ได้เป็นสมาชิก?
                  <Link
                    // className="mx-2 text-[#F97201] hover:cursor-pointer hover:underline"
                    className={`mx-2 ${registerColor} hover:cursor-pointer hover:underline`}
                    href="/agreement"
                  >
                    สมัครสมาชิก
                  </Link>
                </p>

                <div className="mt-5 flex  justify-center flex-col items-center">
                  <hr className={`${lineBlack} border  w-64`} />
                  {/* <p className="bg-white p-1 absolute">หรือ</p> */}
                  <p className={`${bgColorMain2} ${fontSize} p-1 absolute`}>
                    หรือ
                  </p>
                </div>
                <div
                  className={`${fontSize} mt-8 text-gray-400 flex flex-col gap-3`}
                >
                  <div
                    onClick={() => {
                      signIn("google");
                    }}
                    className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex"
                  >
                    <Image
                      alt="icon-google"
                      className="w-5 h-5"
                      src="/image/main/google.png"
                      height={1000}
                      width={1000}
                      priority
                    />
                    <p>เข้าสู่ระบบด้วย Google</p>
                  </div>
                  <div
                    onClick={() => signIn("line")}
                    className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex"
                  >
                    <Image
                      alt="icon-line"
                      className="w-5 h-5"
                      src="/image/main/line.png"
                      height={1000}
                      width={1000}
                      priority
                    />
                    <p>เข้าสู่ระบบด้วย Line</p>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
