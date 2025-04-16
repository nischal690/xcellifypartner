import * as yup from 'yup';

const fileValidation = yup
  .mixed()
  .required('File is required.')
  .test(
    'fileType',
    'Only PDF, JPEG, JPG, or PNG files are allowed.',
    (value) => {
      return (
        value &&
        ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(
          value.type
        )
      );
    }
  )
  .test('fileSize', 'Required & File size should not exceed 2MB.', (value) => {
    return value && value.size <= 2 * 1024 * 1024;
  });

const signupValidationSchemas = [
  // Step 1: Company Details
  yup.object().shape({
    company_name: yup.string().when('company_type', {
      is: (value) => value === 'Individual',
      then: () => yup.string().nullable(),
      otherwise: () => yup.string().required('Company name is required'),
    }),
    company_type: yup.string().required('Company type is required'),
    GST: yup.string().when('company_type', {
      is: (value) => value === 'sole_proprietership' || value === 'Individual',
      then: () => yup.string().notRequired(),
      otherwise: () =>
        yup
          .string()
          .required('GST is required for this company type.')
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            'Invalid GST format'
          ),
    }),
    PAN: yup.string().when('company_type', {
      then: () => yup.string().required('PAN is required.'), // Required for Individual
      otherwise: () => yup.string().required('PAN is required for companies.'), // Required for other companies
    }),
    CIN: yup.string().when('company_type', {
      is: (value) =>
        value === 'Individual' ||
        value === 'partnership' ||
        value === 'sole_proprietership',
      then: () => yup.string().nullable(), // Not required for Individual
      otherwise: () => yup.string().required('CIN is required for companies.'), // Required for other companies
    }),

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
    google_rating: yup.string().nullable(),
    google_rating_url: yup.string().nullable(),
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
    signature: yup
      .mixed()
      .test('required', 'Digital signature is required', (value) => {
        return value && value instanceof File;
      })
      .test('fileFormat', 'Only PNG, JPG, JPEG files are allowed', (value) => {
        if (!value) return true; // Skip if no file
        return ['image/png', 'image/jpg', 'image/jpeg'].includes(value.type);
      })
      .test('fileSize', 'File size should not exceed 2MB', (value) => {
        if (!value) return true; // Skip if no file
        return value.size <= 2 * 1024 * 1024; // 2MB size limit
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

      supplier_declaration: yup
      .mixed()
      .required('Supplier Declaration file is required.')
      .test(
        'fileFormat',
        'Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed',
        (value) => {
          if (!value) return false;
          return [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'image/jpg',
          ].includes(value.type);
        }
      )
      .test('fileSize', 'File size should not exceed 2MB', (value) => {
        return value && value.size <= 2 * 1024 * 1024;
      }),
    
    referred_by: yup
      .string()
      .nullable()
      .test('is-email', 'Enter a valid email', (value) => {
        if (!value) return true; // Allows null or empty values
        return yup.string().email().isValidSync(value);
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
    // PAN: yup.string().when('company_type', {
    //   then: () => yup.string().required('PAN is required.'), // Required for Individual
    //   otherwise: () => yup.string().required('PAN is required for companies.'), // Required for other companies
    // }),
    // coi_aadhar: yup.string().required('Aadhar / COI / CIN is required'),

    // CIN: yup.string().when('company_type', {
    //   is: (value) => value === 'Individual',
    //   then: () => yup.string().nullable(), // Not required for Individual
    //   otherwise: () => yup.string().required('CIN is required for companies.'), // Required for other companies
    // }),

    // GST: yup.string().when('company_type', {
    //   is: (value) => value === 'sole_proprietership' || value === 'Individual',
    //   then: () => yup.string().notRequired(),
    //   otherwise: () =>
    //     yup
    //       .string()
    //       .required('GST is required for this company type.')
    //       .matches(
    //         /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    //         'Invalid GST format'
    //       ),
    // }),

    // gst: yup.mixed().when('company_type', {
    //   is: (value) => value === 'sole_proprietership' || value === 'Individual',
    //   then: () => yup.mixed().notRequired(),
    //   otherwise: () => fileValidation.clone().required('GST file is required.'),
    // }),

    // aadhar_coi: fileValidation
    //   .clone()
    //   .required('Aadhar or COI file is required.'),

    // pan_card: fileValidation.clone().required('PAN card file is required.'),

    // MSME_registered: yup.string().required('Please specify MSME registration.'),

    // gst_declaration: yup.mixed().when('company_type', {
    //   is: (value) => value === 'sole_proprietership' || value === 'Individual',
    //   then: () => yup.mixed().notRequired(),
    //   otherwise: () =>
    //     yup
    //       .mixed()
    //       .required('GST Declaration file is required.')
    //       .test(
    //         'fileFormat',
    //         'Only PDF, DOC, DOCX, JPG, JPEG, or PNG files are allowed',
    //         (value) => {
    //           if (!value) return false;
    //           return [
    //             'application/pdf',
    //             'application/msword',
    //             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //             'image/png',
    //             'image/jpeg',
    //             'image/jpg',
    //           ].includes(value.type);
    //         }
    //       )
    //       .test('fileSize', 'File size should not exceed 2MB', (value) => {
    //         return value && value.size <= 2 * 1024 * 1024;
    //       }),
    // }),

    // cancelled_cheque: fileValidation
    //   .clone()
    //   .required('Cancelled Cheque file is required.'),

    msme_certificate: yup.mixed().when('MSME_registered', {
      is: (value) => value === 'Yes',
      then: () =>
        yup
          .mixed()
          .test(
            'required',
            'MSME Certificate is required when registered under MSME',
            (value) => value && value instanceof File
          )
          .test(
            'fileFormat',
            'Only PDF, PNG, JPG, JPEG files are allowed',
            (value) => {
              if (!value) return true; // Skip check if no file
              return [
                'application/pdf',
                'image/png',
                'image/jpg',
                'image/jpeg',
              ].includes(value.type);
            }
          )
          .test('fileSize', 'File size should not exceed 5MB', (value) => {
            if (!value) return true; // Skip check if no file
            return value.size <= 5 * 1024 * 1024; // 5MB size limit
          }),
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
