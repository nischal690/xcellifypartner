import React, { useEffect, useState } from "react";

const PasswordStrengthChecker = ({ password, confirmPassword }) => {
  const [passwordStrength, setPasswordStrength] = useState({
    lengthValid: false,
    upperCaseValid: false,
    lowerCaseValid: false,
    digitValid: false,
    specialCharValid: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    const lengthValid = password.length >= 8;
    const upperCaseValid = /[A-Z]/.test(password);
    const lowerCaseValid = /[a-z]/.test(password);
    const digitValid = /\d/.test(password);
    const specialCharValid = /[!@#$%^&*]/.test(password);

    setPasswordStrength({
      lengthValid,
      upperCaseValid,
      lowerCaseValid,
      digitValid,
      specialCharValid,
    });

    setPasswordMatch(password === confirmPassword);

    const allValid =
      lengthValid &&
      upperCaseValid &&
      lowerCaseValid &&
      digitValid &&
      specialCharValid;

    setIsPasswordValid(allValid);
  }, [password, confirmPassword]);

  const getMessageStyle = (isValid) =>
    isValid ? "text-green-500" : "text-[black]";

  const validationRules = [
    {
      key: "lengthValid",
      message: "Password must be at least 8 characters long",
    },
    {
      key: "upperCaseValid",
      message: "Password must contain at least one uppercase letter",
    },
    {
      key: "lowerCaseValid",
      message: "Password must contain at least one lowercase letter",
    },
    { key: "digitValid", message: "Password must contain at least one digit" },
    {
      key: "specialCharValid",
      message: "Password must contain at least one special character",
    },
  ];

  return (
    <div>
      {(password || confirmPassword) && !isPasswordValid && (
        <ul className="list-disc pl-5 space-y-2">
          {validationRules.map((rule) => (
            <li
              key={rule.key}
              className={getMessageStyle(passwordStrength[rule.key])}
            >
              {rule.message}
            </li>
          ))}
        </ul>
      )}

      {/*!passwordMatch && password !== "" && confirmPassword !== "" && (
        <p className="text-green-500 text-sm">Passwords doesn't match</p>
      )}

      {isPasswordValid && password !== "" && confirmPassword !== "" && (
        <p className="text-green-500 text-sm mt-2">Strong password accepted</p>
      )*/}
    </div>
  );
};

export default PasswordStrengthChecker;
