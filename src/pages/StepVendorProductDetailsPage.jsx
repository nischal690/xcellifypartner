import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import PackageDetailsSection from '../components/product/PackageDetailsSection';
import { useVendorProductDetails } from '../hooks/products/useVendorProductDetails';
import LoadingSpinner from '../components/product/LoadingSpinner';
import ProductFormsRenderer from '../components/product/ProductFormsRenderer';
import ProductButtons from '../components/product/ProductButtons';
import PreviewModal from '../components/product/PreviewModal';

const StepVendorProductDetailsPage = () => {
  const { appStore } = useStore();
  const navigate = useNavigate();

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
    handleAIRefine,
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

  {
    categories.map((category, categoryIndex) => (
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
            <ProductFormsRenderer
              category={category}
              categoryIndex={categoryIndex}
              categories={categories}
              setCategories={setCategories}
              cropperImage={cropperImage}
              handleCroppedImage={handleCroppedImage}
              currentFileInfo={currentFileInfo}
              showMenu={showMenu}
              toggleMenu={toggleMenu}
              handleProductChange={handleProductChange}
              handleFileChange={handleFileChange}
              handleFileRemove={handleFileRemove}
              handlePreview={handlePreview}
              uploadingFiles={uploadingFiles}
              handleSaveNestedProduct={handleSaveNestedProduct}
              setCropperImage={setCropperImage}
              setCurrentFileInfo={setCurrentFileInfo}
              generateYearOptions={generateYearOptions}
              fileInputRef={fileInputRef}
              countries={countries}
              states={states}
              cities={cities}
            />
          </div>
        )}
      </div>
    ));
  }

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
                <ProductFormsRenderer
                  category={category}
                  categoryIndex={categoryIndex}
                  categories={categories}
                  setCategories={setCategories}
                  cropperImage={cropperImage}
                  handleCroppedImage={handleCroppedImage}
                  currentFileInfo={currentFileInfo}
                  showMenu={showMenu}
                  toggleMenu={toggleMenu}
                  handleProductChange={handleProductChange}
                  handleFileChange={handleFileChange}
                  handleFileRemove={handleFileRemove}
                  handlePreview={handlePreview}
                  uploadingFiles={uploadingFiles}
                  handleSaveNestedProduct={handleSaveNestedProduct}
                  setCropperImage={setCropperImage}
                  setCurrentFileInfo={setCurrentFileInfo}
                  generateYearOptions={generateYearOptions}
                  fileInputRef={fileInputRef}
                  countries={countries}
                  states={states}
                  cities={cities}
                />
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
                                    fieldName={field.name}
                                    onAIRefine={handleAIRefine}
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

        <ProductButtons
          handleAddProductForm={handleAddProductForm}
          handleSkipNow={handleSkipNow}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <PreviewModal
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
        />

        {/* Image cropper */}
        {cropperImage && (
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
    </ErrorBoundary>
  );
};

export default StepVendorProductDetailsPage;
