import React from "react";

function SocialMediaButton({
  icon,
  text,
  onClick,
  containerStyle = "",
  iconStyle = "",
  textStyle = "",
}) {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center border-2 border-white py-2 px-2 rounded-full text-white transition-all bg-white  ${containerStyle}`}
      onClick={onClick}
    >
      <img src={icon} alt={text} className={`h-5 ${iconStyle}`} />
      <span className={textStyle}>{text}</span>
    </button>
  );
}

export default SocialMediaButton;
