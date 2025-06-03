import React from "react";

//component
import InputForm from "./InputForm";
import LabelForm from "./LabelForm";
function InputLabelForm({
  label,
  value,
  setValue,
  editMode,
  isRequire,
  disabled = false,
  tailwind,
  styles,
  placeholder,
  type
}) {
  return (
    <div className="flex col flex-col gap-1">
      <LabelForm label={label} isRequire={isRequire} editMode={editMode}/>
      <InputForm
        value={value}
        editMode={editMode}
        setValue={setValue}
        disabled={disabled}
        tailwind={tailwind}
        styles={styles}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

export default InputLabelForm;
