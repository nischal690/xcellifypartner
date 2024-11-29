import React, { useState } from "react";
import PrimaryLogo from "../assets/logo-primary.png";
import { useNavigate } from "react-router-dom";
import steps from "../utils/MultiStepVendorSignupFormData"; // Updated data
import { useStore } from "../stores";
import { AuthStatuses } from "../utils/constants";
import apiRequest from "../utils/apiRequest";

const MultiStepVendorSignupPage = () => {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Dynamically initialize form data
  const initialFormData = steps.flatMap((step) =>
    step.sections.flatMap((section) => section.fields.map((field) => field.name))
  ).reduce((acc, fieldName) => {
    acc[fieldName] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // const validate = () => {
  //   const newErrors = {};
  //   steps[currentStep].sections.forEach((section) => {
  //     section.fields.forEach((field) => {
  //       if (field.required && !formData[field.name]) {
  //         newErrors[field.name] = `${field.label} is required`;
  //       }
  //       if (field.pattern && formData[field.name] && !field.pattern.test(formData[field.name])) {
  //         newErrors[field.name] = `Invalid ${field.label}`;
  //       }
  //     });
  //   });
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleNext = () => {
    // if (validate()) {
      setCurrentStep((prev) => prev + 1);
    // }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (validate()) {
      try {
        const response = await apiRequest({
          url: "/mic-login/partnerProfileInfo",
          method: "post",
          data: formData,
        });
        appStore.setAppProperty("authStatus", AuthStatuses.UNDER_REVIEW);
        navigate("/application-sent");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    // }
  };

  return (
    <div className="w-full bg-white rounded-md p-6">
      {/* Header */}
      <div className="px-3 mb-5" onClick={() => navigate("/")}>
        <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-5 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  index <= currentStep
                    ? "bg-purple-primary text-white"
                    : "bg-gray-200 text-gray-500"
                } mx-auto`}
              >
                {index + 1}
              </div>
              <p
                className={`text-center ms-2 ${
                  index <= currentStep ? "text-purple-primary" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-28 h-0.5 ${
                  index <= currentStep - 1
                    ? "bg-purple-primary"
                    : "bg-gray-500"
                } transition-colors duration-500 left-0`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {steps[currentStep].title}
        </h2>

        {/* Sections */}
        {steps[currentStep].sections.map((section, secIdx) => (
          <div key={secIdx} className="mb-10">
            <h3 className="text-lg font-medium mb-4">{section.heading}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, idx) => (
                <div key={idx} className={`col-span-${field.type === "textarea" ? "2" : "1"}`}>
                  <label className="block text-gray-700 mb-2">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                    >
                      <option value="">Choose {field.label.toLowerCase()}</option>
                      {field.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                      rows={4}
                    />
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      name={field.name}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.files[0] })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border rounded-md text-purple-primary border-purple-primary hover:bg-purple-50"
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              className="px-6 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-700"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepVendorSignupPage;
