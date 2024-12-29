import * as Yup from "yup";
export const ProductDetailsData = [
  {
    title: "Product Details",
    categoryFields: {
      "Study overseas": [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Service provided since",
              name: "service_provided_since",
              type: "number",
              required: false,
            },
            {
              label: "Study level",
              name: "study_level",
              type: "select",
              options: ["UG", "PG"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "text",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations",
          fields: [
            {
              label: "Study destination countries",
              name: "study_destination_countries",
              type: "select",
              options: ["Country 1", "Country 2"],
              required: false,
            },
            {
              label: "Study destination cities",
              name: "study_destination_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: false,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      "Study India": [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Service provided since",
              name: "service_provided_since",
              type: "number",
              required: false,
            },
            {
              label: "Study level",
              name: "study_level",
              type: "select",
              options: ["UG", "PG"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations",
          fields: [
            {
              label: "Study destination states",
              name: "study_destination_states",
              type: "select",
              options: ["State 1", "State 2"],
              required: false,
            },
            {
              label: "Study destination cities",
              name: "study_destination_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "text",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      Tutoring: [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Subjects",
              name: "subjects",
              type: "select",
              options: ["Subject 1", "Subject 2"],
              required: true,
            },
            {
              label: "Education qualification",
              name: "education_qualification",
              type: "text",
              required: false,
            },
            {
              label: "Member since",
              name: "member_since",
              type: "text",
              required: false,
            },
            {
              label: "Mode of teaching",
              name: "mode_of_teaching",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
            {
              label: "Study level",
              name: "study_level",
              type: "select",
              options: ["UG", "PG"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations",
          fields: [
            {
              label: "Cities where service is available",
              name: "service_available_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Can travel up to",
              name: "travel_upto",
              type: "select",
              options: ["5 km", "10 km"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "text",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      "Career counselling": [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Education qualification",
              name: "education_qualification",
              type: "text",
              required: false,
            },
            {
              label: "Member since",
              name: "member_since",
              type: "text",
              required: false,
            },
            {
              label: "Counselling duration in hours",
              name: "counselling_duration",
              type: "number",
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations",
          fields: [
            {
              label: "Study destination country",
              name: "study_destination_countries",
              type: "select",
              options: ["Country 1", "Country 2"],
              required: false,
            },
            {
              label: "Cities where service is available",
              name: "service_available_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      "Summer courses": [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Age group",
              name: "age_group",
              type: "text",
              required: false,
            },
            {
              label: "Duration",
              name: "duration",
              type: "text",
              required: false,
            },
            {
              label: "Program eligibility",
              name: "program_eligibility",
              type: "select",
              options: ["10th Class", "12th Class", "Graduate"],
              required: false,
            },
            {
              label: "Scholarship available ",
              name: "scholarship_available",
              type: "select",
              options: ["Yes", "No"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations",
          fields: [
            {
              label: "Study destination country",
              name: "study_destination_countries",
              type: "select",
              options: ["Country 1", "Country 2"],
              required: false,
            },
            {
              label: "Cities where service is available",
              name: "service_available_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      Events: [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Event title",
              name: "event_title",
              type: "text",
              required: true,
            },
            {
              label: "Event location",
              name: "event_location",
              type: "text",
              required: false,
            },
            {
              label: "Event category",
              name: "event_category",
              type: "select",
              options: ["Category 1", "Category 2"],
              required: false,
            },
            {
              label: "Age group",
              name: "age_group",
              type: "select",
              options: ["Age group 1", "Age group 2"],
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
            {
              label: "Event delivery",
              name: "event_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
            {
              label: "Event registration deadline",
              name: "event_registration_deadline",
              type: "date",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      "Study Finance": [
        {
          heading: "Subcategory",
          fields: [
            {
              label: "Subcategory",
              name: "subcategory",
              type: "select",
              options: ["Scholarship", "Education Loan"],
              required: true,
            },
          ],
        },
        // Scholarship Form
        {
          heading: "Basic details (g)",
          subcategory: "Scholarship", // Render only for Scholarship
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Loan for study level",
              name: "loan_for_study_level",
              type: "select",
              options: ["Undergraduate", "Postgraduate"],
              required: false,
            },
            {
              label: "Loan duration",
              name: "loan_duration",
              type: "select",
              options: ["1 year", "2 years", "3 years"],
              required: false,
            },
            {
              label: "Loan eligibility",
              name: "loan_eligibility",
              type: "text",
              required: false,
            },
            {
              label: "Whether 100% Financing Available",
              name: "full_financing_available",
              type: "select",
              options: ["Yes", "No"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations (Scholarship)",
          subcategory: "Scholarship",
          fields: [
            {
              label: "List of Countries Loan Available for",
              name: "loan_available_countries",
              type: "select",
              options: ["Country 1", "Country 2"],
              required: false,
            },
            {
              label: "Cities where service is available",
              name: "service_available_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details (Scholarship)",
          subcategory: "Scholarship",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing (Scholarship)",
          subcategory: "Scholarship",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials (Scholarship)",
          subcategory: "Scholarship",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
        // Education Loan Form
        {
          heading: "Basic details (Education Loan)",
          subcategory: "Education Loan",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Loan for study level",
              name: "loan_for_study_level",
              type: "select",
              options: ["Undergraduate", "Postgraduate"],
              required: false,
            },
            {
              label: "Loan duration",
              name: "loan_duration",
              type: "select",
              options: ["1 year", "2 years", "3 years"],
              required: false,
            },
            {
              label: "Loan eligibility",
              name: "loan_eligibility",
              type: "text",
              required: false,
            },
            {
              label: "Whether 100% Financing Available",
              name: "full_financing_available",
              type: "select",
              options: ["Yes", "No"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Service locations (Education Loan)",
          subcategory: "Education Loan",
          fields: [
            {
              label: "List of Countries Loan Available for",
              name: "loan_available_countries",
              type: "select",
              options: ["Country 1", "Country 2"],
              required: false,
            },
            {
              label: "Cities where service is available",
              name: "service_available_cities",
              type: "select",
              options: ["City 1", "City 2"],
              required: false,
            },
            {
              label: "Service delivery",
              name: "service_delivery",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
          ],
        },
        {
          heading: "Additional details (Education Loan)",
          subcategory: "Education Loan",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing (Education Loan)",
          subcategory: "Education Loan",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials (Education Loan)",
          subcategory: "Education Loan",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "text",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],

      Merchandise: [
        {
          heading: "Basic details",
          fields: [
            {
              label: "Product Title",
              name: "product_title",
              type: "text",
              required: true,
            },
            {
              label: "Product category",
              name: "category",
              type: "select",
              options: ["Category 1", "Category 2"],
              required: false,
            },
            {
              label: "Member since",
              name: "member_since",
              type: "text",
              required: false,
            },
            {
              label: "Mode of teaching",
              name: "mode_of_teaching",
              type: "select",
              options: ["Online", "Offline"],
              required: false,
            },
            {
              label: "Product code",
              name: "product_code",
              type: "text",
              required: false,
            },
            {
              label: "HSN code",
              name: "hsn_code",
              type: "text",
              required: false,
            },
            {
              label: "GST rate",
              name: "gst_rate",
              type: "number",
              required: false,
            },
          ],
        },
        {
          heading: "Additional details",
          fields: [
            {
              label: "Product description",
              name: "product_description",
              type: "textarea",
              required: false,
            },
            {
              label: "Product unique selling point",
              name: "product_unique_selling_point",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          heading: "Pricing",
          fields: [
            { label: "Price", name: "price", type: "number", required: true },
            {
              label: "Currency",
              name: "currency",
              type: "select",
              options: ["INR", "USD"],
              required: true,
            },
            {
              label: "Discount",
              name: "discount",
              type: "number",
              required: false,
            },
            {
              label: "Final price",
              name: "final_price",
              type: "number",
              required: true,
            },
          ],
        },
        {
          heading: "Marketing materials",
          fields: [
            {
              label: "Google reviews/rating",
              name: "google_reviews",
              type: "number",
              required: false,
            },
            {
              label: "Upload product images",
              name: "product_images",
              type: "file",
              required: false,
            },
            {
              label: "Upload product video",
              name: "product_videos",
              type: "file",
              required: false,
            },
          ],
        },
      ],
    },
  },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for images
export const MAX_MEDIA_SIZE = 20 * 1024 * 1024; // 20MB for media files

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4"];

export const validateFileUpload = (file, type) => {
  const maxSize = type === "product_images" ? MAX_FILE_SIZE : MAX_MEDIA_SIZE;

  if (file.size > maxSize) {
    toast.error(
      `File size should not exceed ${
        maxSize === MAX_FILE_SIZE ? "5MB" : "20MB"
      }`
    );
    return false;
  }

  if (type === "product_images") {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload an image file (JPG, JPEG, PNG)");
      return false;
    }
  } else if (type === "product_videos") {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error("Please upload a video file (MP4)");
      return false;
    }
  }

  return true;
};

const commonValidations = {
  product_title: Yup.string()
    .required("Product title is required")
    .min(3, "Product title must be at least 3 characters"),
  product_code: Yup.string()
    .matches(/^[A-Za-z0-9-]+$/, "Product code must be alphanumeric")
    .required("Product code is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  currency: Yup.string().required("Currency is required").oneOf(["INR", "USD"]),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  final_price: Yup.number()
    .required("Final price is required")
    .test(
      "is-less-than-price",
      "Final price must be less than or equal to the original price",
      function (value) {
        const price = this.parent.price || 0;
        return !value || value <= price;
      }
    ),
  hsn_code: Yup.string()
    .matches(/^\d{6}$/, "HSN code must be exactly 6 digits")
    .required("HSN code is required"),
  gst_rate: Yup.number()
    .min(0, "GST rate cannot be negative")
    .max(100, "GST rate cannot exceed 100%"),
  product_description: Yup.string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  product_unique_selling_point: Yup.string()
    .min(50, "USP must be at least 50 characters")
    .max(1000, "USP must not exceed 1000 characters"),
  google_reviews: Yup.string().matches(
    /^[0-5](\.[0-9]{1,2})?$/,
    "Rating must be a number between 0 and 5, with up to two decimal places"
  ),
  product_images: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Image file is too large", (value) => {
          if (value instanceof File) {
            return value.size <= MAX_FILE_SIZE;
          }
          return true; // Pass validation for uploaded file IDs
        })
        .test(
          "fileFormat",
          "Please upload only image files (JPG, JPEG, PNG)",
          (value) => {
            if (value instanceof File) {
              return ALLOWED_IMAGE_TYPES.includes(value.type);
            }
            return true; // Pass validation for uploaded file IDs
          }
        )
    )
    .max(5, "You can upload up to 5 images"),

  product_videos: Yup.mixed()
    .nullable()
    .test("fileSize", "Video file is too large", (value) => {
      if (value instanceof File) {
        return value.size <= MAX_MEDIA_SIZE;
      }
      return true; // Pass validation for uploaded file IDs
    })
    .test("fileFormat", "Please upload only video files (MP4)", (value) => {
      if (value instanceof File) {
        return value.type === "video/mp4";
      }
      return true; // Pass validation for uploaded file IDs
    }),
};

export const validationSchemas = {
  "Study overseas": Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().oneOf(["UG", "PG"]),
    service_provided_since: Yup.date().max(
      new Date(),
      "Date cannot be in the future"
    ),
    study_destination_countries: Yup.string().required(
      "Destination country is required"
    ),
    study_destination_cities: Yup.string().required(
      "Destination city is required"
    ),
    service_delivery: Yup.string().oneOf(["Online", "Offline"]),
  }),

  "Study India": Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().oneOf(["UG", "PG"]),
    service_provided_since: Yup.date().max(new Date()),
    study_destination_states: Yup.string().required(
      "Destination State is required"
    ),
    study_destination_cities: Yup.string().required(
      "Destination city is required"
    ),
    service_delivery: Yup.string().oneOf(["Online", "Offline"]),
  }),

  Tutoring: Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().oneOf(["UG", "PG"]),
    subjects: Yup.string().required("Subject selection is required"),
    education_qualification: Yup.string().required(
      "Education qualification is required"
    ),
    member_since: Yup.date().max(new Date()),
    mode_of_teaching: Yup.string()
      .required("Teaching mode is required")
      .oneOf(["Online", "Offline"]),
    service_available_cities: Yup.string().required("Service city is required"),
    travel_upto: Yup.string().when("mode_of_teaching", {
      is: "Offline",
      then: Yup.string().required(
        "Travel range is required for offline teaching"
      ),
    }),
  }),
  "Career counselling": Yup.object().shape({
    ...commonValidations,
    education_qualification: Yup.string().required(
      "Education qualification is required"
    ),
    member_since: Yup.date().max(new Date()),
    counselling_duration: Yup.string().required(
      "Counselling duration is required"
    ),
    service_available_cities: Yup.string().required("Service city is required"),
    study_destination_countries: Yup.string().required(
      "Study destination is required"
    ),
    service_delivery: Yup.string().oneOf(["Online", "Offline"]),
  }),

  "Summer courses": Yup.object().shape({
    ...commonValidations,
    age_group: Yup.string().required("Age group is required"),
    duration: Yup.string().required("Duration is required"),
    program_eligibility: Yup.string().required(
      "Program eligibility is required"
    ),
    scholarship_available: Yup.string().oneOf(["Yes", "No"]),
    study_destination_countries: Yup.string().required(
      "Study destination is required"
    ),
    service_available_cities: Yup.string().required("Service city is required"),
    service_delivery: Yup.string().oneOf(["Online", "Offline"]),
  }),

  Events: Yup.object().shape({
    // product_title: Yup.string()
    // .required("Product title is required")
    // .min(3, "Product title must be at least 3 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    currency: Yup.string()
      .required("Currency is required")
      .oneOf(["INR", "USD"]),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%"),
    final_price: Yup.number()
      .required("Final price is required")
      .test(
        "is-less-than-price",
        "Final price must be less than or equal to the original price",
        function (value) {
          const price = this.parent.price || 0;
          return !value || value <= price;
        }
      ),
    hsn_code: Yup.string()
      .matches(/^\d{6}$/, "HSN code must be exactly 6 digits")
      .required("HSN code is required"),
    gst_rate: Yup.number()
      .min(0, "GST rate cannot be negative")
      .max(100, "GST rate cannot exceed 100%"),
    product_description: Yup.string()
      .min(50, "Description must be at least 50 characters")
      .max(1000, "Description must not exceed 1000 characters"),
    product_unique_selling_point: Yup.string()
      .min(50, "USP must be at least 50 characters")
      .max(1000, "USP must not exceed 1000 characters"),
    google_reviews: Yup.string().matches(
      /^[0-5](\.[0-9]{1,2})?$/,
      "Rating must be a number between 0 and 5, with up to two decimal places"
    ),
    brand_logo: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "File is too large",
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        "Unsupported file format",
        (value) => !value || SUPPORTED_FORMATS.includes(value.type)
      ),
    product_media: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "File is too large",
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        "fileFormat",
        "Unsupported file format",
        (value) => !value || SUPPORTED_FORMATS.includes(value.type)
      ),
    event_title: Yup.string().required("Event title is required"),
    event_location: Yup.string().required("Event location is required"),
    event_category: Yup.string().required("Event category is required"),
    age_group: Yup.string().required("Age group is required"),
    event_delivery: Yup.string().oneOf(["Online", "Offline"]),
    event_registration_deadline: Yup.date().min(
      new Date(),
      "Registration deadline must be in the future"
    ),
  }),

  "Study Finance": Yup.object().shape({
    ...commonValidations,
    subcategory: Yup.string().required("Subcategory is required"),
    loan_for_study_level: Yup.string().required("Study level is required"),
    loan_duration: Yup.string().required("Loan duration is required"),
    loan_eligibility: Yup.string().required("Loan eligibility is required"),
    full_financing_available: Yup.string().oneOf(["Yes", "No"]), // true or false
    loan_available_countries: Yup.string().required(
      "Country selection is required"
    ),
    service_delivery: Yup.string().oneOf(["Online", "Offline"]),
    service_available_cities: Yup.string().required("Service city is required"),
  }),

  Merchandise: Yup.object().shape({
    ...commonValidations,
    category: Yup.string().required("Product category is required"),
    member_since: Yup.date().max(new Date()),
    mode_of_teaching: Yup.string().required("Mode of teaching is required"),
  }),
};

export const validateField = async (category, fieldName, value) => {
  try {
    const schema = validationSchemas[category];

    if (!schema) {
      throw new Error(
        `Validation schema for category "${category}" is not defined.`
      );
    }

    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const validateForm = async (category, formData) => {
  try {
    const schema = validationSchemas[category];

    if (!schema) {
      throw new Error(
        `Validation schema for category "${category}" is not defined.`
      );
    }

    await schema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner?.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};
