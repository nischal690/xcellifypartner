import React from 'react';

const TextFieldWithVerification = ({
  field,
  formData,
  errors,
  handleChange,
  handleDisable,
  isPANValidated,
  isGSTValidated,
  isAadhaarVerified,
  setShowOtpModal,
  disableCountrySelction,
  requestAadhaarOtp,
}) => {
  const isAddressField = [
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'pincode',
    'country',
  ].includes(field.name);

  const getInputType = () => {
    if (field.type === 'url') return 'url';
    if (field.type === 'email') return 'email';
    if (field.type === 'mobile') return 'tel';
    return 'text';
  };

  const getPlaceholder = () => {
    if (field.name === 'CIN') {
      return ['Individual', 'sole_proprietership', 'partnership'].includes(
        formData.company_type
      )
        ? 'Enter 12-digit Aadhaar number'
        : 'Enter 21-character CIN';
    }
    if (field.name === 'PAN') return 'Format: ABCDE1234F';
    return `Enter ${field.label.toLowerCase()}`;
  };

  const getBorderClass = () => {
    if (errors[field.name])
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (field.name === 'PAN' && isPANValidated)
      return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500';
    if (field.name === 'GST' && isGSTValidated)
      return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500';
    if (field.name === 'company_name' && isGSTValidated)
      return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500';
    if (isGSTValidated && isAddressField)
      return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500';
    if (field.name === 'CIN' && isAadhaarVerified)
      return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500';
    if (
      formData.pincode?.length === 6 &&
      disableCountrySelction &&
      (field.name === 'country' ||
        field.name === 'state' ||
        field.name === 'city')
    )
      return 'border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-blue-500';

    return 'border-gray-300 focus:border-purple-500 focus:ring-purple-500';
  };

  const showSuccessIcon = () => {
    return (
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mb-5">
        <svg
          className="h-5 w-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  };

  const showPincodeIcon = () => {
    return (
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {field.name === 'CIN' ? (
        <>
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            disabled={handleDisable(field.name)}
            placeholder={getPlaceholder()}
            className={`w-full px-4 py-3 pr-24 rounded-lg border ${getBorderClass()} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
            maxLength={12}
          />
          {['Individual', 'sole_proprietership', 'partnership'].includes(
            formData.company_type
          ) &&
            (!isAadhaarVerified ? (
              <button
                type="button"
                onClick={async () => {
                  const success = await requestAadhaarOtp();
                  if (success) {
                    setShowOtpModal(true);
                  }
                }}
                disabled={formData[field.name]?.length !== 12}
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 px-3 py-1 rounded-md text-xs transition-all duration-300 ${
                  formData[field.name]?.length === 12
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verify OTP
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mb-5">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ))}

          {/*  Aadhaar success message */}
          {isAadhaarVerified && (
            <p className="mt-1 text-sm text-green-600">
              Aadhaar verified successfully
            </p>
          )}
        </>
      ) : (
        <>
          <input
            type={getInputType()}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            disabled={
              handleDisable(field.name) ||
              (field.name === 'PAN' && isPANValidated)
            }
            placeholder={getPlaceholder()}
            className={`w-full px-4 py-3 rounded-lg border ${getBorderClass()} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 ${
              (field.name === 'PAN' && isPANValidated) ||
              (field.name === 'GST' && isGSTValidated) ||
              (field.name === 'company_name' && isGSTValidated) ||
              (isGSTValidated && isAddressField) ||
              (formData.pincode?.length === 6 &&
                disableCountrySelction &&
                (field.name === 'country' ||
                  field.name === 'state' ||
                  field.name === 'city'))
                ? 'pr-10'
                : ''
            }`}
          />
        </>
      )}

      {/* Success Icons */}
      {field.name === 'PAN' && isPANValidated && showSuccessIcon()}
      {field.name === 'GST' && isGSTValidated && showSuccessIcon()}
      {field.name === 'company_name' && isGSTValidated && showSuccessIcon()}
      {isGSTValidated && isAddressField && showSuccessIcon()}
      {formData.pincode?.length === 6 &&
        disableCountrySelction &&
        (field.name === 'country' ||
          field.name === 'state' ||
          field.name === 'city') &&
        showPincodeIcon()}

      {/* Success Messages */}
      {field.name === 'PAN' && isPANValidated && (
        <p className="mt-1 text-sm text-green-600">PAN verified successfully</p>
      )}
      {field.name === 'GST' && isGSTValidated && (
        <p className="mt-1 text-sm text-green-600">GST verified successfully</p>
      )}
      {field.name === 'company_name' && isGSTValidated && (
        <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
      )}
      {isGSTValidated && isAddressField && (
        <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
      )}
      {formData.pincode?.length === 6 &&
        disableCountrySelction &&
        ['country', 'state', 'city'].includes(field.name) && (
          <p className="mt-1 text-sm text-blue-600">Auto-filled from Pincode</p>
        )}
    </div>
  );
};

export default TextFieldWithVerification;
