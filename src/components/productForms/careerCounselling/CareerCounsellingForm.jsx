import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import PackageForm from '../../commonComponents/products/packages/PackageForm';
import { careerCounsellingSchema } from '../../commonComponents/products/packages/packageSchema';
import { toast } from 'react-toastify';
import RichTextEditor from '../../commonComponents/RichTextEditor';
import { callGeminiRefineAPI } from '../../../utils/geminiAI';

const counsellingTypeOptions = [
  { value: 'Career Counselling', label: 'Career Counselling' },
  { value: 'College Counselling', label: 'College Counselling' },
  { value: 'Scholarship Counselling', label: 'Scholarship Counselling' },
  { value: 'Study Abroad Counselling', label: 'Study Abroad Counselling' },
  {
    value: 'Test Preparation Counselling',
    label: 'Test Preparation Counselling',
  },
];

const ageGroupOptions = [
  { value: '13-18 years', label: '13-18 years' },
  { value: '18-25 years', label: '18-25 years' },
];

const serviceModeOptions = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const sessionFormatOptions = [
  {
    value: 'One-on-One + Group Webinars',
    label: 'One-on-One + Group Webinars',
  },
  { value: 'Live + Recorded', label: 'Live + Recorded' },
  { value: 'Live', label: 'Live' },
  { value: 'Recorded', label: 'Recorded' },
  { value: 'Self-paced', label: 'Self-paced' },
  { value: 'Self-paced + Live', label: 'Self-paced + Live' },
  { value: 'Self-paced + Recorded', label: 'Self-paced + Recorded' },
];

const multiOptions = (values) => values.map((v) => ({ label: v, value: v }));

const specializationAreaOptions = multiOptions([
  'Career Planning',
  'Academic Support',
  'Stream Selection',
]);

const assessmentToolsOptions = multiOptions([
  'Aptitude Test',
  'Personality Assessment',
  'Interest Inventory',
]);

const CareerCounsellingForm = () => {
  const navigate = useNavigate();
  const { partnerInfo, appStore } = useAppInfo();
  const [currentPackage, setCurrentPackage] = useState({});

  const [formData, setFormData] = useState({
    product_title: '',
    counselling_type: '',
    assessment_tools: [],
    age_group: '',
    service_mode: '',
    specialization_area: [],
    counselor_qualification: '',
    counselor_experience: '',
    session_format: '',
    product_description: '',
    unique_selling_prop: '',
    youtube_video_url: '',
    refund_policy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelect = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected.map((opt) => opt.value),
    }));
  };

  const handleSingleSelect = (selected, field) => {
    setFormData((prev) => ({ ...prev, [field]: selected?.value || '' }));
  };

  const handleSkipNow = () => {
    navigate('/home');
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allPackages = [...(formData.packages_details || [])];
    if (
      currentPackage?.package_title &&
      currentPackage?.pricing_type &&
      !allPackages.some((p) => p.package_title === currentPackage.package_title)
    ) {
      allPackages.push(currentPackage);
    }

    const payload = {
      product_details: {
        ...formData,
        partner_id: String(partnerInfo.partner_id),
        google_reviews_rating: parseFloat(partnerInfo?.google_rating || null),
        google_rating_link: partnerInfo?.google_rating_url || '',
      },
      packages_details: allPackages.map((pkg) => ({
        ...pkg,
        price: Number(pkg.price),
        discount_percent: Number(pkg.discount_percent),
      })),
    };

    delete payload.product_details.packages_details;

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    const result = await appStore.submitProducts('Career counselling', payload);
    if (result.success) {
      toast.success('Career counselling Product submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Career counselling Product');
      console.error('Submission error:', result.error);
    }
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

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Career counselling Product Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            name="product_title"
            value={formData.product_title}
            onChange={handleChange}
            placeholder="Enter product title"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Counselling Type
          </label>
          <Select
            options={counsellingTypeOptions}
            onChange={(selected) =>
              handleSingleSelect(selected, 'counselling_type')
            }
            placeholder="Select counselling type"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Assessment Tools
          </label>
          <Select
            isMulti
            options={assessmentToolsOptions}
            onChange={(s) => handleMultiSelect(s, 'assessment_tools')}
            placeholder="Select assessment tools"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block font-medium text-gray-700 mb-1">
            Age Group
          </label>
          <Select
            options={ageGroupOptions}
            onChange={(selected) => handleSingleSelect(selected, 'age_group')}
            placeholder="Select age group"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block font-medium text-gray-700 mb-1">
            Service Mode
          </label>
          <Select
            options={serviceModeOptions}
            onChange={(s) => handleSingleSelect(s, 'service_mode')}
            placeholder="Select service mode"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Service Mode
          </label>
          <Select
            options={serviceModeOptions}
            onChange={(s) => handleSingleSelect(s, 'service_mode')}
            placeholder="Select service mode"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Specialization Area
          </label>
          <Select
            isMulti
            options={specializationAreaOptions}
            onChange={(selected) =>
              handleMultiSelect(selected, 'specialization_area')
            }
            placeholder="Select specialization area"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Counselor Qualification
          </label>
          <textarea
            name="counselor_qualification"
            value={formData.counselor_qualification}
            onChange={handleChange}
            placeholder="Enter instructor experience"
            className="w-full p-2 border rounded-md h-24"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Counselor Experience
          </label>
          <textarea
            name="counselor_experience"
            value={formData.counselor_experience}
            onChange={handleChange}
            placeholder="Enter instructor experience"
            className="w-full p-2 border rounded-md h-24"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Session Format
          </label>
          <Select
            options={sessionFormatOptions}
            onChange={(s) => handleSingleSelect(s, 'session_format')}
            placeholder="Select session format"
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
            placeholder="Describe the mentoring service"
            fieldName="product_description"
            onAIRefine={handleAIRefine}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Unique Selling Proposition
          </label>
          <RichTextEditor
            value={formData.unique_selling_prop}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, unique_selling_prop: val }))
            }
            placeholder="What makes it unique?"
            fieldName="unique_selling_prop"
            onAIRefine={handleAIRefine}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            YouTube Video URL
          </label>
          <input
            name="youtube_video_url"
            value={formData.youtube_video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-2">
            Refund Policy
          </label>
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

        <PackageForm
          category="Career counselling"
          schema={careerCounsellingSchema}
          onPackagesChange={(packages) =>
            setFormData((prev) => ({ ...prev, packages_details: packages }))
          }
          onCurrentPackageChange={setCurrentPackage}
        />
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

export default CareerCounsellingForm;
