"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiPlus,
  mdiCloseCircle,
  mdiDownload,
  mdiArrowDownDropCircle,
  mdiDelete,
} from "@mdi/js";
import Swal from "sweetalert2";

//firebase
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // Import Firebase Storage
import { storage } from "@/app/firebaseConfig";
import { saveAs } from "file-saver";

//stores
import { useSkillStore } from "@/stores/useSkillStore";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";
import { toast } from "react-toastify";

function SkillForm({ dataSkills, id, handleStep }) {
  const [error, setError] = useState("");

  //store
  const { updateSkillById } = useSkillStore();

  //Theme
  const {
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    bgColorMain2,
    inputEditColor,
    inputGrayColor,
    inputTextColor,
  } = useTheme();

  //Mode
  const [editMode, setEditMode] = useState(false);

  //add data
  const [skillType, setSkillType] = useState([]);
  const [skillName, setSkillName] = useState([]);
  const [skillDetail, setSkillDetail] = useState([]);

  const handleSkillType = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setSkillType((prevTemp) => {
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

  const handleSkillName = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setSkillName((prevTemp) => {
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

  const handleSkillDetail = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setSkillDetail((prevTemp) => {
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

  //config field
  const [skills, setSkills] = useState([{}]);
  const [errorFieldSkill, setErrorFieldSkill] = useState("");

  const handleAddSkill = () => {
    // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล skill ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
    if (
      !skillType[skills.length - 1] ||
      !skillName[skills.length - 1] ||
      !skillDetail[skills.length - 1]
    ) {
      setErrorFieldSkill("กรุณากรอกข้อมูลทักษะให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    // จำกัดจำนวนทักษะไม่ให้เกิน 5 รายการ
    if (skills.length >= 5) {
      setErrorFieldSkill("");
      return;
    }

    setErrorFieldSkill("");
    setSkills([...skills, {}]); // เพิ่มออบเจกต์ว่างใน skills
  };

  const handleRemoveSkill = (index) => {
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
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        setSkills(newSkills);

        const temp = index;

        setErrorFieldSkill("");

        // ลบข้อมูลจาก skillType, skillName, และ skillDetail
        setSkillType((prev) => prev.filter((_, i) => i !== temp));
        setSkillName((prev) => prev.filter((_, i) => i !== temp));
        setSkillDetail((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //data train
  const [trainName, setTrainName] = useState([]);
  const [trainDetail, setTrainDetail] = useState([]);
  const [trainFile, setTrainFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);

  const handleTrainName = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setTrainName((prevTemp) => {
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

  const handleTrainDetail = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setTrainDetail((prevTemp) => {
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

  //config field
  const [trains, setTrains] = useState([{}]);
  const [errorFieldTrain, setErrorFieldTrain] = useState("");

  const handleAddTrain = () => {
    // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล train ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
    if (!trainName[trains.length - 1] || !trainDetail[trains.length - 1]) {
      setErrorFieldTrain("กรุณากรอกข้อมูลการอบรมให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    // จำกัดจำนวน train ไม่ให้เกิน 5 รายการ
    if (trains.length >= 5) {
      setErrorFieldTrain("");
      return;
    }

    setErrorFieldTrain("");
    setTrains([...trains, {}]); // เพิ่มออบเจกต์ว่างใน trains
  };

  const handleRemoveTrain = (index) => {
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
        const newTrains = [...trains];
        newTrains.splice(index, 1);
        setTrains(newTrains);

        const temp = index;

        setErrorFieldTrain("");

        // ลบข้อมูลจาก trainName, trainDetail, และ trainFile
        setTrainName((prev) => prev.filter((_, i) => i !== temp));
        setTrainDetail((prev) => prev.filter((_, i) => i !== temp));
        setTrainFile((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //upload file
  const trainFileInputRef = useRef(null);
  const [trainUploadProgress, setTrainUploadProgress] = useState(0);
  // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
  const openFileDialogTrain = () => {
    if (trainFileInputRef.current) {
      trainFileInputRef.current.click();
    }
  };

  const handleTrainDocument = (event, index) => {
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (
        fileExtension !== "pdf" &&
        fileExtension !== "docx" &&
        fileExtension !== "doc"
      ) {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");

        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

      // ใช้ชื่อไฟล์ที่กำหนดเอง
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/trainHistory/${id}/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError(""); // รีเซ็ตข้อความข้อผิดพลาด
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setTrainUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // เมื่ออัปโหลดเสร็จสิ้น
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ trainFile
              const newTrainFile = {
                fileName: fileName,
                fileType: fileExtension,
                fileUrl: url,
                fileSize: fileSizeMB,
              };

              setTrainFile((prevTrainFiles) => {
                const updatedTrainFiles = [...prevTrainFiles];
                updatedTrainFiles[index] = newTrainFile; // อัปเดตตำแหน่งที่ index
                return updatedTrainFiles;
              });
              // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
              setTrainUploadProgress(0);
              trainFileInputRef.current.value = "";
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    }
  };

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
  function mergeArrayObjects(nonGetArray, getArray) {
    const maxLength = Math.max(nonGetArray.length, getArray.length);

    return Array.from({ length: maxLength }, (_, index) => {
      const nonGetItem = nonGetArray[index] || {}; // ใช้ค่าจาก nonGetArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง
      const getItem = getArray[index] || {}; // ใช้ค่าจาก getArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง

      // รวมค่าในตำแหน่งเดียวกันจากทั้งสองอาร์เรย์ โดยให้ข้อมูลที่มีค่าจริงจาก nonGetItem มีความสำคัญกว่า getItem
      return {
        fileName: nonGetItem.fileName || getItem.fileName || "",
        fileSize: nonGetItem.fileSize || getItem.fileSize || "",
        fileType: nonGetItem.fileType || getItem.fileType || "",
        fileUrl: nonGetItem.fileUrl || getItem.fileUrl || "",
        _id: nonGetItem._id || getItem._id || "",
      };
    });
  }

  //function submit
  async function handleSubmit(e, fieldSkills, fieldTrains) {
    e.preventDefault();

    const mergedSkillType = skillType;
    const mergedSkillName = skillName;
    const mergedSkillDetail = skillDetail;

    const mergedTrainName = trainName;
    const mergedTrainDetail = trainDetail;
    const mergedTrainFile = trainFile;

    // ลดค่าตัวนับของแต่ละฟิลด์ลง 1
    fieldSkills -= 1;
    fieldTrains -= 1;

    // ตรวจสอบข้อมูลโครงงาน / ผลงาน
    const hasAnySkillField =
      mergedSkillType[fieldSkills] ||
      mergedSkillName[fieldSkills] ||
      mergedSkillDetail[fieldSkills];

    const isSkillFieldComplete =
      mergedSkillType[fieldSkills] &&
      mergedSkillName[fieldSkills] &&
      mergedSkillDetail[fieldSkills];

    if (hasAnySkillField && !isSkillFieldComplete) {
      setError("กรุณาระบุข้อมูล ความสามารถ ให้ครบทุกช่อง");

      return;
    }

    const hasAnyTrainField =
      mergedTrainName[fieldTrains] || mergedTrainDetail[fieldTrains];

    const isTrainFieldComplete =
      mergedTrainName[fieldTrains] && mergedTrainDetail[fieldTrains];

    // ตรวจสอบข้อมูลการฝึกงาน
    if (hasAnyTrainField && !isTrainFieldComplete) {
      setError("กรุณาระบุข้อมูล การอบรม ให้ครบทุกช่อง");

      return;
    }

    const hasAnyField = hasAnySkillField || hasAnyTrainField;
    // หากไม่มีข้อมูลเลยในทุกส่วน
    if (!hasAnyField) {
      setError("ไม่มีข้อมูลที่บันทึก");

      return;
    }

    // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
    setError("");

    // จัดเตรียมข้อมูลที่จะส่งไปยัง API
    const data = {
      uuid: id,
      skills: mergedSkillName.map((name, index) => ({
        type: mergedSkillType[index],
        name,
        detail: mergedSkillDetail[index],
      })),
      trains: mergedTrainName.map((name, index) => ({
        name,
        detail: mergedTrainDetail[index],
        files: [
          {
            fileName: mergedTrainFile[index]?.fileName || "",
            fileType: mergedTrainFile[index]?.fileType || "",
            fileUrl: mergedTrainFile[index]?.fileUrl || "",
            fileSize: mergedTrainFile[index]?.fileSize || "",
          },
        ],
      })),
    };

    try {
      // ส่งข้อมูลไปยัง API ด้วย fetch
      const response = await updateSkillById(data);

      if (response.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setEditMode(false);
        if (handleStep) {
          handleStep();
        }
      } else {
        console.error("Failed to submit data");
        toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        setEditMode(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("เกิดข้อผิดพลาด");
      setEditMode(false);
      return;
    }
  }

  //set default value
  useEffect(() => {
    if (!dataSkills) return;

    // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setSkillType(dataSkills.skills?.map((skill) => skill.type) || []);
    setSkillName(dataSkills.skills?.map((skill) => skill.name) || []);
    setSkillDetail(dataSkills.skills?.map((skill) => skill.detail) || []);

    setTrainName(dataSkills.trains?.map((train) => train.name) || []);
    setTrainDetail(dataSkills.trains?.map((train) => train.detail) || []);
    setTrainFile(dataSkills.trains?.flatMap((train) => train.files) || []);

    // set ฟิลด์เริ่มต้น
    if (Array.isArray(dataSkills.skills) && dataSkills.skills.length > 0) {
      setSkills(dataSkills.skills);
    }
    if (Array.isArray(dataSkills.trains) && dataSkills.trains.length > 0) {
      setTrains(dataSkills.trains);
    }
  }, [dataSkills]);

  //Download file
  const handleDownloadFile = async (filePath, fileName) => {
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    try {
      // ดึง URL ของไฟล์
      const downloadURL = await getDownloadURL(fileRef);

      // ใช้ fetch เพื่อดาวน์โหลดไฟล์
      const response = await fetch(downloadURL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // แปลงเป็น Blob
      saveAs(blob, fileName); // ใช้ file-saver เพื่อดาวน์โหลดไฟล์
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
    }
  };

  //openfile
  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

  //deleteFile
  async function handleDeleteFile(name, index) {
    const result = await Swal.fire({
      title: "ลบข้อมูล",
      text: `คุณต้องการลบไฟล์ ${name}?`,
      icon: "warning",
      confirmButtonText: "ใช่",
      confirmButtonColor: "#f27474",
      showCancelButton: true,
      cancelButtonText: "ไม่",
    });

    const mergedTrainFile = trainFile;

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedTrainFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setTrainFile(updatedTrainFiles);
      toast.success("ลบไฟล์สำเร็จ", `${name} ถูกลบเรียบร้อยแล้ว`, "success");
    }
  }

  //for progressbar
  const fieldProgress = [
    skillType[0],
    skillDetail[0],
    skillName[0],
    trainName[0],
    trainDetail[0],
  ];
  return (
    <form
      onSubmit={(e) => handleSubmit(e, skills.length, trains.length)}
      className={`${bgColorMain2} ${bgColor} flex flex-col gap-16`}
    >
      <div>
        <p className="mb-2">ความสามารถ</p>
        <hr />
        {skills.map((skill, index) => (
          <div key={index}>
            {index > 0 && editMode && (
              <div className={` flex col flex-col justify-end w-full mt-5`}>
                <div
                  className={` cursor-pointer  rounded-lg w-fit`}
                  onClick={() => handleRemoveSkill(index)}
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
                  ด้าน{" "}
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
                    onChange={(e) => handleSkillType(e.target.value, index)}
                    value={skillType[index] || ""}
                    disabled={!editMode}
                  >
                    <option value="">-</option>
                    <option value="ด้านคอมพิวเตอร์">ด้านคอมพิวเตอร์</option>
                    <option value="ด้านการสื่อสาร">ด้านการสื่อสาร</option>
                    <option value="ด้านการออกแบบ/กราฟฟิก">
                      ด้านการออกแบบ/กราฟฟิก
                    </option>
                    <option value="ด้านการบริการ">ด้านการบริการ</option>
                    <option value="ด้านบัญชี/การเงิน">ด้านบัญชี/การเงิน</option>
                    <option value="ด้านการสอน">ด้านการสอน</option>
                    <option value="ด้านการขาย">ด้านการขาย</option>
                    <option value="ด้านการจัดการข้อมูล">
                      ด้านการจัดการข้อมูล
                    </option>
                    <option value="ด้านการเขียน">ด้านการเขียน</option>
                    <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
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
                  ทักษะ{" "}
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
                  defaultValue={skillName[index] || ""}
                  onBlur={(e) => handleSkillName(e.target.value, index)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  อธิบายรายละเอียด{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain}  mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                  readOnly={!editMode}
                  placeholder="รายละเอียดเพิ่มเติม"
                  defaultValue={skillDetail[index] || ""}
                  onBlur={(e) => handleSkillDetail(e.target.value, index)}
                />
              </div>
            </div>
          </div>
        ))}
        {errorFieldSkill && (
          <div className="mt-3 text-red-500">*{errorFieldSkill}</div>
        )}
        {skills.length < 5 && editMode && (
          <div className={` flex col flex-col justify-end w-full mt-5`}>
            <div
              className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
              onClick={handleAddSkill}
            >
              <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="mb-2">การอบรม</p>
        <hr />
        {trains.map((train, index) => (
          <div key={index}>
            {index > 0 && editMode && (
              <div className={` flex col flex-col justify-end w-full mt-5`}>
                <div
                  className={` cursor-pointer  rounded-lg w-fit`}
                  onClick={() => handleRemoveTrain(index)}
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
                  เรื่อง{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} mt-1 w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  placeholder="ระบุชื่อเรื่องการอบรม"
                  onBlur={(e) => handleTrainName(e.target.value, index)}
                  defaultValue={trainName[index] || ""}
                  readOnly={!editMode}
                />
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
                  placeholder="รายละเอียดเพิ่มเติม"
                  onBlur={(e) => handleTrainDetail(e.target.value, index)}
                  defaultValue={trainDetail[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {trainFile[index]?.fileUrl || editMode ? (
                  <label>เอกสารประกอบ / ใบประกาศ</label>
                ) : null}
                {/* input สำหรับเลือกไฟล์ */}

                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {trainFile[index] && trainFile[index]?.fileUrl !== "" ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      className="cursor-pointer"
                      onClick={() => openFile(trainFile[index]?.fileUrl)}
                    >
                      <p>
                        {trainFile[index]?.fileName}.
                        {trainFile[index]?.fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {trainFile[index]?.fileSize} MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            trainFile[index]?.fileUrl,
                            trainFile[index]?.fileName
                          )
                        }
                        className="text-black"
                        path={mdiDownload}
                        size={1}
                      />
                      {editMode && (
                        <Icon
                          onClick={() =>
                            handleDeleteFile(trainFile[index]?.fileName, index)
                          }
                          className={` text-black`}
                          path={mdiDelete}
                          size={1}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  editMode && (
                    <div
                      onClick={editMode ? openFileDialogTrain : undefined} // เรียกใช้ฟังก์ชันเมื่อ editMode เป็น true
                      // className={`border mt-1 rounded-lg py-2 px-8 text-center ${editMode ? 'bg-gray-300 cursor-pointer' : 'bg-gray-100 cursor-not-allowed'
                      //     }`}
                      className={`border mt-1 rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                        editMode ? " cursor-pointer" : " cursor-not-allowed"
                      }`}
                      style={{ pointerEvents: editMode ? "auto" : "none" }} // ปิดการคลิกเมื่อ editMode เป็น false
                    >
                      <input
                        id="chooseTrainFile"
                        type="file"
                        ref={trainFileInputRef} // เชื่อมต่อกับ ref
                        onChange={(e) => handleTrainDocument(e, index)}
                        hidden
                      />
                      Choose File
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {errorFieldTrain && (
          <div className="mt-3 text-red-500">*{errorFieldTrain}</div>
        )}
        {trains.length < 5 && editMode && (
          <div className={` flex col flex-col justify-end w-full mt-5`}>
            <div
              className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
              onClick={handleAddTrain}
            >
              <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
            </div>
          </div>
        )}
      </div>
      {editMode && <ProgressBarForm fields={fieldProgress} />}
      <div>
        {error && (
          <div className="w-full text-center">
            <p className="text-red-500">* {error}</p>
          </div>
        )}
        <ButtonGroup
          editMode={editMode}
          setEditMode={setEditMode}
          tailwind="mt-5"
        />
      </div>
    </form>
  );
}

export default SkillForm;
