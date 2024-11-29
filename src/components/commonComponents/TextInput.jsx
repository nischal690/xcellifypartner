import React from "react";

export default function TextInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  containerStyle = "",
  inputStyle = "",
}) {
  return (
    <div className={containerStyle}>
      <input
        className={inputStyle}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
