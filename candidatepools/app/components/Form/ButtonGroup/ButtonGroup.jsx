import React from "react";

//component
import ButtonBG1 from "@/app/components/Button/ButtonBG1";
import ButtonBG2 from "@/app/components/Button/ButtonBG2";

import { mdiPencil, mdiContentSave, mdiCloseCircle } from "@mdi/js";

function ButtonGroup({ editMode, setEditMode, tailwind, isCreate}) {
  return (
    <>
      {editMode ? (
        <div className={`flex gap-10 w-full justify-center ${tailwind}`}>
          {!isCreate && (
            <ButtonBG1
              text={"ยกเลิก"}
              mdiIcon={mdiCloseCircle}
              handleClick={() => setEditMode(false)}
            />
          )}
          <ButtonBG2
            text={"บันทึก"}
            mdiIcon={mdiContentSave}
            handleClick={() => {
              console.log("Submit Form");
            }}
            btn
          />
        </div>
      ) : (
        <div className=" flex w-full justify-center mt-10">
          <ButtonBG1
            text={"แก้ไข"}
            mdiIcon={mdiPencil}
            handleClick={() => setEditMode(true)}
          />
        </div>
      )}
    </>
  );
}

export default ButtonGroup;
