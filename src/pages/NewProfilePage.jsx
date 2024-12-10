import React, { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import PrimaryLogo from "../assets/logo-primary.png";
import useVendorProfile from "../hooks/profile/useVendorProfile";
import { MdEditNote, MdOutlineModeEdit } from "react-icons/md";

export default function ProfilePage() {
  const {
    profile,
    handleInputChange,
    handleSubmit,
    selectCountry,
    selectState,
    selectCity,
    countries,
    states,
    cities,
  } = useVendorProfile();

  const [activeTab, setActiveTab] = useState("companyDetails");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Dashboard", step: "dashboard" },
    { label: "Profile", step: "Profile" },
    { label: "Company Details", step: "companyDetails" },
  ]);

  const [editingCard, setEditingCard] = useState(null); // Track the editing card

  const sections = {
    companyDetails: {
      title: "Company Details",
      subSections: [
        {
          subSectionTitle: "Company details",
          fields: [
            { label: "Company Name", name: "company_name" },
            { label: "Website", name: "website" },
            { label: "Company Type", name: "company_type" },
            { label: "Landline Number", name: "landline_number" },
          ],
        },
        {
          subSectionTitle: "Contact details",
          fields: [
            { label: "Contact Person Name", name: "contact_person_name" },
            { label: "Contact Person's Email", name: "contact_person_email" },
            { label: "Contact Person's Mobile", name: "contact_person_mobile" },
            { label: "CEO/Owner Name", name: "owner_name" },
            { label: "CEO/Owner's email", name: "owner_email" },
            { label: "CEO/Owner's mobile", name: "owner_mobile" },
          ],
        },
        {
          subSectionTitle: "Address details",
          fields: [
            { label: "Country", name: "country" },
            { label: "PIN/ZIP Code", name: "pincode" },
            { label: "State/Province", name: "state" },
            { label: "City", name: "city" },
            { label: "Address Line 1", name: "address_line_1" },
          ],
        },
      ],
    },
    complianceDetails: {
      title: "Compliance Details",
      subSections: [
        {
          subSectionTitle: "Bank details",
          fields: [
            { label: "Bank Name", name: "bank_name" },
            { label: "Account Type", name: "bank_account_type" },
            { label: "Account Number", name: "bank_account_number" },
            { label: "IFSC Code", name: "bank_ifsc" },
          ],
        },
        {
          subSectionTitle: "Other details",
          fields: [
            { label: "PAN", name: "PAN" },
            { label: "CIN", name: "CIN" },
            { label: "GST", name: "GST" },
            { label: "MSME Registered", name: "MSME_registered" },
          ],
        },
      ],
    },
    productDetails: {
      title: "Product Details",
      subSections: [],
    },
  };

  const handleBreadcrumbClick = (step) => {
    if (step === "dashboard") {
      return;
    }
    setActiveTab(step);
    setBreadcrumbs((prev) =>
      prev.slice(0, 2).concat({ label: sections[step].title, step })
    );
  };

  const toggleEditMode = (subSectionIndex) => {
    setEditingCard(editingCard === subSectionIndex ? null : subSectionIndex);
  };

  const renderBreadcrumbs = () => (
    <nav className="text-gray-600 text-xl mb-10 font-semibold ms-5">
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          <span
            className={`cursor-pointer ${
              crumb.step === activeTab ? "text-indigo-500" : ""
            }`}
            onClick={() => handleBreadcrumbClick(crumb.step)}
          >
            {crumb.label}
          </span>
          {index < breadcrumbs.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );

  const renderField = (field, isEditing) => {
    const value = profile[field.name] || "";

    return isEditing ? (
      <input
        type="text"
        name={field.name}
        value={value}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
        placeholder={`Enter ${field.label}`}
      />
    ) : (
      <p className="text-gray-800">{value || "Not Provided"}</p>
    );
  };

//   const renderTabContent = () => {
//     const currentSection = sections[activeTab];
//     return currentSection.subSections.map((subSection, index) => (
//         <div key={index}>
//             <div className="flex items-center justify-between">
//                 <h3 className="text-md font-semibold text-gray-700 mb-4">
//                     {subSection.subSectionTitle}
//                 </h3>
//                 <button onClick={() => toggleEditMode(index)} className="border-2 p-0.5 text-purple-primary rounded-full border-purple-primary ">
//                     <MdOutlineModeEdit />
//                 </button>
//             </div>
//             <div key={index} className="mb-10 rounded-lg shadow p-6 h-[80%]">
//                 <div className="grid grid-cols-2 gap-4">
//                 {subSection.fields.map((field) => (
//                     <div key={field.name} className="col-span-2 sm:col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">

  const renderTabContent = () => {
    const currentSection = sections[activeTab];
    return currentSection.subSections.map((subSection, index) => {
      const isEditing = editingCard === index;
      return (
            <div key={index}>
                <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                        {subSection.subSectionTitle}
                    </h3>
                    <button onClick={() => toggleEditMode(index)} className="border-2 p-0.5 text-purple-primary rounded-full border-purple-primary ">
                        <MdOutlineModeEdit />
                    </button>
                </div>
                <div key={index} className="mb-10 rounded-lg shadow p-6 h-[80%]">
                    <div className="grid grid-cols-2 gap-4">
                        {subSection.fields.map((field) => (
                            <div key={field.name} className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                {renderField(field, isEditing)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      );
    });
  };

  return (
    <div className="w-full py-10 px-14 bg-white ">
      <header className="flex justify-between items-center mb-6">
        <img src={PrimaryLogo} alt="Logo" className="w-20" />
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      <main className="max-w-8xl md:max-w-6xl w-full mx-auto">
        {renderBreadcrumbs()}

        <div className="flex border-b mb-10">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => handleBreadcrumbClick(key)}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {renderTabContent()}
        </div>
        {editingCard !== null && (
          <div className="text-right mt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md"
            >
              Save Changes <FiCheckCircle className="inline ml-1" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}


