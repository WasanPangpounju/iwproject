import React, { Suspense } from "react";
import StepperForm from "./StepperForm";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <StepperForm />
    </Suspense>
  );
}