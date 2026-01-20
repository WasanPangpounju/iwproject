import React from "react";

//component
import LabelForm from "./LabelForm";
import SelectForm from "./SelectForm";
function SelectLabelForm({
  label,
  isRequire,
  setValue,
  value,
  editMode,
  options,
  tailwind,
}) {
  return (
    <div className={`flex flex-col gap-1 ${tailwind}`}>
      <LabelForm label={label} isRequire={isRequire} editMode={editMode} />
      <SelectForm
        setValue={setValue}
        value={value}
        editMode={editMode}
        options={options}
        tailwind={tailwind}
      />
    </div>
  );
}

export default SelectLabelForm;
