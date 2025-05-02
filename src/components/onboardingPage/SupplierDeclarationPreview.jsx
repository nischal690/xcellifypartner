import React from 'react';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import { FaDownload } from 'react-icons/fa';

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

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 mr-10">
          <img src={wordDocIcon} alt="Word Document" className="w-8 h-8" />
          <span className="text-gray-900 font-medium">
            Supplier Declaration.docx
          </span>
        </div>
        <button
          type="button"
          onClick={handleGenerateDoc}
          className="text-blue-primary hover:text-purple-800 flex items-center space-x-1"
        >
          <FaDownload size={18} />
        </button>
      </div>
    </div>
  );
};

export default SupplierDeclarationPreview;
