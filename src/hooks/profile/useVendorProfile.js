import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import apiRequest from "../../utils/apiRequest";
import vendorValidField from "../../utils/HelperFunction";

let countryCodeMap = new Map();
let stateCodeMap = new Map();
let phoneNumberCodes = [];
const useVendorProfile = () => {
  const [profile, setProfile] = useState({
    company_name: "",
    website: "",
    owner_name: "",
    owner_email: "",
    owner_mobile: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_mobile: "",
    STD_code: "",
    landline_number: "",
    CIN: "",
    GST: "",
    PAN: "",
    bank_account_number: "",
    bank_name: "",
    bank_ifsc: "",
    bank_account_type: "",
    MSME_registered: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    logo: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountriesList] = useState([]);
  const [states, setStatesList] = useState([]);
  const [cities, setCityList] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      const response = await apiRequest({
        url: "/mic-login/partnerProfileInfo",
        method: "get",
      });
      if (response?.data) {
        const profile_info = {
          ...response?.data?.user_info,
          ...response?.data?.partner_info,
        };
        setProfile(profile_info);
      }
    };

    getProfile();

    let countriesList = [];
    Country.getAllCountries().forEach((country) => {
      countriesList.push(country.name);
      countryCodeMap.set(country.name, country.isoCode);
      if (!phoneNumberCodes.includes(country.phonecode)) {
        phoneNumberCodes.push(country.phonecode);
      }
    });

    setCountriesList(countriesList);
  }, []);

  const selectCountry = (e) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, country: value, state: "", city: "" }));

    const statesList = State.getStatesOfCountry(countryCodeMap.get(value));
    const tempStateList = [];
    statesList.forEach((state) => {
      tempStateList.push(state.name);
      stateCodeMap.set(state.name, state);
    });
    setStatesList(tempStateList);
  };

  const selectState = (e) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, state: value, city: "" }));

    const selectedStateData = stateCodeMap.get(value);
    const cityList = City.getCitiesOfState(
      selectedStateData?.countryCode,
      selectedStateData?.isoCode
    );

    const tempCityList = cityList.map((city) => city.name);
    setCityList(tempCityList);
  };

  const selectCity = (e) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, city: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    const error = vendorValidField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("EXECUTED")

    const newErrors = {};
    Object.keys(profile).forEach((key) => {
      const error = vendorValidField(key, profile[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
      return;
    }

    try {
      console.log("TRY")
      const response = await apiRequest({
        url: "/mic-login/partnerProfileInfo",
        method: "post",
        data: profile,
      });
      console.log("API")
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return {
    profile,
    setProfile,
    countries,
    states,
    cities,
    errors,
    selectCountry,
    selectState,
    selectCity,
    handleInputChange,
    handleSubmit,
  };
};

export default useVendorProfile;
