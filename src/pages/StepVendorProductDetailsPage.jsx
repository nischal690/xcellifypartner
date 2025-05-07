import React, { useState, useEffect, useRef } from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

import { ProductDetailsData } from '../utils/StepVendorProductDetails';
import RichTextEditor from '../components/commonComponents/RichTextEditor';
import PrimaryLogo from '../assets/logo-primary.png';

import {
  loadServiceDelivary,
  loadStudyLevel,
  loadTutorStudyLevel,
  loadModeOfTeaching,
  loadSubjects,
  loadCounsellingLevel,
  loadLoanStudyLevel,
  loadScholarShipCategories,
  loadScholarShipTypes,
  loadScholarShipCourses,
} from '../utils/productsCodes';

import ImageCropper from '../components/commonComponents/ImageCropper';
import { ErrorBoundary } from '../components/ErrorBoundry';

import { useStore } from '../stores';
import { toJS } from 'mobx';
import PackageDetailsSection from '../components/productDetails/PackageDetailsSection';
import { useVendorProductDetails } from '../hooks/products/useVendorProductDetails';
import LoadingSpinner from '../components/productDetails/LoadingSpinner';

const StepVendorProductDetailsPage = () => {
  const { appStore } = useStore();

  const {
    categories,
    setCategories,
    currentForm,
    setCurrentForm,
    setCropperImage,
    setCurrentFileInfo,
    loading,
    showMenu,
    previewMedia,
    setPreviewMedia,
    filePreviewMap,
    uploadingFiles,
    cropperImage,
    currentFileInfo,
    countries,
    states,
    cities,
    fileInputRef,
    handleProductCategoryChange,
    handleProductChange,
    handleMultiSelectChange,
    handleFileChange,
    handleFileUpload,
    handlePreview,
    handleSaveNestedProduct,
    handleAddProductForm,
    handleSubmit,
    handleSkipNow,
    handleFileRemove,
    handleCropComplete,
    handleCroppedImage,
    toggleMenu,
    toggleAccordion,
    generateYearOptions,
  } = useVendorProductDetails(appStore);

  const renderErrorMessage = (errors, fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  const FilePreviewCard = ({
    file,
    fieldName,
    onPreview,
    onDelete,
    showMenu,
    toggleMenu,
    isUploading,
  }) => {
    return (
      <div className="relative border border-gray-300 rounded-md p-2 shadow-sm w-60">
        <div className="flex items-center gap-2">
          {fieldName === 'product_images' ? (
            <img
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : file.preview || filePreviewMap.images[file.id]
              }
              alt="Preview"
              className="h-12 w-12 object-cover rounded-md"
            />
          ) : (
            <video
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : file.preview || filePreviewMap.videos[file.id]
              }
              className="h-12 w-12 object-cover rounded-md"
            />
          )}

          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              {file.name || `File ${Date.now()}`}
            </p>
            {isUploading ? (
              <LoadingSpinner />
            ) : (
              <p className="text-xs text-green-500 mt-1">Uploaded</p>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900"
              onClick={() =>
                toggleMenu(`${fieldName}-${file.id || Date.now()}`)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 font-bold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>

            {showMenu === `${fieldName}-${file.id || Date.now()}` && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={onPreview}
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProductForms = (category, categoryIndex) => {
    return category.products.map((product, productIndex) => (
      <div key={productIndex} className="mb-4 border rounded-md p-3">
        <div
          className="cursor-pointer bg-purple-100 p-2 flex justify-between items-center"
          onClick={() => {
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].products[productIndex].isOpen =
              !updatedCategories[categoryIndex].products[productIndex].isOpen;
            setCategories(updatedCategories);
          }}
        >
          <h4 className="text-md font-medium">
            {product.formData.product_title || `Product ${productIndex + 1}`}
          </h4>
          <span>{product.isOpen ? '-' : '+'}</span>
        </div>
        {product.isOpen && (
          <div className="p-4">
            {ProductDetailsData[0].categoryFields[category.name]?.map(
              (section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <h5 className="text-sm font-semibold mb-2">
                    {section.heading}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex}>
                        <label className="block text-gray-700 mb-2">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {field.type === 'textarea' ? (
                          <>
                            <textarea
                              name={field.name}
                              placeholder={`Enter ${field.label}`}
                              value={product.formData[field.name] || ''}
                              onChange={(e) =>
                                handleProductChange(
                                  e,
                                  categoryIndex,
                                  productIndex
                                )
                              }
                              className={`w-full p-2 border rounded-md ${
                                product.errors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">
                              50 to 1000 characters
                            </p>
                            {renderErrorMessage(product.errors, field.name)}
                          </>
                        ) : field.type === 'select' ? (
                          <>
                            <select
                              name={field.name}
                              value={product.formData[field.name] || ''}
                              onChange={(e) =>
                                handleProductChange(
                                  e,
                                  categoryIndex,
                                  productIndex
                                )
                              }
                              className={`w-full p-2 border rounded-md ${
                                product.errors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {renderErrorMessage(product.errors, field.name)}
                          </>
                        ) : field.type === 'file' ? (
                          <>
                            <div className="flex flex-col gap-2">
                              <div
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md ${
                                  product.errors[field.name]
                                    ? 'border-red-500'
                                    : 'border-purple-primary'
                                }`}
                              >
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  name={field.name}
                                  id={`${field.name}-upload-${categoryIndex}-${productIndex}`} // Unique ID
                                  onChange={(e) =>
                                    handleFileChange(
                                      e,
                                      field.name,
                                      categoryIndex,
                                      productIndex
                                    )
                                  }
                                  accept={
                                    field.name === 'product_images'
                                      ? 'image/*'
                                      : 'video/*'
                                  }
                                  multiple={field.name === 'product_images'}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`${field.name}-upload-${categoryIndex}-${productIndex}`} // Match the ID
                                  className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-purple-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-4l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                  <p className="text-purple-primary mt-2 text-sm">
                                    Click to upload
                                  </p>
                                  <p className="text-purple-primary text-xs">
                                    (Max{' '}
                                    {field.name === 'product_images'
                                      ? '5MB'
                                      : '20MB'}
                                    )
                                  </p>
                                  {/* Upload limit text */}
                                  {field.name === 'product_images' && (
                                    <p className="text-gray-500 text-xs mt-1">
                                      Up to 5 images are accepted.
                                    </p>
                                  )}
                                  {field.name === 'product_videos' && (
                                    <p className="text-gray-500 text-xs mt-1">
                                      Only 1 video is accepted.
                                    </p>
                                  )}
                                </label>
                              </div>
                              {/* Preview section */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.name === 'product_images' &&
                                  (product.formData[field.name] || []).map(
                                    (file, idx) => (
                                      <FilePreviewCard
                                        key={idx}
                                        file={file}
                                        fieldName={field.name}
                                        onPreview={() =>
                                          handlePreview(file, field.name)
                                        }
                                        onDelete={() =>
                                          handleFileRemove(
                                            field.name,
                                            idx,
                                            categoryIndex,
                                            productIndex
                                          )
                                        }
                                        showMenu={showMenu}
                                        toggleMenu={toggleMenu}
                                        isUploading={
                                          uploadingFiles[
                                            `${field.name}-${categoryIndex}-${productIndex}`
                                          ]
                                        }
                                      />
                                    )
                                  )}

                                {field.name === 'product_videos' &&
                                  product.formData[field.name] && (
                                    <FilePreviewCard
                                      file={product.formData[field.name]}
                                      fieldName={field.name}
                                      onPreview={() =>
                                        handlePreview(
                                          product.formData[field.name],
                                          field.name
                                        )
                                      }
                                      onDelete={() =>
                                        handleFileRemove(
                                          field.name,
                                          0,
                                          categoryIndex,
                                          productIndex
                                        )
                                      }
                                      showMenu={showMenu}
                                      toggleMenu={toggleMenu}
                                      isUploading={
                                        uploadingFiles[
                                          `${field.name}-${categoryIndex}-${productIndex}`
                                        ]
                                      }
                                    />
                                  )}
                              </div>

                              {renderErrorMessage(product.errors, field.name)}
                            </div>
                          </>
                        ) : field.name === 'hsn_code' ||
                          field.name === 'gst_rate' ? (
                          <>
                            <input
                              type="text"
                              name={field.name}
                              value={product.formData[field.name] || ''}
                              className="w-full p-2 border rounded-md bg-gray-100"
                            />
                            {renderErrorMessage(product.errors, field.name)}
                          </>
                        ) : field.name === 'service_provided_since' ? (
                          <>
                            <select
                              name={field.name}
                              value={
                                product
                                  ? product.formData[field.name] || ''
                                  : currentForm.formData[field.name] || ''
                              }
                              onChange={(e) =>
                                product
                                  ? handleProductChange(
                                      e,
                                      categoryIndex,
                                      productIndex
                                    )
                                  : handleProductChange(e)
                              }
                              className={`w-full p-2 border rounded-md ${
                                (
                                  product
                                    ? product.errors[field.name]
                                    : currentForm.errors[field.name]
                                )
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            >
                              <option value="">Select Year</option>
                              {generateYearOptions().map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {renderErrorMessage(
                              product ? product.errors : currentForm.errors,
                              field.name
                            )}
                          </>
                        ) : field.name === 'member_since' ? (
                          <>
                            <select
                              name={field.name}
                              value={
                                product
                                  ? product.formData[field.name] || ''
                                  : currentForm.formData[field.name] || ''
                              }
                              onChange={(e) =>
                                product
                                  ? handleProductChange(
                                      e,
                                      categoryIndex,
                                      productIndex
                                    )
                                  : handleProductChange(e)
                              }
                              className={`w-full p-2 border rounded-md ${
                                (
                                  product
                                    ? product.errors[field.name]
                                    : currentForm.errors[field.name]
                                )
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            >
                              <option value="">Select Year</option>
                              {Array.from(
                                { length: new Date().getFullYear() - 1700 + 1 },
                                (_, i) =>
                                  (new Date().getFullYear() - i).toString()
                              ).map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {renderErrorMessage(
                              product ? product.errors : currentForm.errors,
                              field.name
                            )}
                          </>
                        ) : field.type === 'multiselect' ? (
                          <div>
                            <Select
                              isMulti
                              name={field.name}
                              options={
                                field.name === 'study_level' &&
                                category.name === 'Tutoring'
                                  ? loadTutorStudyLevel
                                  : field.name === 'study_level' &&
                                    category.name === 'Career counselling'
                                  ? loadCounsellingLevel
                                  : field.name === 'event_delivery'
                                  ? loadServiceDelivary
                                  : field.name === 'loan_for_study_level'
                                  ? loadLoanStudyLevel
                                  : field.name === 'scholarship_study_level'
                                  ? loadLoanStudyLevel
                                  : field.name === 'scholarship_states'
                                  ? states
                                  : field.name === 'scholarship_category'
                                  ? loadScholarShipCategories
                                  : field.name === 'scholarship_type'
                                  ? loadScholarShipTypes
                                  : field.name === 'scholarship_course'
                                  ? loadScholarShipCourses
                                  : field.name === 'study_destination_countries'
                                  ? countries
                                  : field.name === 'mode_of_teaching'
                                  ? loadModeOfTeaching
                                  : field.name === 'subjects'
                                  ? loadSubjects
                                  : field.name === 'service_delivery'
                                  ? loadServiceDelivary
                                  : field.name === 'study_level'
                                  ? loadStudyLevel
                                  : field.name === 'study_destination_states'
                                  ? states
                                  : field.name === 'service_available_cities'
                                  ? cities
                                  : field.name === 'event_location'
                                  ? cities
                                  : field.name === 'loan_available_countries'
                                  ? countries
                                  : []
                              }
                              value={(product.formData[field.name] || '')
                                .split(', ')
                                .filter(Boolean)
                                .map((value) => ({ value, label: value }))}
                              onChange={(selectedOptions) =>
                                handleMultiSelectChange(
                                  selectedOptions,
                                  field.name,
                                  categoryIndex,
                                  productIndex
                                )
                              }
                              placeholder={`Select ${field.label}`}
                              className={`w-full ${
                                product.errors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: product.errors[field.name]
                                    ? '#ef4444'
                                    : base.borderColor,
                                  '&:hover': {
                                    borderColor: product.errors[field.name]
                                      ? '#ef4444'
                                      : base.borderColor,
                                  },
                                }),
                              }}
                            />
                            {renderErrorMessage(product.errors, field.name)}
                          </div>
                        ) : field.type === 'radio' ? (
                          <>
                            <div className="flex flex-col gap-2">
                              {field.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center"
                                >
                                  <input
                                    type="radio"
                                    id={`${field.name}-${option.value}-${categoryIndex}-${productIndex}`}
                                    name={field.name}
                                    value={option.value}
                                    checked={
                                      product.formData[field.name] ===
                                      option.value
                                    }
                                    onChange={(e) =>
                                      handleProductChange(
                                        e,
                                        categoryIndex,
                                        productIndex
                                      )
                                    }
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor={`${field.name}-${option.value}-${categoryIndex}-${productIndex}`}
                                    className="text-gray-700"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>

                            {renderErrorMessage(product.errors, field.name)}

                            {/* Only display refund_policy_media if refund_policy is 'false' */}
                            {field.name === 'refund_policy' &&
                              product.formData[field.name] === 'false' && (
                                <div className="mt-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-gray-700">
                                      Upload Refund Policy Document{' '}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="file"
                                      name="refund_policy_media"
                                      accept="application/pdf, image/*"
                                      onChange={(e) =>
                                        handleFileChange(
                                          e,
                                          'refund_policy_media',
                                          categoryIndex,
                                          productIndex
                                        )
                                      }
                                      className={`w-full p-2 border rounded-md ${
                                        product.errors['refund_policy_media']
                                          ? 'border-red-500'
                                          : ''
                                      }`}
                                    />
                                    {product.formData['refund_policy_media']
                                      ?.name && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-gray-700">
                                          {
                                            product.formData[
                                              'refund_policy_media'
                                            ].name
                                          }
                                        </span>
                                        <button
                                          type="button"
                                          className="text-red-500 text-sm"
                                          onClick={() =>
                                            handleFileRemove(
                                              'refund_policy_media',
                                              0,
                                              categoryIndex,
                                              productIndex
                                            )
                                          }
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </>
                        ) : (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              placeholder={`Enter ${field.label}`}
                              value={product.formData[field.name] || ''}
                              onChange={(e) =>
                                handleProductChange(
                                  e,
                                  categoryIndex,
                                  productIndex
                                )
                              }
                              className={`w-full p-2 border rounded-md ${
                                product.errors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {renderErrorMessage(product.errors, field.name)}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            <button
              type="button"
              className="px-4 py-2 bg-purple-primary text-white rounded-md hover:bg-green-700 mt-4"
              onClick={() =>
                handleSaveNestedProduct(categoryIndex, productIndex)
              }
            >
              Save
            </button>
          </div>
        )}
        {/* Add cropper before closing div */}
        {cropperImage &&
          currentFileInfo?.categoryIndex === categoryIndex &&
          currentFileInfo?.productIndex === productIndex && (
            <ImageCropper
              image={cropperImage.src} //  Pass the image source
              aspect={16 / 9}
              onCropComplete={handleCroppedImage} //  Use the new crop handler
              onCancel={() => {
                setCropperImage(null);
                setCurrentFileInfo(null);
              }}
            />
          )}
      </div>
    ));
  };

  return (
    <ErrorBoundary>
      <div>
        <div
          className="w-fit cursor-pointer m-10"
          onClick={() => navigate('/home')}
        >
          <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
        </div>
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6 border rounded-md m-10">
            <div
              className="cursor-pointer bg-purple-100 p-3 flex justify-between items-center"
              onClick={() => toggleAccordion(categoryIndex)}
            >
              <h3 className="text-lg font-medium">
                {category.name || 'Select Category'}
              </h3>
              <span>{category.isOpen ? '-' : '+'}</span>
            </div>
            {category.isOpen && (
              <div className="p-4">
                {renderProductForms(category, categoryIndex)}
              </div>
            )}
          </div>
        ))}

        <div className="mb-6 border rounded-md p-4 mt-8 m-10">
          <label className="block text-gray-700 mb-2">Choose Category</label>
          <select
            value={currentForm.category}
            onChange={handleProductCategoryChange}
            className="w-1/3 p-2 border rounded-md mb-4"
          >
            <option value="">Select Category</option>
            {Object.keys(ProductDetailsData[0].categoryFields).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {currentForm.category && (
            <div>
              {ProductDetailsData[0].categoryFields[currentForm.category]?.some(
                (section) => section.heading === 'Subcategory'
              ) && !currentForm.formData.subcategory ? (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Select Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={currentForm.formData.subcategory || ''}
                    onChange={handleProductChange}
                    className="w-1/3 p-2 border rounded-md"
                  >
                    <option value="">Select Subcategory</option>
                    {ProductDetailsData[0].categoryFields[currentForm.category]
                      .find((section) => section.heading === 'Subcategory')
                      ?.fields[0].options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                  {renderErrorMessage(currentForm.errors, 'subcategory')}
                </div>
              ) : (
                <div>
                  {ProductDetailsData[0].categoryFields[
                    currentForm.category
                  ]?.map((section, sectionIndex) => {
                    if (
                      section.subcategory &&
                      section.subcategory !== currentForm.formData.subcategory
                    ) {
                      return null;
                    }
                    return (
                      <div key={sectionIndex} className="mb-4">
                        <h5 className="text-sm font-semibold mb-2">
                          {section.heading}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex}>
                              <label className="block text-gray-700 mb-2">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>
                              {[
                                'product_description',
                                'product_unique_selling_point',
                                'scholarship_description',
                              ].includes(field.name) ? (
                                <>
                                  <RichTextEditor
                                    value={
                                      currentForm.formData[field.name] || ''
                                    }
                                    onChange={(content) =>
                                      handleProductChange({
                                        target: {
                                          name: field.name,
                                          value: content,
                                        },
                                      })
                                    }
                                    placeholder={`Enter ${field.label}`}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    50 to 1000 characters
                                  </p>
                                  {renderErrorMessage(
                                    currentForm.errors,
                                    field.name
                                  )}
                                </>
                              ) : field.type === 'select' ? (
                                <>
                                  <select
                                    name={field.name}
                                    value={
                                      currentForm.formData[field.name] || ''
                                    }
                                    onChange={handleProductChange}
                                    className={`w-full p-2 border rounded-md ${
                                      currentForm.errors[field.name]
                                        ? 'border-red-500'
                                        : ''
                                    }`}
                                  >
                                    <option value="">
                                      Select {field.label}
                                    </option>
                                    {field.options.map((option, optIndex) => (
                                      <option key={optIndex} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  {renderErrorMessage(
                                    currentForm.errors,
                                    field.name
                                  )}
                                </>
                              ) : field.type === 'file' ? (
                                <>
                                  <div className="flex flex-col gap-2">
                                    <div
                                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md ${
                                        currentForm.errors[field.name]
                                          ? 'border-red-500'
                                          : 'border-purple-primary'
                                      }`}
                                    >
                                      <input
                                        type="file"
                                        name={field.name}
                                        id={`${field.name}-upload`}
                                        onChange={(e) =>
                                          handleFileChange(e, field.name)
                                        }
                                        accept={
                                          field.name === 'product_images'
                                            ? 'image/*'
                                            : 'video/*'
                                        }
                                        multiple={
                                          field.name === 'product_images'
                                        }
                                        className="hidden"
                                      />
                                      <label
                                        htmlFor={`${field.name}-upload`}
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-10 w-10 text-purple-primary"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-4l-3-3m0 0l-3 3m3-3v12"
                                          />
                                        </svg>
                                        <p className="text-purple-primary mt-2 text-sm">
                                          Click to upload
                                        </p>
                                        <p className="text-purple-primary text-xs">
                                          (Max{' '}
                                          {field.name === 'product_images'
                                            ? '5MB'
                                            : '20MB'}
                                          )
                                        </p>
                                        {/* Upload limit text */}
                                        {field.name === 'product_images' && (
                                          <p className="text-gray-500 text-xs mt-1">
                                            Up to 5 images are accepted.
                                          </p>
                                        )}
                                        {field.name === 'product_videos' && (
                                          <p className="text-gray-500 text-xs mt-1">
                                            Only 1 video is accepted.
                                          </p>
                                        )}
                                      </label>
                                    </div>

                                    {/* Preview section */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {field.name === 'product_images' &&
                                        (
                                          currentForm.formData[field.name] || []
                                        ).map((file, idx) => (
                                          <FilePreviewCard
                                            key={idx}
                                            file={file}
                                            fieldName={field.name}
                                            onPreview={() =>
                                              handlePreview(file, field.name)
                                            }
                                            onDelete={() =>
                                              handleFileRemove(field.name, idx)
                                            }
                                            showMenu={showMenu}
                                            toggleMenu={toggleMenu}
                                            isUploading={
                                              uploadingFiles[
                                                `${field.name}-main-form`
                                              ]
                                            }
                                          />
                                        ))}

                                      {field.name === 'product_videos' &&
                                        currentForm.formData[field.name] && (
                                          <FilePreviewCard
                                            file={
                                              currentForm.formData[field.name]
                                            }
                                            fieldName={field.name}
                                            onPreview={() =>
                                              handlePreview(
                                                currentForm.formData[
                                                  field.name
                                                ],
                                                field.name
                                              )
                                            }
                                            onDelete={() =>
                                              handleFileRemove(field.name, 0)
                                            }
                                            showMenu={showMenu}
                                            toggleMenu={toggleMenu}
                                            isUploading={
                                              uploadingFiles[
                                                `${field.name}-main-form`
                                              ]
                                            }
                                          />
                                        )}
                                    </div>

                                    {renderErrorMessage(
                                      currentForm.errors,
                                      field.name
                                    )}
                                  </div>
                                </>
                              ) : field.type === 'multiselect' ? (
                                <div>
                                  <Select
                                    isMulti
                                    name={field.name}
                                    options={
                                      field.name === 'study_level' &&
                                      currentForm.category === 'Tutoring'
                                        ? loadTutorStudyLevel
                                        : field.name === 'study_level' &&
                                          currentForm.category ===
                                            'Career counselling'
                                        ? loadCounsellingLevel
                                        : field.name === 'event_delivery'
                                        ? loadServiceDelivary
                                        : field.name === 'loan_for_study_level'
                                        ? loadLoanStudyLevel
                                        : field.name ===
                                          'scholarship_study_level'
                                        ? loadLoanStudyLevel
                                        : field.name === 'scholarship_states'
                                        ? states
                                        : field.name === 'scholarship_category'
                                        ? loadScholarShipCategories
                                        : field.name === 'scholarship_type'
                                        ? loadScholarShipTypes
                                        : field.name === 'scholarship_course'
                                        ? loadScholarShipCourses
                                        : field.name === 'mode_of_teaching'
                                        ? loadModeOfTeaching
                                        : field.name === 'subjects'
                                        ? loadSubjects
                                        : field.name === 'service_delivery'
                                        ? loadServiceDelivary
                                        : field.name === 'study_level'
                                        ? loadStudyLevel
                                        : field.name ===
                                          'study_destination_states'
                                        ? states
                                        : field.name ===
                                          'service_available_cities'
                                        ? cities
                                        : field.name === 'event_location'
                                        ? cities
                                        : field.name ===
                                          'loan_available_countries'
                                        ? countries
                                        : field.name ===
                                          'study_destination_countries'
                                        ? countries
                                        : []
                                    }
                                    value={(
                                      currentForm.formData[field.name] || ''
                                    )
                                      .split(', ')
                                      .filter(Boolean)
                                      .map((value) => ({
                                        value,
                                        label: value,
                                      }))}
                                    onChange={(selectedOptions) =>
                                      handleMultiSelectChange(
                                        selectedOptions,
                                        field.name
                                      )
                                    }
                                    placeholder={`Select ${field.label}`}
                                    className={`w-full ${
                                      currentForm.errors[field.name]
                                        ? 'border-red-500'
                                        : ''
                                    }`}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        borderColor: currentForm.errors[
                                          field.name
                                        ]
                                          ? '#ef4444'
                                          : base.borderColor,
                                        '&:hover': {
                                          borderColor: currentForm.errors[
                                            field.name
                                          ]
                                            ? '#ef4444'
                                            : base.borderColor,
                                        },
                                      }),
                                    }}
                                  />
                                  {renderErrorMessage(
                                    currentForm.errors,
                                    field.name
                                  )}
                                </div>
                              ) : field.type === 'radio' ? (
                                <>
                                  <div className="flex flex-col gap-2">
                                    {field.options.map(
                                      (option, optionIndex) => (
                                        <div
                                          key={optionIndex}
                                          className="flex items-center"
                                        >
                                          <input
                                            type="radio"
                                            id={`${field.name}-${option.value}-${currentForm.category}`}
                                            name={field.name}
                                            value={option.value}
                                            checked={
                                              currentForm.formData[
                                                field.name
                                              ] === option.value
                                            }
                                            onChange={handleProductChange}
                                            className="mr-2"
                                          />
                                          <label
                                            htmlFor={`${field.name}-${option.value}-${currentForm.category}`}
                                            className="text-gray-700"
                                          >
                                            {option.label}
                                            {field.name === 'refund_policy' &&
                                              option.value === 'true' && (
                                                <a
                                                  href="https://xcellify.com/TermsOfUse#refund-policy"
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-500 underline hover:text-blue-700 ml-2"
                                                >
                                                  (Link)
                                                </a>
                                              )}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>

                                  {renderErrorMessage(
                                    currentForm.errors,
                                    field.name
                                  )}

                                  {/* Show file upload only if refund_policy is 'false' */}
                                  {field.name === 'refund_policy' &&
                                    currentForm.formData[field.name] ===
                                      'false' && (
                                      <div className="mt-4">
                                        <div className="flex flex-col gap-2">
                                          <label className="text-gray-700">
                                            Upload Refund Policy Document{' '}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="file"
                                            name="refund_policy_media"
                                            id={`refund_policy_media-${currentForm.category}`}
                                            onChange={(e) =>
                                              handleFileChange(
                                                e,
                                                'refund_policy_media'
                                              )
                                            }
                                            accept="application/pdf, .pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .doc, .docx, image/*"
                                            className={`w-full p-2 border rounded-md ${
                                              currentForm.errors[
                                                'refund_policy_media'
                                              ]
                                                ? 'border-red-500'
                                                : ''
                                            }`}
                                          />
                                          <p className="text-xs text-gray-500">
                                            Only PDFs, DOCX files, and images
                                            (JPG, PNG) up to 5MB are accepted.
                                          </p>

                                          {currentForm.formData[
                                            'refund_policy_media'
                                          ]?.id && (
                                            <div className="flex items-center gap-2 mt-2">
                                              <span className="text-sm text-gray-700">
                                                {
                                                  currentForm.formData[
                                                    'refund_policy_media'
                                                  ].name
                                                }
                                              </span>
                                              <button
                                                type="button"
                                                className="text-red-500 text-sm"
                                                onClick={() =>
                                                  handleFileRemove(
                                                    'refund_policy_media',
                                                    0
                                                  )
                                                }
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          )}
                                          {renderErrorMessage(
                                            currentForm.errors,
                                            'refund_policy_media'
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {['Career counselling', 'Tutoring'].includes(
                                    currentForm.category
                                  ) && (
                                    <PackageDetailsSection
                                      formData={currentForm.formData}
                                      setFormData={(updater) =>
                                        setCurrentForm((prev) => {
                                          const updatedFormData =
                                            typeof updater === 'function'
                                              ? updater(prev.formData)
                                              : {
                                                  ...prev.formData,
                                                  ...updater,
                                                };

                                          return {
                                            ...prev,
                                            formData: updatedFormData,
                                          };
                                        })
                                      }
                                    />
                                  )}
                                </>
                              ) : (
                                <>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    value={
                                      currentForm.formData[field.name] || ''
                                    }
                                    onChange={handleProductChange}
                                    className={`w-full p-2 border rounded-md ${
                                      currentForm.errors[field.name]
                                        ? 'border-red-500'
                                        : ''
                                    }`}
                                  />
                                  {renderErrorMessage(
                                    currentForm.errors,
                                    field.name
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6">
          {/* Save & Add Product Button */}
          <button
            type="button"
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg text-white font-dmsans font-bold rounded-md bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
            onClick={handleAddProductForm}
          >
            Save & add product
          </button>

          {/* Skip As of Now Button */}
          <button
            type="button"
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg text-white font-dmsans font-bold rounded-md bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
            onClick={handleSkipNow}
          >
            Skip as of now
          </button>

          {/* Submit All Products Button */}
          <button
            type="button"
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg font-dmsans text-white font-bold rounded-md flex items-center justify-center bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200 ${
              loading ? 'cursor-not-allowed opacity-75' : ''
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit All Products'
            )}
          </button>
        </div>

        {previewMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
            <div className="relative bg-white rounded-md shadow-md p-4">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 z-20 bg-white text-center rounded-md"
                onClick={() => setPreviewMedia(null)}
              >
                Close
              </button>
              {previewMedia.type === 'image' ||
              previewMedia.url?.includes('image') ? (
                <img
                  src={previewMedia.url}
                  alt="Preview"
                  className="max-w-full max-h-screen rounded-md"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  className="max-w-full max-h-screen rounded-md"
                />
              )}
            </div>
          </div>
        )}

        {/* Add cropper before ToastContainer */}
        {cropperImage && (
          <ImageCropper
            image={cropperImage.src} //  Pass the image source
            aspect={16 / 9}
            onCropComplete={handleCroppedImage} //  Use the new crop handler
            onCancel={() => {
              setCropperImage(null);
              setCurrentFileInfo(null);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StepVendorProductDetailsPage;
