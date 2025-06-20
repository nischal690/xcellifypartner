import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import { FaDownload, FaEye } from 'react-icons/fa';

import {
  generateSupplierDoc,
  getLanguageTemplate
} from '../../utils/supplierDeclarationHelpers';

const SupplierDeclarationPreview = ({ formData, onAgree }) => {
  // If no onAgree function is provided, create a default one that creates a File object
  // and attaches it to the supplier_declaration field in the form
  const handleAgree = onAgree || ((file) => {
    // Find the supplier_declaration input field
    const declarationInput = document.querySelector('input[name="supplier_declaration"]');
    
    if (declarationInput) {
      // Create a DataTransfer to set the files property
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Set the files property
      declarationInput.files = dataTransfer.files;
      
      // Dispatch a change event to trigger any listeners
      const event = new Event('change', { bubbles: true });
      declarationInput.dispatchEvent(event);
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState([]);
  const handleGenerateDoc = async (autoAttach = false) => {
    const { signature } = formData;

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

    // Generate the document using the unified helper function
    const doc = generateSupplierDoc(formData, signatureImage, formattedDate);
    const blob = await Packer.toBlob(doc);
    
    if (autoAttach) {
      // Create a File object from the blob that can be attached to a form input
      const file = new File([blob], 'Supplier_Declaration.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      handleAgree(file);
    } else {
      // Just download the file
      saveAs(blob, 'Supplier_Declaration.docx');
    }
  };

  // Preview the document content
  const handlePreview = () => {
    const { company_type, company_name, contact_person_name, GST, PAN, address_line_1, address_line_2 } = formData;
    
    // Get the language template - using the same helper as the document generator
    const lang = getLanguageTemplate(company_type);
    
    // Determine the name to use in the declaration - same logic as in document generator
    const declarationName = company_type === 'Individual' || 
                          company_type === 'sole_proprietership' || 
                          company_type === 'partnership' 
                          ? contact_person_name : company_name;
    
    // Create preview content using the language template
    const content = [
      { heading: 'Declaration by Supplier', type: 'heading' },
      { text: `${lang.namePrefix} ${declarationName || '-'}`, type: 'paragraph' },
      { text: `with GSTIN - ${GST || '-'}`, type: 'paragraph' },
      { text: `PAN - ${PAN || '-'}`, type: 'paragraph' },
      { text: `Having principal place of business - ${address_line_1 || '-'}`, type: 'paragraph' },
      { text: `${address_line_2 || '-'}`, type: 'paragraph' },
      { text: 'Hereby declare and confirm the following:', type: 'paragraph', style: 'bold' },
      { text: `➢ ${lang.businessEngagement} - (${company_type || '-'})`, type: 'paragraph' },
      { text: `➢ ${lang.confirmGST} not registered as a composition taxpayer.`, type: 'paragraph' },
      { text: `➢ ${lang.confirmInvoices}`, type: 'paragraph' },
      { text: `➢ ${lang.undertakeToInform}`, type: 'paragraph' },
      { text: `${lang.declareTrue}`, type: 'paragraph', style: 'italic' },
    ];
    
    setPreviewContent(content);
    setShowPreview(true);
  };
  


  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={handlePreview}
          className="flex-1 bg-white border hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
          style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FaEye className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-medium text-sm" style={{ color: '#19074A' }}>
                Preview Declaration
              </span>
              <span className="text-xs text-gray-500">View before download</span>
            </div>
          </div>
          <div className="text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
               style={{ background: 'linear-gradient(to right, #19074A, #876FFD)' }}>
            <FaEye size={16} />
          </div>
        </button>
        {/* DOCX Download Button */}
        <button
          type="button"
          onClick={handleGenerateDoc}
          className="flex-1 bg-white border hover:bg-purple-50 transition-all duration-300 rounded-lg shadow-sm p-3 flex items-center justify-between group"
          style={{ borderColor: 'rgba(134, 110, 252, 0.3)' }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(134, 110, 252, 0.15)' }}>
              <img src={wordDocIcon} alt="Word Document" className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-medium text-sm" style={{ color: '#19074A' }}>
                Declaration (DOCX)
              </span>
              <span className="text-xs text-gray-500">Microsoft Word</span>
            </div>
          </div>
          <div className="text-white p-2 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
               style={{ background: 'linear-gradient(to right, #19074A, #876FFD)' }}>
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
                <h2 className="text-xl font-bold text-purple-900">Agreement Preview</h2>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="border-t border-b py-6 my-4">
                {previewContent.map((item, index) => {
                  if (item.type === 'heading') {
                    return (
                      <h3 key={index} className="text-xl font-bold text-center my-4 text-purple-900">
                        {item.text || item.heading}
                      </h3>
                    );
                  } else {
                    return (
                      <p 
                        key={index} 
                        className={`my-2 ${item.style === 'bold' ? 'font-bold' : ''} ${item.style === 'italic' ? 'italic' : ''}`}
                      >
                        {item.text}
                      </p>
                    );
                  }
                })}
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleGenerateDoc();
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, #19074A, #876FFD)' }}
                >
                  Download Document
                </button>
                <button
                  onClick={() => {
                    handleGenerateDoc(true);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                >
                  I Agree & Attach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDeclarationPreview;
