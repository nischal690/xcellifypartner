import React from 'react';
import { ProductDetailsData } from '../../utils/StepVendorProductDetails';
import Select from 'react-select';
import LoadingSpinner from './LoadingSpinner';
import ImageCropper from '../commonComponents/ImageCropper';

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
} from '../../utils/productsCodes';

const ProductFormsRenderer = ({
  category,
  categoryIndex,
  categories,
  setCategories,
  cropperImage,
  handleCroppedImage,
  currentFileInfo,
  showMenu,
  toggleMenu,
  handleProductChange,
  handleFileChange,
  handleFileRemove,
  handlePreview,
  uploadingFiles,
  handleSaveNestedProduct,
  setCropperImage,
  setCurrentFileInfo,
  generateYearOptions,
  fileInputRef,
  countries,
  states,
  cities,
}) => {
  const renderErrorMessage = (errors, fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };
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
                              product.errors[field.name] ? 'border-red-500' : ''
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
                              product.errors[field.name] ? 'border-red-500' : ''
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
                              product.errors[field.name] ? 'border-red-500' : ''
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
                              product.errors[field.name] ? 'border-red-500' : ''
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
            onClick={() => handleSaveNestedProduct(categoryIndex, productIndex)}
          >
            Save
          </button>
        </div>
      )}
      {/* Add cropper  */}
      {cropperImage &&
        currentFileInfo?.categoryIndex === categoryIndex &&
        currentFileInfo?.productIndex === productIndex && (
          <ImageCropper
            image={cropperImage.src}
            aspect={16 / 9}
            onCropComplete={handleCroppedImage}
            onCancel={() => {
              setCropperImage(null);
              setCurrentFileInfo(null);
            }}
          />
        )}
    </div>
  ));
};

export default ProductFormsRenderer;
