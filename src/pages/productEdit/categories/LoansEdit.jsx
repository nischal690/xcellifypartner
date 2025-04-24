import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  loadAllIndianCities,
  loadOnlyCountries,
} from '../../../utils/geocoding';

import RichTextEditor from '../../../components/commonComponents/RichTextEditor';

import apiRequest from '../../../utils/apiRequest';
import Select from 'react-select';
import FilePreviewCard from '../components/FilePreviewCard';
import {
  MAX_FILE_SIZE,
  MAX_MEDIA_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '../utils/validations';
import ImageCropper from '../components/imagecropper/index';

import { toast } from 'react-toastify';

export default function LoansEdit({ product_id }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_title: '',
    loan_for_study_level: '',
    loan_duration: '',
    loan_eligibility: '',
    full_financing_available: '',
    hsn_code: '',
    gst_rate: '',
    study_destination_countries: '',
    product_description: '',
    product_unique_selling_point: '',
    fee_range_max: '',
    fee_range_min: '',
    loan_interest_percentage: '',
    loan_amount_range: '',
    // google_reviews: "",
    // google_rating_url: "",
    youtube_url: '',
    refund_policy: '',
    product_images: [],
    product_videos: [],
  });
  const [partnerId, setPartnerId] = useState(null);

  const fileInputRef = useRef(null);
  const [countries, setCountries] = useState([]);
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
        console.log(product);
        setFormData({
          product_title: product.product_title || '',
          loan_for_study_level: product.loan_for_study_level || '',
          loan_duration: product.loan_duration || '',
          loan_eligibility: product.loan_eligibility || '',
          full_financing_available: product.full_financing_available || '',
          hsn_code: product.hsn_code || '',
          gst_rate: product.gst_rate || '',
          study_destination_countries:
            product.study_destination_countries || '',
          product_description: product.product_description || '',
          product_unique_selling_point:
            product.product_unique_selling_point || '',
          fee_range_max:
            product.fee_range_max || product.fee_range_max == 0
              ? product.fee_range_max
              : null,
          fee_range_min:
            product.fee_range_min || product.fee_range_min == 0
              ? product.fee_range_min
              : null,
          loan_interest_percentage:
            product.loan_interest_percentage ||
            product.loan_interest_percentage == 0
              ? product.loan_interest_percentage
              : null,
          loan_amount_range:
            product.loan_amount_range || product.loan_amount_range == 0
              ? product.loan_amount_range
              : null,
          // google_reviews:
          //     product.google_reviews || product.google_reviews == 0
          //         ? product.google_reviews
          //         : null,
          // google_rating_url: product.google_rating_url || "",
          youtube_url: product.youtube_url || '',
          refund_policy: product.refund_policy || false,
          product_images: fetchedProductImagesIds || [],
          product_videos: fetchedProductVideosIds || [],
        });

        setPartnerId(product.partner_id || '');
        setFetchedProductImages(product.product_images || []);
        setFetchedProductVideos(product.product_videos || []);
      }
    };
    getProducts();
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    const tempCountries = loadOnlyCountries();
    setCountries(tempCountries);
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
            ...formData.product_images,
            { id: response.data.id },
          ],
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
      url: `/mic-finance/updateProduct/${product_id}`,
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
                Loan for study level
                <span className="text-red-500">*</span>
              </label>
              <select
                name="loan_for_study_level"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.loan_for_study_level || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loan_for_study_level: e.target.value,
                  })
                }
              >
                <option>Select Study level</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="Diploma">Diploma</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Loan Duration</label>
              <input
                type="text"
                placeholder="Enter Loan Duration"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.loan_duration || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loan_duration: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Loan eligibility</label>
              <input
                type="text"
                placeholder="Enter Loan eligibility"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.loan_eligibility || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loan_eligibility: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Whether 100% Financing Available
                <span className="text-red-500">*</span>
              </label>
              <select
                name="loan_for_study_level"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.full_financing_available || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_financing_available: e.target.value,
                  })
                }
              >
                <option>Select Whether 100% Financing Available</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
          <h2 className="text-xl font-semibold mb-4">
            Service Locations (Education Loan)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Study destination countries
                <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                name="study_destination_countries"
                options={countries}
                value={formData?.study_destination_countries
                  ?.split(', ')
                  ?.filter(Boolean)
                  ?.map((value) => ({ value, label: value }))}
                onChange={(options) =>
                  handleMultiSelectChange(
                    'study_destination_countries',
                    options
                  )
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
          <h2 className="text-xl font-semibold mb-4">
            Processing/Origination fees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Minimum Processing Fees
              </label>
              <input
                type="text"
                placeholder="Enter Minimum Processing Fees"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.fee_range_min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fee_range_min: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Maximum Processing Fees
              </label>
              <input
                type="text"
                placeholder="Enter Maximum Processing Fees"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.fee_range_max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fee_range_max: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Loan Interest %</label>
              <input
                type="text"
                placeholder="Enter Loan Interest %"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.loan_interest_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loan_interest_percentage: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Loan Amount Range
              </label>
              <input
                type="text"
                placeholder="Enter Loan Amount Range"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.loan_amount_range}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loan_amount_range: e.target.value,
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
