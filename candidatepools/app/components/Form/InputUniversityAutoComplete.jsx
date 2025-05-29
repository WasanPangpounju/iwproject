import React, { useState } from "react";

import useUniversityStore from "@/stores/useUniversityStore";

function InputUniversityAutoComplete({
  value,
  onChange,
  placeholder = "กรอกชื่อมหาวิทยาลับ",
  tailwind,
  editMode = true,
}) {
  const { universities } = useUniversityStore();
  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isFocusUni, setIsFocusUni] = useState(false);

  function handleUniversity(input) {
    onChange(input); // ส่งค่าที่พิมพ์กลับไปให้ parent

    const filteredOptions = universities?.data?.filter((uni) =>
      uni.university.toLowerCase().includes(input.toLowerCase())
    );
    setOptionUniversity(filteredOptions);
  }

  function handleSelectOption(uni) {
    onChange(uni); // ส่งค่าที่เลือกกลับไปให้ parent
    setOptionUniversity([]);
  }


  return (
    <div className={`relative `}>
      <input
        disabled={!editMode}
        value={value || ""}
        onChange={(e) => handleUniversity(e.target.value)}
        onFocus={() => setIsFocusUni(true)}
        onBlur={(e) => {
          if (
            !e.relatedTarget ||
            !e.relatedTarget.classList.contains("uni-option")
          ) {
            setTimeout(() => setIsFocusUni(false), 200);
          }
        }}
        type="text"
        className={`${tailwind} ${!editMode && "bg-gray-200"} border border-gray-400 px-4 py-1 rounded-lg`}
        placeholder={placeholder}
      />
      {isFocusUni && optionUniversity.length > 0 && (
        <div className="absolute shadow max-h-24 w-full overflow-scroll hide-scrollbar bg-white z-10">
          {optionUniversity.map((uni, index) => (
            <div
              key={index}
              className="px-2 py-1 border hover:bg-gray-200 cursor-pointer uni-option"
              onMouseDown={() => handleSelectOption(uni.university)}
            >
              {uni.university}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InputUniversityAutoComplete;
