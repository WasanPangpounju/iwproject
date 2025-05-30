"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import {
  mdiAlertCircle,
  mdiMagnify,
  mdiArrowDownDropCircle,
  mdiPlus,
  mdiCloseThick,
} from "@mdi/js";
import dataWorkType from "@/assets/dataWorkType";
import Link from "next/link";
import useProvinceData from "@/utils/province";

//table
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

//store
import { useCompanyStore } from "@/stores/useCompanyStore";

const columns = [
  {
    id: "name",
    label: "หน่วยงาน",
    minWidth: 170,
  },
  {
    id: "university",
    label: "ประเภทงาน",
    minWidth: 170,
  },
  {
    id: "level",
    label: "จังหวัด",
    minWidth: 170,
  },
  {
    id: "disabled",
    label: "ประสานงาน",
    minWidth: 170,
  },
  {
    id: "details",
    label: "รายละเอียด",
    minWidth: 170,
    align: "center",
  },
];

function CompanyPage() {
  //store
  const { companies } = useCompanyStore();
  const { data: session } = useSession();

  //data Province
  const dataProvince = useProvinceData();

  //Theme
  const { bgColor, bgColorWhite, bgColorMain, bgColorMain2, inputGrayColor } =
    useTheme();

  //getDatastudent
  const [loaderTable, setLoaderTable] = useState(false);

  //table
  function createData(name, university, level, disabled, details, uuid) {
    return { name, university, level, disabled, details, uuid };
  }

  //type search
  const [wordSearch, setWordSearch] = useState("");
  const [addressProvince, setAddressProvince] = useState("");
  const [workType, setWorkType] = useState("");

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

  const rows = companies
    ?.map((cpn, index) => {
      const tempWordSearch =
        wordSearchFilter?.length === 0 ? [wordSearch] : wordSearchFilter;

      const name = `${cpn?.nameCompany}`;

      const hasMatchNameFilter = tempWordSearch?.some((word) =>
        name?.toLowerCase().includes(word.toLowerCase())
      );

      const hasMatchName = name
        ?.toLowerCase()
        .includes(wordSearch.toLowerCase());

      const hasMatchTypePerson = cpn?.province
        ?.toLowerCase()
        .includes(addressProvince.toLowerCase());
      const hasMatchWorkType = cpn?.work_type
        ?.toLowerCase()
        .includes(workType.toLowerCase());

      if (!hasMatchTypePerson) {
        return null;
      }

      if (!hasMatchWorkType) {
        return null;
      }

      if (!wordSearch || wordSearch === "") {
        if (!hasMatchNameFilter) {
          return null;
        }
      } else if (!hasMatchName) {
        return null;
      }

      return createData(
        `${cpn.nameCompany}`,
        `${cpn?.work_type || "ไม่มีข้อมูล"}`,
        `${cpn?.province || "ไม่มีข้อมูล"}`,
        `${cpn?.coordinator}`,
        "s",
        `${cpn?._id}`
      );
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
                placeholder="หน่วยงาน"
                onChange={(e) => setWordSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>ประเภทงาน</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-52 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setWorkType(e.target.value)}
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
              <label>จังหวัด</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setAddressProvince(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  {dataProvince?.map((pv, index) => (
                    <option key={index} value={pv.name_th}>
                      {pv.name_th}
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
          </div>
          {session?.user?.id && (
            <div className="flex items-end">
              <Link
                href={"add"}
                className={` ${bgColorWhite} ${
                  inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#74d886]" : ""
                }  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
              >
                <Icon path={mdiPlus} size={0.7} />
                <p>เพิ่มบริษัท</p>
              </Link>
            </div>
          )}
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
        {companies?.length > 0 && (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
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
                                <TableCell key={column.id} align={column.align}>
                                  <Link
                                    href={row?.uuid}
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
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      );
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

export default CompanyPage;
