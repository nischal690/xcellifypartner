import React, { useEffect, useState, useRef } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import PrimaryLogo from '../assets/logo-primary.png';
import useVendorProfile from '../hooks/profile/useVendorProfile';
import {
  MdDownload,
  MdEditNote,
  MdOutlineModeEdit,
  MdBusinessCenter,
  MdLocationOn,
  MdPerson,
  MdEmail,
  MdPhone,
  MdDescription,
  MdVerified,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import steps from '../utils/MultiStepVendorSignupFormData';
import { TextInput } from '../components/commonComponents';
import Dropdown from '../components/commonComponents/Dropdown';
import VendorEditForm from '../components/VendorEditForm';
import apiRequest from '../utils/apiRequest';
import { HTTP_CODE } from '../utils/constants';
import vendorValidField, { validateForm } from '../utils/HelperFunction';
import {
  getPincodeLocationDetails,
  loadCities,
  loadCountries,
  loadStates,
} from '../utils/geocoding';
import { toast } from 'react-toastify';
import Products from './products';
import Sidebar from '../components/sidebar';
import getEssentialDocuments from '../utils/getEssentialDocuments';
import MSMECertificateIcon from '../assets/svg-icons/MSMECertificateIcon';
import {
  FaDownload,
  FaBuilding,
  FaIdCard,
  FaFileAlt,
  FaGlobe,
  FaPhoneAlt,
  FaUser,
} from 'react-icons/fa';
import EssentialDocuments from '../components/profile/EssentialDocuments';
import { motion } from 'framer-motion';

const useDebouncedValue = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

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

  const [activeTab, setActiveTab] = useState('companyDetails');

  const [editingCard, setEditingCard] = useState(false); // Track the editing card
  const [editSubSection, setEditSubSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [editProfileData, setEditProfileData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [essentialDocs, setEssentialDocs] = useState({});
  const hasFetchedDocuments = useRef(false);

  //geocoding
  const [countryOptions, setcountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [disableCountrySelction, setDisableCountrySelection] = useState(false);
  const debouncedPincode = useDebouncedValue(
    editProfileData.pincode || '',
    500
  );

  const navigate = useNavigate();
  const tabsIndex = { companyDetails: 0, complianceDetails: 1 };

  const sections = {
    companyDetails: {
      title: 'Company Details',
      icon: <FaBuilding className="text-purple-600" />,
      subSections: [
        {
          subSectionTitle: 'Company details',
          icon: <MdBusinessCenter />,
          fields: [
            { label: 'Company Name', name: 'company_name' },
            { label: 'GST', name: 'GST' },
            { label: 'PAN', name: 'PAN' },
            { label: 'CIN', name: 'CIN' },
            { label: 'Brand Name', name: 'brand_name' },
            { label: 'Website', name: 'website' },
            { label: 'Company Type', name: 'company_type' },
            { label: 'Landline Number', name: 'landline_number' },
          ],
        },
        {
          subSectionTitle: 'Contact details',
          icon: <MdPerson />,
          fields: [
            { label: 'Contact Person Name', name: 'contact_person_name' },
            { label: "Contact Person's Email", name: 'contact_person_email' },
            { label: "Contact Person's Mobile", name: 'contact_person_mobile' },
            { label: "Other Key Person's Name", name: 'owner_name' },
            { label: "Other Key Person's Email", name: 'owner_email' },
            { label: "Other Key Person's Mobile", name: 'owner_mobile' },
          ],
        },
        {
          subSectionTitle: 'Address details',
          icon: <MdLocationOn />,
          fields: [
            { label: 'Country', name: 'country' },
            { label: 'State', name: 'state' },
            { label: 'City', name: 'city' },
            { label: 'Pincode', name: 'pincode' },
            { label: 'Address', name: 'address' },
          ],
        },
        {
          subSectionTitle: 'Bank details',
          icon: <FaIdCard />,
          fields: [
            { label: 'Bank Name', name: 'bank_name' },
            { label: 'Bank Account Number', name: 'bank_account_number' },
            { label: 'Bank IFSC', name: 'bank_ifsc' },
            { label: 'Bank Account Type', name: 'bank_account_type' },
          ],
        },
      ],
    },
    complianceDetails: {
      title: 'Compliance Details',
      icon: <MdVerified className="text-purple-600" />,
      subSections: [
        {
          subSectionTitle: 'Compliance details',
          icon: <FaFileAlt />,
          fields: [
            { label: 'MSME Registered', name: 'MSME_registered' },
            {
              label: 'MSME Certificate Number',
              name: 'MSME_certificate_number',
            },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setFormData(profile);
      setEditProfileData(profile);
    };
    fetchData();
  }, [profile]);

  useEffect(() => {
    const getDocuments = async () => {
      if (profile.partner_id && !hasFetchedDocuments.current) {
        console.log('Fetching documents...');
        const docs = await getEssentialDocuments(
          profile.user_id,
          profile.partner_id
        );
        setEssentialDocs(docs);
        console.log('Documents fetched:', docs);
        hasFetchedDocuments.current = true;
      }
    };
    getDocuments();
  }, [profile.partner_id]);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const countries = await loadCountries();
        setcountryOptions(converToOptions(countries));
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };
    loadGeoData();
  }, []);

  useEffect(() => {
    const loadStatesData = async () => {
      if (editProfileData.country) {
        try {
          const states = await loadStates(editProfileData.country);
          setStateOptions(converToOptions(states));
        } catch (error) {
          console.error('Error loading states:', error);
        }
      }
    };
    loadStatesData();
  }, [editProfileData.country]);

  useEffect(() => {
    const loadCitiesData = async () => {
      if (editProfileData.country && editProfileData.state) {
        try {
          const cities = await loadCities(
            editProfileData.country,
            editProfileData.state
          );
          setCityOptions(converToOptions(cities));
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      }
    };
    loadCitiesData();
  }, [editProfileData.country, editProfileData.state]);

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (debouncedPincode && debouncedPincode.length >= 6) {
        try {
          await getPincodeLocationDetails1(debouncedPincode);
        } catch (error) {
          console.error('Error fetching pincode details:', error);
        }
      }
    };
    fetchPincodeDetails();
  }, [debouncedPincode]);

  const getDocuments = async () => {
    try {
      const response = await getEssentialDocuments();
      if (response.status === HTTP_CODE.SUCCESS) {
        setEssentialDocs(response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const getPincodeLocationDetails1 = async (pincode) => {
    try {
      const response = await getPincodeLocationDetails(pincode);
      if (response.status === HTTP_CODE.SUCCESS) {
        const data = response.data;
        if (data.length > 0) {
          const locationData = data[0];
          const country = locationData.country;
          const state = locationData.state;
          const city = locationData.city;

          setEditProfileData((prev) => ({
            ...prev,
            country,
            state,
            city,
          }));

          setDisableCountrySelection(true);

          // Load states and cities
          const states = await loadStates(country);
          setStateOptions(converToOptions(states));

          const cities = await loadCities(country, state);
          setCityOptions(converToOptions(cities));
        }
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
    }
  };

  const handleDisable = (name) => {
    if (name === 'country' || name === 'state' || name === 'city') {
      return disableCountrySelction;
    }
    return false;
  };

  const handleOptions = (name) => {
    if (name === 'country') {
      return countryOptions;
    } else if (name === 'state') {
      return stateOptions;
    } else if (name === 'city') {
      return cityOptions;
    } else if (name === 'company_type') {
      return [
        { label: 'Private Limited', value: 'Private Limited' },
        { label: 'LLP', value: 'LLP' },
        { label: 'Proprietorship', value: 'Proprietorship' },
        { label: 'Partnership', value: 'Partnership' },
      ];
    }
    return [];
  };

  const converToOptions = (list) => {
    return list.map((item) => ({
      label: item,
      value: item,
    }));
  };

  const handleBreadcrumbClick = (step) => {
    setActiveTab(step);
  };

  const handleEdit = (e, subSectionIndex) => {
    e.preventDefault();
    setEditingCard(true);
    setEditSubSection(subSectionIndex);
  };

  const handleBack = () => {
    setEditingCard(false);
  };

  const checkFieldErrors = () => {
    const errors = {};
    const fields =
      steps[tabsIndex[activeTab]].sections[editSubSection].fields || [];

    if (editSubSection === 1 && tabsIndex[activeTab] !== 1) {
      fields.push(...(steps[tabsIndex[activeTab]].sections[2].fields || []));
    }

    if (editSubSection === 2 && tabsIndex[activeTab] !== 1) {
      fields.push(...(steps[tabsIndex[activeTab]].sections[3].fields || []));
    }

    fields.forEach((field) => {
      const error = vendorValidField(field, editProfileData);
      if (error) errors[field.name] = error;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAndUpdate = async (e) => {
    e.preventDefault();
    if (!checkFieldErrors()) return;

    try {
      const response = await apiRequest.put('/vendor/profile', editProfileData);
      if (response.status === HTTP_CODE.SUCCESS) {
        toast.success('Profile updated successfully!');
        setEditingCard(false);
        // Refresh the profile data
        window.location.reload();
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const GetSection = ({ subSection, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="w-full mb-6"
      >
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-2">
              {subSection.icon && (
                <span className="text-purple-600 text-xl">
                  {subSection.icon}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {subSection.subSectionTitle}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subSection.fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">
                    {field.label}
                  </span>
                  <span className="font-medium text-gray-800 bg-gray-50 p-2 rounded-md">
                    {profile[field.name] || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    return (
      <>
        <div className="w-full">
          {sections[activeTab].subSections.map((subSection, index) => (
            <GetSection key={index} subSection={subSection} index={index} />
          ))}
        </div>
      </>
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8"
    >
      <motion.div
        variants={slideUp}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Partner Profile
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </motion.div>

      <main className="w-full">
        {!editingCard && (
          <>
            <motion.div variants={slideUp} className="mb-10">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                  <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden">
                    {profile.company_logo ? (
                      <img
                        src={profile.company_logo}
                        alt={profile.company_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                        {profile.company_name?.charAt(0) || 'X'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-16 pb-6 px-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {profile.company_name || 'Your Company'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    {profile.website && (
                      <a
                        href={
                          profile.website.startsWith('http')
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <FaGlobe /> {profile.website}
                      </a>
                    )}
                    {profile.contact_person_mobile && (
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaPhoneAlt /> {profile.contact_person_mobile}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex border-b mb-6 bg-white rounded-t-lg shadow-sm"
            >
              {Object.keys(sections).map((key) => (
                <button
                  key={key}
                  onClick={() => handleBreadcrumbClick(key)}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                    activeTab === key
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sections[key].icon}
                  {sections[key].title}
                </button>
              ))}
            </motion.div>

            <motion.div
              variants={slideUp}
              className="flex flex-col justify-between"
            >
              <p className="mb-6 font-medium text-gray-700 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <span className="text-red-500">*</span>
                <span>
                  {' '}
                  For any company or compliance-related changes and support,
                  please contact Partner Care.
                </span>
              </p>
              <div className="flex flex-col justify-between gap-6">
                {renderTabContent()}
              </div>
              <motion.div variants={slideUp}>
                <EssentialDocuments
                  essentialDocs={essentialDocs}
                  setEssentialDocs={setEssentialDocs} // ✅ Add this
                  activeTab={activeTab}
                  userId={profile.user_id} // ✅ Add this if needed
                />
              </motion.div>
            </motion.div>
          </>
        )}
        {editingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <span className="text-purple-600">
                {sections[activeTab].icon}
              </span>
              {sections[activeTab].title} -{' '}
              {sections[activeTab].subSections[editSubSection].subSectionTitle}
            </h2>
            <div className="w-full sm:grid sm:grid-cols-2 sm:gap-x-10 gap-y-10 grid-cols-1 items-center">
              {editSubSection != 2 && (
                <>
                  <VendorEditForm
                    fields={
                      steps[tabsIndex[activeTab]].sections[editSubSection]
                        .fields
                    }
                    fieldValues={editProfileData}
                    handleChange={handleChange}
                    handleOptions={handleOptions}
                    handleDisable={handleDisable}
                    errorMsgs={fieldErrors}
                  />
                  {editSubSection == 1 && tabsIndex[activeTab] != 1 && (
                    <VendorEditForm
                      fields={steps[tabsIndex[activeTab]].sections[2].fields}
                      fieldValues={editProfileData}
                      handleChange={handleChange}
                      handleOptions={handleOptions}
                      handleDisable={handleDisable}
                      errorMsgs={fieldErrors}
                    />
                  )}
                </>
              )}
              {editSubSection == 2 && tabsIndex[activeTab] != 1 && (
                <VendorEditForm
                  fields={steps[tabsIndex[activeTab]].sections[3].fields}
                  fieldValues={editProfileData}
                  handleChange={handleChange}
                  handleOptions={handleOptions}
                  handleDisable={handleDisable}
                  errorMsgs={fieldErrors}
                />
              )}
            </div>
            <div className="space-x-4 mt-10 flex flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-gray-700 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                onClick={handleBack}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                onClick={handleSaveAndUpdate}
              >
                Save and Update
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
