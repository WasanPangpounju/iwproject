"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "firebase/storage";
import { storage } from "@/app/firebaseConfig";
import { saveAs } from "file-saver";

//stores
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

import { dataStatus } from "@/assets/dataStatus";
import ButtonGroup from "./ButtonGroup/ButtonGroup";
import ProgressBarForm from "./ProgressBarForm/ProgressBarForm";

import { toast } from "react-toastify";
import { ACTION_ACTIVITY, TARGET_MODEL } from "@/const/enum";

function HistoryWorkForm({ id, dataHistoryWork, handleStep, readOnly = false }) {
  const { data: session } = useSession();

  const { updateHistoryWorkById } = useHistoryWorkStore();
  const [error, setError] = useState("");

  const { fontSize, bgColor, bgColorMain, bgColorMain2, inputEditColor } =
    useTheme();

  const [editMode, setEditMode] = useState(false);

  // a11y
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

  const formErrorId = "historywork-form-error";
  const errorProjectId = "historywork-project-error";
  const errorInternId = "historywork-intern-error";
  const errorWorkId = "historywork-work-error";

  const formDescribedBy = useMemo(() => {
    return error ? formErrorId : undefined;
  }, [error]);

  const fieldId = (section, index, name) => `${section}-${index}-${name}`;

  // -------------------------
  // Projects
  // -------------------------
  const [projectName, setProjectName] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const [projectFile, setProjectFile] = useState([
    { fileName: "", fileType: "", fileUrl: "", fileSize: "" },
  ]);

  const handleProjectName = (val, index) => {
    const newTemp = val;
    setProjectName((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      while (updated.length <= index) updated.push("");
      updated[index] = newTemp;
      return updated;
    });
  };

  const handleProjectDetail = (val, index) => {
    const newTemp = val;
    setProjectDetail((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      while (updated.length <= index) updated.push("");
      updated[index] = newTemp;
      return updated;
    });
  };

  const [projects, setProjects] = useState([{}]);
  const [errorField, setErrorField] = useState("");

  const handleAddProject = () => {
    if (!projectName[projects.length - 1] || !projectDetail[projects.length - 1]) {
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

        setErrorField("");
        setProjectName((prev) => prev.filter((_, i) => i !== index));
        setProjectDetail((prev) => prev.filter((_, i) => i !== index));
        setProjectFile((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

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

    const merged = projectFile;
    if (result.isConfirmed) {
      const updated = [...merged];
      updated[index] = undefined;
      setProjectFile(updated);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  const projectFileInputRef = useRef(null);
  const [projectUploadProgress, setProjectUploadProgress] = useState(0);

  const openFileDialog = () => {
    if (projectFileInputRef.current) projectFileInputRef.current.click();
  };

  const handleProfileDocument = (event, index) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop();
    if (fileExtension !== "pdf" && fileExtension !== "docx") {
      setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
      return;
    }

    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

    const storageRef = ref(
      storage,
      `users/documents/workHistory/${id}/${fileName}`
    );
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setError("");
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProjectUploadProgress(progress);
      },
      (error) => console.error("Error uploading file:", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const newProjectFile = {
              fileName,
              fileType: fileExtension,
              fileUrl: url,
              fileSize: fileSizeMB,
            };

            setProjectFile((prev) => {
              const updated = [...prev];
              updated[index] = newProjectFile;
              return updated;
            });

            setProjectUploadProgress(0);
            if (projectFileInputRef.current) projectFileInputRef.current.value = "";
          })
          .catch((error) => console.error("Error getting download URL:", error));
      }
    );
  };

  // -------------------------
  // Date data
  // -------------------------
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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

  // -------------------------
  // Internship
  // -------------------------
  const [dateStartInternship, setDateStartInternship] = useState([]);
  const [dateEndInternship, setDateEndInternship] = useState([]);
  const [dateStartMonthInternship, setDateStartMonthInternship] = useState([]);
  const [dateEndMonthInternship, setDateEndMonthInternship] = useState([]);
  const [placeInternship, setPlaceInternship] = useState([]);
  const [positionInternship, setPositionInternship] = useState([]);
  const [internshipFile, setInternshipFile] = useState([
    { fileName: "", fileType: "", fileUrl: "", fileSize: "" },
  ]);

  const handleArraySet = (setter) => (val, index) => {
    const newTemp = val;
    setter((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      while (updated.length <= index) updated.push("");
      updated[index] = newTemp;
      return updated;
    });
  };

  const handleDateStartInternship = handleArraySet(setDateStartInternship);
  const handleDateEndInternship = handleArraySet(setDateEndInternship);
  const handleDateStartMonthInternship = handleArraySet(setDateStartMonthInternship);
  const handleDateEndMonthInternship = handleArraySet(setDateEndMonthInternship);
  const handlePlaceInternship = handleArraySet(setPlaceInternship);
  const handlePositionInternship = handleArraySet(setPositionInternship);

  const [internships, setInternships] = useState([{}]);
  const [errorFieldInterships, setErrorFieldInterships] = useState("");

  const handleAddInterships = () => {
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
    if (internships.length >= 5) {
      setErrorFieldInterships("");
      return;
    }
    setErrorFieldInterships("");
    setInternships([...internships, {}]);
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
        const newArr = [...internships];
        newArr.splice(index, 1);
        setInternships(newArr);

        setErrorFieldInterships("");
        setDateStartInternship((prev) => prev.filter((_, i) => i !== index));
        setDateEndInternship((prev) => prev.filter((_, i) => i !== index));
        setDateStartMonthInternship((prev) => prev.filter((_, i) => i !== index));
        setDateEndMonthInternship((prev) => prev.filter((_, i) => i !== index));
        setPlaceInternship((prev) => prev.filter((_, i) => i !== index));
        setPositionInternship((prev) => prev.filter((_, i) => i !== index));
        setInternshipFile((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

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

    const merged = internshipFile;

    if (result.isConfirmed) {
      const updated = [...merged];
      updated[index] = undefined;
      setInternshipFile(updated);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  const internFileInputRef = useRef(null);
  const [internshipFileUploadProgress, setInternshipUploadProgress] = useState(0);

  const openFileDialogInternship = () => {
    if (internFileInputRef.current) internFileInputRef.current.click();
  };

  const handleInternshipDocument = (event, index) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop();
    if (fileExtension !== "pdf" && fileExtension !== "docx") {
      setError("กรุณาอัปโหลดไฟล์ PDF, Word เท่านั้น");
      return;
    }

    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    const fileName = selectedFile.name.split(".").slice(0, -1).join(".");

    const storageRef = ref(storage, `users/documents/internship/${id}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setError("");
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setInternshipUploadProgress(progress);
      },
      (error) => console.error("Error uploading file:", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const newFile = {
              fileName,
              fileType: fileExtension,
              fileUrl: url,
              fileSize: fileSizeMB,
            };

            setInternshipFile((prev) => {
              const updated = [...prev];
              updated[index] = newFile;
              return updated;
            });

            setInternshipUploadProgress(0);
            if (internFileInputRef.current) internFileInputRef.current.value = "";
          })
          .catch((error) => console.error("Error getting download URL:", error));
      }
    );
  };

  // -------------------------
  // Work Experience
  // -------------------------
  const [dateStartWork, setDateStartWork] = useState([]);
  const [dateEndWork, setDateEndWork] = useState([]);
  const [dateStartMonthWork, setDateStartMonthWork] = useState([]);
  const [dateEndMonthWork, setDateEndMonthWork] = useState([]);
  const [placeWork, setPlaceWork] = useState([]);
  const [positionWork, setPositionWork] = useState([]);
  const [workFile, setWorkFile] = useState([
    { fileName: "", fileType: "", fileUrl: "", fileSize: "" },
  ]);

  const handleDateStartWork = handleArraySet(setDateStartWork);
  const handleDateEndWork = handleArraySet(setDateEndWork);
  const handleDateStartMonthWork = handleArraySet(setDateStartMonthWork);
  const handleDateEndMonthWork = handleArraySet(setDateEndMonthWork);
  const handlePlaceWork = handleArraySet(setPlaceWork);
  const handlePositionWork = handleArraySet(setPositionWork);

  const [works, setWorks] = useState([{}]);
  const [errorFieldWorks, setErrorFieldWorks] = useState("");

  const handleAddWork = () => {
    if (
      !dateStartWork[works.length - 1] ||
      !dateEndWork[works.length - 1] ||
      !placeWork[works.length - 1] ||
      !positionWork[works.length - 1]
    ) {
      setErrorFieldWorks("กรุณากรอกข้อความให้ครบก่อนเพิ่มข้อมูลใหม่");
      return;
    }
    if (works.length >= 5) {
      setErrorFieldWorks("");
      return;
    }
    setErrorFieldWorks("");
    setWorks([...works, {}]);
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

        setErrorFieldWorks("");
        setDateStartWork((prev) => prev.filter((_, i) => i !== index));
        setDateEndWork((prev) => prev.filter((_, i) => i !== index));
        setDateStartMonthWork((prev) => prev.filter((_, i) => i !== index));
        setDateEndMonthWork((prev) => prev.filter((_, i) => i !== index));
        setPlaceWork((prev) => prev.filter((_, i) => i !== index));
        setPositionWork((prev) => prev.filter((_, i) => i !== index));
        setWorkFile((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

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

    const merged = workFile;

    if (result.isConfirmed) {
      const updated = [...merged];
      updated[index] = undefined;
      setWorkFile(updated);
      toast.success("ลบไฟล์สำเร็จ ", `${name} ถูกลบเรียบร้อยแล้ว`);
    }
  }

  const workFileInputRef = useRef(null);
  const [workFileUploadProgress, setWorkFileUploadProgress] = useState(0);

  const openFileDialogWork = () => {
    if (workFileInputRef.current) workFileInputRef.current.click();
  };

  const handleWorkDocument = (event, index) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop();
    if (fileExtension !== "pdf" && fileExtension !== "docx" && fileExtension !== "doc") {
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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setWorkFileUploadProgress(progress);
      },
      (error) => console.error("Error uploading file:", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const newFile = {
              fileName,
              fileType: fileExtension,
              fileUrl: url,
              fileSize: fileSizeMB,
            };

            setWorkFile((prev) => {
              const updated = [...prev];
              updated[index] = newFile;
              return updated;
            });

            setWorkFileUploadProgress(0);
            if (workFileInputRef.current) workFileInputRef.current.value = "";
          })
          .catch((error) => console.error("Error getting download URL:", error));
      }
    );
  };

  // -------------------------
  // Submit + Default set
  // -------------------------
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

    // check date range internship (year compares)
    const isInvalidDateRange = mergedDateStartInternship.find((dateStart, i) => {
      const dateEnd = mergedDateEndInternship[i];
      return new Date(dateEnd) < new Date(dateStart);
    });
    if (isInvalidDateRange) {
      setError("ระบุปีการฝึกงานไม่ถูกต้อง");
      return;
    }

    const isInvalidDateRangeWork = mergedDateStartWork.find((dateStart, i) => {
      const dateEnd = mergedDateEndWork[i];
      return new Date(dateEnd) < new Date(dateStart);
    });
    if (isInvalidDateRangeWork) {
      setError("ระบุปีการทำงานไม่ถูกต้อง");
      return;
    }

    fieldProjects -= 1;
    fieldInternship -= 1;
    fieldWorks -= 1;

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

    if (hasAnyWorkField && !isWorkFieldComplete) {
      setError("กรุณาระบุข้อมูล การทำงาน ให้ครบทุกช่อง");
      return;
    }

    const hasAnyField = hasAnyProjectField || hasAnyInternshipField || hasAnyWorkField;
    if (!hasAnyField) {
      setError("ไม่มีข้อมูลที่บันทึก");
      return;
    }

    setError("");

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
      const response = await updateHistoryWorkById(data);

      if (response.ok) {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setEditMode(false);
        if (handleStep) handleStep();
      } else {
        toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        setEditMode(false);
      }
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("เกิดข้อผิดพลาด ");
      setEditMode(false);
    }
  }

  useEffect(() => {
    if (!dataHistoryWork) return;

    setProjectName(dataHistoryWork.projects?.map((p) => p.name) || []);
    setProjectDetail(dataHistoryWork.projects?.map((p) => p.detail) || []);
    setProjectFile(dataHistoryWork.projects?.flatMap((p) => p.files) || []);

    setDateStartInternship(dataHistoryWork.internships?.map((i) => i.dateStart) || []);
    setDateEndInternship(dataHistoryWork.internships?.map((i) => i.dateEnd) || []);
    setDateStartMonthInternship(dataHistoryWork.internships?.map((i) => i.dateStartMonth) || []);
    setDateEndMonthInternship(dataHistoryWork.internships?.map((i) => i.dateEndMonth) || []);
    setPlaceInternship(dataHistoryWork.internships?.map((i) => i.place) || []);
    setPositionInternship(dataHistoryWork.internships?.map((i) => i.position) || []);
    setInternshipFile(dataHistoryWork.internships?.flatMap((i) => i.files) || []);

    setDateStartWork(dataHistoryWork.workExperience?.map((w) => w.dateStart) || []);
    setDateEndWork(dataHistoryWork.workExperience?.map((w) => w.dateEnd) || []);
    setDateStartMonthWork(dataHistoryWork.workExperience?.map((w) => w.dateStartMonth) || []);
    setDateEndMonthWork(dataHistoryWork.workExperience?.map((w) => w.dateEndMonth) || []);
    setPlaceWork(dataHistoryWork.workExperience?.map((w) => w.place) || []);
    setPositionWork(dataHistoryWork.workExperience?.map((w) => w.position) || []);
    setWorkFile(dataHistoryWork.workExperience?.flatMap((w) => w.files) || []);

    setStatusNow(dataHistoryWork?.statusNow || "0");

    if (Array.isArray(dataHistoryWork.projects) && dataHistoryWork.projects.length > 0) {
      setProjects(dataHistoryWork.projects);
    }
    if (Array.isArray(dataHistoryWork.internships) && dataHistoryWork.internships.length > 0) {
      setInternships(dataHistoryWork.internships);
    }
    if (Array.isArray(dataHistoryWork.workExperience) && dataHistoryWork.workExperience.length > 0) {
      setWorks(dataHistoryWork.workExperience);
    }
  }, [dataHistoryWork]);

  //Download file
  const handleDownloadFile = async (filePath, fileName) => {
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    try {
      const downloadURL = await getDownloadURL(fileRef);
      const response = await fetch(downloadURL);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", err);
    }
  };

  function openFile(fileUrl) {
    window.open(fileUrl, "_blank");
  }

  // status now
  const [statusNow, setStatusNow] = useState("");
  const [getStatusNow, setGetStatusNow] = useState("");

  // progressbar fields
  const fieldProgress = [
    // projectName[0],
    // projectDetail[0],
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
      onSubmit={(e) => handleSubmit(e, projects.length, internships.length, works.length)}
      className={`${bgColorMain2} ${bgColor} ${fontSize} flex flex-col gap-16`}
      aria-describedby={formDescribedBy}
    >
      {/* Projects */}
      {/*  
      <div>
        <p className="mb-2">โครงงาน / ผลงาน</p>
        <hr />

        {projects.map((_, index) => {
          const nameId = fieldId("project", index, "name");
          const detailId = fieldId("project", index, "detail");
          const fileId = fieldId("project", index, "file");

          return (
            <div key={index}>
              {index > 0 && editMode && (
                <div className="flex flex-col justify-end w-full mt-5">
                  <button
                    type="button"
                    className={`rounded-lg w-fit ${focusRing}`}
                    onClick={() => handleRemoveProject(index)}
                    aria-label="ลบโครงงาน/ผลงานรายการนี้"
                  >
                    <Icon className="text-red-500" path={mdiCloseCircle} size={1} aria-hidden="true" />
                  </button>
                </div>
              )}

              {index > 0 && !editMode && <hr className="mt-5" />}

              <div className="mt-5 flex gap-5 flex-wrap">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={nameId}>
                    ชื่อโครงงาน / ผลงาน{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="ระบุชื่อโครงงานหรือผลงาน"
                    defaultValue={projectName[index] || ""}
                    onBlur={(e) => handleProjectName(e.target.value, index)}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={detailId}>
                    รายละเอียด{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={detailId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-96 border border-gray-400 py-2 px-4 rounded-lg`}
                    readOnly={!editMode}
                    placeholder="รายละเอียดเพิ่มเติม"
                    defaultValue={projectDetail[index] || ""}
                    onBlur={(e) => handleProjectDetail(e.target.value, index)}
                  />
                </div>

                <div className={`${bgColorMain} flex flex-col gap-1 w-full sm:w-auto`}>
                  {projectFile[index]?.fileUrl || editMode ? (
                    <label htmlFor={fileId}>เอกสารประกอบ</label>
                  ) : null}

                  {projectFile[index] && projectFile[index]?.fileUrl !== "" ? (
                    <div className="mt-1 w-full sm:w-fit py-2 flex flex-wrap gap-4 sm:gap-8 items-center">
                      <button
                        type="button"
                        className={`underline text-left ${focusRing}`}
                        onClick={() => openFile(projectFile[index]?.fileUrl)}
                        aria-label={`เปิดไฟล์ ${projectFile[index]?.fileName}.${projectFile[index]?.fileType}`}
                      >
                        {projectFile[index]?.fileName}.{projectFile[index]?.fileType}
                      </button>

                      <p className="text-gray-500">{projectFile[index]?.fileSize} MB</p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={focusRing}
                          onClick={() =>
                            handleDownloadFile(
                              projectFile[index]?.fileUrl,
                              projectFile[index]?.fileName
                            )
                          }
                          aria-label="ดาวน์โหลดไฟล์"
                        >
                          <Icon path={mdiDownload} size={1} aria-hidden="true" />
                        </button>

                        {editMode && (
                          <button
                            type="button"
                            className={focusRing}
                            onClick={() =>
                              handleDeleteFileProject(projectFile[index]?.fileName, index)
                            }
                            aria-label="ลบไฟล์"
                          >
                            <Icon path={mdiDelete} size={1} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    editMode && (
                      <div className="mt-1 w-full sm:w-fit">
                        <input
                          id={fileId}
                          type="file"
                          ref={projectFileInputRef}
                          onChange={(e) => handleProfileDocument(e, index)}
                          hidden
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                        <button
                          type="button"
                          onClick={openFileDialog}
                          className={`border rounded-lg py-2 px-8 text-center ${inputEditColor}
                            ${editMode ? "cursor-pointer" : "cursor-not-allowed"} ${focusRing}`}
                        >
                          Choose File
                        </button>

                        {projectUploadProgress > 0 && (
                          <p className="mt-2" aria-live="polite">
                            กำลังอัปโหลด: {projectUploadProgress.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {errorField && (
          <div id={errorProjectId} className="mt-3 text-red-500" role="alert" aria-live="polite">
            *{errorField}
          </div>
        )}

        {projects.length < 5 && editMode && (
          <div className="flex flex-col justify-end w-full mt-5">
            <button
              type="button"
              className={`rounded-lg bg-[#4a94ff] w-fit ${focusRing}`}
              onClick={handleAddProject}
              aria-label="เพิ่มโครงงาน/ผลงาน"
            >
              <Icon className="text-white mx-3" path={mdiPlus} size={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      */}

      {/* Internship */}
      <div>
        <p className="mb-2">ประสบการณ์ ฝึกงาน</p>
        <hr />

        {internships.map((_, index) => {
          const sYearId = fieldId("intern", index, "startYear");
          const sMonthId = fieldId("intern", index, "startMonth");
          const eYearId = fieldId("intern", index, "endYear");
          const eMonthId = fieldId("intern", index, "endMonth");
          const placeId = fieldId("intern", index, "place");
          const posId = fieldId("intern", index, "position");
          const fileId = fieldId("intern", index, "file");

          return (
            <div key={index}>
              {index > 0 && editMode && (
                <div className="flex flex-col justify-end w-full mt-5">
                  <button
                    type="button"
                    className={`rounded-lg w-fit ${focusRing}`}
                    onClick={() => handleRemoveInternship(index)}
                    aria-label="ลบการฝึกงานรายการนี้"
                  >
                    <Icon className="text-red-500" path={mdiCloseCircle} size={1} aria-hidden="true" />
                  </button>
                </div>
              )}

              {index > 0 && !editMode && <hr className="mt-5" />}

              <div className="mt-5 flex gap-5 flex-wrap">
                {/* ตั้งแต่ */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label>
                    ตั้งแต่{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={sYearId}>ปีเริ่มฝึกงาน</label>
                      <select
                        id={sYearId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateStartInternship(e.target.value, index)}
                        value={dateStartInternship[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">ปี</option>
                        {years.map((y, i) => (
                          <option key={i} value={y}>{y}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={sMonthId}>เดือนเริ่มฝึกงาน</label>
                      <select
                        id={sMonthId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateStartMonthInternship(e.target.value, index)}
                        value={dateStartMonthInternship[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">เดือน</option>
                        {thaiMonths.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* ถึง */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label>
                    ถึง{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={eYearId}>ปีสิ้นสุดฝึกงาน</label>
                      <select
                        id={eYearId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateEndInternship(e.target.value, index)}
                        value={dateEndInternship[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">-</option>
                        <option value="ปัจจุบัน">ปัจจุบัน</option>
                        {years.map((y, i) => (
                          <option key={i} value={y}>{y}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={eMonthId}>เดือนสิ้นสุดฝึกงาน</label>
                      <select
                        id={eMonthId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateEndMonthInternship(e.target.value, index)}
                        value={dateEndMonthInternship[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">เดือน</option>
                        <option value="ปัจจุบัน">ปัจจุบัน</option>
                        {thaiMonths.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* สถานที่ฝึกงาน */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={placeId}>
                    สถานที่ฝึกงาน{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={placeId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="ระบุสถานที่ฝึกงาน"
                    onBlur={(e) => handlePlaceInternship(e.target.value, index)}
                    defaultValue={placeInternship[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                {/* ตำแหน่ง */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={posId}>
                    ตำแหน่ง{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={posId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="ระบุตำแหน่งที่ฝึกงาน"
                    onBlur={(e) => handlePositionInternship(e.target.value, index)}
                    defaultValue={positionInternship[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                {/* ไฟล์ */}
                <div className={`${bgColorMain} flex flex-col gap-1 w-full sm:w-auto`}>
                  {internshipFile[index]?.fileUrl || editMode ? (
                    <label htmlFor={fileId}>เอกสารประกอบ</label>
                  ) : null}

                  {internshipFile[index] && internshipFile[index]?.fileUrl !== "" ? (
                    <div className="mt-1 w-full sm:w-fit py-2 flex flex-wrap gap-4 sm:gap-8 items-center">
                      <button
                        type="button"
                        className={`underline text-left ${focusRing}`}
                        onClick={() => openFile(internshipFile[index]?.fileUrl)}
                        aria-label={`เปิดไฟล์ ${internshipFile[index]?.fileName}.${internshipFile[index]?.fileType}`}
                      >
                        {internshipFile[index]?.fileName}.{internshipFile[index]?.fileType}
                      </button>

                      <p className="text-gray-500">{internshipFile[index]?.fileSize} MB</p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={focusRing}
                          onClick={() =>
                            handleDownloadFile(
                              internshipFile[index]?.fileUrl,
                              internshipFile[index]?.fileName
                            )
                          }
                          aria-label="ดาวน์โหลดไฟล์"
                        >
                          <Icon path={mdiDownload} size={1} aria-hidden="true" />
                        </button>

                        {editMode && (
                          <button
                            type="button"
                            className={focusRing}
                            onClick={() =>
                              handleDeleteFileInternship(internshipFile[index]?.fileName, index)
                            }
                            aria-label="ลบไฟล์"
                          >
                            <Icon path={mdiDelete} size={1} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    editMode && (
                      <div className="mt-1 w-full sm:w-fit">
                        <input
                          id={fileId}
                          type="file"
                          ref={internFileInputRef}
                          onChange={(e) => handleInternshipDocument(e, index)}
                          hidden
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                        <button
                          type="button"
                          onClick={openFileDialogInternship}
                          className={`border rounded-lg py-2 px-8 text-center ${inputEditColor}
                            ${editMode ? "cursor-pointer" : "cursor-not-allowed"} ${focusRing}`}
                        >
                          Choose File
                        </button>

                        {internshipFileUploadProgress > 0 && (
                          <p className="mt-2" aria-live="polite">
                            กำลังอัปโหลด: {internshipFileUploadProgress.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {errorFieldInterships && (
          <div id={errorInternId} className="mt-3 text-red-500" role="alert" aria-live="polite">
            *{errorFieldInterships}
          </div>
        )}

        {internships.length < 5 && editMode && (
          <div className="flex flex-col justify-end w-full mt-5">
            <button
              type="button"
              className={`rounded-lg bg-[#4a94ff] w-fit ${focusRing}`}
              onClick={handleAddInterships}
              aria-label="เพิ่มการฝึกงาน"
            >
              <Icon className="text-white mx-3" path={mdiPlus} size={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Work */}
      <div>
        <p className="mb-2">ประสบการณ์ การทำงาน</p>
        <hr />

        {works.map((_, index) => {
          const sYearId = fieldId("work", index, "startYear");
          const sMonthId = fieldId("work", index, "startMonth");
          const eYearId = fieldId("work", index, "endYear");
          const eMonthId = fieldId("work", index, "endMonth");
          const placeId = fieldId("work", index, "place");
          const posId = fieldId("work", index, "position");
          const fileId = fieldId("work", index, "file");

          return (
            <div key={index}>
              {index > 0 && editMode && (
                <div className="flex flex-col justify-end w-full mt-5">
                  <button
                    type="button"
                    className={`rounded-lg w-fit ${focusRing}`}
                    onClick={() => handleRemoveWork(index)}
                    aria-label="ลบการทำงานรายการนี้"
                  >
                    <Icon className="text-red-500" path={mdiCloseCircle} size={1} aria-hidden="true" />
                  </button>
                </div>
              )}

              {index > 0 && !editMode && <hr className="mt-5" />}

              <div className="mt-5 flex gap-5 flex-wrap">
                {/* ตั้งแต่ */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label>
                    ตั้งแต่{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={sYearId}>ปีเริ่มทำงาน</label>
                      <select
                        id={sYearId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateStartWork(e.target.value, index)}
                        value={dateStartWork[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">-</option>
                        {years.map((y, i) => (
                          <option key={i} value={y}>{y}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={sMonthId}>เดือนเริ่มทำงาน</label>
                      <select
                        id={sMonthId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateStartMonthWork(e.target.value, index)}
                        value={dateStartMonthWork[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">เดือน</option>
                        {thaiMonths.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* ถึง */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label>
                    ถึง{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={eYearId}>ปีสิ้นสุดทำงาน</label>
                      <select
                        id={eYearId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateEndWork(e.target.value, index)}
                        value={dateEndWork[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">-</option>
                        <option value="ปัจจุบัน">ปัจจุบัน</option>
                        {years.map((y, i) => (
                          <option key={i} value={y}>{y}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="relative w-full sm:w-fit mt-1">
                      <label className="sr-only" htmlFor={eMonthId}>เดือนสิ้นสุดทำงาน</label>
                      <select
                        id={eMonthId}
                        className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                          cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-36
                          border border-gray-400 py-2 px-4 rounded-lg`}
                        style={{ appearance: "none" }}
                        onChange={(e) => handleDateEndMonthWork(e.target.value, index)}
                        value={dateEndMonthWork[index] || ""}
                        disabled={!editMode}
                      >
                        <option value="">เดือน</option>
                        <option value="ปัจจุบัน">ปัจจุบัน</option>
                        {thaiMonths.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <Icon
                        className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
                        path={mdiArrowDownDropCircle}
                        size={0.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* สถานที่ทำงาน */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={placeId}>
                    สถานที่ทำงาน{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={placeId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="ระบุสถานที่ทำงาน"
                    onBlur={(e) => handlePlaceWork(e.target.value, index)}
                    defaultValue={placeWork[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                {/* ตำแหน่ง */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor={posId}>
                    ตำแหน่ง{" "}
                    <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
                  </label>
                  <input
                    id={posId}
                    type="text"
                    className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                      mt-1 w-full sm:w-80 border border-gray-400 py-2 px-4 rounded-lg`}
                    placeholder="ระบุตำแหน่งงาน"
                    onBlur={(e) => handlePositionWork(e.target.value, index)}
                    defaultValue={positionWork[index] || ""}
                    readOnly={!editMode}
                  />
                </div>

                {/* ไฟล์ */}
                <div className={`${bgColorMain} flex flex-col gap-1 w-full sm:w-auto`}>
                  {workFile[index]?.fileUrl || editMode ? (
                    <label htmlFor={fileId}>เอกสารประกอบ</label>
                  ) : null}

                  {workFile[index] && workFile[index]?.fileUrl !== "" ? (
                    <div className="mt-1 w-full sm:w-fit py-2 flex flex-wrap gap-4 sm:gap-8 items-center">
                      <button
                        type="button"
                        className={`underline text-left ${focusRing}`}
                        onClick={() => openFile(workFile[index]?.fileUrl)}
                        aria-label={`เปิดไฟล์ ${workFile[index]?.fileName}.${workFile[index]?.fileType}`}
                      >
                        {workFile[index]?.fileName}.{workFile[index]?.fileType}
                      </button>

                      <p className="text-gray-500">{workFile[index]?.fileSize} MB</p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={focusRing}
                          onClick={() =>
                            handleDownloadFile(workFile[index]?.fileUrl, workFile[index]?.fileName)
                          }
                          aria-label="ดาวน์โหลดไฟล์"
                        >
                          <Icon path={mdiDownload} size={1} aria-hidden="true" />
                        </button>

                        {editMode && (
                          <button
                            type="button"
                            className={focusRing}
                            onClick={() => handleDeleteFileWork(workFile[index]?.fileName, index)}
                            aria-label="ลบไฟล์"
                          >
                            <Icon path={mdiDelete} size={1} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    editMode && (
                      <div className="mt-1 w-full sm:w-fit">
                        <input
                          id={fileId}
                          type="file"
                          ref={workFileInputRef}
                          onChange={(e) => handleWorkDocument(e, index)}
                          hidden
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                        <button
                          type="button"
                          onClick={openFileDialogWork}
                          className={`border rounded-lg py-2 px-8 text-center ${inputEditColor}
                            ${editMode ? "cursor-pointer" : "cursor-not-allowed"} ${focusRing}`}
                        >
                          Choose File
                        </button>

                        {workFileUploadProgress > 0 && (
                          <p className="mt-2" aria-live="polite">
                            กำลังอัปโหลด: {workFileUploadProgress.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {errorFieldWorks && (
          <div id={errorWorkId} className="mt-3 text-red-500" role="alert" aria-live="polite">
            *{errorFieldWorks}
          </div>
        )}

        {works.length < 5 && editMode && (
          <div className="flex flex-col justify-end w-full mt-5">
            <button
              type="button"
              className={`rounded-lg bg-[#4a94ff] w-fit ${focusRing}`}
              onClick={handleAddWork}
              aria-label="เพิ่มการทำงาน"
            >
              <Icon className="text-white mx-3" path={mdiPlus} size={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <p className="mb-2">สถานะปัจจุบัน</p>
        <hr />
        <div className="mt-5">
          <div className="relative w-full sm:w-fit mt-1">
            <label className="sr-only" htmlFor="statusNowSelect">เลือกสถานะปัจจุบัน</label>
            <select
              id="statusNowSelect"
              className={`${!editMode ? "editModeTrue" : ""} ${bgColorMain} ${focusRing}
                cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-full sm:w-44
                border border-gray-400 py-2 px-4 rounded-lg`}
              style={{ appearance: "none" }}
              onChange={(e) => setStatusNow(e.target.value)}
              value={statusNow || getStatusNow || ""}
              disabled={!editMode}
            >
              <option value="">เลือกสถานะ</option>
              {dataStatus.map((item, i) => (
                <option key={i} value={item}>{item}</option>
              ))}
            </select>
            <Icon
              className="pointer-events-none text-gray-400 absolute right-0 top-[10px] mx-3"
              path={mdiArrowDownDropCircle}
              size={0.8}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        {error && (
          <div className="w-full text-center my-5">
            <p id={formErrorId} className="text-red-500" role="alert" aria-live="polite">
              * {error}
            </p>
          </div>
        )}

        {editMode && <ProgressBarForm fields={fieldProgress} />}

        {!readOnly && (
          <ButtonGroup editMode={editMode} setEditMode={setEditMode} tailwind="mt-5" />
        )}
      </div>
    </form>
  );
}

export default HistoryWorkForm;
