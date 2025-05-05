import React from 'react';
import { FaDownload, FaFileWord, FaCheckCircle } from 'react-icons/fa';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';

const SupplierDeclarationCard = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md">
      {/* File Card */}
      <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-md border border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <img src={wordDocIcon} alt="Word Document" className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium">
              Supplier Declaration.docx
            </span>
            <span className="text-xs text-gray-500">12KB • Word Document</span>
          </div>
        </div>
        <a
          href="/docs/Partner declaration form.docx"
          download="Partner_GST_Declaration.docx"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
        >
          <FaDownload size={16} />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>

      {/* Steps Section */}
      <div className="mt-5 bg-white p-4 rounded-lg shadow-md border border-purple-100">
        <h3 className="text-purple-800 font-semibold flex items-center">
          <span className="bg-purple-100 p-1.5 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </span>
          How to Complete Your Declaration
        </h3>
        <ul className="text-gray-700 mt-3 space-y-3">
          <li className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
              <span className="flex items-center justify-center w-4 h-4 text-purple-700 font-bold text-xs">1</span>
            </div>
            <span>Download the supplier declaration form</span>
          </li>
          <li className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
              <span className="flex items-center justify-center w-4 h-4 text-purple-700 font-bold text-xs">2</span>
            </div>
            <span>Fill in all required details (the form will adapt based on your company type)</span>
          </li>
          <li className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
              <span className="flex items-center justify-center w-4 h-4 text-purple-700 font-bold text-xs">3</span>
            </div>
            <span>Upload the completed form in the designated area above</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupplierDeclarationCard;
