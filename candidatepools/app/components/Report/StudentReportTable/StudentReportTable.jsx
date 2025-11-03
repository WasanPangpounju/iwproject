"use client";

import React, { useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiAlertCircle,
  mdiMagnify,
  mdiArrowDownDropCircle,
  mdiCloseThick,
} from "@mdi/js";
import dataWorkType from "@/assets/dataWorkType";
import Link from "next/link";

//table
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ROLE, TYPE_PERSON } from "@/const/enum";

const columns = [
  {
    id: "name",
    label: "ชื่อ-สกุล",
    minWidth: 170,
  },
  {
    id: "university",
    label: "สถาบันการศึกษา",
    minWidth: 170,
  },
  {
    id: "level",
    label: "ระดับชั้น",
    minWidth: 170,
  },
  {
    id: "disabled",
    label: "ความพิการ",
    minWidth: 170,
  },
  {
    id: "details",
    label: "รายละเอียด",
    minWidth: 170,
    align: "center",
  },
];

function StudentReportTable({
  dataStudents,
  dataEducationAll,
  dataHistoryWorkAll,
  dataWorkAll,
  path,
}) {
  //Theme
  const { bgColor, bgColorWhite, bgColorMain, bgColorMain2, inputGrayColor } =
    useTheme();

  //table
  function createData(name, university, level, disabled, details, uuid) {
    return { name, university, level, disabled, details, uuid };
  }

  //type search
  const [wordSearch, setWordSearch] = useState("");
  const [typeDisabledSearch, setTypeDisabledSearch] = useState("");
  const [typePersonSearch, setTypePersonSearch] = useState("");
  const [workSearch, setWorkSearch] = useState("");
  const [statusWorkSearch, setStatusWorkSearch] = useState("");

  //handle search filter
  const [wordSearchFilter, setWordSearchFilter] = useState([]);

  function handleSearch(e) {
    e.preventDefault();

    if (wordSearch) {
      setWordSearchFilter(() => {
        setWordSearch("");
        return [wordSearch]; // แทนที่คำค้นหาใหม่
      });
    }
  }

  function deleteWordSearch(index) {
    setWordSearchFilter((prev) => {
      // ใช้ filter เพื่อลบคำที่ตรงกับ index
      return prev.filter((_, i) => i !== index);
    });
  }

  const rows = dataStudents
    ?.map((std, index) => {
      const tempWordSearch =
        wordSearchFilter?.length === 0 ? [wordSearch] : wordSearchFilter;
      const education = dataEducationAll?.find(
        (edu) => edu?.uuid === std?.uuid
      );
      const statusNowWork = dataHistoryWorkAll?.find(
        (w) => w.uuid === std?.uuid
      );
      const name = `${std?.firstName} ${std?.lastName}`;

      const interestedWork = dataWorkAll?.find(
        (work) => work?.uuid === std?.uuid
      );
      const updatedStd = {
        ...std,
        interestedWork:
          interestedWork?.interestedWork &&
          interestedWork.interestedWork.length > 0
            ? interestedWork.interestedWork
            : [
                {
                  detail: "temp",
                  province: "temp",
                  type: "temp",
                },
              ],
      };

      const hasMatchUniversityFilter = education?.university?.find((uni) =>
        tempWordSearch?.some((word) =>
          uni.toLowerCase().includes(word.toLowerCase())
        )
      );

      const hasMatchNameFilter = tempWordSearch?.some((word) =>
        name?.toLowerCase().includes(word.toLowerCase())
      );

      const tempWordUniversity = education?.university?.find((uni) =>
        uni.toLowerCase().includes(wordSearch.toLowerCase())
      );
      const hasMatchUniversity = education?.university?.some((uni) =>
        uni.toLowerCase().includes(tempWordUniversity?.toLowerCase())
      );

      const hasMatchName = name
        ?.toLowerCase()
        .includes(wordSearch.toLowerCase());

      const hasMatchDisabled = std?.typeDisabled?.some((disa) =>
        disa.toLowerCase().includes(typeDisabledSearch?.toLowerCase())
      );

      const hasMatchTypePerson = education?.typePerson
        ?.toLowerCase()
        .includes(typePersonSearch.toLowerCase());

      const tempInterestedWork = updatedStd?.interestedWork?.find((work) =>
        work?.type.toLowerCase().includes(workSearch.toLowerCase())
      );

      const hasMatchInterestedWork = updatedStd?.interestedWork?.some((work) =>
        work?.type
          .toLowerCase()
          .includes(tempInterestedWork?.type.toLowerCase())
      );

      let hasStatusNowWork = true;
      if (statusWorkSearch?.trim()) {
        hasStatusNowWork =
          statusNowWork?.statusNow?.trim() === statusWorkSearch.trim();
      }

      if (!hasStatusNowWork) {
        return null;
      }
      if (!hasMatchInterestedWork) {
        return null;
      }

      if (!hasMatchTypePerson && typePersonSearch) {
        return null;
      }

      if (!hasMatchDisabled && typeDisabledSearch) {
        return null;
      }
      if (!wordSearch) {
        if (!hasMatchUniversityFilter && !hasMatchNameFilter) {
          return null;
        }
      } else if (!hasMatchUniversity && !hasMatchName) {
        return null;
      }

      if (std.role === ROLE.USER) {
        return createData(
          `${std.firstName} ${std.lastName}`,
          `${education?.university?.join(",\n") || "ไม่มีข้อมูล"}`,
          `${`${
            education?.typePerson === TYPE_PERSON.STUDENT &&
            education?.educationLevel.length >= 1
              ? `${education?.educationLevel[0]} ปี ${education?.level[0]}`
              : education?.typePerson === TYPE_PERSON.GRADUATION
              ? TYPE_PERSON.GRADUATION
              : "ไม่มีข้อมูล"
          }`}`,
          // `${std.typeDisabled?.length > 1 ? std.typeDisabled[0] : `${std.typeDisabled[0]}...`}`,
          `${std?.typeDisabled?.join(",\n") || "ไม่มีข้อมูล"}`,
          "",
          `${std?.uuid}`
        );
      }
      return null;
    })
    .filter((row) => row !== null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <>
        <p>ค้นหา</p>
        <form
          onSubmit={(e) => handleSearch(e)}
          className="mt-5 flex justify-between flex-wrap gap-y-5 items-end"
        >
          <div className="flex gap-5 gap-y-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label>คำค้นหา</label>
              <input
                value={wordSearch}
                type="text"
                className={`${bgColorMain} w-56 border border-gray-400 py-1 px-4 rounded-md`}
                placeholder="ชื่อ-สกุล, มหาวิทยาลัย"
                onChange={(e) => setWordSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>ประเภทความพิการ</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-56 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setTypeDisabledSearch(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="พิการทางการมองเห็น">พิการทางการมองเห็น</option>
                  <option value="พิการทางการได้ยินหรือสื่อความหมาย">
                    พิการทางการได้ยินหรือสื่อความหมาย
                  </option>
                  <option value="พิการทางการเคลื่อนไหวหรือทางร่างกาย">
                    พิการทางการเคลื่อนไหวหรือทางร่างกาย
                  </option>
                  <option value="พิการทางจิตใจหรือพฤติกรรม">
                    พิการทางจิตใจหรือพฤติกรรม
                  </option>
                  <option value="พิการทางสติปัญญา">พิการทางสติปัญญา</option>
                  <option value="พิการทางการเรียนรู้">
                    พิการทางการเรียนรู้
                  </option>
                  <option value="พิการทางออทิสติก">พิการทางออทิสติก</option>
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.5}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>ประเภทบุคคล</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setTypePersonSearch(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="นักศึกษาพิการ">นักศึกษาพิการ</option>
                  <option value="บัณฑิตพิการ">บัณฑิตพิการ</option>
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.5}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>ลักษณะงานที่สนใจ</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setWorkSearch(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  {dataWorkType?.map((work, index) => (
                    <option key={index} value={work}>
                      {work}
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
            <div className="flex flex-col gap-1">
              <label>สถานะปัจจุบัน</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setStatusWorkSearch(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="กำลังศึกษา">กำลังศึกษา</option>
                  <option value="ทำงาน">ทำงาน</option>
                  <option value="ว่างงาน">ว่างงาน</option>
                  <option value="อยากเปลี่ยนงาน">อยากเปลี่ยนงาน</option>
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.5}
                />
              </div>
            </div>
          </div>
          <div className="">
            <button
              type="submit"
              className={` ${bgColorWhite} ${
                inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#0d96f8]" : ""
              }  hover:cursor-pointer py-1 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
            >
              <Icon path={mdiMagnify} size={1} />
              <p>ค้นหา</p>
            </button>
          </div>
        </form>
        {wordSearchFilter?.length > 0 && (
          <div className="mt-5 flex gap-2 flex-wrap">
            {wordSearchFilter?.map((word, index) => (
              <div
                key={index}
                className={`${bgColorWhite} ${
                  inputGrayColor === "bg-[#74c7c2]" || ""
                    ? `${
                        index % 2 !== 0
                          ? "bg-gray-400"
                          : index % 2 === 0
                          ? "bg-orange-400"
                          : ""
                      }`
                    : "border border-white"
                }
                                    px-8 py-1 rounded-lg relative cursor-pointer`}
                onClick={() => deleteWordSearch(index)}
              >
                {word}
                <Icon
                  className={` cursor-pointer text-white-400 absolute right-0 top-[8px] mx-3`}
                  path={mdiCloseThick}
                  size={0.5}
                />
              </div>
            ))}
          </div>
        )}
        <hr
          className={`${
            wordSearchFilter?.length > 0 ? "mt-2" : "mt-10"
          } mb-3 border-gray-500`}
        />
        {rows && (
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              boxShadow: "none",
            }}
          >
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .sort((a, b) => {
                      // แทน 'columnToSort' ด้วยชื่อฟิลด์ที่ต้องการเรียง
                      const columnToSort = "name"; // เช่น เรียงตามชื่อ
                      if (a[columnToSort] < b[columnToSort]) return 1; // เรียงจากมากไปน้อย
                      if (a[columnToSort] > b[columnToSort]) return -1;
                      return 0; // กรณีที่เท่ากัน
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const student = dataStudents.find(
                        (std) => std?.uuid === row.uuid
                      );
                      if (student) {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column) => {
                              if (column.id === "details") {
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    <Link
                                      href={`${path}/${student?.uuid}`}
                                      className="cursor-pointer text-center flex justify-center"
                                    >
                                      <Icon
                                        className={`cursor-pointer text-black`}
                                        path={mdiAlertCircle}
                                        size={1}
                                      />
                                    </Link>
                                  </TableCell>
                                );
                              } else {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      }
                      return null;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </>
    </div>
  );
}

export default StudentReportTable;
