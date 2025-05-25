import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import PackageForm from '../../commonComponents/products/packages/PackageForm';
import { MentoringPackageSchema } from '../../commonComponents/products/packages/packageSchema';
import { toast } from 'react-toastify';
import RichTextEditor from '../../commonComponents/RichTextEditor';

const scheduleOptions = [
  { value: 'Mon-Fri 9 AM to 6 PM IST', label: 'Mon-Fri 9 AM to 6 PM IST' },
  { value: 'Weekends', label: 'Weekends' },
];

const modeOptions = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const multiOptions = (values) => values.map((v) => ({ label: v, value: v }));

const industryOptions = multiOptions(['Education', 'Technology', 'Healthcare']);
const audienceOptions = multiOptions([
  'Students',
  'Young Professionals',
  'Career Switchers',
]);
const focusOptions = multiOptions([
  'Career Development',
  'Stress Management',
  'Leadership Skills',
]);
const languageOptions = multiOptions(['English', 'Hindi']);

const MentoringForm = () => {
  const navigate = useNavigate();
  const { partnerInfo, appStore } = useAppInfo();
  const [currentPackage, setCurrentPackage] = useState({});

  const [formData, setFormData] = useState({
    mentor_name: '',
    mentor_background: '',
    industries: [],
    target_audience: [],
    mentoring_focus: [],
    service_mode: '',
    mentor_experience: '',
    availability_schedule: '',
    languages_supported: [],
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
        google_reviews_rating: parseFloat(partnerInfo?.google_rating || 0),
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

    const result = await appStore.submitProducts('Mentoring', payload);
    if (result.success) {
      toast.success('Mentoring Product submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Mentoring Product');
      console.error('Submission error:', result.error);
    }
  };

  const handleSkipNow = () => {
    navigate('/home');
    return;
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
        Mentoring Product Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Mentor Name
          </label>
          <input
            name="mentor_name"
            value={formData.mentor_name}
            onChange={handleChange}
            placeholder="Enter mentor name"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Mentor Background
          </label>
          <input
            name="mentor_background"
            value={formData.mentor_background}
            onChange={handleChange}
            placeholder="Enter background"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Industries
          </label>
          <Select
            isMulti
            options={industryOptions}
            onChange={(s) => handleMultiSelect(s, 'industries')}
            placeholder="Select industries"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <Select
            isMulti
            options={audienceOptions}
            onChange={(s) => handleMultiSelect(s, 'target_audience')}
            placeholder="Select target audience"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Mentoring Focus
          </label>
          <Select
            isMulti
            options={focusOptions}
            onChange={(s) => handleMultiSelect(s, 'mentoring_focus')}
            placeholder="Select mentoring focus"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Service Mode
          </label>
          <Select
            options={modeOptions}
            onChange={(selected) =>
              handleSingleSelect(selected, 'service_mode')
            }
            placeholder="Select service mode"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Mentor Experience
          </label>
          <input
            name="mentor_experience"
            value={formData.mentor_experience}
            onChange={handleChange}
            placeholder="e.g. 10 years"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Availability Schedule
          </label>
          <Select
            options={scheduleOptions}
            onChange={(s) => handleSingleSelect(s, 'availability_schedule')}
            placeholder="Select schedule"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Languages Supported
          </label>
          <Select
            isMulti
            options={languageOptions}
            onChange={(s) => handleMultiSelect(s, 'languages_supported')}
            placeholder="Languages supported"
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
          category="Mentoring"
          schema={MentoringPackageSchema}
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

export default MentoringForm;
