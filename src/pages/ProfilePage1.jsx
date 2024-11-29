import React, { useState } from "react";
import useVendorProfile from "../hooks/profile/useVendorProfile";
import PrimaryLogo from "../assets/logo-primary.png";
import { FiCheckCircle } from "react-icons/fi";

export default function ProfilePage1() {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditMode = () => setIsEditing(!isEditing);

  const {
    profile,
    errors,
    handleInputChange,
    handleSubmit,
    selectCountry,
    selectState,
    selectCity,
    countries,
    states,
    cities,
  } = useVendorProfile(toggleEditMode);

  const renderField = (field) => {
    const value = profile[field.name] || ""; // Default to empty string for missing values

    if (field.type === "select") {
      const options =
        field.name === "country"
          ? countries
          : field.name === "state"
          ? states
          : cities;

      const selectHandler =
        field.name === "country"
          ? selectCountry
          : field.name === "state"
          ? selectState
          : selectCity;

      return isEditing ? (
        <select
          name={field.name}
          value={value}
          onChange={selectHandler}
          className="w-full bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 transition-all"
        >
          <option value="">Select {field.label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-800">{value || "Not Provided"}</p>
      );
    }

    return isEditing ? (
      <input
        type="text"
        name={field.name}
        value={value}
        onChange={handleInputChange}
        className="w-full bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 transition-all"
        placeholder={`Enter ${field.label}`}
      />
    ) : (
      <p className="text-gray-800">{value || "Not Provided"}</p>
    );
  };

  const sections = {
    companyDetails: {
      title: "Company Details",
      fields: [
        { label: "Company Name", name: "company_name" },
        { label: "Website", name: "website" },
        { label: "Owner/CEO", name: "owner_name" },
        { label: "Contact Person", name: "contact_person_name" },
        { label: "Email of CEO / Owner", name: "owner_email" },
        { label: "Email of Contact Person", name: "contact_person_email" },
        { label: "Mobile of CEO / Owner", name: "owner_mobile" },
        { label: "Mobile of Contact Person", name: "contact_person_mobile" },
        { label: "STD Code", name: "STD_code" },
        { label: "Landline Number", name: "landline_number" },
      ],
    },
    bankDetails: {
      title: "Bank Details",
      fields: [
        { label: "Bank A/C Number", name: "bank_account_number" },
        { label: "Bank IFSC", name: "bank_ifsc" },
        { label: "Bank Name", name: "bank_name" },
        { label: "Bank A/C Type", name: "bank_account_type" },
      ],
    },
    address: {
      title: "Address",
      fields: [
        { label: "Address", name: "address" },
        { label: "State", name: "state" },
        { label: "Pin Code / Zip Code", name: "pincode" },
        { label: "City", name: "city" },
        { label: "Country", name: "country" },
      ],
    },
    compliances: {
      title: "Compliances",
      fields: [
        { label: "CIN", name: "CIN" },
        { label: "PAN", name: "PAN" },
        { label: "GST", name: "GST" },
        { label: "Registered under MSME", name: "MSME" },
      ],
    },
  };

  return (
    <div className="w-full py-10 px-14 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <a href="https://vendor.xcellify.com/">
          <img src={PrimaryLogo} className="w-20 lg:w-28" alt="Xcellify Logo" />
        </a>
        <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
        <button
          onClick={toggleEditMode}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-500 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(sections).map((key) => {
          const section = sections[key];
          return (
            <div key={key} className="bg-white rounded-md shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.name} className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {isEditing && (
        <div className="text-right mt-8">
          <button
            onClick={(e)=>{handleSubmit(e);}}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-md shadow hover:bg-green-500 transition-colors"
          >
            Save Changes <FiCheckCircle className="inline ml-2 text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
