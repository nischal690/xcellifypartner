import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppInfo } from '../../../hooks/appStore/useAppInfo';
import PackageForm from '../../commonComponents/products/packages/PackageForm';
import { TutoringPackageSchema } from '../../commonComponents/products/packages/packageSchema';
import { toast } from 'react-toastify';
import RichTextEditor from '../../commonComponents/RichTextEditor';
import { loadAllIndianCities } from '../../../utils/geocoding';
import { FiArrowLeft, FiArrowRight, FiInfo } from 'react-icons/fi';

const travelOptions = [5, 10, 20, 50].map((km) => ({
  value: km,
  label: `${km} km`,
}));

const TutoringForm = () => {
  const navigate = useNavigate();
  const { partnerInfo, appStore } = useAppInfo();
  const [currentPackage, setCurrentPackage] = useState({});
  
  // Add state for managing form steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // State for tooltip visibility
  const [activeTooltip, setActiveTooltip] = useState(null);

  const [formData, setFormData] = useState({
    product_title: '',
    education_qualification: '',
    service_provided_since: '',
    hsn_code: '999293',
    gst_rate: '18',
    service_cities: [],
    can_travel_upto_km: '',
    product_description: '',
    unique_selling_proposition: '',
    youtube_video_url: '',
    refund_policy: false,
  });

  const [cities, setCities] = useState([]);

  const fetchCities = () => {
    const indianCities = loadAllIndianCities();
    setCities(indianCities);
  };
  useEffect(() => {
    fetchCities();
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
    setFormData((prev) => ({
      ...prev,
      [field]: selected?.value || '',
    }));
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

    const productDetails = {
      ...formData,
      gst_rate: Number(formData.gst_rate),
      can_travel_upto_km: Number(formData.can_travel_upto_km),
      partner_id: String(partnerInfo.partner_id),
      google_reviews_rating: parseFloat(partnerInfo?.google_rating || null),
      google_rating_link: partnerInfo?.google_rating_url || '',
    };

    const packagesDetails = allPackages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
      discount_percent: Number(pkg.discount_percent),
      package_duration_hours: Number(pkg.package_duration_hours),
    }));

    const payload = {
      product_details: productDetails,
      packages_details: packagesDetails,
    };
    delete payload.product_details.packages_details;

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    const result = await appStore.submitProducts('Tutoring', payload);

    if (result.success) {
      toast.success('Tutoring Product submitted successfully!');
      navigate('/home/products');
    } else {
      toast.error('Failed to submit Tutoring Product');
      console.error('Failed to submit Tutoring Product:', result.error);
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

  // Navigation functions for multi-step form
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Function to validate current step before proceeding
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        // Basic information validation
        if (!formData.product_title) {
          toast.error('Please enter a product title');
          return false;
        }
        return true;
      case 2:
        // Service details validation
        if (formData.service_cities.length === 0) {
          toast.error('Please select at least one service city');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Handle next button with validation
  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  // Field info tooltips data
  const fieldInfoData = {
    product_title: "Enter a clear, descriptive title for your tutoring service",
    education_qualification: "List your educational qualifications relevant to this tutoring service",
    service_provided_since: "When did you start providing this tutoring service",
    hsn_code: "Harmonized System of Nomenclature code for GST classification",
    gst_rate: "Applicable GST rate for your tutoring service",
    service_cities: "Cities where you offer your tutoring services",
    can_travel_upto_km: "Maximum distance you're willing to travel for in-person tutoring",
    product_description: "Detailed description of your tutoring service, including subjects, levels, and teaching methods",
    unique_selling_proposition: "What makes your tutoring service stand out from others",
    youtube_video_url: "Link to a video showcasing your tutoring style or testimonials",
    refund_policy: "Agreement to Xcellify's refund policy for tutoring services"
  };
  
  // Info tooltip component
  const InfoTooltip = ({ fieldName }) => {
    return (
      <div className="relative inline-block ml-2">
        <FiInfo 
          className="text-purple-600 cursor-pointer hover:text-purple-800" 
          size={16}
          onMouseEnter={() => setActiveTooltip(fieldName)}
          onMouseLeave={() => setActiveTooltip(null)}
        />
        {activeTooltip === fieldName && (
          <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-32 top-6">
            {fieldInfoData[fieldName]}
            <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -top-1 left-32"></div>
          </div>
        )}
      </div>
    );
  };
  
  // Progress bar component
  const ProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${index + 1 <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div>Basic Info</div>
          <div>Service Details</div>
          <div>Packages & Submission</div>
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Tutoring Product Details - Step {currentStep} of {totalSteps}
      </h2>
      
      <ProgressBar />

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1 flex items-center">
            Product Title
            <InfoTooltip fieldName="product_title" />
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
          <label className="block font-medium text-gray-700 mb-1 flex items-center">
            Education Qualification
            <InfoTooltip fieldName="education_qualification" />
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
        <label className="block font-medium text-gray-700 mb-1 flex items-center">
          Service Provided Since
          <InfoTooltip fieldName="service_provided_since" />
        </label>
        <input
          type="date"
          name="service_provided_since"
          value={formData.service_provided_since}
          onChange={handleChange}
          placeholder="Enter year"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1 flex items-center">
          HSN Code
          <InfoTooltip fieldName="hsn_code" />
        </label>
        <input
          type="text"
          name="hsn_code"
          readOnly
          value={formData.hsn_code}
          onChange={handleChange}
          placeholder="Enter HSN code"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1 flex items-center">
          GST Rate (%)
          <InfoTooltip fieldName="gst_rate" />
        </label>
        <input
          type="number"
          name="gst_rate"
          readOnly
          value={formData.gst_rate}
          onChange={handleChange}
          placeholder="Enter GST rate"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1 flex items-center">
          Can Travel Up To
          <InfoTooltip fieldName="can_travel_upto_km" />
        </label>
        <Select
          options={travelOptions}
          onChange={(selected) =>
            handleSingleSelect(selected, 'can_travel_upto_km')
          }
          placeholder="Select travel distance"
        />
      </div>

      </div>
    )}

    {currentStep === 2 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1 flex items-center">
            Service Cities
            <InfoTooltip fieldName="service_cities" />
          </label>
          <Select
            isMulti
            options={cities}
            value={cities.filter(city => formData.service_cities.includes(city.value))}
            onChange={(selected) =>
              handleSelectChange(selected, 'service_cities')
            }
            placeholder="Select cities"
          />
        </div>

        </div>
      )}

      {currentStep === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1 flex items-center">
              Service Cities
              <InfoTooltip fieldName="service_cities" />
            </label>
            <Select
              isMulti
              options={cities}
              value={cities.filter(city => formData.service_cities.includes(city.value))}
              onChange={(selected) =>
                handleSelectChange(selected, 'service_cities')
              }
              placeholder="Select cities"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block font-medium text-gray-700 mb-1 flex items-center">
              Product Description
              <InfoTooltip fieldName="product_description" />
            </label>
            <RichTextEditor
              value={formData.product_description}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, product_description: val }))
              }
              placeholder="Describe the mentoring service"
              fieldName="product_description"
              onAIRefine={handleAIRefine}
              className="h-full"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block font-medium text-gray-700 mb-1 flex items-center">
              Unique Selling Proposition
              <InfoTooltip fieldName="unique_selling_proposition" />
            </label>
            <RichTextEditor
              value={formData.unique_selling_proposition}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  unique_selling_proposition: val,
                }))
              }
              placeholder="What makes it unique?"
              fieldName="unique_selling_proposition"
              onAIRefine={handleAIRefine}
              className="h-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1 flex items-center">
              YouTube Video URL
              <InfoTooltip fieldName="youtube_video_url" />
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
        </div>
      )}

      {currentStep === 3 && (
        <div className="grid grid-cols-1 gap-6">
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2 flex items-center">
              Refund Policy
              <InfoTooltip fieldName="refund_policy" />
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
            category="Tutoring"
            schema={TutoringPackageSchema}
            onPackagesChange={(updatedPackages) =>
              setFormData((prev) => ({
                ...prev,
                packages_details: updatedPackages,
              }))
            }
            onCurrentPackageChange={setCurrentPackage}
          />
        </div>
      )}

      <div className="flex flex-row justify-between gap-4 sm:gap-6 md:gap-10 mt-8">
        {currentStep > 1 ? (
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition flex items-center"
            onClick={prevStep}
          >
            <FiArrowLeft className="mr-2" /> Previous
          </button>
        ) : (
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
            onClick={handleSkipNow}
          >
            Go To Home
          </button>
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition flex items-center"
            onClick={handleNext}
          >
            Next <FiArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
          >
            Create Product
          </button>
        )}
      </div>
    </form>
  );
};

export default TutoringForm;
