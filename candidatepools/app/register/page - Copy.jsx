"use client";

import React from "react";
import Icon from "@mdi/react";
import {
  mdiAccountEdit,
  mdiArrowDownDropCircle,
  mdiCloseCircle,
} from "@mdi/js";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeaderLogo from "../components/HeaderLogo";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Footer from "../components/Footer";
import { useTheme } from "../ThemeContext";
import { v4 as uuidv4 } from "uuid";

import useUniversityStore from "@/stores/useUniversityStore";

//store
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "react-toastify";
import { ROLE } from "@/const/enum";
import SelectForm from "../components/Form/SelectForm";
import comeFormChoice from "@/assets/comeFormChoice";

function Register({ statusAgreement }) {
  //store
  const { universities } = useUniversityStore();
  const { checkUserExists, createUser } = useUserStore();

  //Theme
  const {
    fontSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    inputGrayColor,
    inputTextColor,
  } = useTheme();

  //check agreement
  const [agreement, setAgreement] = useState(false);

  useEffect(() => {
    setAgreement(statusAgreement);
  }, [statusAgreement]);

  //value data
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [typeDisabled, setTypeDisabled] = useState([]);
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [typePerson, setTypePerson] = useState("");
  const [idCard, setIdCard] = useState("");
  const [error, setError] = useState("");
  const [comeForm, setComeForm] = useState("");
  const [comeFormMore, setComeFormMore] = useState(false);

  //validate session
  const { status, data: session } = useSession();
  const router = useRouter();
  useEffect(
    () => {
      if (!agreement) {
        router.replace("/agreement");
      }

      if (status === "loading") {
        return;
      }

      if (session?.user) {
        setEmail(session?.user?.email || "");
        setUser(session?.user?.name || session?.user?.user || "");
      }
    },
    [session],
    [router]
  );

  //submit register
  async function handleRegister(e) {
    e.preventDefault();

    if (!session) {
      if (
        !user ||
        !password ||
        !confirmPassword ||
        !firstName ||
        !lastName ||
        !typeDisabled ||
        !university ||
        !email ||
        !typePerson
      ) {
        setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");

        return;
      }

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

    if (
      !user ||
      !firstName ||
      !lastName ||
      !typeDisabled ||
      !university ||
      !email ||
      !comeForm
    ) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");

      return;
    }

    if (typeDisabled === "0") {
      setError("กรุณาเลือกประเภทความพิการ");

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idCard }),
        }
      );

      if (!resCheckID.ok) {
        throw new Error("Error fetch api checkuser.");
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

      try {
        const resSessionEmail = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (resSessionEmail.ok) {
          toast.success("ลงทะเบียนสำเร็จ");
        } else {
          if (!res.ok || !resEducation.ok) {
            toast.error("ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
          }
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  //logout
  function handleLogout() {
    signOut({ callbackUrl: "/" });
  }

  //select university
  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isFocusUni, setIsFocusUni] = useState(false);

  function handleUniversity(uni) {
    const input = uni;
    setUniversity(input);

    // ค้นหาคำที่มีความคล้าย
    const filteredOptions = universities?.data?.filter(
      (uni) => uni.university.toLowerCase().includes(input.toLowerCase()) // เปรียบเทียบแบบ case-insensitive
    );
    setOptionUniversity(filteredOptions);
  }
  function SeletedOption(uni) {
    setUniversity(uni);
    setOptionUniversity([]);
  }

  return (
    <div className={`${bgColorMain} ${bgColor}`}>
      <HeaderLogo />
      <div className="text-sm flex justify-center mt-10">
        <form
          onSubmit={handleRegister}
          className="flex flex-col justify-center items-center"
        >
          <div className="w-96 self-end text-center">
            <h1 className="text-2xl font-bold">
              {session ? "ลงทะเบียนเพิ่มเติม" : "ลงทะเบียนเข้าใช้งาน"}
            </h1>
          </div>
          {session && (
            <div className="w-96 self-end flex justify-center mt-5">
              <Image
                alt="profile"
                className={`w-32 h-32`}
                src={"/image/main/user.png"}
                height={1000}
                width={1000}
                priority
              ></Image>
            </div>
          )}
          <div
            className={`${fontSize} mt-7 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> Username:</label>
            <input
              onChange={(e) => setUser(e.target.value)}
              type="text"
              className={`${bgColorMain} w-96 border  border-gray-400 py-2 px-4 rounded-lg `}
              placeholder="กรอกชื่อผู้ใช้"
              value={user}
            />
          </div>
          {/* {!session && (
                        <> */}
          <div
            className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
              placeholder="ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์"
            />
          </div>
          <div
            className={`${fontSize} ${bgColorMain} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> Password Confirm:</label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
              placeholder="ยืนยันรหัสผ่าน"
            />
          </div>
          <div
            className={`${fontSize} ${bgColorMain} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> เลขบัตรประจำตัวประชาชน:</label>
            <input
              onChange={(e) => setIdCard(e.target.value)}
              type="text"
              pattern="\d{13}"
              maxLength={13}
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
              placeholder="กรอกเลขบัตรประจำตัวประชาชน 13 หลัก"
            />
          </div>
          <div
            className={`${fontSize} ${bgColorMain} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> ชื่อ:</label>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
              placeholder="กรอกรายละเอียด"
            />
          </div>
          <div
            className={`${fontSize} ${bgColorMain} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> สกุล:</label>
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
              placeholder="กรอกรายละเอียด"
            />
          </div>
          <div
            className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> ประเภทความพิการ:</label>
            <div className="relative ">
              <select
                onChange={(e) => setTypeDisabled(e.target.value)}
                className={`${bgColorMain} cursor-pointer w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                placeholder="กรอกชื่อผู้ใช้"
                style={{ appearance: "none" }}
              >
                <option value="0">เลือกประเภทความพิการ</option>
                <option value="พิการทางการมองเห็น">พิการทางการมองเห็น</option>
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
              </select>
              <Icon
                className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>
          <div
            className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label> ประเภทบุคคล:</label>
            <div className="relative ">
              <select
                onChange={(e) => setTypePerson(e.target.value)}
                className={`${bgColorMain} cursor-pointer w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                style={{ appearance: "none" }}
              >
                <option value="0">เลือกประเภทบุคคล</option>
                <option value="นักศึกษาพิการ">นักศึกษาพิการ</option>
                <option value="บัณฑิตพิการ">บัณฑิตพิการ</option>
              </select>
              <Icon
                className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>
          <div
            className={`${fontSize} ${bgColorMain} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label>สถาบันการศึกษา:</label>
            {/* <div className="relative ">
                            <select onChange={(e) => handleUniversity(e.target.value)} className={`${bgColorMain} cursor-pointer w-96 border border-gray-400 py-2 px-4 rounded-lg`} style={{ appearance: 'none' }}>
                                <option value="0">เลือกสถาบันการศึกษา</option>
                                {universitys?.map((uni, index) => (
                                    <option key={index} value={uni?.university}>{uni?.university}</option>
                                ))}
                            </select>
                            <Icon className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3" path={mdiArrowDownDropCircle} size={.8} />
                        </div> */}
            <div className="relative">
              <input
                value={university}
                onChange={(e) => handleUniversity(e.target.value)}
                onFocus={() => setIsFocusUni(true)}
                onBlur={(e) => {
                  // ถ้า blur ไปที่ dropdown ให้ไม่ซ่อน
                  if (
                    !e.relatedTarget ||
                    !e.relatedTarget.classList.contains("uni-option")
                  ) {
                    setTimeout(() => setIsFocusUni(false), 200);
                  }
                }}
                type="text"
                className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                placeholder="กรอกรายละเอียด"
              />
              {isFocusUni && optionUniversity?.length > 0 && (
                <div className="w-full absolute shadow max-h-24 overflow-scroll hide-scrollbar">
                  {optionUniversity.map((uni, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 border ${bgColor} hover:bg-gray-300 cursor-pointer uni-option`}
                      onMouseDown={() => SeletedOption(uni.university)} // ใช้ onMouseDown แทน
                    >
                      {uni.university}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* <div className={`${bgColorMain} ${bgColor} w-96 border px-3 border-gray-400 rounded-lg`}>
                            <Autocomplete
                                options={universitys}
                                getOptionLabel={(option) => option.university}
                                inputValue={university || ''}  // ควบคุมค่าที่ผู้ใช้งานป้อนใน input
                                onInputChange={(event, newInputValue) => {
                                    setUniversity(newInputValue);  // อัปเดตค่าที่ผู้ใช้งานป้อนเอง
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="ระบุมหาวิทยาลัย"
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                padding: 0,    // ปิด padding ภายใน input ของ Material-UI
                                                '& fieldset': {
                                                    display: 'none'  // ซ่อน border ของ input
                                                }
                                            },
                                            '& .MuiInputBase-input': {
                                                color: textColorKey  // สีตัวอักษร (เทียบ Tailwind `text-gray-900`)
                                            }
                                        }}
                                    />
                                )}

                            />
                        </div> */}
          </div>
          <div
            className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center'`}
          >
            <label>อีเมล:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`${bgColorMain} w-96 border border-gray-400 py-2 px-4 rounded-lg ${
                session?.user?.email
                  ? "bg-gray-200 cursor-default focus:outline-none"
                  : ""
              }`}
              placeholder="กรอกอีเมล"
              value={email}
              readOnly={!!session?.user?.email}
            />
          </div>
          <div
            className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
          >
            <label>คุณทราบช่องทางการกรอกข้อมูลจากแหล่งไหน:</label>
            <div className="relative ">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "อื่นๆ") {
                    setComeFormMore(true);
                    setComeForm("");
                    return;
                  }
                  setComeFormMore(false);
                  setComeForm(e.target.value);
                }}
                className={`${bgColorMain} cursor-pointer w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                style={{ appearance: "none" }}
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
                className="cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3"
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>
          {comeFormMore && (
            <div
              className={`${fontSize} mt-4 w-[35rem] font-bold  flex justify-between items-center`}
            >
              <label>รู้จักจาก:</label>
              <input
                onChange={(e) => setComeForm(e.target.value)}
                type="text"
                className={`${bgColorMain} w-96 border  border-gray-400 py-2 px-4 rounded-lg `}
                placeholder="รู้จักจาก..."
                value={comeForm}
              />
            </div>
          )}

          {error ? (
            <div className="mt-3  text-red-400  w-96 self-end">*{error}</div>
          ) : null}
          <div className={` w-96 self-end mt-10 flex justify-between`}>
            {session ? (
              <div
                onClick={handleLogout}
                className={`
                            ${bgColorNavbar} 
                            ${bgColorWhite} 
                            hover:cursor-pointer 
                            bg-[#F97201]  
                            py-2 px-6 
                            rounded-2xl 
                            flex justify-center items-center gap-1 
                            border border-white
                          `}
              >
                <Icon path={mdiCloseCircle} size={1} />
                <p>ออกจากระบบ</p>
              </div>
            ) : (
              <Link
                href="/"
                className={`
                            ${bgColorNavbar} 
                            ${bgColorWhite} 
                            hover:cursor-pointer 
                            bg-[#F97201]  
                            py-2 px-6 
                            rounded-2xl 
                            flex justify-center items-center gap-1 
                            border border-white
                          `}
              >
                <Icon path={mdiCloseCircle} size={1} />
                <p>ยกเลิก</p>
              </Link>
            )}
            <button
              type="submit"
              className={`${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`}
            >
              <Icon path={mdiAccountEdit} size={1} />
              <p>ลงทะเบียน</p>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
