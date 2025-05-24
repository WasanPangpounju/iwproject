"use client";

import InputLabelForm from "@/app/components/Form/InputLabelForm";
import SelectLabelForm from "@/app/components/Form/SelectLabelForm";
import ReportTable from "@/app/components/Table/ReportTable";
import { useTheme } from "@/app/ThemeContext";
import { ACTION_ACTIVITY } from "@/const/enum";
import React, { useState } from "react";

//store
import { useSystemLogStore } from "@/stores/useSystemLogStore";

function page() {
  //store
  const { logs } = useSystemLogStore();
  const { bgColorMain2, bgColor } = useTheme();

  const [targetValue, setTagetValue] = useState();
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  //options
  const targetOtions = [
    ...Object.values(ACTION_ACTIVITY).map((item) => {
      return {
        id: item,
        value: item,
      };
    }),
  ];

  //table
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const actionColorMap = {
    Login: { color: "#1976d2", backgroundColor: "#e3f2fd" },
    Logout: { color: "#512da8", backgroundColor: "#ede7f6" },
    Create: { color: "#388e3c", backgroundColor: "#e8f5e9" },
    Update: { color: "#f57c00", backgroundColor: "#fff3e0" },
    Delete: { color: "#d32f2f", backgroundColor: "#ffebee" },
    Error: { color: "#fff", backgroundColor: "#d32f2f" },
  };
  const rowLogs = logs
    ?.filter((item) => {
      if (!targetValue) return true; // ถ้าไม่เลือก filter ประเภทกิจกรรม แสดงหมด
      return item.action === targetValue;
    })
    .filter((item) => {
      if (!search) return true; // ถ้าไม่มีคำค้นหา แสดงหมด
      const searchText = search.toLowerCase();
      return item.actorName?.toLowerCase().includes(searchText);
    })
    .map((item) => {
      const actionStyle = actionColorMap[item.action] || {};
      return {
        date: item.createdAtFormatted,
        action: item.action,
        account: item.actorName,
        target: item.targetModel,
        description: item.description,
        actionStyle,
      };
    });
  //column
  const columns = [
    { id: "date", label: "วันที่", minWidth: 170, align: "left" },
    { id: "account", label: "บัญชี", minWidth: 170, align: "left" },
    {
      id: "action",
      label: "การกระทำ",
      minWidth: 170,
      align: "center",
      render: (value, row) => (
        <div
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontWeight: "bold",
            backgroundColor: row.actionStyle?.backgroundColor || "#ccc",
            color: row.actionStyle?.color || "#000",
          }}
          className="text-center"
        >
          {value}
        </div>
      ),
    },
    { id: "target", label: "กิจกรรม", minWidth: 170, align: "left" },
    { id: "description", label: "รายละเอียด", minWidth: 170, align: "left" },
  ];

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p>บันทึกกิจกรรมของผู้ใช้งาน</p>
      <div className="flex items-end gap-5 mt-5">
        <InputLabelForm
          label={"ค้นหา"}
          editMode={true}
          value={search}
          setValue={setSearch}
          tailwind="w-64 py-2"
          placeholder={"ค้นหาชื่อ, อีเมล, ชื่อผู้ใช้"}
        />
        <SelectLabelForm
          editMode={true}
          value={targetValue}
          label="การกระทำ"
          setValue={setTagetValue}
          options={targetOtions}
          tailwind={"w-56"}
        />
      </div>
      <div>
        <hr className={` my-7 border-gray-500`} />
        <ReportTable
          columns={columns}
          resultRows={rowLogs}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default page;
