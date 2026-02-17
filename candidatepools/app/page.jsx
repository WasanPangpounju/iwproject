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
import TextError from "./components/TextError";
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
    setError("");

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

      // ถ้า error → เช็คเพิ่มว่า user มีจริงไหม แล้วแสดงข้อความเดิม
      if (res?.error) {
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

          await resCheckUser.json();
          setError("อีเมลหรือรหัสผ่านของคุณไม่ถูกต้อง");
        } catch (err) {
          setError("เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้");
          console.error("Error fetching API in register: ", err);
        }
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดกรุณาลองใหม่ในภายหลัง");
      console.error("Unexpected error:", err);
    } finally {
      // เดิมที success case ไม่ได้ setLoading(false) ทำให้ loading อาจค้าง
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

        if (!res.ok) throw new Error(`ไม่พบผู้ใช้งานนี้ในระบบ`);

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

      {/* Responsive layout: mobile = column, desktop = row */}
      <div className="flex text-sm justify-center gap-8 lg:gap-20 mt-10 items-center px-4 flex-col lg:flex-row">
        <Image
          alt="poster"
          className="w-full max-w-sm h-auto"
          src="/image/main/postermain.png"
          height={1000}
          width={1000}
          priority
        />

        <div className={`${bgColorMain2} rounded-b-lg w-full max-w-md`}>
          {/* Tabs: div -> button (WCAG), no behavior change */}
          <div className="flex" role="tablist" aria-label="เลือกประเภทผู้ใช้งาน">
            <button
              type="button"
              onClick={() => {
                setLoginMod("user");
                setEmail("");
                setPassword("");
                setError("");
              }}
              className={`${
                loginMod === "user" ? "bg-[#F97201]" : "bg-[#75C7C2]"
              } ${fontSize} text-center w-6/12 text-white font-thin px-7 rounded-lg py-3
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
              aria-pressed={loginMod === "user"}
              role="tab"
            >
              นักศึกษาพิการ
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMod("admin");
                setEmail("");
                setPassword("");
                setError("");
              }}
              className={`${
                loginMod === "admin" ? "bg-[#F97201]" : "bg-[#75C7C2]"
              } ${fontSize} text-center w-6/12 text-white font-thin px-7 rounded-lg py-3
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
              aria-pressed={loginMod === "admin"}
              role="tab"
            >
              ผู้ดูแลระบบ
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`relative bottom-[5px] rounded-lg ${bgColorMain} p-14 flex flex-col justify-center items-center`}
          >
            <h1 className={`${fontSize}`}>
              {loginMod === "user"
                ? "เข้าสู่ระบบสำหรับผู้สมัครงาน"
                : "เข้าสู่ระบบสำหรับผู้ดูแลระบบ"}
            </h1>

            {/* Inputs with labels for WCAG (sr-only keeps design) */}
            <div className="mt-7 flex flex-col gap-5 w-full items-center">
              <div className="w-full max-w-xs">
                <label htmlFor="login-identifier" className="sr-only">
                  อีเมล์ หรือ ชื่อผู้ใช้
                </label>
                <input
                  id="login-identifier"
                  name="identifier"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${bgColorMain} ${fontSize} w-full border py-2 px-5 rounded-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="อีเมล์ หรือ ชื่อผู้ใช้"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>

              <div className="relative w-full max-w-xs">
                <label htmlFor="login-password" className="sr-only">
                  รหัสผ่าน
                </label>
                <input
                  id="login-password"
                  name="password"
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${bgColorMain} ${fontSize} w-full border py-2 px-5 rounded-lg pr-12
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                />

                {/* Eye toggle: Image onClick -> button (WCAG) */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-[9px] right-4 p-1 rounded bg-transparent
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  <Image
                    alt=""
                    className="w-4 h-4"
                    src="/image/main/eye.png"
                    height={16}
                    width={16}
                    priority
                  />
                </button>
              </div>
            </div>

            {/* Error: announce for screen readers */}
            {error ? (
              <div
                id="login-error"
                className="self-start mt-3 text-red-500"
                role="alert"
                aria-live="polite"
              >
                <TextError text={error} />
              </div>
            ) : null}

            {/* Forgot password: div -> button */}
            <div className="self-end mt-4">
              <button
                type="button"
                className={`${textBlue} ${fontSize} hover:cursor-pointer hover:underline rounded
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                onClick={handleForgotPassword}
              >
                {loginMod === "user"
                  ? "ลืมรหัสผ่าน ?"
                  : "ลืมรหัสผ่านสำหรับผู้ดูแล ?"}
              </button>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className={`${fontSize} bg-[#F97201] text-white py-2 px-5 rounded-lg
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
              >
                เข้าสู่ระบบ
              </button>
            </div>

            {loginMod === "user" && (
              <>
                <p className={`mt-4 ${fontSize}`}>
                  ยังไม่ได้เป็นสมาชิก?
                  <Link
                    className={`mx-2 ${registerColor} hover:cursor-pointer hover:underline`}
                    href="/agreement"
                  >
                    สมัครสมาชิก
                  </Link>
                </p>

                <div className="mt-5 flex justify-center flex-col items-center">
                  <hr className={`${lineBlack} border w-64`} />
                  <p className={`${bgColorMain2} ${fontSize} p-1 absolute`}>
                    หรือ
                  </p>
                </div>

                {/* Social login: div -> button */}
                <div className={`${fontSize} mt-8 text-gray-400 flex flex-col gap-3`}>
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex items-center bg-transparent
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <Image
                      alt=""
                      className="w-5 h-5"
                      src="/image/main/google.png"
                      height={20}
                      width={20}
                      priority
                    />
                    <p>เข้าสู่ระบบด้วย Google</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => signIn("line")}
                    className="hover:cursor-pointer gap-2 py-1 px-5 border rounded-lg flex items-center bg-transparent
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <Image
                      alt=""
                      className="w-5 h-5"
                      src="/image/main/line.png"
                      height={20}
                      width={20}
                      priority
                    />
                    <p>เข้าสู่ระบบด้วย Line</p>
                  </button>
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
