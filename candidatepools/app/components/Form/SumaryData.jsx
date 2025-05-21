import React from "react";
import PersonalForm from "./PersonalForm";
import EducationForm from "./EducationForm";
import HistoryWorkForm from "./HistoryWorkForm";
import SkillForm from "./SkillForm";

function SumaryData({
  dataUser,
  dataEducations,
  dataHistoryWork,
  dataSkills,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-lg">ข้อมูลส่วนบุคคล</p>
        <div className="mt-5">
          <PersonalForm dataUser={dataUser} />
        </div>
      </div>
      <div>
        <p className="text-lg">ประวัติการศึกษา</p>
        <div className="mt-5">
          <EducationForm dataUser={dataUser} dataEducations={dataEducations}/>
        </div>
      </div>
      <div>
        <p className="text-lg">ประวัติการทำงาน/ฝึกงาน</p>
        <div className="mt-5">
          <HistoryWorkForm id={dataUser?.uuid} dataHistoryWork={dataHistoryWork}/>
        </div>
      </div>
      <div>
        <p className="text-lg">ความสามาร/การอบรม</p>
        <div className="mt-5">
          <SkillForm id={dataUser?.uuid} dataSkills={dataSkills}/>
        </div>
      </div>
    </div>
  );
}

export default SumaryData;
