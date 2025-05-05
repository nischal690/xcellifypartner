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
import CollapsibleSection from '../components/commonComponents/CollapsibleSection';

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
import SupplierDeclarationPreview from '../components/onboardingPage/SupplierDeclarationPreview';
import { vendorBaiscInfoValidation } from '../utils/HelperFunction';

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
  const [sameAsContactPerson, setSameAsContactPerson] = useState(false);

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
    // Show loading state
    toast.info("Validating GST number...");
    setErrors((prev) => ({ ...prev, GST: '' }));
    
    // Check if GST number is empty
    if (!formData.GST || formData.GST.trim() === '') {
      setErrors((prev) => ({ ...prev, GST: 'GST number cannot be empty' }));
      toast.error('GST number cannot be empty');
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
        setFormData(prev => ({
          ...prev,
          GSTValidated: true,
          // Auto-fill company name from GST data if available
          company_name: resp.data.legal_name || resp.data.trade_name || prev.company_name
        }));
        
        toast.success('Your GST number has been verified successfully');
        return resp.data;
      } else {
        setErrors((prev) => ({ ...prev, GST: 'Invalid GST number. Please enter a valid GST number.' }));
        toast.error('GST validation failed. Please check and try again.');
      }
    } catch (error) {
      console.error("GST validation error:", error);
      setErrors((prev) => ({ ...prev, GST: 'Error validating GST number. Please try again.' }));
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
        
        toast.success('Your GST has been verified!');
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
      // Only proceed if pincode is 6 digits
      if (!pincode || pincode.length !== 6) {
        setDisableCountrySelection(false);
        return;
      }

      const pincodeLocationDetails = await getPincodeLocationDetails(pincode);
      
      if (pincodeLocationDetails) {
        // Create an object with all available location details
        const locationData = {
          country: pincodeLocationDetails.country || '',
          state: pincodeLocationDetails.state || '',
          city: pincodeLocationDetails.city || ''
        };
        
        // Update form data with all available location details at once
        setFormData((prev) => ({
          ...prev,
          ...locationData
        }));
        
        // Enable or disable country selection based on data completeness
        if (locationData.country && locationData.state && locationData.city) {
          setDisableCountrySelection(true);
          console.log("Pincode location details complete:", locationData);
        } else {
          setDisableCountrySelection(false);
          console.log("Incomplete pincode location details:", locationData);
        }
      } else {
        // When no data available
        setDisableCountrySelection(false);
        loadCountries();
        console.log("No location data found for pincode:", pincode);
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
    if (isGSTValidated && (
      name === 'company_name' ||
      name === 'GST' ||
      name === 'address_line_1' || 
      name === 'address_line_2' || 
      name === 'city' || 
      name === 'state' || 
      name === 'pincode' || 
      name === 'country'
    ))
      return true;
    
    // Second priority: If pincode is entered and has auto-fetched location details
    if (formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
        (name === 'country' || name === 'state' || name === 'city'))
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
      if (name === 'CIN' && ['Individual', 'sole_proprietership', 'partnership'].includes(formData.company_type)) {
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

  // Update your handleChange function
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    // Handle hasGSTnumber change to reset GST field when changed to "No"
    if (name === 'hasGSTnumber') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        // Reset GST field if "No" is selected
        ...(value === 'No' ? { GST: '' } : {})
      }));
      return;
    }

    // Special handling for GST field
    if (name === 'GST') {
      // If GST is already validated, don't allow changes
      if (isGSTValidated) {
        toast.info("GST number has been validated and cannot be changed");
        return;
      }
      
      // Format GST input to uppercase
      const formattedValue = value.toUpperCase();
      
      // Only allow valid GST format characters
      if (formattedValue && !/^[0-9A-Z]*$/.test(formattedValue)) {
        return; // Don't update if invalid characters
      }
      
      // Update form with formatted value
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      
      // Validate GST format when it reaches 15 characters
      if (formattedValue.length === 15) {
        console.log("GST length is 15, validating format...");
        // Check if it matches GST pattern
        const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstPattern.test(formattedValue)) {
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Invalid GST format.' 
          }));
        } else {
          // Clear format errors and trigger API validation directly
          console.log("GST format is valid, calling API validation...");
          setErrors(prev => ({ ...prev, [name]: undefined }));
          
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
      toast.info("Company name has been auto-filled from GST data and cannot be changed");
      return;
    }

    // Special handling for PAN field
    if (name === 'PAN') {
      // If PAN is already validated, don't allow changes
      if (isPANValidated) {
        toast.info("PAN has been validated and cannot be changed");
        return;
      }
      
      // Format PAN input to uppercase
      const formattedValue = value.toUpperCase();
      
      // Only allow valid PAN format characters (5 letters + 4 numbers + 1 letter)
      if (formattedValue && !/^[A-Z0-9]*$/.test(formattedValue)) {
        return; // Don't update if invalid characters
      }
      
      // Update form with formatted value
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      
      // Validate PAN format when it reaches 10 characters
      if (formattedValue.length === 10) {
        console.log("PAN length is 10, validating format...");
        // Check if it matches PAN pattern (5 letters + 4 numbers + 1 letter)
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panPattern.test(formattedValue)) {
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Invalid PAN format. It should be 5 letters + 4 numbers + 1 letter' 
          }));
        } else {
          // Clear format errors and trigger API validation directly
          console.log("PAN format is valid, calling API validation...");
          setErrors(prev => ({ ...prev, [name]: undefined }));
          
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
    const requiredFields = section.fields.filter((field) => field.required);
    const allFilled = requiredFields.every((field) => {
      // Check if the field has a value
      return formData[field.name] && formData[field.name] !== '';
    });

    if (allFilled) {
      setCompletedSections((prev) => ({
        ...prev,
        [`${stepIndex}-${sectionIndex}`]: true,
      }));
    }

    return allFilled;
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
        if (completedSections[sectionKey] && i + 1 < currentStepData.sections.length) {
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
    console.log("Validating PAN:", panValue);
    // Show loading state
    toast.info("Validating PAN...");
    setErrors((prev) => ({ ...prev, PAN: '' }));
    
    try {
      let data = await verifyPAN(panValue);
      console.log("PAN validation response:", data);
      
      if (data?.cashfreeResponse?.valid) {
        setPANData(data?.cashfreeResponse);
        setIsPANValidated(true);
        
        // Add visual indicator for validated PAN
        setFormData(prev => ({
          ...prev,
          PANValidated: true
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
        setErrors((prev) => ({ ...prev, PAN: 'Invalid PAN. Please enter a valid PAN number.' }));
        toast.error('PAN validation failed. Please check and try again.');
      } else {
        setErrors((prev) => ({ ...prev, PAN: 'PAN validation failed. Please try again.' }));
      }
    } catch (error) {
      console.error("PAN validation error:", error);
      setErrors((prev) => ({ ...prev, PAN: 'Error validating PAN. Please try again.' }));
      toast.error('Error validating PAN');
    }
  };

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
          <h1 className="text-3xl font-bold text-purple-800 mb-3">Welcome to Your Onboarding Journey</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Complete your profile to unlock all features and start connecting with potential customers.</p>

          {/* Progress Steps */}
          <div className="mt-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      index < currentStep ? 'bg-purple-600 text-white' : index === currentStep ? 'bg-purple-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-purple-600' : 'text-gray-500'}`}>
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
                  isOpen={activeSections[`${currentStep}-${sectionIndex}`] || false}
                  onToggle={(isOpen) => toggleSection(currentStep, sectionIndex, isOpen)}
                  isCompleted={isSectionCompleted(sectionIndex, currentStep)}
                  isActive={!isSectionCompleted(sectionIndex, currentStep) && activeSections[`${currentStep}-${sectionIndex}`]}
                  index={sectionIndex}
                  totalSections={steps[currentStep].sections.length}
                >
                  {currentStep === 0 && section.heading === "CEO/Owner details" && (
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
                      if (field.name === 'GST' && formData.hasGSTnumber !== 'Yes') {
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
                              errors[field.name] ? 'text-red-700' : 'text-gray-700'
                            } mb-1`}
                          >
                            {field.conditionalLabel && field.conditionalLabel[formData.company_type] 
                              ? field.conditionalLabel[formData.company_type] 
                              : field.label}
                            {isFieldRequired(field.name) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {(field.type === 'text' || field.type === 'url' || field.type === 'email' || field.type === 'mobile') && (
                            <div className="relative">
                              <input
                                type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : field.type === 'mobile' ? 'tel' : 'text'}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={handleDisable(field.name) || (field.name === 'PAN' && isPANValidated)}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                  errors[field.name]
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : field.name === 'PAN' && isPANValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'GST' && isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'company_name' && isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : (isGSTValidated && (
                                        field.name === 'address_line_1' || 
                                        field.name === 'address_line_2' || 
                                        field.name === 'city' || 
                                        field.name === 'state' || 
                                        field.name === 'pincode' || 
                                        field.name === 'country'
                                      ))
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : (formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                        (field.name === 'country' || field.name === 'state' || field.name === 'city'))
                                    ? 'border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                                } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  (field.name === 'PAN' && isPANValidated) || 
                                  (field.name === 'GST' && isGSTValidated) || 
                                  (field.name === 'company_name' && isGSTValidated) ||
                                  (isGSTValidated && (
                                    field.name === 'address_line_1' || 
                                    field.name === 'address_line_2' || 
                                    field.name === 'city' || 
                                    field.name === 'state' || 
                                    field.name === 'pincode' || 
                                    field.name === 'country'
                                  )) ||
                                  (formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                    (field.name === 'country' || field.name === 'state' || field.name === 'city'))
                                  ? 'pr-10' : ''
                                }`}
                                placeholder={
                                  field.name === 'CIN' && ['Individual', 'sole_proprietership', 'partnership'].includes(formData.company_type)
                                    ? 'Enter 12-digit Aadhaar number'
                                    : field.name === 'CIN'
                                    ? 'Enter 21-character CIN'
                                    : field.name === 'PAN'
                                    ? 'Format: ABCDE1234F'
                                    : `Enter ${field.label.toLowerCase()}`
                                }
                              />
                              {(field.name === 'PAN' && isPANValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'GST' && isGSTValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'company_name' && isGSTValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'PAN' && isPANValidated) && (
                                <p className="mt-1 text-sm text-green-600">PAN verified successfully</p>
                              )}
                              {(field.name === 'GST' && isGSTValidated) && (
                                <p className="mt-1 text-sm text-green-600">GST verified successfully</p>
                              )}
                              {(field.name === 'company_name' && isGSTValidated) && (
                                <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
                              )}
                              {(isGSTValidated && (
                                field.name === 'address_line_1' || 
                                field.name === 'address_line_2' || 
                                field.name === 'city' || 
                                field.name === 'state' || 
                                field.name === 'pincode' || 
                                field.name === 'country'
                              )) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(isGSTValidated && (
                                field.name === 'address_line_1' || 
                                field.name === 'address_line_2' || 
                                field.name === 'city' || 
                                field.name === 'state' || 
                                field.name === 'pincode' || 
                                field.name === 'country'
                              )) && (
                                <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
                              )}
                              {(formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                (field.name === 'country' || field.name === 'state' || field.name === 'city')) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                (field.name === 'country' || field.name === 'state' || field.name === 'city')) && (
                                <p className="mt-1 text-sm text-blue-600">Auto-filled from Pincode</p>
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
                              fileType={fileUploadInfo[field.name]?.fileType || ''}
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
                  isOpen={activeSections[`${currentStep}-${sectionIndex}`] || false}
                  onToggle={(isOpen) => toggleSection(currentStep, sectionIndex, isOpen)}
                  isCompleted={isSectionCompleted(sectionIndex, currentStep)}
                  isActive={!isSectionCompleted(sectionIndex, currentStep) && activeSections[`${currentStep}-${sectionIndex}`]}
                  index={sectionIndex}
                  totalSections={steps[currentStep].sections.length}
                >
                  {section.heading === "CEO/Owner details" && (
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
                      if (field.name === 'GST' && formData.hasGSTnumber !== 'Yes') {
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
                              errors[field.name] ? 'text-red-700' : 'text-gray-700'
                            } mb-1`}
                          >
                            {field.conditionalLabel && field.conditionalLabel[formData.company_type] 
                              ? field.conditionalLabel[formData.company_type] 
                              : field.label}
                            {isFieldRequired(field.name) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {(field.type === 'text' || field.type === 'url' || field.type === 'email' || field.type === 'mobile') && (
                            <div className="relative">
                              <input
                                type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : field.type === 'mobile' ? 'tel' : 'text'}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={handleDisable(field.name) || (field.name === 'PAN' && isPANValidated)}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                  errors[field.name]
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : field.name === 'PAN' && isPANValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'GST' && isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : field.name === 'company_name' && isGSTValidated
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : (isGSTValidated && (
                                        field.name === 'address_line_1' || 
                                        field.name === 'address_line_2' || 
                                        field.name === 'city' || 
                                        field.name === 'state' || 
                                        field.name === 'pincode' || 
                                        field.name === 'country'
                                      ))
                                    ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
                                    : (formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                        (field.name === 'country' || field.name === 'state' || field.name === 'city'))
                                    ? 'border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                                } focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 ${
                                  (field.name === 'PAN' && isPANValidated) || 
                                  (field.name === 'GST' && isGSTValidated) || 
                                  (field.name === 'company_name' && isGSTValidated) ||
                                  (isGSTValidated && (
                                    field.name === 'address_line_1' || 
                                    field.name === 'address_line_2' || 
                                    field.name === 'city' || 
                                    field.name === 'state' || 
                                    field.name === 'pincode' || 
                                    field.name === 'country'
                                  )) ||
                                  (formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                    (field.name === 'country' || field.name === 'state' || field.name === 'city'))
                                  ? 'pr-10' : ''
                                }`}
                                placeholder={
                                  field.name === 'CIN' && ['Individual', 'sole_proprietership', 'partnership'].includes(formData.company_type)
                                    ? 'Enter 12-digit Aadhaar number'
                                    : field.name === 'CIN'
                                    ? 'Enter 21-character CIN'
                                    : field.name === 'PAN'
                                    ? 'Format: ABCDE1234F'
                                    : `Enter ${field.label.toLowerCase()}`
                                }
                              />
                              {(field.name === 'PAN' && isPANValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'GST' && isGSTValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'company_name' && isGSTValidated) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(field.name === 'PAN' && isPANValidated) && (
                                <p className="mt-1 text-sm text-green-600">PAN verified successfully</p>
                              )}
                              {(field.name === 'GST' && isGSTValidated) && (
                                <p className="mt-1 text-sm text-green-600">GST verified successfully</p>
                              )}
                              {(field.name === 'company_name' && isGSTValidated) && (
                                <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
                              )}
                              {(isGSTValidated && (
                                field.name === 'address_line_1' || 
                                field.name === 'address_line_2' || 
                                field.name === 'city' || 
                                field.name === 'state' || 
                                field.name === 'pincode' || 
                                field.name === 'country'
                              )) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(isGSTValidated && (
                                field.name === 'address_line_1' || 
                                field.name === 'address_line_2' || 
                                field.name === 'city' || 
                                field.name === 'state' || 
                                field.name === 'pincode' || 
                                field.name === 'country'
                              )) && (
                                <p className="mt-1 text-sm text-green-600">Auto-filled from GST data</p>
                              )}
                              {(formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                (field.name === 'country' || field.name === 'state' || field.name === 'city')) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {(formData.pincode && formData.pincode.length === 6 && disableCountrySelction && 
                                (field.name === 'country' || field.name === 'state' || field.name === 'city')) && (
                                <p className="mt-1 text-sm text-blue-600">Auto-filled from Pincode</p>
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
                              fileType={fileUploadInfo[field.name]?.fileType || ''}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H7a1 1 0 110-2h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  type="submit"
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Submit
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 10.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
    </div>
  );
};

export default MultiStepVendorSignupPage;
