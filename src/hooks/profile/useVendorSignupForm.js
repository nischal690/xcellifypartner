import React, { useEffect, useState, useCallback } from 'react';

import { removeBackground } from '@imgly/background-removal';

import { set, toJS } from 'mobx';

import { useNavigate } from 'react-router-dom';

import {
  fileUploadInfo,
  fileHintMessage,
} from '../../utils/MultiStepVendorSignupFormData';

import { AuthStatuses, HTTP_CODE } from '../../utils/constants';
import apiRequest from '../../utils/apiRequest';
import { validateStep } from '../../utils/signupDetailsValidations';

import signupValidationSchemas from '../../utils/signupDetailsValidations';
import {
  getPincodeLocationDetails,
  loadCities,
  loadCountries,
  loadStates,
} from '../../utils/geocoding';
import { toast } from 'react-toastify';

import { useGoogleRating } from '../../hooks/profile/useGoogleRating';
import { vendorBaiscInfoValidation } from '../../utils/HelperFunction';
import useDebouncedValue from '../../hooks/useDebouncedValue';

export function useVendorSignupForm(steps, appStore) {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [sameAsAbove, setSameAsAbove] = useState(false);
  const [sameAsContactPerson, setSameAsContactPerson] = useState(false);

  const userInfo = toJS(appStore.userInfo);
  const partnerInfo = toJS(appStore.partnerInfo);
  // console.log('partnerInfo==', partnerInfo?.first_name);

  // Dynamically initialize form data
  const generateInitialFormData = () => {
    return steps
      .flatMap((step) =>
        step.sections.flatMap((section) =>
          section.fields.map((field) => field.name)
        )
      )
      .reduce((acc, fieldName) => {
        acc[fieldName] = '';
        return acc;
      }, {});
  };

  // Get saved form data from localStorage or initialize empty form
  const getSavedFormData = () => {
    const savedData = localStorage.getItem('vendorSignupFormData');
    return savedData ? JSON.parse(savedData) : generateInitialFormData();
  };

  const [formData, setFormData] = useState(getSavedFormData);
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

  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [aadhaarCareOf, setAadhaarCareOf] = useState('');
  const [aadhaarDob, setAadhaarDob] = useState('');

  const debouncedCompanyName = useDebouncedValue(formData.company_name, 1000);

  const debouncedBrandName = useDebouncedValue(formData.brand_name, 1000);

  // useGoogleRating({
  //   companyName: debouncedCompanyName,
  //   brandName: debouncedBrandName,
  //   setFormData,
  // });

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
    // Show loading state
    // toast.info("Validating GST number...");
    setErrors((prev) => ({ ...prev, GST: '' }));

    // Check if GST number is empty
    if (!formData.GST || formData.GST.trim() === '') {
      setErrors((prev) => ({ ...prev, GST: 'GST number cannot be empty' }));
      // toast.error('GST number cannot be empty');
      return {};
    }

    try {
      let resp = await apiRequest({
        url: '/mic-login/gstin',
        method: 'POST',
        data: { GSTIN: formData.GST },
      });

      if (resp.status === HTTP_CODE?.SUCCESS && resp?.data) {
        setGSTData(resp.data);
        setIsGSTValidated(true);

        // Add visual indicator for validated GST
        setFormData((prev) => {
          const formData = {
            ...prev,
            GSTValidated: true,
            company_name:
              resp.data.legal_name || resp.data.trade_name || prev.company_name,
          };

          if (prev.GST && prev.GST.length === 15) {
            formData.PAN = prev.GST.substring(2, 12);
          }

          return formData;
        });

        toast.success('Your GST number has been verified successfully');
        return resp.data;
      } else {
        setErrors((prev) => ({
          ...prev,
          GST: 'Invalid GST number. Please enter a valid GST number.',
        }));
        toast.error('GST validation failed. Please check and try again.');
      }
    } catch (error) {
      console.error('GST validation error:', error);
      setErrors((prev) => ({
        ...prev,
        GST: 'Error validating GST number. Please try again.',
      }));
      toast.error('Error validating GST number');
    }
    return {};
  };

  const verifyPAN = async (panValue) => {
    let resp = await apiRequest({
      url: '/mic-login/pan',
      method: 'POST',
      data: { pan: panValue || formData.PAN },
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

  const cashFreeValidations = async () => {
    // Remove PAN validation from here since it's already handled in validatePAN function
    // which is called directly from handleChange when PAN format is valid

    if (formData?.GST?.length === 15 && !isGSTValidated) {
      setErrors((prev) => ({ ...prev, GST: '' }));
      let data = await verifyGST();
      if (data?.cashfreeResponse?.valid) {
        setGSTData(data?.cashfreeResponse);
        setIsGSTValidated(true);

        // Populate address fields from GST data
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

        // toast.success('Your GST has been verified!');
      } else if (data?.cashfreeResponse && !data?.cashfreeResponse?.valid) {
        setErrors((prev) => ({ ...prev, GST: 'Invalid GST Number' }));
      }
    }

    if (formData?.bank_account_number?.length > 0 && !isBankAccountVerified) {
      setErrors((prev) => ({ ...prev, bank_account_number: '' }));
      let data = await verifyBankAccount();
      if (data?.cashfreeResponse?.status == 'VALID') {
        setBankData(data?.cashfreeResponse);
        setIsBankAccountVerified(true);
        toast.success('Your Bank Account has been verified!');
      } else if (
        data?.cashfreeResponse &&
        data?.cashfreeResponse?.status == 'INVALID'
      ) {
        setErrors((prev) => ({
          ...prev,
          bank_account_number: 'Invalid Bank Account Number',
        }));
      }
    }

    if (formData?.CIN?.length === 21 && !isCINValidated) {
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

  useEffect(() => {
    cashFreeValidations();
  }, [formData.GST, formData.CIN, formData.bank_account_number]);

  useEffect(() => {
    const getPincodeLocationDetails1 = async (pincode) => {
      if (!pincode || pincode.length !== 6) {
        setDisableCountrySelection(false);
        return;
      }

      const locationData = await getPincodeLocationDetails(pincode);

      if (locationData) {
        setFormData((prev) => ({
          ...prev,
          country: locationData.country || '',
          state: locationData.state || '',
          city: locationData.city || '',
        }));

        setDisableCountrySelection(true);
      } else {
        setDisableCountrySelection(false);
        console.log('No location data found for pincode:', pincode);
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
    // First priority: If GST is validated, disable all address-related fields
    if (
      isGSTValidated &&
      (name === 'company_name' ||
        name === 'GST' ||
        name === 'address_line_1' ||
        name === 'address_line_2' ||
        name === 'city' ||
        name === 'state' ||
        name === 'pincode' ||
        name === 'country')
    )
      return true;

    // Second priority: If pincode is entered and has auto-fetched location details
    if (
      formData.pincode &&
      formData.pincode.length === 6 &&
      disableCountrySelction &&
      (name === 'country' || name === 'state' || name === 'city')
    )
      return true;

    // Third priority: Handle geocoding-related disabling
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

  // console.log('formData of steps:', formData);

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const validateField = async (name, value) => {
    try {
      // Special case for CIN field with different company types
      if (
        name === 'CIN' &&
        ['Individual', 'sole_proprietership', 'partnership'].includes(
          formData.company_type
        )
      ) {
        // For these company types, validate as Aadhaar number
        const aadhaarPattern = vendorBaiscInfoValidation['Aadhaar'];
        if (value && !aadhaarPattern.test(value)) {
          throw new Error('Please enter a valid 12-digit Aadhaar number');
        }
      } else {
        // Normal validation for other fields
        await signupValidationSchemas[currentStep].validateAt(name, {
          ...formData,
          [name]: value,
        });
      }

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
        formData.company_type === 'sole_proprietership' ||
        formData.hasGSTnumber === 'No')
    )
      return false;
    if (fieldName === 'msme_certificate' && formData.MSME_registered !== 'Yes')
      return false;

    if (fieldName === 'GST' && formData.hasGSTnumber !== 'Yes') return false;
    if (
      (fieldName === 'gst' || fieldName === 'gst_declaration') &&
      (formData.company_type === 'sole_proprietership' ||
        formData.company_type === 'Individual' ||
        formData.hasGSTnumber === 'No')
    )
      return false;

    return true;
  };

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vendorSignupFormData', JSON.stringify(formData));
  }, [formData]);

  // Function to clear form data
  const clearFormData = useCallback(() => {
    const emptyFormData = generateInitialFormData();
    setFormData(emptyFormData);
    localStorage.removeItem('vendorSignupFormData');
    setErrors({});
    setIsPANValidated(false);
    setIsGSTValidated(false);
    setIsCINValidated(false);
    setIsBankAccountVerified(false);
    toast.success('Form data has been cleared');
  }, []);

  // Update your handleChange function
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    // Handle hasGSTnumber change to reset GST field when changed to "No"
    if (name === 'hasGSTnumber') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Reset GST field if "No" is selected
        ...(value === 'No' ? { GST: '' } : {}),
      }));
      return;
    }

    // Special handling for GST field
    if (name === 'GST') {
      // If GST is already validated, don't allow changes
      if (isGSTValidated) {
        toast.info('GST number has been validated and cannot be changed');
        return;
      }

      // Format GST input to uppercase
      const formattedValue = value.toUpperCase();

      // Only allow valid GST format characters
      if (formattedValue && !/^[0-9A-Z]*$/.test(formattedValue)) {
        return; // Don't update if invalid characters
      }

      // Update form with formatted value
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));

      // Validate GST format when it reaches 15 characters
      if (formattedValue.length === 15) {
        console.log('GST length is 15, validating format...');
        // Check if it matches GST pattern
        const gstPattern =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstPattern.test(formattedValue)) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Invalid GST format.',
          }));
        } else {
          // Clear format errors and trigger API validation directly
          console.log('GST format is valid, calling API validation...');
          setErrors((prev) => ({ ...prev, [name]: undefined }));

          // Direct API validation call with non-empty GST
          if (formattedValue && formattedValue.trim() !== '') {
            verifyGST();
          }
        }
      }
      return;
    }

    // Special handling for company_name field
    if (name === 'company_name' && isGSTValidated) {
      toast.info(
        'Company name has been auto-filled from GST data and cannot be changed'
      );
      return;
    }

    // Special handling for PAN field
    if (name === 'PAN') {
      // If PAN is already validated, don't allow changes
      if (isPANValidated) {
        toast.info('PAN has been validated and cannot be changed');
        return;
      }

      // Format PAN input to uppercase
      const formattedValue = value.toUpperCase();

      // Only allow valid PAN format characters (5 letters + 4 numbers + 1 letter)
      if (formattedValue && !/^[A-Z0-9]*$/.test(formattedValue)) {
        return; // Don't update if invalid characters
      }

      // Update form with formatted value
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));

      // Validate PAN format when it reaches 10 characters
      if (formattedValue.length === 10) {
        console.log('PAN length is 10, validating format...');
        // Check if it matches PAN pattern (5 letters + 4 numbers + 1 letter)
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panPattern.test(formattedValue)) {
          setErrors((prev) => ({
            ...prev,
            [name]:
              'Invalid PAN format. It should be 5 letters + 4 numbers + 1 letter',
          }));
        } else {
          // Clear format errors and trigger API validation directly
          console.log('PAN format is valid, calling API validation...');
          setErrors((prev) => ({ ...prev, [name]: undefined }));

          // Direct API validation call
          validatePAN(formattedValue);
        }
      }
      return;
    }

    if (files && files[0]) {
      let file = files[0];

      try {
        const schema = getFieldValidationSchema(name);
        await schema.validate(file);
      } catch (error) {
        toast.error(error.message);
        return; // Don't upload if validation fails
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

  const [activeSections, setActiveSections] = useState({});
  const [completedSections, setCompletedSections] = useState({});

  // Function to check if a section is completed
  const isSectionCompleted = (sectionIndex, stepIndex) => {
    const sectionKey = `${stepIndex}-${sectionIndex}`;
    return completedSections[sectionKey] || false;
  };

  // Function to check if all required fields in a section are filled
  const checkSectionCompletion = (section, stepIndex, sectionIndex) => {
    if (section.heading === 'Company details') {
      const companyType = formData.company_type;
      const hasGSTnumber = formData.hasGSTnumber;

      if (!companyType || !hasGSTnumber) {
        setCompletedSections((prev) => ({
          ...prev,
          [`${stepIndex}-${sectionIndex}`]: false,
        }));
        return false;
      }

      let requiredFields = [];

      if (companyType === 'privateltd' || companyType === 'llp') {
        requiredFields = ['PAN', 'CIN', 'company_name', 'brand_name'];
      } else if (
        companyType === 'Individual' ||
        companyType === 'sole_proprietership' ||
        companyType === 'partnership'
      ) {
        requiredFields = ['PAN', 'CIN', 'brand_name'];
        if (hasGSTnumber === 'Yes') {
          requiredFields.push('GST');
        }
      }

      const allCompanyFieldsFilled = requiredFields.every((field) => {
        return formData[field] && formData[field].toString().trim() !== '';
      });

      setCompletedSections((prev) => ({
        ...prev,
        [`${stepIndex}-${sectionIndex}`]: allCompanyFieldsFilled,
      }));

      return allCompanyFieldsFilled;
    }

    const requiredFields = section.fields.filter((field) => field.required);

    if (requiredFields.length > 0) {
      const allRequiredFilled = requiredFields.every((field) => {
        return (
          formData[field.name] && formData[field.name].toString().trim() !== ''
        );
      });

      setCompletedSections((prev) => ({
        ...prev,
        [`${stepIndex}-${sectionIndex}`]: allRequiredFilled,
      }));

      return allRequiredFilled;
    } else {
      const allOptionalFieldsFilled = section.fields.every((field) => {
        return (
          formData[field.name] && formData[field.name].toString().trim() !== ''
        );
      });

      setCompletedSections((prev) => ({
        ...prev,
        [`${stepIndex}-${sectionIndex}`]: allOptionalFieldsFilled,
      }));

      return allOptionalFieldsFilled;
    }
  };

  // Function to toggle section expansion
  const toggleSection = (stepIndex, sectionIndex, isOpen) => {
    setActiveSections((prev) => ({
      ...prev,
      [`${stepIndex}-${sectionIndex}`]: isOpen,
    }));
  };

  // Automatically open the next section when the current one is completed
  useEffect(() => {
    if (currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      for (let i = 0; i < currentStepData.sections.length; i++) {
        const sectionKey = `${currentStep}-${i}`;
        const nextSectionKey = `${currentStep}-${i + 1}`;

        // If current section is completed and next section exists
        if (
          completedSections[sectionKey] &&
          i + 1 < currentStepData.sections.length
        ) {
          // Open the next section
          setActiveSections((prev) => ({
            ...prev,
            [nextSectionKey]: true,
          }));
        }
      }
    }
  }, [completedSections, currentStep, steps]);

  // Initialize first section as open
  useEffect(() => {
    setActiveSections({ '0-0': true });
  }, []);

  // Check section completion on form data change
  useEffect(() => {
    if (currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      currentStepData.sections.forEach((section, sectionIndex) => {
        checkSectionCompletion(section, currentStep, sectionIndex);
      });
    }
  }, [formData, currentStep, steps]);

  const validatePAN = async (panValue) => {
    console.log('Validating PAN:', panValue);
    // Show loading state
    // toast.info("Validating PAN...");
    setErrors((prev) => ({ ...prev, PAN: '' }));

    try {
      let data = await verifyPAN(panValue);
      console.log('PAN validation response:', data);

      if (data?.cashfreeResponse?.valid) {
        setPANData(data?.cashfreeResponse);
        setIsPANValidated(true);

        // Add visual indicator for validated PAN
        setFormData((prev) => ({
          ...prev,
          PANValidated: true,
        }));

        if (
          formData?.company_type === 'Individual' ||
          formData?.company_type === 'sole_proprietership' ||
          formData?.company_type === 'partnership'
        ) {
          let name = data?.cashfreeResponse?.registered_name;
          if (name) {
            setFormData((prev) => ({
              ...prev,
              contact_person_name: name,
            }));
          }
        }
        toast.success('Your PAN has been verified successfully');
      } else if (
        data?.cashfreeResponse &&
        data?.cashfreeResponse?.valid === false
      ) {
        setErrors((prev) => ({
          ...prev,
          PAN: 'Invalid PAN. Please enter a valid PAN number.',
        }));
        toast.error('PAN validation failed. Please check and try again.');
      } else {
        setErrors((prev) => ({
          ...prev,
          PAN: 'PAN validation failed. Please try again.',
        }));
      }
    } catch (error) {
      console.error('PAN validation error:', error);
      setErrors((prev) => ({
        ...prev,
        PAN: 'Error validating PAN. Please try again.',
      }));
      toast.error('Error validating PAN');
    }
  };

  const requestAadhaarOtp = async () => {
    try {
      const aadhaarNumber = formData.CIN;
      if (!aadhaarNumber || aadhaarNumber.length !== 12) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return false;
      }

      setIsVerifying(true);
      setOtpMessage('Requesting OTP...');

      console.log('Requesting Aadhaar OTP for:', aadhaarNumber);

      // Direct API call to Cashfree
      const response = await fetch(
        'https://cashfree.com/verification/offline-aadhaar/otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': 'CF925547D0LNAJVBL13C73BKMVN0',
            'x-client-secret':
              'cfsk_ma_prod_25a9fd685a0a745c9f735c5bf01f1a74_73af97a2',
          },
          body: JSON.stringify({
            aadhaar_number: aadhaarNumber,
          }),
        }
      );

      const data = await response.json();
      console.log('Aadhaar OTP response:', data);

      if (response.ok && data.request_id) {
        setOtpMessage('OTP sent successfully to your registered mobile number');
        localStorage.setItem('aadhaar_request_id', data.request_id);
        setIsVerifying(false);
        return true;
      } else {
        setOtpMessage('');
        toast.error(data.message || 'Failed to send OTP. Please try again.');
        setIsVerifying(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting Aadhaar OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      setIsVerifying(false);
      return false;
    }
  };

  const handleOtpVerify = async () => {
    setIsVerifying(true);
    try {
      const requestId = localStorage.getItem('aadhaar_request_id');
      if (!requestId) {
        toast.error('OTP request expired. Please try again.');
        setIsVerifying(false);
        setShowOtpModal(false);
        return;
      }

      if (!otp || otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        setIsVerifying(false);
        return;
      }

      console.log('Verifying Aadhaar OTP:', otp);
      console.log('Using request ID:', requestId);

      // Direct API call to Cashfree
      const response = await fetch(
        'https://cashfree.com/verification/offline-aadhaar/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': 'CF925547D0LNAJVBL13C73BKMVN0',
            'x-client-secret':
              'cfsk_ma_prod_25a9fd685a0a745c9f735c5bf01f1a74_73af97a2',
          },
          body: JSON.stringify({
            request_id: requestId,
            otp: otp,
          }),
        }
      );

      const data = await response.json();
      console.log('Aadhaar OTP verification response:', data);

      if (response.ok && data.verification_status === 'SUCCESS') {
        setOtpMessage('OTP Verified Successfully!');

        setAadhaarCareOf(data.care_of || '');
        setAadhaarDob(data.dob || '');

        setFormData((prev) => ({
          ...prev,
          address_line_1: data.address || '',
          pincode: data.split_address?.pincode
            ? String(data.split_address.pincode)
            : '',
        }));

        toast.success('Address and Pincode auto-filled from Aadhaar');

        setTimeout(() => {
          setIsAadhaarVerified(true);
          setShowOtpModal(false);
          localStorage.removeItem('aadhaar_request_id');
        }, 1000);
      } else {
        toast.error(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying Aadhaar OTP:', error);
      toast.error('Error verifying OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    currentStep,
    partnerInfo: toJS(appStore.partnerInfo),
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
    isCINValidated,
    setIsCINValidated,
    isBankAccountVerified,
    setIsBankAccountVerified,
    sameAsAbove,
    setSameAsAbove,
    sameAsContactPerson,
    setSameAsContactPerson,
    disableCountrySelction,
    setDisableCountrySelection,
    isAadhaarVerified,
    setIsAadhaarVerified,
    showOtpModal,
    setShowOtpModal,
    otp,
    setOtp,
    handleOtpVerify,
    requestAadhaarOtp,
    aadhaarCareOf,
    aadhaarDob,
    otpMessage,
    setOtpMessage,
    isVerifying,
    setIsVerifying,

    // all your actions:
    handleChange,
    handleNext,
    handleBack,
    handleSubmit,
    toggleSection,
    isSectionCompleted,
    handleDisable,
    handleOptions,
    isFieldRequired,
    validateField,
    handleLogout,
    clearFormData, // Added clear form data function
  };
}
