"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiPlus, mdiCloseCircle, mdiArrowDownDropCircle } from "@mdi/js";
import Swal from "sweetalert2";
import useProvinceData from "@/utils/province";
import dataWorkType from "@/assets/dataWorkType";
import dates from "@/app/data/date.json";

import { useRouter } from "next/navigation";
import ButtonGroup from "@/app/components/Form/ButtonGroup/ButtonGroup";

import { useCompanyStore } from "@/stores/useCompanyStore";
import { toast } from "react-toastify";
import SelectLabelForm from "../SelectLabelForm";
import { dataTypeBusiness } from "@/assets/dataTypeBusiness";
import InputLabelForm from "../InputLabelForm";
import SelectForm from "../SelectForm";
import LabelForm from "../LabelForm";
import InputForm from "../InputForm";

function CompanyForm({ id, dataCompany, isEdit = false, path }) {
  //Theme
  const { bgColor, bgColorMain, bgColorMain2, inputEditColor } = useTheme();

  //store
  const { fetchCompanies, createCompany, updateCompany } = useCompanyStore();
  const router = useRouter();

  //address data
  const [editMode, setEditMode] = useState(!isEdit);
  const [nameCompany, setNameCompany] = useState("");
  const [addressIdCard, setAddressIdCard] = useState(null);
  const [addressIdCardProvince, setAddressIdCardProvince] = useState(null);
  const [addressIdCardAmphor, setAddressIdCardAmphor] = useState(null);
  const [addressIdCardTambon, setAddressIdCardTambon] = useState(null);
  const [addressIdCardZipCode, setAddressIdCardZipCode] = useState(null);
  const [typeBusiness, setTypeBusiness] = useState(null);
  const [quantityEmployee, setQuantityEmployee] = useState(null);
  const [quantityDisabled, setQuantityDisabled] = useState(null);
  const [coordinator, setCoordinator] = useState("");
  const [telCoordinator, setTelCoordinator] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [positionWork, setPositionWork] = useState("");
  const [workType, setWorkType] = useState("");
  const [workDetail, setWorkDetail] = useState("");
  const [dutyWork, setDutyWork] = useState("");
  const [addressWork, setAddressWork] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [budget, setBudget] = useState(null);
  const [timeStartWork, setTimeStartWork] = useState(null);
  const [welfare, setWelfare] = useState([]);

  const [getAddressIdCard, setGetAddressIdCard] = useState("");
  const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
  const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
  const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");

  const [getAddressIdCardProvince, setGetAddressIdCardProvince] = useState("");
  const [getAddressIdCardAmphor, setGetAddressIdCardAmphor] = useState("");
  const [getAddressIdCardTambon, setGetAddressIdCardTambon] = useState("");
  const [getAddressIdCardZipCode, setGetAddressIdCardZipCode] = useState("");
  const dataProvince = useProvinceData();

  const [error, setError] = useState("");

  //worktype

  const [getWorkType, setGetWorkType] = useState("");
  const [getWorkDetail, setGetWorkDetail] = useState("");

  //dateWork

  const [getDateStart, setGetDateStart] = useState("");
  const [getDateEnd, setGetDateEnd] = useState("");

  //time

  const [getTimeStart, setGetTimeStart] = useState("");
  const [getTimeEnd, setGetTimeEnd] = useState("");

  //welfare
  const [getWelfare, setGetWelfare] = useState([]);

  const handleGetArray = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWelfare((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // เพิ่มค่าว่างเพื่อคงขนาดอาร์เรย์
      }

      // อัปเดตค่าใหม่ในตำแหน่งที่กำหนด
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const [fieldwalfare, setGetFieldwalfare] = useState([{}]);
  const [errorFieldWalfare, setErrorFieldWalfare] = useState("");
  const handleAddField = () => {
    // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล skill ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
    if (
      !welfare[fieldwalfare.length - 1] &&
      !getWelfare[fieldwalfare.length - 1]
    ) {
      setErrorFieldWalfare("กรุณากรอกข้อมูลทักษะให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    setErrorFieldWalfare("");
    setGetFieldwalfare([...fieldwalfare, { text: "text" }]); // เพิ่มออบเจกต์ว่างใน fieldwalfare
  };

  const handleRemoveField = (index) => {
    Swal.fire({
      title: "ลบข้อมูล",
      text: "คุณต้องการลบข้อมูลนี้?",
      icon: "warning",
      confirmButtonText: "ใช่",
      confirmButtonColor: "#f27474",
      showCancelButton: true,
      cancelButtonText: "ไม่",
    }).then((result) => {
      if (result.isConfirmed) {
        const newSkills = [...fieldwalfare];
        newSkills.splice(index, 1);
        setGetFieldwalfare(newSkills);

        const temp = index;

        setErrorFieldWalfare("");

        // ลบข้อมูลจาก skillType, skillName, และ skillDetail
        setWelfare((prev) => prev.filter((_, i) => i !== temp));
        setGetWelfare((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //Coordinator

  const [getCoordinator, setGetCoordinator] = useState("");
  const [getTetCoordinator, setGetTelCoordinator] = useState("");

  //name company
  const [getNameCompany, setGetNameCompany] = useState("");

  //handle array
  function mergeArrayValues(nonGetArray, getArray) {
    // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
    if (nonGetArray.length === 0) {
      return getArray;
    }

    if (nonGetArray.length > getArray.length) {
      return nonGetArray.map((value, index) => {
        return value || getArray[index] || "";
      });
    } else {
      return getArray.map((value, index) => {
        return nonGetArray[index] || value || "";
      });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();

    const tempNameCompany = nameCompany || getNameCompany;
    const tempAddress = addressIdCard || getAddressIdCard;
    const tempProvince = addressIdCardProvince || getAddressIdCardProvince;
    const tempAmphor = addressIdCardAmphor || getAddressIdCardAmphor;
    const tempTambon = addressIdCardTambon || getAddressIdCardTambon;
    const tempZipcode = addressIdCardZipCode || getAddressIdCardZipCode;
    const tempWorkType = workType || getWorkType;
    const tempWorkDetail = workDetail || getWorkDetail;
    const tempDateStart = dateStart || getDateStart;
    const tempDateEnd = dateEnd || getDateEnd;
    const tempTimeStart = timeStart || getTimeStart;
    const tempTimeEnd = timeEnd || getTimeEnd;
    const tempCoordinator = coordinator || getCoordinator;
    const tempCoordinatorTel = telCoordinator || getTetCoordinator;
    const mergedWelfare = mergeArrayValues(welfare, getWelfare);

    if (
      !tempNameCompany ||
      !tempAddress ||
      !tempProvince ||
      !tempAmphor ||
      !tempTambon ||
      !tempZipcode ||
      !tempWorkType ||
      !tempWorkDetail ||
      !tempDateStart ||
      !tempDateEnd ||
      !tempTimeStart ||
      !tempTimeEnd ||
      !tempCoordinator ||
      !tempCoordinatorTel ||
      !mergedWelfare[mergedWelfare?.length - 1] ||
      !typeBusiness ||
      !dutyWork ||
      !quantityEmployee ||
      !quantityDisabled ||
      !emailCompany ||
      !positionWork ||
      !addressWork ||
      !budget ||
      !timeStartWork
    ) {
      setError("กรุณกรอกข้อมูลให้ครบทุกช่อง");

      return;
    }

    setError("");

    const body = {
      nameCompany: tempNameCompany,
      address: tempAddress,
      province: tempProvince,
      amphor: tempAmphor,
      tambon: tempTambon,
      zipcode: tempZipcode,
      work_type: tempWorkType,
      work_detail: tempWorkDetail,
      date_start: tempDateStart,
      date_end: tempDateEnd,
      time_start: tempTimeStart,
      time_end: tempTimeEnd,
      welfare: mergedWelfare,
      coordinator: tempCoordinator,
      coordinator_tel: tempCoordinatorTel,
      typeBusiness: typeBusiness,
      dutyWork: dutyWork,
      quantityEmployee: quantityEmployee,
      quantityDisabled: quantityDisabled,
      emailCompany: emailCompany,
      positionWork: positionWork,
      addressWork: addressWork,
      budget: budget,
      timeStartWork: timeStartWork,
    };
    try {
      const res = (await isEdit)
        ? await updateCompany(id, body) // ใช้ id ได้ตรงนี้
        : await createCompany(body);

      if (!res.ok) {
        toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        setError("");
        return;
      }

      toast.success("บันทึกข้อมูลสำเร็จ");
      if (isEdit) {
        setEditMode(false);
      } else {
        router.push(path);
      }
      fetchCompanies();
      setError("");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!dataCompany) return;

    // // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setGetNameCompany(dataCompany?.nameCompany);
    setGetAddressIdCard(dataCompany?.address);
    setGetAddressIdCardProvince(dataCompany?.province);
    setGetAddressIdCardAmphor(dataCompany?.amphor);
    setGetAddressIdCardTambon(dataCompany?.tambon);
    setGetAddressIdCardZipCode(dataCompany?.zipcode);
    setGetWorkType(dataCompany?.work_type);
    setGetWorkDetail(dataCompany?.work_detail);
    setGetDateStart(dataCompany?.date_start);
    setGetDateEnd(dataCompany?.date_end);
    setGetTimeStart(dataCompany?.time_start);
    setGetTimeEnd(dataCompany?.time_end);
    setGetWelfare(dataCompany?.welfare);
    setGetCoordinator(dataCompany?.coordinator);
    setGetTelCoordinator(dataCompany?.coordinator_tel);

    setIDAddressIdCardProvince(
      dataProvince.find((p) => p.name_th === dataCompany.province)?.id || null
    );
    setIDAddressIdCardAmphor(
      dataProvince
        .find((p) => p.name_th === dataCompany.province)
        ?.amphure.find((a) => a.name_th === dataCompany.amphor)?.id || null
    );
    setIDAddressIdCardTambon(
      dataProvince
        .find((p) => p.name_th === dataCompany.province)
        ?.amphure.find((a) => a.name_th === dataCompany.amphor)
        ?.tambon.find((t) => t.name_th === dataCompany.tambon)?.id || null
    );
    // set ฟิลด์เริ่มต้น
    if (
      Array.isArray(dataCompany?.welfare) &&
      dataCompany?.welfare.length > 0
    ) {
      setGetFieldwalfare(dataCompany?.welfare);
    }
  }, [dataCompany, dataProvince]);

  const CheckAddressSame = (checked) => {
    if (
      !addressIdCard ||
      !addressIdCardZipCode
    ) {
      setError("ไม่พบข้อมูลที่ตั้งกรุณาระบุข้อมูลที่ตั้งก่อน")
      return;
    }
    if (checked === true) {
      setAddressWork(
        `${addressIdCard} ${addressIdCardProvince} ${addressIdCardAmphor} ${addressIdCardTambon} ${addressIdCardZipCode}`
      );
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className={`${bgColorMain2} ${bgColor} rounded-lg flex flex-col gap-7`}
    >
      <div className="flex gap-y-5 gap-x-10 flex-wrap">
        <InputLabelForm
          label="ชื่อบริษัท"
          isRequire
          value={nameCompany || getNameCompany || ""}
          setValue={setNameCompany}
          editMode={editMode}
          placeholder={"ตัวอย่าง: บริษัทเฟรนลี่เดฟ จำกัด"}
          tailwind={"w-96"}
        />
        <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
          <InputLabelForm
            label="ที่ตั้ง"
            isRequire
            value={addressIdCard || getAddressIdCard || ""}
            setValue={setAddressIdCard}
            editMode={editMode}
            placeholder={"สถานที่ใกล้สถานีรถไฟฟ้า พหลโยธิน 59"}
            tailwind={"w-96"}
          />
          <div className=" flex flex-col ">
            <label>
              จังหวัด{" "}
              <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                *
              </span>
            </label>
            <div className="relative col w-fit mt-1">
              <select
                onChange={(e) => {
                  setIDAddressIdCardProvince(e.target.value);
                  setIDAddressIdCardAmphor("");
                  setIDAddressIdCardTambon("");
                  setAddressIdCardAmphor("");
                  setAddressIdCardTambon("");
                  setAddressIdCardZipCode("");
                  setAddressIdCardProvince(
                    dataProvince.find((p) => p.id === parseInt(e.target.value))
                      .name_th
                  );
                }}
                className={`${
                  !editMode
                    ? `${inputEditColor} cursor-default`
                    : `${bgColorMain} cursor-pointer`
                } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                style={{ appearance: "none" }}
                disabled={!editMode}
                value={
                  dataProvince.find(
                    (p) => p.id === parseInt(IDaddressIdCardProvince)
                  )?.id || "0"
                }
              >
                <option value="0">-</option>
                {dataProvince.map((d, index) => (
                  <option key={index} value={d.id}>
                    {d.name_th}
                  </option>
                ))}
              </select>
              <Icon
                className={`${
                  !editMode ? "hidden" : ""
                } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>
          {IDaddressIdCardProvince ? (
            <div className=" flex flex-col">
              <label>
                {IDaddressIdCardProvince.toString() === "1"
                  ? "แขวง "
                  : "อำเภอ "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  onChange={(e) => {
                    setIDAddressIdCardAmphor(e.target.value);
                    setIDAddressIdCardTambon("");
                    setAddressIdCardTambon("");
                    setAddressIdCardZipCode("");
                    setAddressIdCardAmphor(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find((a) => a.id === parseInt(e.target.value))
                        .name_th
                    );
                  }}
                  className={`${
                    !editMode
                      ? `${inputEditColor} cursor-default`
                      : `${bgColorMain} cursor-pointer`
                  } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  disabled={!editMode}
                  value={
                    dataProvince
                      .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      .amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )?.id || "0"
                  }
                >
                  <option value="0">-</option>
                  {dataProvince
                    .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                    .amphure.map((d, index) => (
                      <option key={index} value={d.id}>
                        {d.name_th}
                      </option>
                    ))}
                </select>
                <Icon
                  className={`${
                    !editMode ? "hidden" : ""
                  } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
          ) : null}
          {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
            <div className=" flex flex-col">
              <label>
                {IDaddressIdCardProvince.toString() === "1" ? "เขต " : "ตำบล "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  onChange={(e) => {
                    setIDAddressIdCardTambon(e.target.value);
                    setAddressIdCardTambon(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find(
                          (a) => a.id === parseInt(IDaddressIdCardAmphor)
                        )
                        .tambon.find((t) => t.id === parseInt(e.target.value))
                        .name_th
                    );
                    setAddressIdCardZipCode(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find(
                          (a) => a.id === parseInt(IDaddressIdCardAmphor)
                        )
                        .tambon.find((t) => t.id === parseInt(e.target.value))
                        .zip_code
                    );
                  }}
                  className={`${
                    !editMode
                      ? `${inputEditColor} cursor-default`
                      : `${bgColorMain} cursor-pointer`
                  } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  disabled={!editMode}
                  value={
                    dataProvince
                      .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      .amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )
                      .tambon.find(
                        (t) => t.id === parseInt(IDaddressIdCardTambon)
                      )?.id || "0"
                  }
                >
                  <option value="0">-</option>
                  {dataProvince
                    .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                    .amphure.find(
                      (a) => a.id === parseInt(IDaddressIdCardAmphor)
                    )
                    .tambon.map((d, index) => (
                      <option key={index} value={d.id}>
                        {d.name_th}
                      </option>
                    ))}
                </select>
                <Icon
                  className={`${
                    !editMode ? "hidden" : ""
                  } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
          ) : null}
          {IDaddressIdCardProvince &&
          IDaddressIdCardAmphor &&
          IDaddressIdCardTambon ? (
            <div className=" flex flex-col ">
              <label>
                รหัสไปรษณีย์{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className=" col w-fit mt-1">
                <p
                  className={`${inputEditColor}  focus:outline-none cursor-default w-36 ${bgColorMain}  border border-gray-400 py-2 px-4 rounded-lg`}
                >
                  {addressIdCardZipCode || getAddressIdCardZipCode || "-"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <SelectLabelForm
          label="ประเภทธุรกิจ"
          isRequire
          editMode={editMode}
          value={typeBusiness}
          setValue={setTypeBusiness}
          options={dataTypeBusiness.map((item) => {
            return {
              id: item.id,
              value: item.name,
            };
          })}
          tailwind={"w-56"}
        />
        <InputLabelForm
          label="จำนวนพนักงานทั้งหมด"
          isRequire
          value={quantityEmployee}
          setValue={setQuantityEmployee}
          editMode={editMode}
          placeholder={"ใส่เป็นตัวเลขเช่น 100"}
          tailwind={"w-30"}
          type={"number"}
        />
        <InputLabelForm
          label="จำนวนคนพิการที่ต้องการ"
          isRequire
          value={quantityDisabled}
          setValue={setQuantityDisabled}
          editMode={editMode}
          placeholder={"ใส่เป็นตัวเลขเช่น 100"}
          tailwind={"w-30"}
          type={"number"}
        />
        <div className="w-full flex flex-wrap gap-y-5 gap-x-10">
          <InputLabelForm
            label="ผู้ประสานงาน"
            isRequire
            value={coordinator || getCoordinator || ""}
            setValue={setCoordinator}
            editMode={editMode}
            placeholder={"ตัวอย่าง: คุณสมชาย มานะ"}
            tailwind={"w-96"}
          />

          <InputLabelForm
            label="เบอร์ติดต่อ"
            isRequire
            value={telCoordinator || getTetCoordinator || ""}
            setValue={setTelCoordinator}
            editMode={editMode}
            placeholder={'ระบุเฉพาะตัวเลข เช่น " 0923235223 "'}
            tailwind={"w-64"}
            styles={"tel"}
          />
          <InputLabelForm
            label="อีเมล"
            isRequire
            value={emailCompany}
            setValue={setEmailCompany}
            editMode={editMode}
            placeholder={"example@gmail.com"}
            tailwind={"w-64"}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <InputLabelForm
            label="ตำแหน่งงาน"
            isRequire
            value={positionWork}
            setValue={setPositionWork}
            editMode={editMode}
            placeholder={"ระบุตำแหน่งงาน"}
            tailwind={"w-60"}
          />
          <SelectLabelForm
            label="ประเภทงาน"
            isRequire
            editMode={editMode}
            value={workType || getWorkType || ""}
            setValue={setWorkType}
            options={dataWorkType.map((item) => {
              return {
                id: item,
                value: item,
              };
            })}
            tailwind={"w-96"}
          />
          <InputLabelForm
            label="รายละเอียดเกี่ยวกับงาน"
            isRequire
            value={workDetail || getWorkDetail || ""}
            setValue={setWorkDetail}
            editMode={editMode}
            placeholder={"ระบุรายละเอียด"}
            tailwind={"w-96"}
          />
          <InputLabelForm
            label="หน้าที่/ความรับผิดชอบ/คุณสมบัติ"
            isRequire
            value={dutyWork}
            setValue={setDutyWork}
            editMode={editMode}
            placeholder={"ดูแลเว็บไซต์"}
            tailwind={"w-96"}
          />
          <div>
            <div className="flex gap-x-2 ">
              <LabelForm label={"สถานที่ทำงาน"} isRequire editMode={editMode} />
              <div className={`${!editMode ? "hidden" : ""} flex gap-x-1`}>
                <input
                  type="checkbox"
                  className={`cursor-pointer w-3 h-full border`}
                  onChange={(e) => CheckAddressSame(e.target.checked)}
                />
                <p>(ตามที่ตั้งบริษัท)</p>
              </div>
            </div>
            <InputForm
              editMode={editMode}
              placeholder={"45/7 อาคาร B ชั้น 5 แขวงจอมพล เขตจตุจักร กรุงเทพ"}
              tailwind={"mt-1 w-96"}
              value={addressWork}
              setValue={setAddressWork}
            />
          </div>
          <div className="flex gap-x-10 gap-y-5 ">
            <div className="flex flex-col gap-1">
              <LabelForm isRequire label={"วันที่ทำงาน"} editMode={editMode} />
              <div className="flex items-center gap-x-3">
                <SelectForm
                  editMode={editMode}
                  options={dates.map((item) => {
                    return {
                      id: item,
                      value: item,
                    };
                  })}
                  tailwind={"w-40"}
                  value={dateStart || getDateStart || ""}
                  setValue={setDateStart}
                />

                <p>ถึง</p>
                <SelectForm
                  editMode={editMode}
                  options={dates.map((item) => {
                    return {
                      id: item,
                      value: item,
                    };
                  })}
                  tailwind={"w-40"}
                  value={dateEnd || getDateEnd || ""}
                  setValue={setDateEnd}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-x-10 gap-y-5 ">
            <div className="flex flex-col gap-1">
              <LabelForm isRequire label={"เวลาทำงาน"} editMode={editMode} />
              <div className="flex items-center gap-x-3">
                <div className="relative col w-fit ">
                  <input
                    type="time"
                    className={`${
                      !editMode ? "editModeTrue" : ""
                    } ${bgColorMain}  w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="เวลาเริ่ม"
                    onChange={(e) => setTimeStart(e.target.value)}
                    defaultValue={timeStart || getTimeStart || ""}
                  />
                </div>
                <p>ถึง</p>
                <div className="relative col w-fit">
                  <input
                    type="time"
                    className={`${
                      !editMode ? "editModeTrue" : ""
                    } ${bgColorMain}  w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="เวลาเลิก"
                    onChange={(e) => setTimeEnd(e.target.value)}
                    defaultValue={timeEnd || getTimeEnd || ""}
                  />
                </div>
              </div>
            </div>
          </div>
          <InputLabelForm
            label="ค่าตอบแทน"
            isRequire
            editMode={editMode}
            placeholder={"ex:  15,000/เดือน"}
            tailwind={"w-30"}
            value={budget}
            setValue={setBudget}
          />
          <InputLabelForm
            label="ช่วงเวลาที่ต้องการให้เริ่มงาน"
            isRequire
            editMode={editMode}
            placeholder={"ex: 1 มิถุนายน 2568"}
            tailwind={"w-56"}
            value={timeStartWork}
            setValue={setTimeStartWork}
          />
          <div className="w-full">
            <LabelForm label={"สวัสดิการ"} editMode={editMode} isRequire />
            {getWelfare?.length >= 0 &&
              fieldwalfare.map((skill, index) => (
                <div key={index} className="flex-col">
                  <div className=" flex gap-5 flex-wrap ">
                    <div className="flex gap-5 items-center">
                      <input
                        type="text"
                        className={`${
                          !editMode ? "editModeTrue" : ""
                        } ${bgColorMain}  mt-1 w-60 border border-gray-400 py-2 px-4 rounded-lg`}
                        readOnly={!editMode}
                        placeholder="ตัวอย่าง: ค่าเดินทาง, ค่าอาหารกลางวัน, ..."
                        defaultValue={getWelfare[index] || ""}
                        onBlur={(e) => handleGetArray(e.target.value, index)}
                      />
                      {index > 0 && editMode && (
                        <div className={``}>
                          <div
                            className={` cursor-pointer rounded-lg`}
                            onClick={() => handleRemoveField(index)}
                          >
                            <Icon
                              className={` text-red-500`}
                              path={mdiCloseCircle}
                              size={1}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {errorFieldWalfare && (
              <div className="mt-3 text-red-500">*{errorFieldWalfare}</div>
            )}
            {fieldwalfare.length < 10 && editMode && (
              <div className={`mt-2`}>
                <div
                  className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
                  onClick={handleAddField}
                >
                  <Icon
                    className={` text-white mx-3`}
                    path={mdiPlus}
                    size={1}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-7">
        {error && (
          <div className="w-full text-center">
            <p className="text-red-500">* {error}</p>
          </div>
        )}
        <ButtonGroup
          editMode={editMode}
          setEditMode={setEditMode}
          tailwind={"mt-5"}
          isCreate={!isEdit}
        />
      </div>
    </form>
  );
}

export default CompanyForm;
