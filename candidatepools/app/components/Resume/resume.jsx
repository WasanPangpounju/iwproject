"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiAccountEdit,
  mdiFilePdfBox,
  mdiCloseCircle,
  mdiArrowLeftCircle,
  mdiContentSave,
} from "@mdi/js";
import Swal from "sweetalert2";
import PDFFile from "./PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";

//stores
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import Profile from "../Profile/Profile";

function Resume({
  type,
  id,
  setStatusResume,
  dataSkills,
  dataEducations,
  dataUser,
  dataHistoryWork,
}) {
  const { bgColorNavbar, bgColorWhite, inputGrayColor, inputTextColor } =
    useTheme();

  //stores
  const { updateUserById } = useUserStore();
  const { updateEducationById } = useEducationStore();
  const { updateHistoryWorkById } = useHistoryWorkStore();
  const { updateSkillById } = useSkillStore();

  const [editMode, setEditMode] = useState(false);

  //set age
  const today = new Date();
  const yearToday = today.getFullYear();

  //setArray
  const handleArray = (e, index, setTemp) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setTemp((prevTemp) => {
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

  //new data
  //dataUser
  const [newTel, setNewTel] = useState("");
  const [newFirstNameEng, setNewFirstName] = useState("");
  const [newLastNameEng, setNewLastName] = useState("");

  //skill
  const [newSkill, setNewSkill] = useState([]);

  //education
  const [newUniversity, setNewUniversity] = useState([]);
  const [newFaculty, setNewFaculty] = useState([]);
  const [newBranch, setNewBranch] = useState([]);
  const [newLevel, setNewLevel] = useState([]);
  const [newGrade, setNewGrade] = useState([]);
  const [newYearGraduation, setNewYearGraduation] = useState([]);

  //historyWork
  const [newInternshipDateStart, setNewInternshipDateStart] = useState([]);
  const [newInternshipDateEnd, setNewInternshipDateEnd] = useState([]);
  const [newInternshipPlace, setNewInternshipPlace] = useState([]);
  const [newInternshipPosition, setNewInternshipPosition] = useState([]);

  const [newWorkDateStart, setNewWorkDateStart] = useState([]);
  const [newWorkDateEnd, setNewWorkDateEnd] = useState([]);
  const [newWorkPlace, setNewWorkPlace] = useState([]);
  const [newWorkPosition, setNewWorkPosition] = useState([]);

  //handle object
  function mergeArrayObject(nonGetArray, getArray, key) {
    if (!nonGetArray || !Array.isArray(nonGetArray)) {
      return; // ถ้า nonGetArray เป็น undefined, null หรือไม่ใช่อาร์เรย์
    }
    // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
    if (nonGetArray?.length === 0) {
      return getArray;
    }

    // ตรวจสอบความยาวของทั้งสองอาร์เรย์
    return nonGetArray.map((item, index) => {
      // ถ้า newSkill (getArray) มีค่าใหม่ ให้แทนที่ค่า name
      if (getArray[index]) {
        return {
          ...item,
          [key]: getArray[index], // แทนที่ค่า key (เช่น name) ด้วยค่าจาก getArray
        };
      }
      // ถ้าไม่มีค่าใหม่จาก getArray ให้ใช้ค่าจาก nonGetArray (ค่าเก่า)
      return item;
    });
  }
  //handle array
  function mergeArray(nonGetArray, getArray) {
    if (!nonGetArray || !Array.isArray(nonGetArray)) {
      return; // ถ้า nonGetArray เป็น undefined, null หรือไม่ใช่อาร์เรย์
    }
    // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
    if (nonGetArray?.length === 0) {
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

    const tempTel = newTel || dataUser?.tel;
    const tempFirstNameEng = newFirstNameEng || dataUser?.firstNameEng;
    const tempLastNameEng = newLastNameEng || dataUser?.lastNameEng;
    const bodyDataUser = {
      tel: tempTel,
      firstNameEng: tempFirstNameEng,
      lastNameEng: tempLastNameEng,
    };

    //skill
    let tempSkill = mergeArrayObject(dataSkills?.skills, newSkill, "name");
    const bodySkill = {
      uuid: dataSkills?.uuid,
      skills: tempSkill,
      trains: dataSkills?.trains,
    };
    // education
    const tempUniversity = mergeArray(
      newUniversity,
      dataEducations?.university
    );
    const tempFaculty = mergeArray(newFaculty, dataEducations?.faculty);
    const tempBranch = mergeArray(newBranch, dataEducations?.branch);
    const tempGrade = mergeArray(newGrade, dataEducations?.grade);
    const tempYearGraduation = mergeArray(
      newYearGraduation,
      dataEducations?.yearGraduation
    );
    const tempLevel = mergeArray(newLevel, dataEducations?.level);
    const bodyEducation = {
      uuid: dataEducations.uuid,
      typePerson: dataEducations.typePerson,
      university: tempUniversity,
      campus: dataEducations.campus,
      faculty: tempFaculty,
      branch: tempBranch,
      level: tempLevel,
      educationLevel: dataEducations.educationLevel,
      grade: tempGrade,
      yearGraduation: tempYearGraduation,
      file: dataEducations.file,
      nameFile: dataEducations.nameFile,
      sizeFile: dataEducations.sizeFile,
      typeFile: dataEducations.typeFile,
    };
    //internships
    let tempInternship = mergeArrayObject(
      dataHistoryWork?.internships,
      newInternshipDateStart,
      "dateStart"
    );
    tempInternship = mergeArrayObject(
      tempInternship,
      newInternshipDateEnd,
      "dateEnd"
    );
    tempInternship = mergeArrayObject(
      tempInternship,
      newInternshipPlace,
      "place"
    );
    tempInternship = mergeArrayObject(
      tempInternship,
      newInternshipPosition,
      "position"
    );

    //work
    let tempWork = mergeArrayObject(
      dataHistoryWork?.workExperience,
      newWorkDateStart,
      "dateStart"
    );
    tempWork = mergeArrayObject(tempWork, newWorkDateEnd, "dateEnd");
    tempWork = mergeArrayObject(tempWork, newWorkPlace, "place");
    tempWork = mergeArrayObject(tempWork, newWorkPosition, "position");

    const bodyHistoryWork = {
      uuid: dataHistoryWork?.uuid,
      projects: dataHistoryWork?.projects,
      internships: tempInternship,
      workExperience: tempWork,
    };

    let errorStatus = false;

    try {
      const resDataUser = await updateUserById(id, bodyDataUser);
      if (!resDataUser.ok) {
        errorStatus = true;
      }

      if (dataSkills && dataSkills?.skills?.length > 0) {
        console.log("skill");
        const resSkill = await updateSkillById(bodySkill);
        if (!resSkill.ok) {
          errorStatus = true;
        }
      }

      if (dataEducations && dataEducations?.grade?.length > 0) {
        console.log("education");
        const resEducation = await updateEducationById(bodyEducation);
        if (!resEducation) {
          errorStatus = true;
        }
      }

      if (
        dataHistoryWork &&
        (dataHistoryWork?.internships?.length > 0 ||
          dataHistoryWork?.workExperience?.length > 0)
      ) {
        console.log("work");
        const resHistoryWork = await updateHistoryWorkById(bodyHistoryWork);
        if (!resHistoryWork.ok) {
          errorStatus = true;
        }
      }

      if (errorStatus) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          icon: "error",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#f27474",
        });
        return;
      }

      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0d96f8",
      }).then(() => {
        setEditMode(false);
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen ">
      <div
        className="cursor-pointer flex gap-2 items-center "
        onClick={() => setStatusResume(0)}
      >
        <Icon className="" path={mdiArrowLeftCircle} size={1} />
        <p>รูปแบบที่ {type}</p>
      </div>
      {dataUser ? (
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="text-xs">
            {type === 1 ? (
              <div
                className={` mt-10 flex overflow-hidden min-h-[50rem] w-[42rem] border`}
              >
                <div className=" text-white max-w-60">
                  <div className="bg-[#fea661] p-5 flex justify-center">
                    <Profile imageSrc={dataUser.profile} />
                    {/* <Image
                      priority
                      alt="icon"
                      className="w-32 h-32"
                      src={dataUser.profile || "/image/main/user.png"}
                      height={1000}
                      width={1000}
                    /> */}
                  </div>
                  <div className="bg-[#f48e07] h-full">
                    <div className="p-5">
                      <p className="text-lg font-bold">ข้อมูลส่วนตัว</p>
                      <div className=" flex flex-col mt-2 gap-y-2">
                        <div className="flex flex-wrap gap-2">
                          <p>
                            วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                            {dataUser.monthBirthday || "-"}{" "}
                            {dataUser.yearBirthday || "-"}
                          </p>
                          <p>({yearToday - dataUser.yearBirthday || "-"}ปี)</p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <p>ความพิการ: </p>
                          {dataUser?.typeDisabled?.map((d, index) => (
                            <p key={index} className="">
                              {d || " - "}
                            </p>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <p>ที่อยู่: {dataUser.address || ""}</p>
                          <p>
                            {dataUser.addressProvince === "กรุงเทพมหานคร"
                              ? "เขต"
                              : "ตำบล"}
                            {dataUser.addressTambon || " - "}
                          </p>
                          <p>
                            {dataUser.addressProvince === "กรุงเทพมหานคร"
                              ? "แขวง"
                              : "อำเภอ"}
                            {dataUser.addressAmphor || " - "}
                          </p>
                          <p>จังหวัด{dataUser.addressProvince || " - "}</p>
                          <p>รหัสไปรษณีย์ {dataUser.addressZipCode || ""}</p>
                        </div>
                        <div className="flex gap-1 whitespace-nowrap ">
                          <label>เบอร์โทร: </label>
                          {editMode ? (
                            <input
                              type="text"
                              className="inputResume"
                              inputMode="numeric"
                              pattern="\d{10}"
                              maxLength={10}
                              onChange={(e) => setNewTel(e.target.value)}
                              defaultValue={dataUser.tel || " - "}
                            />
                          ) : (
                            <p>{dataUser.tel || "-"}</p>
                          )}
                        </div>

                        <p className="whitespace-nowrap ">
                          อีเมล์: {dataUser.email || " - "}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-lg font-bold">ทักษะ</p>
                      <div className="flex flex-col mt-2 gap-y-2">
                        {dataSkills?.skills?.length > 0 ? (
                          dataSkills?.skills?.map((skill, index) => (
                            <div key={index}>
                              {editMode ? (
                                <input
                                  type="text"
                                  className="inputResume"
                                  defaultValue={skill.name || ""}
                                  onBlur={(e) =>
                                    handleArray(
                                      e.target.value,
                                      index,
                                      setNewSkill
                                    )
                                  }
                                />
                              ) : (
                                <p>{skill.name || " - "}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-400 bg-white p-2">
                            * ไม่มีข้อมูลทักษะ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" p-5 px-10">
                  <div>
                    <div className="flex gap-3 whitespace-nowrap">
                      <p className="text-2xl font-bold ">
                        {dataUser.firstName}
                      </p>
                      <p className="text-2xl font-bold"> {dataUser.lastName}</p>
                    </div>
                    <div className="flex gap-3 mt-1">
                      {(!editMode &&
                        dataUser?.firstNameEng &&
                        dataUser?.lastNameEng) ||
                      editMode ? (
                        editMode ? (
                          <>
                            <div>
                              <label>Name</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) =>
                                  setNewFirstName(e.target.value)
                                }
                                defaultValue={dataUser?.firstNameEng || ""}
                              />
                            </div>
                            <div>
                              <label>LastName</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) => setNewLastName(e.target.value)}
                                defaultValue={dataUser?.lastNameEng || ""}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-bold capitalize whitespace-nowrap">
                              {dataUser.firstNameEng}
                            </p>
                            <p className="text-xl font-bold capitalize whitespace-nowrap">
                              {" "}
                              {dataUser.lastNameEng}
                            </p>
                          </>
                        )
                      ) : (
                        <p className="text-red-400">
                          * เพิ่มชื่อภาษาอังกฤษของคุณ
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-lg font-bold">การศึกษา</p>
                    <div className="mt-2 flex flex-wrap gap-5">
                      {dataEducations?.grade?.length > 0 ? (
                        dataEducations?.university?.map((education, index) => (
                          <div key={index}>
                            {editMode ? (
                              <div className="flex flex-wrap gap-2">
                                <p>
                                  {dataEducations.educationLevel[index] || "-"}
                                </p>
                                <div>
                                  <label>มหาวิทยาลัย: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.university[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewUniversity
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>คณะ: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.faculty[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewFaculty
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>สาขา: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.branch[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewBranch
                                      )
                                    }
                                  />
                                </div>
                                {dataEducations?.typePerson ===
                                  "นักศึกษาพิการ" && index === 0 ? (
                                  <div>
                                    <label>กำลังศึกษาชั้นปีที่: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={dataEducations.level || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewLevel
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <label>ปีที่จบการศึกษา: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={
                                        dataEducations.yearGraduation[index] ||
                                        ""
                                      }
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewYearGraduation
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <div>
                                  <label>เกรดเฉลี่ย: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.grade[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewGrade
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <p>
                                  {dataEducations.educationLevel[index] || "-"}
                                </p>
                                <p>
                                  {dataEducations.university[index] || " - "}
                                </p>
                                <p>
                                  คณะ{dataEducations.faculty[index] || " - "}
                                </p>
                                <p>
                                  สาขา{dataEducations.branch[index] || " - "}
                                </p>
                                {dataEducations?.typePerson ===
                                  "นักศึกษาพิการ" && index === 0 ? (
                                  <p>
                                    กำลังศึกษา: ชั้นปีที่{" "}
                                    {dataEducations.level || " - "}
                                  </p>
                                ) : (
                                  <p>
                                    ปีที่จบการศึกษา:{" "}
                                    {dataEducations.yearGraduation[index] ||
                                      " - "}
                                  </p>
                                )}
                                <p>
                                  เกรดเฉลี่ย:{" "}
                                  {dataEducations.grade[index] || " - "}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400">* ไม่มีข้อมูลการศึกษา</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-lg font-bold">ประสบการณ์ฝึกงาน</p>
                    <div className="mt-2 flex flex-wrap gap-5">
                      {dataHistoryWork?.internships?.length > 0 ? (
                        dataHistoryWork?.internships?.map((e, index) => (
                          <div key={index}>
                            {editMode ? (
                              <div className="flex flex-wrap gap-2">
                                <div className="flex">
                                  <input
                                    type="text"
                                    className="inputResume w-28"
                                    defaultValue={e.dateStart || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewInternshipDateStart
                                      )
                                    }
                                  />
                                  <p>-</p>
                                  <input
                                    type="text"
                                    className="inputResume w-28"
                                    defaultValue={e.dateEnd || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewInternshipDateEnd
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>สถานที่ฝึกงาน: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.place || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewInternshipPlace
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>ตำแหน่ง: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.position || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewInternshipPosition
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <div className="w-full">
                                  <p>
                                    {e.dateStart} - {e.dateEnd}
                                  </p>
                                </div>
                                <p>สถานที่ฝึกงาน: {e.place}</p>
                                <p>ตำแหน่ง: {e.position}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400">* ไม่มีข้อมูลการฝึกงาน</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-lg font-bold">ประสบการณ์ทำงาน</p>
                    <div className="mt-2 flex flex-wrap gap-5">
                      {dataHistoryWork?.workExperience?.length > 0 ? (
                        dataHistoryWork?.workExperience?.map((e, index) => (
                          <div key={index}>
                            {editMode ? (
                              <div className="flex flex-wrap gap-2">
                                <div className="flex">
                                  <input
                                    type="text"
                                    className="inputResume w-28"
                                    defaultValue={e.dateStart || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkDateStart
                                      )
                                    }
                                  />
                                  <p>-</p>
                                  <input
                                    type="text"
                                    className="inputResume w-28"
                                    defaultValue={e.dateEnd || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkDateEnd
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>สถานที่ฝึกงาน: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.place || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkPlace
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>ตำแหน่ง: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.position || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkPosition
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <div className="w-full">
                                  <p>
                                    {e.dateStart} - {e.dateEnd}
                                  </p>
                                </div>
                                <p>สถานที่ฝึกงาน: {e.place}</p>
                                <p>ตำแหน่ง: {e.position}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400">* ไม่มีข้อมูลการทำงาน</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : type === 2 ? (
              <div
                className={` mt-10  overflow-hidden min-h-[50rem] w-[42rem] border`}
              >
                <div className=" text-white w-full flex bg-[#f48e07] ">
                  <div className="bg-[#fea661] p-5 flex justify-center w-fit ">
                    <Profile imageSrc={dataUser.profile} />
                    {/* <Image
                      priority
                      alt="icon"
                      className="w-32 h-32 rounded-full"
                      src={dataUser.profile || "/image/main/user.png"}
                      height={1000}
                      width={1000}
                    /> */}
                  </div>
                  <div className="py-5 px-10 flex flex-col justify-center  ">
                    <div className=" flex gap-3 whitespace-nowrap">
                      <p className="text-3xl font-bold ">
                        {dataUser.firstName}
                      </p>
                      <p className="text-3xl font-bold"> {dataUser.lastName}</p>
                    </div>
                    <div className=" flex gap-3">
                      {(!editMode &&
                        dataUser?.firstNameEng &&
                        dataUser?.lastNameEng) ||
                      editMode ? (
                        editMode ? (
                          <>
                            <div>
                              <label>Name</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) =>
                                  setNewFirstName(e.target.value)
                                }
                                defaultValue={dataUser?.firstNameEng || ""}
                              />
                            </div>
                            <div>
                              <label>LastName</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) => setNewLastName(e.target.value)}
                                defaultValue={dataUser?.lastNameEng || ""}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-bold capitalize whitespace-nowrap">
                              {dataUser?.firstNameEng || ""}
                            </p>
                            <p className="text-xl font-bold capitalize whitespace-nowrap">
                              {" "}
                              {dataUser?.lastNameEng || ""}
                            </p>
                          </>
                        )
                      ) : (
                        <div className="bg-white p-1">
                          <p className="text-red-400">
                            * เพิ่มชื่อภาษาอังกฤษของคุณ
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex">
                  <div className="max-w-44 py-5 flex flex-col gap-5">
                    <div className="px-5 ">
                      <p className="text-lg font-bold">ข้อมูลส่วนตัว</p>
                      <div className="flex flex-col mt-2 gap-y-2">
                        <div className="flex flex-wrap gap-2">
                          <p>
                            วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                            {dataUser.monthBirthday || "-"}{" "}
                            {dataUser.yearBirthday || "-"}
                          </p>
                          <p>({yearToday - dataUser.yearBirthday || "-"}ปี)</p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <p>ความพิการ: </p>
                          {dataUser?.typeDisabled?.map((d, index) => (
                            <p key={index} className="">
                              {d || " - "}
                            </p>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <p>ที่อยู่: {dataUser.address || ""}</p>
                          <p>
                            {dataUser.addressProvince === "กรุงเทพมหานคร"
                              ? "เขต"
                              : "ตำบล"}
                            {dataUser.addressTambon || " - "}
                          </p>
                          <p>
                            {" "}
                            {dataUser.addressProvince === "กรุงเทพมหานคร"
                              ? "แขวง"
                              : "อำเภอ"}
                            {dataUser.addressAmphor || " - "}
                          </p>
                          <p>จังหวัด{dataUser.addressProvince || " - "}</p>
                          <p>รหัสไปรษณีย์ {dataUser.addressZipCode || ""}</p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <label>เบอร์โทร: </label>
                          {editMode ? (
                            <input
                              type="text"
                              className="inputResume"
                              inputMode="numeric"
                              pattern="\d{10}"
                              maxLength={10}
                              onChange={(e) => setNewTel(e.target.value)}
                              defaultValue={dataUser.tel || " - "}
                            />
                          ) : (
                            <p>{dataUser.tel || "-"}</p>
                          )}
                        </div>
                        <p className=" ">อีเมล์: {dataUser.email || " - "}</p>
                      </div>
                    </div>
                    <div className="px-5">
                      <p className="text-lg font-bold">การศึกษา</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {dataEducations?.grade?.length > 0 ? (
                          dataEducations?.university?.map(
                            (education, index) => (
                              <div key={index}>
                                {editMode ? (
                                  <div className="flex flex-wrap gap-2">
                                    <p>
                                      {dataEducations.educationLevel[index] ||
                                        "-"}
                                    </p>
                                    <div>
                                      <label>มหาวิทยาลัย: </label>
                                      <input
                                        type="text"
                                        className="inputResume"
                                        defaultValue={
                                          dataEducations.university[index] || ""
                                        }
                                        onBlur={(e) =>
                                          handleArray(
                                            e.target.value,
                                            index,
                                            setNewUniversity
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label>คณะ: </label>
                                      <input
                                        type="text"
                                        className="inputResume"
                                        defaultValue={
                                          dataEducations.faculty[index] || ""
                                        }
                                        onBlur={(e) =>
                                          handleArray(
                                            e.target.value,
                                            index,
                                            setNewFaculty
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label>สาขา: </label>
                                      <input
                                        type="text"
                                        className="inputResume"
                                        defaultValue={
                                          dataEducations.branch[index] || ""
                                        }
                                        onBlur={(e) =>
                                          handleArray(
                                            e.target.value,
                                            index,
                                            setNewBranch
                                          )
                                        }
                                      />
                                    </div>
                                    {dataEducations?.typePerson ===
                                      "นักศึกษาพิการ" && index === 0 ? (
                                      <div>
                                        <label>กำลังศึกษาชั้นปีที่: </label>
                                        <input
                                          type="text"
                                          className="inputResume"
                                          defaultValue={
                                            dataEducations.level || ""
                                          }
                                          onBlur={(e) =>
                                            handleArray(
                                              e.target.value,
                                              index,
                                              setNewLevel
                                            )
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <label>ปีที่จบการศึกษา: </label>
                                        <input
                                          type="text"
                                          className="inputResume"
                                          defaultValue={
                                            dataEducations.yearGraduation[
                                              index
                                            ] || ""
                                          }
                                          onBlur={(e) =>
                                            handleArray(
                                              e.target.value,
                                              index,
                                              setNewYearGraduation
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <label>เกรดเฉลี่ย: </label>
                                      <input
                                        type="text"
                                        className="inputResume"
                                        defaultValue={
                                          dataEducations.grade[index] || ""
                                        }
                                        onBlur={(e) =>
                                          handleArray(
                                            e.target.value,
                                            index,
                                            setNewGrade
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    <p>
                                      {dataEducations.educationLevel[index] ||
                                        "-"}
                                    </p>
                                    <p>
                                      {dataEducations.university[index] ||
                                        " - "}
                                    </p>
                                    <p>
                                      คณะ{" "}
                                      {dataEducations.faculty[index] || " - "}
                                    </p>
                                    <p>
                                      สาขา{" "}
                                      {dataEducations.branch[index] || " - "}
                                    </p>
                                    {dataEducations?.typePerson ===
                                      "นักศึกษาพิการ" && index === 0 ? (
                                      <p>
                                        กำลังศึกษา: ชั้นปีที่{" "}
                                        {dataEducations.level || " - "}
                                      </p>
                                    ) : (
                                      <p>
                                        ปีที่จบการศึกษา:{" "}
                                        {dataEducations.yearGraduation[index] ||
                                          " - "}
                                      </p>
                                    )}
                                    <p>
                                      เกรดเฉลี่ย:{" "}
                                      {dataEducations.grade[index] || " - "}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-red-400">* ไม่มีข้อมูลการศึกษา</p>
                        )}
                      </div>
                    </div>
                    <div className="px-5">
                      <p className="text-lg font-bold">ทักษะ</p>
                      <div className="flex flex-col mt-2 gap-y-2">
                        {dataSkills?.skills?.length > 0 ? (
                          dataSkills?.skills?.map((skill, index) => (
                            <div key={index}>
                              {editMode ? (
                                <input
                                  type="text"
                                  className="inputResume"
                                  defaultValue={skill.name || ""}
                                  onBlur={(e) =>
                                    handleArray(
                                      e.target.value,
                                      index,
                                      setNewSkill
                                    )
                                  }
                                />
                              ) : (
                                <p>{skill.name || " - "}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-400 bg-white p-2">
                            * ไม่มีข้อมูลทักษะ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-5 px-10 flex flex-col gap-10">
                    <div className="">
                      <p className="text-lg font-bold">ประสบการณ์ฝึกงาน</p>
                      <div className="mt-2 flex flex-wrap gap-5">
                        {dataHistoryWork?.internships?.length > 0 ? (
                          dataHistoryWork?.internships?.map((e, index) => (
                            <div key={index}>
                              {editMode ? (
                                <div className="flex flex-wrap gap-2">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateStart || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipDateStart
                                        )
                                      }
                                    />
                                    <p>-</p>
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateEnd || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipDateEnd
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>สถานที่ฝึกงาน: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.place || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipPlace
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>ตำแหน่ง: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.position || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipPosition
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <div className="w-full">
                                    <p>
                                      {e.dateStart} - {e.dateEnd}
                                    </p>
                                  </div>
                                  <p>สถานที่ฝึกงาน: {e.place}</p>
                                  <p>ตำแหน่ง: {e.position}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-400">* ไม่มีข้อมูลการฝึกงาน</p>
                        )}
                      </div>
                    </div>

                    <div className="">
                      <p className="text-lg font-bold">ประสบการณ์ทำงาน</p>
                      <div className="mt-2 flex flex-wrap gap-5">
                        {dataHistoryWork?.workExperience?.length > 0 ? (
                          dataHistoryWork?.workExperience?.map((e, index) => (
                            <div key={index}>
                              {editMode ? (
                                <div className="flex flex-wrap gap-2">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateStart || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewWorkDateStart
                                        )
                                      }
                                    />
                                    <p>-</p>
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateEnd || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewWorkDateEnd
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>สถานที่ฝึกงาน: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.place || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewWorkPlace
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>ตำแหน่ง: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.position || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewWorkPosition
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <div className="w-full">
                                    <p>
                                      {e.dateStart} - {e.dateEnd}
                                    </p>
                                  </div>
                                  <p>สถานที่ฝึกงาน: {e.place}</p>
                                  <p>ตำแหน่ง: {e.position}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-400">* ไม่มีข้อมูลการทำงาน</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={` mt-10  overflow-hidden min-h-[50rem] w-[42rem] border`}
              >
                <div className=" w-full flex  ">
                  <div className="py-5 px-10 flex justify-center w-fit ">
                    <Profile imageSrc={dataUser.profile} />
                    {/* <Image
                      priority
                      alt="icon"
                      className="w-32 h-32 rounded-full"
                      src={dataUser.profile || "/image/main/user.png"}
                      height={1000}
                      width={1000}
                    /> */}
                  </div>
                  <div className="py-5 px-8 flex flex-col justify-center  ">
                    <div className=" flex gap-3 whitespace-nowrap">
                      <p className="text-2xl font-bold">{dataUser.firstName}</p>
                      <p className="text-2xl font-bold"> {dataUser.lastName}</p>
                    </div>
                    <div className=" flex gap-3">
                      {(!editMode &&
                        dataUser?.firstNameEng &&
                        dataUser?.lastNameEng) ||
                      editMode ? (
                        editMode ? (
                          <>
                            <div>
                              <label>Name</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) =>
                                  setNewFirstName(e.target.value)
                                }
                                defaultValue={dataUser?.firstNameEng || ""}
                              />
                            </div>
                            <div>
                              <label>LastName</label>
                              <input
                                type="text"
                                className="inputResume"
                                onChange={(e) => setNewLastName(e.target.value)}
                                defaultValue={dataUser?.lastNameEng || ""}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-bold capitalize text-gray-500 ">
                              {dataUser?.firstNameEng || ""}
                            </p>
                            <p className="text-xl font-bold capitalize text-gray-500">
                              {" "}
                              {dataUser?.lastNameEng || ""}
                            </p>
                          </>
                        )
                      ) : (
                        <p className="text-red-400">
                          * เพิ่มชื่อภาษาอังกฤษของคุณ
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <hr className=" border-black mx-5" />

                <div className="">
                  <div className="p-5 ">
                    <p className="text-lg font-bold">ข้อมูลส่วนตัว</p>
                    <div className="flex flex-col mt-2 gap-y-2 ps-5">
                      <div className="flex flex-wrap gap-2">
                        <p>
                          วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                          {dataUser.monthBirthday || "-"}{" "}
                          {dataUser.yearBirthday || "-"}
                        </p>
                        <p>({yearToday - dataUser.yearBirthday || "-"}ปี)</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <p>ความพิการ: </p>
                        {dataUser?.typeDisabled?.map((d, index) => (
                          <p key={index} className="">
                            {d || " - "}
                          </p>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <p>ที่อยู่: {dataUser.address || ""}</p>
                        <p>
                          {dataUser.addressProvince === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "ตำบล"}
                          {dataUser.addressTambon || " - "}
                        </p>
                        <p>
                          {" "}
                          {dataUser.addressProvince === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "อำเภอ"}
                          {dataUser.addressAmphor || " - "}
                        </p>
                        <p>จังหวัด{dataUser.addressProvince || " - "}</p>
                        <p>รหัสไปรษณีย์ {dataUser.addressZipCode || ""}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <label>เบอร์โทร: </label>
                        {editMode ? (
                          <input
                            type="text"
                            className="inputResume"
                            inputMode="numeric"
                            pattern="\d{10}"
                            maxLength={10}
                            onChange={(e) => setNewTel(e.target.value)}
                            defaultValue={dataUser.tel || " - "}
                          />
                        ) : (
                          <p>{dataUser.tel || "-"}</p>
                        )}
                      </div>
                      <p className=" ">อีเมล์: {dataUser.email || " - "}</p>
                    </div>
                  </div>
                  <hr className=" border-black mx-5" />
                  <div className="p-5">
                    <p className="text-lg font-bold">การศึกษา</p>
                    <div className="mt-2 flex flex-wrap gap-2 ps-5">
                      {dataEducations?.grade?.length > 0 ? (
                        dataEducations?.university?.map((education, index) => (
                          <div key={index}>
                            {editMode ? (
                              <div className="flex flex-wrap gap-2">
                                <p>
                                  {dataEducations.educationLevel[index] || "-"}
                                </p>
                                <div>
                                  <label>มหาวิทยาลัย: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.university[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewUniversity
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>คณะ: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.faculty[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewFaculty
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>สาขา: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.branch[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewBranch
                                      )
                                    }
                                  />
                                </div>
                                {dataEducations?.typePerson ===
                                  "นักศึกษาพิการ" && index === 0 ? (
                                  <div>
                                    <label>กำลังศึกษาชั้นปีที่: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={dataEducations.level || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewLevel
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <label>ปีที่จบการศึกษา: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={
                                        dataEducations.yearGraduation[index] ||
                                        ""
                                      }
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewYearGraduation
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <div>
                                  <label>เกรดเฉลี่ย: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={
                                      dataEducations.grade[index] || ""
                                    }
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewGrade
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <p>
                                  {dataEducations.educationLevel[index] || "-"}
                                </p>
                                <p>
                                  {dataEducations.university[index] || " - "}
                                </p>
                                <p>
                                  คณะ{dataEducations.faculty[index] || " - "}
                                </p>
                                <p>
                                  สาขา{dataEducations.branch[index] || " - "}
                                </p>
                                {dataEducations?.typePerson ===
                                  "นักศึกษาพิการ" && index === 0 ? (
                                  <p>
                                    กำลังศึกษา: ชั้นปีที่{" "}
                                    {dataEducations.level || " - "}
                                  </p>
                                ) : (
                                  <p>
                                    ปีที่จบการศึกษา:{" "}
                                    {dataEducations.yearGraduation[index] ||
                                      " - "}
                                  </p>
                                )}
                                <p>
                                  เกรดเฉลี่ย:{" "}
                                  {dataEducations.grade[index] || " - "}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400">* ไม่มีข้อมูลการศึกษา</p>
                      )}
                    </div>
                  </div>
                  <hr className=" border-black mx-5" />
                  <div className="p-5">
                    <p className="text-lg font-bold">ทักษะ</p>
                    <div className="flex flex-col mt-2 gap-y-2 ps-5">
                      {dataSkills?.skills?.length > 0 ? (
                        dataSkills?.skills?.map((skill, index) => (
                          <div key={index}>
                            {editMode ? (
                              <input
                                type="text"
                                className="inputResume"
                                defaultValue={skill.name || ""}
                                onBlur={(e) =>
                                  handleArray(
                                    e.target.value,
                                    index,
                                    setNewSkill
                                  )
                                }
                              />
                            ) : (
                              <p>{skill.name || " - "}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400 bg-white p-2">
                          * ไม่มีข้อมูลทักษะ
                        </p>
                      )}
                    </div>
                  </div>
                  <hr className=" border-black mx-5" />
                  <div className="p-5">
                    <div className="">
                      <p className="text-lg font-bold">ประสบการณ์ฝึกงาน</p>
                      <div className="mt-2 flex flex-wrap gap-5 ps-5">
                        {dataHistoryWork?.internships?.length > 0 ? (
                          dataHistoryWork?.internships?.map((e, index) => (
                            <div key={index}>
                              {editMode ? (
                                <div className="flex flex-wrap gap-2">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateStart || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipDateStart
                                        )
                                      }
                                    />
                                    <p>-</p>
                                    <input
                                      type="text"
                                      className="inputResume w-28"
                                      defaultValue={e.dateEnd || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipDateEnd
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>สถานที่ฝึกงาน: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.place || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipPlace
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label>ตำแหน่ง: </label>
                                    <input
                                      type="text"
                                      className="inputResume"
                                      defaultValue={e.position || ""}
                                      onBlur={(e) =>
                                        handleArray(
                                          e.target.value,
                                          index,
                                          setNewInternshipPosition
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  <div className="w-full">
                                    <p>
                                      {e.dateStart} - {e.dateEnd}
                                    </p>
                                  </div>
                                  <p>สถานที่ฝึกงาน: {e.place}</p>
                                  <p>ตำแหน่ง: {e.position}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-red-400">* ไม่มีข้อมูลการฝึกงาน</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className=" border-black mx-5" />
                  <div className="p-5">
                    <p className="text-lg font-bold">ประสบการณ์ทำงาน</p>
                    <div className=" flex flex-wrap gap-5 ps-5 mt-2">
                      {dataHistoryWork?.workExperience?.length > 0 ? (
                        dataHistoryWork?.workExperience?.map((e, index) => (
                          <div key={index}>
                            {editMode ? (
                              <div className="flex flex-wrap gap-2">
                                <div className="flex">
                                  <input
                                    type="text"
                                    className="inputResume w-28"
                                    defaultValue={e.dateStart || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkDateStart
                                      )
                                    }
                                  />
                                  <p>-</p>
                                  <input
                                    type="text"
                                    className=" inputResume w-28"
                                    defaultValue={e.dateEnd || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkDateEnd
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>สถานที่ฝึกงาน: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.place || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkPlace
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>ตำแหน่ง: </label>
                                  <input
                                    type="text"
                                    className="inputResume"
                                    defaultValue={e.position || ""}
                                    onBlur={(e) =>
                                      handleArray(
                                        e.target.value,
                                        index,
                                        setNewWorkPosition
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <div className="w-full">
                                  <p>
                                    {e.dateStart} - {e.dateEnd}
                                  </p>
                                </div>
                                <p>สถานที่ฝึกงาน: {e.place}</p>
                                <p>ตำแหน่ง: {e.position}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-red-400">* ไม่มีข้อมูลการทำงาน</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editMode ? (
              <div className="flex gap-10 w-full justify-center mt-5">
                <div
                  onClick={() => {
                    setEditMode(false);
                  }}
                  className={`${bgColorNavbar} ${bgColorWhite} hover:cursor-pointer bg-[#F97201] py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                >
                  <Icon path={mdiCloseCircle} size={1} />
                  <p>ยกเลิก</p>
                </div>
                <button
                  type="submit"
                  className={`${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`}
                >
                  <Icon path={mdiContentSave} size={1} />
                  <p>บันทึก</p>
                </button>
              </div>
            ) : (
              <div className="flex gap-10 w-full justify-center items-center mt-5">
                <div
                  onClick={() => setEditMode(true)}
                  className={` ${bgColorNavbar} ${bgColorWhite}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                >
                  <Icon path={mdiAccountEdit} size={1} />
                  <p>แก้ไขข้อมูล</p>
                </div>
                <PDFDownloadLink
                  document={
                    <PDFFile
                      type={type}
                      dataUser={dataUser}
                      dataSkills={dataSkills}
                      dataEducations={dataEducations}
                      dataHistoryWork={dataHistoryWork}
                      yearToday={yearToday}
                    />
                  }
                  fileName={`${dataUser?.idCard}resumev_${type}`}
                >
                  {({ loading }) =>
                    loading ? (
                      <p>กำลังโหลดเตรียมเอกสาร...</p>
                    ) : (
                      <div
                        className={`${inputTextColor} ${
                          inputGrayColor === "bg-[#74c7c2]" || ""
                            ? "bg-[#0d96f8]"
                            : ""
                        } hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`}
                      >
                        <Icon path={mdiFilePdfBox} size={1} />
                        <p>Export PDF</p>
                      </div>
                    )
                  }
                </PDFDownloadLink>
              </div>
            )}
          </form>
          {/* <PDFViewer className='w-full h-screen'>
                        <PDFFile type={type} dataUser={dataUser} dataSkills={dataSkills} dataEducations={dataEducations} dataHistoryWork={dataHistoryWork} yearToday={yearToday} />
                    </PDFViewer> */}
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p>กำลังโหลด...</p>
        </div>
      )}
    </div>
  );
}

export default Resume;
