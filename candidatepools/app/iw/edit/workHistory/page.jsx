"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiPlus,
  mdiCloseCircle,
  mdiDownload,
  mdiArrowDownDropCircle,
  mdiPencil,
  mdiContentSave,
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

function WorkHistory() {
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status, data: session } = useSession();
  const [dataUser, setDataUser] = useState([]);

  // Validate session and fetch user data
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    setLoader(false);

    if (!session) {
      router.replace("/");
      return;
    }

    if (session?.user?.id) {
      getUser(session.user.id);
      getHistoryWork(session.user.id);
    } else {
      router.replace("/register");
    }
  }, [status, session, router]);

  //get data from user
  async function getUser(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Error getting data from API");
      }

      const data = await res.json();
      setDataUser(data.user || {});
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
      setLoader(false);
    }
  }

  //Theme
  const {
    setFontSize,
    setFontHeadSize,
    setBgColor,
    setBgColorNavbar,
    setBgColorWhite,
    setBgColorMain,
    setBgColorMain2,
    fontSize,
    fontHeadSize,
    bgColorNavbar,
    bgColor,
    bgColorWhite,
    bgColorMain,
    bgColorMain2,
    setLineBlack,
    lineBlack,
    setTextBlue,
    textBlue,
    setRegisterColor,
    registerColor,
    inputEditColor,
    inputGrayColor,
    setInputGrayColor,
    inputTextColor,
  } = useTheme();

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
      (!projectName[projects.length - 1] ||
        !projectDetail[projects.length - 1]) &&
      (!getProjectName[projects.length - 1] ||
        !getProjectDetail[projects.length - 1])
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

        // ลบข้อมูลจาก getProjectName, getProjectDetail, และ getProjectFile
        const newGetProjectName = getProjectName.filter((_, i) => i !== temp);
        setGetProjectName(newGetProjectName);

        const newGetProjectDetail = getProjectDetail.filter(
          (_, i) => i !== temp
        );
        setGetProjectDetail(newGetProjectDetail);

        const newGetProjectFile = getProjectFile.filter((_, i) => i !== temp);
        setGetProjectFile(newGetProjectFile);
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

    const mergedProjectFile = mergeArrayObjects(projectFile, getProjectFile);

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedProjectFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setProjectFile(updatedTrainFiles);
      setGetProjectFile(updatedTrainFiles);
      Swal.fire("ลบไฟล์สำเร็จ", `${name} ถูกลบเรียบร้อยแล้ว`, "success");
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
    setLoader(true);
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (fileExtension !== "pdf" && fileExtension !== "docx") {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
        setLoader(false);
        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

      // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/workHistory/${session?.user?.email}/${fileName}`
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
          setLoader(false);
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
              setLoader(false);
            })
            .catch((error) => {
              setLoader(false);
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
      (!dateStartInternship[internships.length - 1] ||
        !dateEndInternship[internships.length - 1] ||
        !dateEndMonthInternship[internships.length - 1] ||
        !dateStartMonthInternship[internships.length - 1] ||
        !placeInternship[internships.length - 1] ||
        !positionInternship[internships.length - 1]) &&
      (!getDateStartInternship[internships.length - 1] ||
        !getDateEndInternship[internships.length - 1] ||
        !getDateEndMonthInternship[internships.length - 1] ||
        !getDateEndMonthInternship[internships.length - 1] ||
        !getPlaceInternship[internships.length - 1] ||
        !getPositionInternship[internships.length - 1])
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

        // ลบข้อมูลจาก getDateStartInternship, getDateEndInternship, getPlaceInternship, getPositionInternship, และ getInternshipFile
        setGetDateStartInternship((prev) => prev.filter((_, i) => i !== temp));
        setGetDateEndInternship((prev) => prev.filter((_, i) => i !== temp));
        setGetDateStartMonthInternship((prev) =>
          prev.filter((_, i) => i !== temp)
        );
        setGetDateEndMonthInternship((prev) =>
          prev.filter((_, i) => i !== temp)
        );
        setGetPlaceInternship((prev) => prev.filter((_, i) => i !== temp));
        setGetPositionInternship((prev) => prev.filter((_, i) => i !== temp));
        setGetInternshipFile((prev) => prev.filter((_, i) => i !== temp));
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

    const mergedFile = mergeArrayObjects(internshipFile, getInternshipFile);

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setInternshipFile(updatedTrainFiles);
      setGetInternshipFile(updatedTrainFiles);
      Swal.fire("ลบไฟล์สำเร็จ", `${name} ถูกลบเรียบร้อยแล้ว`, "success");
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
    setLoader(true);
    const selectedFile = event.target.files[0]; // ไฟล์ที่เลือกจาก input
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop(); // รับนามสกุลไฟล์
      if (fileExtension !== "pdf" && fileExtension !== "docx") {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
        setLoader(false);
        return;
      }

      // บันทึกขนาดไฟล์ในรูปแบบที่ต้องการ เช่น 3.0MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

      // ใช้ชื่อไฟล์ที่กำหนดเอง (inputNameFile)
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/internship/${session?.user?.email}/${fileName}`
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
          setLoader(false);
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
              setLoader(false);
            })
            .catch((error) => {
              setLoader(false);
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
      (!dateStartWork[works.length - 1] ||
        !dateEndWork[works.length - 1] ||
        !placeWork[works.length - 1] ||
        !positionWork[works.length - 1]) &&
      (!getDateStartWork[works.length - 1] ||
        !getDateEndWork[works.length - 1] ||
        !getPlaceWork[works.length - 1] ||
        !getPositionWork[works.length - 1])
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

        // ลบข้อมูลจาก getDateStartWork, getDateEndWork, getPlaceWork, getPositionWork, และ getWorkFile
        setGetDateStartWork((prev) => prev.filter((_, i) => i !== temp));
        setGetDateEndWork((prev) => prev.filter((_, i) => i !== temp));
        setGetPlaceWork((prev) => prev.filter((_, i) => i !== temp));
        setGetPositionWork((prev) => prev.filter((_, i) => i !== temp));
        setGetWorkFile((prev) => prev.filter((_, i) => i !== temp));
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

    const mergedFile = mergeArrayObjects(workFile, getWorkFile);

    if (result.isConfirmed) {
      const updatedTrainFiles = [...mergedFile];
      updatedTrainFiles[index] = undefined; // ตั้งค่าตำแหน่งที่ต้องการเป็น undefined แทนการลบ

      setWorkFile(updatedTrainFiles);
      setGetWorkFile(updatedTrainFiles);
      Swal.fire("ลบไฟล์สำเร็จ", `${name} ถูกลบเรียบร้อยแล้ว`, "success");
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
    setLoader(true);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop();
      if (
        fileExtension !== "pdf" &&
        fileExtension !== "docx" &&
        fileExtension !== "doc"
      ) {
        setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
        setLoader(false);
        return;
      }

      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

      const storageRef = ref(
        storage,
        `users/documents/work/${session?.user?.email}/${fileName}`
      );
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
          setLoader(false);
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
              setLoader(false);
            })
            .catch((error) => {
              setLoader(false);
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

    setLoader(true);

    const mergedProjectName = mergeArrayValues(projectName, getProjectName);
    const mergedProjectDetail = mergeArrayValues(
      projectDetail,
      getProjectDetail
    );
    const mergedProjectFile = mergeArrayObjects(projectFile, getProjectFile);

    const mergedDateStartInternship = mergeArrayValues(
      dateStartInternship,
      getDateStartInternship
    );
    const mergedDateEndInternship = mergeArrayValues(
      dateEndInternship,
      getDateEndInternship
    );
    const mergedDateStartMonthInternship = mergeArrayValues(
      dateStartMonthInternship,
      getDateStartMonthInternship
    );
    const mergedDateEndMonthInternship = mergeArrayValues(
      dateEndMonthInternship,
      getDateEndMonthInternship
    );
    const mergedPlaceInternship = mergeArrayValues(
      placeInternship,
      getPlaceInternship
    );
    const mergedPositionInternship = mergeArrayValues(
      positionInternship,
      getPositionInternship
    );
    const mergedInternshipFile = mergeArrayObjects(
      internshipFile,
      getInternshipFile
    );

    const mergedDateStartWork = mergeArrayValues(
      dateStartWork,
      getDateStartWork
    );
    const mergedDateEndWork = mergeArrayValues(dateEndWork, getDateEndWork);
    const mergedDateStartMonthWork = mergeArrayValues(
      dateStartMonthWork,
      getDateStartMonthWork
    );
    const mergedDateEndMonthWork = mergeArrayValues(
      dateEndMonthWork,
      getDateEndMonthWork
    );
    const mergedPlaceWork = mergeArrayValues(placeWork, getPlaceWork);
    const mergedPositionWork = mergeArrayValues(positionWork, getPositionWork);
    const mergedWorkFile = mergeArrayObjects(workFile, getWorkFile);

    const tempStatusNow = statusNow || getStatusNow;

    //check date
    const isInvalidDateRange = mergedDateStartInternship.find(
      (dateStart, i) => {
        const dateEnd = mergedDateEndInternship[i];
        return new Date(dateEnd) < new Date(dateStart);
      }
    );

    if (isInvalidDateRange) {
      setError("ระบุปีการฝึกงานไม่ถูกต้อง");
      setLoader(false);
      return; // หยุดการทำงานถ้ามีช่วงวันที่ไม่ถูกต้อง
    }
    const isInvalidDateRangeWork = mergedDateStartWork.find((dateStart, i) => {
      const dateEnd = mergedDateEndWork[i];
      return new Date(dateEnd) < new Date(dateStart);
    });

    if (isInvalidDateRangeWork) {
      setError("ระบุปีการทำงานไม่ถูกต้อง");
      setLoader(false);
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
      setLoader(false);
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
      setLoader(false);
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
      setLoader(false);
      return;
    }

    const hasAnyField =
      hasAnyProjectField || hasAnyInternshipField || hasAnyWorkField;
    // หากไม่มีข้อมูลเลยในทุกส่วน
    if (!hasAnyField) {
      setError("ไม่มีข้อมูลที่บันทึก");
      setLoader(false);
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
      uuid: session?.user?.id,
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#0d96f8",
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Failed to submit data:", result.message);
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          icon: "error",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#f27474",
        }).then(() => {
          window.location.reload();
        });
        setLoader(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
        icon: "error",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f27474",
      }).then(() => {
        window.location.reload();
      });
      setLoader(false);
    }
  }

  //get Default value
  const [dataHistoryWork, setDataHistoryWork] = useState(null);
  const [getProjectName, setGetProjectName] = useState([]);
  const [getProjectDetail, setGetProjectDetail] = useState([]);
  const [getProjectFile, setGetProjectFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);
  const [getDateStartInternship, setGetDateStartInternship] = useState([]);
  const [getDateEndInternship, setGetDateEndInternship] = useState([]);
  const [getDateStartMonthInternship, setGetDateStartMonthInternship] =
    useState([]);
  const [getDateEndMonthInternship, setGetDateEndMonthInternship] = useState(
    []
  );
  const [getPlaceInternship, setGetPlaceInternship] = useState([]);
  const [getPositionInternship, setGetPositionInternship] = useState([]);
  const [getInternshipFile, setGetInternshipFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);
  const [getDateStartWork, setGetDateStartWork] = useState([]);
  const [getDateEndWork, setGetDateEndWork] = useState([]);
  const [getDateStartMonthWork, setGetDateStartMonthWork] = useState([]);
  const [getDateEndMonthWork, setGetDateEndMonthWork] = useState([]);
  const [getPlaceWork, setGetPlaceWork] = useState([]);
  const [getPositionWork, setGetPositionWork] = useState([]);
  const [getWorkFile, setGetWorkFile] = useState([
    {
      fileName: "",
      fileType: "",
      fileUrl: "",
      fileSize: "",
    },
  ]);

  useEffect(() => {
    // ถ้าไม่มีข้อมูลใน dataHistoryWork ให้หยุดการทำงานของ useEffect
    if (!dataHistoryWork) return;

    // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setGetProjectName(
      dataHistoryWork.projects?.map((project) => project.name) || []
    );
    setGetProjectDetail(
      dataHistoryWork.projects?.map((project) => project.detail) || []
    );
    setGetProjectFile(
      dataHistoryWork.projects?.flatMap((project) => project.files) || []
    );

    setGetDateStartInternship(
      dataHistoryWork.internships?.map((internship) => internship.dateStart) ||
        []
    );
    setGetDateEndInternship(
      dataHistoryWork.internships?.map((internship) => internship.dateEnd) || []
    );
    setGetDateStartMonthInternship(
      dataHistoryWork.internships?.map(
        (internship) => internship.dateStartMonth
      ) || []
    );
    setGetDateEndMonthInternship(
      dataHistoryWork.internships?.map(
        (internship) => internship.dateEndMonth
      ) || []
    );
    setGetPlaceInternship(
      dataHistoryWork.internships?.map((internship) => internship.place) || []
    );
    setGetPositionInternship(
      dataHistoryWork.internships?.map((internship) => internship.position) ||
        []
    );
    setGetInternshipFile(
      dataHistoryWork.internships?.flatMap((internship) => internship.files) ||
        []
    );

    setGetDateStartWork(
      dataHistoryWork.workExperience?.map((work) => work.dateStart) || []
    );
    setGetDateEndWork(
      dataHistoryWork.workExperience?.map((work) => work.dateEnd) || []
    );
    setGetDateStartMonthWork(
      dataHistoryWork.workExperience?.map((work) => work.dateStartMonth) || []
    );
    setGetDateEndMonthWork(
      dataHistoryWork.workExperience?.map((work) => work.dateEndMonth) || []
    );
    setGetPlaceWork(
      dataHistoryWork.workExperience?.map((work) => work.place) || []
    );
    setGetPositionWork(
      dataHistoryWork.workExperience?.map((work) => work.position) || []
    );
    setGetWorkFile(
      dataHistoryWork.workExperience?.flatMap((work) => work.files) || []
    );

    setGetStatusNow(dataHistoryWork?.statusNow || "0");

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

  async function getHistoryWork(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/historyWork/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Error getting data from API");
      }

      const data = await res.json();
      setDataHistoryWork(data.historyWork || {});
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
      setLoader(false);
    }
  }

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

  return (
    <form
      onSubmit={(e) =>
        handleSubmit(e, projects.length, internships.length, works.length)
      }
      className={`${bgColorMain2} ${bgColor} ${fontSize} rounded-lg p-5 flex flex-col gap-16`}
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
                  defaultValue={getProjectName[index] || ""}
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
                  defaultValue={getProjectDetail[index] || ""}
                  onBlur={(e) => handleProjectDetail(e.target.value, index)}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {projectFile[index]?.fileUrl ||
                getProjectFile[index]?.fileUrl ||
                editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}

                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {(projectFile[index] && projectFile[index]?.fileUrl !== "") ||
                (getProjectFile[index] &&
                  getProjectFile[index]?.fileUrl !== "") ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() =>
                        openFile(
                          projectFile[index]?.fileUrl ||
                            getProjectFile[index].fileUrl
                        )
                      }
                      className="cursor-pointer"
                    >
                      <p>
                        {projectFile[index]?.fileName ||
                          getProjectFile[index]?.fileName}
                        .
                        {projectFile[index]?.fileType ||
                          getProjectFile[index].fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {projectFile[index]?.fileSize ||
                        getProjectFile[index]?.fileSize}{" "}
                      MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            projectFile[index]?.fileUrl ||
                              getProjectFile[index].fileUrl,
                            projectFile[index]?.fileName ||
                              getProjectFile[index].fileName
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
                              projectFile[index]?.fileName ||
                                getProjectFile[index]?.fileName,
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
                      value={
                        dateStartInternship[index] ||
                        getDateStartInternship[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">ปี</option>
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
                      value={
                        dateStartMonthInternship[index] ||
                        getDateStartMonthInternship[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">เดือน</option>
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
                      value={
                        dateEndInternship[index] ||
                        getDateEndInternship[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">-</option>
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
                      value={
                        dateEndMonthInternship[index] ||
                        getDateEndMonthInternship[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">เดือน</option>
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
                  defaultValue={getPlaceInternship[index] || ""}
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
                  defaultValue={getPositionInternship[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {internshipFile[index]?.fileUrl ||
                getInternshipFile[index]?.fileUrl ||
                editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}

                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {(internshipFile[index] &&
                  internshipFile[index]?.fileUrl !== "") ||
                (getInternshipFile[index] &&
                  getInternshipFile[index]?.fileUrl !== "") ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() =>
                        openFile(
                          internshipFile[index]?.fileUrl ||
                            getInternshipFile[index].fileUrl
                        )
                      }
                      className="cursor-pointer"
                    >
                      <p>
                        {internshipFile[index]?.fileName ||
                          getInternshipFile[index]?.fileName}
                        .
                        {internshipFile[index]?.fileType ||
                          getInternshipFile[index].fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {internshipFile[index]?.fileSize ||
                        getInternshipFile[index]?.fileSize}{" "}
                      MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            internshipFile[index]?.fileUrl ||
                              getInternshipFile[index].fileUrl,
                            internshipFile[index]?.fileName ||
                              getInternshipFile[index].fileName
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
                              internshipFile[index]?.fileName ||
                                getInternshipFile[index]?.fileName,
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
                      value={
                        dateStartWork[index] || getDateStartWork[index] || ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">-</option>
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
                      value={
                        dateStartMonthWork[index] ||
                        getDateStartMonthWork[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">เดือน</option>
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
                      value={dateEndWork[index] || getDateEndWork[index] || ""}
                      disabled={!editMode}
                    >
                      <option value="0">-</option>
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
                      value={
                        dateEndMonthWork[index] ||
                        getDateEndMonthWork[index] ||
                        ""
                      }
                      disabled={!editMode}
                    >
                      <option value="0">เดือน</option>
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
                  defaultValue={getPlaceWork[index] || ""}
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
                  defaultValue={getPositionWork[index] || ""}
                  readOnly={!editMode}
                />
              </div>
              <div className={` ${bgColorMain} flex flex-col gap-1`}>
                {workFile[index]?.fileUrl ||
                getWorkFile[index]?.fileUrl ||
                editMode ? (
                  <label>เอกสารประกอบ</label>
                ) : null}
                {/* ปุ่มที่ใช้สำหรับเปิด dialog เลือกไฟล์ */}
                {(workFile[index] && workFile[index]?.fileUrl !== "") ||
                (getWorkFile[index] && getWorkFile[index]?.fileUrl !== "") ? (
                  <div className={`mt-1 w-fit py-2 flex gap-8`}>
                    <div
                      onClick={() =>
                        openFile(
                          workFile[index]?.fileUrl || getWorkFile[index].fileUrl
                        )
                      }
                      className="cursor-pointer"
                    >
                      <p>
                        {workFile[index]?.fileName ||
                          getWorkFile[index]?.fileName}
                        .
                        {workFile[index]?.fileType ||
                          getWorkFile[index]?.fileType}
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {workFile[index]?.fileSize ||
                        getWorkFile[index]?.fileSize}{" "}
                      MB
                    </p>
                    <div className="cursor-pointer flex gap-2">
                      {/* <Icon className={` text-black`} path={mdiDelete} size={1} /> */}
                      <Icon
                        onClick={() =>
                          handleDownloadFile(
                            workFile[index]?.fileUrl ||
                              getWorkFile[index].fileUrl,
                            workFile[index]?.fileName ||
                              getWorkFile[index].fileName
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
                              workFile[index]?.fileName ||
                                getWorkFile[index]?.fileName,
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
              <option value="0">เลือกสถานะ</option>
              <option value="กำลังศึกษา">กำลังศึกษา</option>
              <option value="ทำงาน">ทำงาน</option>
              <option value="ว่างงาน">ว่างงาน</option>
              <option value="อยากเปลี่ยนงาน">อยากเปลี่ยนงาน</option>
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
        {editMode ? (
          <div className="flex gap-10 w-full justify-center mt-5">
            <div
              onClick={() => {
                setEditMode(false);
                window.location.reload();
              }}
              //  className={`${bgColorNavbar} ${bgColorWhite} hover:cursor-pointer bg-[#F97201]  py-2 px-6  rounded-2xl flex justify-center items-center gap-1`}
              className={`
                        ${bgColorNavbar} 
                        ${bgColorWhite} 
                        hover:cursor-pointer 
                        bg-[#F97201]  
                        py-2 px-6 
                        rounded-2xl 
                        flex justify-center items-center gap-1 
                        border border-white
                      `}
            >
              <Icon path={mdiCloseCircle} size={1} />
              <p>ยกเลิก</p>
            </div>
            <button
              type="submit"
              className={`${inputTextColor} ${inputGrayColor} hover:cursor-pointer py-2 px-6 rounded-2xl flex justify-center items-center gap-1 border border-white`}
            >
              <Icon path={mdiContentSave} size={1} />
              <p>บันทึก</p>
            </button>
          </div>
        ) : (
          <div className=" flex w-full justify-center mt-10">
            <div
              onClick={() => setEditMode(true)}
              // className='hover:cursor-pointer bg-[#ffb74c]  py-2 px-6  rounded-2xl flex justify-center items-center gap-1'
              className={` ${bgColorNavbar} ${bgColorWhite}  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
            >
              <Icon path={mdiPencil} size={0.8} />
              <p>แก้ไข</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default WorkHistory;
