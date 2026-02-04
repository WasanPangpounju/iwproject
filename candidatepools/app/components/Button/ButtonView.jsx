import { mdiEyeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import React from "react";

function ButtonView({ link }) {
  return (
    <Link
      href={link}
      className="cursor-pointer flex justify-center items-center gap-2 w-fit border px-2 py-1 bg-gray-800 text-white rounded-md"
    >
      <Icon className={`cursor-pointer`} path={mdiEyeOutline} size={0.8} />
      <p>View</p>
    </Link>
  );
}

export default ButtonView;
