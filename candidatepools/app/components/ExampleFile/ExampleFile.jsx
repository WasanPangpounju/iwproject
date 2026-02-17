import { mdiAlertCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { Tooltip } from "@mui/material";
import React from "react";

function ExampleFile({ className, link, title, isTooltip = false }) {
  function openFileExample() {
    window.open(link, "_blank");
  }
  return (
    <div className={`flex ${className}`}>
      <p>
        <span className="text-red-500 font-bold">ตัวอย่าง</span>
        {!isTooltip && <>&nbsp;&nbsp;&nbsp;&nbsp;{title}</>}
      </p>
      <Tooltip title={isTooltip ? title : ""} placement="bottom">
        <Icon
          onClick={openFileExample}
          className={`cursor-pointer text-gray-400 mx-3`}
          path={mdiAlertCircle}
          size={0.8}
        />
      </Tooltip>
    </div>
  );
}

export default ExampleFile;
