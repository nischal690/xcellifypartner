import React, { useEffect, useState } from 'react';

import Joyride from 'react-joyride';

import PrimaryLogo from '../assets/logo-primary.png';
import { useNavigate } from 'react-router-dom';
import steps from '../utils/MultiStepVendorSignupFormData'; // Updated data
import { tourSteps } from '../utils/MultiStepVendorSignupFormData';
import {
  fileUploadInfo,
  fileHintMessage,
} from '../utils/MultiStepVendorSignupFormData';
import { useStore } from '../stores';

import Dropdown from '../components/commonComponents/Dropdown';
import StepVendorProductDetailsPage from './StepVendorProductDetailsPage';
import FileUploadPreviewCard from '../components/commonComponents/profileDetails/FileUploadPreviewCard';
import CollapsibleSection from '../components/commonComponents/CollapsibleSection';

import { toast } from 'react-toastify';
import OnBoardingHeader from '../components/onboardingPage/OnBoardingHeader';
import SupplierDeclarationCard from '../components/onboardingPage/SupplierDeclarationCard';
import LoaderMessage from '../components/commonComponents/LoaderMessage';

import SupplierDeclarationPreview from '../components/onboardingPage/SupplierDeclarationPreview';
import { vendorBaiscInfoValidation } from '../utils/HelperFunction';
import SupplierComDeclarationPreview from '../components/onboardingPage/SupplierComDeclarationPreview';
import { useVendorSignupForm } from '../hooks/profile/useVendorSignupForm';
import OTPVerificationModal from '../components/commonComponents/modals/OTPVerificationModal';
import TextFieldWithVerification from '../components/profile/TextFieldWithVerification';

const MultiStepVendorSignupPage = () => {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const {
    currentStep,
    partnerInfo,
    formData,
    setFormData,
    errors,
    countryOptions,
    stateOptions,
    cityOptions,
    isRemovingBG,
    removalMessage,
    uploadingFields,
    activeSections,
    completedSections,
    isPANValidated,
    setIsPANValidated,
    isGSTValidated,
    setIsGSTValidated,
    sameAsAbove,
    setSameAsAbove,
    disableCountrySelction,
    setDisableCountrySelection,
    isAadhaarVerified,
    setIsAadhaarVerified,
    showOtpModal,
    setShowOtpModal,
    otp,
    setOtp,
    otpMessage,
    setOtpMessage,
    isVerifying,
    setIsVerifying,

    handleChange,
    handleNext,
    handleBack,
    handleSubmit,
    toggleSection,
    isSectionCompleted,
    handleDisable,
    handleOptions,
    handleOtpVerify,
    isFieldRequired,
    validateField,
    handleLogout,
  } = useVendorSignupForm(steps, appStore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <OnBoardingHeader partnerInfo={partnerInfo} handleLogout={handleLogout} />

      {/* Tour Guide */}
      <Joyride
        steps={tourSteps}
        run={false}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#7C3AED',
            zIndex: 10000,
          },
        }}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Message & Progress Indicator */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-3">
            Welcome to Your Onboarding Journey
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your profile to unlock all features and start connecting
            with potential customers.
          </p>

          {/* Progress Steps */}
          <div className="mt-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      index < currentStep
                        ? 'bg-purple-600 text-white'
                        : index === currentStep
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      index <= currentStep ? 'text-purple-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl p-6 sm:p-8 transition-all duration-500 border border-purple-100"
        >
          {currentStep === 0 && (
            <>
              {steps[currentStep].sections.map((section, sectionIndex) => (
                <CollapsibleSection
                  key={sectionIndex}
                  title={section.heading}
                  isOpen={
                    activeSections[`${currentStep}-${sectionIndex}`] || false
                  }
                  onToggle={(isOpen) =>
                    toggleSection(currentStep, sectionIndex, isOpen)
                  }
                  isCompleted={isSectionCompleted(sectionIndex, currentStep)}
                  isActive={
                    !isSectionCompleted(sectionIndex, currentStep) &&
                    activeSections[`${currentStep}-${sectionIndex}`]
                  }
                  index={sectionIndex}
                  totalSections={steps[currentStep].sections.length}
                >
                  {currentStep === 0 &&
                    section.heading === 'CEO/Owner details' && (
                      <div className="mb-6 flex items-center">
                        <input
                          type="checkbox"
                          id="sameAsAbove"
                          checked={sameAsAbove}
                          onChange={(e) => {
                            setSameAsAbove(e.target.checked);
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                owner_name: prev.contact_person_name,
                                owner_email: prev.contact_person_email,
                                owner_country_code:
                                  prev.contact_person_country_code,
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
                          className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor="sameAsAbove"
                          className="ml-2 text-purple-700 font-medium"
                        >
                          Fill the data as Contact person's details
                        </label>
                      </div>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {section.fields.map((field, fieldIndex) => {
                      // Skip rendering the GST field if hasGSTnumber is not 'Yes'
                      if (
                        field.name === 'GST' &&
                        formData.hasGSTnumber !== 'Yes'
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={fieldIndex}
                          className={`${
                            errors[field.name] ? 'animate-shake' : ''
                          }`}
                        >
                          <label
                            htmlFor={field.name}
                            className={`block text-sm font-medium ${
                              errors[field.name]
                                ? 'text-red-700'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            {field.conditionalLabel &&
                            field.conditionalLabel[formData.company_type]
                              ? field.conditionalLabel[formData.company_type]
                              : field.label}
                            {isFieldRequired(field.name) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {(field.type === 'text' ||
                            field.type === 'url' ||
                            field.type === 'email' ||
                            field.type === 'mobile') && (
                            <TextFieldWithVerification
                              field={field}
                              formData={formData}
                              errors={errors}
                              handleChange={handleChange}
                              handleDisable={handleDisable}
                              isPANValidated={isPANValidated}
                              isGSTValidated={isGSTValidated}
                              isAadhaarVerified={isAadhaarVerified}
                              setShowOtpModal={setShowOtpModal}
                              disableCountrySelction={disableCountrySelction}
                            />
                          )}

                          {field.type === 'textarea' && (
                            <textarea
                              id={field.name}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              rows={4}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors[field.name]
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                              placeholder={
                                field.placeholder || `Enter ${field.label}`
                              }
                            />
                          )}

                          {(field.type === 'dropdown' ||
                            field.type === 'select') && (
                            <Dropdown
                              id={field.name}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              options={
                                handleOptions(field.name) || field.options
                              }
                              placeholder={
                                field.placeholder || `Select ${field.label}`
                              }
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors[field.name]
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                          )}

                          {field.type === 'file' && (
                            <FileUploadPreviewCard
                              id={field.name}
                              name={field.name}
                              onChange={(e) => handleChange(e)}
                              onRemove={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [field.name]: '',
                                }));
                              }}
                              value={formData[field.name]}
                              accept={fileUploadInfo[field.name]?.accept || ''}
                              fileType={
                                fileUploadInfo[field.name]?.fileType || ''
                              }
                              isUploading={uploadingFields[field.name] || false}
                              progress={0}
                              className={`${
                                errors[field.name] ? 'border-red-500' : ''
                              }`}
                            />
                          )}

                          {errors[field.name] && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors[field.name]}
                            </p>
                          )}

                          {field.type === 'file' && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              {fileHintMessage}
                            </p>
                          )}

                          {field.name === 'supplier_declaration' && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <p className="text-sm text-gray-700 mb-3">
                                Accepted: Only PDFs, Docx, PNG, JPG, JPEG (Max:
                                2MB)
                              </p>
                              <p className="text-sm text-purple-700 font-medium mb-3">
                                Download & upload the declaration form docx file
                              </p>
                              <SupplierDeclarationPreview formData={formData} />
                            </div>
                          )}
                          {field.name === 'signature' && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              Accepted file formats images: .jpg, .jpeg, .png
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleSection>
              ))}
            </>
          )}
          {currentStep === 1 && (
            <>
              {steps[currentStep].sections.map((section, sectionIndex) => (
                <CollapsibleSection
                  key={sectionIndex}
                  title={section.heading}
                  isOpen={
                    activeSections[`${currentStep}-${sectionIndex}`] || false
                  }
                  onToggle={(isOpen) =>
                    toggleSection(currentStep, sectionIndex, isOpen)
                  }
                  isCompleted={isSectionCompleted(sectionIndex, currentStep)}
                  isActive={
                    !isSectionCompleted(sectionIndex, currentStep) &&
                    activeSections[`${currentStep}-${sectionIndex}`]
                  }
                  index={sectionIndex}
                  totalSections={steps[currentStep].sections.length}
                >
                  {section.heading === 'CEO/Owner details' && (
                    <div className="mb-6 flex items-center">
                      <input
                        type="checkbox"
                        id="sameAsAbove"
                        checked={sameAsAbove}
                        onChange={(e) => {
                          setSameAsAbove(e.target.checked);
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              owner_name: prev.contact_person_name,
                              owner_email: prev.contact_person_email,
                              owner_country_code:
                                prev.contact_person_country_code,
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
                        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="sameAsAbove"
                        className="ml-2 text-purple-700 font-medium"
                      >
                        Fill the data as Contact person's details
                      </label>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {section.fields.map((field, fieldIndex) => {
                      // Skip rendering the GST field if hasGSTnumber is not 'Yes'
                      if (
                        field.name === 'GST' &&
                        formData.hasGSTnumber !== 'Yes'
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={fieldIndex}
                          className={`${
                            errors[field.name] ? 'animate-shake' : ''
                          }`}
                        >
                          <label
                            htmlFor={field.name}
                            className={`block text-sm font-medium ${
                              errors[field.name]
                                ? 'text-red-700'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            {field.conditionalLabel &&
                            field.conditionalLabel[formData.company_type]
                              ? field.conditionalLabel[formData.company_type]
                              : field.label}
                            {isFieldRequired(field.name) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {(field.type === 'text' ||
                            field.type === 'url' ||
                            field.type === 'email' ||
                            field.type === 'mobile') && (
                            <div className="relative">
                              <input
                                type={
                                  field.type === 'url'
                                    ? 'url'
                                    : field.type === 'email'
                                    ? 'email'
                                    : field.type === 'mobile'
                                    ? 'tel'
                                    : 'text'
                                }
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={
                                  handleDisable(field.name) ||
                                  (field.name === 'PAN' && isPANValidated)
                                }
                                className={`w-full px-4 py-3 rounded-lg border ${
                                  errors[field.name]
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : field.name === 'PAN' && isPANValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'GST' && isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'company_name' &&
                                      isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : isGSTValidated &&
                                      (field.name === 'address_line_1' ||
                                        field.name === 'address_line_2' ||
                                        field.name === 'city' ||
                                        field.name === 'state' ||
                                        field.name === 'pincode' ||
                                        field.name === 'country')
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : formData.pincode &&
                                      formData.pincode.length === 6 &&
                                      disableCountrySelction &&
                                      (field.name === 'country' ||
                                        field.name === 'state' ||
                                        field.name === 'city')
                                    ? 'border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                                } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  (field.name === 'PAN' && isPANValidated) ||
                                  (field.name === 'GST' && isGSTValidated) ||
                                  (field.name === 'company_name' &&
                                    isGSTValidated) ||
                                  (isGSTValidated &&
                                    (field.name === 'address_line_1' ||
                                      field.name === 'address_line_2' ||
                                      field.name === 'city' ||
                                      field.name === 'state' ||
                                      field.name === 'pincode' ||
                                      field.name === 'country')) ||
                                  (formData.pincode &&
                                    formData.pincode.length === 6 &&
                                    disableCountrySelction &&
                                    (field.name === 'country' ||
                                      field.name === 'state' ||
                                      field.name === 'city'))
                                    ? 'pr-10'
                                    : ''
                                }`}
                                placeholder={
                                  field.name === 'CIN' &&
                                  [
                                    'Individual',
                                    'sole_proprietership',
                                    'partnership',
                                  ].includes(formData.company_type)
                                    ? 'Enter 12-digit Aadhaar number'
                                    : field.name === 'CIN'
                                    ? 'Enter 21-character CIN'
                                    : field.name === 'PAN'
                                    ? 'Format: ABCDE1234F'
                                    : `Enter ${field.label.toLowerCase()}`
                                }
                              />
                              {field.name === 'PAN' && isPANValidated && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mb-5">
                                  <svg
                                    className="h-5 w-5 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                              {field.name === 'GST' && isGSTValidated && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mb-5">
                                  <svg
                                    className="h-5 w-5 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                              {field.name === 'company_name' &&
                                isGSTValidated && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mb-5">
                                    <svg
                                      className="h-5 w-5 text-green-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              {field.name === 'PAN' && isPANValidated && (
                                <p className="mt-1 text-sm text-green-600">
                                  PAN verified successfully
                                </p>
                              )}
                              {field.name === 'GST' && isGSTValidated && (
                                <p className="mt-1 text-sm text-green-600">
                                  GST verified successfully
                                </p>
                              )}
                              {field.name === 'company_name' &&
                                isGSTValidated && (
                                  <p className="mt-1 text-sm text-green-600">
                                    Auto-filled from GST data
                                  </p>
                                )}
                              {isGSTValidated &&
                                (field.name === 'address_line_1' ||
                                  field.name === 'address_line_2' ||
                                  field.name === 'city' ||
                                  field.name === 'state' ||
                                  field.name === 'pincode' ||
                                  field.name === 'country') && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                      className="h-5 w-5 text-green-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              {isGSTValidated &&
                                (field.name === 'address_line_1' ||
                                  field.name === 'address_line_2' ||
                                  field.name === 'city' ||
                                  field.name === 'state' ||
                                  field.name === 'pincode' ||
                                  field.name === 'country') && (
                                  <p className="mt-1 text-sm text-green-600">
                                    Auto-filled from GST data
                                  </p>
                                )}
                              {formData.pincode &&
                                formData.pincode.length === 6 &&
                                disableCountrySelction &&
                                (field.name === 'country' ||
                                  field.name === 'state' ||
                                  field.name === 'city') && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                      className="h-5 w-5 text-blue-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              {formData.pincode &&
                                formData.pincode.length === 6 &&
                                disableCountrySelction &&
                                (field.name === 'country' ||
                                  field.name === 'state' ||
                                  field.name === 'city') && (
                                  <p className="mt-1 text-sm text-blue-600">
                                    Auto-filled from Pincode
                                  </p>
                                )}
                            </div>
                          )}

                          {field.type === 'textarea' && (
                            <textarea
                              id={field.name}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              rows={4}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors[field.name]
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                              placeholder={
                                field.placeholder || `Enter ${field.label}`
                              }
                            />
                          )}

                          {(field.type === 'dropdown' ||
                            field.type === 'select') && (
                            <Dropdown
                              id={field.name}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              options={
                                handleOptions(field.name) || field.options
                              }
                              placeholder={
                                field.placeholder || `Select ${field.label}`
                              }
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors[field.name]
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                              } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                          )}

                          {field.type === 'file' && (
                            <FileUploadPreviewCard
                              id={field.name}
                              name={field.name}
                              onChange={(e) => handleChange(e)}
                              onRemove={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [field.name]: '',
                                }));
                              }}
                              value={formData[field.name]}
                              accept={fileUploadInfo[field.name]?.accept || ''}
                              fileType={
                                fileUploadInfo[field.name]?.fileType || ''
                              }
                              isUploading={uploadingFields[field.name] || false}
                              progress={0}
                              className={`${
                                errors[field.name] ? 'border-red-500' : ''
                              }`}
                            />
                          )}

                          {errors[field.name] && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors[field.name]}
                            </p>
                          )}

                          {field.type === 'file' && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              {fileHintMessage}
                            </p>
                          )}

                          {field.name === 'supplier_declaration' && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <p className="text-sm text-gray-700 mb-3">
                                Accepted: Only PDFs, Docx, PNG, JPG, JPEG (Max:
                                2MB)
                              </p>
                              <p className="text-sm text-purple-700 font-medium mb-3">
                                Download & upload the declaration form docx file
                              </p>
                              <SupplierDeclarationPreview formData={formData} />
                            </div>
                          )}
                          {field.name === 'signature' && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              Accepted file formats images: .jpg, .jpeg, .png
                            </p>
                          )}

                          {field.name === 'supplier_declaration_com' && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                              <SupplierComDeclarationPreview
                                formData={formData}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleSection>
              ))}
            </>
          )}
          {currentStep === 2 && <StepVendorProductDetailsPage />}

          {/* Navigation Buttons */}
          {currentStep < 2 && (
            <div className="flex justify-between items-center mt-10">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 border-2 rounded-lg text-purple-600 border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
              )}
              {currentStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium ml-auto"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  type="submit"
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Submit
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 10.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Loading Overlay */}
      {isRemovingBG && (
        <LoaderMessage message={removalMessage || 'Processing...'} />
      )}

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setOtp('');
          setOtpMessage('');
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
