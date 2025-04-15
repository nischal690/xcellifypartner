import React, { useEffect, useState } from 'react';

const AutoFilledInputRating = ({ name, value, label, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value || '');
    }
  }, [value]);

  const handleRatingInputChange = (e) => {
    setDisplayValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleRatingInputChange}
        className="w-full p-2 border border-green-400 bg-green-50 rounded-md focus:outline-none focus:ring focus:ring-green-200"
        placeholder={`Auto-filled ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default AutoFilledInputRating;
