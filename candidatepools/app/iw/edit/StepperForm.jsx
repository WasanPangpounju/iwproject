"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

//mui
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

import { useTheme } from "@/app/ThemeContext";

//store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useResumeStore } from "@/stores/useResumeStore";

//components
import ResumeComponent from "@/app/components/Resume/ResumeComponent";
import PersonalForm from "@/app/components/Form/PersonalForm";
import EducationForm from "@/app/components/Form/EducationForm";
import HistoryWorkForm from "@/app/components/Form/HistoryWorkForm";
import SkillForm from "@/app/components/Form/SkillForm";

import { mdiArrowLeftCircle, mdiArrowRightCircle } from "@mdi/js";
import ButtonBG1 from "@/app/components/Button/ButtonBG1";
import InterestedWorkForm from "@/app/components/Form/InterestedWorkForm";
import SumaryData from "@/app/components/Form/SumaryData";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

const steps = [
  "ข้อมูลส่วนบุลคล",
  "ประวัติการศึกษา",
  "ประวัติการทำงาน/ฝึกงาน",
  "ความสามารถ/การอบรม",
  "เรซูเม่",
  "ลักษณะงานที่สนใจ",
];

const stepStyle = {
  "& .Mui-active": {
    "&.MuiStepIcon-root": {
      color: "#F97201",
    },
  },
  "& .Mui-completed": {
    "&.MuiStepIcon-root": {
      color: "#F97201",
    },
  },
};

export default function StepperForm() {
  //params
  const searchParams = useSearchParams();
  const stepper = searchParams.get("stepper");

  const router = useRouter();

  //store
  const { dataUser } = useUserStore();
  const { dataEducations } = useEducationStore();
  const { dataHistoryWork } = useHistoryWorkStore();
  const { dataSkills } = useSkillStore();
  const { dataWorks } = useInterestedWorkStore();
  const { resumeFiles, fetchResumeFiles, clearResumeFiles } = useResumeStore();
  const [activeStep, setActiveStep] = useState(stepper - 1);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    fetchResumeFiles(dataUser?.uuid);
    return () => {
      clearResumeFiles();
    };
  }, [dataUser]);

  useEffect(() => {
    setActiveStep(stepper - 1);
  }, [stepper]);

  //check complete
  useEffect(() => {
    const newCompleted = {};

    if (dataUser?.idCardDisabled) {
      newCompleted[0] = true;
    }

    if (dataEducations?.educationLevel[0]) {
      newCompleted[1] = true;
    }

    if (dataHistoryWork?.internships[0]?.place || dataHistoryWork?.projects[0]?.name || dataHistoryWork?.workExperience[0]?.place) {
      newCompleted[2] = true;
    }

    if (dataSkills?.skills[0]?.type || dataSkills?.trains[0]?.name) {
      newCompleted[3] = true;
    }

    if (
      newCompleted[0] &&
      newCompleted[1] &&
      newCompleted[2] &&
      newCompleted[3]
    ) {
      newCompleted[4] = true;
    }

    if (dataWorks?.interestedWork[0]?.type) {
      newCompleted[5] = true;
    }

    setCompleted((prev) => ({ ...prev, ...newCompleted }));
  }, [dataUser, dataEducations, dataHistoryWork, dataSkills, dataWorks]);

  const { bgColorMain2 } = useTheme();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    if (steps.length === activeStep) {
      return;
    }
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    // setActiveStep(newActiveStep);
    router.push(`?stepper=${newActiveStep + 1}&path=edit`);
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    const newActiveStep = activeStep - 1;
    setActiveStep(newActiveStep);
    router.push(`?stepper=${newActiveStep + 1}&path=edit`);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    router.push(`?stepper=${step + 1}&path=edit`);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <PersonalForm
            dataUser={dataUser}
            handleStep={() => handleComplete()}
          />
        );
      case 1:
        return (
          <EducationForm
            dataEducations={dataEducations}
            dataUser={dataUser}
            handleStep={() => handleComplete()}
          />
        );
      case 2:
        return (
          <HistoryWorkForm
            id={dataUser?.uuid}
            dataHistoryWork={dataHistoryWork}
            handleStep={() => handleComplete()}
          />
        );
      case 3:
        return (
          <SkillForm
            dataSkills={dataSkills}
            id={dataUser?.uuid}
            handleStep={() => handleComplete()}
          />
        );
      case 4:
        return (
          <ResumeComponent
            dataUser={dataUser}
            dataSkills={dataSkills}
            dataEducations={dataEducations}
            dataHistoryWork={dataHistoryWork}
            resumeFiles={resumeFiles}
          />
        );
      case 5:
        return <InterestedWorkForm id={dataUser?.uuid} dataWorks={dataWorks} />;
      case 6:
        return (
          <SumaryData
            dataUser={dataUser}
            dataSkills={dataSkills}
            dataEducations={dataEducations}
            dataHistoryWork={dataHistoryWork}
            dataWorks={dataWorks}
          />
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div className={`${bgColorMain2} rounded-lg p-5`}>
      <Box sx={{ width: "100%" }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]} sx={stepStyle}>
              <StepButton onClick={handleStep(index)}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>

        {/* เนื้อหาแต่ละ Step */}
        <Box sx={{ mt: 3 }}>{getStepContent(activeStep)}</Box>

        {/* ปุ่มควบคุม */}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          {activeStep !== 0 && (
            <ButtonBG1
              handleClick={handleBack}
              text={"ย้อนกลับ"}
              mdiIcon={mdiArrowLeftCircle}
            />
          )}
          {/* <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            ย้อนกลับ
          </Button> */}
          <Box sx={{ flex: "1 1 auto" }} />
          {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
            <p className="text-[#F97201]">
              {activeStep + 1 === steps.length && allStepsCompleted()
                ? "สรุปข้อมูล"
                : activeStep + 1 > steps.length
                ? ""
                : "ต่อไป"}
            </p>
          </Button> */}
          {activeStep <= steps.length - 1 && (
            <ButtonBG1
              handleClick={handleNext}
              text={
                activeStep + 1 === steps.length && allStepsCompleted()
                  ? "สรุปข้อมูล"
                  : activeStep + 1 > steps.length
                  ? ""
                  : "ต่อไป"
              }
              mdiIcon={mdiArrowRightCircle}
              tailwind={"flex-row-reverse"}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
