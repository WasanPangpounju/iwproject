"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/ThemeContext";
import { useSession } from "next-auth/react";
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
} from "firebase/storage"; // Import Firebase Storage
import { storage } from "@/app/firebaseConfig";
import { saveAs } from "file-saver";

//stores
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSystemLogStore } from "@/stores/useSystemLogStore";

import { dataStatus } from "@/assets/dataStatus";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";

import { toast } from "react-toastify";
import { ACTION_ACTIVITY, TARGET_MODEL } from "@/const/enum";

function HistoryWorkForm({
  id,
  dataHistoryWork,
  handleStep,
  readOnly = false,
}) {
  //session
  const { data: session } = useSession();

  //store
  const { updateHistoryWorkById } = useHistoryWorkStore();
  const { addLog } = useSystemLogStore();
  const [error, setError] = useState("");

  //Theme
  const { fontSize, bgColor, bgColorMain, bgColorMain2, inputEditColor } =
    useTheme();

  //add data
  const [projectName, setProjectName] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const [projectFile, setProjectFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);

  const handleProjectName = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setProjectName((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // เพิ่มค่าว่างเพื่อคงขนาดอาร์เรย์
      }

      // อัปเดตค่าใหม่ในตำแหน่งที่กำหนด
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleProjectDetail = (e, index) => {
    const newTemp = e; // ค่าที่ได้รับจาก input
    setProjectDetail((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : []; // ตรวจสอบว่า prevTemp เป็น array หรือไม่

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push(""); // เพิ่มค่าว่างเพื่อคงขนาดอาร์เรย์
      }

      // อัปเดตค่าใหม่ในตำแหน่งที่กำหนด
      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  //config field
  const [projects, setProjects] = useState([{}]);
  const [errorField, setErrorField] = useState("");

  const handleAddProject = () => {
    if (
      !projectName[projects.length - 1] ||
      !projectDetail[projects.length - 1]
    ) {
      setErrorField("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }
    if (projects.length >= 5) {
      setErrorField("");
      return;
    }
    setErrorField("");
    setProjects([...projects, {}]);
  };

  const handleRemoveProject = (index) => {
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
        const newProjects = [...projects];
        newProjects.splice(index, 1);
        setProjects(newProjects);

        const temp = index;

        setErrorField("");
        const newTempProjectName = projectName.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
        setProjectName(newTempProjectName); // ตั้งค่าใหม่ให้ หลังจากลบ

        const newTempProjectDetail = projectDetail.filter((_, i) => i !== temp); // ลบที่มี index ตรงกัน
        setProjectDetail(newTempProjectDetail); // ตั้งค่าใหม่ให้ หลังจากลบ

        const newTempProjectFile = projectFile.filter((_, i) => i !== index);
        setProjectFile(newTempProjectFile);
      }
    });
  };

  //deleteFile
  async function handleDeleteFileProject(name, index) {
    const result = await Swal.fire({
      title: "ลบข้อมูล",
      text: `คุณต้องการลบไฟล์ ${name}?`,
      icon: "warning",
      confirmButtonText: "ใช่",
      confirmButtonColor: "#f27474",
      showCancelButton: true,
      cancelButtonText: "ไม่",
    });

    const mergedProjectFile = projectFile;

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedProjectFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setProjectFile(updatedTrainFiles);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  //upload file
  //projects
  const projectFileInputRef = useRef(null);
  const [projectUploadProgress, setProjectUploadProgress] = useState(0);

  // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
  const openFileDialog = () => {
    if (projectFileInputRef.current) {
      projectFileInputRef.current.click();
    }
  };

  const handleProfileDocument = (event, index) => {
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (fileExtension !== "pdf" && fileExtension !== "docx") {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");

        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

      // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/workHistory/${id}/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError(""); // รีเซ็ตข้อความข้อผิดพลาด
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProjectUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // เมื่ออัปโหลดเสร็จสิ้น
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ files
              const newProjectFile = {
                fileName: fileName,
                fileType: fileExtension,
                fileUrl: url,
                fileSize: fileSizeMB,
              };

              setProjectFile((prevProjects) => {
                const updatedProjects = [...prevProjects];
                updatedProjects[index] = newProjectFile; // อัปเดตตำแหน่งที่ index
                return updatedProjects;
              });
              // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
              setProjectUploadProgress(0);
              projectFileInputRef.current.value = "";
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    }
  };

  //create year value
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (v, i) => currentYear - i);

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  //set internship
  //add data
  const [dateStartInternship, setDateStartInternship] = useState([]);
  const [dateEndInternship, setDateEndInternship] = useState([]);
  const [dateStartMonthInternship, setDateStartMonthInternship] = useState([]);
  const [dateEndMonthInternship, setDateEndMonthInternship] = useState([]);
  const [placeInternship, setPlaceInternship] = useState([]);
  const [positionInternship, setPositionInternship] = useState([]);
  const [internshipFile, setInternshipFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);

  const handleDateStartInternship = (e, index) => {
    const newTemp = e;
    setDateStartInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateStartMonthInternship = (e, index) => {
    const newTemp = e;
    setDateStartMonthInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateEndMonthInternship = (e, index) => {
    const newTemp = e;
    setDateEndMonthInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateEndInternship = (e, index) => {
    const newTemp = e;
    setDateEndInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handlePlaceInternship = (e, index) => {
    const newTemp = e;
    setPlaceInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handlePositionInternship = (e, index) => {
    const newTemp = e;
    setPositionInternship((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  //config field
  const [internships, setInternships] = useState([{}]);
  const [errorFieldInterships, setErrorFieldInterships] = useState("");
  const handleAddInterships = () => {
    // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล internship ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
    if (
      !dateStartInternship[internships.length - 1] ||
      !dateEndInternship[internships.length - 1] ||
      !dateEndMonthInternship[internships.length - 1] ||
      !dateStartMonthInternship[internships.length - 1] ||
      !placeInternship[internships.length - 1] ||
      !positionInternship[internships.length - 1]
    ) {
      setErrorFieldInterships("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    // จำกัดจำนวน internship ไม่เกิน 5 รายการ
    if (internships.length >= 5) {
      setErrorFieldInterships("");
      return;
    }

    setErrorFieldInterships("");
    setInternships([...internships, {}]); // เพิ่มออบเจกต์ว่างใน internships
  };

  const handleRemoveInternship = (index) => {
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
        const newProjects = [...internships];
        newProjects.splice(index, 1);
        setInternships(newProjects);

        const temp = index;

        setErrorFieldInterships("");
        setDateStartInternship((prev) => prev.filter((_, i) => i !== temp));
        setDateEndInternship((prev) => prev.filter((_, i) => i !== temp));
        setDateStartMonthInternship((prev) =>
          prev.filter((_, i) => i !== temp)
        );
        setDateEndMonthInternship((prev) => prev.filter((_, i) => i !== temp));
        setPlaceInternship((prev) => prev.filter((_, i) => i !== temp));
        setPositionInternship((prev) => prev.filter((_, i) => i !== temp));
        setInternshipFile((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //deleteFile
  async function handleDeleteFileInternship(name, index) {
    const result = await Swal.fire({
      title: "ลบข้อมูล",
      text: `คุณต้องการลบไฟล์ ${name}?`,
      icon: "warning",
      confirmButtonText: "ใช่",
      confirmButtonColor: "#f27474",
      showCancelButton: true,
      cancelButtonText: "ไม่",
    });

    const mergedFile = internshipFile;

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setInternshipFile(updatedTrainFiles);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  //upload file
  //projects
  const internFileInputRef = useRef(null);
  const [internshipFileUploadProgress, setInternshipUploadProgress] =
    useState(0);

  // ฟังก์ชันสำหรับเปิด dialog เลือกไฟล์
  const openFileDialogInternship = () => {
    if (internFileInputRef.current) {
      internFileInputRef.current.click();
    }
  };

  const handleInternshipDocument = (event, index) => {
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (fileExtension !== "pdf" && fileExtension !== "docx") {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");

        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

      // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/internship/${id}/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError(""); // รีเซ็ตข้อความข้อผิดพลาด
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setInternshipUploadProgress(progress); // แสดงความก้าวหน้าการอัปโหลด
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // เมื่ออัปโหลดเสร็จสิ้น
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              // เพิ่ม URL ไฟล์ที่อัปโหลดสำเร็จลงในอาร์เรย์ files
              const newProjectFile = {
                fileName: fileName,
                fileType: fileExtension,
                fileUrl: url,
                fileSize: fileSizeMB,
              };

              setInternshipFile((prevProjects) => {
                const updatedProjects = [...prevProjects];
                updatedProjects[index] = newProjectFile; // อัปเดตตำแหน่งที่ index
                return updatedProjects;
              });
              // รีเซ็ตค่าต่าง ๆ หลังจากอัปโหลดสำเร็จ
              setInternshipUploadProgress(0);
              internFileInputRef.current.value = "";
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    }
  };

  //set work
  const [dateStartWork, setDateStartWork] = useState([]);
  const [dateEndWork, setDateEndWork] = useState([]);
  const [dateStartMonthWork, setDateStartMonthWork] = useState([]);
  const [dateEndMonthWork, setDateEndMonthWork] = useState([]);
  const [placeWork, setPlaceWork] = useState([]);
  const [positionWork, setPositionWork] = useState([]);
  const [workFile, setWorkFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);

  const handleDateStartWork = (e, index) => {
    const newTemp = e;
    setDateStartWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateEndWork = (e, index) => {
    const newTemp = e;
    setDateEndWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateStartMonthWork = (e, index) => {
    const newTemp = e;
    setDateStartMonthWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      // เพิ่มค่า "" ในตำแหน่งที่ขาดหายไปให้ครบจนถึง index ที่ระบุ
      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handleDateEndMonthWork = (e, index) => {
    const newTemp = e;
    setDateEndMonthWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handlePlaceWork = (e, index) => {
    const newTemp = e;
    setPlaceWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  const handlePositionWork = (e, index) => {
    const newTemp = e;
    setPositionWork((prevTemp) => {
      const updatedTemp = Array.isArray(prevTemp) ? [...prevTemp] : [];

      while (updatedTemp.length <= index) {
        updatedTemp.push("");
      }

      updatedTemp[index] = newTemp;
      return updatedTemp;
    });
  };

  // config field
  const [works, setWorks] = useState([{}]);
  const [errorFieldWorks, setErrorFieldWorks] = useState("");

  const handleAddWork = () => {
    // ตรวจสอบให้แน่ใจว่ามีการกรอกข้อมูล work ครบถ้วนก่อนที่จะเพิ่มข้อมูลใหม่
    if (
      !dateStartWork[works.length - 1] ||
      !dateEndWork[works.length - 1] ||
      !placeWork[works.length - 1] ||
      !positionWork[works.length - 1]
    ) {
      setErrorFieldWorks("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }

    // จำกัดจำนวน work ไม่เกิน 5 รายการ
    if (works.length >= 5) {
      setErrorFieldWorks("");
      return;
    }

    setErrorFieldWorks("");
    setWorks([...works, {}]); // เพิ่มออบเจกต์ว่างใน works
  };

  const handleRemoveWork = (index) => {
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
        const newWorks = [...works];
        newWorks.splice(index, 1);
        setWorks(newWorks);

        const temp = index;

        setErrorFieldWorks("");

        // ลบข้อมูลจาก dateStartWork, dateEndWork, placeWork, positionWork, และ workFile
        setDateStartWork((prev) => prev.filter((_, i) => i !== temp));
        setDateEndWork((prev) => prev.filter((_, i) => i !== temp));
        setPlaceWork((prev) => prev.filter((_, i) => i !== temp));
        setPositionWork((prev) => prev.filter((_, i) => i !== temp));
        setWorkFile((prev) => prev.filter((_, i) => i !== temp));
      }
    });
  };

  //deleteFile
  async function handleDeleteFileWork(name, index) {
    const result = await Swal.fire({
      title: "ลบข้อมูล",
      text: `คุณต้องการลบไฟล์ ${name}?`,
      icon: "warning",
      confirmButtonText: "ใช่",
      confirmButtonColor: "#f27474",
      showCancelButton: true,
      cancelButtonText: "ไม่",
    });

    const mergedFile = workFile;

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setWorkFile(updatedTrainFiles);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  //upload file
  const workFileInputRef = useRef(null);
  const [workFileUploadProgress, setWorkFileUploadProgress] = useState(0);

  const openFileDialogWork = () => {
    if (workFileInputRef.current) {
      workFileInputRef.current.click();
    }
  };

  const handleWorkDocument = (event, index) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop();
      if (
        fileExtension !== "pdf" &&
        fileExtension !== "docx" &&
        fileExtension !== "doc"
      ) {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");

        return;
      }

      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(storage, `users/documents/work/${id}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setError("");
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setWorkFileUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              const newWorkFile = {
                fileName: fileName,
                fileType: fileExtension,
                fileUrl: url,
                fileSize: fileSizeMB,
              };

              setWorkFile((prevFiles) => {
                const updatedFiles = [...prevFiles];
                updatedFiles[index] = newWorkFile;
                return updatedFiles;
              });
              setWorkFileUploadProgress(0);
              workFileInputRef.current.value = "";
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    }
  };

  const [editMode, setEditMode] = useState(false);

  function mergeArrayValues(nonGetArray, getArray) {
    // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
    if (nonGetArray.length === 0) {
      return getArray;
    }

    if (nonGetArray.length > getArray.length) {
      return nonGetArray.map((value, index) => {
        return value || getArray[index] || "";
      });
    } else {
      return getArray.map((value, index) => {
        return nonGetArray[index] || value || "";
      });
    }
  }
  function mergeArrayObjects(nonGetArray, getArray) {
    const maxLength = Math.max(nonGetArray.length, getArray.length);

    return Array.from({ length: maxLength }, (_, index) => {
      const nonGetItem = nonGetArray[index] || {}; // ใช้ค่าจาก nonGetArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง
      const getItem = getArray[index] || {}; // ใช้ค่าจาก getArray ในตำแหน่งที่ระบุ หรือออบเจกต์ว่าง

      // รวมค่าในตำแหน่งเดียวกันจากทั้งสองอาร์เรย์ โดยให้ข้อมูลที่มีค่าจริงจาก nonGetItem มีความสำคัญกว่า getItem
      return {
        fileName: nonGetItem.fileName || getItem.fileName || "",
        fileSize: nonGetItem.fileSize || getItem.fileSize || "",
        fileType: nonGetItem.fileType || getItem.fileType || "",
        fileUrl: nonGetItem.fileUrl || getItem.fileUrl || "",
        _id: nonGetItem._id || getItem._id || "",
      };
    });
  }

  //submit
  async function handleSubmit(e, fieldProjects, fieldInternship, fieldWorks) {
    e.preventDefault();

    const mergedProjectName = projectName;
    const mergedProjectDetail = projectDetail;
    const mergedProjectFile = projectFile;
    const mergedDateStartInternship = dateStartInternship;

    const mergedDateEndInternship = dateEndInternship;

    const mergedDateStartMonthInternship = dateStartMonthInternship;
    const mergedDateEndMonthInternship = dateEndMonthInternship;
    const mergedPlaceInternship = placeInternship;
    const mergedPositionInternship = positionInternship;
    const mergedInternshipFile = internshipFile;

    const mergedDateStartWork = dateStartWork;
    const mergedDateEndWork = dateEndWork;
    const mergedDateStartMonthWork = dateStartMonthWork;
    const mergedDateEndMonthWork = dateEndMonthWork;
    const mergedPlaceWork = placeWork;
    const mergedPositionWork = positionWork;
    const mergedWorkFile = workFile;

    const tempStatusNow = statusNow;

    //check date
    const isInvalidDateRange = mergedDateStartInternship.find(
      (dateStart, i) => {
        const dateEnd = mergedDateEndInternship[i];
        return new Date(dateEnd) < new Date(dateStart);
      }
    );

    if (isInvalidDateRange) {
      setError("ระบุปีการฝึกงานไม่ถูกต้อง");

      return; // หยุดการทำงานถ้ามีช่วงวันที่ไม่ถูกต้อง
    }
    const isInvalidDateRangeWork = mergedDateStartWork.find((dateStart, i) => {
      const dateEnd = mergedDateEndWork[i];
      return new Date(dateEnd) < new Date(dateStart);
    });

    if (isInvalidDateRangeWork) {
      setError("ระบุปีการทำงานไม่ถูกต้อง");

      return; // หยุดการทำงานถ้ามีช่วงวันที่ไม่ถูกต้อง
    }

    // ลดค่าตัวนับของแต่ละฟิลด์ลง 1
    fieldProjects -= 1;
    fieldInternship -= 1;
    fieldWorks -= 1;

    // ตรวจสอบข้อมูลโครงงาน / ผลงาน
    const hasAnyProjectField =
      mergedProjectName[fieldProjects] || mergedProjectDetail[fieldProjects];

    const isProjectFieldComplete =
      mergedProjectName[fieldProjects] && mergedProjectDetail[fieldProjects];
    if (hasAnyProjectField && !isProjectFieldComplete) {
      setError("กรุณาระบุข้อมูล โครงงาน / ผลงาน ให้ครบทุกช่อง");

      return;
    }

    const hasAnyInternshipField =
      mergedDateStartInternship[fieldInternship] ||
      mergedDateEndInternship[fieldInternship] ||
      mergedDateStartMonthInternship[fieldInternship] ||
      mergedDateEndMonthInternship[fieldInternship] ||
      mergedPlaceInternship[fieldInternship] ||
      mergedPositionInternship[fieldInternship];

    const isInternshipFieldComplete =
      mergedDateStartMonthInternship[fieldInternship] &&
      mergedDateEndMonthInternship[fieldInternship] &&
      mergedPlaceInternship[fieldInternship] &&
      mergedPositionInternship[fieldInternship];

    // ตรวจสอบข้อมูลการฝึกงาน
    if (hasAnyInternshipField && !isInternshipFieldComplete) {
      setError("กรุณาระบุข้อมูล การฝึกงาน ให้ครบทุกช่อง");

      return;
    }

    const hasAnyWorkField =
      mergedDateStartWork[fieldWorks] ||
      mergedDateEndWork[fieldWorks] ||
      mergedDateStartMonthWork[fieldWorks] ||
      mergedDateEndMonthWork[fieldWorks] ||
      mergedPlaceWork[fieldWorks] ||
      mergedPositionWork[fieldWorks];
    const isWorkFieldComplete =
      mergedDateStartMonthWork[fieldWorks] &&
      mergedDateEndMonthWork[fieldWorks] &&
      mergedPlaceWork[fieldWorks] &&
      mergedPositionWork[fieldWorks];
    // ตรวจสอบข้อมูลการทำงาน

    if (hasAnyWorkField && !isWorkFieldComplete) {
      setError("กรุณาระบุข้อมูล การทำงาน ให้ครบทุกช่อง");

      return;
    }

    const hasAnyField =
      hasAnyProjectField || hasAnyInternshipField || hasAnyWorkField;
    // หากไม่มีข้อมูลเลยในทุกส่วน
    if (!hasAnyField) {
      setError("ไม่มีข้อมูลที่บันทึก");

      return;
    }
    // ถ้าผ่านทุกเงื่อนไขให้เคลียร์ error
    setError("");

    // console.log("--- project ---");
    // console.log("project : " + projectName);
    // console.log("detailProject : " + projectDetail);
    // console.log("FileProject : " + projectFile[0].fileName);
    // console.log("--- internship ---");
    // console.log("dateStart : " + dateStartInternship);
    // console.log("dateEnd : " + dateEndInternship);
    // console.log("placeInternship : " + placeInternship);
    // console.log("positionInternship : " + positionInternship);
    // console.log("internshipFile : " + internshipFile[0].fileName);
    // console.log("--- work ---");
    // console.log("dateStart : " + dateStartWork);
    // console.log("dateEnd : " + dateEndWork);
    // console.log("placeWork : " + placeWork);
    // console.log("positionWork : " + positionWork);
    // console.log("WorkFile : " + workFile[0].fileName);

    // จัดเตรียมข้อมูลที่จะส่งไปยัง API
    const data = {
      uuid: id,
      projects: mergedProjectName.map((name, index) => ({
        name,
        detail: mergedProjectDetail[index],
        files: [
          {
            fileName: mergedProjectFile[index]?.fileName || "",
            fileType: mergedProjectFile[index]?.fileType || "",
            fileUrl: mergedProjectFile[index]?.fileUrl || "",
            fileSize: mergedProjectFile[index]?.fileSize || "",
          },
        ],
      })),
      internships: mergedDateStartInternship.map((dateStart, index) => ({
        dateStart,
        dateEnd: mergedDateEndInternship[index],
        dateStartMonth: mergedDateStartMonthInternship[index],
        dateEndMonth: mergedDateEndMonthInternship[index],
        place: mergedPlaceInternship[index],
        position: mergedPositionInternship[index],
        files: [
          {
            fileName: mergedInternshipFile[index]?.fileName || "",
            fileType: mergedInternshipFile[index]?.fileType || "",
            fileUrl: mergedInternshipFile[index]?.fileUrl || "",
            fileSize: mergedInternshipFile[index]?.fileSize || "",
          },
        ],
      })),
      workExperience: mergedDateStartWork.map((dateStart, index) => ({
        dateStart,
        dateEnd: mergedDateEndWork[index],
        dateStartMonth: mergedDateEndMonthWork[index],
        dateEndMonth: mergedDateEndMonthWork[index],
        place: mergedPlaceWork[index],
        position: mergedPositionWork[index],
        files: [
          {
            fileName: mergedWorkFile[index]?.fileName || "",
            fileType: mergedWorkFile[index]?.fileType || "",
            fileUrl: mergedWorkFile[index]?.fileUrl || "",
            fileSize: mergedWorkFile[index]?.fileSize || "",
          },
        ],
      })),
      statusNow: tempStatusNow,
    };

    try {
      // ส่งข้อมูลไปยัง API ด้วย fetch
      const response = await updateHistoryWorkById(data);

      if (response.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        await addLog({
          actorUuid: session?.user?.id,
          targetUuid: id,
          action: ACTION_ACTIVITY.UPDATE,
          targetModel: TARGET_MODEL.HISTORYWORK,
          description: "Update History Work",
          data: data,
        });
        setEditMode(false);
        if (handleStep) {
          handleStep();
        }
      } else {
        console.error("Failed to submit data:", result.message);
        await addLog({
          actorUuid: session?.user?.id,
          targetUuid: id,
          action: ACTION_ACTIVITY.ERROR,
          targetModel: TARGET_MODEL.HISTORYWORK,
          description: "Error History Work",
          data: data,
        });
        toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        setEditMode(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      await addLog({
        actorUuid: session?.user?.id,
        targetUuid: id,
        action: ACTION_ACTIVITY.ERROR,
        targetModel: TARGET_MODEL.HISTORYWORK,
        description: "Error History Work",
        data: data,
      });
      toast.error("เกิดข้อผิดพลาด ", error);
      setEditMode(false);
      return;
    }
  }

  useEffect(() => {
    // ถ้าไม่มีข้อมูลใน dataHistoryWork ให้หยุดการทำงานของ useEffect
    if (!dataHistoryWork) return;

    // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setProjectName(
      dataHistoryWork.projects?.map((project) => project.name) || []
    );
    setProjectDetail(
      dataHistoryWork.projects?.map((project) => project.detail) || []
    );
    setProjectFile(
      dataHistoryWork.projects?.flatMap((project) => project.files) || []
    );

    setDateStartInternship(
      dataHistoryWork.internships?.map((internship) => internship.dateStart) ||
        []
    );
    setDateEndInternship(
      dataHistoryWork.internships?.map((internship) => internship.dateEnd) || []
    );
    setDateStartMonthInternship(
      dataHistoryWork.internships?.map(
        (internship) => internship.dateStartMonth
      ) || []
    );
    setDateEndMonthInternship(
      dataHistoryWork.internships?.map(
        (internship) => internship.dateEndMonth
      ) || []
    );
    setPlaceInternship(
      dataHistoryWork.internships?.map((internship) => internship.place) || []
    );
    setPositionInternship(
      dataHistoryWork.internships?.map((internship) => internship.position) ||
        []
    );
    setInternshipFile(
      dataHistoryWork.internships?.flatMap((internship) => internship.files) ||
        []
    );

    setDateStartWork(
      dataHistoryWork.workExperience?.map((work) => work.dateStart) || []
    );
    setDateEndWork(
      dataHistoryWork.workExperience?.map((work) => work.dateEnd) || []
    );
    setDateStartMonthWork(
      dataHistoryWork.workExperience?.map((work) => work.dateStartMonth) || []
    );
    setDateEndMonthWork(
      dataHistoryWork.workExperience?.map((work) => work.dateEndMonth) || []
    );
    setPlaceWork(
      dataHistoryWork.workExperience?.map((work) => work.place) || []
    );
    setPositionWork(
      dataHistoryWork.workExperience?.map((work) => work.position) || []
    );
    setWorkFile(
      dataHistoryWork.workExperience?.flatMap((work) => work.files) || []
    );

    setStatusNow(dataHistoryWork?.statusNow || "0");

    //set ฟิลด์เริ่มต้น
    if (
      Array.isArray(dataHistoryWork.projects) &&
      dataHistoryWork.projects.length > 0
    ) {
      setProjects(dataHistoryWork.projects);
    }
    if (
      Array.isArray(dataHistoryWork.internships) &&
      dataHistoryWork.internships.length > 0
    ) {
      setInternships(dataHistoryWork.internships);
    }
    if (
      Array.isArray(dataHistoryWork.workExperience) &&
      dataHistoryWork.workExperience.length > 0
    ) {
      setWorks(dataHistoryWork.workExperience);
    }
  }, [dataHistoryWork]);

  //Download file
  const handleDownloadFile = async (filePath, fileName) => {
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    try {
      // ดึง URL ของไฟล์
      const downloadURL = await getDownloadURL(fileRef);

      // ใช้ fetch เพื่อดาวน์โหลดไฟล์
      const response = await fetch(downloadURL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // แปลงเป็น Blob
      saveAs(blob, fileName); // ใช้ file-saver เพื่อดาวน์โหลดไฟล์
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
    }
  };

  //openfile
  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

  //status now
  const [statusNow, setStatusNow] = useState("");
  const [getStatusNow, setGetStatusNow] = useState("");

  //for progressbar
  const fieldProgress = [
    projectName[0],
    projectDetail[0],
    dateStartInternship[0],
    dateEndInternship[0],
    dateStartMonthInternship[0],
    dateEndMonthInternship[0],
    placeInternship[0],
    positionInternship[0],
    dateStartWork[0],
    dateEndWork[0],
    dateStartMonthWork[0],
    dateEndMonthWork[0],
    placeWork[0],
    positionWork[0],
    statusNow,
  ];
  return (
    <form
      onSubmit={(e) =>
        handleSubmit(e, projects.length, internships.length, works.length)
      }
      className={`${bgColorMain2} ${bgColor} ${fontSize} flex flex-col gap-16`}
    >
      <div>
        <p className="mb-2">โครงงาน / ผลงาน</p>
        <hr />
        {projects.map((project, index) => (
          <div key={index}>
            {index > 0 && editMode && (
              <div className={` flex col flex-col justify-end w-full mt-5`}>
                <div
                  className={` cursor-pointer  rounded-lg w-fit`}
                  onClick={() => handleRemoveProject(index)}
                >
                  <Icon
                    className={` text-red-500`}
                    path={mdiCloseCircle}
                    size={1}
                  />
                </div>
              </div>
            )}
            {index > 0 && !editMode && <hr className="mt-5" />}
            <div className="mt-5 flex gap-5 flex-wrap">
              <div className="flex flex-col gap-1">
                <label>
                  ชื่อโครงงาน / ผลงาน{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ``
                  }  ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                  readOnly={!editMode}
                  placeholder="ระบุชื่อโครงงานหรือผลงาน"
                  defaultValue={projectName[index] || ""}
                  onBlur={(e) => handleProjectName(e.target.value, index)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  รายละเอียด{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} mt-1 w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                  readOnly={!editMode}
                  placeholder="รายละเอียดเพิ่มเติม"
                  defaultValue={projectDetail[index] || ""}
                  onBlur={(e) => handleProjectDetail(e.target.value, index)}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {projectFile[index]?.fileUrl || editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}

                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {projectFile[index] && projectFile[index]?.fileUrl !== "" ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() => openFile(projectFile[index]?.fileUrl)}
                      className="cursor-pointer"
                    >
                      <p>
                        {projectFile[index]?.fileName}.
                        {projectFile[index]?.fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {projectFile[index]?.fileSize} MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            projectFile[index]?.fileUrl,
                            projectFile[index]?.fileName
                          )
                        }
                        className={` text-black`}
                        path={mdiDownload}
                        size={1}
                      />
                      {editMode && (
                        <Icon
                          onClick={() =>
                            handleDeleteFileProject(
                              projectFile[index]?.fileName,
                              index
                            )
                          }
                          className={` text-black`}
                          path={mdiDelete}
                          size={1}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  editMode && (
                    <div
                      onClick={editMode ? openFileDialog : undefined} // เรียกใช้ฟังก์ชันเมื่อ editMode เป็น true
                      className={`border mt-1 rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                        editMode ? " cursor-pointer" : " cursor-not-allowed"
                      }`}
                      style={{ pointerEvents: editMode ? "auto" : "none" }} // ปิดการคลิกเมื่อ editMode เป็น false
                    >
                      <input
                        id="chooseProfile"
                        type="file"
                        ref={projectFileInputRef} // เชื่อมต่อกับ ref
                        onChange={(e) => handleProfileDocument(e, index)}
                        hidden
                      />
                      Choose File
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {errorField && <div className="mt-3 text-red-500">*{errorField}</div>}
        {projects.length < 5 && editMode && (
          <div className={` flex col flex-col justify-end w-full mt-5`}>
            <div
              className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
              onClick={handleAddProject}
            >
              <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="mb-2">การฝึกงาน</p>
        <hr />
        {internships.map((project, index) => (
          <div key={index}>
            {index > 0 && editMode && (
              <div className={` flex col flex-col justify-end w-full mt-5`}>
                <div
                  className={` cursor-pointer  rounded-lg w-fit`}
                  onClick={() => handleRemoveInternship(index)}
                >
                  <Icon
                    className={` text-red-500`}
                    path={mdiCloseCircle}
                    size={1}
                  />
                </div>
              </div>
            )}
            {index > 0 && !editMode && <hr className="mt-5" />}
            <div className="mt-5 flex gap-5 flex-wrap">
              <div className="flex flex-col gap-1">
                <label>
                  ตั้งแต่{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateStartInternship(e.target.value, index)
                      }
                      value={dateStartInternship[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">ปี</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateStartMonthInternship(e.target.value, index)
                      }
                      value={dateStartMonthInternship[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">เดือน</option>
                      {thaiMonths.map((thaiMonths, index) => (
                        <option key={index} value={thaiMonths}>
                          {thaiMonths}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  ถึง{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateEndInternship(e.target.value, index)
                      }
                      value={dateEndInternship[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">-</option>
                      <option value="ปัจจุบัน">ปัจจุบัน</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateEndMonthInternship(e.target.value, index)
                      }
                      value={dateEndMonthInternship[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">เดือน</option>
                      <option value="ปัจจุบัน">ปัจจุบัน</option>
                      {thaiMonths.map((thaiMonths, index) => (
                        <option key={index} value={thaiMonths}>
                          {thaiMonths}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  สถานที่ฝึกงาน{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                  placeholder="ระบุสถานฝึกงาน"
                  onBlur={(e) => handlePlaceInternship(e.target.value, index)}
                  defaultValue={placeInternship[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  ตำแหน่ง{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain}  mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                  placeholder="ระบุตำแหน่งที่ฝึกงาน"
                  onBlur={(e) =>
                    handlePositionInternship(e.target.value, index)
                  }
                  defaultValue={positionInternship[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {internshipFile[index]?.fileUrl || editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}

                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {internshipFile[index] &&
                internshipFile[index]?.fileUrl !== "" ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() => openFile(internshipFile[index]?.fileUrl)}
                      className="cursor-pointer"
                    >
                      <p>
                        {internshipFile[index]?.fileName}.
                        {internshipFile[index]?.fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {internshipFile[index]?.fileSize} MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            internshipFile[index]?.fileUrl,
                            internshipFile[index]?.fileName
                          )
                        }
                        className={` text-black`}
                        path={mdiDownload}
                        size={1}
                      />
                      {editMode && (
                        <Icon
                          onClick={() =>
                            handleDeleteFileInternship(
                              internshipFile[index]?.fileName,
                              index
                            )
                          }
                          className={` text-black`}
                          path={mdiDelete}
                          size={1}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  editMode && (
                    <div
                      onClick={editMode ? openFileDialogInternship : undefined} // ตรวจสอบ editMode ก่อนเรียกฟังก์ชัน
                      className={`border mt-1 rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                        editMode ? " cursor-pointer" : "cursor-not-allowed"
                      }`}
                      style={{ pointerEvents: editMode ? "auto" : "none" }} // ปิดการคลิกเมื่อ editMode เป็น false
                    >
                      <input
                        id="chooseProfile"
                        type="file"
                        ref={internFileInputRef} // เชื่อมต่อกับ ref
                        onChange={(e) => handleInternshipDocument(e, index)}
                        hidden
                      />
                      Choose File
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {errorFieldInterships && (
          <div className="mt-3 text-red-500">*{errorFieldInterships}</div>
        )}
        {projects.length < 5 && editMode && (
          <div className={` flex col flex-col justify-end w-full mt-5`}>
            <div
              className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
              onClick={handleAddInterships}
            >
              <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="mb-2">การทำงาน</p>
        <hr />
        {works.map((project, index) => (
          <div key={index}>
            {index > 0 && editMode && (
              <div className={` flex col flex-col justify-end w-full mt-5`}>
                <div
                  className={` cursor-pointer  rounded-lg w-fit`}
                  onClick={() => handleRemoveWork(index)}
                >
                  <Icon
                    className={` text-red-500`}
                    path={mdiCloseCircle}
                    size={1}
                  />
                </div>
              </div>
            )}
            {index > 0 && !editMode && <hr className="mt-5" />}
            <div className="mt-5 flex gap-5 flex-wrap">
              <div className="flex flex-col gap-1">
                <label>
                  ตั้งแต่{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateStartWork(e.target.value, index)
                      }
                      value={dateStartWork[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">-</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateStartMonthWork(e.target.value, index)
                      }
                      value={dateStartMonthWork[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">เดือน</option>
                      {thaiMonths.map((thaiMonths, index) => (
                        <option key={index} value={thaiMonths}>
                          {thaiMonths}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  ถึง{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) => handleDateEndWork(e.target.value, index)}
                      value={dateEndWork[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">-</option>
                      <option value="ปัจจุบัน">ปัจจุบัน</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                  <div className="relative col w-fit mt-1">
                    <select
                      className={`${
                        !editMode ? "editModeTrue" : ""
                      } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-36 border border-gray-400 py-2 px-4 rounded-lg`}
                      style={{ appearance: "none" }}
                      onChange={(e) =>
                        handleDateEndMonthWork(e.target.value, index)
                      }
                      value={dateEndMonthWork[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="">เดือน</option>
                      <option value="ปัจจุบัน">ปัจจุบัน</option>
                      {thaiMonths.map((thaiMonths, index) => (
                        <option key={index} value={thaiMonths}>
                          {thaiMonths}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                      path={mdiArrowDownDropCircle}
                      size={0.8}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  สถานที่ทำงาน{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                  placeholder="ระบุสถานที่ทำงาน"
                  onBlur={(e) => handlePlaceWork(e.target.value, index)}
                  defaultValue={placeWork[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  ตำแหน่ง{" "}
                  <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={`${
                    !editMode ? "editModeTrue" : ""
                  } ${bgColorMain} mt-1 w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                  placeholder="ระบุตำแหน่งงาน"
                  onBlur={(e) => handlePositionWork(e.target.value, index)}
                  defaultValue={positionWork[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {workFile[index]?.fileUrl || editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}
                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {workFile[index] && workFile[index]?.fileUrl !== "" ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() => openFile(workFile[index]?.fileUrl)}
                      className="cursor-pointer"
                    >
                      <p>
                        {workFile[index]?.fileName}.{workFile[index]?.fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {workFile[index]?.fileSize} MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            workFile[index]?.fileUrl,
                            workFile[index]?.fileName
                          )
                        }
                        className={` text-black`}
                        path={mdiDownload}
                        size={1}
                      />
                      {editMode && (
                        <Icon
                          onClick={() =>
                            handleDeleteFileWork(
                              workFile[index]?.fileName,
                              index
                            )
                          }
                          className={` text-black`}
                          path={mdiDelete}
                          size={1}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  editMode && (
                    <div
                      onClick={editMode ? openFileDialogWork : undefined} // ตรวจสอบ editMode ก่อนเรียกฟังก์ชัน
                      className={`border mt-1 rounded-lg py-2 px-8 text-center ${inputEditColor} ${
                        editMode ? " cursor-pointer" : " cursor-not-allowed"
                      }`}
                      style={{ pointerEvents: editMode ? "auto" : "none" }} // ปิดการคลิกเมื่อ editMode เป็น false
                    >
                      <input
                        id="chooseProfile"
                        type="file"
                        ref={workFileInputRef} // เชื่อมต่อกับ ref
                        onChange={(e) => handleWorkDocument(e, index)}
                        hidden
                        className={`${bgColorMain}`}
                      />
                      Choose File
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {errorFieldWorks && (
          <div className="mt-3 text-red-500">*{errorFieldWorks}</div>
        )}
        {works.length < 5 && editMode && (
          <div className={` flex col flex-col justify-end w-full mt-5`}>
            <div
              className={` cursor-pointer  rounded-lg bg-[#4a94ff] w-fit`}
              onClick={handleAddWork}
            >
              <Icon className={` text-white mx-3`} path={mdiPlus} size={1.5} />
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="mb-2">สถานะปัจจุบัน</p>
        <hr />
        <div className="mt-5">
          <div className="relative col w-fit mt-1">
            <select
              className={`${
                !editMode ? "editModeTrue" : ""
              } ${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-44 border border-gray-400 py-2 px-4 rounded-lg`}
              style={{ appearance: "none" }}
              onChange={(e) => setStatusNow(e.target.value)}
              value={statusNow || getStatusNow || ""}
              disabled={!editMode}
            >
              <option value="">เลือกสถานะ</option>
              {dataStatus.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Icon
              className={`cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
              path={mdiArrowDownDropCircle}
              size={0.8}
            />
          </div>
        </div>
      </div>
      <div>
        {error && (
          <div className="w-full text-center">
            <p className="text-red-500">* {error}</p>
          </div>
        )}
        {editMode && <ProgressBarForm fields={fieldProgress} />}

        {!readOnly && (
          <ButtonGroup
            editMode={editMode}
            setEditMode={setEditMode}
            tailwind="mt-5"
          />
        )}
      </div>
    </form>
  );
}

export default HistoryWorkForm;
