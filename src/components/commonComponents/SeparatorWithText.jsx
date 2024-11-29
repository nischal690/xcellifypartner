import React from "react";

function SeparatorWithText({ text = "", lineClass = "", textClass = "" }) {
  return (
    <div className="flex items-center w-full max-w-md mt-8">
      <span className={`flex-1 ${lineClass}`}></span>
      <span className={textClass}>{text}</span>
      <span className={`flex-1 ${lineClass}`}></span>
    </div>
  );
}

export default SeparatorWithText;
