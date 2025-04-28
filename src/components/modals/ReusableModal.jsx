import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 transform transition-all scale-95 animate-fadeIn">
            <div className="modal-content text-center space-y-6">
                {children}
            </div>
        </div>
    </div>

  );
};


export default Modal;