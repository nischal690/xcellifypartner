import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import { toast } from 'react-toastify';
import EvaluationSection from '../../product/EvaluationSection';
import PackageForm from '../../commonComponents/products/packages/PackageForm';
import { SummerCoursesPackageSchema } from '../../commonComponents/products/packages/packageSchema';
import RichTextEditor from '../../commonComponents/RichTextEditor';

const ageOptions = [
  { value: '5-8', label: '5-8 years' },
  { value: '9-12', label: '9-12 years' },
  { value: '13-15', label: '13-15 years' },
  { value: '16-18', label: '16-18 years' },
];

const modeOptions = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const levelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const subjectOptions = [
  { value: 'Art', label: 'Art' },
  { value: 'Science', label: 'Science' },
  { value: 'Math', label: 'Math' },
  { value: 'Programming', label: 'Programming' },
];

const SummerCoursesForm = () => {
  const { partnerInfo, appStore } = useAppInfo();
  const navigate = useNavigate();
  const [currentPackage, setCurrentPackage] = useState({});
  const [packagesDetails, setPackagesDetails] = useState([]);

  const [formData, setFormData] = useState({
    course_title: '',
    target_age_group: '',
    course_subjects: [],
    learning_outcomes: '',
    service_mode: '',
    level: '',
    pre_requisites: '',
    instructor_experience: '',
    product_description: '',
    unique_selling_prop: '',
    youtube_video_url: '',
    refund_policy: false,
    start_date: '',
    end_date: '',
    total_course_duration: '',
    product_image_links: [],
    evaluation_form: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSingleSelect = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected?.value || '',
    }));
  };

  const handleMultiSelect = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected.map((opt) => opt.value),
    }));
  };

  const handleMultiLineChange = (e, field) => {
    const lines = e.target.value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allPackages = [...packagesDetails];

    if (
      currentPackage?.package_title &&
      currentPackage?.pricing_type &&
      !allPackages.some((p) => p.package_title === currentPackage.package_title)
    ) {
      allPackages.push(currentPackage);
    }

    const productDetails = {
      ...formData,
      partner_id: String(partnerInfo.partner_id),
      google_reviews_rating: parseFloat(partnerInfo?.google_rating || null),
      google_rating_link: partnerInfo?.google_rating_url || '',
    };

    const packagesPayload = allPackages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
      discount_percent: Number(pkg.discount_percent),
      session_duration_mins: Number(pkg.session_duration_mins),
      number_of_sessions: Number(pkg.number_of_sessions),
    }));

    const payload = {
      product_details: productDetails,
      packages_details: packagesPayload,
    };

    delete payload.product_details.packages_details;

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    const result = await appStore.submitProducts('Summer courses', payload);

    if (result.success) {
      toast.success('Summer Course submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Summer Course');
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
        Summer Course Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Course Title
          </label>
          <input
            name="course_title"
            value={formData.course_title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Target Age Group
          </label>
          <Select
            options={ageOptions}
            onChange={(selected) =>
              handleSingleSelect(selected, 'target_age_group')
            }
            placeholder="Select age group"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Course Subjects
          </label>
          <Select
            isMulti
            options={subjectOptions}
            onChange={(selected) =>
              handleMultiSelect(selected, 'course_subjects')
            }
            placeholder="Select subjects"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Learning Outcomes
          </label>
          <textarea
            name="learning_outcomes"
            value={formData.learning_outcomes}
            onChange={handleChange}
            placeholder="What will students learn?"
            className="w-full p-2 border rounded-md h-24"
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
          <label className="block text-gray-700 font-medium mb-1">
            Course Level
          </label>
          <Select
            options={levelOptions}
            onChange={(selected) => handleSingleSelect(selected, 'level')}
            placeholder="Select level"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Pre-requisites
          </label>
          <input
            name="pre_requisites"
            value={formData.pre_requisites}
            onChange={handleChange}
            placeholder="Enter any required prior knowledge"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Instructor Experience
          </label>
          <input
            name="instructor_experience"
            value={formData.instructor_experience}
            onChange={handleChange}
            placeholder="e.g. 5+ years teaching experience"
            className="w-full p-2 border rounded-md"
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

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            YouTube Video URL
          </label>
          <input
            name="youtube_video_url"
            value={formData.youtube_video_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Total Course Duration
          </label>
          <input
            name="total_course_duration"
            value={formData.total_course_duration}
            onChange={handleChange}
            placeholder="e.g. 3 Months"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2 flex items-center">
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
        category="Summer courses"
        schema={SummerCoursesPackageSchema}
        onPackagesChange={(updatedPackages) =>
          setFormData((prev) => ({
            ...prev,
            packages_details: updatedPackages,
          }))
        }
        onCurrentPackageChange={setCurrentPackage}
      />

      <EvaluationSection formData={formData} setFormData={setFormData} />

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

export default SummerCoursesForm;
