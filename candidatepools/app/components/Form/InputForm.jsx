import React, { useMemo } from "react";
import { useTheme } from "@/app/ThemeContext";

function InputForm({
  value,
  editMode,
  setValue,
  tailwind = "w-full",
  disabled = false,
  styles,
  placeholder,
  type = "text",

  // a11y / form
  id,
  name,
  required = false,
  autoComplete,
  ariaDescribedBy,
  ariaInvalid = false,
}) {
  const { bgColorMain, inputEditColor } = useTheme();

  const computed = useMemo(() => {
    const base = {
      inputMode: undefined,
      pattern: undefined,
      maxLength: undefined,
      type,
    };

    if (styles === "idCard") {
      return {
        ...base,
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 13,
        type: "text",
      };
    }

    if (styles === "tel") {
      return {
        ...base,
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 10,
        type: "text",
      };
    }

    if (styles === "password") {
      return { ...base, type: "password" };
    }

    return base;
  }, [styles, type]);

  const handleChange = (e) => {
    let v = e.target.value ?? "";

    // sanitize numeric fields (stable for typing + paste)
    if (styles === "idCard") {
      v = v.replace(/\D/g, "").slice(0, 13);
    } else if (styles === "tel") {
      v = v.replace(/\D/g, "").slice(0, 10);
    }

    setValue(v);
  };

  return (
    <input
      id={id}
      name={name}
      placeholder={placeholder}
      type={computed.type}
      inputMode={computed.inputMode}
      pattern={computed.pattern}
      maxLength={computed.maxLength}
      autoComplete={autoComplete}
      required={required}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid ? "true" : "false"}
      className={`${
        !editMode && !disabled
          ? `${inputEditColor} cursor-default focus:outline-none`
          : ""
      } ${bgColorMain} ${disabled ? "bg-gray-200" : ""} ${tailwind}
      border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      onChange={handleChange}
      value={value ?? ""}
      readOnly={!editMode}
      disabled={disabled}
    />
  );
}

export default InputForm;
