"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiFileDocument,
  mdiMicrosoftExcel,
  mdiMagnify,
  mdiArrowDownDropCircle,
} from "@mdi/js";

//select datas
import universitys from "@/app/data/universitys.json";
import dataWorkType from "@/assets/dataWorkType";
import dataDisabled from "@/assets/dataDisabled";

//hooks
import { useExcelExport } from "@/hooks/useExcelExport";
import { exportToCSV } from "@/hooks/useCsvExport"; // หรือ "@/utils/csvExport"

//component
import ReportTable from "@/app/components/Table/ReportTable";
import SelectFilter from "@/app/components/Form/SelectFilter";

// รายงานลักษณะงานที่สนใจ
const columnWork = [
  { id: "number", label: "ลำดับ", minWidth: 50 },
  { id: "work", label: "ลักษณะงานที่สนใจ", minWidth: 170 },
  { id: "totalStudent", label: "จำนวนนักศึกษา", minWidth: 170 },
  { id: "totalGraduation", label: "จำนวนบัณฑิต", minWidth: 170 },
  { id: "total", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

// รายงานตามประเภทบุคคล
const columnTypePerson = [
  { id: "number", label: "ลำดับ", minWidth: 50 },
  { id: "typePerson", label: "ประเภทบุคคล", minWidth: 170 },
  { id: "total", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

// รายงานตามประเภทความพิการ
const columnDisabled = [
  { id: "number", label: "ลำดับ", minWidth: 50 },
  { id: "disabledType", label: "ประเภทความพิการ", minWidth: 170 },
  { id: "totalStudent", label: "จำนวนนักศึกษา", minWidth: 170 },
  { id: "totalGraduation", label: "จำนวนบัณฑิต", minWidth: 170 },
  { id: "total", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

// รายงานนักศึกษาตามสถาบันการศึกษา
const columnStudents = [
  { id: "name", label: "ลำดับ", minWidth: 170 },
  { id: "university", label: "สถาบันการศึกษา", minWidth: 170 },
  { id: "level", label: "จำนวนนักศึกษา", minWidth: 170, align: "center" },
  { id: "disabled", label: "จำนวนบัณฑิตพิการ", minWidth: 170, align: "center" },
  { id: "details", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

function ReportPage() {
  const [studentData, setStudentData] = useState([]);
  const [loaderTable, setLoaderTable] = useState(true);
  const [dataWorks, setDataWorks] = useState([]);
  const [dataEducations, setDataEducations] = useState(null);
  const [typePersonSearch, setTypePersonSearch] = useState("");
  const [header, setHeader] = useState("แยกตามจำนวน");
  const [content, setContent] = useState("ตามมหาวิทยาลัย");
  const [contentType, setContentType] = useState("ทั้งหมด");
  const [universityActive, setUniversityActive] =
    useState("มหาวิทยาลัยทั้งหมด");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { data: session } = useSession();
  const { exportExcel } = useExcelExport();

  // Theme
  const { bgColor, bgColorWhite, bgColorMain, bgColorMain2, inputGrayColor } =
    useTheme();

  // Lifecycle: Fetch initial data
  useEffect(() => {
    fetchStudentData();
    fetchEducationData();
    fetchWorkData();
  }, []);

  // Fetch: นักศึกษา
  async function fetchStudentData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/students`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await res.json();
      setStudentData(data.user || {});
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoaderTable(false);
    }
  }

  // Fetch: ลักษณะงานที่สนใจ
  async function fetchWorkData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch work data");
      }

      const data = await res.json();
      setDataWorks(data.interestedWork || {});
    } catch (error) {
      console.error("Error fetching work data:", error);
    }
  }

  // Fetch: การศึกษา
  async function fetchEducationData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch education data");
      }

      const data = await res.json();
      setDataEducations(data.educations || {});
    } catch (error) {
      console.error("Error fetching education data:", error);
    }
  }

  // ---------- Filtered Student Data ----------
  const studentDataReal = studentData.filter((item) => {
    const isValidType = ["นักศึกษาพิการ", "บัณฑิตพิการ"].includes(
      item.typePerson
    );
    const matchUniversity =
      universityActive === "มหาวิทยาลัยทั้งหมด" || // แสดงทั้งหมดถ้าเลือก "ทั้งหมด"
      dataEducations.find(
        (edu) =>
          edu.uuid === item.uuid && edu.university?.includes(universityActive)
      );

    return isValidType && matchUniversity;
  });

  //table
  function createData(name, university, level, disabled, details, uuid) {
    return { name, university, level, disabled, details, uuid };
  }
  // สร้างปีย้อนหลัง 10 ปีจากปีปัจจุบัน
  const yearToday = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => yearToday - i);

  // เก็บข้อมูลตามปีและรวมทั้งหมด
  let universityByYear = [];
  let count = 0;

  // รวมข้อมูลจาก studentData และ dataEducations
  studentDataReal?.forEach((std) => {
    if (std?.role !== "user" || std?.uuid === session?.user?.id) return;

    const year = std?.createdAt?.split("-")[0];
    const education = dataEducations?.find((edu) => edu?.uuid === std?.uuid);
    if (!education?.university) return;

    const type = education?.typePerson;
    if (!["นักศึกษาพิการ", "บัณฑิตพิการ"].includes(type)) return;

    // ดึงหรือสร้างข้อมูลตามปี
    const getYearData = (targetYear) => {
      let yearGroup = universityByYear.find((item) => item.year === targetYear);
      if (!yearGroup) {
        yearGroup = { year: targetYear, data: [] };
        universityByYear.push(yearGroup);
      }
      return yearGroup;
    };

    const yearGroup = getYearData(year);
    const allGroup = getYearData("all");

    education.university.forEach((uni) => {
      const updateGroup = (group) => {
        const existing = group.data.find((item) => item.university === uni);
        if (existing) {
          if (type === "นักศึกษาพิการ") existing.student += 1;
          else if (type === "บัณฑิตพิการ") existing.graduation += 1;
        } else {
          group.data.push({
            university: uni,
            student: type === "นักศึกษาพิการ" ? 1 : 0,
            graduation: type === "บัณฑิตพิการ" ? 1 : 0,
          });
        }
      };

      updateGroup(yearGroup);
      updateGroup(allGroup);
    });
  });

  // เลือกข้อมูลจากปีที่ต้องการแสดง
  const selectedYearGroup = universityByYear.find((group) =>
    typePersonSearch ? group.year === typePersonSearch : group.year === "all"
  );

  const showData = selectedYearGroup?.data || [];

  // กรองข้อมูลตามคำค้นหา แล้วแปลงเป็น row
  const rowStudents = showData
    .map((uni) => {
      count++;
      return createData(
        `${count}`,
        uni.university,
        `${uni.student}`,
        `${uni.graduation}`,
        `${uni.student + uni.graduation}`,
        ""
      );
    })
    .filter(Boolean);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // ---------- Static Filter Options ----------
  const haederData = ["แยกตามจำนวน", "แยกตามประเภท"];
  const contentData = [
    "ตามมหาวิทยาลัย",
    "ตามประเภทความพิการ",
    "ตามประเภทบุคคล",
    "ตามลักษณะงานที่สนใจ",
  ];

  const universityData = [
    "มหาวิทยาลัยทั้งหมด",
    ...universitys.map((item) => item.university),
  ];
  const disabledData = ["ทั้งหมด", ...dataDisabled];
  const workData = ["ทั้งหมด", ...dataWorkType];

  // ---------- Summary by TypePerson ----------
  const calculateTotalByType = (type) =>
    showData.reduce(
      (sum, item) =>
        sum + (type === "นักศึกษา" ? item.student : item.graduation),
      0
    );

  const rowTypePerson = [
    {
      number: 1,
      typePerson: "นักศึกษา",
      total: calculateTotalByType("นักศึกษา"),
    },
    { number: 2, typePerson: "บัณฑิต", total: calculateTotalByType("บัณฑิต") },
  ];

  // ---------- Summary by Disability ----------
  const dataDisabledFilter =
    contentType === "ทั้งหมด" && content === "ตามประเภทความพิการ"
      ? dataDisabled
      : dataDisabled.filter((item) => item === contentType);

  const calculateDisabledStats = () =>
    dataDisabledFilter.map((disabledType, index) => {
      let totalStudent = 0;
      let totalGraduation = 0;

      studentDataReal.forEach((user) => {
        if (user.typeDisabled?.includes(disabledType)) {
          if (user.typePerson === "นักศึกษาพิการ") totalStudent++;
          if (user.typePerson === "บัณฑิตพิการ") totalGraduation++;
        }
      });

      return {
        number: index + 1,
        disabledType,
        totalStudent,
        totalGraduation,
        total: totalStudent + totalGraduation,
      };
    });

  const rowDisabled = calculateDisabledStats();

  // ---------- Summary by Work Type ----------
  const dataWorkTypeFilter =
    contentType === "ทั้งหมด" && content === "ตามลักษณะงานที่สนใจ"
      ? dataWorkType
      : dataWorkType.filter((item) => item === contentType);

  const calculateWorkStats = () =>
    dataWorkTypeFilter.map((work, index) => {
      let totalStudent = 0;
      let totalGraduation = 0;

      studentDataReal.forEach((user) => {
        const match = dataWorks.find((item) => item.uuid === user.uuid);
        const hasWorkType = match?.interestedWork?.some((w) => w.type === work);

        if (hasWorkType) {
          if (user.typePerson === "นักศึกษาพิการ") totalStudent++;
          if (user.typePerson === "บัณฑิตพิการ") totalGraduation++;
        }
      });

      return {
        number: index + 1,
        work,
        totalStudent,
        totalGraduation,
        total: totalStudent + totalGraduation,
      };
    });

  const rowWorks = calculateWorkStats();

  const tableConfig = {
    ตามมหาวิทยาลัย: {
      columns: columnStudents,
      rows: rowStudents,
    },
    ตามประเภทความพิการ: {
      columns: columnDisabled,
      rows: rowDisabled,
    },
    ตามประเภทบุคคล: {
      columns: columnTypePerson,
      rows: rowTypePerson,
    },
    ตามลักษณะงานที่สนใจ: {
      columns: columnWork,
      rows: rowWorks,
    },
  };

  const config = tableConfig[content];

  // ---------- Clear Filters ----------
  const handleHeaderChange = (value) => {
    setHeader(value);
    setContent("ตามมหาวิทยาลัย"); // clear child
    setContentType("ทั้งหมด"); // clear grandchild
  };

  const handleContentChange = (value) => {
    setContent(value);
    setContentType("ทั้งหมด"); // clear grandchild
  };

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <div className={`flex flex-col`}>
        <label>หัวข้อรายงาน</label>
        <div className="flex gap-5 mt-3">
          <SelectFilter setValue={handleHeaderChange} data={haederData} />
          {header === "แยกตามจำนวน" && (
            <SelectFilter setValue={handleContentChange} data={contentData} />
          )}
          {content === "ตามประเภทความพิการ" ||
          content === "ตามลักษณะงานที่สนใจ" ? (
            <SelectFilter
              setValue={setContentType}
              data={content === "ตามประเภทความพิการ" ? disabledData : workData}
            />
          ) : null}
        </div>

        <div className="mt-5">
          <SelectFilter setValue={setUniversityActive} data={universityData} />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-1 font-bold">
        <div className="flex justify-between items-end">
          <p>รายงานจำนวนนักศึกษาทั้งหมด จำแนกตามมหาวิทยาลัย</p>
          <div className="relative group">
            <div className={`bg-gray-300 px-4 py-2  cursor-pointer`}>
              Download Dataset
            </div>
            <div
              className={`hidden group-hover:block  ${bgColorMain2} shadow absolute top-[100%] right-0 z-10 w-56`}
            >
              <div
                className="hover:bg-gray-300 relative px-4 py-2 cursor-pointer flex gap-5  items-center"
                onClick={() =>
                  exportToCSV({
                    columns: config.columns, // ใช้ column ที่ใช้ในตารางได้เลย
                    rows: config.rows, // หรือ rowStudents, rowDisabled ฯลฯ
                    fileName: "report.csv",
                  })
                }
              >
                <Icon
                  className={`cursor-pointer text-gray-400 `}
                  path={mdiFileDocument}
                  size={0.7}
                />
                <p className="">Download as CSV File</p>
              </div>
              <div
                className="hover:bg-gray-300 relative px-4 py-2 cursor-pointer flex gap-5 items-center"
                onClick={() =>
                  exportExcel({
                    columns: config.columns,
                    rows: config.rows,
                    sheetName: "รายงาน",
                    fileName: "report.xlsx",
                  })
                }
              >
                <Icon
                  className={`cursor-pointer text-gray-400 `}
                  path={mdiMicrosoftExcel}
                  size={0.7}
                />
                <p className="">Download as Excel File</p>
              </div>
            </div>
          </div>
        </div>
        <hr className={` mb-3 border-gray-500`} />
      </div>
      <form className=" mb-7 flex justify-between flex-wrap gap-y-5 items-end">
        <div className="flex gap-5 gap-y-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label>เลือกช่วงเวลา</label>
            <div className="relative col w-fit">
              <select
                className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                style={{ appearance: "none" }}
                onChange={(e) => setTypePersonSearch(e.target.value)}
              >
                <option value="">ทั้งหมด</option>
                {years?.map((year, index) => (
                  <option key={index} value={year}>
                    ปี {year}
                  </option>
                ))}
              </select>
              <Icon
                className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                path={mdiArrowDownDropCircle}
                size={0.5}
              />
            </div>
          </div>
          <div className="flex items-end">
            <div
              className={` ${bgColorWhite} ${
                inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#0d96f8]" : ""
              }  hover:cursor-pointer py-1 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
            >
              <Icon path={mdiMagnify} size={1} />
              <p>ค้นหา</p>
            </div>
          </div>
        </div>
      </form>

      {config ? (
        loaderTable ? (
          <div className="py-2">กำลังโหลดข้อมูล...</div>
        ) : studentData?.length > 1 ? (
          header === "แยกตามจำนวน" ? (
            <ReportTable
              columns={config.columns}
              resultRows={config.rows}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          ) : (
            <></>
          )
        ) : (
          <>ไม่มีข้อมูล</>
        )
      ) : (
        <>ไม่มีข้อมูล</>
      )}
    </div>
  );
}

export default ReportPage;
