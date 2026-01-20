import React, { useMemo } from "react";
import { useTheme } from "@/app/ThemeContext";

const ProgressBarForm = ({ fields = [], totalOverride = null }) => {
  const filledCount = useMemo(() => {
    return (fields || []).filter((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== null && val !== "" && val !== undefined;
    }).length;
  }, [fields]);

  const totalRaw = totalOverride ?? (fields?.length ?? 0);
  const total = totalRaw > 0 ? totalRaw : 1; // ✅ กันหาร 0
  const progress = Math.min(100, Math.max(0, (filledCount / total) * 100));

  const { bgColorNavbar } = useTheme();

  const labelId = "progressbar-label";

  return (
    <div className="w-full" aria-labelledby={labelId}>
      <div className="w-full bg-gray-200 rounded-full">
        <div
          // ✅ เอา " เกินออก + เพิ่ม a11y
          className={`${bgColorNavbar} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={filledCount}
          aria-label="ความคืบหน้าการกรอกข้อมูล"
        />
      </div>

      <p id={labelId} className="text-center mt-2">
        {filledCount} / {totalOverride ?? (fields?.length ?? 0)} ช่อง
      </p>
    </div>
  );
};

export default ProgressBarForm;
