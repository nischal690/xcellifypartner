// SignUp Validation

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%]{6,}$/;
  return passwordRegex.test(password);
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateForm = ({ email, password, confirmPassword }) => {
  const errors = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(password)) {
    errors.password = 'Please the Enter Strong Password';
  }

  if (!validateConfirmPassword(password, confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// Vendor Validation

export const vendorBaiscInfoValidation = {
  company_name: /^[a-zA-Z0-9\s]{2,50}$/,
  website: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  owner_name: /^[a-zA-Z\s]{2,50}$/,
  owner_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  owner_mobile: /^[0-9]{10}$/,
  contact_person_name: /^[a-zA-Z\s]{2,50}$/,
  contact_person_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  contact_person_mobile: /^[0-9]{10}$/,
  STD_code: /^[0-9]{3,5}$/,
  landline_number: /^[0-9]{6,10}$/,
  CIN: /^[A-Za-z0-9]{21}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  address: /^[a-zA-Z0-9\s,.'-]{5,100}$/,
  pincode: /^[0-9]{6}$/,
  // MSME_registered: /^[a-zA-Z0-9\s]{2,50}$/, // Boolean validation
};

const vendorValidField = (name, value) => {
  const rule = vendorBaiscInfoValidation[name];
  if (rule) {
    return rule.test(value) ? '' : `Invalid ${name.replace('_', ' ')}`;
  }
  return '';
};

export default vendorValidField;

const hardcodedProfile = Object.freeze({
  company_name: 'Tech Solutions',
  website: 'https://techsolutions.com',
  owner_name: 'John Doe',
  owner_email: 'john.doe@example.com',
  owner_mobile: '1234567890',
  contact_person_name: 'Jane Smith',
  contact_person_email: 'jane.smith@example.com',
  contact_person_mobile: '9876543210',
  STD_code: '022',
  landline_number: '1234567',
  CIN: 'U12345MH2024PTC123456',
  GST: '27ABCDE1234F2Z5',
  PAN: 'ABCDE1234F',
  bank_account_number: '123456789012',
  bank_name: 'State Bank',
  bank_ifsc: 'SBIN0001234',
  bank_account_type: 'Savings',
  MSME_registered: 'Yes',
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  address: '123 Tech Street, Tech City',
  pincode: '400001',
  logo: 'profilePlaceholder.png',
});

// Truncate HTML properly while keeping formatting (limit to 145 chars)
export const truncateHTML = (html, maxLength) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html; // Parse HTML safely
  const textContent = tempDiv.innerText || tempDiv.textContent || '';

  return textContent.length > maxLength
    ? textContent.slice(0, maxLength) + '...'
    : textContent;
};
