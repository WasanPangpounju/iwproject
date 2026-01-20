import React from "react";

//component
import ButtonBG1 from "@/app/components/Button/ButtonBG1";
import ButtonBG2 from "@/app/components/Button/ButtonBG2";

import { mdiPencil, mdiContentSave, mdiCloseCircle } from "@mdi/js";

function ButtonGroup({ editMode, setEditMode, tailwind = "", isCreate }) {
  return (
    <>
      {editMode ? (
        <div
          className={`flex w-full flex-wrap items-center justify-center gap-4 sm:gap-10 ${tailwind}`}
          role="group"
          aria-label="ปุ่มจัดการฟอร์ม"
        >
          {!isCreate && (
            <ButtonBG1
              text={"ยกเลิก"}
              mdiIcon={mdiCloseCircle}
              handleClick={() => setEditMode(false)}
              type="button" // ✅ กัน submit
              ariaLabel="ยกเลิกการแก้ไข"
            />
          )}

          <ButtonBG2
            text={"บันทึก"}
            mdiIcon={mdiContentSave}
            handleClick={() => {
              // ปล่อยให้ปุ่ม type="submit" ทำงานกับ <form> ตามปกติ
              // (ถ้าต้องการ logic เพิ่มค่อยใส่ที่ onSubmit ของฟอร์ม)
            }}
            btn
            type="submit" // ✅ ชัดเจนว่าเป็น submit
            ariaLabel="บันทึกข้อมูล"
          />
        </div>
      ) : (
        <div
          className={`flex w-full justify-center mt-10 ${tailwind}`}
          role="group"
          aria-label="ปุ่มเริ่มแก้ไข"
        >
          <ButtonBG1
            text={"แก้ไข"}
            mdiIcon={mdiPencil}
            handleClick={() => setEditMode(true)}
            type="button" // ✅ กัน submit
            ariaLabel="เข้าสู่โหมดแก้ไข"
          />
        </div>
      )}
    </>
  );
}

export default ButtonGroup;
