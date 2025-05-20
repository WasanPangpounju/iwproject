// utils/firebaseDownload.js
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { saveAs } from "file-saver";

export const downloadFileFromFirebase = async (filePath, fileName) => {
  const storage = getStorage();
  const fileRef = ref(storage, filePath);

  try {
    const downloadURL = await getDownloadURL(fileRef);
    const response = await fetch(downloadURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
    throw error;
  }
};