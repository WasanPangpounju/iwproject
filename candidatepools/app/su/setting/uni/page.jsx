"use client";
import React, { useState } from "react";

import { useTheme } from "@/app/ThemeContext";
import InputLabelForm from "@/app/components/Form/InputLabelForm";
import ButtonBG2 from "@/app/components/Button/ButtonBG2";
import { mdiDelete, mdiPencil, mdiPlus } from "@mdi/js";
import ReportTable from "@/app/components/Table/ReportTable";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

//store
import useUniversityStore from "@/stores/useUniversityStore";

function page() {
  //store
  const {
    universities,
    deleteUniversity,
    addUniversity,
    updateUniversity,
  } = useUniversityStore();

  const { bgColorMain2, bgColor } = useTheme();

  //state
  const [uniSearch, setUniSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //table
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "no", label: "ลำดับ", minWidth: 10, align: "left" },
    { id: "university", label: "สถาบันการศึกษา", minWidth: 170, align: "left" },
    {
      id: "action",
      label: "การจัดการ",
      minWidth: 10,
      align: "right",
      render: (value, row) => (
        <div className="flex gap-2 justify-end">
          <Icon
            onClick={() => insertModel(row.id, row.university)}
            className={`cursor-pointer text-gray-40 mx-1`}
            path={mdiPencil}
            size={0.8}
          />
          <Icon
            onClick={() => deletedUni(row.id, row.university)}
            className={`cursor-pointer text-gray-40 mx-1`}
            path={mdiDelete}
            size={0.8}
          />
        </div>
      ),
    },
  ];

  const rows = universities?.data
    ?.map((item, index) => {
      return {
        no: index + 1,
        university: item.university,
        action: item._id,
        id: item._id,
      };
    })
    ?.filter((uni) => {
      const search = uniSearch.toLowerCase();
      const name = uni.university.toLowerCase();
      return name.includes(search);
    });

  //open model
  async function insertModel(id, name) {
    Swal.fire({
      title: `เพิ่ม/แก้ไข ชื่อสถาบันการศึกษา`,
      input: "text",
      inputValue: name || "", // กำหนด default value ถ้ามี name
      inputAttributes: {
        autocapitalize: "off",
      },
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
      if (result.isConfirmed) {
        const inputName = result.value; // ค่า input ที่ผู้ใช้กรอกหรือแก้ไข
        try {
          if (id) {
            await updateUniversity(id, inputName);
          } else {
            await addUniversity(inputName);
          }
          toast.success("บันทึกสำเร็จ");
        } catch (err) {
          toast.error("เกิดข้อผิดพลาดในการบันทึก");
          console.error(err);
        }
      }
    });
  }

  //delete model
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
      if (result.isConfirmed) {
        try {
          await deleteUniversity(id);
          toast.success("ลบข้อมูลเรียบร้อยแล้ว");
        } catch {
          toast.error("เกิดข้อผิดพลาดในการบันทึก");
        }
      }
    });
  }

  if (!universities) return null;
  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p>ตั้งค่าสถาบันการศึกษา</p>
      <div className="mt-5 flex justify-between items-end">
        <InputLabelForm
          label={"สถาบันการศึกษา"}
          value={uniSearch}
          setValue={setUniSearch}
          editMode={true}
          placeholder={"ชื่อสถาบันการศึกษา"}
          tailwind={"w-60"}
        />
        <ButtonBG2
          handleClick={() => insertModel()}
          mdiIcon={mdiPlus}
          text={"เพิ่ม"}
          tailwind={"h-fit"}
        />
      </div>
      <hr className={` my-7 border-gray-500`} />
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

export default page;
