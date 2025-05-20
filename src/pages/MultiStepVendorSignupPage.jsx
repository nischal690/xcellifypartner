import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx'; // For cleaner conditional classnames
import { toast } from 'react-toastify';

// Your existing imports
import PrimaryLogo from '../assets/logo-primary.png'; // Assuming this might be used in OnBoardingHeader
import stepsData from '../utils/MultiStepVendorSignupFormData'; // Renamed for clarity if it's not just steps
import { tourSteps, fileUploadInfo, fileHintMessage } from '../utils/MultiStepVendorSignupFormData';
import { useStore } from '../stores';
import { useVendorSignupForm } from '../hooks/profile/useVendorSignupForm';

// Child Components (These would need internal styling updates)
import OnBoardingHeader from '../components/onboardingPage/OnBoardingHeader';
import CollapsibleSection from '../components/commonComponents/CollapsibleSection';
import Dropdown from '../components/commonComponents/Dropdown';
import StepVendorProductDetailsPage from './StepVendorProductDetailsPage';
import FileUploadPreviewCard from '../components/commonComponents/profileDetails/FileUploadPreviewCard';
import SupplierDeclarationPreview from '../components/onboardingPage/SupplierDeclarationPreview';
import SupplierComDeclarationPreview from '../components/onboardingPage/SupplierComDeclarationPreview';
import PartnerServiceAgreementPreview from '../components/onboardingPage/PartnerServiceAgreementPreview';
import TextFieldWithVerification from '../components/profile/TextFieldWithVerification';
import OTPVerificationModal from '../components/commonComponents/modals/OTPVerificationModal';
import LoaderMessage from '../components/commonComponents/LoaderMessage';

// Placeholder SVG Icons (Replace with actual SVG components or imports e.g., from heroicons)
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const BackArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);
const NextArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const SubmitCheckIcon = ({ className }) => (
 <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 10.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);
const ClearIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);


const MultiStepVendorSignupPage = () => {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const {
    currentStep, partnerInfo, formData, setFormData, errors,
    countryOptions, stateOptions, cityOptions,
    isRemovingBG, removalMessage, uploadingFields,
    activeSections, completedSections,
    isPANValidated, setIsPANValidated, isGSTValidated, setIsGSTValidated,
    sameAsAbove, setSameAsAbove,
    disableCountrySelction, setDisableCountrySelection, // Note: typo in original, kept for consistency with hook
    isAadhaarVerified, setIsAadhaarVerified,
    showOtpModal, setShowOtpModal, otp, setOtp, otpMessage, setOtpMessage, isVerifying, setIsVerifying,
    handleChange, handleNext, handleBack, handleSubmit, toggleSection, isSectionCompleted,
    clearFormData, handleDisable, handleOptions, handleOtpVerify, isFieldRequired, validateField, handleLogout,
    requestAadhaarOtp,
  } = useVendorSignupForm(stepsData, appStore); // Assuming stepsData is your main configuration for steps

  // Ensure steps is an array for the progress indicator
  const steps = stepsData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800">
      {/*
        TODO: Update OnBoardingHeader internal styling for a modern look.
        Example: className="bg-white shadow-md sticky top-0 z-50"
      */}
      <OnBoardingHeader partnerInfo={partnerInfo} handleLogout={handleLogout} />

      <Joyride
        steps={tourSteps}
        run={false} // Consider managing this with a state like `runTour`
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#7C3AED', // Purple-600
            zIndex: 10000,
          },
          // You can further customize spotLight, beacon, tooltip, etc.
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Message & Enhanced Progress Indicator */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-purple-700 sm:text-5xl mb-4">
            Welcome to Your Onboarding Journey!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete your profile to unlock all features and start connecting with potential customers. Please fill out each section carefully.
          </p>

          {steps.length > 0 && (
            <div className="mt-12 relative max-w-3xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 -translate-y-1/2 rounded-full"></div>
              <div
                className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep) / (steps.length-1)) * 100}%` }} // Adjusted for 0-indexed currentStep
              ></div>
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center group w-1/3 px-2"> {/* Added w-1/3 for equal spacing if 3 steps */}
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 font-semibold',
                        index < currentStep ? 'bg-purple-600 border-purple-600 text-white' :
                        index === currentStep ? 'bg-purple-600 border-purple-700 text-white scale-110 shadow-lg' :
                        'bg-white border-gray-300 text-gray-400 group-hover:border-purple-400'
                      )}
                    >
                      {index < currentStep ? <CheckIcon className="w-6 h-6" /> : <span>{index + 1}</span>}
                    </div>
                    <span className={clsx(
                        'mt-3 text-sm font-medium text-center transition-colors duration-300',
                        index <= currentStep ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200/80"
        >
          {/* Render sections for current step (0 and 1) */}
          {(currentStep === 0 || currentStep === 1) && steps[currentStep]?.sections.map((section, sectionIndex) => (
            /*
              TODO: Update CollapsibleSection component internally:
              - Use a structure like:
                <div className="mb-8 last:mb-0 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <button (Header) className="w-full flex justify-between items-center p-5 text-left focus:outline-none transition-colors duration-200 ${isActive ? 'bg-purple-50' : 'hover:bg-gray-50'}">
                    <div (title + icon)> ... </div>
                    <ChevronDownIcon />
                  </button>
                  {isOpen && <div className="p-6 border-t border-gray-200"> ...content... </div>}
                </div>
              - Pass `isActive` and `isCompleted` to style the header and completion icon.
            */
            <CollapsibleSection
              key={`${currentStep}-${sectionIndex}`} // More specific key
              title={section.heading}
              isOpen={activeSections[`${currentStep}-${sectionIndex}`] || false}
              onToggle={(isOpen) => toggleSection(currentStep, sectionIndex, isOpen)}
              isCompleted={isSectionCompleted(sectionIndex, currentStep)}
              isActive={!isSectionCompleted(sectionIndex, currentStep) && activeSections[`${currentStep}-${sectionIndex}`]}
              index={sectionIndex} // For numbering or styling if needed inside CollapsibleSection
              totalSections={steps[currentStep].sections.length}
              // Add custom classes for card-like appearance if not handled internally by CollapsibleSection
              className="mb-8 last:mb-0 bg-gray-50/50 rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* "Same as above" checkbox styling */}
              {currentStep === 0 && section.heading === 'CEO/Owner details' && (
                <div className="mb-6 flex items-center p-3 bg-indigo-100 rounded-md border border-indigo-200">
                  <input
                    type="checkbox"
                    id="sameAsAbove"
                    checked={sameAsAbove}
                    onChange={(e) => {
                      setSameAsAbove(e.target.checked);
                      // ... (rest of your logic for sameAsAbove)
                        if (e.target.checked) {
                            setFormData((prev) => ({
                            ...prev,
                            owner_name: prev.contact_person_name,
                            owner_email: prev.contact_person_email,
                            owner_country_code: prev.contact_person_country_code,
                            owner_mobile: prev.contact_person_mobile,
                            }));
                        } else {
                            setFormData((prev) => ({
                            ...prev,
                            owner_name: '',
                            owner_email: '',
                            owner_mobile: '',
                            }));
                        }
                    }}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 focus:ring-offset-2"
                  />
                  <label htmlFor="sameAsAbove" className="ml-3 text-sm font-medium text-purple-800">
                    Fill the data as Contact person's details
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Increased gap-x */}
                {section.fields.map((field, fieldIndex) => {
                  if (field.name === 'GST' && formData.hasGSTnumber !== 'Yes') {
                    return null;
                  }

                  const fieldError = errors[field.name];
                  const isRequired = isFieldRequired(field.name);

                  return (
                    <div
                      key={fieldIndex}
                      className={clsx(fieldError ? 'animate-shake' : '', 'space-y-1.5')} // Added space-y for label & input
                    >
                      <label
                        htmlFor={field.name}
                        className={clsx(
                          'block text-sm font-medium',
                          fieldError ? 'text-red-600' : 'text-gray-700'
                        )}
                      >
                        {field.conditionalLabel && field.conditionalLabel[formData.company_type]
                          ? field.conditionalLabel[formData.company_type]
                          : field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {/*
                        TODO: Update TextFieldWithVerification, Dropdown, FileUploadPreviewCard
                        internally for modern styling. Example for input part of TextFieldWithVerification:
                        className={clsx(
                          'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 shadow-sm',
                          // ... (error, success, focus, disabled states) ...
                        )}
                      */}
                      {(field.type === 'text' || field.type === 'url' || field.type === 'email' || field.type === 'mobile') && (
                        <TextFieldWithVerification
                          field={field}
                          formData={formData}
                          errors={errors} // Pass down specific error if needed by component
                          handleChange={handleChange}
                          handleDisable={handleDisable} // Ensure this is used correctly inside
                          isPANValidated={isPANValidated}
                          isGSTValidated={isGSTValidated}
                          isAadhaarVerified={isAadhaarVerified}
                          setShowOtpModal={setShowOtpModal}
                          disableCountrySelction={disableCountrySelction}
                          requestAadhaarOtp={requestAadhaarOtp}
                          // Add custom styling classes if TextFieldWithVerification accepts them
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          rows={4}
                          className={clsx(
                            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2',
                            fieldError
                              ? 'border-red-500 focus:border-red-600 focus:ring-red-600'
                              : 'border-gray-300 hover:border-gray-400 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50'
                          )}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                        />
                      )}

                      {(field.type === 'dropdown' || field.type === 'select') && (
                        <Dropdown
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          options={handleOptions(field.name) || field.options}
                          placeholder={field.placeholder || `Select ${field.label}`}
                          className={clsx( // Assuming Dropdown accepts className for its main wrapper/button
                            'w-full', // Internal styling should handle padding, border, etc.
                            fieldError ? 'dropdown-error-state' : 'dropdown-default-state' // Placeholder for internal state classes
                          )}
                        />
                      )}

                      {field.type === 'file' && (
                        <>
                          <FileUploadPreviewCard
                            id={field.name}
                            name={field.name}
                            onChange={(e) => handleChange(e)}
                            onRemove={() => setFormData((prev) => ({ ...prev, [field.name]: '' }))}
                            value={formData[field.name]}
                            accept={fileUploadInfo[field.name]?.accept || ''}
                            fileType={fileUploadInfo[field.name]?.fileType || ''}
                            isUploading={uploadingFields[field.name] || false}
                            progress={0} // Assuming progress is handled
                            className={clsx(fieldError ? 'border-red-500' : '')} // For overall card border
                            // TODO: FileUploadPreviewCard needs internal styling for a modern dropzone/preview.
                          />
                          {field.documentPreview && (
                            <div className="mt-2">
                              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                                <div className="flex items-start">
                                  <InfoIcon className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-purple-700 font-semibold mb-1">
                                      Download & preview the Partner Service Agreement
                                    </p>
                                    <PartnerServiceAgreementPreview formData={formData} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {fieldError && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center">
                           {/* Optional: <ErrorIcon className="w-4 h-4 mr-1" /> */}
                          {fieldError}
                        </p>
                      )}

                      {field.type === 'file' && fileHintMessage && (
                        <p className="text-xs text-gray-500 mt-1 italic">{fileHintMessage}</p>
                      )}



                      {(field.name === 'supplier_declaration' || field.name === 'supplier_declaration_com') && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                          <div className="flex items-start">
                            <InfoIcon className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              {field.name === 'supplier_declaration' && (
                                <>
                                  <p className="text-purple-700 font-semibold mb-1">
                                    Download & upload the supplier declaration form.
                                  </p>
                                  <p className="text-gray-600 text-xs mb-2">
                                    Accepted: PDFs, Docx, PNG, JPG, JPEG (Max: 2MB)
                                  </p>
                                  {/* TODO: Update SupplierDeclarationPreview for consistent styling */}
                                  <SupplierDeclarationPreview formData={formData} />
                                </>
                              )}
                              {field.name === 'supplier_declaration_com' && (
                                 <>
                                  <p className="text-purple-700 font-semibold mb-1">
                                    Download & upload the commercial declaration form.
                                  </p>
                                   {/* TODO: Update SupplierComDeclarationPreview for consistent styling */}
                                  <SupplierComDeclarationPreview formData={formData} />
                                 </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {field.name === 'signature' && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Accepted file formats images: .jpg, .jpeg, .png
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          ))}

          {/* Product Details Step */}
          {currentStep === 2 && (
            /* TODO: Update StepVendorProductDetailsPage for consistent styling */
            <StepVendorProductDetailsPage />
          )}


          {/* Navigation Buttons */}
          {currentStep < steps.length && ( // Show buttons also on the last data entry step if it's not step 2
            <div className={clsx(
                "flex items-center mt-10 pt-6 border-t border-gray-200",
                currentStep > 0 ? "justify-between" : "justify-end" // Adjust based on Back button presence
            )}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-6 py-2.5 border-2 rounded-lg text-purple-600 border-purple-400 hover:bg-purple-50 hover:border-purple-500 active:bg-purple-100 transition-all duration-200 font-medium text-base shadow-sm"
                >
                  <BackArrowIcon className="h-5 w-5 mr-2" />
                  Back
                </button>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={clearFormData}
                  className="flex items-center px-6 py-2.5 border-2 rounded-lg text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 active:bg-red-100 transition-all duration-200 font-medium text-base shadow-sm"
                >
                  <ClearIcon className="h-5 w-5 mr-2" />
                  Clear
                </button>

                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg active:shadow-inner font-semibold text-base"
                  >
                    Next
                    <NextArrowIcon className="h-5 w-5 ml-2" />
                  </button>
                )}
                {currentStep === steps.length - 1 && (
                  <button
                    type="submit"
                    className="flex items-center justify-center px-8 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg active:shadow-inner font-semibold text-base"
                  >
                    Submit
                    <SubmitCheckIcon className="h-5 w-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Loading Overlay & Modals */}
      {/* TODO: Update LoaderMessage and OTPVerificationModal for consistent styling */}
      {isRemovingBG && <LoaderMessage message={removalMessage || 'Processing...'} />}
      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false); setOtp(''); setOtpMessage('');
        }}
        otp={otp}
        setOtp={setOtp}
        onVerifyOtp={handleOtpVerify}
        message={otpMessage}
        isVerifying={isVerifying}
      />
    </div>
  );
};

export default MultiStepVendorSignupPage;