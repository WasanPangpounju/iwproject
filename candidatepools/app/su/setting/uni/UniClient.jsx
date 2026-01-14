"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useTheme } from "@/app/ThemeContext";
import InputLabelForm from "@/app/components/Form/InputLabelForm";
import ButtonBG2 from "@/app/components/Button/ButtonBG2";
import { mdiDelete, mdiPencil, mdiPlus } from "@mdi/js";
import ReportTable from "@/app/components/Table/ReportTable";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import useUniversityStore from "@/stores/useUniversityStore";

export default function UniClient() {
  const { bgColorMain2, bgColor } = useTheme();

  const {
    universities,
    loading,
    fetchUniversities,
    deleteUniversity,
    addUniversity,
    updateUniversity,
  } = useUniversityStore();

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const [uniSearch, setUniSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // ✅ store ให้ universities เป็น array → ห้ามใช้ universities.data
  const rows = useMemo(() => {
    const list = Array.isArray(universities) ? universities : [];
    const search = (uniSearch || "").toLowerCase();

    return list
      .map((item, index) => ({
        no: index + 1,
        university: item?.university ?? "",
        action: item?._id,
        id: item?._id,
      }))
      .filter((uni) => (uni.university || "").toLowerCase().includes(search));
  }, [universities, uniSearch]);

  const columns = [
    { id: "no", label: "ลำดับ", minWidth: 10, align: "left" },
    { id: "university", label: "สถาบันการศึกษา", minWidth: 170, align: "left" },
    {
      id: "action",
      label: "การจัดการ",
      minWidth: 10,
      align: "right",
      render: (_value, row) => (
        <div className="flex gap-2 justify-end">
          <Icon
            onClick={() => insertModel(row.id, row.university)}
            className="cursor-pointer text-gray-40 mx-1"
            path={mdiPencil}
            size={0.8}
          />
          <Icon
            onClick={() => deletedUni(row.id, row.university)}
            className="cursor-pointer text-gray-40 mx-1"
            path={mdiDelete}
            size={0.8}
          />
        </div>
      ),
    },
  ];

  async function insertModel(id, name) {
    Swal.fire({
      title: "เพิ่ม/แก้ไข ชื่อสถาบันการศึกษา",
      input: "text",
      inputValue: name || "",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#74c7c2",
      showLoaderOnConfirm: true,
      preConfirm: async (input) => {
        if (!input.trim()) {
          Swal.showValidationMessage("กรุณากรอกชื่อสถาบัน");
          return;
        }
        return input;
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const inputName = String(result.value || "");
      try {
        if (id) await updateUniversity(id, inputName);
        else await addUniversity(inputName);

        toast.success("บันทึกสำเร็จ");
        fetchUniversities(); // ✅ refresh
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการบันทึก");
        console.error(err);
      }
    });
  }

  async function deletedUni(id, name) {
    Swal.fire({
      title: `คุณต้องการลบชื่อสถาบัน\n"${name}" ?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#f27474",
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteUniversity(id);
        toast.success("ลบข้อมูลเรียบร้อยแล้ว");
        fetchUniversities(); // ✅ refresh
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการลบ");
        console.error(err);
      }
    });
  }

  if (loading) return null;

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p>ตั้งค่าสถาบันการศึกษา</p>

      <div className="mt-5 flex justify-between items-end">
        <InputLabelForm
          label="สถาบันการศึกษา"
          value={uniSearch}
          setValue={setUniSearch}
          editMode={true}
          placeholder="ชื่อสถาบันการศึกษา"
          tailwind="w-60"
        />
        <ButtonBG2
          handleClick={() => insertModel()}
          mdiIcon={mdiPlus}
          text="เพิ่ม"
          tailwind="h-fit"
        />
      </div>

      <hr className="my-7 border-gray-500" />

      <ReportTable
        columns={columns}
        resultRows={rows}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
