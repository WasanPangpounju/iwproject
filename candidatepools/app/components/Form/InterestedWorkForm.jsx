"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiPlus, mdiCloseCircle, mdiArrowDownDropCircle } from "@mdi/js";
import Swal from "sweetalert2";
import dataWorkType from "@/assets/dataWorkType";
import useProvinceData from "@/utils/province";

//store
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

import ButtonGroup from "./ButtonGroup/ButtonGroup";
import { toast } from "react-toastify";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";

function InterestedWorkForm({ id, dataWorks, readOnly = false }) {
  const { bgColorMain } = useTheme();

  //store
  const { updateInterestedWorkById } = useInterestedWorkStore();

  //set Mode
  const [editMode, setEditMode] = useState(false);

  // เพิ่มข้อมูล
  const [workType, setWorkType] = useState([]);
  const [workDetail, setWorkDetail] = useState([]);
  const [workProvince1, setWorkProvince1] = useState([]);
  const [workProvince2, setWorkProvince2] = useState([]);
  const [workProvince3, setWorkProvince3] = useState([]);

  // จัดการการเปลี่ยนแปลงข้อมูลสำหรับประเภทงาน
  const handleWorkType = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWorkType((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
      }

      // อัปเดตค่าในตำแหน่งที่ระบุ
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  // จัดการการเปลี่ยนแปลงข้อมูลสำหรับรายละเอียดงาน
  const handleWorkDetail = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWorkDetail((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
      }

      // อัปเดตค่าในตำแหน่งที่ระบุ
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
  const handleWorkProvince1 = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWorkProvince1((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
      }

      // อัปเดตค่าในตำแหน่งที่ระบุ
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };
  // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
  const handleWorkProvince2 = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWorkProvince2((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
      }

      // อัปเดตค่าในตำแหน่งที่ระบุ
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };
  // จัดการการเปลี่ยนแปลงข้อมูลสำหรับจังหวัดงาน
  const handleWorkProvince3 = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setWorkProvince3((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เติมค่าในตำแหน่งที่ขาดหายไปด้วยสตริงว่าง
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // รักษาขนาดของอาร์เรย์
      }

      // อัปเดตค่าในตำแหน่งที่ระบุ
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  // กำหนดฟิลด์
  const [works, setWorks] = useState([{}]);
  const [error, setError] = useState("");

  const handleAddWork = () => {
    // ตรวจสอบให้แน่ใจว่าทุกฟิลด์ถูกกรอกก่อนที่จะเพิ่มข้อมูลใหม่
    if (
      !workType[works.length - 1] ||
      !workDetail[works.length - 1] ||
      !workProvince1[works.length - 1]
    ) {
      setError("กรุณากรอกข้อมูลให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    // จำกัดจำนวนงานไม่ให้เกิน 5 รายการ
    if (works.length >= 3) {
      setError("");
      return;
    }

    setError(""); // ลบข้อผิดพลาดก่อนหน้า
    setWorks([...works, {}]); // เพิ่มออบเจกต์ว่างใน works
  };

  const handleRemoveWork = (index) => {
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
        const newWorks = [...works];
        newWorks.splice(index, 1);
        setWorks(newWorks);

        const temp = index;

        // ลบข้อมูลที่เกี่ยวข้องจากอาร์เรย์สถานะ
        setWorkType((prev) => prev.filter((_, i) => i !== temp));
        setWorkDetail((prev) => prev.filter((_, i) => i !== temp));
        setWorkProvince1((prev) => prev.filter((_, i) => i !== temp));
        setWorkProvince2((prev) => prev.filter((_, i) => i !== temp));
        setWorkProvince3((prev) => prev.filter((_, i) => i !== temp));

        // ลบข้อมูลจาก get
        setGetWorkType((prev) => prev.filter((_, i) => i !== temp));
        setGetWorkDetail((prev) => prev.filter((_, i) => i !== temp));
        setGetWorkProvince1((prev) => prev.filter((_, i) => i !== temp));
        setGetWorkProvince2((prev) => prev.filter((_, i) => i !== temp));
        setGetWorkProvince3((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //handleSubmit
  //hadle array
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

  //function submit
  async function handleSubmit(e, fieldWorks) {
    e.preventDefault();

    const mergedWorkType = workType;
    const mergedWorkDetail = workDetail;
    const mergedWorkProvince1 = workProvince1;
    const mergedWorkProvince2 = workProvince2;
    const mergedWorkProvince3 = workProvince3;

    // ลดค่าตัวนับของแต่ละฟิลด์ลง 1
    fieldWorks -= 1;

    // ตรวจสอบข้อมูลโครงงาน / ผลงาน
    const hasAnyWorkField =
      mergedWorkType[fieldWorks] ||
      mergedWorkDetail[fieldWorks] ||
      mergedWorkProvince1[fieldWorks];

    const isWorkFieldComplete =
      mergedWorkType[fieldWorks] &&
      mergedWorkDetail[fieldWorks] &&
      mergedWorkProvince1[fieldWorks];

    if (hasAnyWorkField && !isWorkFieldComplete) {
      setError("กรุณาระบุข้อมูลให้ครบทุกช่อง");

      return;
    }

    for (let i = 0; i <= mergedWorkProvince1?.length; i++) {
      if (mergedWorkProvince1[i] === "0") {
        setError("กรุณาระบุข้อมูลให้ถูกต้อง");

        return;
      }
      if (
        mergedWorkProvince3[i] &&
        mergedWorkProvince3[i] !== "0" &&
        (mergedWorkProvince2[i] === "0" || !mergedWorkProvince2[i])
      ) {
        setError("กรุณาระบุข้อมูลให้ถูกต้อง");

        return;
      }
    }

    // หากไม่มีข้อมูลเลยในทุกส่วน
    if (!hasAnyWorkField) {
      setError("ไม่มีข้อมูลที่บันทึก");

      return;
    }

    // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
    setError("");

    // จัดเตรียมข้อมูลที่จะส่งไปยัง API
    const data = {
      uuid: id,
      interestedWork: mergedWorkDetail.map((detail, index) => ({
        type: mergedWorkType[index],
        detail,
        province1: mergedWorkProvince1[index],
        province2: mergedWorkProvince2[index],
        province3: mergedWorkProvince3[index],
      })),
    };

    try {
      // ส่งข้อมูลไปยัง API ด้วย fetch
      const response = await updateInterestedWorkById(data);

      if (response.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
      setEditMode(false);
    }
  }

  //set default value
  const [getWorkType, setGetWorkType] = useState([]);
  const [getWorkDetail, setGetWorkDetail] = useState([]);
  const [getWorkProvince1, setGetWorkProvince1] = useState([]);
  const [getWorkProvince2, setGetWorkProvince2] = useState([]);
  const [getWorkProvince3, setGetWorkProvince3] = useState([]);

  //set default value
  useEffect(() => {
    if (!dataWorks) return;

    // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setWorkType(dataWorks.interestedWork?.map((work) => work.type) || []);
    setWorkDetail(dataWorks.interestedWork?.map((work) => work.detail) || []);
    setWorkProvince1(
      dataWorks.interestedWork?.map((work) => work.province1) || []
    );
    setWorkProvince2(
      dataWorks.interestedWork?.map((work) => work.province2) || []
    );
    setWorkProvince3(
      dataWorks.interestedWork?.map((work) => work.province3) || []
    );

    // set ฟิลด์เริ่มต้น
    if (
      Array.isArray(dataWorks.interestedWork) &&
      dataWorks.interestedWork.length > 0
    ) {
      setWorks(dataWorks.interestedWork);
    }
  }, [dataWorks]);

  //set province
  const dataProvince = useProvinceData();

  const fieldProgress = [
    workType[0],
    workDetail[0],
    workProvince1[0],
    workProvince2[0],
    workProvince3[0],
  ];

  return (
    <form onSubmit={(e) => handleSubmit(e, works.length)} className={``}>
      <p className="mb-2">ลักษณะงานที่สนใจ</p>
      <hr />
      {works.map((work, index) => (
        <div key={index}>
          {index > 0 && editMode && (
            <div className={` flex col flex-col justify-end w-full mt-5`}>
              <div
                className={` cursor-pointer  rounded-lg w-fit`}
                onClick={() => handleRemoveWork(index)}
              >
                <Icon
                  className={` text-red-500`}
                  path={mdiCloseCircle}
                  size={1}
                />
              </div>
            </div>
          )}
          {index > 0 && !editMode && <hr className="mt-5" />}
          <div className="mt-5 flex gap-5 flex-wrap">
            <div className="flex flex-col gap-1">
              <label>
                ประเภทงาน{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => handleWorkType(e.target.value, index)}
                  value={workType[index] || ""}
                  disabled={!editMode}
                >
                  <option value="0">-</option>
                  {dataWorkType.map((work, index) => (
                    <option key={index} value={work}>
                      {work}
                    </option>
                  ))}
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label>
                รายละเอียด{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <input
                type="text"
                className={`${
                  !editMode ? "editModeTrue" : ""
                } ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                readOnly={!editMode}
                placeholder="รายละเอียดเพิ่มเติม"
                defaultValue={workDetail[index] || ""}
                onBlur={(e) => handleWorkDetail(e.target.value, index)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>
                จังหวัดที่ 1{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => handleWorkProvince1(e.target.value, index)}
                  value={workProvince1[index] || ""}
                  disabled={!editMode}
                >
                  <option value="">-</option>
                  {dataProvince.map((province, index) => (
                    <option key={index} value={province?.name_th}>
                      {province?.name_th}
                    </option>
                  ))}
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>จังหวัดที่ 2 </label>
              <div className="relative col w-fit mt-1">
                <select
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => handleWorkProvince2(e.target.value, index)}
                  value={workProvince2[index] || getWorkProvince2[index] || ""}
                  disabled={!editMode}
                >
                  <option value="">-</option>
                  {dataProvince.map((province, index) => (
                    <option key={index} value={province?.name_th}>
                      {province?.name_th}
                    </option>
                  ))}
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>จังหวัดที่ 3 </label>
              <div className="relative col w-fit mt-1">
                <select
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => handleWorkProvince3(e.target.value, index)}
                  value={workProvince3[index] || ""}
                  disabled={!editMode}
                >
                  <option value="">-</option>
                  {dataProvince.map((province, index) => (
                    <option key={index} value={province?.name_th}>
                      {province?.name_th}
                    </option>
                  ))}
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      {works.length < 3 && editMode && (
        <div className={` flex col flex-col justify-end w-full mt-5`}>
          <div
            className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
            onClick={handleAddWork}
          >
            <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
          </div>
        </div>
      )}
      {editMode && (
        <div className="mt-10">
          <ProgressBarForm fields={fieldProgress} />
        </div>
      )}
      <div>
        {error && (
          <div className="w-full text-center mt-5">
            <p className="text-red-500">* {error}</p>
          </div>
        )}
        {!readOnly && (
          <ButtonGroup
            editMode={editMode}
            setEditMode={setEditMode}
            tailwind="mt-5"
          />
        )}
      </div>
    </form>
  );
}

export default InterestedWorkForm;
