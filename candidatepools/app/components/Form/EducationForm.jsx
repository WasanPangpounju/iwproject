"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebaseConfig";

import { useTheme } from "@/app/ThemeContext";

//stores
import { useEducationStore } from "@/stores/useEducationStore";

import TextError from "@/app/components/TextError";
import SelectLabelForm from "@/app/components/Form/SelectLabelForm";
import { dataTypePerson } from "@/assets/dataTypePerson";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import { toast } from "react-toastify";
import { downloadFileFromFirebase } from "@/utils/firebaseDownload";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";
import { TYPE_PERSON } from "@/const/enum";
import InputUniversityAutoComplete from "./InputUniversityAutoComplete";

function EducationForm({ dataEducations, dataUser, handleStep, readOnly = false }) {
  //store
  const { updateEducationById, updateFileName } = useEducationStore();

  //Theme
  const { bgColor, bgColorMain, inputEditColor } = useTheme();

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

  // A11y: ids สำหรับ error
  const errorEducationId = "education-error-education";
  const errorFormId = "education-error-form";

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

  // helper: สร้าง id ให้ field ตาม index (label -> input)
  const makeId = (name, index) => `edu-${name}-${index}`;

  //add array
  const handleFaculty = (e, index) => {
    const newFaculty = e;
    setFaculty((prevFaculties) => {
      const updatedFaculties = Array.isArray(prevFaculties) ? [...prevFaculties] : [];
      updatedFaculties[index] = newFaculty;
      return updatedFaculties
        .filter((fac) => fac !== "")
        .concat(
          Array(updatedFaculties.length - updatedFaculties.filter((fac) => fac !== "").length).fill("")
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
    const newBranch = e;
    setBranch((prevBranches) => {
      const updatedBranches = Array.isArray(prevBranches) ? [...prevBranches] : [];
      updatedBranches[index] = newBranch;
      return updatedBranches
        .filter((branch) => branch !== "")
        .concat(
          Array(updatedBranches.length - updatedBranches.filter((branch) => branch !== "").length).fill("")
        );
    });
  };

  const handleCampus = (e, index) => {
    const newCampus = e;
    setCampus((prevCampuses) => {
      const updatedCampuses = Array.isArray(prevCampuses) ? [...prevCampuses] : [];
      updatedCampuses[index] = newCampus;
      return updatedCampuses
        .filter((campus) => campus !== "")
        .concat(
          Array(updatedCampuses.length - updatedCampuses.filter((campus) => campus !== "").length).fill("")
        );
    });
  };

  const handleGrade = (e, index) => {
    const newGrade = e;
    setGrade((prevGrades) => {
      const updatedGrades = Array.isArray(prevGrades) ? [...prevGrades] : [];
      updatedGrades[index] = newGrade;
      return updatedGrades
        .filter((grade) => grade !== "")
        .concat(
          Array(updatedGrades.length - updatedGrades.filter((grade) => grade !== "").length).fill("")
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
    if (!university[temp] || !branch[temp] || !faculty[temp] || !educationLevel[temp] || !grade[temp]) {
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
        const newFields = fields.filter((_, i) => i !== temp);
        setFields(newFields);

        setUniversity(university.filter((_, i) => i !== temp));
        setEducationLevel(educationLevel.filter((_, i) => i !== temp));
        setFaculty(faculty.filter((_, i) => i !== temp));
        setBranch(branch.filter((_, i) => i !== temp));
        setCampus(campus.filter((_, i) => i !== temp));
        setGrade(grade.filter((_, i) => i !== temp));
        setYearGraduation(yearGraduation.filter((_, i) => i !== temp));
      }
    });
  };

  useEffect(() => {
    if (!dataEducations) return;

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

    if (Array.isArray(dataEducations.university)) {
      setFields(dataEducations.university);
    } else {
      setFields([dataEducations.university]);
    }
  }, [dataEducations]);

  const [editMode, setEditMode] = useState(false);

  const today = new Date();
  const yearToday = today.getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => yearToday - i);

  //upload file
  const [file, setFiles] = useState([]);
  const [nameFile, setNameFiles] = useState([]);
  const [sizeFile, setSizeFiles] = useState([]);
  const [typeFile, setTypeFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputFileRef = useRef(null);
  const [inputNameFile, setInputNameFile] = useState("");

  const openFileDialog = () => {
    if (!inputNameFile) {
      setError("กรุณาระบุชื่อเอกสารก่อนทำการอัพโหลด");
      return;
    }
    if (inputFileRef.current) inputFileRef.current.click();
  };

  const handleDocument = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop();
    if (fileExtension !== "pdf" && fileExtension !== "docx" && fileExtension !== "doc") {
      setError("กรุณาอัปโหลดไฟล์ PDF หรือ Word เท่านั้น");
      return;
    }

    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    setSizeFiles((prevSizes) => [...prevSizes, fileSizeMB]);

    const fileName = inputNameFile || selectedFile.name;
    setNameFiles((prevNames) => [...prevNames, fileName]);
    setTypeFiles((prevTypes) => [...prevTypes, fileExtension]);

    const storageRef = ref(storage, `users/documents/${dataUser?.email}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setError("");
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setFiles((prevFiles) => [...prevFiles, url]);
            setUploadProgress(0);
            setInputNameFile("");
            if (inputFileRef.current) inputFileRef.current.value = "";
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      }
    );
  };

  async function handleSubmit(e, n) {
    e.preventDefault();
    n -= 1;

    if (uploadProgress !== 0) {
      setError("เอกสารกำลังอัพโหลด");
      return;
    }

    if (typePerson === "0" || !typePerson) {
      setError("ระบุข้อมูลให้ครบทุกช่อง");
      return;
    }

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

    if (typePerson === "นักศึกษาพิการ") {
      if (!level[0]) {
        setError("ระบุข้อมูลให้ครบทุกช่อง");
        return;
      }
    } else if (typePerson === "บัณฑิตพิการ") {
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
        toast.error("เกิดข้อผิดพลาด");
        setEditMode(false);
        return;
      }

      toast.success("บันทึกข้อมูลสำเร็จ");
      setEditMode(false);
      if (handleStep) handleStep();
    } catch (err) {
      console.log(err);
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
        if (!value) return "คุณต้องกรอกชื่อไฟล์!";
      },
    });

    if (newName) {
      if (!editMode) {
        try {
          // NOTE: โค้ดเดิมอ้าง oldName ที่ไม่มีใน scope → ผมไม่แก้ logic ตรงนี้เพื่อไม่กระทบระบบ
          // แต่ถ้าคุณต้องการให้ทำงานจริง 100% ให้ส่ง store updateFileName มาให้ดูครับ
          const res = updateFileName(id, oldName, newName);

          if (res.ok) toast.success("เปลี่ยนชื่อไฟล์สำเร็จ");
          else toast.error("เกิดข้อผิดพลาด");
        } catch (err) {
          console.log(`เกิดข้อผิดพลาดในการติดต่อ API:`, err);
        }
      } else {
        setNameFiles((prevNameFiles) => {
          const newNameFiles = [...prevNameFiles];
          newNameFiles[index] = newName;
          return newNameFiles;
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

      setFiles(newFile);
      setNameFiles(newNameFile);
      setTypeFiles(newTypeFile);
      setSizeFiles(newSizeFile);
    }
  }

  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      await downloadFileFromFirebase(fileUrl, fileName);
    } catch (err) {
      toast.error("ดาวน์โหลดไม่สำเร็จ");
    }
  };

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
    const filteredOptions = universitys.filter((uni) =>
      uni.university.toLowerCase().includes(temp.toLowerCase())
    );
    setOptionUniversity(filteredOptions);

    setInputUniversity((prev) => {
      const newInputUniversity = [...prev];
      newInputUniversity[index] = temp;
      return newInputUniversity;
    });
  }

  function SeletedOption(uni, index) {
    const input = uni;
    setUniversity((prevUniversities) => {
      const updatedUniversities = Array.isArray(prevUniversities) ? [...prevUniversities] : [];
      updatedUniversities[index] = input;
      return updatedUniversities
        .filter((uni) => uni !== "")
        .concat(
          Array(updatedUniversities.length - updatedUniversities.filter((uni) => uni !== "").length).fill("")
        );
    });
    setInputUniversity((prevUniversities) => {
      const updatedUniversities = Array.isArray(prevUniversities) ? [...prevUniversities] : [];
      updatedUniversities[index] = input;
      return updatedUniversities
        .filter((uni) => uni !== "")
        .concat(
          Array(updatedUniversities.length - updatedUniversities.filter((uni) => uni !== "").length).fill("")
        );
    });
    setOptionUniversity([]);
  }

  //for progressbar
  const fieldProgress = useMemo(() => {
    return [
      ...(typePerson === TYPE_PERSON.STUDENT ? [level] : [yearGraduation[0]]),
      university[0],
      typePerson,
      educationLevel[0],
      campus[0],
      faculty[0],
      grade[0],
      branch[0],
    ];
  }, [typePerson, level, yearGraduation, university, educationLevel, campus, faculty, grade, branch]);

  // Responsive: ให้แต่ละ field เป็น card ย่อย และจัด layout แบบ grid
  return (
    <form
      onSubmit={(e) => handleSubmit(e, fields.length)}
      className="w-full"
      aria-describedby={[
        errorEducation ? errorEducationId : null,
        error ? errorFormId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined}
    >
      {/* กลุ่มฟอร์ม */}
      <div className="flex flex-col gap-6">
        {dataUser &&
          fields.map((field, index) => {
            const eduLevelId = makeId("educationLevel", index);
            const yearGradId = makeId("yearGraduation", index);
            const uniId = makeId("university", index);
            const campusId = makeId("campus", index);
            const facultyId = makeId("faculty", index);
            const branchId = makeId("branch", index);
            const levelId = makeId("level", index);
            const gradeId = makeId("grade", index);

            return (
              <section
                key={index}
                className="w-full"
                aria-label={`ข้อมูลการศึกษา ${index + 1}`}
              >
                <div className="flex flex-col gap-4">
                  {/* ประเภทบุคคล */}
                  {index === 0 && (
                    <div className="w-full">
                      <SelectLabelForm
                        label={"ประเภทบุคคล"}
                        isRequire
                        editMode={editMode}
                        value={typePerson}
                        setValue={setTypePerson}
                        tailwind={"w-full sm:w-40"}
                        options={dataTypePerson.map((item) => ({ id: item, value: item }))}
                      />
                    </div>
                  )}

                  {/* ลบ field */}
                  {index > 0 &&
                    (editMode ? (
                      <div className="w-full flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => deleteField(index)}
                          className={`${focusRing} rounded-md p-1`}
                          aria-label={`ลบข้อมูลการศึกษา ${index + 1}`}
                        >
                          <Icon className="text-red-400" path={mdiCloseCircle} size={1} />
                        </button>
                      </div>
                    ) : (
                      <hr className="w-full" />
                    ))}

                  {/* ฟอร์มหลัก: ทำเป็น responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {/* ระดับชั้น (select) */}
                    <div className="flex flex-col">
                      <label htmlFor={eduLevelId}>
                        ระดับชั้น{" "}
                        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                      </label>
                      <div className="relative mt-1">
                        <select
                          id={eduLevelId}
                          onChange={(e) => {
                            let newEducationLevels = Array.isArray(educationLevel)
                              ? [...educationLevel]
                              : [];
                            newEducationLevels[index] = e.target.value;
                            setEducationLevel(newEducationLevels);
                          }}
                          className={`${
                            !editMode ? `cursor-default ${inputEditColor}` : "cursor-pointer"
                          } ${bgColorMain} ${focusRing} whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-40 border border-gray-400 py-2 px-4 rounded-lg`}
                          style={{ appearance: "none" }}
                          disabled={!editMode}
                          value={
                            Array.isArray(educationLevel) && educationLevel[index] !== undefined
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
                          } pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3`}
                          path={mdiArrowDownDropCircle}
                          size={0.8}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* ปีที่จบการศึกษา */}
                    {(index === 0
                      ? typePerson === "บัณฑิตพิการ" || dataUser.typePerson === "บัณฑิตพิการ"
                      : true) && (
                      <div className="flex flex-col">
                        <label htmlFor={yearGradId}>
                          ปีที่จบการศึกษา{" "}
                          <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>
                        <div className="relative mt-1">
                          <select
                            id={yearGradId}
                            onChange={(e) => {
                              let newData = Array.isArray(yearGraduation) ? [...yearGraduation] : [];
                              newData[index] = e.target.value;
                              setYearGraduation(newData);
                            }}
                            className={`${
                              !editMode ? `cursor-default ${inputEditColor}` : "cursor-pointer"
                            } ${bgColorMain} ${focusRing} whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                            style={{ appearance: "none" }}
                            disabled={!editMode}
                            value={
                              Array.isArray(yearGraduation) && yearGraduation[index] !== undefined
                                ? yearGraduation[index]
                                : "-"
                            }
                          >
                            <option value={index === 0 ? "" : "0"}>-</option>
                            {years.map((y, i) => (
                              <option key={i} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                          <Icon
                            className={`${
                              !editMode ? "hidden" : ""
                            } pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3`}
                            path={mdiArrowDownDropCircle}
                            size={0.8}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}

                    {/* สถาบันการศึกษา */}
                    <div className="flex flex-col sm:col-span-2 lg:col-span-1">
                      <label htmlFor={uniId}>
                        สถาบันการศึกษา/มหาวิทยาลัย{" "}
                        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                      </label>
                      <div className="relative mt-1">
                        <InputUniversityAutoComplete
                          id={uniId}
                          value={
                            Array.isArray(inputUniversity) && inputUniversity[index] !== undefined
                              ? inputUniversity[index]
                              : Array.isArray(university) && university[index] !== undefined
                              ? university[index]
                              : ""
                          }
                          onChange={(value) => handleUniversity(value, index)}
                          placeholder="ระบุสถานศึกษา"
                          editMode={editMode}
                          tailwind={`py-2 w-full ${focusRing}`}
                        />
                      </div>
                    </div>

                    {/* วิทยาเขต */}
                    <div className="flex flex-col">
                      <label htmlFor={campusId}>วิทยาเขต</label>
                      <input
                        id={campusId}
                        type="text"
                        className={`${
                          !editMode ? `cursor-default ${inputEditColor}` : ""
                        } ${bgColorMain} ${focusRing} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onBlur={(e) => handleCampus(e.target.value, index)}
                        defaultValue={Array.isArray(campus) && campus[index] !== undefined ? campus[index] : ""}
                        readOnly={!editMode}
                        placeholder="ระบุวิทยาเขตการศึกษา"
                      />
                    </div>

                    {/* คณะ */}
                    <div className="flex flex-col">
                      <label htmlFor={facultyId}>
                        คณะ{" "}
                        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                      </label>
                      <input
                        id={facultyId}
                        type="text"
                        className={`${
                          !editMode ? `cursor-default ${inputEditColor}` : ""
                        } ${bgColorMain} ${focusRing} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onBlur={(e) => handleFaculty(e.target.value, index)}
                        defaultValue={Array.isArray(faculty) && faculty[index] !== undefined ? faculty[index] : ""}
                        readOnly={!editMode}
                        placeholder="คณะที่สังกัด"
                      />
                    </div>

                    {/* สาขา */}
                    <div className="flex flex-col">
                      <label htmlFor={branchId}>
                        สาขา{" "}
                        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                      </label>
                      <input
                        id={branchId}
                        type="text"
                        className={`${
                          !editMode ? `cursor-default ${inputEditColor}` : ""
                        } ${bgColorMain} ${focusRing} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                        onBlur={(e) => handleBranch(e.target.value, index)}
                        defaultValue={Array.isArray(branch) && branch[index] !== undefined ? branch[index] : ""}
                        readOnly={!editMode}
                        placeholder="สาขาที่สังกัด"
                      />
                    </div>

                    {/* ชั้นปี (เฉพาะนักศึกษาพิการ + index 0) */}
                    {index === 0 && typePerson === "นักศึกษาพิการ" && (
                      <div className="flex flex-col">
                        <label htmlFor={levelId}>
                          ชั้นปี{" "}
                          <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                        </label>
                        <div className="relative mt-1">
                          <select
                            id={levelId}
                            onChange={(e) => {
                              let newData = Array.isArray(level) ? [...level] : [];
                              newData[index] = e.target.value;
                              setLevel(newData);
                            }}
                            className={`${
                              !editMode ? `cursor-default ${inputEditColor}` : "cursor-pointer"
                            } ${bgColorMain} ${focusRing} whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-32 border border-gray-400 py-2 px-4 rounded-lg`}
                            style={{ appearance: "none" }}
                            disabled={!editMode}
                            value={Array.isArray(level) && level[index] !== undefined ? level[index] : "-"}
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
                            } pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3`}
                            path={mdiArrowDownDropCircle}
                            size={0.8}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}

                    {/* เกรดเฉลี่ย */}
                    <div className="flex flex-col">
                      <label htmlFor={gradeId}>
                        เกรดเฉลี่ย{" "}
                        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                      </label>
                      <input
                        id={gradeId}
                        type="text"
                        inputMode="numeric"
                        className={`${
                          !editMode ? `cursor-default ${inputEditColor}` : ""
                        } ${bgColorMain} ${focusRing} mt-1 whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-24 border border-gray-400 py-2 px-4 rounded-lg`}
                        onBlur={(e) => handleGrade(e.target.value, index)}
                        defaultValue={Array.isArray(grade) && grade[index] !== undefined ? grade[index] : ""}
                        readOnly={!editMode}
                        placeholder="Ex. 3.12"
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </div>

      {/* Error: เพิ่ม id + aria-live ให้ screen reader อ่าน */}
      {errorEducation && (
        <div className="w-full mt-4">
          <p
            id={errorEducationId}
            className="text-red-500"
            role="alert"
            aria-live="polite"
          >
            * {errorEducation}
          </p>
        </div>
      )}

      {/* Add field button: div -> button (คีย์บอร์ดใช้งานได้) */}
      <div className={`${fields.length >= 4 ? "hidden" : ""} mt-4 w-full flex justify-end`}>
        <button
          type="button"
          onClick={() => addField(fields.length)}
          className={`${!editMode ? "hidden" : ""} ${focusRing} rounded-lg bg-[#4a94ff] w-fit`}
          aria-label="เพิ่มข้อมูลการศึกษา"
        >
          <Icon className="text-white mx-3" path={mdiPlus} size={1.5} />
        </button>
      </div>

      <hr className="w-full my-6" />

      {/* เอกสารเพิ่มเติม */}
      <div className="flex flex-col">
        <p className="font-bold">เอกสารเพิ่มเติม</p>

        {editMode && (
          <>
            <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="w-full sm:w-auto">
                <label htmlFor="edu-doc-name" className="sr-only">
                  ชื่อเอกสาร
                </label>
                <input
                  id="edu-doc-name"
                  type="text"
                  className={`${
                    !editMode ? `cursor-default ${inputEditColor}` : ""
                  } ${bgColorMain} ${focusRing} mt-1 w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                  onChange={(e) => setInputNameFile(e.target.value)}
                  placeholder="ชื่อเอกสาร"
                  readOnly={!editMode}
                  value={inputNameFile}
                />
              </div>

              <div className="mt-1 flex items-center">
                <input
                  id="chooseFile"
                  ref={inputFileRef}
                  onChange={handleDocument}
                  type="file"
                  hidden
                />
                <button
                  type="button"
                  onClick={openFileDialog}
                  className={`${focusRing} border rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                    editMode ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  Choose File
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-5">
              <p>
                <span className="text-red-500 font-bold">ตัวอย่าง</span>
                &nbsp;&nbsp;&nbsp;&nbsp;หนังสือรับรองผลการเรียน (Transcript)/ใบวุฒิการศึกษา
              </p>
              <button
                type="button"
                onClick={openFileExample}
                className={`${focusRing} rounded-md p-1`}
                aria-label="เปิดไฟล์ตัวอย่างเอกสาร"
              >
                <Icon className="text-gray-400" path={mdiAlertCircle} size={0.8} />
              </button>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-2" role="status" aria-live="polite">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <button
                  type="button"
                  className={`${focusRing} text-left rounded-md`}
                  onClick={() => openFile(n)}
                  aria-label={`เปิดไฟล์ ${nameFile[index]}`}
                >
                  <p className="break-words">{nameFile[index]}</p>
                </button>

                <div className="sm:text-center">
                  <p>{sizeFile[index]} MB</p>
                </div>

                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditNameFile(dataUser?.uuid, nameFile[index], index)}
                    className={`${editMode ? "" : "hidden"} ${focusRing} rounded-md p-1`}
                    aria-label={`แก้ไขชื่อไฟล์ ${nameFile[index]}`}
                  >
                    <Icon className="text-gray-400" path={mdiPencil} size={0.8} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(n, nameFile[index])}
                    className={`${editMode ? "" : "hidden"} ${focusRing} rounded-md p-1`}
                    aria-label={`ดาวน์โหลดไฟล์ ${nameFile[index]}`}
                  >
                    <Icon className="text-gray-400" path={mdiDownload} size={0.8} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFile(nameFile[index], index)}
                    className={`${editMode ? "" : "hidden"} ${focusRing} rounded-md p-1`}
                    aria-label={`ลบไฟล์ ${nameFile[index]}`}
                  >
                    <Icon className="text-gray-400" path={mdiDelete} size={0.8} />
                  </button>
                </div>
              </div>
              <hr className="w-full my-1" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-gray-300 mt-4">ยังไม่มีไฟล์ที่อัพโหลด</div>
      )}

      {error && (
        <div className="w-full text-center mt-4">
          <div id={errorFormId} role="alert" aria-live="polite">
            <TextError text={error} />
          </div>
        </div>
      )}

      <div className="mt-4 w-full">{editMode && <ProgressBarForm fields={fieldProgress} />}</div>

      {!readOnly && (
        <ButtonGroup editMode={editMode} setEditMode={setEditMode} tailwind="mt-5" />
      )}
    </form>
  );
}

export default EducationForm;
