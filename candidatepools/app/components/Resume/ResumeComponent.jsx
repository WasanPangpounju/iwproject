"use client";

import React, { useState, useMemo } from "react";
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

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

  //open resume check
  const [statusResume, setStatusResume] = useState(0);

  //store
  const { uploadResumeFile, deleteResumeFile, fetchResumeFiles } = useResumeStore();

  //file
  const [urlFile, setUrlFile] = useState("");
  const [nameFile, setNameFiles] = useState("");
  const [sizeFile, setSizeFiles] = useState("");
  const [typeFile, setTypeFiles] = useState("");

  const canSave = useMemo(() => {
    return Boolean(urlFile && nameFile && sizeFile && typeFile);
  }, [urlFile, nameFile, sizeFile, typeFile]);

  const handleSaveFile = async () => {
    if (!canSave) {
      toast.error("กรุณากรอกข้อมูลไฟล์ให้ครบถ้วนก่อนบันทึก");
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
      await fetchResumeFiles(dataUser?.uuid);
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
          await fetchResumeFiles(uuid);
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

  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

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
          <h2 className="font-medium">สร้างเรซูเม่</h2>

          {/* ✅ responsive: มือถือเป็น 1 คอลัมน์, จอใหญ่เป็น 3 */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 text-center">
            <button
              type="button"
              className={`py-5 rounded-lg w-full sm:max-w-96 ${bgColorNavbar} ${bgColorWhite} ${focusRing}`}
              onClick={() => setStatusResume(1)}
              aria-label="เลือกเรซูเม่รูปแบบที่ 1"
            >
              <p>รูปแบบที่ 1</p>
            </button>

            <button
              type="button"
              className={`py-5 rounded-lg w-full sm:max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#f48e07]" : ""
              } ${bgColorWhite} ${focusRing}`}
              onClick={() => setStatusResume(2)}
              aria-label="เลือกเรซูเม่รูปแบบที่ 2"
            >
              <p>รูปแบบที่ 2</p>
            </button>

            <button
              type="button"
              className={`py-5 rounded-lg w-full sm:max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#feb61c]" : ""
              } ${bgColorWhite} ${focusRing}`}
              onClick={() => setStatusResume(3)}
              aria-label="เลือกเรซูเม่รูปแบบที่ 3"
            >
              <p>รูปแบบที่ 3</p>
            </button>
          </div>

          <div className="mt-10">
            <p className="font-bold">อัพโหลดไฟล์ resume/cv เพิ่มเติม</p>

            {/* ✅ responsive: มือถือ stack, จอใหญ่เรียงแถว */}
            <div className="mt-3 flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-end">
              <div className="w-full sm:w-auto">
                <InputLabelForm
                  value={nameFile}
                  setValue={setNameFiles}
                  label={"ชื่อไฟล์"}
                  editMode={true}
                  placeholder={"ชื่อไฟล์ที่ต้องการ"}
                  tailwind={"w-full sm:w-44"}
                  isRequire
                  disabled={urlFile}
                />
              </div>

              <div className="w-full sm:w-auto">
                <UploadFile
                  editMode={true}
                  uuid={dataUser?.uuid}
                  setValue={(url) => setUrlFile(url)}
                  setSizeFile={(size) => setSizeFiles(size)}
                  setTypeFile={(type) => setTypeFiles(type)}
                  isDisabled={!nameFile || (nameFile && urlFile)}
                  maxSizeKB={2048}
                  acceptTypes={["application/pdf"]}
                />
              </div>
            </div>

            <div className="mt-3" aria-live="polite">
              {!nameFile && (
                <TextError text={"กรอกชื่อไฟล์ก่อน Upload (PDF) ขนาดไม่เกิน 2 MB."} />
              )}
            </div>

            {urlFile && (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="break-all sm:me-14" aria-live="polite">
                  {nameFile}.{typeFile}/{sizeFile}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveFile}
                    disabled={!canSave}
                    className={`${inputTextColor} ${inputGrayColor} py-1 px-4 rounded-lg ${focusRing}
                      disabled:opacity-60 disabled:cursor-not-allowed`}
                    aria-label="บันทึกไฟล์เรซูเม่"
                  >
                    บันทึก
                  </button>

                  <button
                    type="button"
                    onClick={clearFile}
                    className={`${bgColorNavbar} ${bgColorWhite} py-1 px-4 rounded-lg ${focusRing}`}
                    aria-label="ยกเลิกการอัปโหลด"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}

            {resumeFiles?.length > 0 && (
              <div className="mt-5 border rounded-lg p-4 sm:p-5 flex flex-col gap-2">
                {resumeFiles?.map((item, index) => (
                  <div
                    key={index}
                    className="border py-2 px-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => openFile(item.fileUrl)}
                      className={`flex flex-wrap gap-2 text-left underline ${focusRing}`}
                      aria-label={`เปิดไฟล์ ${item.fileName}.${item.fileType}`}
                    >
                      <span>
                        {item.fileName}.{item.fileType}
                      </span>
                      <span>/ {item.fileSize}</span>
                    </button>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(item.fileUrl, item.fileName)}
                        className={focusRing}
                        aria-label={`ดาวน์โหลดไฟล์ ${item.fileName}.${item.fileType}`}
                      >
                        <Icon
                          className="text-gray-400"
                          path={mdiDownload}
                          size={0.8}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(dataUser?.uuid, item.fileUrl)}
                        className={focusRing}
                        aria-label={`ลบไฟล์ ${item.fileName}.${item.fileType}`}
                      >
                        <Icon
                          className="text-gray-400"
                          path={mdiDelete}
                          size={0.8}
                          aria-hidden="true"
                        />
                      </button>
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
