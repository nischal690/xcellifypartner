import React from 'react';

const LoaderMessage = ({ message = 'Processing...' }) => {
  return (
    <p className="text-sm text-purple-primary mt-2 flex items-center">
      <svg
        className="animate-spin h-5 w-5 mr-2 text-purple-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      {message}
    </p>
  );
};

export default LoaderMessage;
