import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import PrimaryLogo from '../assets/logo-primary.png';
import useVendorProfile from '../hooks/profile/useVendorProfile';
import { MdDownload, MdEditNote, MdOutlineModeEdit } from 'react-icons/md';
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
import { FaDownload } from 'react-icons/fa';

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
  const [msmeCertificate, setMSMECertificate] = useState();
  const [signature, setSignature] = useState();
  const [brandLogo, setBrandLogo] = useState();
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
      subSections: [
        {
          subSectionTitle: 'Company details',
          fields: [
            { label: 'Company Name', name: 'company_name' },
            { label: 'Website', name: 'website' },
            { label: 'Company Type', name: 'company_type' },
            { label: 'Landline Number', name: 'landline_number' },
          ],
        },
        {
          subSectionTitle: 'Contact details',
          fields: [
            { label: 'Contact Person Name', name: 'contact_person_name' },
            { label: "Contact Person's Email", name: 'contact_person_email' },
            { label: "Contact Person's Mobile", name: 'contact_person_mobile' },
            { label: 'CEO/Owner Name', name: 'owner_name' },
            { label: "CEO/Owner's email", name: 'owner_email' },
            { label: "CEO/Owner's mobile", name: 'owner_mobile' },
          ],
        },
        {
          subSectionTitle: 'Address details',
          fields: [
            { label: 'Country', name: 'country' },
            { label: 'PIN/ZIP Code', name: 'pincode' },
            { label: 'State/Province', name: 'state' },
            { label: 'City', name: 'city' },
            { label: 'Address Line 1', name: 'address_line_1' },
            { label: 'Address Line 2', name: 'address_line_2' },
          ],
        },
      ],
    },
    complianceDetails: {
      title: 'Compliance Details',
      subSections: [
        {
          subSectionTitle: 'Bank details',
          fields: [
            { label: 'Bank Name', name: 'bank_name' },
            { label: 'Account Type', name: 'bank_account_type' },
            { label: 'Account Number', name: 'bank_account_number' },
            { label: 'IFSC Code', name: 'bank_ifsc' },
          ],
        },
        {
          subSectionTitle: 'Other details',
          fields: [
            { label: 'PAN', name: 'PAN' },
            { label: 'CIN', name: 'CIN' },
            { label: 'GST', name: 'GST' },
            { label: 'MSME Registered', name: 'MSME_registered' },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    const getDocuments = async () => {
      const { msmeCertificate, signature, brandLogo } =
        await getEssentialDocuments(profile.user_id, profile.partner_id);
      setMSMECertificate(msmeCertificate);
      setBrandLogo(brandLogo);
      setSignature(signature);
    };
    getDocuments();
  }, [profile.partner_id]);

  useEffect(() => {
    const getPincodeLocationDetails1 = async (pincode) => {
      const pincodeLocationDetails = await getPincodeLocationDetails(pincode);
      if (!!pincodeLocationDetails) {
        setFormData((prev) => ({
          ...prev,
          country: pincodeLocationDetails.country,
        }));
        if (!!pincodeLocationDetails?.state && !!pincodeLocationDetails?.city) {
          setFormData((prev) => ({
            ...prev,
            country: pincodeLocationDetails.country,
            state: pincodeLocationDetails.state,
            city: pincodeLocationDetails.city,
          }));
          setEditProfileData((prev) => ({
            ...prev,
            country: pincodeLocationDetails.country,
            state: pincodeLocationDetails.state,
            city: pincodeLocationDetails.city,
          }));
          setDisableCountrySelection(true); // when there are all fields
        } //when one of state or city is missing
        else setDisableCountrySelection(false);
      }
      //when do data available
      else {
        setDisableCountrySelection(false);
        loadCountries();
      }
    };
    getPincodeLocationDetails1(debouncedPincode);
  }, [debouncedPincode]);

  useEffect(() => {
    let { countriesList } = loadCountries();
    if (!!countriesList) {
      setcountryOptions(converToOptions(countriesList));
    }
    if (!!editProfileData.country) loadStates();
  }, []);

  useEffect(() => {
    if (editProfileData.country) {
      const states = loadStates(editProfileData.country);
      if (!!states) {
        setStateOptions(converToOptions(states));
      }
    }
  }, [editProfileData.country]);

  useEffect(() => {
    if (editProfileData.state) {
      let cities = loadCities(editProfileData.state);
      setCityOptions(converToOptions(cities));
    }
  }, [editProfileData.state]);

  const handleDisable = (name) => {
    if (name === 'country' || name === 'state' || name === 'city')
      return disableCountrySelction;
    return false;
  };

  const handleOptions = (name) => {
    let options;
    switch (name) {
      case 'country':
        options = countryOptions;
        break;
      case 'state':
        options = stateOptions;
        break;
      case 'city':
        options = cityOptions;
        break;
    }
    return options;
  };

  const converToOptions = (list) => {
    return list.map((value) => {
      return { label: value, value: value };
    });
  };

  useEffect(() => {
    setEditProfileData({ ...profile });
  }, [profile]);

  const handleBreadcrumbClick = (step) => {
    if (step === 'Profile') {
      return;
    }
    if (step === 'dashboard') navigate('/home/dashboard');

    setActiveTab(step);
    setBreadcrumbs((prev) =>
      prev.slice(0, 2).concat({ label: sections[step].title, step })
    );
  };

  const handleEdit = (e, subSectionIndex) => {
    setEditingCard(true);
    setEditSubSection(subSectionIndex);
  };

  const handleBack = () => {
    setEditingCard(false);
    setFormData({});
  };

  const checkFieldErrors = () => {
    let fieldErrors = {};
    let hasErrors = false;
    Object.keys(formData).forEach((name, index) => {
      const error = vendorValidField(name, formData[name]);
      if (error) {
        fieldErrors[name] = error;
        hasErrors = true;
      }
    });
    setFieldErrors(fieldErrors);
    return hasErrors;
  };

  const handleSaveAndUpdate = async (e) => {
    if (checkFieldErrors() || Object.keys(formData).length === 0) return;
    if (Object.hasOwn(formData, 'MSME_registered')) {
      formData.MSME_registered = formData.MSME_registered === 'Yes' ? 1 : 0;
    }
    const updateresp = await apiRequest({
      url: '/mic-login/partnerProfileInfo',
      method: 'post',
      data: formData,
    });
    if (updateresp?.status == HTTP_CODE.SUCCESS) {
      setEditingCard(false);
      setFormData({});
      toast.success(updateresp.data.message);
      //navigate('/home/profile')
      location.reload();
    } else {
      !!updateresp.data.message
        ? toast.info(updateresp.data.message)
        : toast.error('Something went wrong');
      console.log('update failed');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type == 'file' ? e.target.files[0] : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    setEditProfileData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const GetSection = ({ subSection, index }) => {
    return (
      <div key={index} className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {subSection.subSectionTitle}
          </h3>
          {/* <button onClick={(e) => handleEdit(e,index)} className="border-2 p-0.5 text-purple-primary rounded-full border-purple-primary ">
                <MdOutlineModeEdit />
            </button> */}
        </div>
        <div
          key={index}
          className="mb-6 sm:mb-8 rounded-lg shadow p-6 bg-white w-full max-w-full sm:max-w-2xl lg:max-w-3xl"
        >
          {subSection.fields.map((field, index) => (
            <div
              key={field.name}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0"
            >
              <label className="block text-sm font-medium text-gray-700 ">
                {field.label}
              </label>
              <p>{profile[field.name] || '-'}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentSection = sections[activeTab];
    return (
      <>
        <div className="w-full sm:w-1/2 flex flex-col pr-5 sm:pr-6 lg:pr-8">
          {currentSection.subSections.map(
            (subSection, index) =>
              index % 2 == 0 && (
                <GetSection key={index} subSection={subSection} index={index} />
              )
          )}
        </div>
        <div className="w-full sm:w-1/2 flex flex-col pl-5 sm:pl-6 lg:pl-8">
          {currentSection.subSections.map(
            (subSection, index) =>
              index % 2 == 1 && (
                <GetSection key={index} subSection={subSection} index={index} />
              )
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-5">Partner Profile</h2>

      <main className="w-full bg-gray-50">
        {!editingCard && (
          <>
            <div className="flex border-b mb-10">
              {Object.keys(sections).map((key) => (
                <button
                  key={key}
                  onClick={() => handleBreadcrumbClick(key)}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {sections[key].title}
                </button>
              ))}
            </div>
            <div className="flex flex-col justify-between">
              <p className="mb-6 sm:mb-10 font-semibold text-gray-700 text-center sm:text-left px-4 sm:px-0">
                <span class="text-red-500">*</span>
                <span>
                  {' '}
                  For any company or compliance-related changes and support,
                  please contact Partner Care.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
                {renderTabContent()}
              </div>
              {activeTab === 'complianceDetails' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Essential Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {msmeCertificate && (
                      <a
                        href={`data:application/pdf;base64,${msmeCertificate}`}
                        download="msme-certificate.pdf"
                      >
                        <button className="rounded-md border bg-white shadow-sm shadow-gray-300 flex items-center py-3 px-5">
                          <span className="pr-2">
                            <MSMECertificateIcon />
                          </span>
                          MSME certificate
                          <MdDownload className="text-gray-700 ml-2" />
                        </button>
                      </a>
                    )}
                    {signature && (
                      <a
                        href={`data:image/png;base64,${signature}`}
                        download="signature"
                      >
                        <button className="rounded-md border bg-white shadow-sm shadow-gray-300 flex items-center py-3 px-5">
                          <span className="pr-2">
                            <MSMECertificateIcon />
                          </span>
                          Signature
                          <MdDownload className="text-gray-700 ml-2" />
                        </button>
                      </a>
                    )}
                    {brandLogo && (
                      <a
                        href={`data:image/png;base64,${brandLogo}`}
                        download="brand-logo"
                      >
                        <button className="rounded-md border bg-white shadow-sm shadow-gray-300 flex items-center py-3 px-5">
                          <span className="pr-2">
                            <MSMECertificateIcon />
                          </span>
                          Brand Logo
                          <MdDownload className="text-gray-700 ml-2" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {editingCard && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-5">
              {sections[activeTab].title}
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
            <div className="space-x-10 mt-10 flex flex-row">
              <button
                className="bg-white text-purple-500 font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-300 border-2 border-purple-300"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="flex items-center bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-600"
                onClick={handleSaveAndUpdate}
              >
                Save and Update
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
