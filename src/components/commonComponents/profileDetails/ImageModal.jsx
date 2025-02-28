import React from 'react';

const ImageModal = ({ onClose, children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-lg relative w-96">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ImageModal;
