const steps = [
  {
    step: 1,
    title: "Company Details",
    sections: [
      {
        heading: "Company details",
        fields: [
          { label: "Company name", name: "company_name", type: "text", required: true },
          { label: "Company type", name: "company_type", type: "select", options: ["Individual","Tutoring"], required: false },
          { label: "Website", name: "website", type: "url", required: false },
          { label: "Landline number", name: "landline_number", type: "text", required: false },
        ],
      },
      {
        heading: "Contact person's details",
        fields: [
          { label: "Contact person name", name: "contact_person_name", type: "text", required: true },
          { label: "Contact person's Email ID", name: "contact_person_email", type: "email", required: true },
          {
            label: "Contact person's mobile number",
            name: "contact_person_mobile",
            type: "mobile",
            required: true,
            structure: { country_code: true, number: true },
          },
        ],
      },
      {
        heading: "CEO/Owner details",
        fields: [
          { label: "CEO/Owner name", name: "owner_name", type: "text", required: true },
          { label: "CEO/Owner's Email ID", name: "owner_email", type: "email", required: true },
          {
            label: "Contact person's mobile number",
            name: "owner_mobile",
            type: "mobile",
            required: true,
            structure: { country_code: true, number: true },
          },
        ],
      },
      {
        heading: "Address",
        fields: [
          { label: "Country", name: "country", type: "select", options:["India"], required: true },
          { label: "Pin code/ZIP code", name: "pincode", type: "text", required: true, pattern: /^\d{6}$/ },
          { label: "State", name: "state", type: "text", required: true },
          { label: "City", name: "city", type: "text", required: true },
          { label: "Address line 1", name: "address_line_1", type: "text", required: true },
          { label: "Address line 2", name: "address_line_2", type: "text", required: false },
        ],
      },
    ],
  },
  {
    step: 2,
    title: "Compliance Details",
    sections: [
      {
        heading: "Bank details",
        fields: [
          { label: "Bank name", name: "bank_name", type: "text", required: false },
          { label: "Account type", name: "bank_account_type", type: "text", required: false },
          { label: "Bank account number", name: "bank_account_number", type: "text", required: true },
          { label: "IFSC number", name: "bank_ifcs", type: "text", required: true },
        ],
      },
      {
        heading: "Other details",
        fields: [
          { label: "PAN", name: "PAN", type: "text", required: false },
          { label: "CIN", name: "CIN", type: "text", required: false },
          { label: "GST", name: "GST", type: "text", required: false },
          {
            label: "Are you registered under MSME?",
            name: "MSME_registered",
            type: "select",
            options: ["Yes", "No"],
            required: true,
          },
        ],
      },
    ],
  },
  {
    step: 3,
    title: "Product Details",
    sections: [
      {
        heading: "Basic details",
        fields: [
          { label: "Product Title", name: "product_title", type: "text", required: true },
          { label: "Service provided since", name: "service_since", type: "date", required: false },
          { label: "Courses level", name: "courses_level", type: "text", required: false },
        ],
      },
      {
        heading: "Service locations",
        fields: [
          { label: "Countries serviced", name: "countries_serviced", type: "text", required: false },
          { label: "Cities serviced", name: "cities_serviced", type: "text", required: false },
        ],
      },
      {
        heading: "Additional details",
        fields: [
          { label: "Product description", name: "product_description", type: "textarea", required: false },
          { label: "Product unique selling point", name: "product_usp", type: "textarea", required: false },
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
            options: ["USD", "INR", "EUR"],
            required: true,
          },
          { label: "Discount", name: "discount", type: "number", required: false },
          { label: "Final Price", name: "final_price", type: "number", required: true },
        ],
      },
      {
        heading: "Marketing materials",
        fields: [
          { label: "Google reviews/rating", name: "google_reviews", type: "text", required: false },
          { label: "Upload brand logo", name: "brand_logo", type: "file", required: false },
          { label: "Upload product image/video", name: "product_media", type: "file", required: false },
        ],
      },
    ],
  },
];

export default steps;
