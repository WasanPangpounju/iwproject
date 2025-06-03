import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useAppStore from "@/stores/useAppStore";
/**
 * Generic Firebase upload hook
 * @param {object} storage - Firebase storage object
 * @param {string} basePath - Path prefix for upload (e.g., 'users/profile')
 * @returns {object} - Upload state and actions
 */
export function useFirebaseUpload(storage, basePath = "") {
  const inputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { setLoading } = useAppStore();

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const uploadFile = (file, customSubPath = "") => {
    if (!file) return;
    const fullPath = `${basePath}/${customSubPath}/${file.name}`.replace(
      /\/+/g,
      "/"
    );
    const fileRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    setIsUploading(true);
    setError(null);
    setLoading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (err) => {
        setError(err);
        setIsUploading(false);
        setLoading(false);
        console.error("Upload failed:", err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setDownloadURL(url);
            setUploadProgress(100);
          })
          .catch((err) => {
            setError(err);
            console.error("Error getting download URL:", err);
          })
          .finally(() => {
            setIsUploading(false);
            setLoading(false);
          });
      }
    );
  };

  return {
    inputRef,
    uploadProgress,
    downloadURL,
    isUploading,
    error,
    openFileDialog,
    uploadFile,
  };
}
