import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  loadAllIndianCities,
  loadOnlyCountries,
} from '../../../utils/geocoding';
import {
  hsnCodeMapping,
  gstRateMapping,
  loadServiceDelivary,
  loadStudyLevel,
} from '../../../utils/productsCodes';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import RichTextEditor from '../../commonComponents/RichTextEditor';
import { callGeminiRefineAPI } from '../../../utils/geminiAI';

const StudyOverseasForm = () => {
  const navigate = useNavigate();
  const { partnerInfo, appStore } = useAppInfo();

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    product_title: '',
    service_provided_since: '',
    study_level: [],
    education_qualification: '',
    hsn_code: hsnCodeMapping['Study overseas'],
    gst_rate: gstRateMapping['Study overseas'],
    study_destination_countries: [],
    service_available_cities: [],
    service_delivery: [],
    product_description: '',
    unique_selling_proposition: '',
    youtube_video_url: '',
    refund_policy: false,
  });

  useEffect(() => {
    setCities(loadAllIndianCities());
    setCountries(loadOnlyCountries());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected.map((opt) => opt.value),
    }));
  };

  const handleSingleSelect = (selected, field) => {
    setFormData((prev) => ({ ...prev, [field]: selected?.value || '' }));
  };

  const handleAIRefine = async (rawInput, fieldName) => {
    const plainText = rawInput?.replace(/<[^>]*>/g, '') || '';

    if (plainText.length < 50 || plainText.length > 1000) return '';

    const refinedText = await callGeminiRefineAPI(plainText);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: refinedText,
    }));

    return refinedText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productDetails = {
      ...formData,
      gst_rate: Number(formData.gst_rate),
      partner_id: String(partnerInfo.partner_id),
      google_reviews_rating: parseFloat(partnerInfo?.google_rating || null),
      google_rating_link: partnerInfo?.google_rating_url || '',
    };

    const payload = { product_details: productDetails };

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    const result = await appStore.submitProducts('Study overseas', payload);

    if (result.success) {
      toast.success('Study Overseas Product submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Study Overseas Product');
      console.error('Submission error:', result.error);
    }
  };

  const handleSkipNow = () => {
    navigate('/home');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Study Overseas Product Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            name="product_title"
            value={formData.product_title}
            onChange={handleChange}
            placeholder="Enter product title"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Service Provided Since
          </label>
          <input
            type="date"
            name="service_provided_since"
            value={formData.service_provided_since}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Study Level</label>
          <Select
            isMulti
            options={loadStudyLevel}
            onChange={(s) => handleSelectChange(s, 'study_level')}
            placeholder="Select study level"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Education Qualification
          </label>
          <input
            type="text"
            name="education_qualification"
            value={formData.education_qualification}
            onChange={handleChange}
            placeholder="Enter qualification"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">HSN Code</label>
          <input
            type="text"
            name="hsn_code"
            readOnly
            value={formData.hsn_code}
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">GST Rate (%)</label>
          <input
            type="number"
            name="gst_rate"
            readOnly
            value={formData.gst_rate}
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Study Destination Countries
          </label>
          <Select
            isMulti
            options={countries}
            onChange={(s) => handleSelectChange(s, 'study_destination_countries')}
            placeholder="Select countries"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Cities where service is available
          </label>
          <Select
            isMulti
            options={cities}
            onChange={(s) => handleSelectChange(s, 'service_available_cities')}
            placeholder="Select cities"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Service Delivery
          </label>
          <Select
            isMulti
            options={loadServiceDelivary}
            onChange={(s) => handleSelectChange(s, 'service_delivery')}
            placeholder="Select service delivery"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Product Description
          </label>
          <RichTextEditor
            value={formData.product_description}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, product_description: val }))
            }
            placeholder="Describe the product"
            fieldName="product_description"
            onAIRefine={handleAIRefine}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Unique Selling Proposition
          </label>
          <RichTextEditor
            value={formData.unique_selling_proposition}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, unique_selling_proposition: val }))
            }
            placeholder="What makes it unique?"
            fieldName="unique_selling_proposition"
            onAIRefine={handleAIRefine}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            YouTube Video URL
          </label>
          <input
            type="text"
            name="youtube_video_url"
            value={formData.youtube_video_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=example"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2 mt-6">
          <label className="block font-medium text-gray-700 mb-2">Refund Policy</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="refund_policy"
              checked={formData.refund_policy}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">
              I agree to the{' '}
              <a
                href="https://xcellify.com/TermsOfUse#refund-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                refund policy of Xcellify
              </a>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6">
        <button
          type="button"
          className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
          onClick={handleSkipNow}
        >
          Go To Home
        </button>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Create Product
        </button>
      </div>
    </form>
  );
};

export default StudyOverseasForm;
