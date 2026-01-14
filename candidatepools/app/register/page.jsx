"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiAccountEdit,
  mdiArrowDownDropCircle,
  mdiCloseCircle,
} from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import HeaderLogo from "../components/HeaderLogo";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";

import useUniversityStore from "@/stores/useUniversityStore";
import { useUserStore } from "@/stores/useUserStore";

import { toast } from "react-toastify";
import { ROLE } from "@/const/enum";
import comeFormChoice from "@/assets/comeFormChoice";

function Register({ statusAgreement }) {
  const uid = useId();
  const router = useRouter();
  const { status, data: session } = useSession();

  // store
  const { universities } = useUniversityStore();
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

  // agreement
  const [agreement, setAgreement] = useState(false);

  useEffect(() => {
    setAgreement(Boolean(statusAgreement));
  }, [statusAgreement]);

  // values
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // FIX: เดิมเป็น [] ทำให้เงื่อนไขพัง
  const [typeDisabled, setTypeDisabled] = useState("0");
  const [typePerson, setTypePerson] = useState("0");

  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");

  const [comeForm, setComeForm] = useState("");
  const [comeFormMore, setComeFormMore] = useState(false);

  const [error, setError] = useState("");

  // University combobox (autocomplete)
  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isFocusUni, setIsFocusUni] = useState(false);
  const [activeUniIndex, setActiveUniIndex] = useState(-1);

  // FIX: useEffect dependency เดิมใส่ผิดเป็น 2 อัน
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
  }, [agreement, status, session, router]);

  const errorId = `${uid}-form-error`;

  const ids = useMemo(
    () => ({
      user: `${uid}-user`,
      password: `${uid}-password`,
      confirmPassword: `${uid}-confirmPassword`,
      idCard: `${uid}-idCard`,
      firstName: `${uid}-firstName`,
      lastName: `${uid}-lastName`,
      typeDisabled: `${uid}-typeDisabled`,
      typePerson: `${uid}-typePerson`,
      university: `${uid}-university`,
      email: `${uid}-email`,
      comeForm: `${uid}-comeForm`,
      comeFormMore: `${uid}-comeFormMore`,
      uniList: `${uid}-uni-listbox`,
    }),
    [uid]
  );

  const inputBase =
    `${bgColorMain} w-full border border-gray-400 py-2 px-4 rounded-lg ` +
    `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`;

  const labelCls = "font-bold md:pt-2";
  const rowCls =
    `${fontSize} ${bgColorMain} w-full grid grid-cols-1 md:grid-cols-[220px_1fr] ` +
    "gap-2 md:gap-4 items-start";

  function handleUniversity(input) {
    setUniversity(input);
    setActiveUniIndex(-1);

    const list = universities?.data || [];
    const filtered = list.filter((u) =>
      (u?.university || "").toLowerCase().includes(input.toLowerCase())
    );
    setOptionUniversity(filtered.slice(0, 20));
  }

  function selectUniversity(name) {
    setUniversity(name);
    setOptionUniversity([]);
    setIsFocusUni(false);
    setActiveUniIndex(-1);
  }

  function onUniKeyDown(e) {
    if (!isFocusUni || optionUniversity.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveUniIndex((i) => Math.min(i + 1, optionUniversity.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveUniIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeUniIndex >= 0) {
        e.preventDefault();
        selectUniversity(optionUniversity[activeUniIndex].university);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsFocusUni(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    // required fields
    const requiredMissing =
      !user ||
      !firstName ||
      !lastName ||
      !university ||
      !email ||
      !idCard ||
      !comeForm ||
      typeDisabled === "0" ||
      typePerson === "0";

    const pwMissing = !session && (!password || !confirmPassword);

    if (requiredMissing || pwMissing) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // validate password for credentials
    if (!session) {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        setError(
          "รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์พิเศษอย่างน้อย 1 ตัว และความยาวไม่ต่ำกว่า 8 ตัวอักษร"
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน");
        return;
      }
    }

    // validate id card
    if (!/^\d{13}$/.test(idCard)) {
      setError("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
      return;
    }

    try {
      const { userExists, emailExists } = await checkUserExists({ user, email });

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
        }
      );

      if (!resCheckID.ok) {
        throw new Error("Error fetch api checkIdRegister.");
      }

      const { idCard: idCardExists } = await resCheckID.json();
      if (idCardExists) {
        setError("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
        return;
      }

      setError("");

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

      // หาก createUser คืนค่ารูปแบบต่างกัน ให้กันพลาดไว้
      const ok = Boolean(res?.ok ?? res?.success ?? res);

      if (!ok) {
        toast.error("ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        return;
      }

      if (!session) {
        const resSessionEmail = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (resSessionEmail?.ok) {
          toast.success("ลงทะเบียนสำเร็จ");
        } else {
          toast.error("ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        }
      } else {
        toast.success("ลงทะเบียนเพิ่มเติมสำเร็จ");
      }
    } catch (err) {
      console.log(err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className={`${bgColorMain} ${bgColor} min-h-screen`}>
      <HeaderLogo />

      {/* Responsive container */}
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {session ? "ลงทะเบียนเพิ่มเติม" : "ลงทะเบียนเข้าใช้งาน"}
            </h1>
          </div>

          {session && (
            <div className="flex justify-center mt-5">
              <Image
                alt="รูปโปรไฟล์ผู้ใช้"
                className="w-32 h-32"
                src={"/image/main/user.png"}
                height={256}
                width={256}
                priority
              />
            </div>
          )}

          {/* Username */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.user}>
              ชื่อผู้ใช้ภาษาอังกฤษ <span aria-hidden="true">*</span>
            </label>
            <input
              id={ids.user}
              name="username"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type="text"
              className={inputBase}
              placeholder="กรอกชื่อผู้ใช้เป็นภาษาอังกฤษ"
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          {/* Password (only when no session) */}
          {!session && (
            <>
              <div className={rowCls}>
                <label className={labelCls} htmlFor={ids.password}>
                 รหัสผ่าน <span aria-hidden="true">*</span>
                </label>
                <input
                  id={ids.password}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className={inputBase}
                  placeholder="ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                />
              </div>

              <div className={rowCls}>
                <label className={labelCls} htmlFor={ids.confirmPassword}>
                  ยืนยันรหัสผ่านอีกครั้ง <span aria-hidden="true">*</span>
                </label>
                <input
                  id={ids.confirmPassword}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className={inputBase}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                />
              </div>
            </>
          )}

          {/* ID Card */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.idCard}>
              เลขบัตรประจำตัวประชาชน <span aria-hidden="true">*</span>
            </label>
            <input
              id={ids.idCard}
              name="idCard"
              inputMode="numeric"
              autoComplete="off"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value.replace(/\D/g, ""))}
              type="text"
              maxLength={13}
              className={inputBase}
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          {/* First name */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.firstName}>
              ชื่อ (ไม่ต้องใส่คำนำหน้า) <span aria-hidden="true">*</span>
            </label>
            <input
              id={ids.firstName}
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              className={inputBase}
              placeholder="กรอกชื่อ (ไม่ต้องใส่คำนำหน้า)"
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          {/* Last name */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.lastName}>
              นามสกุล <span aria-hidden="true">*</span>
            </label>
            <input
              id={ids.lastName}
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              className={inputBase}
              placeholder="กรอกรายละเอียดนามสกุล"
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          {/* Disabled type */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.typeDisabled}>
              ประเภทความพิการ <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id={ids.typeDisabled}
                value={typeDisabled}
                onChange={(e) => setTypeDisabled(e.target.value)}
                className={`${inputBase} pr-10 cursor-pointer`}
                required
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              >
                <option value="0">เลือกประเภทความพิการ</option>
                <option value="พิการทางการเห็น">พิการทางการเห็น</option>
                <option value="พิการทางการได้ยินหรือสื่อความหมาย">
                  พิการทางการได้ยินหรือสื่อความหมาย
                </option>
                <option value="พิการทางการเคลื่อนไหวหรือทางร่างกาย">
                  พิการทางการเคลื่อนไหวหรือทางร่างกาย
                </option>
                <option value="พิการทางจิตใจหรือพฤติกรรม">
                  พิการทางจิตใจหรือพฤติกรรม
                </option>
                <option value="พิการทางสติปัญญา">พิการทางสติปัญญา</option>
                <option value="พิการทางการเรียนรู้">พิการทางการเรียนรู้</option>
                <option value="พิการทางออทิสติก">พิการทางออทิสติก</option>
                <option value="พิการซ้ำซ้อน">พิการซ้ำซ้อน</option>
              </select>

              <Icon
                aria-hidden="true"
                className="pointer-events-none text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>

          {/* Person type */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.typePerson}>
              ประเภทบุคคล <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id={ids.typePerson}
                value={typePerson}
                onChange={(e) => setTypePerson(e.target.value)}
                className={`${inputBase} pr-10 cursor-pointer`}
                required
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              >
                <option value="0">เลือกประเภทบุคคล</option>
                <option value="นักศึกษาพิการ">นักศึกษาพิการ (กำลังเรียนอยู่) </option>
                <option value="บัณฑิตพิการ">บัณฑิตพิการ (เรียนจบแล้ว) </option>
              </select>

              <Icon
                aria-hidden="true"
                className="pointer-events-none text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>

          {/* University combobox */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.university}>
              สถาบันการศึกษา (กรอกชื่อเต็ม) <span aria-hidden="true">*</span>
            </label>

            <div className="relative">
              <input
                id={ids.university}
                name="university"
                value={university}
                onChange={(e) => handleUniversity(e.target.value)}
                onFocus={() => setIsFocusUni(true)}
                onBlur={() => {
                  // หน่วงเล็กน้อยให้คลิก option ได้
                  setTimeout(() => setIsFocusUni(false), 120);
                }}
                onKeyDown={onUniKeyDown}
                type="text"
                className={inputBase}
                placeholder="พิมพ์เพื่อค้นหาแล้วเลือกกรอกชื่อเต็มของสถาบันการศึกษา..."
                required
                aria-required="true"
                role="combobox"
                aria-expanded={isFocusUni && optionUniversity.length > 0}
                aria-controls={ids.uniList}
                aria-autocomplete="list"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />

              {isFocusUni && optionUniversity?.length > 0 && (
                <ul
                  id={ids.uniList}
                  role="listbox"
                  className={`absolute z-10 mt-1 w-full rounded-lg border ${bgColorMain} shadow max-h-40 overflow-auto`}
                >
                  {optionUniversity.map((uni, index) => {
                    const active = index === activeUniIndex;
                    return (
                      <li
                        key={`${uni.university}-${index}`}
                        role="option"
                        aria-selected={active}
                      >
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${
                            active ? "bg-gray-200" : ""
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectUniversity(uni.university)}
                        >
                          {uni.university}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Email */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.email}>
              อีเมล (อีเมล์ที่สามารถติดต่อได้) <span aria-hidden="true">*</span>
            </label>
            <input
              id={ids.email}
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`${inputBase} ${
                session?.user?.email ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              placeholder="กรอกอีเมล์ที่สามารถติดต่อได้"
              readOnly={!!session?.user?.email}
              required
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          {/* Come from */}
          <div className={rowCls}>
            <label className={labelCls} htmlFor={ids.comeForm}>
              คุณทราบช่องทางการกรอกข้อมูลจากแหล่งไหน{" "}
              <span aria-hidden="true">*</span>
            </label>

            <div className="relative">
              <select
                id={ids.comeForm}
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
                className={`${inputBase} pr-10 cursor-pointer`}
                required={!comeFormMore}
                aria-required={!comeFormMore}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
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
                aria-hidden="true"
                className="pointer-events-none text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>

          {comeFormMore && (
            <div className={rowCls}>
              <label className={labelCls} htmlFor={ids.comeFormMore}>
                รู้จักจาก <span aria-hidden="true">*</span>
              </label>
              <input
                id={ids.comeFormMore}
                value={comeForm}
                onChange={(e) => setComeForm(e.target.value)}
                type="text"
                className={inputBase}
                placeholder="รู้จักจาก..."
                required
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />
            </div>
          )}

          {/* Error (WCAG: announceable) */}
          {error ? (
            <p id={errorId} role="alert" className="text-red-600 font-medium">
              *{error}
            </p>
          ) : null}

          {/* Actions (Responsive) */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
            {session ? (
              <button
                type="button"
                onClick={handleLogout}
                className={`
                  ${bgColorNavbar} ${bgColorWhite}
                  hover:cursor-pointer bg-[#F97201]
                  py-2 px-6 rounded-2xl
                  flex justify-center items-center gap-2
                  border border-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                `}
              >
                <Icon path={mdiCloseCircle} size={1} />
                <span>ออกจากระบบ</span>
              </button>
            ) : (
              <Link
                href="/"
                className={`
                  ${bgColorNavbar} ${bgColorWhite}
                  hover:cursor-pointer bg-[#F97201]
                  py-2 px-6 rounded-2xl
                  flex justify-center items-center gap-2
                  border border-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                `}
              >
                <Icon path={mdiCloseCircle} size={1} />
                <span>ยกเลิก</span>
              </Link>
            )}

            <button
              type="submit"
              className={`
                ${inputTextColor} ${inputGrayColor}
                py-2 px-6 rounded-2xl
                flex justify-center items-center gap-2
                border border-white
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
              `}
            >
              <Icon path={mdiAccountEdit} size={1} />
              <span>ลงทะเบียน</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
