import React, { useId } from "react";

//component
import LabelForm from "./LabelForm";
import SelectForm from "./SelectForm";

function SelectLabelForm({
  id, // ✅ รับ id จาก parent ได้
  label,
  isRequire,
  setValue,
  value,
  editMode,
  options,
  tailwind,

  // ✅ a11y (optional)
  describedBy,
  ariaInvalid = false,
}) {
  const reactId = useId();
  const selectId = id || `select-${reactId}`;

  return (
    <div className={`flex flex-col gap-1 ${tailwind}`}>
      <LabelForm
        label={label}
        isRequire={isRequire}
        editMode={editMode}
        inputId={selectId} // ✅ ผูก label -> select
      />

      <SelectForm
        id={selectId} // ✅ ส่ง id ให้ <select>
        setValue={setValue}
        value={value}
        editMode={editMode}
        options={options}
        tailwind={tailwind}
        describedBy={describedBy}
        ariaInvalid={ariaInvalid}
      />
    </div>
  );
}

export default SelectLabelForm;
