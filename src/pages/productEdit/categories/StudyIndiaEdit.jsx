import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadAllIndianCities } from '../../../utils/geocoding';

import RichTextEditor from '../../../components/commonComponents/RichTextEditor';
import apiRequest from '../../../utils/apiRequest';
import Select from 'react-select';
import MSMECertificateIcon from '../../../assets/MSMECertificateIcon';
import { MdDelete, MdDownload } from 'react-icons/md';
import Modal from '../../../components/modals/ReusableModal';
import FilePreviewCard from '../components/FilePreviewCard';
import {
  MAX_FILE_SIZE,
  MAX_MEDIA_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '../utils/validations';
import ImageCropper from '../components/imagecropper/index';
import { toast } from 'react-toastify';

export default function StudyIndiaEdit({ product_id }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_title: '',
    service_provided_since: '',
    study_level: '',
    education_qualification: '',
    hsn_code: '',
    gst_rate: '',
    service_available_cities: '',
    service_delivery: '',
    product_description: '',
    product_unique_selling_point: '',
    price: '',
    currency: '',
    discount: '',
    final_price: '',
    // google_reviews: "",
    // google_rating_url: "",
    youtube_url: '',
    refund_policy: '',
    refund_policy_media: '',
    product_images: [],
    product_videos: [],
    status: 'published',
  });

  const [partnerId, setPartnerId] = useState(null);
  const [fetchedRefundPolicyMedia, setFetchedRefundPolicyMedia] =
    useState(null);

  const fileInputRef = useRef(null);

  const [showRefundPolicyDeleteModal, setShowRefundPolicyDeleteModal] =
    useState(false);
  const [cities, setCities] = useState([]);
  const [cropperImage, setCropperImage] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  const [fetchedProductImages, setFetchedProductImages] = useState([]);
  const [fetchedProductVideos, setFetchedProductVideos] = useState([]);

  const [uploadedProductImages, setUploadedProductImages] = useState([]);
  const [uploadedProductVideos, setUploadedProductVideos] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProductInfo = await apiRequest({
        url: '/mic-study/getProducts',
        method: 'post',
        data: [
          {
            operation: 'equals',
            data: [{ key: 'product_id', value: product_id }],
          },
        ],
      });
      if (fetchedProductInfo && fetchedProductInfo.data) {
        const product = fetchedProductInfo.data.data[0]; // Assuming we want the first product from the response
        let fetchedProductImagesIds = product?.product_images?.map(
          (img) => img.id
        );
        let fetchedProductVideosIds = product?.product_videos?.map(
          (vid) => vid.id
        );
        let fetchedRefundPolicyMediaId = product?.refund_policy_media?.id;
        setFormData({
          product_title: product.product_title || '',
          service_provided_since: product.service_provided_since || '',
          study_level: product.study_level || '',
          education_qualification: product.education_qualification || '',
          hsn_code: product.hsn_code || '',
          gst_rate: product.gst_rate || '',
          service_available_cities: product.service_available_cities || '',
          service_delivery: product.service_delivery || '',
          product_description: product.product_description || '',
          product_unique_selling_point:
            product.product_unique_selling_point || '',
          price: product.price || product.price == 0 ? product.price : null,
          currency:
            product.currency || product.currency == 0 ? product.currency : null,
          discount:
            product.discount || product.discount == 0 ? product.discount : null,
          final_price:
            product.final_price || product.final_price == 0
              ? product.final_price
              : null,
          // google_reviews:
          //     product.google_reviews || product.google_reviews == 0
          //         ? product.google_reviews
          //         : null,
          // google_rating_url: product.google_rating_url || "",
          youtube_url: product.youtube_url || '',
          refund_policy: product.refund_policy || false,
          refund_policy_media: fetchedRefundPolicyMediaId || null,
          product_images: fetchedProductImagesIds || [],
          product_videos: fetchedProductVideosIds || [],
          status: 'published',
        });

        setPartnerId(product.partner_id || '');
        setFetchedRefundPolicyMedia(product.refund_policy_media || '');
        setFetchedProductImages(product.product_images || []);
        setFetchedProductVideos(product.product_videos || []);
      }
    };
    getProducts();
    fetchCities();
  }, []);

  useEffect(() => {
    const tempPrice = parseFloat(formData.price) || 0;
    const tempDiscount = parseFloat(formData.discount) || 0;
    const tempFinalPrice = tempPrice - (tempPrice * tempDiscount) / 100;
    setFormData((prev) => ({
      ...prev,
      final_price: tempFinalPrice >= 0 ? tempFinalPrice : 0,
    }));
  }, [formData.discount, formData.price]);

  const fetchCities = () => {
    const indianCities = loadAllIndianCities();
    setCities(indianCities);
  };

  const handleMultiSelectChange = (name, options) => {
    const values = options
      ? options.map((option) => option.value).join(', ')
      : '';
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const confirmRefundPolicyFileDelete = () => {
    console.log('Yes');
    setShowRefundPolicyDeleteModal(true);
  };

  const handleRefundPolicyUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    try {
      const tempForm = new FormData();
      tempForm.append('file', files[0]);

      const response = await apiRequest({
        url: '/mic-study/upload',
        method: 'POST',
        data: tempForm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload Response:', response);

      if (response.status === 201 && response.data.id) {
        toast.success('File uploaded successfully!');
        console.log('File uploaded successfully:', response.data);
        setFormData((prev) => ({
          ...prev,
          refund_policy_media: response.data.id,
        }));
      } else {
        console.error('Upload failed');
        toast.error('Error while uploading the image!');
      }
    } catch (error) {
      console.error('Upload Error:', error.message);
      toast.error('Error while uploading the image!');
    }
  };

  const handleDeleteRefundPolicyFile = async () => {
    setShowRefundPolicyDeleteModal(false);
    let fileId = fetchedRefundPolicyMedia?.id;
    let deleteFileResp = await apiRequest({
      url: `/mic-study/deleteFile/${fileId}`,
      method: 'POST',
    });

    if (deleteFileResp?.data) {
      toast.success('File deleted successfully!');
      setFetchedRefundPolicyMedia(null);
      setFormData((prev) => ({ ...prev, refund_policy: true }));
      setFormData((prev) => ({ ...prev, refund_policy_media: null }));
    }
  };

  const handleImageDelete = async (file) => {
    let imageId = file?.id;
    let deleteFileResp = await apiRequest({
      url: `/mic-study/deleteFile/${imageId}`,
      method: 'POST',
    });

    if (deleteFileResp?.data) {
      // Remove from UI
      let tempArr = fetchedProductImages.filter((item) => item?.id != imageId);
      setFetchedProductImages(tempArr);

      // ❗️Remove from formData
      setFormData((prev) => ({
        ...prev,
        product_images: prev.product_images.filter((img) =>
          typeof img === 'object' ? img.id !== imageId : img !== imageId
        ),
      }));

      toast.success('Image deleted successfully!');
    }
  };

  const handleDeleteUploadedImage = (idx) => {
    let tempUploadedArr = [...uploadedProductImages];
    let tempIdsArr = [...formData.product_images];
    tempUploadedArr.splice(idx, 1);
    tempIdsArr.splice(idx, 1);
    setUploadedProductImages([...tempUploadedArr]);
    setFormData((prev) => ({ ...prev, product_images: tempIdsArr }));
  };

  const handleVideoDelete = async (file, role) => {
    const videoId = file?.id || formData.product_videos?.[0]?.id;

    const deleteFileResp = await apiRequest({
      url: `/mic-study/deleteFile/${videoId}`,
      method: 'POST',
    });

    if (deleteFileResp?.data) {
      toast.success('Video deleted successfully!');

      // ✅ Remove from UI
      if (role === 'partner') {
        setFetchedProductVideos((prev) =>
          prev.filter((vid) => vid.id !== videoId)
        );
      } else {
        // If it's a File object (no id), match by reference
        setUploadedProductVideos((prev) => prev.filter((vid) => vid !== file));
      }

      // ✅ Remove from formData
      setFormData((prev) => ({
        ...prev,
        product_videos: prev.product_videos.filter((v) =>
          typeof v === 'object' ? v.id !== videoId : v !== videoId
        ),
      }));
    }
  };

  const handlePreview = (file, type) => {
    const url =
      file instanceof File
        ? URL.createObjectURL(file)
        : `${import.meta.env.VITE_STRAPI_URL}${file.url}`;
    console.log(url);
    setPreviewMedia({
      url,
      type: type,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const vendorUploadedImages = fetchedProductImages;
    const adminUploadedImages = uploadedProductImages;

    if (vendorUploadedImages.length + adminUploadedImages.length == 5) {
      toast.error('Maximum of 5 images can only be uploaded!');
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
        return false;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name} must be JPG, JPEG, or PNG`);
        return false;
      }

      return true;
    });

    console.log(validFiles);

    if (validFiles.length === 0) return;

    setCropperImage({
      src: URL.createObjectURL(validFiles[0]),
      file: validFiles[0],
    });
    return;
  };

  const handleCroppedImage = (croppedBlob) => {
    if (!croppedBlob) {
      toast.error('Error cropping image. Please try again.');
      return;
    }

    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
      type: 'image/jpeg',
    });

    handleImageUpload(croppedFile);

    setCropperImage(null); //  Close the cropper
  };

  const handleImageUpload = async (file) => {
    try {
      const tempForm = new FormData();
      tempForm.append('file', file);

      const response = await apiRequest({
        url: '/mic-study/upload',
        method: 'POST',
        data: tempForm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload Response:', response);

      if (response.status === 201 && response.data.id) {
        console.log('File uploaded successfully:', response.data);
        setUploadedProductImages((prev) => [...prev, file]);
        setFormData((prev) => ({
          ...prev,
          product_images: [
            ...formData?.product_images,
            { id: response?.data?.id },
          ],
        }));
        console.log([fetchedProductImages, { id: response?.data?.id }]);
      } else {
        console.error('Upload failed');
        toast.error('Error while uploading the image!');
      }
    } catch (error) {
      console.error('Upload Error:', error.message);
      toast.error('Error while uploading the image!');
    }
  };

  const handleVideoChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    console.log(files);

    const vendorUploadedVideos = fetchedProductVideos;
    const adminUploadedVideos = uploadedProductVideos;

    if (
      (vendorUploadedVideos.length == 1 && adminUploadedVideos.length == 0) ||
      (vendorUploadedVideos.length == 0 && adminUploadedVideos.length == 1) ||
      formData?.youtube_url
    ) {
      toast.error('Only 1 video can be uploaded!');
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_MEDIA_SIZE) {
        toast.error(`Video ${file.name} exceeds 20MB limit`);
        return false;
      }
      if (file.type !== 'video/mp4') {
        toast.error(`${file.name} must be MP4 format`);
        return false;
      }
      return true;
    });

    console.log(validFiles);

    if (validFiles.length === 0) return;

    handleVideoUpload(validFiles[0]);
  };

  const handleVideoUpload = async (file) => {
    try {
      const tempForm = new FormData();
      tempForm.append('file', file);

      const response = await apiRequest({
        url: '/mic-study/upload',
        method: 'POST',
        data: tempForm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload Response:', response);

      if (response.status === 201 && response.data.id) {
        console.log('File uploaded successfully:', response.data);
        setUploadedProductVideos((prev) => [...prev, file]);
        setFormData((prev) => ({
          ...prev,
          product_videos: [
            ...formData?.product_videos,
            { id: response?.data?.id },
          ],
        }));
        toast.success('Video uploaded successfully!');
      } else {
        console.error('Upload failed');
        toast.error('Error while uploading the image!');
      }
    } catch (error) {
      console.error('Upload Error:', error.message);
      toast.error('Error while uploading the image!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitProduct = await apiRequest({
      url: `/mic-study/updateProduct/${product_id}`,
      method: 'POST',
      data: { partner_id: partnerId, product_details: formData },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (submitProduct?.data) {
      toast.success('Product updated!');
      navigate(`/home/product/${product_id}`);
    } else {
      toast.error('Error while updating the product');
    }
  };

  return (
    <div>
      <form className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Heading 1: Basic Details */}
        <header>
          <h1 className="text-center text-4xl text-purple-primary font-semibold">
            Product Edit
          </h1>
        </header>
        <section>
          <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Product Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Product Title"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.product_title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Service Provided Since
                <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.service_provided_since || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    service_provided_since: e.target.value,
                  })
                }
              >
                <option>Select Service provided since</option>
                {Array.from(
                  {
                    length: new Date().getFullYear() - 1700 + 1,
                  },
                  (_, i) => (new Date().getFullYear() - i).toString()
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Study Level
                <span className="text-red-500">*</span>
              </label>
              <select
                name="study_level"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.study_level || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    study_level: e.target.value,
                  })
                }
              >
                <option>Select Study level</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Education Qualification
              </label>
              <input
                type="text"
                placeholder="Enter Education qualification"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.education_qualification || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education_qualification: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">HSN Code</label>
              <input
                type="text"
                placeholder="Enter HSN Code"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.hsn_code || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hsn_code: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">GST Rate</label>
              <input
                type="text"
                placeholder="Enter GST Rate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.gst_rate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gst_rate: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Heading 2: Service Locations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Service Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Cities Where Service is Available
                <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                name="service_available_cities"
                options={cities}
                value={formData?.service_available_cities
                  ?.split(', ')
                  ?.filter(Boolean)
                  ?.map((value) => ({ value, label: value }))}
                onChange={(options) =>
                  handleMultiSelectChange('service_available_cities', options)
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Service Delivery
                <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                name="service_delivery"
                options={[
                  { value: 'Online', label: 'Online' },
                  { value: 'Physical', label: 'Physical' },
                ]}
                value={formData?.service_delivery
                  ?.split(', ')
                  ?.filter(Boolean)
                  ?.map((value) => ({ value, label: value }))}
                onChange={(options) =>
                  handleMultiSelectChange('service_delivery', options)
                }
              />
            </div>
          </div>
        </section>

        {/* Heading 3: Additional Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2">
                Product Description
                <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.product_description || ''}
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_description: content,
                  }))
                }
                placeholder={'Enter Product Description'}
              />
              <p className="text-xs text-gray-500 mt-1">
                50 to 1000 characters
              </p>
            </div>
            <div>
              <label className="block font-medium mb-2">
                Unique Selling Proposition
                <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.product_unique_selling_point || ''}
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_unique_selling_point: content,
                  }))
                }
                placeholder={'Enter Product Unique Selling Point'}
              />
              <p className="text-xs text-gray-500 mt-1">
                50 to 1000 characters
              </p>
            </div>
          </div>
        </section>

        {/* Heading 4: Pricing */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                type="text"
                placeholder="Enter Price"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Currency</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currency: e.target.value,
                  })
                }
              >
                <option>Select Currency</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                {/* Add currency options dynamically here */}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Discount</label>
              <input
                type="text"
                placeholder="Enter Discount"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Final Price</label>
              <input
                disabled
                type="text"
                placeholder="Enter Final price"
                className="w-full border rounded-lg px-3 py-2 disabled:cursor-not-allowed"
                value={formData.final_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    final_price: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Heading 5: Marketing Materials */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Marketing Materials</h2>
          <div className="space-y-4">
            {/* <input
                            name="google_reviews"
                            type="text"
                            placeholder="Enter Google reviews/rating"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.google_reviews}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    google_reviews: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Enter link for Google rating"
                            className="w-full border rounded-lg px-3 py-2"
                            value={formData.google_rating_url || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    google_rating_url: e.target.value,
                                })
                            }
                        /> */}
            <div className="flex gap-2">
              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="uploadedProductImages"
                  id="imageUpload"
                  onChange={(e) => handleImageChange(e)}
                  accept={'image/*'}
                  multiple
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
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
                  <p className="text-purple-primary text-xs">Max 5MB</p>
                  {/* Upload limit text */}
                  <p className="text-gray-500 text-xs mt-1">
                    Up to 5 images are accepted.
                  </p>
                </label>
              </div>

              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="uploadedProductVideos"
                  id="videoUpload"
                  onChange={(e) => handleVideoChange(e)}
                  accept={'video/*'}
                  multiple={false}
                  className="hidden"
                />
                <label
                  htmlFor="videoUpload"
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
                  <p className="text-purple-primary text-xs">Max 5MB</p>
                  {/* Upload limit text */}
                  <p className="text-gray-500 text-xs mt-1">
                    Only 1 video is accepted.
                  </p>
                </label>
              </div>
            </div>
            {/* Preview section */}
            {uploadedProductImages.length > 0 && (
              <div>
                <h2 className="text-md font-semibold mt-10">
                  Newly Uploaded Images
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(uploadedProductImages || []).map((file, idx) => (
                    <FilePreviewCard
                      key={file.id || idx}
                      file={file}
                      mediaType="image"
                      onPreview={() => handlePreview(file, 'image')}
                      onDelete={() => handleDeleteUploadedImage(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
            {uploadedProductVideos.length > 0 && (
              <div>
                <h2 className="text-md font-semibold mt-10">
                  Newly Uploaded Video
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(uploadedProductVideos || []).map((file, idx) => (
                    <FilePreviewCard
                      key={file.id || idx}
                      file={file}
                      mediaType="video"
                      onPreview={() => handlePreview(file, 'video')}
                      onDelete={() => handleVideoDelete(file, 'partner')}
                    />
                  ))}
                </div>
              </div>
            )}
            {fetchedProductImages?.length > 0 && (
              <div>
                <h2 className="text-md font-semibold mt-10">
                  Partner Uploaded Images
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(fetchedProductImages || []).map((file, idx) => (
                    <FilePreviewCard
                      key={file.id || idx}
                      file={file}
                      mediaType="image"
                      onPreview={() => handlePreview(file, 'image')}
                      onDelete={() => handleImageDelete(file)}
                    />
                  ))}
                </div>
              </div>
            )}
            {fetchedProductVideos?.length > 0 && (
              <div>
                <h2 className="text-md font-semibold mt-10">
                  Partner Uploaded Video
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(fetchedProductVideos || []).map((file, idx) => (
                    <FilePreviewCard
                      key={file.id || idx}
                      file={file}
                      mediaType="video"
                      onPreview={() => handlePreview(file, 'video')}
                      onDelete={() => handleVideoDelete(file, 'partner')}
                    />
                  ))}
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Enter YouTube Video URL for product"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.youtube_url || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  youtube_url: e.target.value,
                })
              }
            />
          </div>
        </section>

        {/* Heading 6: Refund Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Refund Policy</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="refund"
                className="accent-purple-600"
                checked={formData.refund_policy === true}
                onChange={() =>
                  setFormData({
                    ...formData,
                    refund_policy: true,
                  })
                }
              />
              I agree with{' '}
              <a href="#" target="_blank" className="text-blue-600 underline">
                Xcellify's refund policy
              </a>
              .
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="refund"
                className="accent-purple-600"
                checked={formData.refund_policy === false}
                onChange={() =>
                  setFormData({
                    ...formData,
                    refund_policy: false,
                  })
                }
              />
              I have my own refund policy
            </label>
          </div>
          {formData.refund_policy === false && (
            <input
              type="file"
              className="mt-5 border rounded-md p-4 w-full"
              onChange={handleRefundPolicyUpload}
            />
          )}
          {fetchedRefundPolicyMedia?.url && (
            <div className="mt-10 flex space-x-5">
              <a
                href={`${import.meta.env?.VITE_STRAPI_URL}${
                  fetchedRefundPolicyMedia.url
                }`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-3 text-blue-primary hover:text-blue-700 text-[17px] font-semibold transition-colors"
              >
                <MSMECertificateIcon className="w-5 h-5" />
                Download Refund Policy
                <MdDownload className="text-xl" title="download" />
              </a>
              <MdDelete
                className="text-xl text-red-600 cursor-pointer "
                title="delete"
                onClick={confirmRefundPolicyFileDelete}
              />
            </div>
          )}
        </section>

        <div className="text-center pt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-primary text-white rounded-lg shadow hover:bg-purple-700 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
      {showRefundPolicyDeleteModal && (
        <Modal>
          <h1 className="text-lg font-semibold text-gray-800">
            Are you sure you want to delete this file?
          </h1>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleDeleteRefundPolicyFile}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowRefundPolicyDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
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

            {previewMedia.type === 'image' ? (
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
      {cropperImage && (
        <ImageCropper
          image={cropperImage.src} //  Pass the image source
          aspect={16 / 9}
          onCropComplete={handleCroppedImage} //  Use the new crop handler
          onCancel={() => {
            setCropperImage(null);
          }}
        />
      )}
    </div>
  );
}
