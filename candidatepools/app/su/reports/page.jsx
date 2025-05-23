"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiFileDocument, mdiMicrosoftExcel, mdiMagnify } from "@mdi/js";

//select datas
import dataWorkType from "@/assets/dataWorkType";
import dataDisabled from "@/assets/dataDisabled";

//hooks
import { useExcelExport } from "@/hooks/useExcelExport";
import { exportToCSV } from "@/hooks/useCsvExport"; // หรือ "@/utils/csvExport"

//component
import ReportTable from "@/app/components/Table/ReportTable";
import SelectFilter from "@/app/components/Form/SelectFilter";
import InputUniversityAutoComplete from "@/app/components/Form/InputUniversityAutoComplete";

//enum
import {
  REPORT_CONTENT_TYPE,
  REPORT_HEADER_TYPE,
  REPORT_TYPE_ALL,
  TYPE_PERSON,
} from "@/const/enum";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";

import { dataStatus } from "@/assets/dataStatus";

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
const columnCountUni = [
  { id: "name", label: "ลำดับ", minWidth: 170 },
  { id: "university", label: "สถาบันการศึกษา", minWidth: 170 },
  { id: "student", label: "จำนวนนักศึกษา", minWidth: 170, align: "center" },
  {
    id: "graduation",
    label: "จำนวนบัณฑิตพิการ",
    minWidth: 170,
    align: "center",
  },
  { id: "total", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

const columnCountStatus = [
  { id: "no", label: "ลำดับ", minWidth: 170 },
  { id: "status", label: "สถานะ", minWidth: 170 },
  { id: "student", label: "จำนวนนักศึกษา", minWidth: 170, align: "center" },
  {
    id: "graduation",
    label: "จำนวนบัณฑิตพิการ",
    minWidth: 170,
    align: "center",
  },
  { id: "total", label: "ทั้งหมด", minWidth: 170, align: "center" },
];

// รายงานนักศึกษาตามประเภท
const columnStudentCatagory = [
  { id: "id", label: "ลำดับ", minWidth: 170 },
  { id: "name", label: "ชื่อ-สกุล", minWidth: 170 },
  { id: "university", label: "สถาบันการศึกษา", minWidth: 170, align: "center" },
  { id: "typePerson", label: "ประเภทบุคคล", minWidth: 170, align: "center" },
  { id: "level", label: "ระดับชั้น", minWidth: 170, align: "center" },
  { id: "disabled", label: "ความพิการ", minWidth: 170, align: "center" },
];

function ReportPage() {
  //store
  const { dataStudents } = useUserStore();
  const { dataEducationAll } = useEducationStore();
  const { dataWorkAll } = useInterestedWorkStore();
  const { dataHistoryWorkAll } = useHistoryWorkStore();

  // Theme
  const { bgColor, bgColorWhite, bgColorMain, bgColorMain2, inputGrayColor } =
    useTheme();

  const [dataState, setDataState] = useState();
  const [header, setHeader] = useState(REPORT_TYPE_ALL.HEADER_ALL);
  const [content, setContent] = useState(REPORT_TYPE_ALL.SELECT_TYPE);
  const [contentType, setContentType] = useState(REPORT_TYPE_ALL.ALL);
  const [yearActive, setYearActive] = useState(REPORT_TYPE_ALL.ALL);
  const [universityActive, setUniversityActive] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { exportExcel } = useExcelExport();

  //setDataState
  useEffect(() => {
    if (dataStudents || dataEducationAll || dataWorkAll || dataHistoryWorkAll) {
      setDataState({
        dataStudents,
        dataEducationAll,
        dataWorkAll,
        dataHistoryWorkAll,
      });
    }
  }, [dataStudents, dataEducationAll, dataWorkAll, dataHistoryWorkAll]);

  //filter
  useEffect(() => {
    if (
      !dataStudents ||
      !dataEducationAll ||
      !dataWorkAll ||
      !dataHistoryWorkAll
    )
      return;

    // สร้าง Map สำหรับการเข้าถึงข้อมูลรวดเร็ว
    const educationMap = new Map(
      dataEducationAll.map((item) => [item.uuid, item])
    );
    const workMap = new Map(dataWorkAll.map((item) => [item.uuid, item]));
    const historyMap = new Map(
      dataHistoryWorkAll.map((item) => [item.uuid, item])
    );

    let filteredStudents = [...dataStudents];

    if (yearActive && yearActive !== REPORT_TYPE_ALL.ALL) {
      filteredStudents = filteredStudents.filter((student) => {
        const year = new Date(student.createdAt).getFullYear().toString();
        return year === yearActive;
      });
    }
    if (universityActive) {
      filteredStudents = filteredStudents.filter((student) => {
        const edu = educationMap.get(student.uuid);
        return edu?.university?.some((uniName) =>
          uniName.toLowerCase().includes(universityActive.toLowerCase())
        );
      });
    }

    if (contentType !== REPORT_TYPE_ALL.ALL) {
      if (content === REPORT_CONTENT_TYPE.DISABLED) {
        filteredStudents = filteredStudents.filter((student) =>
          student?.typeDisabled?.some((type) => type === contentType)
        );
      }

      if (content === REPORT_CONTENT_TYPE.INTERESTED_WORK) {
        filteredStudents = filteredStudents.filter((student) => {
          const work = workMap.get(student.uuid);
          return work?.interestedWork?.some(
            (interest) => interest.type === contentType
          );
        });
      }

      if (content === REPORT_CONTENT_TYPE.STATUS) {
        filteredStudents = filteredStudents.filter((student) => {
          const history = historyMap.get(student.uuid);
          return history?.statusNow === contentType;
        });
      }
    }

    // 3. ให้ dataEducationAll, dataWorkAll, dataHistoryWorkAll สอดคล้องกับ filteredStudents
    const filteredUUIDs = new Set(filteredStudents.map((s) => s.uuid));

    const filteredEducation = dataEducationAll.filter((edu) =>
      filteredUUIDs.has(edu.uuid)
    );
    const filteredWork = dataWorkAll.filter((work) =>
      filteredUUIDs.has(work.uuid)
    );
    const filteredHistory = dataHistoryWorkAll.filter((hist) =>
      filteredUUIDs.has(hist.uuid)
    );

    // 4. Set state
    setDataState({
      dataStudents: filteredStudents,
      dataEducationAll: filteredEducation,
      dataWorkAll: filteredWork,
      dataHistoryWorkAll: filteredHistory,
    });
  }, [
    universityActive,
    contentType,
    content,
    yearActive,
    dataStudents,
    dataEducationAll,
    dataWorkAll,
    dataHistoryWorkAll,
  ]);

  if (!dataState) return null;

  // set year 10 later
  const yearToday = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => yearToday - i);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // ---------- Static Filter Options ----------
  const haederData = [
    REPORT_TYPE_ALL.HEADER_ALL,
    REPORT_HEADER_TYPE.COUNT,
    REPORT_HEADER_TYPE.CATEGORY,
  ];

  const contentData = [
    REPORT_TYPE_ALL.SELECT_TYPE,
    ...Object.values(REPORT_CONTENT_TYPE),
  ];

  const yearData = [REPORT_TYPE_ALL.ALL, ...years];
  const disabledData = [REPORT_TYPE_ALL.ALL, ...dataDisabled];
  const workData = [REPORT_TYPE_ALL.ALL, ...dataWorkType];
  const statusData = [REPORT_TYPE_ALL.ALL, ...dataStatus];

  //set rows
  //student rows
  const rowCountUni = (() => {
    const resultMap = new Map();

    dataState?.dataEducationAll?.forEach((edu) => {
      const university = edu.university?.[0];
      const type = edu.typePerson;

      if (!university || !type) return;

      if (!resultMap.has(university)) {
        resultMap.set(university, {
          university,
          student: 0,
          graduation: 0,
        });
      }

      const entry = resultMap.get(university);

      if (type === TYPE_PERSON.STUDENT) {
        entry.student += 1;
      } else if (type === TYPE_PERSON.GRADUATION) {
        entry.graduation += 1;
      }

      resultMap.set(university, entry);
    });

    // แปลงเป็น array พร้อมลำดับ
    const result = Array.from(resultMap.values()).map((entry, index) => ({
      name: (index + 1).toString(),
      university: entry.university,
      student: entry.student,
      graduation: entry.graduation,
      total: entry.student + entry.graduation,
    }));

    return result;
  })();

  //student rows
  const rowCatagoryStudents = () => {
    return dataState?.dataStudents?.map((std, index) => {
      const education = dataState?.dataEducationAll?.find(
        (edu) => edu.uuid === std.uuid
      );

      return {
        id: index + 1,
        name: `${std.firstName} ${std.lastName}`,
        university: education?.university?.join(", ") || "-",
        typePerson: std.typePerson,
        level: education?.educationLevel?.join(", ") || "-",
        disabled: std?.typeDisabled?.join(", ") || "-",
      };
    });
  };

  // disabled rows
  const rowCountDisabled = dataDisabled
    .map((item, index) => {
      // item คือประเภทความพิการ เช่น "พิการทางการเห็น"
      let totalStudent = 0;
      let totalGraduation = 0;

      dataState?.dataStudents?.forEach((std) => {
        const hasThisDisability = std?.typeDisabled?.includes(item);
        if (!hasThisDisability) return;

        if (std.typePerson === TYPE_PERSON.STUDENT) {
          totalStudent += 1;
        } else if (std.typePerson === TYPE_PERSON.GRADUATION) {
          totalGraduation += 1;
        }
      });

      return {
        number: index + 1,
        disabledType: item,
        totalStudent,
        totalGraduation,
        total: totalStudent + totalGraduation,
      };
    })
    .filter((row) =>
      contentType === REPORT_TYPE_ALL.ALL
        ? true
        : row.disabledType === contentType
    );

  //typePerson rows
  const rowCountTypePerson = (() => {
    let totalStudent = 0;
    let totalGraduation = 0;

    dataState?.dataStudents?.forEach((item) => {
      if (item.typePerson === TYPE_PERSON.STUDENT) {
        totalStudent += 1;
      } else if (item.typePerson === TYPE_PERSON.GRADUATION) {
        totalGraduation += 1;
      }
    });
    return [
      {
        number: 1,
        typePerson: TYPE_PERSON.STUDENT,
        total: totalStudent,
      },
      {
        number: 2,
        typePerson: TYPE_PERSON.GRADUATION,
        total: totalGraduation,
      },
    ];
  })();

  //work rows
  const rowCountWork = dataWorkType
    .map((item, index) => {
      let totalStudent = 0;
      let totalGraduation = 0;

      dataState?.dataWorkAll?.forEach((work) => {
        const isInterested = work?.interestedWork?.some(
          (interest) => interest.type === item
        );
        if (!isInterested) return;

        const edu = dataState?.dataEducationAll?.find(
          (e) => e.uuid === work.uuid
        );
        if (!edu?.typePerson) return;

        if (edu.typePerson === TYPE_PERSON.STUDENT) {
          totalStudent += 1;
        } else if (edu.typePerson === TYPE_PERSON.GRADUATION) {
          totalGraduation += 1;
        }
      });
      return {
        number: index + 1,
        work: item,
        totalStudent,
        totalGraduation,
        total: totalStudent + totalGraduation,
      };
    })
    .filter((row) =>
      contentType === REPORT_TYPE_ALL.ALL ? true : row.work === contentType
    );

  //status rows
  const rowCountStatus = dataStatus
    .map((item, index) => {
      let totalStudent = 0;
      let totalGraduation = 0;

      dataState?.dataStudents?.forEach((std) => {
        const work = dataState?.dataHistoryWorkAll.find(
          (his) => his.uuid === std.uuid // แก้ตรงนี้
        );

        if (!work || work.statusNow !== item) return;

        if (std.typePerson === "นักศึกษาพิการ") {
          totalStudent += 1;
        } else if (std.typePerson === "บัณฑิตพิการ") {
          totalGraduation += 1;
        }
      });

      return {
        no: index + 1,
        status: item,
        student: totalStudent,
        graduation: totalGraduation,
        total: totalStudent + totalGraduation,
      };
    })
    .filter((row) =>
      contentType === REPORT_TYPE_ALL.ALL ? true : row.status === contentType
    );

  const tableConfig = {
    หัวข้อทั้งหมด: {
      เลือกประเภท: {
        columns: columnCountUni,
        rows: rowCountUni,
      },
    },
    แยกตามจำนวน: {
      ตามมหาวิทยาลัย: {
        columns: columnCountUni,
        rows: rowCountUni,
      },
      ตามประเภทความพิการ: {
        columns: columnDisabled,
        rows: rowCountDisabled,
      },
      ตามประเภทบุคคล: {
        columns: columnTypePerson,
        rows: rowCountTypePerson,
      },
      ตามลักษณะงานที่สนใจ: {
        columns: columnWork,
        rows: rowCountWork,
      },
      ตามสถานะ: {
        columns: columnCountStatus,
        rows: rowCountStatus,
      },
    },
    แยกตามประเภท: {
      ตามมหาวิทยาลัย: {
        columns: columnStudentCatagory,
        rows: rowCatagoryStudents(),
      },
      ตามประเภทความพิการ: {
        columns: columnStudentCatagory,
        rows: rowCatagoryStudents(),
      },
      ตามประเภทบุคคล: {
        columns: columnStudentCatagory,
        rows: rowCatagoryStudents(),
      },
      ตามลักษณะงานที่สนใจ: {
        columns: columnStudentCatagory,
        rows: rowCatagoryStudents(),
      },
      ตามสถานะ: {
        columns: columnStudentCatagory,
        rows: rowCatagoryStudents(),
      },
    },
  };

  const config = tableConfig[header]?.[content] || {
    columns: [],
    rows: [],
  };

  // ---------- Clear Filters ----------
  const handleHeaderChange = (value) => {
    setHeader(value);
    setContent(REPORT_TYPE_ALL.SELECT_TYPE);
    setPage(0);
  };

  const handleContentType = (value) => {
    setContentType(value);
    setPage(0);
  };

  const handleChangeUniSearch = (value) => {
    setUniversityActive(value);
    setPage(0);
  };

  const handleChangeYear = (value) => {
    setYearActive(value);
    setPage(0);
  };

  const handleContentChange = (value) => {
    setContent(value);
    setContentType(REPORT_TYPE_ALL.ALL); // clear grandchild
    setPage(0);
  };

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <div className={`flex flex-col`}>
        <label>หัวข้อรายงาน</label>
        <div className="flex gap-5 mt-3">
          <SelectFilter setValue={handleHeaderChange} data={haederData} />
          {header !== REPORT_TYPE_ALL.HEADER_ALL && (
            <SelectFilter setValue={handleContentChange} data={contentData} />
          )}
          {content === REPORT_CONTENT_TYPE.DISABLED ||
          content === REPORT_CONTENT_TYPE.INTERESTED_WORK ||
          content === REPORT_CONTENT_TYPE.STATUS ? (
            <SelectFilter
              setValue={handleContentType}
              data={
                content === REPORT_CONTENT_TYPE.DISABLED
                  ? disabledData
                  : content === REPORT_CONTENT_TYPE.INTERESTED_WORK
                  ? workData
                  : statusData
              }
            />
          ) : null}
        </div>

        <div className="mt-5">
          <InputUniversityAutoComplete
            value={universityActive}
            onChange={handleChangeUniSearch}
            placeholder="ค้นหาจากชื่อมหาวิทยาลัย"
            tailwind={`w-96`}
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-1 font-bold">
        <div className="flex justify-between items-end">
          <p>รายงานจำนวนทั้งหมด</p>
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
            <SelectFilter
              setValue={handleChangeYear}
              data={yearData}
              tailwind="w-40"
            />
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
      {config && dataState?.dataStudents?.length > 0 ? (
        <ReportTable
          columns={config.columns}
          resultRows={config.rows}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null}
    </div>
  );
}

export default ReportPage;
