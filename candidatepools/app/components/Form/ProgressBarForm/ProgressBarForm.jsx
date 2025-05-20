import React, { useMemo } from "react";
import { useTheme } from "@/app/ThemeContext";

const ProgressBarForm = ({ fields = [], totalOverride = null }) => {
  const filledCount = useMemo(() => {
    return fields.filter((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== null && val !== "" && val !== undefined;
    }).length;
  }, [fields]);

  const total = totalOverride ?? fields.length;
  const progress = (filledCount / total) * 100;

  const { bgColorNavbar } = useTheme();

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full ">
        <div
          className={`${bgColorNavbar} h-3 rounded-full transition-all duration-300"`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mt-2">
        {filledCount} / {total} ช่อง
      </p>
    </div>
  );
};

export default ProgressBarForm;
