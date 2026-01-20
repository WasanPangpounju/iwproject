"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { saveAs } from "file-saver";

//stores
import { useSkillStore } from "@/stores/useSkillStore";

import ButtonGroup from "./ButtonGroup/ButtonGroup";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";
import { toast } from "react-toastify";

function SkillForm({ dataSkills, id, handleStep, readOnly = false }) {
  const [error, setError] = useState("");

  //store
  const { updateSkillById } = useSkillStore();

  //Theme
  const {
    bgColor,
    bgColorMain,
    bgColorMain2,
    inputEditColor,
  } = useTheme();

  //Mode
  const [editMode, setEditMode] = useState(false);

  // a11y helpers
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

  const formErrorId = "skill-form-error";
  const skillFieldErrorId = "skill-form-skill-field-error";
  const trainFieldErrorId = "skill-form-train-field-error";

  const fieldId = (section, index, name) => `${section}-${index}-${name}`;

  const formDescribedBy = useMemo(() => {
    const ids = [];
    if (error) ids.push(formErrorId);
    return ids.length ? ids.join(" ") : undefined;
  }, [error]);

  //add data
  const [skillType, setSkillType] = useState([]);
  const [skillName, setSkillName] = useState([]);
  const [skillDetail, setSkillDetail] = useState([]);

  const handleSkillType = (val, index) => {
    const newTemp = val;
    setSkillType((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
      while (updatedTemp.length <= index) updatedTemp.push("");
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleSkillName = (val, index) => {
    const newTemp = val;
    setSkillName((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
      while (updatedTemp.length <= index) updatedTemp.push("");
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleSkillDetail = (val, index) => {
    const newTemp = val;
    setSkillDetail((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
      while (updatedTemp.length <= index) updatedTemp.push("");
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  //config field
  const [skills, setSkills] = useState([{}]);
  const [errorFieldSkill, setErrorFieldSkill] = useState("");

  const handleAddSkill = () => {
    if (
      !skillType[skills.length - 1] ||
      !skillName[skills.length - 1] ||
      !skillDetail[skills.length - 1]
    ) {
      setErrorFieldSkill("กรุณากรอกข้อมูลทักษะให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }
    if (skills.length >= 5) {
      setErrorFieldSkill("");
      return;
    }
    setErrorFieldSkill("");
    setSkills([...skills, {}]);
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
    { fileName: "", fileType: "", fileUrl: "", fileSize: "" },
  ]);

  const handleTrainName = (val, index) => {
    const newTemp = val;
    setTrainName((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
      while (updatedTemp.length <= index) updatedTemp.push("");
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleTrainDetail = (val, index) => {
    const newTemp = val;
    setTrainDetail((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];
      while (updatedTemp.length <= index) updatedTemp.push("");
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  //config field
  const [trains, setTrains] = useState([{}]);
  const [errorFieldTrain, setErrorFieldTrain] = useState("");

  const handleAddTrain = () => {
    if (!trainName[trains.length - 1] || !trainDetail[trains.length - 1]) {
      setErrorFieldTrain("กรุณากรอกข้อมูลการอบรมให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }
    if (trains.length >= 5) {
      setErrorFieldTrain("");
      return;
    }
    setErrorFieldTrain("");
    setTrains([...trains, {}]);
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
        setTrainName((prev) => prev.filter((_, i) => i !== temp));
        setTrainDetail((prev) => prev.filter((_, i) => i !== temp));
        setTrainFile((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //upload file
  const trainFileInputRef = useRef(null);
  const [trainUploadProgress, setTrainUploadProgress] = useState(0);

  const openFileDialogTrain = () => {
    if (trainFileInputRef.current) trainFileInputRef.current.click();
  };

  const handleTrainDocument = (event, index) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop();
      if (fileExtension !== "pdf" && fileExtension !== "docx" && fileExtension !== "doc") {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
        return;
      }

      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(storage, `users/documents/trainHistory/${id}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError("");
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setTrainUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              const newTrainFile = {
                fileName,
                fileType: fileExtension,
                fileUrl: url,
                fileSize: fileSizeMB,
              };

              setTrainFile((prevTrainFiles) => {
                const updatedTrainFiles = [...prevTrainFiles];
                updatedTrainFiles[index] = newTrainFile;
                return updatedTrainFiles;
              });

              setTrainUploadProgress(0);
              if (trainFileInputRef.current) trainFileInputRef.current.value = "";
            })
            .catch((error) => console.error("Error getting download URL:", error));
        }
      );
    }
  };

  //function submit
  async function handleSubmit(e, fieldSkills, fieldTrains) {
    e.preventDefault();

    const mergedSkillType = skillType;
    const mergedSkillName = skillName;
    const mergedSkillDetail = skillDetail;

    const mergedTrainName = trainName;
    const mergedTrainDetail = trainDetail;
    const mergedTrainFile = trainFile;

    fieldSkills -= 1;
    fieldTrains -= 1;

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

    const hasAnyTrainField = mergedTrainName[fieldTrains] || mergedTrainDetail[fieldTrains];
    const isTrainFieldComplete = mergedTrainName[fieldTrains] && mergedTrainDetail[fieldTrains];

    if (hasAnyTrainField && !isTrainFieldComplete) {
      setError("กรุณาระบุข้อมูล การอบรม ให้ครบทุกช่อง");
      return;
    }

    const hasAnyField = hasAnySkillField || hasAnyTrainField;
    if (!hasAnyField) {
      setError("ไม่มีข้อมูลที่บันทึก");
      return;
    }

    setError("");

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
      const response = await updateSkillById(data);

      if (response.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setEditMode(false);
        if (handleStep) handleStep();
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

    setSkillType(dataSkills.skills?.map((skill) => skill.type) || []);
    setSkillName(dataSkills.skills?.map((skill) => skill.name) || []);
    setSkillDetail(dataSkills.skills?.map((skill) => skill.detail) || []);

    setTrainName(dataSkills.trains?.map((train) => train.name) || []);
    setTrainDetail(dataSkills.trains?.map((train) => train.detail) || []);
    setTrainFile(dataSkills.trains?.flatMap((train) => train.files) || []);

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
      const downloadURL = await getDownloadURL(fileRef);
      const response = await fetch(downloadURL);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
    }
  };

  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

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
      updatedTrainFiles[index] = undefined;

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
      aria-describedby={formDescribedBy}
    >
      {/* ความสามารถ */}
      <div>
        <p className="mb-2">ความสามารถ</p>
        <hr />

        {skills.map((skill, index) => {
          const typeId = fieldId("skill", index, "type");
          const nameId = fieldId("skill", index, "name");
          const detailId = fieldId("skill", index, "detail");

          return (
            <div key={index}>
              {index > 0 && editMode && (
                <div className="flex flex-col justify-end w-full mt-5">
                  <button
                    type="button"
                    className={`rounded-lg w-fit ${focusRing}`}
                    onClick={() => handleRemoveSkill(index)}
                    aria-label="ลบทักษะรายการนี้"
                  >
                    <Icon className="text-red-500" path={mdiCloseCircle} size={1} aria-hidden="true" />
                  </button>
                </div>
              )}

              {index > 0 && !editMode && <hr className="mt-5" />}

              <div className="mt-5 flex gap-5 flex-wrap">
                {/* ด้าน */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={typeId}>
                    ด้าน{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>

                  <div className="relative w-full sm:w-fit mt-1">
                    <select
                      id={typeId}
                      className={`${
                        !editMode ? "editModeTrue cursor-default" : "cursor-pointer"
                      } ${bgColorMain} ${focusRing} whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) => handleSkillType(e.target.value, index)}
                      value={skillType[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">-</option>
                      <option value="ด้านคอมพิวเตอร์">ด้านคอมพิวเตอร์</option>
                      <option value="ด้านการสื่อสาร">ด้านการสื่อสาร</option>
                      <option value="ด้านการออกแบบ/กราฟฟิก">ด้านการออกแบบ/กราฟิก</option>
                      <option value="ด้านการบริการ">ด้านการบริการ</option>
                      <option value="ด้านบัญชี/การเงิน">ด้านบัญชี/การเงิน</option>
                      <option value="ด้านการสอน">ด้านการสอน</option>
                      <option value="ด้านการขาย">ด้านการขาย</option>
                      <option value="ด้านการจัดการข้อมูล">ด้านการจัดการข้อมูล</option>
                      <option value="ด้านการเขียน">ด้านการเขียน</option>
                      <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
                    </select>

                    <Icon
                      className={`${!editMode ? "hidden" : ""} pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* ทักษะ */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={nameId}>
                    ทักษะ{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    className={`${
                      !editMode ? "editModeTrue cursor-default" : ""
                    } ${bgColorMain} ${focusRing} mt-1 w-full sm:w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="รายละเอียดเพิ่มเติม"
                    defaultValue={skillName[index] || ""}
                    onBlur={(e) => handleSkillName(e.target.value, index)}
                  />
                </div>

                {/* อธิบายรายละเอียด */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={detailId}>
                    อธิบายรายละเอียด{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={detailId}
                    type="text"
                    className={`${
                      !editMode ? "editModeTrue cursor-default" : ""
                    } ${bgColorMain} ${focusRing} mt-1 w-full sm:w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="รายละเอียดเพิ่มเติม"
                    defaultValue={skillDetail[index] || ""}
                    onBlur={(e) => handleSkillDetail(e.target.value, index)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {errorFieldSkill && (
          <div
            id={skillFieldErrorId}
            className="mt-3 text-red-500"
            role="alert"
            aria-live="polite"
          >
            *{errorFieldSkill}
          </div>
        )}

        {skills.length < 5 && editMode && (
          <div className="flex flex-col justify-end w-full mt-5">
            <button
              type="button"
              className={`rounded-lg bg-[#4a94ff] w-fit ${focusRing}`}
              onClick={handleAddSkill}
              aria-label="เพิ่มความสามารถ"
            >
              <Icon className="text-white mx-3" path={mdiPlus} size={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* =========================
          การอบรม (ปิดไว้ชั่วคราว)
          เรื่อง / รายละเอียด / เอกสารประกอบ
          ========================= */}
      {/*
      <div>
        <p className="mb-2">การอบรม</p>
        <hr />

        {trains.map((train, index) => {
          const tNameId = fieldId("train", index, "name");
          const tDetailId = fieldId("train", index, "detail");
          const chooseTrainFileId = fieldId("train", index, "file");

          return (
            <div key={index}>
              {index > 0 && editMode && (
                <div className="flex flex-col justify-end w-full mt-5">
                  <button
                    type="button"
                    className={`rounded-lg w-fit ${focusRing}`}
                    onClick={() => handleRemoveTrain(index)}
                    aria-label="ลบการอบรมรายการนี้"
                  >
                    <Icon className="text-red-500" path={mdiCloseCircle} size={1} aria-hidden="true" />
                  </button>
                </div>
              )}

              {index > 0 && !editMode && <hr className="mt-5" />}

              <div className="mt-5 flex gap-5 flex-wrap">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={tNameId}>
                    เรื่อง{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={tNameId}
                    type="text"
                    className={`${!editMode ? "editModeTrue cursor-default" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-56 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="ระบุชื่อเรื่องการอบรม"
                    onBlur={(e) => handleTrainName(e.target.value, index)}
                    defaultValue={trainName[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={tDetailId}>
                    รายละเอียด{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={tDetailId}
                    type="text"
                    className={`${!editMode ? "editModeTrue cursor-default" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="รายละเอียดเพิ่มเติม"
                    onBlur={(e) => handleTrainDetail(e.target.value, index)}
                    defaultValue={trainDetail[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                <div className={`${bgColorMain} flex flex-col gap-1 w-full sm:w-auto`}>
                  {trainFile[index]?.fileUrl || editMode ? (
                    <label htmlFor={chooseTrainFileId}>เอกสารประกอบ / ใบประกาศ</label>
                  ) : null}

                  {trainFile[index] && trainFile[index]?.fileUrl !== "" ? (
                    <div className="mt-1 w-full sm:w-fit py-2 flex flex-wrap gap-4 sm:gap-8 items-center">
                      <button
                        type="button"
                        className={`underline text-left ${focusRing}`}
                        onClick={() => openFile(trainFile[index]?.fileUrl)}
                        aria-label={`เปิดไฟล์ ${trainFile[index]?.fileName}.${trainFile[index]?.fileType}`}
                      >
                        <p>
                          {trainFile[index]?.fileName}.{trainFile[index]?.fileType}
                        </p>
                      </button>

                      <p className="text-gray-500">{trainFile[index]?.fileSize} MB</p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadFile(
                              trainFile[index]?.fileUrl,
                              trainFile[index]?.fileName
                            )
                          }
                          className={focusRing}
                          aria-label="ดาวน์โหลดไฟล์"
                        >
                          <Icon className="text-black" path={mdiDownload} size={1} aria-hidden="true" />
                        </button>

                        {editMode && (
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(trainFile[index]?.fileName, index)}
                            className={focusRing}
                            aria-label="ลบไฟล์"
                          >
                            <Icon className="text-black" path={mdiDelete} size={1} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    editMode && (
                      <div className="mt-1 w-full sm:w-fit">
                        <input
                          id={chooseTrainFileId}
                          type="file"
                          ref={trainFileInputRef}
                          onChange={(e) => handleTrainDocument(e, index)}
                          hidden
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                        <button
                          type="button"
                          onClick={openFileDialogTrain}
                          className={`border rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                            editMode ? "cursor-pointer" : "cursor-not-allowed"
                          } ${focusRing}`}
                        >
                          Choose File
                        </button>

                        {trainUploadProgress > 0 && (
                          <p className="mt-2" aria-live="polite">
                            กำลังอัปโหลด: {trainUploadProgress.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {errorFieldTrain && (
          <div
            id={trainFieldErrorId}
            className="mt-3 text-red-500"
            role="alert"
            aria-live="polite"
          >
            *{errorFieldTrain}
          </div>
        )}

        {trains.length < 5 && editMode && (
          <div className="flex flex-col justify-end w-full mt-5">
            <button
              type="button"
              className={`rounded-lg bg-[#4a94ff] w-fit ${focusRing}`}
              onClick={handleAddTrain}
              aria-label="เพิ่มการอบรม"
            >
              <Icon className="text-white mx-3" path={mdiPlus} size={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      */}


      {editMode && <ProgressBarForm fields={fieldProgress} />}

      <div>
        {error && (
          <div className="w-full text-center">
            <p id={formErrorId} className="text-red-500" role="alert" aria-live="polite">
              * {error}
            </p>
          </div>
        )}

        {!readOnly && (
          <ButtonGroup editMode={editMode} setEditMode={setEditMode} tailwind="mt-5" />
        )}
      </div>
    </form>
  );
}

export default SkillForm;
