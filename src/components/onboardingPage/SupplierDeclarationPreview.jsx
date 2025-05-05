import React from 'react';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import { FaDownload, FaFilePdf } from 'react-icons/fa';

import {
  generateIndividualDoc,
  generateCompanyDoc,
} from '../../utils/supplierDeclarationHelpers';

const SupplierDeclarationPreview = ({ formData }) => {
  const handleGenerateDoc = async () => {
    const { company_type, signature } = formData;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${today.getFullYear()}`;

    let signatureImage = null;
    if (signature && typeof signature !== 'string') {
      const arrayBuffer = await signature.arrayBuffer();
      signatureImage = new Uint8Array(arrayBuffer);
    }

    let doc;

    if (
      company_type === 'Individual' ||
      company_type === 'sole_proprietership'
    ) {
      doc = generateIndividualDoc(formData, signatureImage, formattedDate);
    } else {
      doc = generateCompanyDoc(formData, signatureImage, formattedDate);
    }

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Supplier_Declaration.docx');
  };

  // Determine language style based on company type
  const getLanguageStyle = () => {
    const { company_type } = formData;
    if (company_type === 'Individual' || company_type === 'sole_proprietership' || company_type === 'partnership') {
      return 'I'; // Individual language style
    } else {
      return 'We'; // Company language style
    }
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

        {/* PDF Download Button (could be implemented later) */}
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

      {/* Preview of declaration language style */}
      <div className="bg-white border border-purple-100 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium text-purple-800 mb-2">Preview of declaration language:</p>
        <p className="italic">
          "{getLanguageStyle()} hereby declare that the information provided is true and correct..."
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Note: The declaration uses {getLanguageStyle() === 'I' ? 'first-person singular ("I")' : 'first-person plural ("We")'} language based on your company type.
        </p>
      </div>
    </div>
  );
};

export default SupplierDeclarationPreview;
