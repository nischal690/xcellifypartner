import * as yup from "yup";

const signupValidationSchemas = [
  // Step 1: Company Details
  yup.object().shape({
    company_name: yup.string().required("Company name is required."),
    company_type: yup.string().nullable(), // Optional
    website: yup.string()
      .matches(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,"Website must be a valid URL.")
      .nullable(),
    landline_number: yup
      .string()
      .nullable()
      .test(
        "is-valid-landline",
        "Landline number must contain only numbers.",
        (value) => !value || /^\d+$/.test(value) // Validates only if value is not empty
      ),
    contact_person_name: yup
      .string()
      .required("Contact person name is required."),
    contact_person_email: yup
      .string()
      .email("Contact person's email must be valid.")
      .required("Contact person's email is required."),
    contact_person_mobile: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Contact person's mobile number is required."),
    owner_name: yup.string().required("CEO/Owner name is required."),
    owner_email: yup
      .string()
      .email("CEO/Owner's email must be valid.")
      .required("CEO/Owner's email is required."),
    owner_mobile: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("CEO/Owner's mobile number is required."),
    country: yup.string().required("Country is required."),
    pincode: yup
      .string()
      .required("Pin code is required.")
      .matches(/^\d+$/, "Invalid pincode"),
    state: yup.string().required("State is required."),
    city: yup.string().required("City is required."),
    address_line_1: yup.string().required("Address line 1 is required."),
    address_line_2: yup.string().nullable(),
  }),
  // Step 2: Compliance Details
  yup.object().shape({
    bank_name: yup.string().nullable(),
    account_type: yup.string().nullable(),
    bank_account_number: yup
      .string()
      .required("Bank account number is required.")
      .matches(/^\d+$/, "Bank account number must contain only numbers."),
    bank_ifsc: yup
      .string()
      .required("IFSC number is required.")
      .matches(/^/, "Invalid IFSC number."),
    PAN: yup.string().nullable().matches(/^/, "Invalid PAN format."),
    CIN: yup.string().nullable(),
    GST: yup.string().nullable().matches(/^/, "Invalid GST format."),
    MSME_registered: yup.string().required("Please specify MSME registration."),
    msme_certificate: yup.mixed().nullable(),
  }),
  // Step 3: Product Details
  yup.object().shape({
    product_title: yup.string().required("Product title is required."),
    service_since: yup
      .date()
      .required()
      .nullable() // Allow null
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Service since must be a valid date."),
    courses_level: yup.string().nullable(),
    countries_serviced: yup.string().nullable(),
    cities_serviced: yup.string().nullable(),
    product_description: yup.string().nullable(),
    product_usp: yup.string().nullable(),
    price: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ) // Convert empty string to null
      .required("Price is required.")
      .min(0, "Price cannot be negative.")
      .typeError("Price must be a valid number."),
    currency: yup.string().required("Currency is required."),
    discount: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .min(0, "Discount cannot be negative.")
      .max(100, "Discount cannot exceed 100%.")
      .typeError("Discount must be a valid number."),
    final_price: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Final price is required.")
      .min(0, "Final price cannot be negative.")
      .typeError("Final price must be a valid number."),
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
