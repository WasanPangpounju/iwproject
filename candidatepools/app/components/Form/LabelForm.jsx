import React from "react";

function LabelForm({ label, isRequire = false, editMode, htmlFor, inputId, className = "" }) {
  const forId = htmlFor || inputId; // ✅ รองรับทั้ง 2 แบบ

  return (
    <label htmlFor={forId} className={`font-medium ${className}`}>
      {label}{" "}
      {isRequire && (
        <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
      )}
    </label>
  );
}

export default LabelForm;
