"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/ThemeContext";

// assets
import dataDisabled from "@/assets/dataDisabled";

// components
import InputLabelForm from "@/app/components/Form/InputLabelForm";
import InputForm from "@/app/components/Form/InputForm";
import SelectLabelForm from "@/app/components/Form/SelectLabelForm";
import SelectForm from "@/app/components/Form/SelectForm";
import LabelForm from "@/app/components/Form/LabelForm";
import TextError from "@/app/components/TextError";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";
import UploadFile from "./UploadFile";
import InputUniversityAutoComplete from "./InputUniversityAutoComplete";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import Profile from "../Profile/Profile";

// hooks
import { useStudentForm } from "@/hooks/useStudentForm";
import { useUserForm } from "@/hooks/useUserForm";
import { useProvince } from "@/hooks/useProvince";

// const
import { ROLE } from "@/const/enum";

function PersonalForm({
  dataUser,
  isStudent = true,
  isCreate = false,
  handleStep,
  readOnly = false,
}) {
  // =========================
  // ✅ helpers
  // =========================
  const toId13 = (v) => String(v ?? "").replace(/\D/g, "").slice(0, 13);

  // =========================
  // data value
  // =========================
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [profile, setProfile] = useState(null);
  const [typeDisabled, setTypeDisabled] = useState([]);
  const [detailDisabled, setDetailDisabled] = useState(null);
  const [university, setUniversity] = useState(null);
  const [email, setEmail] = useState(null);
  const [prefix, setPrefix] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [sex, setSex] = useState(null);
  const [dateBirthday, setDateBirthday] = useState(null);
  const [monthBirthday, setMonthBirthday] = useState(null);
  const [yearBirthday, setYearBirthday] = useState(null);
  const [nationality, setNationality] = useState(null);
  const [religion, setReligion] = useState(null);

  // ✅ ผูกเลขบัตรประชาชน + เลขบัตรคนพิการ ให้เป็น state เดียว
  const [idCardUnified, setIdCardUnified] = useState("");

  const [addressIdCard, setAddressIdCard] = useState(null);
  const [addressIdCardProvince, setAddressIdCardProvince] = useState(null);
  const [addressIdCardAmphor, setAddressIdCardAmphor] = useState(null);
  const [addressIdCardTambon, setAddressIdCardTambon] = useState(null);
  const [addressIdCardZipCode, setAddressIdCardZipCode] = useState(null);

  const [address, setAddress] = useState(null);
  const [addressProvince, setAddressProvince] = useState(null);
  const [addressAmphor, setAddressAmphor] = useState(null);
  const [addressTambon, setAddressTambon] = useState(null);
  const [addressZipCode, setAddressZipCode] = useState(null);

  const [tel, setTel] = useState(null);
  const [telEmergency, setTelEmergency] = useState(null);
  const [relationship, setRelationship] = useState(null);

  const [selectTypeDisabled, setSelectTypeDisabled] = useState("");
  const [position, setPosition] = useState(null);
  const [role, setRole] = useState(null);
  const [editMode, setEditMode] = useState(isCreate);

  // hooks
  const { fontSize, bgColorMain } = useTheme();

  const studentForm = useStudentForm(dataUser, setEditMode, handleStep);
  const userForm = useUserForm(dataUser, setEditMode);

  const handleForm = isStudent
    ? studentForm.handleStudentForm
    : userForm.handleUserForm;

  const error = isStudent ? studentForm.error : userForm.error;
  const errorIdCard = isStudent ? studentForm.errorIdCard : userForm.errorIdCard;
  const errorIdCardDisabled = isStudent ? studentForm.errorIdCardDisabled : null;

  const { dataProvince } = useProvince();

  // =========================
  // Date helpers
  // =========================
  const today = new Date();
  const dayOfMonth = today.getDate();
  const monthToday = today.getMonth();
  const yearToday = today.getFullYear();

  const years = Array.from({ length: 101 }, (_, i) => yearToday - i);
  const [monthNameToday, setMonthNameToday] = useState("");
  const [months, setMonths] = useState([]);
  const filteredMonths = months.slice(0, monthToday + 1);
  const age = yearBirthday ? yearToday - yearBirthday : null;

  const [dates, setDates] = useState([]);
  const filteredDate = dates.slice(0, dayOfMonth + 1);
  const filteredDate31 = Array.from({ length: 31 }, (_, i) => i + 1);
  const filteredDate30 = Array.from({ length: 30 }, (_, i) => i + 1);
  const filteredDate29 = Array.from({ length: 29 }, (_, i) => i + 1);
  const filteredDate28 = Array.from({ length: 28 }, (_, i) => i + 1);

  useEffect(() => {
    const dateOptions = Array.from({ length: 31 }, (_, i) => i + 1);
    setDates(dateOptions);

    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    setMonthNameToday(monthNames[monthToday]);
    setMonths(monthNames);
  }, [monthToday]);

  // =========================
  // address IDs
  // =========================
  const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
  const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
  const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");

  const [IDaddressProvince, setIDAddressProvince] = useState("");
  const [IDaddressAmphor, setIDAddressAmphor] = useState("");
  const [IDaddressTambon, setIDAddressTambon] = useState("");

  // =========================
  // init data from user
  // =========================
  useEffect(() => {
    if (!dataUser || dataProvince.length === 0) return;

    const stringFields = [
      "user",
      "password",
      "firstName",
      "lastName",
      "profile",
      "detailDisabled",
      "university",
      "email",
      "prefix",
      "nickname",
      "sex",
      "dateBirthday",
      "monthBirthday",
      "yearBirthday",
      "nationality",
      "religion",
      "addressIdCard",
      "addressIdCardProvince",
      "addressIdCardAmphor",
      "addressIdCardTambon",
      "addressIdCardZipCode",
      "address",
      "addressProvince",
      "addressAmphor",
      "addressTambon",
      "addressZipCode",
      "tel",
      "telEmergency",
      "relationship",
      "position",
      "role",
    ];

    const stateSetters = {
      user: setUser,
      password: setPassword,
      firstName: setFirstName,
      lastName: setLastName,
      profile: setProfile,
      detailDisabled: setDetailDisabled,
      university: setUniversity,
      email: setEmail,
      prefix: setPrefix,
      nickname: setNickname,
      sex: setSex,
      dateBirthday: setDateBirthday,
      monthBirthday: setMonthBirthday,
      yearBirthday: setYearBirthday,
      nationality: setNationality,
      religion: setReligion,
      addressIdCard: setAddressIdCard,
      addressIdCardProvince: setAddressIdCardProvince,
      addressIdCardAmphor: setAddressIdCardAmphor,
      addressIdCardTambon: setAddressIdCardTambon,
      addressIdCardZipCode: setAddressIdCardZipCode,
      address: setAddress,
      addressProvince: setAddressProvince,
      addressAmphor: setAddressAmphor,
      addressTambon: setAddressTambon,
      addressZipCode: setAddressZipCode,
      tel: setTel,
      telEmergency: setTelEmergency,
      relationship: setRelationship,
      position: setPosition,
      role: setRole,
    };

    stringFields.forEach((key) => {
      stateSetters[key](dataUser[key] ?? "");
    });

    setTypeDisabled(dataUser.typeDisabled ?? []);
    setSelectTypeDisabled(
      dataUser.typeDisabled?.length > 1
        ? "พิการมากกว่า 1 ประเภท"
        : "พิการ 1 ประเภท"
    );

    // ✅ ตั้งค่าบัตร unified จาก idCard หรือ idCardDisabled (อันไหนมี)
    setIdCardUnified(toId13(dataUser?.idCard || dataUser?.idCardDisabled || ""));

    const resolveLocation = (provinceName, amphorName, tambonName) => {
      const province = dataProvince.find((p) => p.name_th === provinceName);
      const amphor = province?.amphure.find((a) => a.name_th === amphorName);
      const tambon = amphor?.tambon.find((t) => t.name_th === tambonName);
      return {
        provinceId: province?.id ?? null,
        amphorId: amphor?.id ?? null,
        tambonId: tambon?.id ?? null,
      };
    };

    const idCardLocation = resolveLocation(
      dataUser.addressIdCardProvince,
      dataUser.addressIdCardAmphor,
      dataUser.addressIdCardTambon
    );
    setIDAddressIdCardProvince(idCardLocation.provinceId);
    setIDAddressIdCardAmphor(idCardLocation.amphorId);
    setIDAddressIdCardTambon(idCardLocation.tambonId);

    const currentLocation = resolveLocation(
      dataUser.addressProvince,
      dataUser.addressAmphor,
      dataUser.addressTambon
    );
    setIDAddressProvince(currentLocation.provinceId);
    setIDAddressAmphor(currentLocation.amphorId);
    setIDAddressTambon(currentLocation.tambonId);
  }, [dataUser, dataProvince]);

  // checkbox in address add to array
  const handleCheckboxChange = (value) => {
    setTypeDisabled((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      }
      return [...prevState, value];
    });
  };

  // address same ID card
  const [statusSameAddress, setSameAddress] = useState(false);
  function CheckAddressSameIDCard(e) {
    setSameAddress(e);
    if (!statusSameAddress) {
      setAddress(addressIdCard);
      setIDAddressProvince(IDaddressIdCardProvince);
      setIDAddressAmphor(IDaddressIdCardAmphor);
      setIDAddressTambon(IDaddressIdCardTambon);
      setAddressProvince(addressIdCardProvince);
      setAddressAmphor(addressIdCardAmphor);
      setAddressTambon(addressIdCardTambon);
      setAddressZipCode(addressIdCardZipCode);
    }
  }

  // option select date
  const dateOptions = (() => {
    if (yearToday === Number(yearBirthday) && monthNameToday === monthBirthday)
      return filteredDate;
    if (["เมษายน", "กันยายน", "มิถุนายน", "พฤศจิกายน"].includes(monthBirthday))
      return filteredDate30;
    if (monthBirthday === "กุมภาพันธ์") {
      if (Number(yearBirthday) % 4 === 0) return filteredDate29;
      return filteredDate28;
    }
    return filteredDate31;
  })().map((d) => ({ id: d, value: d }));

  // ✅ bodyData: ส่ง 2 ฟิลด์เดิมเหมือนเดิม แต่ใช้ค่าเดียวกัน
  const bodyData = {
    user,
    password,
    firstName,
    lastName,
    profile,
    typeDisabled,
    detailDisabled,
    university,
    email,
    prefix,
    nickname,
    sex,
    dateBirthday,
    monthBirthday,
    yearBirthday,
    nationality,
    religion,

    // ✅ keep DB schema
    idCard: idCardUnified,
    idCardDisabled: idCardUnified,

    addressIdCard,
    addressIdCardProvince,
    addressIdCardAmphor,
    addressIdCardTambon,
    addressIdCardZipCode,
    address,
    addressProvince,
    addressAmphor,
    addressTambon,
    addressZipCode,
    tel,
    telEmergency,
    relationship,
    position,
    role,
    age,
  };

  // progressbar
  const fields = [
    ...(isStudent
      ? [
          typeDisabled,
          detailDisabled,
          profile,
          idCardUnified, // ✅ unified
          selectTypeDisabled,
          relationship,
        ]
      : [user, password, position, role]),
    firstName,
    lastName,
    university,
    email,
    prefix,
    nickname,
    sex,
    dateBirthday,
    monthBirthday,
    yearBirthday,
    nationality,
    religion,
    idCardUnified, // ✅ unified
    addressIdCard,
    addressIdCardProvince,
    addressIdCardAmphor,
    addressIdCardTambon,
    addressIdCardZipCode,
    address,
    addressProvince,
    addressAmphor,
    addressTambon,
    addressZipCode,
    tel,
    telEmergency,
    age,
  ];

  return (
    <>
      <form
        onSubmit={(e) => handleForm(e, bodyData)}
        className={`${fontSize} flex gap-x-10 gap-y-5 flex-wrap w-full`}
      >
        {/* ✅ คำนำหน้า/ชื่อ/นามสกุล/ชื่อเล่น: แถวเดียวกันบนจอใหญ่ */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[6rem_1fr_1fr_1fr] gap-x-10 gap-y-5">
          <SelectLabelForm
            label={"คำนำหน้า"}
            isRequire
            setValue={(val) => {
              setPrefix(val);
              setSex(
                val === "นาย"
                  ? "ชาย"
                  : val === "นาง" || val === "นางสาว"
                  ? "หญิง"
                  : ""
              );
            }}
            value={prefix}
            editMode={editMode}
            tailwind={"w-full"}
            options={[
              { id: "นาย", value: "นาย" },
              { id: "นาง", value: "นาง" },
              { id: "นางสาว", value: "นางสาว" },
            ]}
          />

          <InputLabelForm
            label={"ชื่อ"}
            value={firstName}
            setValue={setFirstName}
            editMode={editMode}
            isRequire
            placeholder={"ชื่อจริง"}
            tailwind={"w-full"}
          />
          <InputLabelForm
            label={"นามสกุล"}
            value={lastName}
            setValue={setLastName}
            editMode={editMode}
            isRequire
            placeholder={"นามสกุล"}
            tailwind={"w-full"}
          />
          <InputLabelForm
            label={"ชื่อเล่น"}
            value={nickname}
            setValue={setNickname}
            editMode={editMode}
            placeholder={"ชื่อเล่น"}
            tailwind={"w-full"}
          />
        </div>

        {prefix !== "0" && prefix ? (
          <InputLabelForm
            label={"เพศ"}
            value={sex}
            editMode={editMode}
            disabled
            tailwind={"w-32"}
            isRequire
          />
        ) : null}

        <div className=" flex flex-col gap-1">
          <LabelForm label={"วันเกิด"} isRequire editMode={editMode} />
          <div className="flex gap-3  flex-wrap">
            <SelectForm
              editMode={editMode}
              setValue={setYearBirthday}
              value={yearBirthday}
              tailwind={"w-32"}
              options={years.map((item) => ({ id: item, value: item }))}
            />
            <SelectForm
              editMode={editMode}
              setValue={setMonthBirthday}
              value={monthBirthday}
              tailwind={"w-36"}
              options={(
                yearToday === Number(yearBirthday) ? filteredMonths : months
              ).map((m) => ({ id: m, value: m }))}
            />
            <SelectForm
              editMode={editMode}
              setValue={setDateBirthday}
              value={dateBirthday}
              tailwind={"w-28"}
              options={dateOptions}
            />
          </div>
        </div>

        {yearBirthday !== "0" &&
        monthBirthday !== "0" &&
        dateBirthday !== "0" &&
        yearBirthday &&
        monthBirthday &&
        dateBirthday ? (
          <InputLabelForm
            label={`อายุ`}
            value={`${age} ปี`}
            editMode={editMode}
            disabled
            tailwind={"w-32"}
            isRequire
          />
        ) : null}

        <SelectLabelForm
          label={"สัญชาติ"}
          isRequire
          editMode={editMode}
          setValue={setNationality}
          value={nationality}
          tailwind={"w-40"}
          options={[
            { id: "ไทย", value: "ไทย" },
            { id: "อื่นๆ", value: "อื่นๆ" },
          ]}
        />

        <SelectLabelForm
          label={"ศาสนา"}
          isRequire
          editMode={editMode}
          setValue={setReligion}
          value={religion}
          tailwind={"w-40"}
          options={[
            { id: "พุทธ", value: "พุทธ" },
            { id: "คริสต์", value: "คริสต์" },
            { id: "อิสลาม", value: "อิสลาม" },
            { id: "อื่นๆ", value: "อื่นๆ" },
          ]}
        />

        {/* ✅ ID Cards: ผูกข้อมูลเดียวกัน */}
        <div className="w-full sm:w-auto">
          <InputLabelForm
            label={`เลขบัตรประจำตัวประชาชน`}
            value={idCardUnified}
            setValue={(v) => setIdCardUnified(toId13(v))}
            editMode={editMode}
            tailwind={"w-full sm:w-64"}
            isRequire
            styles={"idCard"}
            placeholder={"เลขบัตร 13 หลัก"}
          />
          {errorIdCard && (
            <div
              className="text-xs text-red-500 w-full text-end mt-1"
              role="alert"
              aria-live="polite"
            >
              {errorIdCard}
            </div>
          )}
        </div>

        {isStudent && (
          <div className="w-full sm:w-auto">
            <InputLabelForm
              label={`เลขบัตรประจำตัวคนพิการ`}
              value={idCardUnified}
              setValue={(v) => setIdCardUnified(toId13(v))}
              editMode={editMode}
              tailwind={"w-full sm:w-64"}
              isRequire
              styles={"idCard"}
              placeholder={"เลขบัตร 13 หลัก"}
            />
            {errorIdCardDisabled && (
              <div
                className="text-xs text-red-500 w-full text-end mt-1"
                role="alert"
                aria-live="polite"
              >
                {errorIdCardDisabled}
              </div>
            )}
          </div>
        )}

{/* =========================
    ที่อยู่ตามบัตรประชาชน
========================= */}
<div className="w-full flex flex-wrap gap-x-10 gap-y-5">
  {/* ✅ ทำเหมือนที่อยู่ปัจจุบัน: LabelForm + InputForm เพื่อไม่ให้ component บังคับ full row */}
  <div className="w-full sm:w-64 flex flex-col gap-1">
    <LabelForm label={"ที่อยู่ตามบัตรประชาชน"} isRequire editMode={editMode} />

    <InputForm
      editMode={editMode}
      value={addressIdCard}
      setValue={setAddressIdCard}
      isRequire
      placeholder={"บ้านเลขที่, หมู่บ้าน, หอพัก"}
      tailwind={"w-full"}
    />
  </div>

  <SelectLabelForm
    label={"จังหวัด"}
    isRequire
    editMode={editMode}
    setValue={(e) => {
      setIDAddressIdCardProvince(e);
      setIDAddressIdCardAmphor("");
      setIDAddressIdCardTambon("");
      setAddressIdCardAmphor("");
      setAddressIdCardTambon("");
      setAddressIdCardZipCode("");
      setAddressIdCardProvince(
        dataProvince?.find((p) => p.id === parseInt(e))?.name_th
      );
    }}
    value={
      dataProvince.find((p) => p.id === parseInt(IDaddressIdCardProvince))?.id ||
      "0"
    }
    tailwind={"w-full sm:w-64"}
    options={dataProvince?.map((d) => ({ id: d.id, value: d.name_th })) || []}
  />

  {IDaddressIdCardProvince ? (
    <SelectLabelForm
      label={IDaddressIdCardProvince.toString() === "1" ? "แขวง" : "อำเภอ"}
      isRequire
      editMode={editMode}
      setValue={(e) => {
        setIDAddressIdCardAmphor(e);
        setIDAddressIdCardTambon("");
        setAddressIdCardTambon("");
        setAddressIdCardZipCode("");

        const province = dataProvince.find(
          (p) => p.id === parseInt(IDaddressIdCardProvince)
        );
        const amphur = province?.amphure.find((a) => a.id === parseInt(e));
        setAddressIdCardAmphor(amphur?.name_th || "");
      }}
      value={
        dataProvince
          ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))?.id ||
        "0"
      }
      tailwind={"w-full sm:w-64"}
      options={
        dataProvince
          ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          ?.amphure.map((d) => ({ id: d.id, value: d.name_th })) || []
      }
    />
  ) : null}

  {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
    <SelectLabelForm
      label={IDaddressIdCardProvince.toString() === "1" ? "เขต" : "ตำบล"}
      isRequire
      editMode={editMode}
      setValue={(e) => {
        setIDAddressIdCardTambon(e);

        const tambon = dataProvince
          ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))
          ?.tambon.find((t) => t.id === parseInt(e));

        setAddressIdCardTambon(tambon?.name_th || "");
        setAddressIdCardZipCode(tambon?.zip_code || "");
      }}
      value={
        dataProvince
          ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))
          ?.tambon.find((t) => t.id === parseInt(IDaddressIdCardTambon))?.id ||
        "0"
      }
      tailwind={"w-full sm:w-64"}
      options={
        dataProvince
          ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))
          ?.tambon.map((t) => ({ id: t.id, value: t.name_th })) || []
      }
    />
  ) : null}

  {IDaddressIdCardProvince && IDaddressIdCardAmphor && IDaddressIdCardTambon ? (
    <InputLabelForm
      label={"รหัสไปรษณีย์"}
      value={addressIdCardZipCode}
      disabled
      editMode={editMode}
      isRequire
      tailwind={"w-full sm:w-64"}
    />
  ) : null}
</div>

{/* =========================
    ที่อยู่ปัจจุบัน
========================= */}
<div className="w-full flex flex-wrap gap-x-10 gap-y-5">
  {/* ที่อยู่ปัจจุบัน (กว้างเท่าช่องเลขบัตร) */}
  <div className="w-full sm:w-64 flex flex-col gap-1">
    <div className="flex gap-x-2">
      <LabelForm label={"ที่อยู่ปัจจุบัน"} isRequire editMode={editMode} />

      {/* ✅ WCAG: checkbox ผูก label */}
      <div className={`${!editMode ? "hidden" : ""} flex gap-x-1 items-center`}>
        <input
          id="sameAddressIdCard"
          onChange={(e) => CheckAddressSameIDCard(e.target.checked)}
          type="checkbox"
          className="cursor-pointer w-3 h-3 border"
          checked={statusSameAddress}
        />
        <label htmlFor="sameAddressIdCard" className="cursor-pointer">
          (ตามบัตรประชาชน)
        </label>
      </div>
    </div>

    <InputForm
      editMode={editMode}
      value={statusSameAddress ? addressIdCard : address}
      setValue={setAddress}
      isRequire
      placeholder={"บ้านเลขที่, หมู่บ้าน, หอพัก"}
      tailwind={"w-full"}
    />
  </div>

  {/* จังหวัด */}
  <SelectLabelForm
    label={"จังหวัด"}
    isRequire
    editMode={editMode && !statusSameAddress}
    setValue={(e) => {
      setIDAddressProvince(e);
      setIDAddressAmphor("");
      setIDAddressTambon("");
      setAddressAmphor("");
      setAddressTambon("");
      setAddressZipCode("");

      const province = dataProvince.find((p) => p.id === parseInt(e));
      setAddressProvince(province?.name_th || "");
    }}
    value={
      statusSameAddress
        ? dataProvince.find((p) => p.id === parseInt(IDaddressIdCardProvince))
            ?.id || "0"
        : dataProvince.find((p) => p.id === parseInt(IDaddressProvince))?.id ||
          "0"
    }
    tailwind={"w-full sm:w-64"}
    options={dataProvince?.map((d) => ({ id: d.id, value: d.name_th })) || []}
  />

  {/* อำเภอ/แขวง */}
  {(statusSameAddress ? IDaddressIdCardProvince : IDaddressProvince) ? (
    <SelectLabelForm
      label={
        (statusSameAddress ? IDaddressIdCardProvince : IDaddressProvince).toString() === "1"
          ? "แขวง"
          : "อำเภอ"
      }
      isRequire
      editMode={editMode && !statusSameAddress}
      setValue={(e) => {
        setIDAddressAmphor(e);
        setIDAddressTambon("");
        setAddressTambon("");
        setAddressZipCode("");

        const province = dataProvince.find((p) => p.id === parseInt(IDaddressProvince));
        const amphur = province?.amphure.find((a) => a.id === parseInt(e));
        setAddressAmphor(amphur?.name_th || "");
      }}
      value={
        statusSameAddress
          ? dataProvince
              ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))?.id || "0"
          : dataProvince
              ?.find((p) => p.id === parseInt(IDaddressProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))?.id || "0"
      }
      tailwind={"w-full sm:w-64"}
      options={
        (statusSameAddress
          ? dataProvince?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
          : dataProvince?.find((p) => p.id === parseInt(IDaddressProvince))
        )?.amphure.map((d) => ({ id: d.id, value: d.name_th })) || []
      }
    />
  ) : null}

  {/* ตำบล/เขต */}
  {(statusSameAddress ? IDaddressIdCardProvince : IDaddressProvince) &&
  (statusSameAddress ? IDaddressIdCardAmphor : IDaddressAmphor) ? (
    <SelectLabelForm
      label={
        (statusSameAddress ? IDaddressIdCardProvince : IDaddressProvince).toString() === "1"
          ? "เขต"
          : "ตำบล"
      }
      isRequire
      editMode={editMode && !statusSameAddress}
      setValue={(e) => {
        setIDAddressTambon(e);

        const tambon = dataProvince
          ?.find((p) => p.id === parseInt(IDaddressProvince))
          ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
          ?.tambon.find((t) => t.id === parseInt(e));

        setAddressTambon(tambon?.name_th || "");
        setAddressZipCode(tambon?.zip_code || "");
      }}
      value={
        statusSameAddress
          ? dataProvince
              ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))
              ?.tambon.find((t) => t.id === parseInt(IDaddressIdCardTambon))?.id || "0"
          : dataProvince
              ?.find((p) => p.id === parseInt(IDaddressProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
              ?.tambon.find((t) => t.id === parseInt(IDaddressTambon))?.id || "0"
      }
      tailwind={"w-full sm:w-64"}
      options={
        (statusSameAddress
          ? dataProvince
              ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressIdCardAmphor))
          : dataProvince
              ?.find((p) => p.id === parseInt(IDaddressProvince))
              ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
        )?.tambon.map((t) => ({ id: t.id, value: t.name_th })) || []
      }
    />
  ) : null}

  {/* รหัสไปรษณีย์ */}
  {(statusSameAddress ? IDaddressIdCardProvince : IDaddressProvince) &&
  (statusSameAddress ? IDaddressIdCardAmphor : IDaddressAmphor) &&
  (statusSameAddress ? IDaddressIdCardTambon : IDaddressTambon) ? (
    <InputLabelForm
      label={"รหัสไปรษณีย์"}
      value={statusSameAddress ? addressIdCardZipCode : addressZipCode}
      disabled
      editMode={editMode}
      isRequire
      tailwind={"w-full sm:w-64"}
    />
  ) : null}
</div>

        {/* ✅ กลุ่ม: เบอร์ติดต่อ / เบอร์ติดต่อฉุกเฉิน / ความสัมพันธ์ */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
          <InputLabelForm
            label={"เบอร์ติดต่อ"}
            isRequire
            value={tel}
            setValue={setTel}
            placeholder={"หมายเลขโทรศัพท์ 10 หลัก"}
            tailwind={"w-full"}
            styles={"tel"}
            editMode={editMode}
          />

          <InputLabelForm
            label={"เบอร์ติดต่อฉุกเฉิน"}
            value={telEmergency}
            setValue={setTelEmergency}
            placeholder={"หมายเลขโทรศัพท์ 10 หลัก"}
            tailwind={"w-full"}
            styles={"tel"}
            editMode={editMode}
          />

          {isStudent ? (
            <InputLabelForm
              label={"ความสัมพันธ์"}
              value={relationship}
              setValue={setRelationship}
              placeholder={"บุคคลใกล้ชิด"}
              tailwind={"w-full"}
              editMode={editMode}
            />
          ) : (
            <div />
          )}
        </div>

        {/* ✅ กลุ่ม: อีเมล์ / ประเภทความพิการ / รายละเอียดเพิ่มเติม */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
          <InputLabelForm
            disabled={isStudent}
            isRequire
            label={"อีเมล์"}
            value={email}
            setValue={setEmail}
            tailwind={"w-full"}
            editMode={editMode}
            placeholder={"กรอกที่อยู่อีเมล์"}
            type={"email"}
          />

          {isStudent ? (
            <SelectLabelForm
              label={"ประเภทความพิการ"}
              isRequire
              editMode={editMode}
              setValue={(e) => setSelectTypeDisabled(e)}
              value={selectTypeDisabled || "0"}
              tailwind={"w-full"}
              options={[
                { id: "พิการ 1 ประเภท", value: "พิการ 1 ประเภท" },
                { id: "พิการมากกว่า 1 ประเภท", value: "พิการมากกว่า 1 ประเภท" },
              ]}
            />
          ) : (
            <div />
          )}

          {isStudent ? (
            <InputLabelForm
              label={"รายละเอียดเพิ่มเติม"}
              value={detailDisabled}
              setValue={setDetailDisabled}
              tailwind={"w-full"}
              editMode={editMode}
              placeholder={"รายละเอียด"}
            />
          ) : (
            <div />
          )}
        </div>

        {/* staff/admin form */}
        {!isStudent && (
          <>
            <InputLabelForm
              label={"ตำแหน่ง"}
              value={position}
              setValue={setPosition}
              tailwind={"w-full sm:w-60"}
              editMode={editMode}
              placeholder={"ตำแหน่ง"}
            />

            <div className="w-full sm:w-auto">
              <LabelForm label="มหาวิทยาลัย" isRequire editMode={editMode} />
              <InputUniversityAutoComplete
                value={university}
                onChange={setUniversity}
                tailwind={"py-2 w-full sm:w-60 mt-1"}
                editMode={editMode}
              />
            </div>

            <InputLabelForm
              isRequire
              label={"Username"}
              value={user}
              setValue={setUser}
              tailwind={"w-full sm:w-60"}
              editMode={editMode}
              placeholder={"กรอกชื่อผู้ใช้"}
            />

            <InputLabelForm
              isRequire
              label={"Password"}
              value={password}
              setValue={setPassword}
              tailwind={"w-full sm:w-60"}
              editMode={editMode}
              placeholder={"กรอกรหัสผ่าน"}
              styles={"password"}
            />

            <SelectLabelForm
              label={"ประเภทผู้ใช้งาน"}
              value={role}
              setValue={setRole}
              isRequire
              editMode={editMode}
              options={[
                { id: ROLE.USER, value: ROLE.USER },
                { id: ROLE.ADMIN, value: ROLE.SUPERUSER },
                { id: ROLE.SUPERVISOR, value: ROLE.ADMIN },
              ]}
              tailwind={"w-full sm:w-40"}
            />
          </>
        )}

        {/* student: disability */}
        {isStudent && (
          <>
            <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
              {/* “เลือกความพิการ” และ checkbox list ยังทำงานเหมือนเดิม */}
              <SelectLabelForm
                label="เลือกความพิการ"
                isRequire
                editMode={editMode}
                setValue={(e) => setTypeDisabled([e])}
                value={typeDisabled[0] || "0"}
                tailwind={`w-full sm:w-64 ${
                  selectTypeDisabled === "พิการ 1 ประเภท" ? "block" : "hidden"
                }`}
                options={[
                  ...dataDisabled.map((item) => ({ id: item, value: item })),
                ]}
              />

              <div
                className={`flex flex-col my-5 ${
                  selectTypeDisabled === "พิการมากกว่า 1 ประเภท"
                    ? "block"
                    : "hidden"
                }`}
              >
                {dataDisabled.map((type, idx) => (
                  <div
                    key={idx}
                    className={`${
                      !typeDisabled.includes(type) && !editMode ? "hidden" : ""
                    } ${bgColorMain} flex gap-x-3 mt-2`}
                  >
                    <input
                      type="checkbox"
                      aria-label={`เลือกความพิการ: ${type}`}
                      className="cursor-pointer w-10 border"
                      onChange={() => handleCheckboxChange(type)}
                      checked={typeDisabled.includes(type)}
                      hidden={!editMode}
                    />
                    <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                      <span className={`${editMode ? "hidden" : ""}`}>-</span>{" "}
                      {type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex">
              <div className="flex flex-col gap-1">
                <LabelForm label={"อัปโหลดรูปโปรไฟล์"} editMode={editMode} />
                <div className="my-1">
                  <Profile imageSrc={profile} />
                  {editMode && (
                    <div className="mt-2">
                      <TextError text="รูปภาพสี่เหลี่ยมจัตุรัส (128×128px) ขนาดไม่เกิน 500KB (JPG, JEPG, PNG)" />
                    </div>
                  )}
                </div>

                <UploadFile
                  isDisabled={false}
                  editMode={editMode}
                  uuid={dataUser?.uuid}
                  setValue={(url) => setProfile(url)}
                  maxSizeKB={500}
                  acceptTypes={["image/jpeg", "image/png", "image/jpg"]}
                />
              </div>
            </div>
          </>
        )}

        <div className="w-full text-center">
          {error ? (
            <div role="alert" aria-live="polite">
              <TextError text={error} />
            </div>
          ) : null}
        </div>

        {editMode && <ProgressBarForm fields={fields} />}

        {!readOnly && (
          <ButtonGroup
            editMode={editMode}
            setEditMode={setEditMode}
            isCreate={isCreate}
            tailwind="mt-5"
          />
        )}
      </form>
    </>
  );
}

export default PersonalForm;
