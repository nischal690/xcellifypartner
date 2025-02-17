import * as yup from 'yup';

const signupValidationSchemas = [
  // Step 1: Company Details
  yup.object().shape({
    company_name: yup.string().when('company_type', {
      is: (value) => value === 'Individual',
      then: () => yup.string().nullable(),
      otherwise: () => yup.string().required('Company name is required'),
    }),
    company_type: yup.string().required('Company type is required'),

    // Optional
    website: yup.string().nullable(),
    landline_number: yup
      .string()
      .nullable()
      .test(
        'is-valid-landline',
        'Landline number must contain only numbers.',
        (value) => !value || /^\d+$/.test(value) // Validates only if value is not empty
      ),
    STD_code: yup
      .string()
      .nullable()
      .test(
        'is-valid-STD',
        'STD code must contain only numbers.',
        (value) => !value || /^\d+$/.test(value) // Validates only if value is not empty
      ),
    contact_person_name: yup
      .string()
      .required('Contact person name is required.'),
    contact_person_email: yup
      .string()
      .email("Contact person's email must be valid.")
      .required("Contact person's email is required."),
    contact_person_mobile: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .required("Contact person's mobile number is required."),
    owner_name: yup.string(),
    owner_email: yup.string().email("CEO/Owner's email must be valid."),
    owner_mobile: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      ),
    country: yup.string().required('Country is required.'),
    pincode: yup
      .string()
      .required('Pin code is required.')
      .matches(/^\d+$/, 'Invalid pincode'),
    state: yup.string().required('State is required.'),
    city: yup.string().required('City is required.'),
    address_line_1: yup.string().required('Address line 1 is required.'),
    address_line_2: yup.string().nullable(),
    digital_signature: yup
      .mixed()
      .test('required', 'Digital signature is required', (value) => {
        return value && value instanceof File;
      }),
    brand_logo: yup
      .mixed()
      .nullable()
      .test(
        'fileType',
        'Unsupported file format. Only images and SVGs are allowed.',
        (value) => {
          if (!value) return true;
          return (
            value &&
            ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(
              value.type
            )
          );
        }
      )
      .test('fileSize', 'File size should not exceed 2MB.', (value) => {
        if (!value) return true;
        return value && value.size <= 2 * 1024 * 1024;
      }),
  }),
  // Step 2: Compliance Details
  yup.object().shape({
    bank_name: yup.string().required('Bank name is required.'),
    bank_account_type: yup.string().required('Account type is required.'),
    bank_account_number: yup
      .string()
      .required('Bank account number is required.')
      .matches(/^\d+$/, 'Bank account number must contain only numbers.'),
    bank_ifsc: yup
      .string()
      .required('IFSC number is required.')
      .matches(/^/, 'Invalid IFSC number.'),
    PAN: yup.string().when('company_type', {
      then: () => yup.string().required('PAN is required.'), // Required for Individual
      otherwise: () => yup.string().required('PAN is required for companies.'), // Required for other companies
    }),
    CIN: yup.string().when('company_type', {
      is: (value) => value === 'Individual',
      then: () => yup.string().nullable(), // Not required for Individual
      otherwise: () => yup.string().required('CIN is required for companies.'), // Required for other companies
    }),

    GST: yup.string().when('company_type', {
      is: (value) => value === 'Individual',
      then: () => yup.string().nullable(), // Not required for Individual
      otherwise: () =>
        yup
          .string()
          .required('GST is required for companies.')
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            'Invalid GST format'
          ), // Required and validated for other companies
    }),
    MSME_registered: yup.string().required('Please specify MSME registration.'),

    msme_certificate: yup.mixed().when('MSME_registered', {
      is: (value) => value === 'Yes',
      then: () =>
        yup
          .mixed()
          .test(
            'required',
            'MSME Certificate is required when registered under MSME',
            (value) => {
              return value && value instanceof File; // Ensures a file is uploaded
            }
          ),
      otherwise: () => yup.mixed().nullable(),
    }),
  }),
  // Step 3: Product Details
  yup.object().shape({
    product_title: yup.string().required('Product title is required.'),
    service_since: yup
      .date()
      .required()
      .nullable() // Allow null
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .typeError('Service since must be a valid date.'),
    courses_level: yup.string().nullable(),
    countries_serviced: yup.string().nullable(),
    cities_serviced: yup.string().nullable(),
    product_description: yup.string().nullable(),
    product_usp: yup.string().nullable(),
    price: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      ) // Convert empty string to null
      .required('Price is required.')
      .min(0, 'Price cannot be negative.')
      .typeError('Price must be a valid number.'),
    currency: yup.string().required('Currency is required.'),
    discount: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .min(0, 'Discount cannot be negative.')
      .max(100, 'Discount cannot exceed 100%.')
      .typeError('Discount must be a valid number.'),
    final_price: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .required('Final price is required.')
      .min(0, 'Final price cannot be negative.')
      .typeError('Final price must be a valid number.'),
    google_reviews: yup.string().nullable(),
    brand_logo: yup.mixed().nullable(),
    product_media: yup.mixed().nullable(),
  }),
];

export const validateStep = async (formData, currentStep) => {
  try {
    await signupValidationSchemas[currentStep].validate(formData, {
      abortEarly: false,
    });
    return {}; // No errors
  } catch (validationError) {
    return validationError.inner.reduce((errors, err) => {
      errors[err.path] = err.message;
      return errors;
    }, {});
  }
};

export default signupValidationSchemas;
