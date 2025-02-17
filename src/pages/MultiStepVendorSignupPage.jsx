import React, { useEffect, useState } from 'react';

import { toJS } from 'mobx';

import rightArrowIcon from '../assets/right-arrow.svg';
import PrimaryLogo from '../assets/logo-primary.png';
import { useNavigate } from 'react-router-dom';
import steps from '../utils/MultiStepVendorSignupFormData'; // Updated data
import { fileUploadInfo } from '../utils/MultiStepVendorSignupFormData';
import { useStore } from '../stores';
import { AuthStatuses } from '../utils/constants';
import apiRequest from '../utils/apiRequest';
import { validateStep } from '../utils/signupDetailsValidations';
import Dropdown from '../components/commonComponents/Dropdown';
import StepVendorProductDetailsPage from './StepVendorProductDetailsPage';

import signupValidationSchemas from '../utils/signupDetailsValidations';
import {
  getPincodeLocationDetails,
  loadCities,
  loadCountries,
  loadStates,
} from '../utils/geocoding';
import { toast } from 'react-toastify';

const useDebouncedValue = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

const MultiStepVendorSignupPage = () => {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [sameAsAbove, setSameAsAbove] = useState(false);

  const userInfo = toJS(appStore.getUserInfo);
  console.log('userInfo', userInfo?.id);

  // Dynamically initialize form data
  const initialFormData = steps
    .flatMap((step) =>
      step.sections.flatMap((section) =>
        section.fields.map((field) => field.name)
      )
    )
    .reduce((acc, fieldName) => {
      acc[fieldName] = '';
      return acc;
    }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  //geoCoding
  const [countryOptions, setcountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [disableCountrySelction, setDisableCountrySelection] = useState(false);
  const debouncedPincode = useDebouncedValue(formData.pincode || '', 500);

  const uploadFieldToApiMap = {
    digital_signature: {
      url: 'mic-login/signature',
      bodyParam: 'signature',
    },
    msme_certificate: {
      url: 'mic-login/msmeCertificate',
      bodyParam: 'certificate',
    },
    brand_logo: {
      url: 'mic-login/profile-picture',
      bodyParam: 'image',
    },
  };

  const uploadFile = async (fieldName, userId, file) => {
    const apiDetails = uploadFieldToApiMap[fieldName];

    if (!apiDetails) {
      console.error(`No API mapping found for field: ${fieldName}`);
      return;
    }

    const formData = new FormData();
    formData.append(apiDetails.bodyParam, file);
    formData.append('user_id', userId);

    try {
      const response = await apiRequest({
        url: apiDetails.url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`${fieldName} uploaded successfully`, response);
      toast.success(`${fieldName} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
    }
  };

  useEffect(() => {
    const getPincodeLocationDetails1 = async (pincode) => {
      const pincodeLocationDetails = await getPincodeLocationDetails(pincode);
      if (!!pincodeLocationDetails) {
        setFormData((prev) => ({
          ...prev,
          country: pincodeLocationDetails.country,
        }));
        if (!!pincodeLocationDetails?.state && !!pincodeLocationDetails?.city) {
          setFormData((prev) => ({
            ...prev,
            country: pincodeLocationDetails.country,
            state: pincodeLocationDetails.state,
            city: pincodeLocationDetails.city,
          }));
          setDisableCountrySelection(true); // when there are all fields
        } //when one of state or city is missing
        else setDisableCountrySelection(false);
      }
      //when do data available
      else {
        setDisableCountrySelection(false);
        loadCountries();
      }
    };
    getPincodeLocationDetails1(debouncedPincode);
  }, [debouncedPincode]);

  useEffect(() => {
    let { countriesList } = loadCountries();
    if (!!countriesList) {
      setcountryOptions(converToOptions(countriesList));
    }
  }, []);

  useEffect(() => {
    if (formData.country) {
      const states = loadStates(formData.country);
      if (!!states) {
        setStateOptions(converToOptions(states));
      }
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      let cities = loadCities(formData.state);
      setCityOptions(converToOptions(cities));
    }
  }, [formData.state]);

  const handleDisable = (name) => {
    if (name === 'country' || name === 'state' || name === 'city')
      return disableCountrySelction;
    return false;
  };

  const handleOptions = (name) => {
    let options;
    switch (name) {
      case 'country':
        options = countryOptions;
        break;
      case 'state':
        options = stateOptions;
        break;
      case 'city':
        options = cityOptions;
        break;
    }
    return options;
  };

  const converToOptions = (list) => {
    return list.map((value) => {
      return { label: value, value: value };
    });
  };

  const validate = async () => {
    const newErrors = await validateStep(formData, currentStep);
    console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    if (await validate()) {
      setCurrentStep((prev) => prev + 1);
    }
    if (currentStep == 1) {
      handleSubmit(e);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const validateField = async (name, value) => {
    try {
      await signupValidationSchemas[currentStep].validateAt(name, {
        ...formData,
        [name]: value,
      });

      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  // Update your handleChange function
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (
      sameAsAbove &&
      [
        'contact_person_name',
        'contact_person_email',
        'contact_person_mobile',
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        owner_name: name === 'contact_person_name' ? value : prev.owner_name,
        owner_email: name === 'contact_person_email' ? value : prev.owner_email,
        owner_mobile:
          name === 'contact_person_mobile' ? value : prev.owner_mobile,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (files && files[0]) {
      const file = files[0];
      if (uploadFieldToApiMap[name]) {
        uploadFile(name, userInfo?.id, file);
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      validateField(name, file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      try {
        const response = await apiRequest({
          url: '/mic-login/partnerProfileInfo',
          method: 'post',
          data: formData,
        });
        if (response?.data) {
          toast.success('Detailed submiited');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-md p-6">
      {/* Header */}
      <div className="px-3 mb-5 w-fit" onClick={() => navigate('/')}>
        <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-5 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex items-center" style={{ marginLeft: '5px' }}>
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  index <= currentStep
                    ? 'bg-purple-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                } mx-auto`}
              >
                {index + 1}
              </div>
              <p
                className={`text-center ms-2 ${
                  index <= currentStep ? 'text-purple-primary' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <img
                src={rightArrowIcon}
                style={{ marginLeft: '5px', height: '15px', width: '15px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <form className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {steps[currentStep].title}
        </h2>

        {/* Sections */}
        {currentStep < 2 && (
          <>
            {steps[currentStep].sections.map((section, secIdx) => (
              <div key={secIdx} className="mb-10">
                <h3 className="text-lg font-medium mb-4">{section.heading}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, idx) => (
                    <div
                      key={idx}
                      className={`col-span-${
                        field.type === 'textarea' ? '2' : '1'
                      }`}
                    >
                      <label className="block text-gray-700 mb-2">
                        {field.label}
                        {field.required &&
                          !(
                            (field.name === 'company_name' &&
                              formData.company_type === 'Individual') ||
                            (field.name === 'CIN' &&
                              formData.company_type === 'Individual') ||
                            (field.name === 'GST' &&
                              formData.company_type === 'Individual') ||
                            (field.name === 'msme_certificate' &&
                              formData.MSME_registered !== 'Yes')
                          ) && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <Dropdown
                          id={field.name}
                          name={field.name}
                          options={handleOptions(field.name) || field.options}
                          handleChange={handleChange}
                          selectedValue={formData[field.name]}
                          defaultValueText={
                            !!formData[field.name]
                              ? formData[field.name]
                              : `Select ${field.label}`
                          }
                          disabled={handleDisable(field.name)}
                          inputStyle="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                        />
                      ) : field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                          rows={4}
                        />
                      ) : field.type === 'file' ? (
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.name]}
                        </p>
                      )}
                      {fileUploadInfo[field.name] && (
                        <p className="text-sm text-gray-500 mt-1">
                          {fileUploadInfo[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {/* ✅ Checkbox -  */}
                {section.heading === "Contact person's details" && (
                  <div className="mt-4 flex items-center">
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
                      className="mr-2"
                    />
                    <label htmlFor="sameAsAbove" className="text-gray-700">
                      Same as above (Auto-fill CEO/Owner details)
                    </label>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {currentStep === 2 && <StepVendorProductDetailsPage />}

        {/* Navigation Buttons */}
        {currentStep < 2 && (
          <div className="flex justify-between items-center mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border rounded-md text-purple-primary border-purple-primary hover:bg-purple-50"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-700"
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button
                type="submit"
                className="px-6 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-700"
              >
                Submit
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default MultiStepVendorSignupPage;
