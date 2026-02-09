import React, { useId, useMemo, useState } from "react";
import useUniversityStore from "@/stores/useUniversityStore";
import TextError from "../TextError";

function InputUniversityAutoComplete({
  id, // ✅ รับ id จาก parent เพื่อให้ label htmlFor โฟกัสได้
  value,
  onChange,
  placeholder = "กรอกชื่อมหาวิทยาลัย",
  tailwind = "",
  editMode = true,

  // (optional) a11y error binding
  describedBy,
  ariaInvalid = false,
}) {
  const { universities } = useUniversityStore();
  const reactId = useId();

  const inputId = id || `uni-input-${reactId}`;
  const listboxId = `${inputId}-listbox`;

  const [optionUniversity, setOptionUniversity] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [notFound, setNotFound] = useState(false);

  const options = useMemo(() => optionUniversity || [], [optionUniversity]);

  const getUniName = (item) =>
    item?.university ? String(item.university) : "";

  function filterOptions(input) {
    const source = universities?.data || universities || [];
    const text = (input || "").toLowerCase();

    const filtered =
      Array.isArray(source) && text
        ? source.filter((u) => getUniName(u).toLowerCase().includes(text))
        : Array.isArray(source)
          ? source.slice(0, 10) // ถ้าไม่พิมพ์อะไร แสดงตัวอย่างบางส่วนได้ (ไม่หนักเครื่อง)
          : [];

    setOptionUniversity(filtered);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function isNotFoundValue(input) {
    // ตรวจสอบว่าตรงกับชื่อมหาวิทยาลัยใดหรือไม่
    const found = universities?.some((uni) => uni.university === input);
    setNotFound(input && !found);
  }

  function handleInputChange(input) {
    // ✅ ส่งค่ากลับ parent เหมือนเดิม (string)
    onChange?.(input);
    filterOptions(input);
    // ตรวจสอบว่าตรงกับชื่อมหาวิทยาลัยใดหรือไม่
    isNotFoundValue(input);
  }

  function handleSelectOption(uniName) {
    onChange?.(uniName);
    setOptionUniversity([]);
    setIsOpen(false);
    setActiveIndex(-1);
    // ตรวจสอบว่าตรงกับชื่อมหาวิทยาลัยใดหรือไม่
    isNotFoundValue(uniName);
  }

  function handleKeyDown(e) {
    if (!editMode) return;

    if (e.key === "ArrowDown") {
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (options.length === 0) return;
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      if (!isOpen || options.length === 0) return;
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      if (!isOpen || options.length === 0) return;
      if (activeIndex >= 0 && activeIndex < options.length) {
        e.preventDefault();
        handleSelectOption(getUniName(options[activeIndex]));
      }
      return;
    }

    if (e.key === "Escape") {
      if (!isOpen) return;
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const activeDescendantId =
    activeIndex >= 0 ? `${inputId}-opt-${activeIndex}` : undefined;

  return (
    <div className="relative">
      <input
        id={inputId}
        type="text"
        value={value || ""}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (!editMode) return;
          setIsOpen(true);
          // ถ้า focus แล้วไม่มี options ให้ filter ตามค่าปัจจุบัน
          if (optionUniversity.length === 0) filterOptions(value || "");
        }}
        onBlur={(e) => {
          // ปิด dropdown เมื่อ focus ออกไปข้างนอก (แต่เผื่อกรณีคลิก option)
          const next = e.relatedTarget;
          const isOption = next?.getAttribute?.("role") === "option";
          if (!isOption) {
            setTimeout(() => setIsOpen(false), 150);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={!editMode}
        placeholder={placeholder}
        className={`${tailwind} ${!editMode ? "bg-gray-200 cursor-default" : ""} w-64 border px-4 py-2 rounded-lg ${notFound ? "border-red-500" : "border-gray-400"}`}
        // ✅ WCAG combobox pattern
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && options.length > 0 ? "true" : "false"}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-describedby={describedBy}
        aria-invalid={notFound || ariaInvalid ? "true" : "false"}
        autoComplete="off"
      />

      {editMode && isOpen && options.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow"
        >
          {options.slice(0, 30).map((item, index) => {
            const name = getUniName(item);
            const optionId = `${inputId}-opt-${index}`;
            const isActive = index === activeIndex;

            return (
              <button
                key={`${name}-${index}`}
                id={optionId}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={isActive ? "true" : "false"}
                className={`block w-full text-left px-4 py-2 ${
                  isActive ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-100`}
                onMouseDown={(e) => e.preventDefault()} // กัน blur ก่อนเลือก
                onClick={() => handleSelectOption(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
      {notFound && (
        <TextError
          className="mt-1"
          text={`กรุณากรอกชื่อสถาบันการศึกษาให้ถูกต้อง`}
        />
      )}
    </div>
  );
}

export default InputUniversityAutoComplete;
