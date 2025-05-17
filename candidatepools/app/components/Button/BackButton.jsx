import React from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiArrowLeftCircle } from "@mdi/js";

function BackButton({ path }) {
  return (
    <Link href={path} className="cursor-pointer flex gap-2 items-center ">
      <Icon className="" path={mdiArrowLeftCircle} size={1} />
      <p>ย้อนกลับ</p>
    </Link>
  );
}

export default BackButton;
