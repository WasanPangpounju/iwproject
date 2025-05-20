// app/testPage/page.jsx หรือ wherever
"use client";

import { useForm } from "react-hook-form";
import { useMemo } from "react";

const TOTAL_FIELDS = 40;

export default function StepForm() {
  const { register, watch } = useForm();
  const allFields = watch();

  const filledCount = useMemo(
    () => Object.values(allFields).filter((val) => val !== "").length,
    [allFields]
  );

  const progress = (filledCount / TOTAL_FIELDS) * 100;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">{filledCount} / {TOTAL_FIELDS} ช่อง</p>
      </div>

      <form className="space-y-3">
        {[...Array(TOTAL_FIELDS)].map((_, i) => (
          <input
            key={i}
            {...register(`field${i + 1}`)}
            placeholder={`กรอกช่องที่ ${i + 1}`}
            className="w-full p-2 border rounded"
          />
        ))}
      </form>
    </div>
  );
}