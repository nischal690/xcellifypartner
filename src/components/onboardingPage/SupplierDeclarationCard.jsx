import React from 'react';
import { FaDownload, FaFileWord, FaCheckCircle } from 'react-icons/fa';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';

const SupplierDeclarationCard = () => {
  return (
    <div className="p-5 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md" 
         style={{ background: 'linear-gradient(to right, #f5f3ff, #eef2ff)', borderColor: 'rgba(134, 110, 252, 0.3)' }}>
      {/* File Card */}
      <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-md border" 
           style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
            <img src={wordDocIcon} alt="Word Document" className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium" style={{ color: '#18064A' }}>
              Supplier Declaration.docx
            </span>
            <span className="text-xs text-gray-500">12KB • Word Document</span>
          </div>
        </div>
        <a
          href="/docs/Partner declaration form.docx"
          download="Partner_GST_Declaration.docx"
          className="text-white p-2.5 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
          style={{ 
            background: 'linear-gradient(to right, #18064A, #866EFC)',
            boxShadow: '0 2px 4px rgba(134, 110, 252, 0.25)'
          }}
        >
          <FaDownload size={16} />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>

      {/* Steps Section */}
      <div className="mt-5 bg-white p-4 rounded-lg shadow-md border"
           style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}>
        <h3 className="font-semibold flex items-center" style={{ color: '#18064A' }}>
          <span className="p-1.5 rounded-full mr-2" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#18064A' }}>
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </span>
          How to Complete Your Declaration
        </h3>
        <ul className="text-gray-700 mt-3 space-y-3">
          <li className="flex items-start">
            <div className="p-1 rounded-full mr-2 mt-0.5" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
              <span className="flex items-center justify-center w-4 h-4 font-bold text-xs" style={{ color: '#18064A' }}>1</span>
            </div>
            <span>Download the supplier declaration form</span>
          </li>
          <li className="flex items-start">
            <div className="p-1 rounded-full mr-2 mt-0.5" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
              <span className="flex items-center justify-center w-4 h-4 font-bold text-xs" style={{ color: '#18064A' }}>2</span>
            </div>
            <span>Fill in all required details (the form will adapt based on your company type)</span>
          </li>
          <li className="flex items-start">
            <div className="p-1 rounded-full mr-2 mt-0.5" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
              <span className="flex items-center justify-center w-4 h-4 font-bold text-xs" style={{ color: '#18064A' }}>3</span>
            </div>
            <span>Upload the completed form in the designated area above</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupplierDeclarationCard;
