"use client";

import React, { useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import Resume from "@/app/components/Resume/resume";
import InputLabelForm from "../Form/InputLabelForm";
import UploadFile from "../Form/UploadFile";
import TextError from "../TextError";
import Swal from "sweetalert2";

//store
import { useResumeStore } from "@/stores/useResumeStore";

//toast
import { toast } from "react-toastify";

//icon
import Icon from "@mdi/react";
import { mdiDelete, mdiDownload } from "@mdi/js";

//utils
import { downloadFileFromFirebase } from "@/utils/firebaseDownload";

function ResumeComponent({
  dataUser,
  dataEducations,
  dataSkills,
  dataHistoryWork,
  resumeFiles,
}) {
  //Theme
  const { bgColorNavbar, bgColorWhite, inputTextColor, inputGrayColor } =
    useTheme();

  //open resume check
  const [statusResume, setStatusResume] = useState(0);

  //store
  const {
    uploadResumeFile,
    deleteResumeFile,
    fetchResumeFiles, // ถ้าคุณต้องการ refresh list
  } = useResumeStore();

  //file
  const [urlFile, setUrlFile] = useState("");
  const [nameFile, setNameFiles] = useState("");
  const [sizeFile, setSizeFiles] = useState("");
  const [typeFile, setTypeFiles] = useState("");

  const handleSaveFile = async () => {
    if (!urlFile || !nameFile || !sizeFile || !typeFile) {
      alert("กรุณากรอกข้อมูลไฟล์ให้ครบถ้วนก่อนบันทึก");
      return;
    }

    const fileData = {
      fileUrl: urlFile,
      fileName: nameFile,
      fileSize: sizeFile,
      fileType: typeFile,
    };

    const result = await uploadResumeFile({
      uuid: dataUser?.uuid,
      file: fileData,
    });

    if (result.ok) {
      // ดึงรายการไฟล์ใหม่มาแสดง
      await fetchResumeFiles(dataUser?.uuid);

      // รีเซ็ต state
      setUrlFile("");
      setNameFiles("");
      setSizeFiles("");
      setTypeFiles("");

      toast.success("บันทึกไฟล์เรียบร้อยแล้ว");
    } else {
      toast.error("เกิดข้อผิดพลาดในการบันทึกไฟล์");
    }
  };

  //download file
  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      await downloadFileFromFirebase(fileUrl, fileName);
    } catch (err) {
      toast.error("ดาวน์โหลดไม่สำเร็จ");
    }
  };

  //deleted file
  const handleDeleteFile = (uuid, fileUrl) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบไฟล์นี้ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#F97201",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteResumeFile({ uuid, fileUrl });

        if (response.ok) {
          toast.success("ลบไฟล์สำเร็จแล้ว");
          await fetchResumeFiles(uuid); // อัปเดตรายการไฟล์ใหม่
        } else {
          toast.error("เกิดข้อผิดพลาดในการลบไฟล์");
        }
      }
    });
  };
  const clearFile = () => {
    setUrlFile("");
    setNameFiles("");
    setSizeFiles("");
    setTypeFiles("");
  };
  return (
    <>
      {statusResume > 0 ? (
        <Resume
          type={statusResume}
          id={dataUser?.uuid}
          setStatusResume={setStatusResume}
          dataUser={dataUser}
          dataEducations={dataEducations}
          dataSkills={dataSkills}
          dataHistoryWork={dataHistoryWork}
        />
      ) : (
        <>
          <p>สร้างเรซูเม่</p>
          <div className="mt-5 grid grid-cols-3 gap-5 text-center">
            <button
              className={`py-5 rounded-lg max-w-96 ${bgColorNavbar} ${bgColorWhite}`}
              onClick={() => setStatusResume(1)}
            >
              <p>รูปแบบที่ 1</p>
            </button>
            <button
              className={`py-5 rounded-lg max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#f48e07]" : ""
              } ${bgColorWhite}`}
              onClick={() => setStatusResume(2)}
            >
              <p>รูปแบบที่ 2</p>
            </button>
            <button
              className={`py-5  rounded-lg max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#feb61c]" : ""
              } ${bgColorWhite}`}
              onClick={() => setStatusResume(3)}
            >
              <p>รูปแบบที่ 3</p>
            </button>
          </div>
          <div className="mt-10">
            <p className="font-bold">อัพโหลดไฟล์ resume/cv เพิ่มเติม</p>
            <div className="mt-3 flex gap-5 items-end">
              <InputLabelForm
                value={nameFile}
                setValue={setNameFiles}
                label={"ชื่อไฟล์"}
                editMode={true}
                placeholder={"ชื่อไฟล์ที่ต้องการ"}
                tailwind={"w-44"}
                isRequire
                disabled={urlFile}
              />

              <UploadFile
                editMode={true}
                uuid={dataUser?.uuid}
                setValue={(url) => setUrlFile(url)}
                setSizeFile={(size) => setSizeFiles(size)}
                setTypeFile={(type) => setTypeFiles(type)}
                isDisabled={!nameFile || nameFile && urlFile}
              />
            </div>
            <div className="mt-3">
              {!nameFile && <TextError text={"กรอกชื่อไฟล์ก่อน upload."} />}
            </div>
            {urlFile && (
              <div className="mt-5 flex items-center">
                <div className=" me-14">
                  {nameFile}.{typeFile}/{sizeFile}
                </div>
                <div className="flex gap-3">
                  <div
                    onClick={handleSaveFile}
                    className={` ${inputTextColor} ${inputGrayColor} py-1 px-4 cursor-pointer rounded-lg`}
                  >
                    บันทึก
                  </div>
                  <div
                    onClick={clearFile}
                    className={` ${bgColorNavbar} ${bgColorWhite} py-1 px-4 cursor-pointer rounded-lg`}
                  >
                    ยกเลิก
                  </div>
                </div>
              </div>
            )}
            {resumeFiles?.length > 0 && (
              <div className="mt-5 border rounded-lg p-5 flex flex-col gap-1">
                {resumeFiles?.map((item, index) => (
                  <div
                    key={index}
                    className="border py-2 px-4 rounded-lg flex justify-between"
                  >
                    <div className="flex gap-2">
                      <p>
                        {item.fileName}.{item.fileType}
                      </p>
                      <p>/{item.fileSize}</p>
                    </div>
                    <div className="flex items-end">
                      <Icon
                        onClick={() =>
                          handleDownloadFile(item.fileUrl, item.fileName)
                        }
                        className={`cursor-pointer text-gray-40 mx-1`}
                        path={mdiDownload}
                        size={0.8}
                      />
                      <Icon
                        onClick={() =>
                          handleDeleteFile(dataUser?.uuid, item.fileUrl)
                        }
                        className={`cursor-pointer text-gray-40 mx-1`}
                        path={mdiDelete}
                        size={0.8}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ResumeComponent;
