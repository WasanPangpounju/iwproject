"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiPlus, mdiCloseCircle } from "@mdi/js";
import Swal from "sweetalert2";
import { useProvince } from "@/hooks/useProvince";
import dataWorkType from "@/assets/dataWorkType";
import dates from "@/app/data/date.json";

import { useRouter } from "next/navigation";
import ButtonGroup from "@/app/components/Form/ButtonGroup/ButtonGroup";

import { useCompanyStore } from "@/stores/useCompanyStore";
import { toast } from "react-toastify";
import SelectLabelForm from "../SelectLabelForm";
import InputLabelForm from "../InputLabelForm";
import SelectForm from "../SelectForm";
import LabelForm from "../LabelForm";
import InputForm from "../InputForm";

function CompanyForm2({ id, dataCompany, isEdit = false, path }) {
  //Theme
  const { bgColor, bgColorMain, bgColorMain2 } = useTheme();

  //store
  const { fetchCompanies, createCompany, updateCompany } = useCompanyStore();
  const router = useRouter();

  //address data
  const [editMode, setEditMode] = useState(!isEdit);
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

  const { dataProvince } = useProvince();

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
    if (!welfare[fieldwalfare.length - 1]) {
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

    const tempWorkType = workType || getWorkType;
    const tempWorkDetail = workDetail || getWorkDetail;
    const tempDateStart = dateStart || getDateStart;
    const tempDateEnd = dateEnd || getDateEnd;
    const tempTimeStart = timeStart || getTimeStart;
    const tempTimeEnd = timeEnd || getTimeEnd;
    const mergedWelfare = welfare;

    if (
      !tempWorkType ||
      !tempWorkDetail ||
      !tempDateStart ||
      !tempDateEnd ||
      !tempTimeStart ||
      !tempTimeEnd ||
      !mergedWelfare[mergedWelfare?.length - 1] ||
      !positionWork ||
      !dutyWork ||
      !addressWork ||
      !budget ||
      !timeStartWork
    ) {
      setError("กรุณกรอกข้อมูลให้ครบทุกช่อง");

      return;
    }

    setError("");

    const body = {
      work_type: tempWorkType,
      work_detail: tempWorkDetail,
      date_start: tempDateStart,
      date_end: tempDateEnd,
      time_start: tempTimeStart,
      time_end: tempTimeEnd,
      welfare: mergedWelfare,
      positionWork: positionWork,
      dutyWork: dutyWork,
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

    setWorkType(dataCompany?.work_type);
    setWorkDetail(dataCompany?.work_detail);
    setDateStart(dataCompany?.date_start);
    setDateEnd(dataCompany?.date_end);
    setTimeStart(dataCompany?.time_start);
    setTimeEnd(dataCompany?.time_end);
    setWelfare(dataCompany?.welfare);
    setPositionWork(dataCompany?.positionWork);
    setDutyWork(dataCompany?.dutyWork);
    setAddressWork(dataCompany?.addressWork);
    setBudget(dataCompany?.budget);
    setTimeStartWork(dataCompany?.timeStartWork);

    // set ฟิลด์เริ่มต้น
    if (
      Array.isArray(dataCompany?.welfare) &&
      dataCompany?.welfare.length > 0
    ) {
      setGetFieldwalfare(dataCompany?.welfare);
    }
  }, [dataCompany, dataProvince]);

  const CheckAddressSame = (checked) => {
    if (!dataCompany?.address || !dataCompany?.zipcode) {
      setError("ไม่พบข้อมูลที่ตั้งกรุณาระบุข้อมูลที่ตั้งก่อน");
      return;
    }
    if (checked === true) {
      setAddressWork(
        `${dataCompany?.address} ${dataCompany?.province} ${dataCompany?.amphor} ${dataCompany?.tambon} ${dataCompany?.zipcode}`
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
                onChange={(e) => CheckAddressSame(e.target.checked)}
                type="checkbox"
                className={`cursor-pointer w-3 h-full border`}
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
          {welfare?.length >= 0 &&
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
                      defaultValue={welfare[index] || ""}
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
                <Icon className={` text-white mx-3`} path={mdiPlus} size={1} />
              </div>
            </div>
          )}
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

export default CompanyForm2;
