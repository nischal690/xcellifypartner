import React, { useState, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

import { ProductDetailsData } from '../utils/StepVendorProductDetails';
import {
  loadCountries,
  loadAllIndianCities,
  loadIndianStates,
} from '../utils/geocoding';

import { hsnCodeMapping } from '../utils/productsCodes';

import { AuthStatuses, ProfileStatuses } from '../utils/constants';

import ImageCropper from '../components/commonComponents/ImageCropper';
import { ErrorBoundary } from '../components/ErrorBoundry';
import {
  validateField,
  validateForm,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  MAX_MEDIA_SIZE,
} from '../utils/StepVendorProductDetails';
import { useStore } from '../stores';
import { toJS } from 'mobx';

const StepVendorProductDetailsPage = () => {
  const { appStore } = useStore();
  const navigate = useNavigate();
  const partnerInfo = toJS(appStore.getPartnerInfo);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const origin = params.get('origin');
  let redirectedFromDashboard = false;
  if (origin && origin === 'dashboard') {
    redirectedFromDashboard = true;
  }
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [currentForm, setCurrentForm] = useState({
    category: '',
    formData: {},
    errors: {},
    isOpen: true,
  });

  const [showMenu, setShowMenu] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  const menuRef = useRef(null);

  const [filePreviewMap, setFilePreviewMap] = useState({
    images: {},
    videos: {},
  });

  const [uploadingFiles, setUploadingFiles] = useState({});

  const [cropperImage, setCropperImage] = useState(null);
  const [currentFileInfo, setCurrentFileInfo] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const OptionCountries = [
    'US',
    'Canada',
    'UK',
    'Europe',
    'Australia',
    'Asia',
  ].map((country) => ({
    value: country,
    label: country,
  }));

  const loadServiceDelivary = ['Online', 'Physical'].map((service) => ({
    value: service,
    label: service,
  }));

  const loadStudyLevel = ['UG', 'PG'].map((level) => ({
    value: level,
    label: level,
  }));

  const loadTutorStudyLevel = [
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    'Graduation',
  ].map((level) => ({
    value: level,
    label: level,
  }));

  const loadModeOfTeaching = [
    'Online(1 on 1)',
    'Online(group)',
    'Physical(1 on 1)',
    'Physical(group)',
    'Home Visits',
  ].map((mode) => ({
    value: mode,
    label: mode,
  }));

  const loadSubjects = [
    'Maths',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'History',
    'Geography',
  ].map((subject) => ({
    value: subject,
    label: subject,
  }));

  const loadCounsellingLevel = [
    'Under grade 6',
    '6th to 8th',
    '9th & 10th',
    '11th & 12th',
    'UG',
  ].map((level) => ({
    value: level,
    label: level,
  }));

  const loadLoanStudyLevel = ['School', 'College', 'Diploma', 'UG', 'PG'].map(
    (level) => ({
      value: level,
      label: level,
    })
  );

  const fetchStates = () => {
    const states = loadIndianStates();
    setStates(states);
  };

  const fetchCities = () => {
    const indianCities = loadAllIndianCities();
    setCities(indianCities);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      setCountries(
        OptionCountries.map((country) => ({ value: country, label: country }))
      );
    };

    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

  const toggleMenu = (fieldName) => {
    setShowMenu(showMenu === fieldName ? null : fieldName);
  };

  const handleMultiSelectChange = (
    selectedOptions,
    fieldName,
    categoryIndex,
    productIndex
  ) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value).join(', ')
      : '';

    if (categoryIndex !== undefined) {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].products[productIndex].formData[
        fieldName
      ] = values;

      validateField(
        updatedCategories[categoryIndex].products[productIndex].category,
        fieldName,
        values
      ).then(({ isValid, error }) => {
        updatedCategories[categoryIndex].products[productIndex].errors[
          fieldName
        ] = !isValid ? error : '';
        setCategories(updatedCategories);
      });
    } else {
      setCurrentForm((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          [fieldName]: values,
        },
      }));

      validateField(currentForm.category, fieldName, values).then(
        ({ isValid, error }) => {
          setCurrentForm((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              [fieldName]: !isValid ? error : '',
            },
          }));
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handlePreview = (file, fieldName) => {
    if (file.id) {
      const previewUrl =
        fieldName === 'product_images'
          ? filePreviewMap.images[file.id]
          : filePreviewMap.videos[file.id];

      setPreviewMedia({
        url: previewUrl,
        type: fieldName === 'product_images' ? 'image' : 'video',
      });
    } else {
      setPreviewMedia({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
      });
    }
  };

  const toggleAccordion = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].isOpen =
      !updatedCategories[categoryIndex].isOpen;
    setCategories(updatedCategories);
  };

  const handleProductCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCurrentForm((prev) => ({
      ...prev,
      category: selectedCategory,
      formData: {
        ...prev.formData,
        hsn_code: hsnCodeMapping[selectedCategory] || '',
      },
    }));
  };

  const handleProductChange = async (e, categoryIndex, productIndex) => {
    const { name, value, type, files } = e.target;

    if (name === 'study_destination_states' && value) {
      fetchCities(value);
    }
    if (name === 'service_available_cities' && value) {
      fetchCities(value);
    }
    if (name === 'event_location' && value) {
      fetchCities(value);
    }
    if (name === 'loan_available_countries' && value) {
      fetchStates(value);
    }

    if (categoryIndex !== undefined) {
      const updatedCategories = [...categories];
      const product = updatedCategories[categoryIndex].products[productIndex];

      product.formData[name] = type === 'file' ? files[0] : value;

      if (name === 'price' || name === 'discount') {
        const price = parseFloat(product.formData['price']) || 0;
        const discount = parseFloat(product.formData['discount']) || 0;
        const finalPrice = price - (price * discount) / 100;
        product.formData['final_price'] = finalPrice >= 0 ? finalPrice : 0;
      }

      const { isValid, error } = await validateField(
        product.category || currentForm.category,
        name,
        type === 'file' ? files[0] : value
      );

      product.errors[name] = !isValid ? error : '';

      updatedCategories[categoryIndex].products[productIndex] = product;
      setCategories(updatedCategories);
    } else {
      const updatedFormData = { ...currentForm.formData };
      updatedFormData[name] = type === 'file' ? files[0] : value;

      if (name === 'price' || name === 'discount') {
        const price = parseFloat(updatedFormData['price']) || 0;
        const discount = parseFloat(updatedFormData['discount']) || 0;
        const finalPrice = price - (price * discount) / 100;
        updatedFormData['final_price'] = finalPrice >= 0 ? finalPrice : 0;
      }

      const { isValid, error } = await validateField(
        currentForm.category,
        name,
        updatedFormData[name]
      );

      setCurrentForm((prev) => ({
        ...prev,
        formData: updatedFormData,
        errors: {
          ...prev.errors,
          [name]: !isValid ? error : '',
        },
      }));
    }
  };

  const handleSaveNestedProduct = (categoryIndex, productIndex) => {
    const updatedCategories = [...categories];
    const product = updatedCategories[categoryIndex].products[productIndex];
    const category = updatedCategories[categoryIndex].name;

    validateForm(category, product.formData).then(({ isValid, errors }) => {
      if (!isValid) {
        product.errors = errors;
        setCategories(updatedCategories);
        return;
      }

      const savedFormData = { ...product.formData };

      //  category-specific fields
      const fieldMap = {
        'Study overseas': ['study_level', 'study_destination_countries'],
        'Study India': ['study_level', 'study_destination_states'],
        Tutoring: ['study_level', 'mode_of_teaching', 'subjects'],
        'Career counselling': ['study_level', 'service_delivery'],
        'Summer courses': ['study_level', 'service_delivery'],
        'Study Finance': ['service_delivery'],
        'Loans and scholarships': [
          'loan_for_study_level',
          'loan_available_countries',
        ],
        Events: ['event_delivery', 'event_location'],
        Competitions: ['event_delivery', 'event_location'],
      };

      // Only include relevant fields for the category
      const relevantFields = fieldMap[category] || [];
      relevantFields.forEach((field) => {
        savedFormData[field] = product.formData[field] || '';
      });

      // Handle media fields which are common across categories
      savedFormData.product_images =
        product.formData.product_images?.map((file) => ({
          id: file.id || null,
          preview:
            file instanceof File
              ? URL.createObjectURL(file)
              : filePreviewMap.images[file.id],
          file: file instanceof File ? file : null,
          name: file.name || `Image ${Date.now()}`,
          size: file.size,
          type: file instanceof File ? file.type : 'image',
        })) || [];

      savedFormData.product_videos = product.formData.product_videos
        ? {
            id: product.formData.product_videos.id || null,
            preview:
              product.formData.product_videos instanceof File
                ? URL.createObjectURL(product.formData.product_videos)
                : filePreviewMap.videos[product.formData.product_videos.id],
            file:
              product.formData.product_videos instanceof File
                ? product.formData.product_videos
                : null,
            name: product.formData.product_videos.name || `Video ${Date.now()}`,
            size: product.formData.product_videos.size,
            type: 'video',
          }
        : null;

      // Update preview maps
      const newPreviewMap = {
        images: { ...filePreviewMap.images },
        videos: { ...filePreviewMap.videos },
      };

      savedFormData.product_images?.forEach((img) => {
        if (img.preview) {
          newPreviewMap.images[img.id || URL.createObjectURL(img.file)] =
            img.preview;
        }
      });

      if (savedFormData.product_videos?.preview) {
        const videoKey =
          savedFormData.product_videos.id ||
          (savedFormData.product_videos.file &&
            URL.createObjectURL(savedFormData.product_videos.file));
        newPreviewMap.videos[videoKey] = savedFormData.product_videos.preview;
      }

      setFilePreviewMap(newPreviewMap);
      product.formData = savedFormData;
      product.isOpen = false;
      setCategories(updatedCategories);
      toast.success('Product saved successfully!');
    });
  };

  const handleFileChange = (e, fieldName, categoryIndex, productIndex) => {
    const files = e.target.files;
    if (!files.length) return;

    const validFiles = Array.from(files).filter((file) => {
      if (fieldName === 'product_images') {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`Image ${file.name} exceeds 5MB limit`);
          return false;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          toast.error(`${file.name} must be JPG, JPEG or PNG`);
          return false;
        }
      } else if (fieldName === 'product_videos') {
        if (file.size > MAX_MEDIA_SIZE) {
          toast.error(`Video ${file.name} exceeds 20MB limit`);
          return false;
        }
        if (file.type !== 'video/mp4') {
          toast.error(`${file.name} must be MP4 format`);
          return false;
        }
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (fieldName === 'product_images') {
      if (categoryIndex !== undefined) {
        const updatedCategories = [...categories];
        const product = updatedCategories[categoryIndex].products[productIndex];

        product.formData[fieldName] = product.formData[fieldName] || [];

        setCurrentFileInfo({
          categoryIndex,
          productIndex,
          fieldName,
          existingFiles: product.formData[fieldName],
        });
      } else {
        setCurrentFileInfo({
          fieldName,
          existingFiles: currentForm.formData[fieldName] || [],
        });
      }

      setCropperImage(URL.createObjectURL(validFiles[0]));
      return;
    }

    if (fieldName === 'product_videos') {
      if (categoryIndex !== undefined) {
        const updatedCategories = [...categories];
        const product = updatedCategories[categoryIndex].products[productIndex];

        product.formData[fieldName] = validFiles[0];
        setCategories(updatedCategories);
      } else {
        setCurrentForm((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            [fieldName]: validFiles[0],
          },
        }));
      }

      const videoPreview = URL.createObjectURL(validFiles[0]);
      setFilePreviewMap((prev) => ({
        ...prev,
        videos: {
          ...prev.videos,
          [validFiles[0].name]: videoPreview,
        },
      }));
    }

    handleFileUpload(validFiles, fieldName, categoryIndex, productIndex);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileUpload = async (
    validFiles,
    fieldName,
    categoryIndex,
    productIndex
  ) => {
    if (!validFiles.length) return;

    const category =
      categoryIndex !== undefined
        ? categories[categoryIndex].name
        : currentForm.category;

    if (!category) {
      toast.error('Category is missing for file upload.');
      return;
    }

    const uploadKey =
      categoryIndex !== undefined
        ? `${fieldName}-${categoryIndex}-${productIndex}`
        : `${fieldName}-main-form`;

    setUploadingFiles((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const uploadPromises = validFiles.map((file) =>
        appStore.uploadFile(category, file)
      );
      const uploadResponses = await Promise.all(uploadPromises);

      const uploadedFiles = uploadResponses
        .filter((response) => response.success)
        .map((response, index) => ({
          id: response.id, // The `id` from the server
          preview: URL.createObjectURL(validFiles[index]),
        }));

      if (!uploadedFiles.length) {
        toast.error('Failed to upload files.');
        return;
      }

      setFilePreviewMap((prev) => {
        const newMap = { ...prev };
        uploadedFiles.forEach((file) => {
          if (fieldName === 'product_images') {
            newMap.images[file.id] = file.preview;
          } else if (fieldName === 'product_videos') {
            newMap.videos[file.id] = file.preview;
          }
        });
        return newMap;
      });

      if (fieldName === 'product_videos') {
        if (categoryIndex !== undefined) {
          const updatedCategories = [...categories];
          const product =
            updatedCategories[categoryIndex].products[productIndex];

          product.formData[fieldName] = {
            id: uploadedFiles[0].id,
          };
          setCategories(updatedCategories);
        } else {
          setCurrentForm((prev) => ({
            ...prev,
            formData: {
              ...prev.formData,
              [fieldName]: { id: uploadedFiles[0].id },
            },
          }));
        }
      }

      if (fieldName === 'product_images') {
        if (categoryIndex !== undefined) {
          const updatedCategories = [...categories];
          const product =
            updatedCategories[categoryIndex].products[productIndex];

          product.formData[fieldName] = [
            ...(product.formData[fieldName] || []),
            ...uploadedFiles.map((f) => ({ id: f.id })),
          ];
          setCategories(updatedCategories);
        } else {
          setCurrentForm((prev) => ({
            ...prev,
            formData: {
              ...prev.formData,
              [fieldName]: [
                ...(prev.formData[fieldName] || []),
                ...uploadedFiles.map((f) => ({ id: f.id })),
              ],
            },
          }));
        }
      }

      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles((prev) => {
        const newState = { ...prev };
        delete newState[uploadKey];
        return newState;
      });
    }
  };

  const handleCropComplete = async (croppedFile) => {
    const { categoryIndex, productIndex, fieldName } = currentFileInfo;

    try {
      await handleFileUpload(
        [croppedFile],
        fieldName,
        categoryIndex,
        productIndex
      );
      setCropperImage(null);
      setCurrentFileInfo(null);
      console.log('Crop complete and file uploaded successfully!');
    } catch (error) {
      console.error('Error during cropping/upload process:', error);
      toast.error('Failed to upload cropped image. Please try again.');
    }
  };

  const handleFileRemove = async (
    fieldName,
    index,
    categoryIndex,
    productIndex
  ) => {
    try {
      let fileToDelete;
      let category;

      if (categoryIndex !== undefined) {
        const product =
          categories[categoryIndex].products[productIndex].formData;
        category = categories[categoryIndex].name;
        fileToDelete =
          fieldName === 'product_videos'
            ? product[fieldName]
            : product[fieldName][index];
      } else {
        const formData = currentForm.formData;
        category = currentForm.category;
        fileToDelete =
          fieldName === 'product_videos'
            ? formData[fieldName]
            : formData[fieldName][index];
      }

      if (!fileToDelete?.id) {
        throw new Error('File ID not found for deletion.');
      }

      const deleteResponse = await appStore.deleteFile(
        category,
        fileToDelete.id
      );

      if (!deleteResponse.success) {
        throw new Error(deleteResponse.error || 'Failed to delete file.');
      }

      toast.success(deleteResponse.message || 'File deleted successfully!');

      if (categoryIndex !== undefined) {
        const updatedCategories = [...categories];
        const product = updatedCategories[categoryIndex].products[productIndex];

        if (fieldName === 'product_images') {
          const images = [...product.formData[fieldName]];
          images.splice(index, 1);
          product.formData[fieldName] = images;
        } else if (fieldName === 'product_videos') {
          product.formData[fieldName] = null;
        }

        setCategories(updatedCategories);
      } else {
        setCurrentForm((prev) => {
          const updatedForm = { ...prev };
          if (fieldName === 'product_images') {
            const images = [...updatedForm.formData[fieldName]];
            images.splice(index, 1);
            updatedForm.formData[fieldName] = images;
          } else if (fieldName === 'product_videos') {
            updatedForm.formData[fieldName] = null;
          }
          return updatedForm;
        });
      }

      const fileInputId =
        categoryIndex !== undefined
          ? `${fieldName}-upload-${categoryIndex}-${productIndex}`
          : `${fieldName}-upload`;
      const fileInput = document.getElementById(fileInputId);
      if (fileInput) {
        fileInput.value = '';
      }

      URL.revokeObjectURL(fileToDelete.preview || fileToDelete.file);
    } catch (error) {
      console.error('Error deleting file:', error.message);
      toast.error(error.message || 'Failed to delete file.');
    }
  };

  const handleAddProductForm = async () => {
    try {
      console.log(
        'Adding new product form for category:',
        currentForm.category
      );
      console.log('Form data:', currentForm.formData);

      const validationResult = await validateForm(
        currentForm.category,
        currentForm.formData
      );

      if (!validationResult.isValid) {
        console.log('Validation failed:', validationResult.errors);
        setCurrentForm({ ...currentForm, errors: validationResult.errors });
        return;
      }

      const updatedCategories = [...categories];
      const existingCategoryIndex = updatedCategories.findIndex(
        (cat) => cat.name === currentForm.category
      );

      const newProduct = {
        formData: currentForm.formData,
        errors: {},
        isOpen: false,
        category: currentForm.category,
      };

      if (existingCategoryIndex !== -1) {
        updatedCategories[existingCategoryIndex].products.push(newProduct);
      } else {
        updatedCategories.push({
          name: currentForm.category,
          isOpen: true,
          products: [newProduct],
        });
      }

      setCategories(updatedCategories);
      setCurrentForm({
        category: '',
        formData: {},
        errors: {},
        isOpen: true,
      });

      console.log('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = prepareFormData();

      if (!formData) return;

      console.log('Submitting with formData:', formData);

      const groupedProducts = formData.products_details.reduce(
        (acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        },
        {}
      );

      console.log('Grouped Products by Category:', groupedProducts);

      const submissionPromises = Object.entries(groupedProducts).map(
        async ([category, categoryProducts]) => {
          const categoryFormData = {
            partner_id: formData.partner_id,
            products_details: categoryProducts,
          };

          console.log(
            `Submitting products for category ${category}:`,
            categoryFormData
          );

          try {
            const { success, response, error } = await appStore.submitProducts(
              category,
              categoryFormData
            );

            if (success) {
              console.log(
                `Products for category ${category} submitted successfully.`
              );
              return { success: true, category };
            } else {
              console.error(
                `Failed to submit products for category ${category}:`,
                error || response
              );
              return { success: false, category, error };
            }
          } catch (error) {
            console.error(
              `Error submitting products for category ${category}:`,
              error.message
            );
            return { success: false, category, error: error.message };
          }
        }
      );

      const results = await Promise.all(submissionPromises);

      // Handle results
      const failedSubmissions = results.filter((result) => !result.success);
      if (failedSubmissions.length > 0) {
        toast.error(
          `Submission failed for categories: ${failedSubmissions
            .map((result) => result.category)
            .join(', ')}`
        );
      } else {
        toast.success('All products submitted successfully!');
        if (!redirectedFromDashboard) {
          appStore.setAppProperty(
            'profileStatus',
            ProfileStatuses.UNDER_REVIEW
          );
          navigate('/application-sent');
        } else navigate('/home/products');
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    }
  };

  const prepareFormData = () => {
    const productsDetails = categories
      .flatMap((category) =>
        category.products.map((product) => {
          const { formData } = product;
          const normalizedData = normalizeFields(formData);

          let processedData = {
            ...normalizedData,
            category: category.name,
            product_images: formData.product_images
              ? formData.product_images.map((img) => ({ id: img.id }))
              : [],
            product_videos: formData.product_videos?.id
              ? { id: formData.product_videos.id }
              : null,
          };

          if (!processedData.product_images.length) {
            delete processedData.product_images;
          }
          if (!processedData.product_videos) {
            delete processedData.product_videos;
          }

          return processedData;
        })
      )
      .filter(validateProduct);

    if (!productsDetails.length) {
      toast.error('No valid products to submit add atleat one');
      return null;
    }

    const requestBody = {
      partner_id: partnerInfo.id,
      products_details: productsDetails,
    };

    console.log('Final Request Body:', JSON.stringify(requestBody, null, 2));
    return requestBody;
  };

  const normalizeFields = (product) => {
    const normalizedProduct = { ...product };
    const numberFields = [
      'price',
      'discount',
      'final_price',
      'google_reviews',
      'service_provided_since',
      'counselling_duration',
      'travel_upto',
    ];

    numberFields.forEach((field) => {
      if (field in normalizedProduct) {
        normalizedProduct[field] = Number(normalizedProduct[field]);
      }
    });
    if ('scholarship_available' in normalizedProduct) {
      normalizedProduct.scholarship_available =
        normalizedProduct.scholarship_available === 'Yes';
    }
    if ('full_financing_available' in normalizedProduct) {
      normalizedProduct.full_financing_available =
        normalizedProduct.full_financing_available === 'Yes';
    }

    return normalizedProduct;
  };

  const validateProduct = (product) => {
    for (const key in product) {
      if (
        product[key] === null ||
        product[key] === undefined ||
        product[key] === ''
      ) {
        if (key === 'product_images' || key === 'product_videos') {
          continue;
        }
        console.error(`Validation failed for product: ${key}`);
        return false;
      }
    }
    return true;
  };

  const logFormData = (data) => {
    console.log('Request Data:', JSON.stringify(data, null, 2));
  };

  const handleSuccess = (response) => {
    toast.success('Products submitted successfully!', {
      position: 'top-right',
    });
    console.log('API Response:', response);
    setCategories([]);
  };

  const handleSkipNow = () => {
    // Skip submission and navigate directly
    if (!redirectedFromDashboard) {
      appStore.setAppProperty('profileStatus', ProfileStatuses.UNDER_REVIEW);
      navigate('/application-sent');
    } else {
      navigate('/home/products');
    }
    return;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const renderErrorMessage = (errors, fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  useEffect(() => {
    return () => {
      categories.forEach((category) => {
        category.products.forEach((product) => {
          if (product.formData.logo) {
            URL.revokeObjectURL(product.formData.logo);
          }
          if (product.formData.media) {
            product.formData.media.forEach((file) => {
              URL.revokeObjectURL(file);
            });
          }
        });
      });
    };
  }, []);

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

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-t-2 border-purple-500 rounded-full animate-spin"></div>
      <span className="ml-2 text-sm text-purple-500">Uploading...</span>
    </div>
  );

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
                        ) : field.name === 'hsn_code' ? (
                          <>
                            <input
                              type="text"
                              name={field.name}
                              value={product.formData[field.name] || ''}
                              readOnly
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
                                  : field.name === 'study_destination_countries'
                                  ? OptionCountries
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
              image={cropperImage}
              aspect={4 / 3}
              onCropComplete={handleCropComplete}
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
                              {field.type === 'textarea' ? (
                                <>
                                  <textarea
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
                                          (Max 20mb)
                                        </p>
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
                                          'study_destination_countries'
                                        ? OptionCountries
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
        <div className="flex justify-end gap-10 mt-9">
          <button
            type="button"
            className="w-96 px-4 py-2 bg-[#F3F1FF] text-blue-primary font-dmsans font-bold rounded-md  border border-blue-primary"
            onClick={handleAddProductForm}
          >
            Save & add product
          </button>
          <button
            type="button"
            className="h-10 w-60 ml-4 px-4 py-2 text-[#F3F1FF] font-dmsans font-bold rounded-md"
            style={{
              background: 'linear-gradient(to right, #876FFD, #6C59CA)',
            }}
            onClick={handleSkipNow}
          >
            Skip as of now
          </button>
          <button
            type="button"
            className="h-10 w-60 ml-4 px-4 py-2 text-[#F3F1FF] font-dmsans font-bold rounded-md"
            style={{
              background: 'linear-gradient(to right, #876FFD, #6C59CA)',
            }}
            onClick={handleSubmit}
          >
            Submit All Products
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
        {cropperImage && !currentFileInfo?.categoryIndex && (
          <ImageCropper
            image={cropperImage}
            aspect={16 / 9}
            onCropComplete={handleCropComplete}
            onCancel={() => {
              setCropperImage(null);
              setCurrentFileInfo(null);
            }}
          />
        )}
        {/* <ToastContainer autoClose={2000} /> */}
      </div>
    </ErrorBoundary>
  );
};

export default StepVendorProductDetailsPage;
