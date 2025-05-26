import React, { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}