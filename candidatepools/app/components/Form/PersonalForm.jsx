"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useTheme } from "@/app/ThemeContext";

//assets
import dataDisabled from "@/assets/dataDisabled";

//component
import InputLabelForm from "@/app/components/Form/InputLabelForm";
import InputForm from "@/app/components/Form/InputForm";
import SelectLabelForm from "@/app/components/Form/SelectLabelForm";
import SelectForm from "@/app/components/Form/SelectForm";
import LabelForm from "@/app/components/Form/LabelForm";
import TextError from "@/app/components/TextError";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";

//hooks
import { useStudentForm } from "@/hooks/useStudentForm";
import { useUserForm } from "@/hooks/useUserForm";
import { useProvince } from "@/hooks/useProvince";
import UploadFile from "./UploadFile";
import InputUniversityAutoComplete from "./InputUniversityAutoComplete";
import { ROLE } from "@/const/enum";
import ButtonGroup from "./ButtonGroup/ButtonGroup";

function PersonalForm({ dataUser, isStudent = true, isCreate = false }) {
  //data value
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
  const [idCard, setIdCard] = useState(null);
  const [idCardDisabled, setIdCardDisabled] = useState(null);
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

  //hooks
  const { fontSize, bgColorMain, inputGrayColor } = useTheme();

  const studentForm = useStudentForm(dataUser, setEditMode);
  const userForm = useUserForm(dataUser, setEditMode);

  const handleForm = isStudent
    ? studentForm.handleStudentForm
    : userForm.handleUserForm;
  const error = isStudent ? studentForm.error : userForm.error;
  const errorIdCard = isStudent
    ? studentForm.errorIdCard
    : userForm.errorIdCard;
  const errorIdCardDisabled = isStudent
    ? studentForm.errorIdCardDisabled
    : null;
  const { dataProvince } = useProvince();

  // สร้าง Date object สำหรับวันที่ปัจจุบัน
  const today = new Date();

  // ดึงวันปัจจุบันในรูปแบบต่าง ๆ
  const dayOfMonth = today.getDate(); // วันที่ของเดือน (1-31)
  const monthToday = today.getMonth(); // เดือน (0-11, 0 คือ มกราคม, 11 คือ ธันวาคม)
  const yearToday = today.getFullYear();
  // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
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

  const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
  const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
  const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");
  const [IDaddressProvince, setIDAddressProvince] = useState("");
  const [IDaddressAmphor, setIDAddressAmphor] = useState("");
  const [IDaddressTambon, setIDAddressTambon] = useState("");

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
      "idCard",
      "idCardDisabled",
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
      idCard: setIdCard,
      idCardDisabled: setIdCardDisabled,
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

    // set address
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

  //checkbox in address add to array
  const handleCheckboxChange = (value) => {
    setTypeDisabled((prevState) => {
      if (prevState.includes(value)) {
        // หากค่าอยู่ใน array แล้ว, ลบออก
        return prevState.filter((item) => item !== value);
      } else {
        // หากค่าไม่อยู่ใน array, เพิ่มเข้าไป
        return [...prevState, value];
      }
    });
  };

  // Check address same address IDCard
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

  //option select
  const dateOptions = (() => {
    if (yearToday === Number(yearBirthday) && monthNameToday === monthBirthday)
      return filteredDate;
    if (["เมษายน", "กันยายน", "มิถุนายน", "พฤศจิกายน"].includes(monthBirthday))
      return filteredDate30;
    if (monthBirthday === "กุมภาพันธ์") {
      if (Number(yearBirthday) % 4 === 0) return filteredDate29;
      else return filteredDate28;
    }
    return filteredDate31;
  })().map((d) => ({ id: d, value: d }));

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
    idCard,
    idCardDisabled,
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

  //for progressbar
  const fields = [
    ...(isStudent
      ? [
          typeDisabled,
          detailDisabled,
          profile,
          idCardDisabled,
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
    idCard,
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
        className={`${fontSize} flex gap-x-10 gap-y-5 gap- flex-wrap`}
      >
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
          tailwind={"w-24"}
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
        />
        <InputLabelForm
          label={"นามสกุล"}
          value={lastName}
          setValue={setLastName}
          editMode={editMode}
          isRequire
          placeholder={"นามสกุล"}
        />
        <InputLabelForm
          label={"ชื่อเล่น"}
          value={nickname}
          setValue={setNickname}
          editMode={editMode}
          placeholder={"ชื่อเล่น"}
        />
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
              options={years.map((item) => {
                return {
                  id: item,
                  value: item,
                };
              })}
            />
            <SelectForm
              editMode={editMode}
              setValue={setMonthBirthday}
              value={monthBirthday}
              tailwind={"w-36"}
              options={(yearToday === Number(yearBirthday)
                ? filteredMonths
                : months
              ).map((m) => ({
                id: m,
                value: m,
              }))}
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
            {
              id: "ไทย",
              value: "ไทย",
            },
            {
              id: "อื่นๆ",
              value: "อื่นๆ",
            },
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
        <div>
          <InputLabelForm
            label={`เลขบัตรประจำตัวประชาชน`}
            value={idCard}
            setValue={setIdCard}
            editMode={editMode}
            tailwind={"w-64"}
            isRequire
            styles={"idCard"}
            placeholder={"เลขบัตร 13 หลัก"}
          />
          {errorIdCard && (
            <div className="text-xs text-red-500 w-full text-end mt-1 ">
              {errorIdCard}
            </div>
          )}
        </div>
        {isStudent && (
          <div>
            <InputLabelForm
              label={`เลขบัตรประจำตัวคนพิการ`}
              value={idCardDisabled}
              setValue={setIdCardDisabled}
              editMode={editMode}
              tailwind={"w-64"}
              isRequire
              styles={"idCard"}
              placeholder={"เลขบัตร 13 หลัก"}
            />
            {errorIdCardDisabled && (
              <div className="text-xs text-red-500 w-full text-end mt-1 ">
                {errorIdCardDisabled}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
          <InputLabelForm
            label={`ที่อยู่ตามบัตรประชาชน`}
            value={addressIdCard}
            setValue={setAddressIdCard}
            editMode={editMode}
            tailwind={"w-72"}
            isRequire
            placeholder={"บ้านเลขที่, หมู่บ้าน, หอพัก"}
          />
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
              dataProvince.find(
                (p) => p.id === parseInt(IDaddressIdCardProvince)
              )?.id || "0"
            }
            tailwind={"w-48"}
            options={
              dataProvince?.map((d) => ({
                id: d.id,
                value: d.name_th,
              })) || []
            }
          />
          {IDaddressIdCardProvince ? (
            <SelectLabelForm
              label={"อำเภอ"}
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
                const amphur = province?.amphure.find(
                  (a) => a.id === parseInt(e)
                );
                setAddressIdCardAmphor(amphur?.name_th || "");
              }}
              value={
                dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                  ?.amphure.find(
                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                  )?.id || "0"
              }
              tailwind={"w-48"}
              options={
                dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                  ?.amphure.map((d) => ({
                    id: d.id,
                    value: d.name_th,
                  })) || []
              }
            />
          ) : null}
          {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
            <SelectLabelForm
              label={"ตำบล"}
              isRequire
              editMode={editMode}
              setValue={(e) => {
                setIDAddressIdCardTambon(e);

                const tambon = dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                  ?.amphure.find(
                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                  )
                  ?.tambon.find((t) => t.id === parseInt(e));

                setAddressIdCardTambon(tambon?.name_th || "");
                setAddressIdCardZipCode(tambon?.zip_code || "");
              }}
              value={
                dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                  ?.amphure.find(
                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                  )
                  ?.tambon.find((t) => t.id === parseInt(IDaddressIdCardTambon))
                  ?.id || "0"
              }
              tailwind={"w-48"}
              options={
                dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                  ?.amphure.find(
                    (a) => a.id === parseInt(IDaddressIdCardAmphor)
                  )
                  ?.tambon.map((t) => ({
                    id: t.id,
                    value: t.name_th,
                  })) || []
              }
            />
          ) : null}
          {IDaddressIdCardProvince &&
          IDaddressIdCardAmphor &&
          IDaddressIdCardTambon ? (
            <InputLabelForm
              label={"รหัสไปรษณีย์"}
              value={addressIdCardZipCode}
              disabled
              editMode={editMode}
              isRequire
              tailwind={"w-36"}
            />
          ) : null}
        </div>
        <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
          <div className="flex col flex-col gap-1">
            <div className="flex gap-x-2 ">
              <LabelForm
                label={"ที่อยู่ปัจจุบัน"}
                isRequire
                editMode={editMode}
              />
              <div className={`${!editMode ? "hidden" : ""} flex gap-x-1`}>
                <input
                  onChange={(e) => CheckAddressSameIDCard(e.target.checked)}
                  type="checkbox"
                  className={`cursor-pointer w-3 h-full border`}
                  checked={statusSameAddress}
                />
                <p>(ตามบัตรประชาชน)</p>
              </div>
            </div>
            <InputForm
              editMode={editMode}
              value={statusSameAddress ? addressIdCard : address}
              setValue={setAddress}
              isRequire
              placeholder={"บ้านเลขที่, หมู่บ้าน, หอพัก"}
              tailwind={"w-72"}
            />
          </div>
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
                ? dataProvince.find(
                    (p) => p.id === parseInt(IDaddressIdCardProvince)
                  )?.id || "0"
                : dataProvince.find((p) => p.id === parseInt(IDaddressProvince))
                    ?.id || "0"
            }
            tailwind={"w-48"}
            options={
              dataProvince.map((d) => ({
                id: d.id,
                value: d.name_th,
              })) || []
            }
          />
          {IDaddressProvince ? (
            <SelectLabelForm
              label={"อำเภอ"}
              isRequire
              editMode={editMode && !statusSameAddress}
              setValue={(e) => {
                setIDAddressAmphor(e);
                setIDAddressTambon("");
                setAddressTambon("");
                setAddressZipCode("");

                const amphor = dataProvince
                  ?.find((p) => p.id === parseInt(IDaddressProvince))
                  ?.amphure.find((a) => a.id === parseInt(e));

                setAddressAmphor(amphor?.name_th || "");
              }}
              value={
                statusSameAddress
                  ? dataProvince
                      ?.find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      ?.amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )?.id || "0"
                  : dataProvince
                      ?.find((p) => p.id === parseInt(IDaddressProvince))
                      ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
                      ?.id || "0"
              }
              tailwind={"w-48"}
              options={(
                dataProvince.find((p) => p.id === parseInt(IDaddressProvince))
                  ?.amphure || []
              ).map((d) => ({
                id: d.id,
                value: d.name_th,
              }))}
            />
          ) : null}
          {IDaddressProvince && IDaddressAmphor ? (
            <SelectLabelForm
              label={"ตำบล"}
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
                      .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      ?.amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )
                      ?.tambon.find(
                        (t) => t.id === parseInt(IDaddressIdCardTambon)
                      )?.id
                  : dataProvince
                      .find((p) => p.id === parseInt(IDaddressProvince))
                      ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
                      ?.tambon.find((t) => t.id === parseInt(IDaddressTambon))
                      ?.id || "0"
              }
              tailwind={"w-48"}
              options={(
                dataProvince
                  .find((p) => p.id === parseInt(IDaddressProvince))
                  ?.amphure.find((a) => a.id === parseInt(IDaddressAmphor))
                  ?.tambon || []
              ).map((d) => ({
                id: d.id,
                value: d.name_th,
              }))}
            />
          ) : null}
          {IDaddressProvince && IDaddressAmphor && IDaddressTambon ? (
            <InputLabelForm
              label={"รหัสไปรษณีย์"}
              isRequire
              disabled
              value={
                statusSameAddress ? addressIdCardZipCode : addressZipCode || "-"
              }
              tailwind={"w-36"}
              editMode={editMode}
            />
          ) : null}
        </div>
        <InputLabelForm
          label={"เบอร์ติดต่อ"}
          isRequire
          value={tel}
          setValue={setTel}
          placeholder={"หมายเลขโทรศัพท์ 10 หลัก"}
          tailwind={"w-60"}
          styles={"tel"}
          editMode={editMode}
        />
        <InputLabelForm
          label={"เบอร์ติดต่อฉุกเฉิน"}
          value={telEmergency}
          setValue={setTelEmergency}
          placeholder={"หมายเลขโทรศัพท์ 10 หลัก"}
          tailwind={"w-60"}
          styles={"tel"}
          editMode={editMode}
        />
        {isStudent && (
          <InputLabelForm
            label={"ความสัมพันธ์"}
            value={relationship}
            setValue={setRelationship}
            placeholder={"บุคคลใกล้ชิด"}
            tailwind={"w-60"}
            editMode={editMode}
          />
        )}
        <InputLabelForm
          disabled={isStudent}
          isRequire
          label={"อีเมล์"}
          value={email}
          setValue={setEmail}
          tailwind={"w-60"}
          editMode={editMode}
          placeholder={"กรอกที่อยู่อีเมล์"}
        />
        {!isStudent && (
          <>
            <InputLabelForm
              label={"ตำแหน่ง"}
              value={position}
              setValue={setPosition}
              tailwind={"w-60"}
              editMode={editMode}
              placeholder={"ตำแหน่ง"}
            />
            <div>
              <LabelForm label="มหาวิทยาลัย" isRequire editMode={editMode} />
              <InputUniversityAutoComplete
                value={university}
                onChange={setUniversity}
                tailwind={"py-2 w-60"}
                editMode={editMode}
              />
            </div>
            <InputLabelForm
              isRequire
              label={"Username"}
              value={user}
              setValue={setUser}
              tailwind={"w-60"}
              editMode={editMode}
              placeholder={"กรอกชื่อผู้ใช้"}
            />
            <InputLabelForm
              isRequire
              label={"Password"}
              value={password}
              setValue={setPassword}
              tailwind={"w-60"}
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
                {
                  id: ROLE.USER,
                  value: ROLE.USER,
                },
                {
                  id: ROLE.ADMIN,
                  value: ROLE.SUPERUSER,
                },
                {
                  id: ROLE.SUPERVISOR,
                  value: ROLE.ADMIN,
                },
              ]}
              tailwind={"w-40"}
            />
          </>
        )}
        {isStudent && (
          <>
            <div className="flex gap-x-10 gap-y-5 flex-wrap">
              <SelectLabelForm
                label={"ประเภทความพิการ"}
                isRequire
                editMode={editMode}
                setValue={(e) => setSelectTypeDisabled(e)}
                value={selectTypeDisabled || "0"}
                tailwind={"w-64"}
                options={[
                  { id: "พิการ 1 ประเภท", value: "พิการ 1 ประเภท" },
                  {
                    id: "พิการมากกว่า 1 ประเภท",
                    value: "พิการมากกว่า 1 ประเภท",
                  },
                ]}
              />
              <SelectLabelForm
                label="เลือกความพิการ"
                isRequire
                editMode={editMode}
                setValue={(e) => setTypeDisabled([e])}
                value={typeDisabled[0] || "0"}
                tailwind={`w-64 ${
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
              <InputLabelForm
                label={"รายละเอียดเพิ่มเติม"}
                value={detailDisabled}
                setValue={setDetailDisabled}
                tailwind={"w-60"}
                editMode={editMode}
                placeholder={"รายละเอียด"}
              />
            </div>
            <div className="w-full flex">
              <div className="flex flex-col gap-1">
                <LabelForm label={"อัปโหลดรูปโปรไฟล์"} editMode={editMode} />
                <div className="w-32 h-32 relative my-1">
                  <Image
                    className="w-full h-full cursor-pointer"
                    src={profile || "/image/main/user.png"}
                    height={1000}
                    width={1000}
                    alt="profile"
                    priority
                  />
                </div>
                <UploadFile
                  isDisabled={true}
                  editMode={editMode}
                  uuid={dataUser?.uuid}
                  setValue={(url) => setProfile(url)} // หรือ setValue(url) ตามที่คุณใช้
                />
              </div>
            </div>
          </>
        )}
        <div className="w-full text-center">
          {error ? <TextError text={error} /> : null}
        </div>
        {/* {editMode ? (
        <div className="flex gap-10 w-full justify-center mt-5">
          {!isCreate && (
            <ButtonBG1
              text={"ยกเลิก"}
              mdiIcon={mdiCloseCircle}
              handleClick={() => setEditMode(false)}
            />
          )}
          <ButtonBG2
            text={"บันทึก"}
            mdiIcon={mdiContentSave}
            btn
            handleClick={() => {
              console.log("Submit Form");
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <ButtonBG1
            text={"แก้ไขข้อมูล"}
            mdiIcon={mdiAccountEdit}
            handleClick={() => setEditMode(true)}
          />
        </div>
      )} */}
        {editMode && <ProgressBarForm fields={fields} />}
        <ButtonGroup
          editMode={editMode}
          setEditMode={setEditMode}
          isCreate={isCreate}
          tailwind="mt-5"
        />
      </form>
    </>
  );
}

export default PersonalForm;
