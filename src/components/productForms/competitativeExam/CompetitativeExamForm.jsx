import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import PackageForm from '../../commonComponents/products/packages/PackageForm';
import { competitativeExamSchema } from '../../commonComponents/products/packages/packageSchema';
import { toast } from 'react-toastify';
import RichTextEditor from '../../commonComponents/RichTextEditor';

const durationOptions = [
  { value: '1 Month', label: '1 Month' },
  { value: '3 Months', label: '3 Months' },
  { value: '6 Months', label: '6 Months' },
];

const examLevelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const serviceModeOptions = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const classFormatOptions = [
  { value: 'Live + Recorded', label: 'Live + Recorded' },
  { value: 'Live', label: 'Live' },
  { value: 'Recorded', label: 'Recorded' },
  { value: 'Self-paced', label: 'Self-paced' },
  { value: 'Self-paced + Live', label: 'Self-paced + Live' },
  { value: 'Self-paced + Recorded', label: 'Self-paced + Recorded' },
];

const multiOptions = (values) => values.map((v) => ({ label: v, value: v }));

const courseMediumOptions = multiOptions(['English', 'Hindi']);
const targetGradesOptions = multiOptions([
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
]);
const subjectsCoveredOptions = multiOptions([
  'Mathematics',
  'Physics',
  'Chemistry',
]);
const languageOptions = multiOptions(['English', 'Hindi']);

const CompetitativeExamForm = () => {
  const navigate = useNavigate();
  const { partnerInfo, appStore } = useAppInfo();
  const [currentPackage, setCurrentPackage] = useState({});

  const [formData, setFormData] = useState({
    exam_name: '',
    product_title: '',
    exam_level: '',
    target_grades: [],
    subjects_covered: [],
    course_medium: [],
    service_mode: '',
    duration: '',
    class_format: '',
    instructor_experience: '',
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

    const result = await appStore.submitProducts('Competitative exam', payload);
    if (result.success) {
      toast.success('Competitative exam Product submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Competitative exam Product');
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
        Competitative exam Product Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Exam Name
          </label>
          <input
            name="exam_name"
            value={formData.exam_name}
            onChange={handleChange}
            placeholder="Enter exam name"
            className="w-full p-2 border rounded-md"
          />
        </div>
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

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Exam Level
          </label>
          <Select
            options={examLevelOptions}
            onChange={(selected) => handleSingleSelect(selected, 'exam_level')}
            placeholder="Select exam level"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Target Grades
          </label>
          <Select
            isMulti
            options={targetGradesOptions}
            onChange={(s) => handleMultiSelect(s, 'target_grades')}
            placeholder="Select target grades"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Subjects Covered
          </label>
          <Select
            isMulti
            options={subjectsCoveredOptions}
            onChange={(s) => handleMultiSelect(s, 'subjects_covered')}
            placeholder="Select subjects covered"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Course Medium
          </label>
          <Select
            isMulti
            options={courseMediumOptions}
            onChange={(selected) =>
              handleMultiSelect(selected, 'course_medium')
            }
            placeholder="Select course medium"
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
            Duration
          </label>
          <Select
            options={durationOptions}
            onChange={(s) => handleSingleSelect(s, 'duration')}
            placeholder="Select duration"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Class Format
          </label>
          <Select
            isMulti
            options={classFormatOptions}
            onChange={(s) => handleMultiSelect(s, 'class_format')}
            placeholder="Select class format"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Instructor Experience
          </label>
          <textarea
            name="instructor_experience"
            value={formData.instructor_experience}
            onChange={handleChange}
            placeholder="Enter instructor experience"
            className="w-full p-2 border rounded-md h-24"
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
          category="Competitative exam"
          schema={competitativeExamSchema}
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

export default CompetitativeExamForm;
