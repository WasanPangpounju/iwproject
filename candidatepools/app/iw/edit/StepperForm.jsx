"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// MUI
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";

import { useTheme } from "@/app/ThemeContext";

// store
import { useUserStore } from "@/stores/useUserStore";
import { useEducationStore } from "@/stores/useEducationStore";
import { useHistoryWorkStore } from "@/stores/useHistoryWorkStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useResumeStore } from "@/stores/useResumeStore";
import { useInterestedWorkStore } from "@/stores/useInterestedworkStore";

// components
import ResumeComponent from "@/app/components/Resume/ResumeComponent";
import PersonalForm from "@/app/components/Form/PersonalForm";
import EducationForm from "@/app/components/Form/EducationForm";
import HistoryWorkForm from "@/app/components/Form/HistoryWorkForm";
import SkillForm from "@/app/components/Form/SkillForm";
import InterestedWorkForm from "@/app/components/Form/InterestedWorkForm";
import SumaryData from "@/app/components/Form/SumaryData";

import {
  mdiArrowLeftCircle,
  mdiArrowRightCircle,
  mdiContentSave,
} from "@mdi/js";
import ButtonBG1 from "@/app/components/Button/ButtonBG1";
import ButtonBG3 from "@/app/components/Button/ButtonBG3";
import { toast } from "react-toastify";

const steps = [
  "ข้อมูลส่วนบุคคล",
  "ประวัติการศึกษา",
  "ประวัติการทำงาน/ฝึกงาน",
  "ความสามารถ/การอบรม",
  "เรซูเม่",
  "ลักษณะงานที่สนใจ",
  "สรุปข้อมูล", // ✅ ให้ตรงกับ case 6 + ปุ่ม "สรุปข้อมูล"
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
  // ✅ WCAG: focus visible สำหรับการคีย์บอร์ด
  "& .MuiStepButton-root:focus-visible": {
    outline: "3px solid #1d4ed8",
    outlineOffset: "3px",
    borderRadius: "10px",
  },
};

export default function StepperForm() {
  // params
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawStepper = searchParams.get("stepper");

  // ✅ ป้องกัน NaN / null
  const stepFromQuery = useMemo(() => {
    const n = Number(rawStepper);
    if (!Number.isFinite(n) || n < 1) return 1;
    if (n > steps.length) return steps.length;
    return n;
  }, [rawStepper]);

  // store
  const { dataUser } = useUserStore();
  const { dataEducations } = useEducationStore();
  const { dataHistoryWork } = useHistoryWorkStore();
  const { dataSkills } = useSkillStore();
  const { dataWorks } = useInterestedWorkStore();
  const { resumeFiles, fetchResumeFiles, clearResumeFiles } = useResumeStore();

  const [activeStep, setActiveStep] = useState(stepFromQuery - 1);
  const [completed, setCompleted] = useState({});

  // theme
  const { bgColorMain2 } = useTheme();

  // ✅ Responsive: mobile = vertical, desktop = horizontal
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    fetchResumeFiles(dataUser?.uuid);
    return () => {
      clearResumeFiles();
    };
  }, [dataUser, fetchResumeFiles, clearResumeFiles]);

  useEffect(() => {
    setActiveStep(stepFromQuery - 1);
  }, [stepFromQuery]);

  // check complete
  useEffect(() => {
    const newCompleted = {};

    if (dataUser?.idCardDisabled) newCompleted[0] = true;

    if (dataEducations?.educationLevel?.[0]) newCompleted[1] = true;

    if (
      dataHistoryWork?.internships?.[0]?.place ||
      dataHistoryWork?.projects?.[0]?.name ||
      dataHistoryWork?.workExperience?.[0]?.place
    ) {
      newCompleted[2] = true;
    }

    if (dataSkills?.skills?.[0]?.type || dataSkills?.trains?.[0]?.name) {
      newCompleted[3] = true;
    }

    // resume: เมื่อ step 0-3 ครบ ให้ถือว่า step 4 ครบ
    if (
      newCompleted[0] &&
      newCompleted[1] &&
      newCompleted[2] &&
      newCompleted[3]
    ) {
      newCompleted[4] = true;
    }

    if (dataWorks?.interestedWork?.[0]?.type) {
      newCompleted[5] = true;
    }

    // สรุปข้อมูล (step 6) = เมื่อครบทุกส่วนก่อนหน้า
    if (
      newCompleted[0] &&
      newCompleted[1] &&
      newCompleted[2] &&
      newCompleted[3] &&
      newCompleted[4] &&
      newCompleted[5]
    ) {
      newCompleted[6] = true;
    }

    setCompleted((prev) => ({ ...prev, ...newCompleted }));
  }, [dataUser, dataEducations, dataHistoryWork, dataSkills, dataWorks]);

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    // ✅ กันหลุดช่วง
    if (activeStep >= steps.length - 1) return;

    const newActiveStep =
      activeStep === steps.length - 2 && !completed[activeStep + 1]
        ? activeStep + 1
        : activeStep + 1;

    router.push(`?stepper=${newActiveStep + 1}&path=edit`);
    setActiveStep(newActiveStep);
  };

  const handleSuccess = () => {
    toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
    router.push(`?stepper=1&path=edit`);
  };

  const handleBack = () => {
    const newActiveStep = Math.max(0, activeStep - 1);
    setActiveStep(newActiveStep);
    router.push(`?stepper=${newActiveStep + 1}&path=edit`);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    router.push(`?stepper=${step + 1}&path=edit`);
  };

  const handleComplete = () => {
    setCompleted((prev) => ({
      ...prev,
      [activeStep]: true,
    }));
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

  const currentStepLabel = steps[activeStep] || "";

  return (
    <div className={`${bgColorMain2} rounded-lg p-5`}>
      <Box sx={{ width: "100%" }}>
        {/* ✅ WCAG: ประกาศ step ปัจจุบันให้ screen reader */}
        <p className="sr-only" aria-live="polite">
          ขณะนี้อยู่ขั้นตอน: {currentStepLabel}
        </p>

        <nav aria-label="ขั้นตอนการกรอกข้อมูล">
          <Stepper
            nonLinear
            activeStep={activeStep}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {steps.map((label, index) => {
              const isActive = index === activeStep;
              const isDone = !!completed[index];

              return (
                <Step key={label} completed={isDone} sx={stepStyle}>
                  <StepButton
                    onClick={handleStep(index)}
                    aria-label={`ขั้นตอนที่ ${index + 1} จาก ${steps.length}: ${label}${
                      isDone ? " (เสร็จสิ้น)" : ""
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
        </nav>

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

          <Box sx={{ flex: "1 1 auto" }} />

          {/* ปุ่มถัดไป */}
          {activeStep < steps.length - 1 && (
            <ButtonBG1
              handleClick={handleNext}
              text={
                activeStep + 1 === steps.length - 1 ? "สรุปข้อมูล" : "ต่อไป"
              }
              mdiIcon={mdiArrowRightCircle}
              tailwind={"flex-row-reverse"}
            />
          )}

          {activeStep === steps.length - 1 && (
            <ButtonBG3
              handleClick={handleSuccess}
              mdiIcon={mdiContentSave}
              text={"เสร็จสิ้น"}
              tailwind={"flex-row-reverse"}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
