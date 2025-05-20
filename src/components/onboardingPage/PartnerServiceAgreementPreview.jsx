import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import wordDocIcon from '../../assets/onboardingAssests/icons/word-doc-icon.png';
import mammoth from 'mammoth';

/**
 * PartnerServiceAgreementPreview Component
 * 
 * A component for downloading and previewing the Partner Service Agreement document.
 * Also allows auto-attaching the document to the upload field.
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data used to generate the document
 */
const PartnerServiceAgreementPreview = ({ formData }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState([]);
  const [documentTemplate, setDocumentTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  
  // Load the document template on component mount
  useEffect(() => {
    loadDocumentTemplate();
  }, []);
  
  // Function to load the document template
  const loadDocumentTemplate = async () => {
    try {
      const response = await fetch('/docs/PartnerServiceAgreementInd.docx');
      if (!response.ok) {
        throw new Error('Failed to load document template');
      }
      const blob = await response.blob();
      setDocumentTemplate(blob);
    } catch (error) {
      console.error('Error loading document template:', error);
      toast.error('Failed to load document template');
    }
  };
  
  // Function to create a personalized document based on form data
  const createPersonalizedDocument = async () => {
    if (!documentTemplate) {
      toast.error('Document template not loaded');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Determine language style based on company type
      const isIndividualType = ['Individual', 'sole_proprietership', 'partnership'].includes(formData.company_type);
      const pronoun = isIndividualType ? 'I' : 'We';
      const possessive = isIndividualType ? 'my' : 'our';
      const reflexive = isIndividualType ? 'myself' : 'ourselves';
      
      // Create a copy of the template
      const templateCopy = documentTemplate.slice(0);
      
      // Generate preview content with personalized data
      const replacements = {
        companyName: formData.company_name || '[Company Name]',
        companyType: formData.company_type || '[Company Type]',
        address: formData.address_line_1 || '[Address]',
        contactPerson: formData.contact_person_name || '[Contact Person]',
        date: new Date().toLocaleDateString(),
        pronoun: pronoun,
        possessive: possessive,
        reflexive: reflexive
      };
      
      // Generate preview content
      const previewContent = [
        { type: 'heading', text: 'PARTNER SERVICE AGREEMENT' },
        { type: 'text', text: `THIS AGREEMENT is made on this day ${replacements.date}, by and between:` },
        { type: 'text', text: "Xcellify Education Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at [Company Address] (hereinafter referred to as \"Xcellify\", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include its successors and permitted assigns) of the FIRST PART;" },
        { type: 'text', text: "AND", style: 'bold' },
        { type: 'text', text: `${replacements.companyName}, a ${replacements.companyType} having its principal place of business at ${replacements.address} (hereinafter referred to as the "Partner", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include its successors and permitted assigns) of the SECOND PART.` },
        { type: 'text', text: "WHEREAS:", style: 'bold' },
        { type: 'text', text: "1. Xcellify is engaged in the business of providing educational services and products." },
        { type: 'text', text: `2. The Partner is engaged in the business of providing services and has expressed interest in partnering with Xcellify.` },
        { type: 'text', text: `3. ${replacements.pronoun}, ${replacements.contactPerson}, representing ${replacements.companyName}, hereby declare that ${replacements.possessive} organization wishes to enter into a service agreement with Xcellify Education Private Limited.` },
        { type: 'text', text: "NOW THEREFORE, in consideration of the mutual covenants contained herein, the Parties hereby agree as follows:", style: 'bold' },
        { type: 'text', text: "[Agreement terms would be displayed here in the full document]" },
        { type: 'text', text: "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written." },
        { type: 'text', text: "For Xcellify Education Private Limited:", style: 'bold' },
        { type: 'text', text: "____________________________" },
        { type: 'text', text: "Authorized Signatory" },
        { type: 'text', text: `For ${replacements.companyName}:`, style: 'bold' },
        { type: 'text', text: "____________________________" },
        { type: 'text', text: replacements.contactPerson }
      ];
      
      setPreviewContent(previewContent);
      
      // In a real implementation, we would modify the DOCX file to replace placeholders
      // For now, we'll just return the template as is
      setIsLoading(false);
      return templateCopy;
    } catch (error) {
      console.error('Error creating personalized document:', error);
      toast.error('Failed to create personalized document');
      setIsLoading(false);
      return null;
    }
  };
  
  // Function to get preview content
  const getPreviewContent = async () => {
    await createPersonalizedDocument();
    return previewContent;
  };
  
  // Function to download the document
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const personalizedDoc = await createPersonalizedDocument();
      if (personalizedDoc) {
        saveAs(personalizedDoc, `PartnerServiceAgreement_${formData.company_name || 'Partner'}.docx`);
        toast.success('Document downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to auto-attach the document to the upload field
  const handleAutoAttach = async () => {
    setIsLoading(true);
    try {
      const personalizedDoc = await createPersonalizedDocument();
      if (personalizedDoc) {
        // Create a File object from the blob
        const file = new File(
          [personalizedDoc], 
          `PartnerServiceAgreement_${formData.company_name || 'Partner'}.docx`, 
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        
        // Find the input field for partner_service_agreement
        const fileInput = document.querySelector('input[name="partner_service_agreement"]');
        
        if (fileInput) {
          // Create a DataTransfer to set the files property
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          
          // Set the files property
          fileInput.files = dataTransfer.files;
          
          // Dispatch a change event to trigger any listeners
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          toast.success('Document attached successfully');
        } else {
          toast.error('Could not find the upload field');
        }
      }
    } catch (error) {
      console.error('Error attaching document:', error);
      toast.error('Failed to attach document');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert DOCX to HTML and show in modal
  const handlePreview = async () => {
    setIsLoading(true);
    try {
      // Get the document from the public folder
      const response = await fetch('/docs/PartnerServiceAgreementInd.docx');
      if (!response.ok) {
        throw new Error('Failed to load document');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Use mammoth to convert DOCX to HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing document:', error);
      toast.error('Failed to preview document');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to close the preview modal
  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
        {/* Download DOCX button */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 w-full md:w-auto justify-center"
          style={{ background: 'linear-gradient(to right, #18064A, #866EFC)', opacity: isLoading ? 0.7 : 1 }}
        >
          <img src={wordDocIcon} alt="Word Doc" className="h-5 w-5" />
          <span>{isLoading ? 'Processing...' : 'Download DOCX'}</span>
        </button>

        {/* Preview button */}
        <button
          onClick={handlePreview}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-purple-400 text-purple-700 hover:bg-purple-50 w-full md:w-auto justify-center"
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <FaEye className="h-4 w-4" />
          <span>{isLoading ? 'Processing...' : 'Preview'}</span>
        </button>
      </div>
      
      {/* Document Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-purple-900">Partner Service Agreement</h2>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div 
                  className="document-preview" 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerServiceAgreementPreview;
