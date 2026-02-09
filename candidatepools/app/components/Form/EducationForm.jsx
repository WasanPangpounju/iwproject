"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { saveAs } from "file-saver";
import {
  mdiDelete,
  mdiDownload,
  mdiPencil,
  mdiAlertCircle,
  mdiArrowDownDropCircle,
  mdiCloseCircle,
  mdiPlus,
} from "@mdi/js";
import universitys from "@/app/data/universitys.json";

//firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { storage } from "@/app/firebaseConfig";

import { useTheme } from "@/app/ThemeContext";

//stores
import { useEducationStore } from "@/stores/useEducationStore";

import TextError from "@/app/components/TextError";
import SelectLabelForm from "@/app/components/Form/SelectLabelForm";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import { toast } from "react-toastify";
import { downloadFileFromFirebase } from "@/utils/firebaseDownload";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";
import { TYPE_PERSON } from "@/const/enum";
import InputUniversityAutoComplete from "./InputUniversityAutoComplete";
import dataTypePerson from "@/assets/dataTypePerson";

function EducationForm({
  dataEducations,
  dataUser,
  handleStep,
  readOnly = false,
}) {
  //store
  const { updateEducationById, updateFileName } = useEducationStore();

  //Theme
  const { bgColorMain, inputEditColor } = useTheme();

  //value data user
  const [typePerson, setTypePerson] = useState(null);
  const [university, setUniversity] = useState([]);
  const [campus, setCampus] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [branch, setBranch] = useState([]);
  const [level, setLevel] = useState([]);
  const [educationLevel, setEducationLevel] = useState([]);
  const [grade, setGrade] = useState([]);
  const [yearGraduation, setYearGraduation] = useState([]);

  const [error, setError] = useState("");
  const [errorEducation, setErrorEducation] = useState("");

  //add array
  const handleFaculty = (e, index) => {
    const newFaculty = e; // ค่าที่ได้รับจาก input
    setFaculty((prevFaculties) => {
      const updatedFaculties = Array.isArray(prevFaculties)
        ? [...prevFaculties]
        : []; // ตรวจสอบว่า prevUniversities เป็น array หรือไม่
      updatedFaculties[index] = newFaculty; // อัปเดตค่าใหม่
      // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
      return updatedFaculties
        .filter((fac) => fac !== "")
        .concat(
          Array(
            updatedFaculties.length -
              updatedFaculties.filter((fac) => fac !== "").length,
          ).fill(""),
        );
    });
  };

  const handleUniversity = (value, index) => {
    setUniversity((prev) => {
      const updated = [...(Array.isArray(prev) ? prev : [])];
      updated[index] = value;
      return updated;
    });
  };

  const handleBranch = (e, index) => {
    const newBranch = e; // ค่าที่ได้รับจาก input
    setBranch((prevBranches) => {
      const updatedBranches = Array.isArray(prevBranches)
        ? [...prevBranches]
        : []; // ตรวจสอบว่า prevBranches เป็น array หรือไม่
      updatedBranches[index] = newBranch; // อัปเดตค่าใหม่
      // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
      return updatedBranches
        .filter((branch) => branch !== "")
        .concat(
          Array(
            updatedBranches.length -
              updatedBranches.filter((branch) => branch !== "").length,
          ).fill(""),
        );
    });
  };

  const handleCampus = (e, index) => {
    const newCampus = e; // ค่าที่ได้รับจาก input
    setCampus((prevCampuses) => {
      const updatedCampuses = Array.isArray(prevCampuses)
        ? [...prevCampuses]
        : []; // ตรวจสอบว่า prevCampuses เป็น array หรือไม่
      updatedCampuses[index] = newCampus; // อัปเดตค่าใหม่
      // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
      return updatedCampuses
        .filter((campus) => campus !== "")
        .concat(
          Array(
            updatedCampuses.length -
              updatedCampuses.filter((campus) => campus !== "").length,
          ).fill(""),
        );
    });
  };

  const handleGrade = (e, index) => {
    const newGrade = e; // ค่าที่ได้รับจาก input
    setGrade((prevGrades) => {
      const updatedGrades = Array.isArray(prevGrades) ? [...prevGrades] : []; // ตรวจสอบว่า prevGrades เป็น array หรือไม่
      updatedGrades[index] = newGrade; // อัปเดตค่าใหม่
      // ขยับค่าทั้งหมดถ้ามีตำแหน่งที่ว่าง
      return updatedGrades
        .filter((grade) => grade !== "")
        .concat(
          Array(
            updatedGrades.length -
              updatedGrades.filter((grade) => grade !== "").length,
          ).fill(""),
        );
    });
  };

  //add field
  const [fields, setFields] = useState([]);
  const addField = (n) => {
    const temp = n - 1;

    if (typePerson === "0" || !typePerson) {
      setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
      return;
    }
    if (
      !university[temp] ||
      !branch[temp] ||
      !faculty[temp] ||
      !educationLevel[temp] ||
      !grade[temp]
    ) {
      setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
      return;
    } else if (typePerson === "นักศึกษาพิการ") {
      if (!level[0]) {
        setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
        return;
      }
    } else if (typePerson === "บัณฑิตพิการ") {
      if (!yearGraduation[temp]) {
        setErrorEducation("ระบุข้อมูลให้ครบก่อนเพิ่มข้อมูล");
        return;
      }
    }

    setErrorEducation("");

    if (temp >= 3) return;
    setFields([...fields, `Field ${temp + 1}`]);
  };

  const deleteField = (index) => {
    const temp = index;
    setErrorEducation("");

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
        // ลบฟิลด์ที่มี index ตรงกัน
        const newFields = fields.filter((_, i) => i !== temp);
        setFields(newFields); // อัปเดต fields ด้วย array ใหม่

        const newUniversities = university.filter((_, i) => i !== temp); // ลบมหาวิทยาลัยที่มี index ตรงกัน
        setUniversity(newUniversities); // ตั้งค่าใหม่ให้ university หลังจากลบ

        const newEducationLevels = educationLevel.filter((_, i) => i !== temp);
        setEducationLevel(newEducationLevels);

        const newFaculty = faculty.filter((_, i) => i !== temp);
        setFaculty(newFaculty);

        const newBranch = branch.filter((_, i) => i !== temp);
        setBranch(newBranch);

        const newCampus = campus.filter((_, i) => i !== temp);
        setCampus(newCampus);

        const newGrade = grade.filter((_, i) => i !== temp);
        setGrade(newGrade);

        const newYearGraduation = yearGraduation.filter((_, i) => i !== temp);
        setYearGraduation(newYearGraduation);
      }
    });
  };

  useEffect(() => {
    if (!dataEducations) return; // เพิ่มการตรวจสอบทั้งสองกรณี

    if (dataEducations) {
      // set Default Educations
      setUniversity(dataEducations.university);
      setTypePerson(dataEducations.typePerson ?? "");
      setCampus(dataEducations.campus);
      setFaculty(dataEducations.faculty);
      setBranch(dataEducations.branch);
      setLevel(dataEducations.level);
      setEducationLevel(dataEducations.educationLevel);
      setGrade(dataEducations.grade);
      setYearGraduation(dataEducations.yearGraduation);
      setFiles(dataEducations.fileDocument);
      setNameFiles(dataEducations.nameDocument);
      setSizeFiles(dataEducations.sizeDocument);
      setTypeFiles(dataEducations.typeDocument);

      // ตรวจสอบว่า dataEducations.university เป็น array หรือไม่
      if (Array.isArray(dataEducations.university)) {
        setFields(dataEducations.university);
      } else {
        setFields([dataEducations.university]); // ถ้าไม่ใช่ ให้ใส่เข้าไปใน array
      }
    }
  }, [dataEducations]);

  const [editMode, setEditMode] = useState(false);

  const today = new Date();
  const yearToday = today.getFullYear();
  // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
  const years = Array.from({ length: 101 }, (_, i) => yearToday - i);

  //upload file
  const [file, setFiles] = useState([]); // อาร์เรย์ของไฟล์ที่อัปโหลด
  const [nameFile, setNameFiles] = useState([]); // อาร์เรย์ของชื่อไฟล์
  const [sizeFile, setSizeFiles] = useState([]); // อาร์เรย์ของขนาดไฟล์
  const [typeFile, setTypeFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputFileRef = useRef(null);
  const [inputNameFile, setInputNameFile] = useState("");

  const openFileDialog = () => {
    if (!inputNameFile) {
      setError("กรุณาระบุชื่อเอกสารก่อนทำการอัพโหลด");
      return;
    }

    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleDocument = (event) => {
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (
        fileExtension !== "pdf" &&
        fileExtension !== "docx" &&
        fileExtension !== "doc"
      ) {
        setError("กรุณาอัปโหลดไฟล์ PDF หรือ Word เท่านั้น");

        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setSizeFiles((prevSizes) => [...prevSizes, fileSizeMB]); // เพิ่มขนาดไฟล์ลงในอาร์เรย์

      // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
      const fileName = inputNameFile || selectedFile.name;
      setNameFiles((prevNames) => [...prevNames, fileName]); // เพิ่มชื่อไฟล์ลงในอาร์เรย์

      // ดึงนามสกุลไฟล์
      setTypeFiles((prevTypes) => [...prevTypes, fileExtension]); // เพิ่มประเภทไฟล์ลงในอาร์เรย์

      const storageRef = ref(
        storage,
        `users/documents/${dataUser?.email}/${fileName}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError(""); // รีเซ็ตข้อความข้อผิดพลาด
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // เมื่ออัปโหลดเสร็จสิ้น
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ files
              setFiles((prevFiles) => [...prevFiles, url]);

              // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
              setUploadProgress(0);
              setInputNameFile("");
              inputFileRef.current.value = "";
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        },
      );
    }
  };

  async function handleSubmit(e, n) {
    e.preventDefault();

    n -= 1; // ลดค่า n เพื่อใช้ index ที่ถูกต้อง

    // ตรวจสอบว่า uploadProgress มีค่าหรือไม่
    if (uploadProgress !== 0) {
      setError("เอกสารกำลังอัพโหลด");
      return;
    }

    // ตรวจสอบ typePerson
    if (typePerson === "0" || !typePerson) {
      setError("ระบุข้อมูลให้ครบทุกช่อง");
      return;
    }

    // ตรวจสอบ array และค่าใน index n
    if (
      !university ||
      !branch ||
      !faculty ||
      !educationLevel ||
      !grade ||
      n < 0 ||
      n >= university.length ||
      !university[n] ||
      !branch[n] ||
      !faculty[n] ||
      !educationLevel[n] ||
      !grade[n]
    ) {
      setError("ระบุข้อมูลให้ครบทุกช่อง");
      return;
    }

    // ตรวจสอบข้อมูลเฉพาะสำหรับนักศึกษาพิการ
    if (typePerson === "นักศึกษาพิการ") {
      if (!level[0]) {
        setError("ระบุข้อมูลให้ครบทุกช่อง");
        return;
      }
    }
    // ตรวจสอบข้อมูลเฉพาะสำหรับบัณฑิตพิการ
    else if (typePerson === "บัณฑิตพิการ") {
      if (!yearGraduation || n >= yearGraduation.length || !yearGraduation[n]) {
        setError("ระบุข้อมูลให้ครบทุกช่อง");
        return;
      }
    }

    setError("");

    const bodyEducation = {
      uuid: dataUser.uuid,
      typePerson,
      university,
      campus,
      faculty,
      branch,
      level,
      educationLevel,
      grade,
      yearGraduation,
      file,
      nameFile,
      sizeFile,
      typeFile,
    };

    try {
      const res = await updateEducationById(bodyEducation);

      if (!res.ok) {
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        return;
      }

      toast.success("บันทึกข้อมูลสำเร็จ");
      setEditMode(false);
      if (handleStep) {
        handleStep();
      }
    } catch (err) {
      toast.error(err || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  }

  //config file
  const handleEditNameFile = async (id, nameFile, index) => {
    const { value: newName } = await Swal.fire({
      title: "เปลี่ยนชื่อไฟล์",
      input: "text",
      inputLabel: "กรุณากรอกชื่อไฟล์ใหม่",
      inputValue: nameFile,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      inputValidator: (value) => {
        if (!value) {
          return "คุณต้องกรอกชื่อไฟล์!";
        }
      },
    });

    if (newName) {
      if (!editMode) {
        try {
          // ส่งคำขอ PUT เพื่ออัปเดตชื่อไฟล์
          const res = updateFileName(id, oldName, newName);

          if (res.ok) {
            toast.success("เปลี่ยนชื่อไฟล์สำเร็จ");
          } else {
            toast.error("เกิดข้อผิดพลาด");
          }
        } catch (err) {
          console.log(`เกิดข้อผิดพลาดในการติดต่อ API:`, err);
        }
      } else {
        setNameFiles((prevNameFiles) => {
          const newNameFiles = [...prevNameFiles]; // คัดลอกอาร์เรย์เดิม
          newNameFiles[index] = newName; // อัปเดตตำแหน่งที่ต้องการ
          return newNameFiles; // คืนค่าอาร์เรย์ที่แก้ไขแล้ว
        });
      }
    }
  };

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

    if (result.isConfirmed) {
      const newFile = [...file];
      newFile.splice(index, 1);

      const newNameFile = [...nameFile];
      newNameFile.splice(index, 1);

      const newTypeFile = [...typeFile];
      newTypeFile.splice(index, 1);

      const newSizeFile = [...sizeFile];
      newSizeFile.splice(index, 1);

      // อัปเดต state ด้วยอาร์เรย์ที่ถูกแก้ไขแล้ว
      setFiles(newFile);
      setNameFiles(newNameFile);
      setTypeFiles(newTypeFile);
      setSizeFiles(newSizeFile);
    }
  }

  //download file
  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      await downloadFileFromFirebase(fileUrl, fileName);
    } catch (err) {
      toast.error("ดาวน์โหลดไม่สำเร็จ");
    }
  };

  // const [showPDFPath, setShowPDFPath] = useState('');

  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

  function openFileExample() {
    const fileUrl =
      "https://debtclinicbysam.com:8443/regis/images/%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87-%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%99%E0%B8%B2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%8A%E0%B8%99.pdf";
    window.open(fileUrl, "_blank");
  }

  //select university
  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isFocusUni, setIsFocusUni] = useState(null);
  const [inputUniversity, setInputUniversity] = useState([]);

  function handleOptionUni(uni, index) {
    const temp = uni;
    // ค้นหาคำที่มีความคล้าย
    const filteredOptions = universitys.filter(
      (uni) => uni.university.toLowerCase().includes(temp.toLowerCase()), // เปรียบเทียบแบบ case-insensitive
    );
    setOptionUniversity(filteredOptions);

    setInputUniversity((prev) => {
      const newInputUniversity = [...prev];
      newInputUniversity[index] = temp;
      return newInputUniversity;
    });
  }

  //for progressbar
  const fieldProgress = [
    ...(typePerson === TYPE_PERSON.STUDENT ? [level] : [yearGraduation[0]]),
    university[0],
    typePerson,
    educationLevel[0],
    campus[0],
    faculty[0],
    grade[0],
    branch[0],
  ];

  return (
    <form
      onSubmit={(e) => handleSubmit(e, fields.length)}
      className=" flex gap-x-10 gap-y-5 gap- flex-wrap"
    >
      {dataUser &&
        fields.map((field, index) => (
          <div className="flex gap-x-10 gap-y-5 flex-wrap" key={index}>
            {/* ประเภทบุคล */}

            {index === 0 && (
              <div className="w-full">
                <SelectLabelForm
                  label={"ประเภทบุคคล"}
                  isRequire
                  editMode={editMode}
                  value={typePerson}
                  setValue={setTypePerson}
                  tailwind={"w-40"}
                  options={dataTypePerson?.map((item) => {
                    return {
                      id: item,
                      value: item,
                    };
                  })}
                />
              </div>
            )}
            {index > 0 &&
              (editMode ? (
                <div className="w-full flex gap-5 items-end">
                  <div
                    onClick={() => deleteField(index)}
                    className={`${
                      !editMode ? "hidden" : ""
                    } w-fit cursor-pointer`}
                  >
                    <Icon
                      className="text-red-400"
                      path={mdiCloseCircle}
                      size={1}
                    />
                  </div>
                </div>
              ) : (
                <hr className="w-full" />
              ))}

            {/* ส่วนที่เหลือ */}
            <div className="flex flex-col">
              <label>
                ระดับชั้น{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  onChange={(e) => {
                    let newEducationLevels = Array.isArray(educationLevel)
                      ? [...educationLevel]
                      : []; // ตรวจสอบว่า educationLevel เป็น array
                    newEducationLevels[index] = e.target.value; // อัปเดตค่าตาม index
                    setEducationLevel(newEducationLevels); // ตั้งค่าใหม่
                  }}
                  className={`${
                    !editMode
                      ? `cursor-default ${inputEditColor}`
                      : "cursor-pointer"
                  } ${bgColorMain} whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  disabled={!editMode}
                  value={
                    Array.isArray(educationLevel) &&
                    educationLevel[index] !== undefined
                      ? educationLevel[index]
                      : "-"
                  }
                >
                  <option value="">-</option>
                  <option value="ปริญญาตรี">ปริญญาตรี</option>
                  <option value="ปริญญาโท">ปริญญาโท</option>
                  <option value="ปริญญาเอก">ปริญญาเอก</option>
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
            {/* ปีที่จบการศึกษา */}
            {index === 0 ? (
              (typePerson === "บัณฑิตพิการ" ||
                dataUser.typePerson === "บัณฑิตพิการ") && (
                <div className="flex flex-col">
                  <label>
                    ปีที่จบการศึกษา{" "}
                    <span
                      className={`${!editMode ? "hidden" : ""} text-red-500`}
                    >
                      *
                    </span>
                  </label>
                  <div className="relative col w-fit mt-1">
                    <select
                      onChange={(e) => {
                        let newData = Array.isArray(yearGraduation)
                          ? [...yearGraduation]
                          : []; // ตรวจสอบว่า yearGraduation เป็น array
                        newData[index] = e.target.value; // อัปเดตค่าตาม index
                        setYearGraduation(newData); // ตั้งค่าใหม่
                      }}
                      className={`${
                        !editMode
                          ? `cursor-default ${inputEditColor}`
                          : "cursor-pointer"
                      } ${bgColorMain} whitespace-nowrap text-ellipsis overflow-hidden w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      disabled={!editMode}
                      value={
                        Array.isArray(yearGraduation) &&
                        yearGraduation[index] !== undefined
                          ? yearGraduation[index]
                          : "-"
                      }
                    >
                      <option value="">-</option>
                      {years.map((y, index) => (
                        <option key={index} value={y}>
                          {y}
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
              )
            ) : (
              <div className="flex flex-col">
                <label>
                  ปีที่จบการศึกษา{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="relative col w-fit mt-1">
                  <select
                    onChange={(e) => {
                      let newData = Array.isArray(yearGraduation)
                        ? [...yearGraduation]
                        : []; // ตรวจสอบว่า yearGraduation เป็น array
                      newData[index] = e.target.value; // อัปเดตค่าตาม index
                      setYearGraduation(newData); // ตั้งค่าใหม่
                    }}
                    className={`${
                      !editMode
                        ? `cursor-default ${inputEditColor}`
                        : "cursor-pointer"
                    } ${bgColorMain} whitespace-nowrap text-ellipsis overflow-hidden w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                    style={{ appearance: "none" }}
                    disabled={!editMode}
                    value={
                      Array.isArray(yearGraduation) &&
                      yearGraduation[index] !== undefined
                        ? yearGraduation[index]
                        : "-"
                    }
                  >
                    <option value="0">-</option>
                    {years.map((y, index) => (
                      <option key={index} value={y}>
                        {y}
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
            )}
            {/* สถาบันการศึกษา */}
            <div className="flex col flex-col ">
              <label>
                สถาบันการศึกษา/มหาวิทยาลัย{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative">
                <InputUniversityAutoComplete
                  value={
                    Array.isArray(inputUniversity) &&
                    inputUniversity[index] !== undefined
                      ? inputUniversity[index]
                      : Array.isArray(university) &&
                          university[index] !== undefined
                        ? university[index]
                        : ""
                  }
                  onChange={(value) => handleUniversity(value, index)}
                  placeholder="ระบุสถานศึกษา"
                  editMode={editMode}
                  tailwind={"py-2 mt-1"}
                />
              </div>
            </div>
            {/* วิทยาเขต */}

            <div className="flex col flex-col">
              <label>วิทยาเขต</label>
              <input
                type="text"
                className={`${
                  !editMode ? `cursor-default ${inputEditColor}` : ""
                } ${bgColorMain} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                onBlur={(e) => handleCampus(e.target.value, index)}
                defaultValue={
                  Array.isArray(campus) && campus[index] !== undefined
                    ? campus[index]
                    : ""
                }
                readOnly={!editMode}
                placeholder="ระบุวิทยาเขตการศึกษา"
              />
            </div>

            {/* คณะ */}
            <div className="flex col flex-col">
              <label>
                คณะ{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <input
                type="text"
                className={`${
                  !editMode ? `cursor-default ${inputEditColor}` : ""
                } ${bgColorMain} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                onBlur={(e) => handleFaculty(e.target.value, index)}
                defaultValue={
                  Array.isArray(faculty) && faculty[index] !== undefined
                    ? faculty[index]
                    : ""
                }
                readOnly={!editMode}
                placeholder="คณะที่สังกัด"
              />
            </div>
            {/* สาขา */}
            <div className="flex col flex-col">
              <label>
                สาขา{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <input
                type="text"
                className={`${
                  !editMode ? `cursor-default ${inputEditColor}` : ""
                } ${bgColorMain} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                onBlur={(e) => handleBranch(e.target.value, index)}
                defaultValue={
                  Array.isArray(branch) && branch[index] !== undefined
                    ? branch[index]
                    : ""
                }
                readOnly={!editMode}
                placeholder="สาขาที่สังกัด"
              />
            </div>
            {/* ชั้นปี */}
            {index === 0 && typePerson === "นักศึกษาพิการ" && (
              <div className="flex flex-col">
                <label>
                  ชั้นปี{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="relative col w-fit mt-1">
                  <select
                    onChange={(e) => {
                      let newData = Array.isArray(level) ? [...level] : []; // ตรวจสอบว่า level เป็น array
                      newData[index] = e.target.value; // อัปเดตค่าตาม index
                      setLevel(newData); // ตั้งค่าใหม่
                    }}
                    className={`${
                      !editMode
                        ? `cursor-default ${inputEditColor}`
                        : "cursor-pointer"
                    } ${bgColorMain} whitespace-nowrap text-ellipsis overflow-hidden w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                    style={{ appearance: "none" }}
                    disabled={!editMode}
                    value={
                      Array.isArray(level) && level[index] !== undefined
                        ? level[index]
                        : "-"
                    }
                  >
                    <option value="0">-</option>
                    <option value="1">ชั้นปี1</option>
                    <option value="2">ชั้นปี2</option>
                    <option value="3">ชั้นปี3</option>
                    <option value="4">ชั้นปี4</option>
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
            )}
            {/* เกรดเฉลี่ย */}
            <div className="flex col flex-col">
              <label>
                เกรดเฉลี่ย{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={`${
                  !editMode ? `cursor-default ${inputEditColor}` : ""
                } ${bgColorMain} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-24 border border-gray-400 py-2 px-4 rounded-lg`}
                onBlur={(e) => handleGrade(e.target.value, index)}
                defaultValue={
                  Array.isArray(grade) && grade[index] !== undefined
                    ? grade[index]
                    : ""
                }
                readOnly={!editMode}
                placeholder="Ex. 3.12"
              />
            </div>
          </div>
        ))}

      {errorEducation && (
        <div className="w-full">
          <p className="text-red-500">* {errorEducation}</p>
        </div>
      )}
      <div
        className={`${
          fields.length >= 4 ? "hidden" : ""
        } flex col flex-col justify-end w-full`}
      >
        <div
          onClick={() => addField(fields.length)}
          className={`${
            !editMode ? "hidden" : ""
          }  cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
        >
          <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
        </div>
      </div>

      <hr className="w-full my-3" />
      <div className="flex col flex-col">
        <label className="font-bold">เอกสารเพิ่มเติม</label>
        {editMode && (
          <>
            <div className="mt-3 flex gap-5 flex-wrap">
              <input
                type="text"
                className={`${
                  !editMode ? `cursor-default ${inputEditColor}` : ""
                } ${bgColorMain} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                onChange={(e) => setInputNameFile(e.target.value)} // ตั้งชื่อไฟล์
                placeholder="ชื่อเอกสาร"
                readOnly={!editMode}
                value={inputNameFile}
              />
              <div className={`mt-1 flex items-center`}>
                <input
                  id="chooseFile"
                  ref={inputFileRef}
                  onChange={handleDocument}
                  type="file"
                  className=""
                  hidden
                />
                <div
                  onClick={openFileDialog}
                  className={`border rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                    editMode ? " cursor-pointer" : " cursor-not-allowed"
                  }`}
                >
                  Choose File
                </div>
              </div>
            </div>
            <div className="flex mt-5">
              <p>
                <span className="text-red-500 font-bold">ตัวอย่าง</span>
                &nbsp;&nbsp;&nbsp;&nbsp;หนังสือรับรองผลการเรียน
                (Transcript)/วุฒิการศึกษา
              </p>
              <Icon
                onClick={openFileExample}
                className={`cursor-pointer text-gray-400 mx-3`}
                path={mdiAlertCircle}
                size={0.8}
              />
            </div>
            {uploadProgress > 0 && (
              <div className="mt-2">
                <p>กำลังดาวน์โหลด: {uploadProgress.toFixed(2)}%</p>
              </div>
            )}
          </>
        )}
      </div>
      {Array.isArray(file) && file.length > 0 ? (
        <div className="w-full mt-5">
          <p>ชื่อ</p>
          <hr className="w-full my-3" />
          {file.map((n, index) => (
            <div key={index} className="my-5">
              <div className="grid grid-cols-3 items-center ">
                <div className="cursor-pointer" onClick={() => openFile(n)}>
                  <p>{nameFile[index]}</p>
                </div>
                <div className=" text-center">
                  <p>{sizeFile[index]} MB</p>
                </div>
                <div className="flex justify-end">
                  <Icon
                    onClick={() =>
                      handleEditNameFile(dataUser?.uuid, nameFile[index], index)
                    }
                    className={`${
                      editMode ? "" : "hidden"
                    } cursor-pointer text-gray-40 mx-1`}
                    path={mdiPencil}
                    size={0.8}
                  />
                  <Icon
                    onClick={() => handleDownloadFile(n, nameFile[index])}
                    className={`${
                      editMode ? "" : "hidden"
                    } cursor-pointer text-gray-40 mx-1`}
                    path={mdiDownload}
                    size={0.8}
                  />
                  <Icon
                    onClick={() => handleDeleteFile(nameFile[index], index)}
                    className={`${
                      editMode ? "" : "hidden"
                    } cursor-pointer text-gray-40 mx-1`}
                    path={mdiDelete}
                    size={0.8}
                  />
                </div>
              </div>
              <hr className="w-full my-1" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-gray-300">
          ยังไม่มีไฟล์ที่อัพโหลด
        </div>
      )}

      {error && (
        <div className="w-full text-center">
          <TextError text={error} />
        </div>
      )}
      <div className="mt-4 w-full">
        {editMode && <ProgressBarForm fields={fieldProgress} />}
      </div>
      {!readOnly && (
        <ButtonGroup
          editMode={editMode}
          setEditMode={setEditMode}
          tailwind="mt-5"
        />
      )}
    </form>
  );
}

export default EducationForm;
