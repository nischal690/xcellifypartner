import React, { useEffect, useState } from 'react';

import Joyride from 'react-joyride';
import { removeBackground } from '@imgly/background-removal';

import { toJS } from 'mobx';

import rightArrowIcon from '../assets/right-arrow.svg';
import PrimaryLogo from '../assets/logo-primary.png';
import { useNavigate } from 'react-router-dom';
import steps from '../utils/MultiStepVendorSignupFormData'; // Updated data
import { tourSteps } from '../utils/MultiStepVendorSignupFormData';
import {
  fileUploadInfo,
  fileHintMessage,
} from '../utils/MultiStepVendorSignupFormData';
import { useStore } from '../stores';
import { AuthStatuses, HTTP_CODE } from '../utils/constants';
import apiRequest from '../utils/apiRequest';
import { validateStep } from '../utils/signupDetailsValidations';
import Dropdown from '../components/commonComponents/Dropdown';
import StepVendorProductDetailsPage from './StepVendorProductDetailsPage';
import FileUploadPreviewCard from '../components/commonComponents/profileDetails/FileUploadPreviewCard';

import signupValidationSchemas from '../utils/signupDetailsValidations';
import {
  getPincodeLocationDetails,
  loadCities,
  loadCountries,
  loadStates,
} from '../utils/geocoding';
import { toast } from 'react-toastify';
import OnBoardingHeader from '../components/onboardingPage/OnBoardingHeader';
import SupplierDeclarationCard from '../components/onboardingPage/SupplierDeclarationCard';
import LoaderMessage from '../components/commonComponents/LoaderMessage';
import AutoFilledInputRating from '../components/onboardingPage/AutoFilledInputRating';
import { useGoogleRating } from '../hooks/profile/useGoogleRating';

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

  const userInfo = toJS(appStore.userInfo);
  const partnerInfo = toJS(appStore.partnerInfo);
  // console.log('partnerInfo==', partnerInfo?.first_name);

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

  const [isRemovingBG, setIsRemovingBG] = useState(false);
  const [removalMessage, setRemovalMessage] = useState('');
  const [uploadingFields, setUploadingFields] = useState({});

  const [CINData, setCINData] = useState({});
  const [isCINValidated, setIsCINValidated] = useState(false);
  const [GSTData, setGSTData] = useState({});
  const [isGSTValidated, setIsGSTValidated] = useState(false);
  const [PANData, setPANData] = useState({});
  const [isPANValidated, setIsPANValidated] = useState(false);
  const [bankData, setBankData] = useState({});
  const [isBankAccountVerified, setIsBankAccountVerified] = useState(false);

  const debouncedCompanyName = useDebouncedValue(formData.company_name, 1000);

  const debouncedBrandName = useDebouncedValue(formData.brand_name, 1000);

  useGoogleRating({
    companyName: debouncedCompanyName,
    brandName: debouncedBrandName,
    setFormData,
  });

  // console.log('rating:', formData.google_rating);
  // console.log('goggle rating url:', formData.google_rating_url);

  const getFieldValidationSchema = (name) => {
    const stepSchema = signupValidationSchemas[currentStep];
    return stepSchema.fields[name]; // get schema for this field
  };

  const uploadFieldToApiMap = {
    brand_logo: {
      url: 'mic-login/profile-picture',
      bodyParam: 'image',
    },
  };

  // List of file types that should use the new `uploadAttachments` API
  const uploadableFileTypes = [
    'msme_certificate',
    'signature',
    'aadhar_coi',
    'pan_card',
    'gst',
    'cancelled_cheque',
    'gst_declaration',
    'supplier_declaration',
  ];

  /**
   * Function to handle file uploads dynamically based on file type.
   * @param {string} fieldName - The form field name for the file.
   * @param {string} userId - User ID (if needed).
   * @param {File} file - The file to be uploaded.
   */
  const uploadFile = async (fieldName, userId, file) => {
    let formData = new FormData();

    // Handle brand_logo separately
    if (fieldName === 'brand_logo') {
      formData.append('image', file);
      formData.append('user_id', userId);
    }
    // Handle other file uploads using uploadAttachments API
    else if (uploadableFileTypes.includes(fieldName)) {
      formData.append('fileType', fieldName);
      formData.append('attachment', file);
    } else {
      console.error(`No API mapping found for field: ${fieldName}`);
      return;
    }

    try {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));

      const apiUrl =
        fieldName === 'brand_logo'
          ? uploadFieldToApiMap.brand_logo.url
          : 'mic-login/uploadAttachments';

      const response = await apiRequest({
        url: apiUrl,
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Log the full response for debugging
      console.log('API Response:', response);

      // Correctly access response.data.success and response.data.message
      if (response?.data?.success) {
        toast.success(`${fieldName} uploaded successfully`, {
          toastId: fieldName,
        });
      } else {
        toast.error(
          `Failed to upload ${fieldName}. Server Response: ${
            response?.data?.message || 'Unknown error'
          }`
        );
      }
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      toast.error(
        `Error uploading ${fieldName}: ${error.message || 'Unknown error'}`
      );
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const verifyCIN = async () => {
    let resp = await apiRequest({
      url: '/mic-login/cin',
      method: 'POST',
      data: { cin: formData.CIN },
    });
    if (resp.status === HTTP_CODE?.SUCCESS && resp?.data) {
      return resp?.data;
    }
    return {};
  };

  const verifyGST = async () => {
    let resp = await apiRequest({
      url: '/mic-login/gstin',
      method: 'POST',
      data: { GSTIN: formData.GST },
    });
    if (resp.status === HTTP_CODE?.SUCCESS && resp?.data) {
      return resp?.data;
    }
    return {};
  };

  const verifyPAN = async () => {
    let resp = await apiRequest({
      url: '/mic-login/pan',
      method: 'POST',
      data: { pan: formData.PAN },
    });
    if (resp.status === HTTP_CODE?.SUCCESS && resp?.data) {
      return resp?.data;
    }
    return {};
  };

  const verifyBankAccount = async () => {
    let resp = await apiRequest({
      url: '/mic-login/bankAccount',
      method: 'POST',
      data: {
        bank_account: formData?.bank_account_number,
        ifsc: formData?.bank_ifsc,
        name: formData?.account_holder_name,
        phone: formData?.contact_person_mobile,
      },
    });
    if (resp.status === HTTP_CODE?.SUCCESS && resp?.data) {
      return resp?.data;
    }
    return {};
  };

  useEffect(() => {
    const cashFreeValidations = async () => {
      if (formData?.PAN.length === 10 && !isPANValidated) {
        setErrors((prev) => ({ ...prev, PAN: '' }));
        let data = await verifyPAN();
        if (data?.cashfreeResponse?.valid) {
          setPANData(data?.cashfreeResponse);
          setIsPANValidated(true);
          if (
            formData?.company_type == 'Individual' ||
            formData?.company_type == 'sole_proprietership'
          ) {
            let name = data?.cashfreeResponse?.registered_name;
            setFormData((prev) => ({ ...prev, contact_person_name: name }));
          }
          toast.success('Your PAN has been verified!');
        } else if (data?.cashfreeResponse && !data?.cashfreeResponse?.valid) {
          setErrors((prev) => ({ ...prev, PAN: 'Invalid PAN Number' }));
        }
      }

      if (formData?.GST.length === 15 && !isGSTValidated) {
        setErrors((prev) => ({ ...prev, GST: '' }));
        let data = await verifyGST();
        if (data?.cashfreeResponse?.valid) {
          setGSTData(data?.cashfreeResponse);
          setIsGSTValidated(true);

          let cashFreeAddressObj =
            data?.cashfreeResponse?.principal_place_split_address;

          let addressObj = {
            pincode: cashFreeAddressObj?.pincode || '',
            country: cashFreeAddressObj?.country || 'India',
            state: cashFreeAddressObj?.state || '',
            city: cashFreeAddressObj?.city || '',
            address_line_1: [
              cashFreeAddressObj?.flat_number,
              cashFreeAddressObj?.building_number,
              cashFreeAddressObj?.building_name,
            ]
              .filter(Boolean)
              .join(', '),
            address_line_2: [
              cashFreeAddressObj?.street,
              cashFreeAddressObj?.location,
            ]
              .filter(Boolean)
              .join(', '),
          };

          setFormData((prev) => ({ ...prev, ...addressObj }));
          setFormData((prev) => ({
            ...prev,
            company_name: data?.cashfreeResponse?.legal_name_of_business,
          }));

          toast.success('Your GSTIN has been verified!');
        } else if (data?.cashfreeResponse && !data?.cashfreeResponse?.valid) {
          setErrors((prev) => ({ ...prev, GST: 'Invalid GST Number' }));
        }
      }

      if (formData?.CIN.length === 21 && !isCINValidated) {
        setErrors((prev) => ({ ...prev, CIN: '' }));
        let data = await verifyCIN();
        if (data?.cashfreeResponse?.status == 'VALID') {
          setCINData(data?.cashfreeResponse);
          setIsCINValidated(true);
          toast.success('Your CIN has been verified');
        } else if (
          data?.cashfreeResponse &&
          data?.cashfreeResponse?.status == 'INVALID'
        ) {
          setErrors((prev) => ({ ...prev, CIN: 'Invalid CIN' }));
        }
      }
    };

    cashFreeValidations();
  }, [formData?.CIN, formData?.GST, formData?.PAN]);

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
      console.log(await validate(), currentStep);
      currentStep == 0 && setCurrentStep(1);
    }
    if (currentStep == 1) {
      let bankVerificationResponse = await verifyBankAccount();
      if (
        bankVerificationResponse?.cashfreeResponse?.account_status == 'VALID' &&
        bankVerificationResponse?.cashfreeResponse?.account_status_code ==
          'ACCOUNT_IS_VALID'
      ) {
        setFormData((prev) => ({
          ...prev,
          bank_name: bankVerificationResponse?.cashfreeResponse?.bank_name,
        }));
        toast.success('Account Verified!');
        handleSubmit(e);
      } else if (
        bankVerificationResponse?.cashfreeResponse?.account_status ==
          'INVALID' &&
        bankVerificationResponse?.cashfreeResponse?.account_status_code ==
          'ACCOUNT_IS_INVALID'
      ) {
        toast.error('Invalid IFSC or Account Number!');
      } else {
        toast.error('Error while verifying the account');
        handleSubmit(e);
      }
    }
  };

  console.log('formData of steps:', formData);

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

  const isFieldRequired = (fieldName) => {
    if (fieldName === 'company_name' && formData.company_type === 'Individual')
      return false;
    if (fieldName === 'CIN' && formData.company_type === 'Individual')
      return false;
    if (
      fieldName === 'GST' &&
      (formData.company_type === 'Individual' ||
        formData.company_type === 'sole_proprietership')
    )
      return false;
    if (fieldName === 'msme_certificate' && formData.MSME_registered !== 'Yes')
      return false;

    if (fieldName === 'GST' && formData.hasGSTnumber !== 'Yes') return false;
    if (
      (fieldName === 'gst' || fieldName === 'gst_declaration') &&
      (formData.company_type === 'sole_proprietership' ||
        formData.company_type === 'Individual')
    )
      return false;

    return true;
  };

  // Update your handleChange function
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      let file = files[0];

      try {
        const schema = getFieldValidationSchema(name);
        await schema.validate(file);
      } catch (error) {
        toast.error(error.message);
        return; // 🚫 Don't upload if validation fails
      }

      // File validation
      const { maxSize, acceptedTypes } = fileUploadInfo[name] || {};
      if (maxSize && file.size > maxSize) {
        toast.error(`File size exceeds ${maxSize / 1024 / 1024}MB`);
        return;
      }
      if (acceptedTypes && !acceptedTypes.includes(file.type)) {
        toast.error(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
        return;
      }

      // Special logic only for signature field
      if (name === 'signature') {
        try {
          setIsRemovingBG(true);
          setRemovalMessage('Removing background...');

          const arrayBuffer = await file.arrayBuffer();
          const imageBlob = new Blob([arrayBuffer], { type: file.type });

          const outputBlob = await removeBackground(imageBlob, {
            output: { format: 'image/png' },
            progress: (p) => console.log('BG removal progress:', p),
          });

          file = new File([outputBlob], 'signature.png', { type: 'image/png' });
          toast.success('Background removed from signature!');
        } catch (err) {
          console.error('Background removal failed:', err);
          toast.error('Failed to remove background from signature.');
        } finally {
          setIsRemovingBG(false);
          setRemovalMessage('');
        }
      }

      // Upload file
      uploadFile(name, userInfo?.id, file);

      // Update form data with the final (processed) file
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
          if (await validate()) {
            setCurrentStep(2);
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleLogout = () => {
    // Navigate first to prevent re-executing the useEffect logic before logout completes
    navigate('/login');

    // Clear authentication & user info
    appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
    appStore.updatePartnerInfo({});
    localStorage.removeItem('token');

    // Show logout success message
    toast.success('Logout Successfully');
  };

  return (
    <div className="w-full bg-white rounded-md p-6">
      <Joyride
        steps={tourSteps}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: '#876FFD',
            textColor: '#333',
            width: 400,
            zIndex: 1000,
          },
          buttonClose: {
            color: '#876FFD',
          },
          buttonNext: {
            backgroundColor: '#876FFD',
          },
          buttonBack: {
            color: '#876FFD',
          },
        }}
      />

      {/* Header */}
      <OnBoardingHeader partnerInfo={partnerInfo} handleLogout={handleLogout} />

      {/* Step Indicators */}
      <div className="step-indicators  flex items-center justify-center space-x-5 mb-6">
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
                  {section.fields.map((field, idx) =>
                    [
                      'partnership',
                      'Individual',
                      'sole_proprietership',
                    ].includes(formData.company_type) &&
                    field.name == 'CIN' ? null : (
                      <div
                        key={idx}
                        className={`col-span-${
                          field.type === 'textarea' ? '2' : '1'
                        }`}
                      >
                        <label className="block text-gray-700 mb-2">
                          {formData?.company_type == 'llp' &&
                          field.name == 'CIN'
                            ? 'LCIN'
                            : ['Individual', 'sole_proprietership'].includes(
                                formData?.company_type
                              ) && field.name == 'PAN'
                            ? field.label2
                            : field.label}
                          {field.required && isFieldRequired(field.name) && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        {field.type === 'select' ? (
                          <Dropdown
                            id={field?.name}
                            name={field?.name}
                            options={
                              handleOptions(field?.name) || field?.options
                            }
                            handleChange={handleChange}
                            selectedValue={formData[field?.name]}
                            defaultValueText={
                              !!formData[field?.name]
                                ? formData[field?.name]
                                : field.name == 'hasGSTnumber'
                                ? `Choose your answer`
                                : `Select ${field?.label}`
                            }
                            disabled={handleDisable(field?.name)}
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
                          <div>
                            <input
                              type="file"
                              name={field.name}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                            />

                            {/* Show preview card if file is uploaded */}
                            {['signature', 'brand_logo'].includes(field.name) &&
                              formData[field.name] && (
                                <FileUploadPreviewCard
                                  file={formData[field.name]}
                                  fieldName={field.name}
                                  onUpload={uploadFile}
                                  onRemove={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      [field.name]: null,
                                    }))
                                  }
                                />
                              )}
                            {field.name === 'signature' && isRemovingBG && (
                              <LoaderMessage message={removalMessage} />
                            )}
                            {[
                              'gst',
                              'aadhar_coi',
                              'pan_card',
                              'cancelled_cheque',
                              'gst_declaration',
                              'msme_certificate',
                              'brand_logo',
                            ].includes(field.name) &&
                              uploadingFields[field.name] && (
                                <LoaderMessage message="Uploading..." />
                              )}
                          </div>
                        ) : ['google_rating', 'google_rating_url'].includes(
                            field.name
                          ) ? (
                          <AutoFilledInputRating
                            name={field.name}
                            value={formData[field.name]}
                            label={field.label}
                            onChange={handleChange}
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                            placeholder={
                              ['Individual', 'sole_proprietership'].includes(
                                formData?.company_type
                              ) && field.name == 'PAN'
                                ? `Enter ${field.label2.toLowerCase()}`
                                : `Enter ${field.label.toLowerCase()}`
                            }
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
                        {[
                          'gst',
                          'aadhar_coi',
                          'pan_card',
                          'cancelled_cheque',
                          'msme_certificate',
                        ].includes(field.name) &&
                          field.type === 'file' && (
                            <p className="text-sm text-gray-500 mt-1">
                              {fileHintMessage}
                            </p>
                          )}

                        {field.name === 'supplier_declaration' && (
                          <div>
                            <p className="text-sm text-gray-500 mt-1">
                              Accepted: Only PDFs, Docx, PNG, JPG, JPEG (Max:
                              2MB)
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                              Fill and upload the declaration form docx file
                            </p>
                            <SupplierDeclarationCard />
                          </div>
                        )}
                        {field.name === 'signature' && (
                          <p className="text-sm text-gray-500 mt-1">
                            Accepted file formats images: .jpg, .jpeg, .png
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
                {/* ✅ Checkbox -  */}
                {section.heading === "Contact person's details" && (
                  <div className="mt-10 -mb-8 flex items-center">
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
                      className="mr-2"
                    />
                    <label
                      htmlFor="sameAsAbove"
                      className="text-purple-primary"
                    >
                      Fill the data as above?
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
