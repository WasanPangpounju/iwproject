import { useEffect } from "react";
import { storage } from "@/app/firebaseConfig";

//hooks
import { useTheme } from "@/app/ThemeContext";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";

function UploadFile({
  editMode,
  uuid,
  setValue,
  setNameFile,
  setSizeFile,
  setTypeFile,
  isDisabled=false,
}) {
  const { bgColorMain, inputEditColor } = useTheme();

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
        onChange={(e) => uploadFile(e.target.files[0], uuid)}
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
    </div>
  );
}

export default UploadFile;
