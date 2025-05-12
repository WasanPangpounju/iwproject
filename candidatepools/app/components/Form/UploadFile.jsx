import { useEffect } from "react";
import { storage } from "@/app/firebaseConfig";

//hooks
import { useTheme } from "@/app/ThemeContext";
import { useFirebaseUpload } from "@/hooks/useFirebaseUpload";

function UploadFile({ setValue, editMode, uuid }) {
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
    if (downloadURL) {
      setValue(downloadURL);
    }
  }, [downloadURL]);

  return (
    <div
      className={`${
        !editMode ? "hidden" : ""
      } ${bgColorMain} mt-1 flex items-center`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => uploadFile(e.target.files[0], uuid)}
      />

      <div
        onClick={openFileDialog}
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
