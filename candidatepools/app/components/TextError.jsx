import React from "react";

function TextError({ text }) {
  return <p className="text-red-500 text-xs">* {text}</p>;
}

export default TextError;
