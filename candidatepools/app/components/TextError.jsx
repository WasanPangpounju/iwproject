import React from "react";

function TextError({ text, className = "" }) {
  return <p className={`text-red-500 text-xs ${className}`}>* {text}</p>;
}

export default TextError;
