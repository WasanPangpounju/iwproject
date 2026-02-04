"use client";

import React, { useEffect, useState } from "react";
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

//table
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import ButtonView from "@/app/components/Button/ButtonView";
import { REPORT_TYPE_ALL } from "@/const/enum";
import { useProvince } from "@/hooks/useProvince";
import { regionData } from "@/assets/regionData";

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
    id: "addressProvince",
    label: "จังหวัด",
    minWidth: 170,
  },
  {
    id: "level",
    label: "ตำแหน่ง",
    minWidth: 170,
  },
  {
    id: "disabled",
    label: "ประเภทผู้ใช้งาน",
    minWidth: 170,
  },
  {
    id: "details",
    label: "รายละเอียด",
    minWidth: 170,
  },
];

function UserManagement() {
  //store
  const { dataUserAll } = useUserStore();
  const { dataEducationAll } = useEducationStore();

  const { data: session } = useSession();

  //Theme
  const { bgColor, bgColorWhite, bgColorMain, bgColorMain2, inputGrayColor } =
    useTheme();

  //table
  function createData(name, university, level, disabled, details, uuid, addressProvince) {
    return { name, university, level, disabled, details, uuid, addressProvince };
  }

  //type search
  const [wordSearch, setWordSearch] = useState("");
  const [typePersonSearch, setTypePersonSearch] = useState("");
  const [addressProvince, setAddressProvince] = useState(REPORT_TYPE_ALL.ALL);
  const [regionId, setRegionId] = useState(null);

  //handle search filter
  const [wordSearchFilter, setWordSearchFilter] = useState([]);

  //data Province
  const { dataProvince } = useProvince(regionId);

  // reset addressProvince when regionId is cleared
  useEffect(() => {
    if (regionId === REPORT_TYPE_ALL.ALL) {
      setAddressProvince(REPORT_TYPE_ALL.ALL);
    }
  }, [regionId]);

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

  const rows = dataUserAll
    ?.map((std, index) => {
      if (std?.uuid === session?.user?.id) {
        return null;
      }

      const tempWordSearch =
        wordSearchFilter?.length === 0 ? [wordSearch] : wordSearchFilter;

      const education = dataEducationAll?.find(
        (edu) => edu?.uuid === std?.uuid,
      );
      const name = `${std?.firstName} ${std?.lastName}`;

      const hasMatchUniversityFilter = education?.university?.find((uni) =>
        tempWordSearch?.some((word) =>
          uni.toLowerCase().includes(word.toLowerCase()),
        ),
      );
      const hasMatchNameFilter = tempWordSearch?.some((word) =>
        name?.toLowerCase().includes(word.toLowerCase()),
      );

      const tempWordUniversity = education?.university?.find((uni) =>
        uni.toLowerCase().includes(wordSearch.toLowerCase()),
      );
      const hasMatchUniversity = education?.university?.some((uni) =>
        uni.toLowerCase().includes(tempWordUniversity?.toLowerCase()),
      );

      const hasMatchName = name
        ?.toLowerCase()
        .includes(wordSearch.toLowerCase());

      const hasMatchTypePerson = std?.role
        ?.toLowerCase()
        .includes(typePersonSearch.toLowerCase());

      // filter by province
      const hasMatchProvince =
        addressProvince === REPORT_TYPE_ALL.ALL ||
        (std?.addressProvince && std?.addressProvince === addressProvince);

      if (!hasMatchTypePerson) {
        return null;
      }

      if (!hasMatchProvince) {
        return null;
      }

      if (!wordSearch) {
        if (!hasMatchUniversityFilter && !hasMatchNameFilter) {
          return null;
        }
      } else if (!hasMatchUniversity && !hasMatchName) {
        return null;
      }

      return createData(
        `${std.firstName} ${std.lastName}`,
        `${
          education?.university?.join(",\n") || std?.university || "ไม่มีข้อมูล"
        }`,
        `${std?.position || "ไม่มีข้อมูล"}`,
        `${
          std?.role === "user"
            ? "user"
            : std?.role === "admin"
              ? "super user"
              : "admin"
        }`,
        "",
        `${std?.uuid}`,
        `${std?.addressProvince || "ไม่มีข้อมูล"}`,
      );
    })
    .filter((row) => row !== null); // กรองค่า null ออก

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(rows)
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
              <label>ประเภทผู้ใช้งาน</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setTypePersonSearch(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="user">user</option>
                  <option value="admin">super user</option>
                  <option value="supervisor">admin</option>
                </select>
                <Icon
                  className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.5}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 relative">
              <label>ภูมิภาค</label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setRegionId(e.target.value)}
                >
                  <option value={REPORT_TYPE_ALL.ALL}>
                    {REPORT_TYPE_ALL.ALL}
                  </option>
                  {regionData?.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
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
              <label>
                {/* แสดง * เมื่อเลือกภูมิภาค (regionId ไม่ใช่ ALL/ว่าง/null) และยังไม่เลือกจังหวัด (addressProvince === ALL) */}
                {regionId &&
                  regionId !== REPORT_TYPE_ALL.ALL &&
                  addressProvince === REPORT_TYPE_ALL.ALL && (
                    <span className="text-red-500">*</span>
                  )}
                {` `}จังหวัด
              </label>
              <div className="relative col w-fit">
                <select
                  className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  onChange={(e) => setAddressProvince(e.target.value)}
                  value={addressProvince}
                >
                  <option value={REPORT_TYPE_ALL.ALL}>
                    {REPORT_TYPE_ALL.ALL}
                  </option>
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
                type="submit"
                className={` ${bgColorWhite} ${
                  inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#74d886]" : ""
                }  hover:cursor-pointer py-2 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
              >
                <Icon path={mdiPlus} size={0.7} />
                <p>เพิ่มผู้ใช้งาน</p>
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
        {dataUserAll?.length > 0 && (
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
                      const student = dataUserAll.find(
                        (std) => std?.uuid === row.uuid,
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
                                    <ButtonView link={student?.uuid} />
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

export default UserManagement;
