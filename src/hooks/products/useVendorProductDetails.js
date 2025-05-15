import React, { useState, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  loadOnlyCountries,
  loadAllIndianCities,
  loadIndianStates,
} from '../../utils/geocoding';

import { hsnCodeMapping, gstRateMapping } from '../../utils/productsCodes';

import { ProfileStatuses } from '../../utils/constants';

import {
  validateField,
  validateForm,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  MAX_MEDIA_SIZE,
} from '../../utils/StepVendorProductDetails';

import { toJS } from 'mobx';
import { callGeminiRefineAPI } from '../../utils/geminiAI';

export const useVendorProductDetails = (appStore) => {
  const navigate = useNavigate();
  const partnerInfo = toJS(appStore.getPartnerInfo);

  const company_name = partnerInfo?.company_name;
  const company_website = partnerInfo?.website;

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

  const [loading, setLoading] = useState(false);
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

  const fetchStates = () => {
    const states = loadIndianStates();
    setStates(states);
  };

  const fetchCities = () => {
    const indianCities = loadAllIndianCities();
    setCities(indianCities);
  };
  const fetchCountries = () => {
    const countriesList = loadOnlyCountries();
    setCountries(countriesList);
  };

  useEffect(() => {
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
    const gstRate = partnerInfo?.GST
      ? gstRateMapping[selectedCategory] || ''
      : '0';
    setCurrentForm((prev) => ({
      ...prev,
      category: selectedCategory,
      formData: {
        ...prev.formData,
        hsn_code: hsnCodeMapping[selectedCategory] || '',
        gst_rate: partnerInfo?.GST
          ? gstRateMapping[selectedCategory] || ''
          : '0',
        currency: 'INR',
      },
    }));
  };

  const handleProductChange = async (e, categoryIndex, productIndex) => {
    const { name, value, type, files } = e.target;
    if (name === 'hsn_code') {
      return;
    }
    if (name === 'gst_rate') {
      return;
    }

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
      updatedFormData.price = updatedFormData.price || 0;
      updatedFormData.discount = updatedFormData.discount || 0;
      updatedFormData.final_price = updatedFormData.final_price || 0;
      const product = updatedCategories[categoryIndex].products[productIndex];

      product.formData[name] = type === 'file' ? files[0] : value;

      if (name === 'price' || name === 'discount') {
        const price = parseFloat(product.formData['price']) || 0;
        const discount = parseFloat(product.formData['discount']) || 0;
        const finalPrice = price - (price * discount) / 100;
        product.formData['final_price'] = finalPrice >= 0 ? finalPrice : 0;

        product.formData['price'] = price || 0;
        product.formData['discount'] = discount || 0;
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

      const savedFormData = {
        ...product.formData,

        product_images: product.formData.product_images
          ? [...product.formData.product_images]
          : [],
        product_videos: product.formData.product_videos || null,
        refund_policy_media: product.formData.refund_policy_media || null,
      };

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

      const relevantFields = fieldMap[category] || [];
      relevantFields.forEach((field) => {
        savedFormData[field] = product.formData[field] || '';
      });

      savedFormData.product_images = savedFormData.product_images.map(
        (file) => ({
          id: file.id || null,
          preview:
            file instanceof File
              ? URL.createObjectURL(file)
              : filePreviewMap.images[file.id],
          file: file instanceof File ? file : null,
          name: file.name || `Image ${Date.now()}`,
          size: file.size,
          type: file instanceof File ? file.type : 'image',
        })
      );

      savedFormData.product_videos = savedFormData.product_videos
        ? {
            id: savedFormData.product_videos.id || null,
            preview:
              savedFormData.product_videos instanceof File
                ? URL.createObjectURL(savedFormData.product_videos)
                : filePreviewMap.videos[savedFormData.product_videos.id],
            file:
              savedFormData.product_videos instanceof File
                ? savedFormData.product_videos
                : null,
            name: savedFormData.product_videos.name || `Video ${Date.now()}`,
            size: savedFormData.product_videos.size,
            type: 'video',
          }
        : null;

      if (
        savedFormData.refund_policy === 'false' &&
        !savedFormData.refund_policy_media?.id
      ) {
        toast.error(
          'Please upload a refund policy file if you have your own policy.'
        );
        return;
      }

      savedFormData.refund_policy = product.formData.refund_policy || null;
      savedFormData.refund_policy_media = product.formData.refund_policy_media
        ? {
            id: product.formData.refund_policy_media.id,
            name: product.formData.refund_policy_media.name,
          }
        : null;

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
          toast.error(`${file.name} must be JPG, JPEG, or PNG`);
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
      } else if (fieldName === 'refund_policy_media') {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} exceeds 5MB limit`);
          return false;
        }
        if (
          ![
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
          ].includes(file.type)
        ) {
          toast.error(
            `${file.name} must be a PDF, DOC, DOCX, JPG, or PNG file`
          );
          return false;
        }
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (fieldName === 'product_images') {
      const existingFiles =
        categoryIndex !== undefined
          ? categories[categoryIndex].products[productIndex].formData[
              fieldName
            ] || []
          : currentForm.formData[fieldName] || [];

      if (existingFiles.length + validFiles.length > 5) {
        toast.error('You can upload a maximum of 5 images.');
        return;
      }
    }

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

      setCropperImage({
        src: URL.createObjectURL(validFiles[0]),
        file: validFiles[0],
      });
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

    if (fieldName === 'refund_policy_media') {
      if (categoryIndex !== undefined) {
        const updatedCategories = [...categories];
        const product = updatedCategories[categoryIndex].products[productIndex];

        product.formData[fieldName] = {
          id: Date.now(),
          name: validFiles[0].name,
          file: validFiles[0],
        };
        setCategories(updatedCategories);
      } else {
        setCurrentForm((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            [fieldName]: {
              id: Date.now(),
              name: validFiles[0].name,
              file: validFiles[0],
            },
          },
        }));
      }
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
          id: response.id,
          name: validFiles[index].name,
          preview: URL.createObjectURL(validFiles[index]),
        }));

      if (!uploadedFiles.length) {
        // Clear invalid file from UI state
        if (categoryIndex !== undefined) {
          const updatedCategories = [...categories];
          const product =
            updatedCategories[categoryIndex].products[productIndex];
          product.formData[fieldName] = null;
          setCategories(updatedCategories);
        } else {
          setCurrentForm((prev) => ({
            ...prev,
            formData: {
              ...prev.formData,
              [fieldName]: null,
            },
          }));
        }

        toast.error('Failed to upload files. Please try again.');
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

          product.formData[fieldName] = { id: uploadedFiles[0].id };
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

      if (fieldName === 'refund_policy_media') {
        if (categoryIndex !== undefined) {
          const updatedCategories = [...categories];
          const product =
            updatedCategories[categoryIndex].products[productIndex];

          product.formData[fieldName] = {
            id: uploadedFiles[0].id,
            name: uploadedFiles[0].name,
          };

          setCategories(updatedCategories);
        } else {
          setCurrentForm((prev) => ({
            ...prev,
            formData: {
              ...prev.formData,
              [fieldName]: {
                id: uploadedFiles[0].id,
                name: uploadedFiles[0].name,
              },
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
      // console.log('Crop complete and file uploaded successfully!');
    } catch (error) {
      console.error('Error during cropping/upload process:', error);
      toast.error('Failed to upload cropped image. Please try again.');
    }
  };

  const handleCroppedImage = (croppedBlob) => {
    if (!croppedBlob) {
      toast.error('Error cropping image. Please try again.');
      return;
    }

    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
      type: 'image/jpeg',
    });

    const { categoryIndex, productIndex, fieldName } = currentFileInfo;

    handleFileUpload([croppedFile], fieldName, categoryIndex, productIndex);

    setCropperImage(null); //  Close the cropper
    setCurrentFileInfo(null); // Reset file info
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
          fieldName === 'product_videos' || fieldName === 'refund_policy_media'
            ? product[fieldName]
            : product[fieldName][index];
      } else {
        const formData = currentForm.formData;
        category = currentForm.category;

        fileToDelete =
          fieldName === 'product_videos' || fieldName === 'refund_policy_media'
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
        } else if (
          fieldName === 'product_videos' ||
          fieldName === 'refund_policy_media'
        ) {
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
          } else if (
            fieldName === 'product_videos' ||
            fieldName === 'refund_policy_media'
          ) {
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

      // console.log('📝 Product being added:', currentForm.formData);
      // console.log(
      //   '📦 Package inside formData before saving:',
      //   currentForm.formData.package
      // );

      if (['Career counselling', 'Tutoring'].includes(currentForm.category)) {
        const pkg = currentForm.formData?.package?.[0]; // take the first package
        if (!pkg?.pricing_type || !pkg?.package_duration) {
          toast.error(
            'Fill All input fields with Pricing Type, Package Duration and save it in Package Details.'
          );
          return;
        }
      }

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

  const prepareFormDataFromCurrentForm = () => {
    const formData = currentForm.formData;
    if (!formData || Object.keys(formData).length === 0) {
      toast.error('No valid product to submit. Please enter product details.');
      return null;
    }

    const normalizedData = normalizeFields(formData);

    if (normalizedData.discipline === 'Others') {
      normalizedData.discipline = formData.custom_discipline?.trim() || '';
    }
    delete normalizedData.custom_discipline;

    const processedData = {
      ...normalizedData,
      category: currentForm.category,
      company_name: partnerInfo?.company_name || '',
      company_website: partnerInfo?.website || '',
      google_reviews: partnerInfo?.google_rating || 0, // (number)
      google_rating_url: partnerInfo?.google_rating_url || '', // (string)
      status: 'published',
      refund_policy:
        formData.refund_policy === 'true'
          ? true
          : formData.refund_policy === 'false'
          ? false
          : null,
      refund_policy_media:
        formData.refund_policy === 'false' && formData.refund_policy_media?.id
          ? { id: formData.refund_policy_media.id }
          : null,
      product_images: formData.product_images
        ? formData.product_images.map((img) => ({ id: img.id }))
        : [],
      product_videos: formData.product_videos?.id
        ? { id: formData.product_videos.id }
        : null,
    };

    if (currentForm.category !== 'Study Finance') {
      processedData.price = formData.price || 0;
      processedData.discount = formData.discount || 0;
      processedData.final_price = formData.final_price || 0;
    }
    if (processedData.refund_policy !== false) {
      delete processedData.refund_policy_media;
    }

    if (!processedData.product_images.length) {
      delete processedData.product_images;
    }
    if (!processedData.product_videos) {
      delete processedData.product_videos;
    }

    const requestBody = {
      partner_id: partnerInfo.id,
      products_details: [processedData],
    };

    //  console.log to check the single product submission body
    console.log(
      'Final Request Body for Single Product:',
      JSON.stringify(requestBody, null, 2)
    );

    return requestBody;
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let formData;

      if (
        currentForm.category &&
        Object.keys(currentForm.formData).length > 0
      ) {
        console.log(
          'Submitting only entered product without adding to categories...'
        );

        if (
          currentForm.category &&
          ['Career counselling', 'Tutoring'].includes(currentForm.category)
        ) {
          const pkg = currentForm.formData?.package?.[0]; // take the first package
          if (!pkg?.pricing_type || !pkg?.package_duration) {
            toast.error(
              'Fill All input fields with Pricing Type, Package Duration and save it in Package Details.'
            );
            setLoading(false);
            return;
          }
        }

        const validationResult = await validateForm(
          currentForm.category,
          currentForm.formData
        );

        if (
          currentForm.formData.refund_policy === 'false' &&
          (!currentForm.formData.refund_policy_media ||
            !currentForm.formData.refund_policy_media.id)
        ) {
          toast.error(
            'Upload refund policy document when selecting custom refund policy.'
          );
          setLoading(false);
          return;
        }

        if (!validationResult.isValid) {
          console.log('Validation failed:', validationResult.errors);
          setCurrentForm((prev) => ({
            ...prev,
            errors: validationResult.errors,
          }));
          toast.error('Please fill all required fields before submitting.');
          setLoading(false);
          return;
        }

        formData = prepareFormDataFromCurrentForm();
      } else {
        formData = prepareFormData();
      }

      if (!formData) {
        setLoading(false);
        return;
      }

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

        setCurrentForm({
          category: '',
          formData: {},
          errors: {},
          isOpen: true,
        });

        if (!redirectedFromDashboard) {
          appStore.setAppProperty(
            'profileStatus',
            ProfileStatuses.UNDER_REVIEW
          );
          navigate('/application-sent');
        } else {
          navigate('/home/products');
        }
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const prepareFormData = () => {
    const productsDetails = categories
      .flatMap((category) =>
        category.products.map((product) => {
          const { formData } = product;
          const normalizedData = normalizeFields(formData);

          if (normalizedData.discipline === 'Others') {
            normalizedData.discipline =
              formData.custom_discipline?.trim() || '';
          }
          delete normalizedData.custom_discipline;

          let processedData = {
            ...normalizedData,
            category: category.name,
            company_name: partnerInfo?.company_name || '',
            company_website: partnerInfo?.website || '',
            google_reviews: partnerInfo?.google_rating || 0,
            google_rating_url: partnerInfo?.google_rating_url || '',
            status: 'published',
            refund_policy:
              formData.refund_policy === 'true'
                ? true
                : formData.refund_policy === 'false'
                ? false
                : null,
            refund_policy_media:
              formData.refund_policy === 'false' &&
              formData.refund_policy_media?.id
                ? { id: formData.refund_policy_media.id }
                : null,
            product_images: formData.product_images
              ? formData.product_images.map((img) => ({ id: img.id }))
              : [],
            product_videos: formData.product_videos?.id
              ? { id: formData.product_videos.id }
              : null,
          };
          if (category.name !== 'Study Finance') {
            processedData.price = formData.price || 0;
            processedData.discount = formData.discount || 0;
            processedData.final_price = formData.final_price || 0;
          }
          if (processedData.refund_policy !== false) {
            delete processedData.refund_policy_media;
          }

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
      toast.error('No valid products to submit. Add at least one product.');
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
      'loan_interest_percentage',
      'fee_range_min',
      'travel_upto',
      'fee_range_max',
      'loan_duration',
      'loan_amount_range',
    ];

    numberFields.forEach((field) => {
      if (field in normalizedProduct) {
        normalizedProduct[field] = Number(normalizedProduct[field]);
      }
    });
    // Normalize boolean fields
    if ('refund_policy' in normalizedProduct) {
      normalizedProduct.refund_policy =
        normalizedProduct.refund_policy === 'true' ||
        normalizedProduct.refund_policy === true;
    }
    if ('scholarship_available' in normalizedProduct) {
      normalizedProduct.scholarship_available =
        normalizedProduct.scholarship_available === 'Yes';
    }
    if ('full_financing_available' in normalizedProduct) {
      normalizedProduct.full_financing_available =
        normalizedProduct.full_financing_available === 'Yes';
    }
    if (normalizedProduct.refund_policy_media) {
      normalizedProduct.refund_policy_media = {
        id: normalizedProduct.refund_policy_media.id,
      };
    }

    return normalizedProduct;
  };

  const validateProduct = (product) => {
    for (const key in product) {
      if (
        (product[key] === null ||
          product[key] === undefined ||
          product[key] === '') &&
        key !== 'company_name' &&
        key !== 'company_website' &&
        key !== 'product_images' &&
        key !== 'product_videos' &&
        key !== 'refund_policy' &&
        key !== 'google_rating_url'
      ) {
        console.error(`Validation failed for product: ${key}`);
        return false;
      }

      if (
        product.refund_policy === false &&
        (!product.refund_policy_media || !product.refund_policy_media.id)
      ) {
        console.error(
          'Validation failed: refund_policy_media is required when refund_policy is false.'
        );
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

  const handleAIRefine = async (rawInput, fieldName) => {
    const plainText = rawInput?.replace(/<[^>]*>/g, '') || '';

    if (plainText.length < 50 || plainText.length > 1000) return;

    const refinedText = await callGeminiRefineAPI(plainText);

    setCurrentForm((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [fieldName]: refinedText,
      },
    }));
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

  return {
    categories,
    setCategories,
    currentForm,
    setCurrentForm,
    setCropperImage,
    setCurrentFileInfo,
    loading,
    showMenu,
    previewMedia,
    filePreviewMap,
    setPreviewMedia,
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
  };
};
