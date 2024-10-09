"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./ThemeContext";
import NavbarLogo from "./components/NavbarLogo";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import RootLayout from "./layout";
import React from 'react';

// export default function Home(bgColorNavbar,bgColorMain) {
// export default function Home({ bgColorMain='bg-white', bgColorNavbar,bgColor }) {
export default function Home() {

  const {
    setFontSize,
    setBgColor,
    setBgColorNavbar,
    setBgColorWhite,
    setBgColorMain,
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    bgColorMain2,
    lineBlack,
    textBlue,
    registerColor
  } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  //eye show password
  const [showPassword, setShowPassword] = useState(false);

  //set change login mod user and admin
  const [loginMod, setLoginMod] = useState("user");

  //validate session
  const { status, data: session } = useSession();
  const router = useRouter();
  useEffect(
    () => {
      if (status === "loading") {
        return;
      }

      if (session) {
        router.replace("/main");
      }
    },
    [session, router]
  );

  //loader
  useEffect(() => {
    setLoader(false);
  }, []);

  // Manage loader state
  useEffect(() => {
    document.body.classList.toggle('no_scroll', loader);
  }, [loader]);

  //submit login
  async function handleSubmit(e) {
    e.preventDefault();
    setLoader(true);

    if (!email || !password) {
      setError("กรุณากรอก อีเมลและรหัสผ่านของคุณ");
      setLoader(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
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
            setLoader(false);
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
          setLoader(false);
        }
      } else {
        setLoader(false);
        Swal.fire({
          title: "เข้าสู่ระบบสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            router.replace("/main");
          }
        });
      }
    } catch (err) {
      setLoader(false);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดกรุณาลองใหม่ในภายหลัง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      console.error("Unexpected error:", err);
    }
  }

  console.log('bgColorMain', bgColorMain);
  return (
    <div className={`${bgColorMain} ${bgColor}`}>
      <NavbarLogo />
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
              onClick={() => setLoginMod("user")}
              className={`${loginMod === "user" ? "bg-[#F97201]" : "bg-[#75C7C2]"
                } hover:cursor-pointer text-center w-6/12  text-white font-thin px-7 rounded-lg py-3`}
            >
              นักศึกษาพิการ
            </div>
            <div
              onClick={() => setLoginMod("admin")}
              className={`${loginMod === "admin" ? "bg-[#F97201]" : "bg-[#75C7C2]"
                } hover:cursor-pointer text-center w-6/12  text-white font-thin px-7 rounded-lg py-3`}
            >
              ผู้ดูแลระบบ
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className={`relative bottom-[5px] rounded-lg ${bgColorMain} p-14 flex flex-col justify-center items-center `}
          >
            <p className={``}>
              {loginMod === "user"
                ? "เข้าสู่ระบบสำหรับผู้สมัครงาน"
                : "เข้าสู่ระบบสำหรับผู้ดูแลระบบ"}
            </p>
            <div className="mt-7 flex flex-col gap-5">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className={`${bgColorMain} w-72 border py-2 px-5 rounded-lg`}
                type="text"
                placeholder="อีเมล์ หรือ ชื่อผู้ใช้"
              />
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${bgColorMain} w-72 border py-2 px-5 rounded-lg`}
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
            <div className="self-end mt-4">
              <Link
                // className="text-blue-500 hover:cursor-pointer hover:underline"
                className={`${textBlue} hover:cursor-pointer hover:underline`}
                href="#"
              >
                ลืมรหัสผ่าน ?
              </Link>
            </div>
            <div className="mt-5">
              <button
                type="submit"
                className="bg-[#F97201] text-white py-2 px-5 rounded-lg"
              >
                เข้าสู่ระบบ
              </button>
            </div>
            <p className="mt-4">
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
              <p className={`${bgColorMain2} p-1 absolute`}>หรือ</p>
            </div>
            <div className="mt-8 text-gray-400 flex flex-col gap-3">
              <div
                onClick={() => signIn("google")}
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
          </form>
        </div>
      </div>
      <Footer />
      <div className={loader ? "" : "hidden"}>
        <Loader />
      </div>
    </div>
  );
}
