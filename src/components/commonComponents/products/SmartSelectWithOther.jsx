import React from 'react';

const SmartSelectWithOther = ({
  label,
  name,
  options,
  formData,
  errors,
  onChange,
  placeholder = 'Select an option',
}) => {
  const isOtherSelected = formData[name] === 'Others';

  return (
    <div>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={onChange}
        className={`w-full p-2 border rounded-md ${
          errors[name] ? 'border-red-500' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>

      {isOtherSelected && (
        <>
          <input
            type="text"
            name={`custom_${name}`}
            placeholder={`Please specify your ${label.toLowerCase()}`}
            value={formData[`custom_${name}`] || ''}
            onChange={onChange}
            className={`mt-2 w-full p-2 border rounded-md ${
              errors[`custom_${name}`] ? 'border-red-500' : ''
            }`}
          />
          {errors[`custom_${name}`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`custom_${name}`]}
            </p>
          )}
        </>
      )}

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
};

export default SmartSelectWithOther;
