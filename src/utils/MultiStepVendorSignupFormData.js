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
              { label: 'Individual', value: 'Individual' },
              { label: 'Sole Proprietorship', value: 'sole_proprietership' },
              { label: 'Limited Liability Partnership (LLP)', value: 'llp' },
              { label: 'Private limited company', value: 'privateltd' },
              { label: 'Public limited company', value: 'publicltd' },
            ],
          },
          {
            label: 'Company name',
            name: 'company_name',
            type: 'text',
            required: true,
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
            label: 'CEO/Owner name',
            name: 'owner_name',
            type: 'text',
            required: false,
          },
          {
            label: "CEO/Owner's Email ID",
            name: 'owner_email',
            type: 'email',
            required: false,
          },
          {
            label: "CEO/Owner's mobile number",
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
            label: 'Country',
            name: 'country',
            type: 'select',
            required: true,
            options: [],
          },
          {
            label: 'Pin code/ZIP code',
            name: 'pincode',
            type: 'text',
            required: true,
            pattern: /^\d{6}$/,
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
            label: 'Referred by',
            name: 'referred_by',
            type: 'text',
            required: false,
          },
          {
            label: 'Digital signature',
            name: 'digital_signature',
            type: 'file',
            required: true,
          },
          {
            label: 'Upload brand logo',
            name: 'brand_logo',
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
      {
        heading: 'Other details',
        fields: [
          { label: 'PAN Number', name: 'PAN', type: 'text', required: true },
          { label: 'CIN Number', name: 'CIN', type: 'text', required: true },
          { label: 'GST Number', name: 'GST', type: 'text', required: true },
          {
            label: 'Are you registered under MSME?',
            name: 'MSME_registered',
            type: 'select',
            options: [
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ],
            required: true,
          },
          {
            label: 'Upload MSME Certificate',
            name: 'msme_certificate',
            type: 'file',
            required: true,
          },
        ],
      },
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
  digital_signature: {
    message: 'Accepted: Only PNG, JPG, JPEG (Max: 2MB)',
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  },
  brand_logo: {
    message: 'Accepted: Only PNG, JPG, JPEG, SVG (Max: 2MB)',
    maxSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'],
  },
  msme_certificate: {
    message: 'Accepted: PDF & Images (Max: 5MB)',
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
  },
};
