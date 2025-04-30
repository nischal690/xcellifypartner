import { useState } from 'react';
import { MdClose } from 'react-icons/md';

function ServiceModal({ isOpen, onClose, onVerify }) {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'failure' | null
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const response = await onVerify(otp);
    setLoading(false);

    if (response.success) {
      setStatus('success');
    } else {
      setStatus('failure');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white px-12 pt-2 pb-10 rounded-lg shadow-lg ">
        <div className="flex justify-end">
          <button onClick={onClose} className="mt-4 text-gray-500">
            <MdClose />
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-2 text-center">
          OTP Verification
        </h2>
        <p className="text-center mb-6">
          Please ask your customer for the OTP.
        </p>
        {status === 'success' ? (
          <p className="text-green-600">OTP Verified Successfully!</p>
        ) : status === 'failure' ? (
          <p className="text-red-600">Verification Failed! Try again.</p>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full button-gradient1 text-white p-2 rounded-lg"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceModal;
