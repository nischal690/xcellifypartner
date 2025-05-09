import React, { useState, useEffect } from "react";
import useVendorProfile from "../hooks/profile/useVendorProfile";
import PrimaryLogo from "../assets/logo-primary.png";
import { MdEmail, MdEdit, MdSave, MdCancel, MdLocationOn, MdBusiness, MdAccountBalance } from "react-icons/md";
import { PiPhone } from "react-icons/pi";
import { BiPhone, BiWorld, BiUser } from "react-icons/bi";
import { FaBuilding, FaIdCard } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { profile, errors, handleInputChange, handleSubmit } = useVendorProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [animateProfile, setAnimateProfile] = useState(false);

  // Toggle edit mode
  const toggleEditMode = () => setIsEditing(!isEditing);

  useEffect(() => {
    setAnimateProfile(true);
  }, []);

  // Sections data
  const sections = {
    companyDetails: {
      title: "Company Details",
      icon: <FaBuilding className="text-purple-600" />,
      fields: [
        { label: "Company Name", name: "company_name", icon: <MdBusiness /> },
        { label: "Website", name: "website", icon: <BiWorld /> },
        { label: "Owner/CEO", name: "owner_name", icon: <BiUser /> },
        { label: "Contact Person", name: "contact_person_name", icon: <BiUser /> },
      ],
    },
    bankDetails: {
      title: "Bank Details",
      icon: <MdAccountBalance className="text-purple-600" />,
      fields: [
        { label: "Bank A/C Number", name: "bank_account_number" },
        { label: "Bank IFSC", name: "bank_ifsc" },
        { label: "Bank Name", name: "bank_name" },
        { label: "Bank A/C Type", name: "bank_account_type" },
      ],
    },
    address: {
      title: "Address",
      icon: <MdLocationOn className="text-purple-600" />,
      fields: [
        { label: "Address", name: "address" },
        { label: "State", name: "state" },
        { label: "Pin Code / Zip Code", name: "zipCode" },
        { label: "City", name: "city" },
        { label: "Country", name: "country" },
      ],
    },
    compliances: {
      title: "Compliances",
      icon: <FaIdCard className="text-purple-600" />,
      fields: [
        { label: "CIN", name: "CIN" },
        { label: "PAN", name: "PAN" },
        { label: "GST", name: "GST" },
        { label: "Registered under MSME", name: "MSME" },
      ],
    },
  };

  const renderField = (field, value) => {
    if (isEditing) {
      return (
        <input
          type="text"
          name={field.name}
          value={value || ""}
          onChange={handleInputChange}
          className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />
      );
    }
    return (
      <div className="w-full bg-white bg-opacity-90 rounded-lg px-4 py-3 shadow-sm">
        <p className="text-gray-800">{value || "Not provided"}</p>
      </div>
    );
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-8 py-6 bg-white shadow-md"
      >
        <a href="https://vendor.xcellify.com/">
          <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify Logo" />
        </a>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          My Profile
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleEditMode}
          className={`px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ${
            isEditing 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          }`}
        >
          {isEditing ? (
            <>
              <MdCancel className="text-xl" /> Cancel
            </>
          ) : (
            <>
              <MdEdit className="text-xl" /> Edit Profile
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="container mx-auto py-8 px-4 md:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative -top-16">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                  {profile.company_logo ? (
                    <img 
                      src={profile.company_logo} 
                      alt={profile.company_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                      {profile.company_name?.charAt(0) || "X"}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 md:-mt-2">
                <h2 className="text-3xl font-bold text-gray-800">{profile.company_name || "Your Company"}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {profile.website && (
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <BiWorld /> {profile.website}
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Owner / CEO</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-medium text-gray-800">{profile.owner_name || "Not provided"}</span>
                      {profile.owner_phone && (
                        <a href={`tel:${profile.owner_phone}`} className="text-gray-600 hover:text-purple-600 transition-colors">
                          <BiPhone className="text-xl" />
                        </a>
                      )}
                      {profile.owner_email && (
                        <a href={`mailto:${profile.owner_email}`} className="text-gray-600 hover:text-purple-600 transition-colors">
                          <MdEmail className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-medium text-gray-800">{profile.contact_person_name || "Not provided"}</span>
                      {profile.contact_person_phone && (
                        <a href={`tel:${profile.contact_person_phone}`} className="text-gray-600 hover:text-purple-600 transition-colors">
                          <BiPhone className="text-xl" />
                        </a>
                      )}
                      {profile.contact_person_email && (
                        <a href={`mailto:${profile.contact_person_email}`} className="text-gray-600 hover:text-purple-600 transition-colors">
                          <MdEmail className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 md:gap-4">
            {Object.keys(sections).map((sectionKey) => (
              <button
                key={sectionKey}
                onClick={() => setActiveTab(sectionKey)}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                  activeTab === sectionKey
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {sections[sectionKey].icon}
                <span>{sections[sectionKey].title}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Section Content */}
        <motion.div 
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"
          >
            {sections[activeTab].icon}
            {sections[activeTab].title}
          </motion.h2>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {activeTab === "companyDetails" && (
              <>
                {sections.companyDetails.fields.map((field) => (
                  <motion.div key={field.name} variants={fadeInUp} className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      {field.icon} {field.label}
                    </label>
                    {renderField(field, profile[field.name])}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">{errors[field.name]}</p>
                    )}
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === "bankDetails" && (
              <>
                {sections.bankDetails.fields.map((field) => (
                  <motion.div key={field.name} variants={fadeInUp} className="space-y-2">
                    <label className="text-gray-700 font-medium">{field.label}</label>
                    {renderField(field, profile[field.name])}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">{errors[field.name]}</p>
                    )}
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === "address" && (
              <>
                {sections.address.fields.map((field) => (
                  <motion.div key={field.name} variants={fadeInUp} className={`space-y-2 ${field.name === 'address' ? 'md:col-span-2' : ''}`}>
                    <label className="text-gray-700 font-medium">{field.label}</label>
                    {renderField(field, profile[field.name])}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">{errors[field.name]}</p>
                    )}
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === "compliances" && (
              <>
                {sections.compliances.fields.map((field) => (
                  <motion.div key={field.name} variants={fadeInUp} className="space-y-2">
                    <label className="text-gray-700 font-medium">{field.label}</label>
                    {renderField(field, profile[field.name])}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">{errors[field.name]}</p>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* Submit Button */}
          {isEditing && (
            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg flex items-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                <MdSave className="text-xl" /> Save Changes
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}