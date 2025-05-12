import React from 'react'

function LabelForm({ label, isRequire = false, editMode }) {
  return (
  <label>
        {label}{" "}
        {isRequire && (
          <span className={`${!editMode ? "hidden" : ""} text-red-500`}>*</span>
        )}
      </label>
  )
}

export default LabelForm
