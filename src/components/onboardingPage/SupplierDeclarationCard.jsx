import React from 'react';
import { FaDownload } from 'react-icons/fa';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';

const SupplierDeclarationCard = () => {
  return (
    <div className="bg-[#F2F0F7] p-4 rounded-lg">
      {/* File Card */}
      <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <img src={wordDocIcon} alt="Word Document" className="w-8 h-8" />
          <span className="text-gray-900 font-medium">
            Supplier Declaration.docx
          </span>
        </div>
        <a
          href="/docs/Partner declaration form.docx"
          download="Supplier_Declaration.docx"
          className="text-blue-primary hover:text-purple-800 flex items-center space-x-1"
        >
          <FaDownload size={18} />
        </a>
      </div>

      {/* Steps Section */}
      <div className="mt-4">
        <h3 className="text-gray-900 font-semibold">Steps</h3>
        <ul className="text-gray-700 mt-1 space-y-1 list-disc pl-5">
          <li>Download the supplier declaration form.</li>
          <li>Complete the form.</li>
          <li>Re-upload the completed form.</li>
        </ul>
      </div>
    </div>
  );
};

export default SupplierDeclarationCard;
