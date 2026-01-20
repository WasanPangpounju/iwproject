import React, { useId } from "react";
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
  type,

  // a11y additions
  id,
  name,
  autoComplete,
  describedBy,
  ariaInvalid = false,
}) {
  const uid = useId();
  const inputId =
    id ||
    name ||
    `${(label || "input").toString().replace(/\s+/g, "-")}-${uid}`;

  return (
    <div className="w-full flex flex-col gap-1">
      <LabelForm
        label={label}
        isRequire={isRequire}
        editMode={editMode}
        htmlFor={inputId}
      />

      <InputForm
        id={inputId}
        name={name}
        value={value}
        editMode={editMode}
        setValue={setValue}
        disabled={disabled}
        tailwind={tailwind || "w-full"}
        styles={styles}
        placeholder={placeholder}
        type={type}
        required={!!isRequire}
        autoComplete={autoComplete}
        ariaDescribedBy={describedBy}
        ariaInvalid={ariaInvalid}
      />
    </div>
  );
}

export default InputLabelForm;
