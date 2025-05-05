import React from 'react';

export default function Dropdown({
    id,
    name,
    options = [],
    title,
    onChange,
    value,
    containerStyle = "",
    className = "",
    error,
    disabled,
    placeholder
}) {
    return (
        <>
            <select 
                className={className || "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200"} 
                id={id} 
                name={name} 
                onChange={onChange}
                value={value || ""}
                disabled={disabled}
            >
                <option value="" disabled>{placeholder || `Select ${name}`}</option>
                {options && options.length > 0 && options.map((option, index) => (
                    <option key={index} value={option?.value || option}>
                        {option?.label || option}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-600 text-sm font-medium mt-1 px-1">{error}</p>}
        </>
    );
}