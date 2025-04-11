const steps = [
  {
    step: 1,
    title: 'Company Details',
    sections: [
      {
        heading: 'Company details',
        fields: [
          {
            label: 'Company type',
            name: 'company_type',
            type: 'select',
            required: true,
            options: [
              { label: 'Private limited company', value: 'privateltd' },
              { label: 'Limited Liability Partnership (LLP)', value: 'llp' },
              { label: 'Partnership', value: 'partnership' },
              { label: 'Individual', value: 'Individual' },
              { label: 'Sole Proprietorship', value: 'sole_proprietership' },
            ],
          },
          {
            label: 'Do you have GST number?',
            name: 'hasGSTnumber',
            type: 'select',
            options: [
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ],
            required: true,
          },
          { label: 'GST Number', name: 'GST', type: 'text', required: true },
          { label: 'Enter Company PAN Number', label2: 'Enter PAN Number', name: 'PAN', type: 'text', required: true },
          {
            label: 'CIN',
            name: 'CIN',
            type: 'text',
            required: true,
          },   
          {
            label: 'Company name',
            name: 'company_name',
            type: 'text',
            required: false,
          },
          {
            label: 'Brand name',
            name: 'brand_name',
            type: 'text',
            required: false,
          },
          { label: 'Website', name: 'website', type: 'url', required: false },
          {
            label: 'STD Code',
            name: 'STD_code',
            type: 'text',
            required: false,
          },
          {
            label: 'Landline number',
            name: 'landline_number',
            type: 'text',
            required: false,
          },
        ],
      },
      {
        heading: "Contact person's details",
        fields: [
          {
            label: 'Contact person name',
            name: 'contact_person_name',
            type: 'text',
            required: true,
          },
          {
            label: "Contact person's Email ID",
            name: 'contact_person_email',
            type: 'email',
            required: true,
          },
          {
            label: "Country code",
            name: 'contact_person_country_code',
            type: 'select',
            required: true,
            options: [
              { label: "India (+91)", value: "+91" },
              { label: "United States (+1)", value: "+1" },
              { label: "Canada (+1)", value: "+1" },
              { label: "United Kingdom (+44)", value: "+44" },
              { label: "Australia (+61)", value: "+61" },
              { label: "Germany (+49)", value: "+49" },
              { label: "France (+33)", value: "+33" },
              { label: "China (+86)", value: "+86" },
              { label: "Japan (+81)", value: "+81" },
              { label: "Brazil (+55)", value: "+55" },
              { label: "South Africa (+27)", value: "+27" },
              { label: "United Arab Emirates (+971)", value: "+971" },
              { label: "Singapore (+65)", value: "+65" },
              { label: "Russia (+7)", value: "+7" },
              { label: "Mexico (+52)", value: "+52" }
            ],
          },
          {
            label: "Contact person's mobile number",
            name: 'contact_person_mobile',
            type: 'mobile',
            required: true,
            structure: { country_code: true, number: true },
          },
        ],
      },
      {
        heading: 'CEO/Owner details',
        fields: [
          {
            label: 'Other key person',
            name: 'owner_name',
            type: 'text',
            required: false,
          },
          {
            label: "Other key person Email ID",
            name: 'owner_email',
            type: 'email',
            required: false,
          },
          {
            label: "Country code",
            name: 'owner_country_code',
            type: 'select',
            required: false,
            options: [
              { label: "India (+91)", value: "+91" },
              { label: "United States (+1)", value: "+1" },
              { label: "Canada (+1)", value: "+1" },
              { label: "United Kingdom (+44)", value: "+44" },
              { label: "Australia (+61)", value: "+61" },
              { label: "Germany (+49)", value: "+49" },
              { label: "France (+33)", value: "+33" },
              { label: "China (+86)", value: "+86" },
              { label: "Japan (+81)", value: "+81" },
              { label: "Brazil (+55)", value: "+55" },
              { label: "South Africa (+27)", value: "+27" },
              { label: "United Arab Emirates (+971)", value: "+971" },
              { label: "Singapore (+65)", value: "+65" },
              { label: "Russia (+7)", value: "+7" },
              { label: "Mexico (+52)", value: "+52" }
            ],
          },
          {
            label: "Other key person mobile number",
            name: 'owner_mobile',
            type: 'mobile',
            required: false,
            structure: { country_code: true, number: true },
          },
        ],
      },
      {
        heading: 'Address',
        fields: [
          {
            label: 'Pin code/ZIP code',
            name: 'pincode',
            type: 'text',
            required: true,
            pattern: /^\d{6}$/,
          },
          {
            label: 'Country',
            name: 'country',
            type: 'select',
            required: true,
            options: [],
          },
          {
            label: 'State',
            name: 'state',
            type: 'select',
            required: true,
            options: [],
          },
          {
            label: 'City',
            name: 'city',
            type: 'select',
            required: true,
            options: [],
          },
          {
            label: 'Address line 1',
            name: 'address_line_1',
            type: 'text',
            required: true,
          },
          {
            label: 'Address line 2',
            name: 'address_line_2',
            type: 'text',
            required: false,
          },
        ],
      },
      {
        heading: 'Other details',
        fields: [
          {
            label: 'Referred by ( Registered Email ID)',
            name: 'referred_by',
            type: 'text',
            required: false,
          },
          {
            label: 'Digital Signature',
            name: 'signature',
            type: 'file',
            required: true,
          },
          {
            label: 'Upload brand logo',
            name: 'brand_logo',
            type: 'file',
            required: false,
          },
          {
            label: 'Upload Supplier Declaration Form',
            name: 'supplier_declaration',
            type: 'file',
            required: false,
          },
        ],
      },
    ],
  },
  {
    step: 2,
    title: 'Compliance Details',
    sections: [
      {
        heading: 'Bank details',
        fields: [
          {
            label: 'Account holder name',
            name: 'account_holder_name',
            type: 'text',
            required: true,
          },
          {
            label: 'Bank name',
            name: 'bank_name',
            type: 'text',
            required: true,
          },
          {
            label: 'Account type',
            name: 'bank_account_type',
            type: 'select',
            options: [
              { label: 'Current', value: 'current' },
              { label: 'Savings', value: 'savings' },
            ],
            required: true,
          },
          {
            label: 'Bank account number',
            name: 'bank_account_number',
            type: 'text',
            required: true,
          },
          {
            label: 'IFSC number',
            name: 'bank_ifsc',
            type: 'text',
            required: true,
          },
        ],
      },
      // {
        // heading: 'Other details',
        // fields: [
        //   {
        //     label: 'Aadhar / CIN',
        //     name: 'coi_aadhar',
        //     type: 'text',
        //     required: true,
        //   },
        //   {
        //     label: 'Upload Aadhar / CIN',
        //     name: 'aadhar_coi',
        //     type: 'file',
        //     required: true,
        //   },
        //   { label: 'PAN Number', name: 'PAN', type: 'text', required: true },
        //   {
        //     label: 'Upload PAN',
        //     name: 'pan_card',
        //     type: 'file',
        //     required: true,
        //   },
        //   // { label: 'CIN Number', name: 'CIN', type: 'text', required: true },
        //   // { label: 'GST Number', name: 'GST', type: 'text', required: true },
        //   {
        //     label: 'Upload GST ',
        //     name: 'gst',
        //     type: 'file',
        //     required: true,
        //   },
        //   {
        //     label: 'Are you registered under MSME?',
        //     name: 'MSME_registered',
        //     type: 'select',
        //     options: [
        //       { label: 'Yes', value: 'Yes' },
        //       { label: 'No', value: 'No' },
        //     ],
        //     required: true,
        //   },
        //   {
        //     label: 'Upload MSME Certificate',
        //     name: 'msme_certificate',
        //     type: 'file',
        //     required: true,
        //   },
        //   {
        //     label: 'Upload Partner / GST Declaration',
        //     name: 'gst_declaration',
        //     type: 'file',
        //     required: true,
        //   },
        //   {
        //     label: 'Upload Cancelled Cheque',
        //     name: 'cancelled_cheque',
        //     type: 'file',
        //     required: true,
        //   },
          // {
          //   label: 'Supplier Declaration',
          //   name: 'supplier_declaration',
          //   type: 'file',
          //   required: false,
          // },
      //   ],
      // },
    ],
  },
  {
    step: 3,
    title: 'Product Details',
    sections: [],
  },
];

export default steps;

export const fileUploadInfo = {
  signature: {
    message:
      "Upload your signature. We'll automatically remove the background.",
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  },
  brand_logo: {
    message: 'Accepted: Only PNG, JPG, JPEG, SVG (Max: 2MB)',
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'],
  },
};

export const fileHintMessage = 'Accepted: Only PDFs, PNG, JPG, JPEG (Max: 2MB)';

export const tourSteps = [
  {
    target: 'body',
    content:
      'Welcome to the onboarding journey! Let`s guide you through each step.',
    placement: 'center',
  },
  {
    target: '.step-indicators',
    content: 'Fill in all required details before proceeding to the next step.',
    placement: 'top',
  },
  {
    target: '.onboarding-logo',
    content: 'Click here to access the home dashboard and fill details later.',
    placement: 'bottom',
  },
  {
    target: '.profile-card',
    content: 'Click here to access your profile page and fill details later.',
    placement: 'bottom',
  },
  {
    target: '.logout-button',
    content: 'Click here to logout anytime.',
    placement: 'bottom',
  },
];
