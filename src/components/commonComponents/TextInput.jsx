import React from "react";

export default function TextInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  containerStyle = "",
  inputStyle = "",
  error,
  disabled,
}) {
  return (
    <div className={containerStyle}>
      <input
        className={inputStyle}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
      {error && <p className="text-red-600 text-sm font-medium mt-1 px-1">{error}</p>}
    </div>
  );
}
