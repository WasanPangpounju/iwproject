import React from "react";
import PersonalForm from "./PersonalForm";
import EducationForm from "./EducationForm";
import HistoryWorkForm from "./HistoryWorkForm";
import SkillForm from "./SkillForm";
import InterestedWorkForm from "./InterestedWorkForm";

function SumaryData({ dataUser, dataEducations, dataHistoryWork, dataSkills, dataWorks }) {
  return (
    <div className="flex flex-col gap-3 mb-10">
      <div>
        <p className="text-lg">ข้อมูลส่วนบุคคล</p>
        <div className="mt-5">
          <PersonalForm dataUser={dataUser} readOnly />
        </div>
      </div>
      <hr className="my-3 border-gray-400" />
      <div>
        <p className="text-lg">ประวัติการศึกษา</p>
        <div className="mt-5">
          <EducationForm
            dataUser={dataUser}
            dataEducations={dataEducations}
            readOnly
          />
        </div>
      </div>
      <hr className="my-3 border-gray-400" />
      <div>
        <p className="text-lg">ประวัติการทำงาน/ฝึกงาน</p>
        <div className="mt-5">
          <HistoryWorkForm
            id={dataUser?.uuid}
            dataHistoryWork={dataHistoryWork}
            readOnly
          />
        </div>
      </div>
      <hr className="my-3 border-gray-400" />
      <div>
        <p className="text-lg">ความสามาร/การอบรม</p>
        <div className="mt-5">
          <SkillForm id={dataUser?.uuid} dataSkills={dataSkills} readOnly />
        </div>
      </div>
      <hr className="my-3 border-gray-400" />
      <div>
        <p className="text-lg">ลักษณะงานที่สนใจ</p>
        <div className="mt-5">
          <InterestedWorkForm id={dataUser?.uuid} dataWorks={dataWorks} readOnly/>{" "}
        </div>
      </div>
    </div>
  );
}

export default SumaryData;
