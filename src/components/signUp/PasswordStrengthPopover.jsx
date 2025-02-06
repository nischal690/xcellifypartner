import React, { useState, useEffect, useRef } from 'react';

const PasswordStrengthPopover = ({ children, password }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState({
    lengthValid: false,
    upperCaseValid: false,
    lowerCaseValid: false,
    digitValid: false,
    specialCharValid: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const handleFocus = () => {
    setIsPopoverOpen(true);
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      lengthValid: password.length >= 8,
      upperCaseValid: /[A-Z]/.test(password),
      lowerCaseValid: /[a-z]/.test(password),
      digitValid: /\d/.test(password),
      specialCharValid: /[!@#$%^&*]/.test(password),
    });
  };

  const getMessageStyle = (isValid) =>
    isValid ? 'text-green-500' : 'text-red-500';

  const validationRules = [
    { key: 'lengthValid', message: 'At least 8 characters long' },
    { key: 'upperCaseValid', message: 'At least one uppercase letter' },
    { key: 'lowerCaseValid', message: 'At least one lowercase letter' },
    { key: 'digitValid', message: 'At least one digit' },
    { key: 'specialCharValid', message: 'At least one special character' },
  ];

  return (
    <div className="relative w-full" ref={inputRef}>
      <div className="relative w-full" onFocus={handleFocus}>
        {children}
      </div>

      {isPopoverOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 border border-gray-200"
        >
          <h4 className="text-sm font-semibold mb-2">Password Strength</h4>
          <ul className="space-y-1">
            {validationRules.map((rule) => (
              <li
                key={rule.key}
                className={`${getMessageStyle(
                  passwordStrength[rule.key]
                )} text-sm`}
              >
                {passwordStrength[rule.key] ? '✔️' : '❌'} {rule.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthPopover;
