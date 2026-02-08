import { useState } from "react";
import { storage } from "@/app/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function useFileUpload() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file,
    path
  ) => {
    return new Promise((resolve, reject) => {
      const extension = file.name.split(".").pop() || "";
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

      const storageRef = ref(storage, `${path}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setIsUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          const uploaded = {
            name: file.name,
            sizeMB: sizeMB.toString(),
            type: extension,
            url,
          };

          setFiles((prev) => [...prev, uploaded]);
          setUploadProgress(0);
          setIsUploading(false);
          resolve(uploaded);
        }
      );
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetFiles = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  return {
    files,
    uploadFile,
    removeFile,
    resetFiles,
    uploadProgress,
    isUploading,
  };
}