import { useEffect, useState } from "react";
import { storage } from "@/app/firebaseConfig";

import ImageCropModal from "@/app/components/Model/ImageCropModal";

//hooks
import { useTheme } from "@/app/ThemeContext";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";

import { toast } from "react-toastify";

function UploadFile({
  editMode,
  uuid,
  setValue,
  setNameFile,
  setSizeFile,
  setTypeFile,
  isDisabled = false,
  maxSizeKB = 1000,
  acceptTypes = [], // เช่น ['image/jpeg', 'image/png']
}) {
  const { bgColorMain, inputEditColor } = useTheme();
  const [cropImageSrc, setCropImageSrc] = useState(null);

  const {
    inputRef,
    uploadProgress,
    downloadURL,
    isUploading,
    openFileDialog,
    uploadFile,
  } = useFirebaseUpload(storage, "uploads");

  useEffect(() => {
    if (downloadURL && inputRef.current?.files?.[0]) {
      const file = inputRef.current.files[0];

      const readableSize = (bytes) => {
        const kb = bytes / 1024;
        return kb > 1024
          ? (kb / 1024).toFixed(2) + " MB"
          : kb.toFixed(2) + " KB";
      };

      const getReadableType = (mime) => {
        if (mime === "application/pdf") return "PDF";
        if (
          mime === "application/msword" ||
          mime ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
          return "Word";
        if (
          mime ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
          return "Excel";
        if (mime.startsWith("image/")) return "Image";
        return mime;
      };

      setValue(downloadURL);
      setNameFile?.(file.name);
      setSizeFile?.(readableSize(file.size));
      setTypeFile?.(getReadableType(file.type));
    }
  }, [downloadURL]);

  const handleFileChange = (file) => {
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      toast.error(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSizeKB} KB`);
      return;
    }

    if (acceptTypes.length > 0 && !acceptTypes.includes(file.type)) {
      toast.error("ประเภทไฟล์ไม่ถูกต้อง");
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      uploadFile(file, uuid);
    }
  };

  return (
    <div
      className={`${
        !editMode ? "hidden" : ""
      } ${bgColorMain} mt-1 flex items-center cursor-pointer`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept={acceptTypes.join(",")} // ให้ browser filter ด้วย
        disabled={isDisabled}
      />

      <div
        onClick={() => {
          if (!isDisabled) openFileDialog();
        }}
        className={`border rounded-lg py-2 px-8 text-center ${inputEditColor}`}
      >
        Choose File
      </div>

      {isUploading && (
        <div className="mx-3">
          <p>{Math.round(uploadProgress)}%</p>
        </div>
      )}
      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCropComplete={async (croppedFile) => {
            setCropImageSrc(null);
            uploadFile(croppedFile, uuid);
          }}
          onClose={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
}

export default UploadFile;
