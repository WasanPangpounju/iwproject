"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiAccountEdit,
  mdiArrowDownDropCircle,
  mdiCloseCircle,
} from "@mdi/js";
import Link from "next/link";
import HeaderLogo from "../components/HeaderLogo";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";
import { v4 as uuidv4 } from "uuid";

import useUniversityStore from "@/stores/useUniversityStore";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "react-toastify";
import { ROLE } from "@/const/enum";
import comeFormChoice from "@/assets/comeFormChoice";
import dataDisabled from "@/assets/dataDisabled";

function Register({ statusAgreement }) {
  // Store
  const { universities, loading, fetchUniversities } = useUniversityStore();
  const { checkUserExists, createUser } = useUserStore();

  // Theme
  const {
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    inputGrayColor,
    inputTextColor,
  } = useTheme();

  // IDs for a11y
  const uid = useId();
  const formErrorId = `form-error-${uid}`;
  const pwHelpId = `pw-help-${uid}`;

  // Agreement
  const [agreement, setAgreement] = useState(false);
  useEffect(() => {
    setAgreement(!!statusAgreement);
  }, [statusAgreement]);

  // Session + router
  const { status, data: session } = useSession();
  const router = useRouter();

  // Prefill + redirect if no agreement
  useEffect(() => {
    if (!agreement) {
      router.replace("/agreement");
      return;
    }

    if (status === "loading") return;

    if (session?.user) {
      setEmail(session.user.email || "");
      setUser(session.user.name || session.user.user || "");
    }
  }, [agreement, router, session, status]);

  // Ensure universities loaded (safe even in dev if your store guards duplicates)
  useEffect(() => {
    if (!loading && universities.length === 0) {
      fetchUniversities();
    }
  }, [fetchUniversities, loading, universities.length]);

  // Form state (controlled)
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [typeDisabled, setTypeDisabled] = useState("0"); // was []
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [typePerson, setTypePerson] = useState("0");
  const [idCard, setIdCard] = useState("");
  const [error, setError] = useState("");
  const [comeForm, setComeForm] = useState("");
  const [comeFormMore, setComeFormMore] = useState(false);

  // University suggestions (works whether universities is array or {data:[]})
  const universityList = useMemo(() => {
    if (Array.isArray(universities)) return universities;
    if (Array.isArray(universities?.data)) return universities.data;
    return [];
  }, [universities]);

  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isFocusUni, setIsFocusUni] = useState(false);

  function handleUniversity(input) {
    setUniversity(input);

    const filteredOptions = universityList.filter((u) =>
      (u?.university || "").toLowerCase().includes((input || "").toLowerCase()),
    );

    setOptionUniversity(filteredOptions);
  }

  function selectUniversity(name) {
    setUniversity(name);
    setOptionUniversity([]);
    setIsFocusUni(false);
  }

  // Submit
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    // Required fields for all cases
    const requiredBase =
      user &&
      firstName &&
      lastName &&
      typeDisabled &&
      typeDisabled !== "0" &&
      university &&
      email &&
      comeForm &&
      typePerson &&
      typePerson !== "0" &&
      idCard &&
      idCard.length === 13;

    if (!requiredBase) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // If no session: password required + validation
    if (!session) {
      if (!password || !confirmPassword) {
        setError("กรุณากรอกรหัสผ่านและยืนยันรหัสผ่าน");
        return;
      }

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์พิเศษอย่างน้อย 1 ตัว และความยาวไม่ต่ำกว่า 8 ตัวอักษร",
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน");
        return;
      }
    }

    if (!universities.some((uni) => uni.university === university)) {
      setError("กรุณากรอกชื่อสถาบันการศึกษาให้ถูกต้อง");
      return;
    }

    try {
      const { userExists, emailExists } = await checkUserExists({
        user,
        email,
      });

      if (userExists) {
        setError("username มีการใช้งานแล้ว");
        return;
      }
      if (emailExists) {
        setError("email นี้มีการใช้งานแล้ว");
        return;
      }

      const resCheckID = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkIdRegister`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idCard }),
        },
      );

      if (!resCheckID.ok) {
        throw new Error("Error fetch api checkIdRegister.");
      }

      const { idCard: idCardExists } = await resCheckID.json();
      if (idCardExists) {
        setError("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
        return;
      }

      const id = uuidv4();
      const body = {
        id: session?.user?.id || id,
        user,
        password,
        firstName,
        lastName,
        typeDisabled,
        university,
        email,
        typePerson,
        idCard,
        comeForm,
        role: ROLE.USER,
      };

      const res = await createUser(body);

      // Keep original intent: auto sign-in for credentials flow
      if (res?.ok) {
        const resSessionEmail = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (resSessionEmail?.ok) {
          toast.success("ลงทะเบียนสำเร็จ");
        } else {
          if (!res?.ok) {
            toast.error("ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
          }
        }
      }
    } catch (err) {
      console.log(err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  }

  // Logout
  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  const showPasswordFields = !session;

  return (
    <div className={`${bgColorMain} ${bgColor} min-h-screen flex flex-col`}>
      <HeaderLogo />

      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-8 sm:py-10">
          <form
            onSubmit={handleRegister}
            className="rounded-2xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 shadow-sm"
            aria-describedby={error ? formErrorId : undefined}
            noValidate
          >
            <header className="text-center">
              <h1 className="text-2xl font-bold">
                {session ? "ลงทะเบียนเพิ่มเติม" : "ลงทะเบียนเข้าใช้งาน"}
              </h1>
            </header>

            {session && (
              <div className="mt-6 flex justify-center">
                <Image
                  alt="รูปโปรไฟล์ผู้ใช้"
                  className="h-28 w-28 rounded-full object-cover"
                  src={"/image/main/user.png"}
                  height={200}
                  width={200}
                  priority
                />
              </div>
            )}

            {error ? (
              <div
                id={formErrorId}
                role="alert"
                aria-live="assertive"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
              >
                * {error}
              </div>
            ) : null}

            <div className={`${fontSize} mt-8 grid grid-cols-1 gap-4 sm:gap-5`}>
              {/* Username */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`username-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  ชื่อผู้ใช้ (เป็นภาษาอังกฤษ){" "}
                  <span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <input
                    id={`username-${uid}`}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    type="text"
                    autoComplete="username"
                    className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    placeholder="กรอกชื่อผู้ใช้เป็นภาษาอังกฤษ"
                    required
                    aria-invalid={!!error}
                  />
                </div>
              </div>

              {/* Password */}
              {showPasswordFields && (
                <>
                  <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                    <label
                      htmlFor={`password-${uid}`}
                      className="font-bold sm:col-span-4"
                    >
                      รหัสผ่าน<span className="text-red-600"> *</span>
                    </label>
                    <div className="sm:col-span-8">
                      <input
                        id={`password-${uid}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        placeholder="ต้องตั้งเป็นตัวอักษรอังกฤษ+ตัวเลข+สัญลักษณ์"
                        aria-describedby={pwHelpId}
                        required
                      />
                      <p
                        id={pwHelpId}
                        className="mt-1 text-sm font-normal text-gray-600"
                      >
                        อย่างน้อย 8 ตัวอักษร และต้องมี
                        ตัวอักษรอังกฤษ/ตัวเลข/สัญลักษณ์
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                    <label
                      htmlFor={`confirmPassword-${uid}`}
                      className="font-bold sm:col-span-4"
                    >
                      ยืนยันรหัสผ่านอีกครั้ง{" "}
                      <span className="text-red-600"> *</span>
                    </label>
                    <div className="sm:col-span-8">
                      <input
                        id={`confirmPassword-${uid}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                        className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ID Card */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`idCard-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  เลขบัตรประชาชน<span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <input
                    id={`idCard-${uid}`}
                    value={idCard}
                    onChange={(e) =>
                      setIdCard(e.target.value.replace(/\D/g, "").slice(0, 13))
                    }
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                    required
                  />
                </div>
              </div>

              {/* First name */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`firstName-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  ชื่อ (ไม่ต้องใส่คำนำหน้า)
                  <span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <input
                    id={`firstName-${uid}`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    autoComplete="given-name"
                    className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    placeholder="กรอกชื่อ (ไม่ต้องใส่คำนำหน้า)"
                    required
                  />
                </div>
              </div>

              {/* Last name */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`lastName-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  นามสกุล<span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <input
                    id={`lastName-${uid}`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    autoComplete="family-name"
                    className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    placeholder="กรอกรายละเอียดนามสกุล"
                    required
                  />
                </div>
              </div>

              {/* Type disabled */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`typeDisabled-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  ประเภทความพิการ<span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <div className="relative">
                    <select
                      id={`typeDisabled-${uid}`}
                      value={typeDisabled}
                      onChange={(e) => setTypeDisabled(e.target.value)}
                      className={`${bgColorMain} cursor-pointer w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      style={{ appearance: "none" }}
                      required
                    >
                      <option value="0">เลือกประเภทความพิการ</option>
                      {dataDisabled.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Type person */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`typePerson-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  ประเภทบุคคล<span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <div className="relative">
                    <select
                      id={`typePerson-${uid}`}
                      value={typePerson}
                      onChange={(e) => setTypePerson(e.target.value)}
                      className={`${bgColorMain} cursor-pointer w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      style={{ appearance: "none" }}
                      required
                    >
                      <option value="0">เลือกประเภทบุคคล</option>
                      <option value="นักศึกษาพิการ">
                        นักศึกษาพิการ (กำลังเรียนอยู่)
                      </option>
                      <option value="บัณฑิตพิการ">
                        บัณฑิตพิการ (เรียนจบแล้ว)
                      </option>
                    </select>
                    <Icon
                      className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* University */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`university-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  สถาบันการศึกษา (ชื่อเต็มของสถาบันการศึกษา){" "}
                  <span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <div className="relative">
                    <input
                      id={`university-${uid}`}
                      value={university}
                      onChange={(e) => handleUniversity(e.target.value)}
                      onFocus={() => setIsFocusUni(true)}
                      onBlur={(e) => {
                        // allow click on options
                        if (!e.relatedTarget) {
                          setTimeout(() => setIsFocusUni(false), 150);
                        }
                      }}
                      type="text"
                      className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      placeholder={
                        loading ? "กำลังโหลดรายชื่อสถาบัน..." : "กรอกชื่อสถาบัน"
                      }
                      role="combobox"
                      aria-expanded={isFocusUni && optionUniversity.length > 0}
                      aria-controls={`uni-list-${uid}`}
                      aria-autocomplete="list"
                      required
                    />

                    {isFocusUni && optionUniversity?.length > 0 && (
                      <div
                        id={`uni-list-${uid}`}
                        role="listbox"
                        className={`absolute z-10 mt-1 w-full rounded-lg border border-gray-200 shadow max-h-40 overflow-auto ${bgColorMain}`}
                      >
                        {optionUniversity.map((uni, index) => {
                          const name = uni?.university || "";
                          return (
                            <button
                              key={`${name}-${index}`}
                              type="button"
                              role="option"
                              className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${bgColor} hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                              onMouseDown={() => selectUniversity(name)}
                            >
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`email-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  อีเมล (ที่สามารถติดต่อได้)
                  <span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <input
                    id={`email-${uid}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      session?.user?.email
                        ? "bg-gray-200 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="กรอกอีเมลที่สามารถติดต่อได้"
                    readOnly={!!session?.user?.email}
                    required
                  />
                </div>
              </div>

              {/* Come from */}
              <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                <label
                  htmlFor={`comeForm-${uid}`}
                  className="font-bold sm:col-span-4"
                >
                  ทราบข้อมูลจากแหล่งไหน<span className="text-red-600"> *</span>
                </label>
                <div className="sm:col-span-8">
                  <div className="relative">
                    <select
                      id={`comeForm-${uid}`}
                      value={comeFormMore ? "อื่นๆ" : comeForm}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "อื่นๆ") {
                          setComeFormMore(true);
                          setComeForm("");
                          return;
                        }
                        setComeFormMore(false);
                        setComeForm(value);
                      }}
                      className={`${bgColorMain} cursor-pointer w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      style={{ appearance: "none" }}
                      required
                    >
                      <option value="">ทราบข้อมูลจากแหล่งไหน</option>
                      {comeFormChoice.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    <Icon
                      className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {comeFormMore && (
                <div className="grid gap-2 sm:grid-cols-12 sm:items-center">
                  <label
                    htmlFor={`comeFormMore-${uid}`}
                    className="font-bold sm:col-span-4"
                  >
                    รู้จักจาก<span className="text-red-600"> *</span>
                  </label>
                  <div className="sm:col-span-8">
                    <input
                      id={`comeFormMore-${uid}`}
                      value={comeForm}
                      onChange={(e) => setComeForm(e.target.value)}
                      type="text"
                      className={`${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      placeholder="รู้จักจาก..."
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {session ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`
                    ${bgColorNavbar} ${bgColorWhite}
                    bg-[#F97201]
                    py-2 px-6 rounded-2xl
                    flex justify-center items-center gap-2
                    border border-white
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  `}
                >
                  <Icon path={mdiCloseCircle} size={1} aria-hidden="true" />
                  <span>ออกจากระบบ</span>
                </button>
              ) : (
                <Link
                  href="/"
                  className={`
                    ${bgColorNavbar} ${bgColorWhite}
                    bg-[#F97201]
                    py-2 px-6 rounded-2xl
                    flex justify-center items-center gap-2
                    border border-white
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  `}
                >
                  <Icon path={mdiCloseCircle} size={1} aria-hidden="true" />
                  <span>ยกเลิก</span>
                </Link>
              )}

              <button
                type="submit"
                className={`${inputTextColor} ${inputGrayColor}
                  py-2 px-6 rounded-2xl
                  flex justify-center items-center gap-2
                  border border-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                <Icon path={mdiAccountEdit} size={1} aria-hidden="true" />
                <span>ลงทะเบียน</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
