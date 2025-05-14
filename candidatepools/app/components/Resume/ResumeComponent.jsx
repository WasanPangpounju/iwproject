"use client";

import React, { useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import Resume from "@/app/components/Resume/resume";

function ResumeComponent({ dataUser, dataEducations, dataSkills, dataHistoryWork }) {
  //Theme
  const { bgColorNavbar, bgColorWhite } = useTheme();

  //open resume check
  const [statusResume, setStatusResume] = useState(0);

  return (
    <>
      {statusResume > 0 ? (
        <Resume
          type={statusResume}
          id={dataUser?.uuid}
          setStatusResume={setStatusResume}
          dataUser={dataUser}
          dataEducations={dataEducations}
          dataSkills={dataSkills}
          dataHistoryWork={dataHistoryWork}
        />
      ) : (
        <>
          <p>สร้างเรซูเม่</p>
          <div className="mt-5 grid grid-cols-3 gap-5 text-center">
            <button
              className={`py-5 rounded-lg max-w-96 ${bgColorNavbar} ${bgColorWhite}`}
              onClick={() => setStatusResume(1)}
            >
              <p>รูปแบบที่ 1</p>
            </button>
            <button
              className={`py-5 rounded-lg max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#f48e07]" : ""
              } ${bgColorWhite}`}
              onClick={() => setStatusResume(2)}
            >
              <p>รูปแบบที่ 2</p>
            </button>
            <button
              className={`py-5  rounded-lg max-w-96 ${
                bgColorNavbar === "bg-[#F97201]" ? "bg-[#feb61c]" : ""
              } ${bgColorWhite}`}
              onClick={() => setStatusResume(3)}
            >
              <p>รูปแบบที่ 3</p>
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default ResumeComponent;
