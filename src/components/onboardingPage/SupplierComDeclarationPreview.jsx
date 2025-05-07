import React from 'react';
import { saveAs } from 'file-saver';
import { generateDocFromTemplate } from '../../utils/generateDocFromTemplate';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import { FaDownload, FaFilePdf } from 'react-icons/fa';

const SupplierComDeclarationPreview = ({ formData }) => {
  const handleGenerateDoc = async () => {
    const { signature } = formData;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${today.getFullYear()}`;

    let signatureImageFile = null;
    if (signature && typeof signature !== 'string') {
      signatureImageFile = signature;
    }

    await generateDocFromTemplate(formData, signatureImageFile, formattedDate);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* DOCX Download Button */}
        <button
          type="button"
          onClick={handleGenerateDoc}
          className="flex-1 bg-white border border-purple-200 hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <img src={wordDocIcon} alt="Word Document" className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-gray-900 font-medium text-sm">
                Declaration (DOCX)
              </span>
              <span className="text-xs text-gray-500">Microsoft Word</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
            <FaDownload size={16} />
          </div>
        </button>

        {/* PDF Button (Future use) */}
        <button
          type="button"
          onClick={handleGenerateDoc}
          className="flex-1 bg-white border border-purple-200 hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FaFilePdf className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-gray-900 font-medium text-sm">
                Declaration (PDF)
              </span>
              <span className="text-xs text-gray-500">Adobe PDF</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
            <FaDownload size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SupplierComDeclarationPreview;
