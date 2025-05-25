import React from 'react';

const OTPVerificationModal = ({
  isOpen,
  onClose,
  otp,
  setOtp,
  onVerifyOtp,
  message,
  isVerifying,
}) => {
  console.log('OTPVerificationModal rendered with isOpen:', isOpen);
  console.log('OTP value:', otp);
  console.log('Message:', message);
  console.log('isVerifying:', isVerifying);
  
  if (!isOpen) {
    console.log('OTPVerificationModal not showing because isOpen is false');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-96 shadow-lg relative">
        <h2 className="text-xl font-bold mb-4 text-purple-700">
          Verify Aadhaar OTP
        </h2>
        <p className="text-gray-600 mb-6">
          We have sent an OTP to the registered mobile number linked to the
          Aadhaar number you entered.
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-purple-500 focus:border-purple-500"
        />

        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onVerifyOtp}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
