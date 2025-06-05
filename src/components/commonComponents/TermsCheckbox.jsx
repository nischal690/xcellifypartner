import React from 'react';

function TermsCheckbox({
  checked = false,
  onChange,
  termsText = '',
  privacyText = '',
  onTermsClick,
  onPrivacyClick,
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-gray-300 rounded mr-2"
      />

      <span className="text-white text-sm">
        I agree to{' '}
        <span
          style={{ color: '#19074A' }}
          className="font-medium cursor-pointer hover:underline"
          onClick={onTermsClick}
        >
          {termsText}
        </span>{' '}
        and{' '}
        <span
          style={{ color: '#19074A' }}
          className="font-medium cursor-pointer hover:underline"
          onClick={onPrivacyClick}
        >
          {privacyText}
        </span>
      </span>
    </div>
  );
}

export default TermsCheckbox;
