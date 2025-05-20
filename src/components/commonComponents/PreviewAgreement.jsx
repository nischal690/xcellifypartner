import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { FaDownload, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';

/**
 * PreviewAgreement Component
 * 
 * A reusable component for previewing and downloading agreement documents.
 * Supports both DOCX and PDF formats, with dynamic language based on company type.
 * 
 * @param {Object} props
 * @param {Object} props.formData - The data to be used in the agreement
 * @param {Function} props.generateDocument - Function to generate the document
 * @param {Function} props.getPreviewContent - Function to get preview content
 * @param {Function} props.onAgree - Function to call when user agrees to the document
 * @param {string} props.title - Title of the agreement
 * @param {string} props.filename - Filename for the downloaded document (without extension)
 */
const PreviewAgreement = ({ 
  formData, 
  generateDocument, 
  getPreviewContent, 
  onAgree, 
  title = "Agreement Preview", 
  filename = "Document" 
}) => {
  // If no onAgree function is provided, create a default one that creates a File object
  // and attaches it to the form field
  const handleAgree = onAgree || ((file, fieldName = 'agreement_document') => {
    // Find the input field
    const declarationInput = document.querySelector(`input[name="${fieldName}"]`);
    
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
  
  // Generate and handle document download or attachment
  const handleGenerateDoc = async (autoAttach = false) => {
    try {
      // Generate the document using the provided function
      const doc = generateDocument(formData);
      const blob = await Packer.toBlob(doc);
      
      if (autoAttach) {
        // Create a File object from the blob that can be attached to a form input
        const file = new File(
          [blob], 
          `${filename}.docx`, 
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        handleAgree(file);
      } else {
        // Just download the file
        saveAs(blob, `${filename}.docx`);
      }
      
      toast.success('Document generated successfully');
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document');
    }
  };

  // Preview the document content
  const handlePreview = () => {
    try {
      // Get the preview content using the provided function
      const content = getPreviewContent(formData);
      setPreviewContent(content);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        {/* Download DOCX button */}
        <button
          onClick={() => handleGenerateDoc(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 w-full md:w-auto justify-center"
          style={{ background: 'linear-gradient(to right, #18064A, #866EFC)' }}
        >
          <img src={wordDocIcon} alt="Word Doc" className="h-5 w-5" />
          <span>Download DOCX</span>
        </button>

        {/* Preview button */}
        <button
          onClick={handlePreview}
          className="flex items-center gap-2 px-4 py-2 border border-purple-700 rounded-lg text-purple-700 hover:bg-purple-50 w-full md:w-auto justify-center"
        >
          <FaEye />
          <span>Preview</span>
        </button>
      </div>
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-900">{title}</h2>
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
                  } else if (item.type === 'signature') {
                    return (
                      <div key={index} className="my-4">
                        <img 
                          src={item.data} 
                          alt="Signature" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20fill%3D%22%23ddd%22%20width%3D%2232%22%20height%3D%2232%22%2F%3E%3Ctext%20fill%3D%22%23aaa%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%224%22%20dy%3D%225%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ESignature%3C%2Ftext%3E%3C%2Fsvg%3E';
                          }}
                          className="max-h-16 border border-gray-200 p-1 rounded"
                        />
                      </div>
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
                  style={{ background: 'linear-gradient(to right, #18064A, #866EFC)' }}
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

export default PreviewAgreement;
