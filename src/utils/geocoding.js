import axios from 'axios';

import { City, Country, State } from 'country-state-city';
import apiRequest from './apiRequest.js';
let countryISOCodeMap = new Map();
let countryCodeMap = new Map();
let stateCodeMap = new Map();
let phoneNumberCodes = [];
let phoneCountryCodeMap = [];

// export const getPincodeLocationDetails = async (debouncedPincode) => {
//   const response = debouncedPincode
//     ? await apiRequest({
//         url: `/mic-login/geoLocationDetails?pincode=${debouncedPincode}`,
//         method: 'get',
//       })
//     : {};
//   const locationDetails = response?.data?.results[0];
//   const postcode_localities = locationDetails?.postcode_localities || [];
//   const address_components = locationDetails?.address_components || [];
//   const locationObj = {};
//   let pincodeLocationDetails = {};
//   address_components.forEach((addObj) => {
//     const types = addObj.types;
//     if (types.includes('country')) {
//       locationObj['country'] = addObj.long_name;
//     }
//     if (types.includes('administrative_area_level_1')) {
//       locationObj['state'] = addObj.long_name;
//     }
//     if (types.includes('locality')) {
//       locationObj['city'] = addObj.long_name;
//     }
//   });
//   //locationObj.localities = postcode_localities;
//   if (locationObj.country) {
//     pincodeLocationDetails = {
//       country: locationObj.country,
//       state: locationObj.state,
//       city: locationObj.city,
//     };
//     return pincodeLocationDetails;
//   } else return null;
// };

export const getPincodeLocationDetails = async (pincode) => {
  if (!pincode || pincode.length !== 6) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = response.data?.[0];

    if (data?.Status === 'Success' && data?.PostOffice?.length > 0) {
      const postOffice = data.PostOffice[0];

      return {
        country: postOffice.Country || 'India',
        state: postOffice.State || '',
        city: postOffice.Region || '',
      };
    } else {
      console.error('Invalid Pincode or No Data Found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching pincode location:', error);
    return null;
  }
};

export const loadCountries = () => {
  const countriesList = [];
  let selectedCodeCountryName = '';
  Country.getAllCountries().forEach((country) => {
    countriesList.push(country.name);
    countryISOCodeMap.set(country.name, country.isoCode);
    if (!phoneNumberCodes.includes(country.phonecode)) {
      const code = country.phonecode.startsWith('+')
        ? country.phonecode
        : `+${country.phonecode}`;
      phoneNumberCodes.push(code);
      phoneCountryCodeMap.push({
        code: code,
        name: country.name,
      });
      countryCodeMap.set(country.name, code);
    }
  });
  return { countriesList, phoneCountryCodeMap };
};

export const loadStates = (country) => {
  const statesList = State.getStatesOfCountry(
    countryISOCodeMap.get(country) || ''
  );
  const tempStateList = [];
  statesList.forEach((state) => {
    stateCodeMap.set(state.name, state);
    tempStateList.push(state.name);
  });
  return tempStateList || [];
};

export const loadCities = (state) => {
  const selectedStateData = stateCodeMap.get(state) || {};
  let cityList =
    City.getCitiesOfState(
      selectedStateData.countryCode,
      selectedStateData.isoCode
    ) || [];
  if (!!cityList) {
    cityList = cityList.map((city) => {
      return city.name;
    });
  }
  return cityList || [];
};

export const loadIndianStates = () => {
  const statesList = State.getStatesOfCountry('IN');

  return statesList
    .map((state) => ({
      value: state.name,
      label: state.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const loadAllIndianCities = () => {
  const citiesList = City.getAllCities().filter(
    (city) => city.countryCode === 'IN'
  );

  const formattedCities = citiesList
    .map((city) => ({
      value: city.name,
      label: city.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const allIndiaOption = {
    value: 'All India',
    label: 'All India',
  };

  formattedCities.unshift(allIndiaOption);

  return formattedCities;
};

export const loadOnlyCountries = () => {
  return Country.getAllCountries()
    .map((country) => ({
      value: country.name,
      label: country.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
