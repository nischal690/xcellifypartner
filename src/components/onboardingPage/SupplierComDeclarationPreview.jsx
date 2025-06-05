import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import { FaDownload, FaFilePdf, FaEye } from 'react-icons/fa';
import { Packer } from 'docx';

import { generateDocFromTemplate } from '../../utils/generateDocFromTemplate';
import { generateComIndividualDoc } from '../../utils/supplierDeclarationHelpers';
import DocumentPreview from './DocumentPreview';

const SupplierComDeclarationPreview = ({ formData, onAgree, careOf, age }) => {
  // console.log('careOf =', careOf);
  // console.log('age =', age);

  const handleAgree =
    onAgree ||
    ((file) => {
      const input = document.querySelector(
        'input[name="supplier_declaration_com"]'
      );
      if (!input) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

  const [showPreview, setShowPreview] = useState(false);

  /**
   * mode = 'declaration' is Partner Declaration for generateDocFromTemplate
   * mode = 'service'     is Service Agreement   for generateComIndividualDoc
   */
  const handleGenerateDoc = async (
    mode = 'declaration',
    autoAttach = false
  ) => {
    const { signature } = formData;

    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      today.getFullYear(),
    ].join('-');

    const sigFile =
      formData.signature && typeof formData.signature !== 'string'
        ? formData.signature
        : null;

    let blob;
    if (mode === 'service') {
      let signatureImage = null;
      if (signature && typeof signature !== 'string') {
        const arrayBuffer = await signature.arrayBuffer();
        signatureImage = new Uint8Array(arrayBuffer);
      }
      const doc = await generateComIndividualDoc(
        formData,
        signatureImage,
        formattedDate,
        careOf,
        age
      );
      blob = await Packer.toBlob(doc);
    } else {
      blob = await generateDocFromTemplate(
        formData,
        sigFile,
        formattedDate,
        careOf,
        age
      );
    }

    if (autoAttach && mode === 'declaration') {
      const file = new File([blob], 'PartnerServiceAgreement.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      handleAgree(file);
    } else {
      const filename =
        mode === 'service'
          ? 'Service_Agreement.docx'
          : 'PartnerServiceAgreement.docx';
      saveAs(blob, filename);
    }
  };

  const previewLines = [
    { heading: 'Agreement Summary' },
    { label: 'Date', value: new Date().toLocaleDateString() },
    { label: 'Company Name', value: formData.company_name },
    { label: 'Company Type', value: formData.company_type },
    { label: 'Contact Person', value: formData.contact_person_name },
    { label: 'Email', value: formData.contact_person_email },
    { label: 'GST Number', value: formData.GST },
    { label: 'PAN Number', value: formData.PAN },
    { label: 'CIN', value: formData.CIN },
    { label: 'Address Line 1', value: formData.address_line_1 },
    { label: 'Address Line 2', value: formData.address_line_2 },
    { label: 'Bank Name', value: formData.bank_name },
    { label: 'Bank IFSC', value: formData.bank_ifsc },
    { label: 'Account Number', value: formData.bank_account_number },
    { label: 'Account Holder', value: formData.account_holder_name },
    { label: 'Account Type', value: formData.bank_account_type },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex-1 bg-white border hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
          style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FaEye className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex flex-col text-left">
              <span
                className="font-medium text-sm"
                style={{ color: '#19074A' }}
              >
                Preview Agreement
              </span>
              <span className="text-xs text-gray-500">
                View before download
              </span>
            </div>
          </div>
          <div
            className="text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #19074A, #876FFD)',
            }}
          >
            <FaEye size={16} />
          </div>
        </button>

        {/* DOCX Download Button */}
        <button
          type="button"
          onClick={() => handleGenerateDoc('service', false)}
          className="flex-1 bg-white border hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
          style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}
        >
          <div className="flex items-center">
            <div
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}
            >
              <img src={wordDocIcon} alt="Word Document" className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left">
              <span
                className="font-medium text-sm"
                style={{ color: '#19074A' }}
              >
                Agreement (DOCX)
              </span>
              <span className="text-xs text-gray-500">Microsoft Word</span>
            </div>
          </div>
          <div
            className="text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #19074A, #876FFD)',
            }}
          >
            <FaDownload size={16} />
          </div>
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-900">
                  Declaration Preview
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {showPreview && (
                <DocumentPreview
                  formData={formData}
                  signatureFile={
                    formData.signature && typeof formData.signature !== 'string'
                      ? formData.signature
                      : null
                  }
                  onClose={() => setShowPreview(false)}
                  onDownload={() => {
                    handleGenerateDoc('service', false);
                    setShowPreview(false);
                  }}
                  onAttach={() => {
                    handleGenerateDoc('declaration', true);
                    setShowPreview(false);
                  }}
                  careOf={careOf}
                  age={age}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierComDeclarationPreview;
