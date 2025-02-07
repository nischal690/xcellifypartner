import { t } from 'i18next';
import * as Yup from 'yup';
export const ProductDetailsData = [
  {
    title: 'Product Details',
    categoryFields: {
      'Study overseas': [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Service provided since',
              name: 'service_provided_since',
              type: 'select',
              required: true,
              options: Array.from(
                { length: new Date().getFullYear() - 1700 + 1 },
                (_, i) => (new Date().getFullYear() - i).toString()
              ),
            },
            {
              label: 'Study level',
              name: 'study_level',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Education qualification',
              name: 'education_qualification',
              type: 'text',
              required: false,
            },
            // {
            //   label: 'Product code (if applicable)',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations',
          fields: [
            {
              label: 'Study destination countries',
              name: 'study_destination_countries',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Cities where service is available',
              name: 'service_available_cities',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Service delivery',
              name: 'service_delivery',
              type: 'multiselect',
              options: [],
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            { label: 'Price', name: 'price', type: 'number', required: false },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'number',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      'Study India': [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Service provided since',
              name: 'service_provided_since',
              type: 'select',
              options: Array.from(
                { length: new Date().getFullYear() - 1700 + 1 },
                (_, i) => (new Date().getFullYear() - i).toString()
              ),
              required: true,
            },
            {
              label: 'Study level',
              name: 'study_level',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Education qualification',
              name: 'education_qualification',
              type: 'text',
              required: false,
            },
            // {
            //   label: 'Product code (if applicable)',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations',
          fields: [
            // {
            //   label: 'Study destination states',
            //   name: 'study_destination_states',
            //   type: 'multiselect',
            //   options: [],
            //   required: false,
            // },
            {
              label: 'Cities where service is available',
              name: 'service_available_cities',
              type: 'multiselect',
              options: [],
              required: true,
            },
            // {
            //   label: 'Service delivery',
            //   name: 'service_delivery',
            //   type: 'select',
            //   options: ['Online', 'Offline'],
            //   required: false,
            // },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            { label: 'Price', name: 'price', type: 'number', required: false },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'text',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      Tutoring: [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Subjects',
              name: 'subjects',
              type: 'multiselect',
              options: [
                'Maths',
                'Science',
                'Physics',
                'Chemistry',
                'Biology',
                'Economics',
                'History',
                'Geography',
              ],
              required: true,
            },
            {
              label: 'Education qualification',
              name: 'education_qualification',
              type: 'text',
              required: true,
            },
            {
              label: 'Member since',
              name: 'member_since',
              type: 'select',
              options: Array.from(
                { length: new Date().getFullYear() - 1700 + 1 },
                (_, i) => (new Date().getFullYear() - i).toString()
              ),
              required: true,
            },
            {
              label: 'Mode of teaching',
              name: 'mode_of_teaching',
              type: 'multiselect',
              options: [
                'Online(1 on 1)',
                'Online(group)',
                'Physical(1 on 1)',
                'Physical(group)',
                'Home Visits',
              ],
              required: true,
            },
            {
              label: 'Study level',
              name: 'study_level',
              type: 'multiselect',
              options: ['6', '7', '8', '9', '10', '11', '12', 'Graduation'],
              required: true,
            },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations',
          fields: [
            {
              label: 'Cities where service is available',
              name: 'service_available_cities',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Can travel up to in km',
              name: 'travel_upto',
              type: 'select',
              options: [5, 10],
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            { label: 'Price', name: 'price', type: 'number', required: false },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'text',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      'Career counselling': [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Education qualification',
              name: 'education_qualification',
              type: 'text',
              required: false,
            },
            {
              label: 'Service provided since',
              name: 'service_provided_since',
              type: 'select',
              options: Array.from(
                { length: new Date().getFullYear() - 1700 + 1 },
                (_, i) => (new Date().getFullYear() - i).toString()
              ),
              required: true,
            },
            {
              label: 'Study level',
              name: 'study_level',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Counselling duration in hours',
              name: 'counselling_duration',
              type: 'number',
              required: true,
            },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations',
          fields: [
            {
              label: 'Study destination country',
              name: 'study_destination_countries',
              type: 'multiselect',
              options: [
                'India',
                'US',
                'Canada',
                'UK',
                'Europe',
                'Australia',
                'Asia',
              ],
              required: true,
            },
            {
              label: 'Cities where service is available',
              name: 'service_available_cities',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Service delivery',
              name: 'service_delivery',
              type: 'multiselect',
              options: [],
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            {
              label: 'Counselling fees per hour',
              name: 'price',
              type: 'number',
              required: false,
            },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price per hour',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'number',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      'Summer courses': [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Age group(based on grade)',
              name: 'age_group',
              type: 'select',
              options: ['6', '7', '8', '9', '10', '11', '12', 'Graduation'],
              required: true,
            },
            {
              label: 'Discipline',
              name: 'discipline',
              type: 'select',
              options: [
                'Arts, design and architecture',
                'Business Management',
                'Computer Science & IT',
                'Education & Training',
                'Engineering & Technology',
                ' Environmental Studies',
                ' Hospitality',
                'Sports',
                'Humanities',
                'Journalism & Media',
                'Law',
                'Medicine & Health',
                'Mathematics',
                'Social Science',
                'Others',
              ],
              required: true,
            },
            {
              label: 'Duration',
              name: 'duration',
              type: 'text',
              required: true,
            },
            {
              label: 'Program eligibility',
              name: 'program_eligibility',
              type: 'text',
              options: [],
              required: true,
            },
            {
              label: 'Application deadline',
              name: 'application_deadline',
              type: 'date',
              required: true,
            },
            {
              label: 'Scholarship available ',
              name: 'scholarship_available',
              type: 'select',
              options: ['Yes', 'No'],
              required: true,
            },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations',
          fields: [
            {
              label: 'Study destination country',
              name: 'study_destination_countries',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Cities where service is available',
              name: 'service_available_cities',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Service delivery',
              name: 'service_delivery',
              type: 'multiselect',
              options: [],
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Scholarship description',
              name: 'scholarship_description',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            { label: 'Price', name: 'price', type: 'number', required: false },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'number',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      Events: [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Event title',
              name: 'event_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Event location',
              name: 'event_location',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Event category',
              name: 'event_category',
              type: 'select',
              options: [
                'Quiz',
                'Hackathon',
                'Seminar',
                'MUN',
                'Debate',
                'Sports',
                'Art',
                'Drama',
                'Others',
              ],
              required: true,
            },
            {
              label: 'Age group min',
              name: 'age_group_min',
              type: 'number',
              required: true,
            },
            {
              label: 'Age group max',
              name: 'age_group_max',
              type: 'number',
              required: true,
            },
            {
              label: 'Event Eligibility',
              name: 'event_eligibility',
              type: 'text',
              required: true,
            },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Event delivery',
              name: 'event_delivery',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Event registration deadline',
              name: 'event_registration_deadline',
              type: 'date',
              required: true,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            {
              label: 'Event registration fees',
              name: 'price',
              type: 'number',
              required: false,
            },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: false,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      'Study Finance': [
        {
          heading: 'Subcategory',
          fields: [
            {
              label: 'Subcategory',
              name: 'subcategory',
              type: 'select',
              options: [
                'Student Education loan',
                'Student Education Scholarship',
              ],
              required: true,
            },
          ],
        },
        // Scholarship Form
        {
          heading: 'Basic details (education Scholarship)',
          subcategory: 'Student Education Scholarship', // Render only for Scholarship
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Scholarship For Study Level',
              name: 'loan_for_study_level',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Scholarship duration',
              name: 'loan_duration',
              type: 'text',
              required: true,
            },
            {
              label: 'Scholarship eligibility',
              name: 'loan_eligibility',
              type: 'text',
              required: false,
            },
            {
              label: 'Select Country/Origin',
              name: 'country_origin',
              type: 'select',
              options: ['national', 'international'],
              required: true,
            },
            {
              label: 'Category',
              name: 'scholarship_category',
              type: 'select',
              options: [
                'All',
                'General',
                'SC/ST/OBC',
                'Minority',
                'Girls',
                'Physically Challenged',
                'BPL',
              ],
              required: false,
            },
            {
              label: 'Type',
              name: 'scholarship_type',
              type: 'select',
              options: ['All', 'Scholarship', 'Fellowship'],
              required: false,
            },
            {
              label: 'Course',
              name: 'scholarship_course',
              type: 'select',
              options: [
                'All',
                'Engineering',
                'Medical',
                'Management',
                'Talent',
                'Sports',
                'Others',
              ],
              required: false,
            },
            // {
            //   label: 'Whether 100% Financing Available',
            //   name: 'full_financing_available',
            //   type: 'select',
            //   options: ['Yes', 'No'],
            //   required: false,
            // },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Service locations (Scholarship)',
          subcategory: 'Student Education Scholarship',
          fields: [
            // {
            //   label: 'List of Countries Loan Available for',
            //   name: 'loan_available_countries',
            //   type: 'multiselect',
            //   options: [],
            //   required: false,
            // },
            {
              label: 'Study destination countries',
              name: 'study_destination_countries',
              type: 'multiselect',
              options: [],
              required: true,
            },
            // {
            //   label: 'Cities where service is available',
            //   name: 'service_available_cities',
            //   type: 'multiselect',
            //   options: [],
            //   required: false,
            // },
            {
              label: 'Study destination states',
              name: 'study_destination_states',
              type: 'multiselect',
              options: [],
              required: false,
            },
            {
              label: 'Service delivery',
              name: 'service_delivery',
              type: 'select',
              options: ['Online', 'Offline'],
              required: false,
            },
          ],
        },
        {
          heading: 'Additional details (Scholarship)',
          subcategory: 'Student Education Scholarship',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        // {
        //   heading: 'Pricing (Scholarship)',
        //   subcategory: 'Student Education Scholarship',
        //   fields: [
        //     { label: 'Price', name: 'price', type: 'number', required: false },
        //     {
        //       label: 'Currency',
        //       name: 'currency',
        //       type: 'select',
        //       options: ['INR', 'USD'],
        //       required: false,
        //     },
        //     {
        //       label: 'Discount',
        //       name: 'discount',
        //       type: 'number',
        //       required: false,
        //     },
        //     {
        //       label: 'Final price',
        //       name: 'final_price',
        //       type: 'number',
        //       required: false,
        //     },
        //   ],
        // },
        {
          heading: 'Marketing materials (Scholarship)',
          subcategory: 'Student Education Scholarship',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'number',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
        // Education Loan Form
        {
          heading: 'Basic details (Education Loan)',
          subcategory: 'Student Education loan',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Loan for study level',
              name: 'loan_for_study_level',
              type: 'multiselect',
              options: [],
              required: true,
            },
            {
              label: 'Loan duration',
              name: 'loan_duration',
              type: 'number',
              required: false,
            },
            {
              label: 'Loan eligibility',
              name: 'loan_eligibility',
              type: 'text',
              required: false,
            },
            {
              label: 'Whether 100% Financing Available',
              name: 'full_financing_available',
              type: 'select',
              options: ['Yes', 'No'],
              required: false,
            },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Service locations (Education Loan)',
          subcategory: 'Student Education loan',
          fields: [
            // {
            //   label: 'List of Countries Loan Available for',
            //   name: 'loan_available_countries',
            //   type: 'select',
            //   options: ['Country 1', 'Country 2'],
            //   required: false,
            // },
            {
              label: 'Study destination countries',
              name: 'study_destination_countries',
              type: 'multiselect',
              options: [],
              required: true,
            },
            // {
            //   label: 'Cities where service is available',
            //   name: 'service_available_cities',
            //   type: 'select',
            //   options: ['City 1', 'City 2'],
            //   required: false,
            // },
            {
              label: 'Service delivery',
              name: 'service_delivery',
              type: 'select',
              options: ['Online', 'Offline'],
              required: true,
            },
          ],
        },
        {
          heading: 'Additional details (Education Loan)',
          subcategory: 'Student Education loan',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: true,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          heading: 'Processing/Origination fees',
          subcategory: 'Student Education loan',
          fields: [
            {
              label: 'Minimum Fees Range',
              name: 'fee_range_min',
              type: 'number',
              required: false,
            },
            {
              label: 'Maximum Fees Range',
              name: 'fee_range_max',
              type: 'number',
              required: false,
            },
            // {
            //   label: 'Currency',
            //   name: 'currency',
            //   type: 'select',
            //   options: ['INR', 'USD'],
            //   required: false,
            // },
            {
              label: 'Loan Interest %',
              name: 'loan_interest_percentage',
              type: 'number',
              required: false,
            },
            {
              label: 'Loan Amount Range',
              name: 'loan_amount_range',
              type: 'number',
              required: false,
            },
            // {
            //   label: 'Final price',
            //   name: 'final_price',
            //   type: 'number',
            //   required: false,
            // },
          ],
        },
        {
          heading: 'Marketing materials (Education Loan)',
          subcategory: 'Student Education loan',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'text',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
              required: false,
            },
          ],
        },
      ],

      Merchandise: [
        {
          heading: 'Basic details',
          fields: [
            {
              label: 'Product Title',
              name: 'product_title',
              type: 'text',
              required: true,
            },
            {
              label: 'Product category',
              name: 'category',
              type: 'select',
              options: ['Books', 'Stationery', 'School Uniform', 'Electronics'],
              required: false,
            },
            {
              label: 'Member since',
              name: 'member_since',
              type: 'text',
              required: false,
            },
            {
              label: 'Mode of teaching',
              name: 'mode_of_teaching',
              type: 'select',
              options: ['Online', 'Offline'],
              required: false,
            },
            // {
            //   label: 'Product code',
            //   name: 'product_code',
            //   type: 'text',
            //   required: false,
            // },
            {
              label: 'HSN code',
              name: 'hsn_code',
              type: 'text',
              required: false,
            },
            {
              label: 'GST rate',
              name: 'gst_rate',
              type: 'number',
              required: false,
            },
          ],
        },
        {
          heading: 'Additional details',
          fields: [
            {
              label: 'Product description',
              name: 'product_description',
              type: 'textarea',
              required: false,
            },
            {
              label: 'Product unique selling point',
              name: 'product_unique_selling_point',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          heading: 'Pricing',
          fields: [
            { label: 'Price', name: 'price', type: 'number', required: true },
            {
              label: 'Currency',
              name: 'currency',
              type: 'select',
              options: ['INR', 'USD'],
              required: true,
            },
            {
              label: 'Discount',
              name: 'discount',
              type: 'number',
              required: false,
            },
            {
              label: 'Final price',
              name: 'final_price',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          heading: 'Marketing materials',
          fields: [
            {
              label: 'Google reviews/rating',
              name: 'google_reviews',
              type: 'number',
              required: false,
            },
            {
              label: 'Enter link for Google rating',
              name: 'google_rating_url',
              type: 'text',
              required: false,
            },
            {
              label: 'Upload product images',
              name: 'product_images',
              type: 'file',
              required: false,
            },
            {
              label: 'Upload product video',
              name: 'product_videos',
              type: 'file',
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

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4'];

export const validateFileUpload = (file, type) => {
  const maxSize = type === 'product_images' ? MAX_FILE_SIZE : MAX_MEDIA_SIZE;

  if (file.size > maxSize) {
    toast.error(
      `File size should not exceed ${
        maxSize === MAX_FILE_SIZE ? '5MB' : '20MB'
      }`
    );
    return false;
  }

  if (type === 'product_images') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload an image file (JPG, JPEG, PNG)');
      return false;
    }
  } else if (type === 'product_videos') {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Please upload a video file (MP4)');
      return false;
    }
  }

  return true;
};

const commonValidations = {
  product_title: Yup.string()
    .required('Product title is required')
    .min(3, 'Product title must be at least 3 characters')
    .max(200, 'Product title must be at most 200 characters'),
  product_code: Yup.string(),
  price: Yup.number().positive('Price must be positive'),
  currency: Yup.string().oneOf(['INR', 'USD']),
  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),
  final_price: Yup.number().test(
    'is-less-than-price',
    'Final price must be less than or equal to the original price',
    function (value) {
      const price = this.parent.price || 0;
      return !value || value <= price;
    }
  ),
  hsn_code: Yup.string()
    .matches(/^\d{6}$/, 'HSN code must be exactly 6 digits')
    .required('HSN code is required'),
  gst_rate: Yup.number()
    .min(0, 'GST rate cannot be negative')
    .max(100, 'GST rate cannot exceed 100%')
    .required('GST rate is required'),
  product_description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .max(1500, 'Description must not exceed 1000 characters')
    .required('Description is required'),
  product_unique_selling_point: Yup.string()
    .min(50, 'USP must be at least 50 characters')
    .max(1500, 'USP must not exceed 1000 characters')
    .required('USP is required'),
  google_reviews: Yup.string().matches(
    /^[0-5](\.[0-9]{1,2})?$/,
    'Rating must be a number between 0 and 5, with up to two decimal places'
  ),
  google_rating_url: Yup.string().url('Invalid URL'),
  product_images: Yup.array()
    .nullable()
    .of(
      Yup.mixed()
        .test('fileSize', 'Image file is too large', (value) => {
          if (!value) return true;
          if (value instanceof File) {
            return value.size <= MAX_FILE_SIZE;
          }
          return true;
        })
        .test(
          'fileFormat',
          'Please upload only image files (JPG, JPEG, PNG)',
          (value) => {
            if (!value) return true;
            if (value instanceof File) {
              return ALLOWED_IMAGE_TYPES.includes(value.type);
            }
            return true;
          }
        )
    )
    .max(5, 'You can upload up to 5 images'),
  product_videos: Yup.mixed()
    .nullable()
    .test('fileSize', 'Video file is too large', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return value.size <= MAX_MEDIA_SIZE;
      }
      return true;
    })
    .test('fileFormat', 'Please upload only video files (MP4)', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return value.type === 'video/mp4';
      }
      return true;
    }),
};

export const validationSchemas = {
  'Study overseas': Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().required('Study level is required'),
    education_qualification: Yup.string().notRequired().default(''),

    service_provided_since: Yup.date().required(
      'Service provided since is required'
    ),
    study_destination_countries: Yup.string().required(
      'Destination country is required'
    ),
    // Add this to your validation schema
    service_available_cities: Yup.string()
      .required('Please select at least one city where service is available.')
      .test(
        'not-empty',
        'Please select at least one city where service is available.',
        (value) => value && value.length > 0
      ),

    service_delivery: Yup.string().required('Service delivery is required'),
  }),

  'Study India': Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().required('Study level is required'),
    education_qualification: Yup.string().notRequired().default(''),

    service_provided_since: Yup.date().required(
      'Service provided since is required'
    ),
    // study_destination_states: Yup.string().required(
    //   'Destination State is required'
    // ),
    service_available_cities: Yup.string().required(
      'Destination city is required'
    ),
    // service_delivery: Yup.string().oneOf(['Online', 'Offline']),
  }),

  Tutoring: Yup.object().shape({
    ...commonValidations,
    study_level: Yup.string().required('Study level is required'),
    subjects: Yup.string().required('Subject selection is required'),
    education_qualification: Yup.string().required(
      'Education qualification is required'
    ),
    member_since: Yup.date()
      .max(new Date())
      .required('Member since is required'),
    mode_of_teaching: Yup.string()
      .required('Teaching mode is required')
      .oneOf([
        'Online(1 on 1)',
        'Online(group)',
        'Physical(1 on 1)',
        'Physical(group)',
        'Home Visits',
      ]),
    service_available_cities: Yup.string().required(
      'Destination city is required'
    ),
    travel_upto: Yup.string().required('Travel upto is required'),
  }),

  'Career counselling': Yup.object().shape({
    ...commonValidations,
    education_qualification: Yup.string().notRequired().default(''),
    study_level: Yup.string().required('Study level is required'),

    service_provided_since: Yup.date().required(
      'Service provided since is required'
    ),
    counselling_duration: Yup.string().required(
      'Counselling duration is required'
    ),
    service_available_cities: Yup.string().required('Service city is required'),
    study_destination_countries: Yup.string().required(
      'Study destination is required'
    ),
    service_delivery: Yup.string().required('Service delivery is required'),
  }),

  'Summer courses': Yup.object().shape({
    ...commonValidations,
    age_group: Yup.string().required('Age group is required'),
    discipline: Yup.string().required('Discipline is required'),
    duration: Yup.string().required('Duration is required'),
    program_eligibility: Yup.string().required(
      'Program eligibility is required'
    ),
    application_deadline: Yup.date().required(
      'Application deadline is required'
    ),
    scholarship_available: Yup.string().required(
      'Scholarship available is required'
    ),
    study_destination_countries: Yup.string().required(
      'Study destination is required'
    ),
    service_available_cities: Yup.string().required('Service city is required'),
    service_delivery: Yup.string().required('Service delivery is required'),
    scholarship_description: Yup.string()
      .min(50, 'Description must be at least 50 characters')
      .max(1500, 'Description must not exceed 1000 characters')
      .required('Scholarship description is required'),
  }),

  Events: Yup.object().shape({
    // product_title: Yup.string()
    // .required("Product title is required")
    // .min(3, "Product title must be at least 3 characters"),
    price: Yup.number().positive('Price must be positive'),
    currency: Yup.string().oneOf(['INR', 'USD']),
    discount: Yup.number()
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot exceed 100%'),
    final_price: Yup.number().test(
      'is-less-than-price',
      'Final price must be less than or equal to the original price',
      function (value) {
        const price = this.parent.price || 0;
        return !value || value <= price;
      }
    ),
    hsn_code: Yup.string()
      .matches(/^\d{6}$/, 'HSN code must be exactly 6 digits')
      .required('HSN code is required'),
    gst_rate: Yup.number()
      .min(0, 'GST rate cannot be negative')
      .max(100, 'GST rate cannot exceed 100%')
      .required('GST rate is required'),
    product_description: Yup.string()
      .min(50, 'Description must be at least 50 characters')
      .max(1500, 'Description must not exceed 1000 characters')
      .required('Description is required'),
    product_unique_selling_point: Yup.string()
      .min(50, 'USP must be at least 50 characters')
      .max(1500, 'USP must not exceed 1000 characters')
      .required('USP is required'),
    google_reviews: Yup.string().matches(
      /^[0-5](\.[0-9]{1,2})?$/,
      'Rating must be a number between 0 and 5, with up to two decimal places'
    ),
    brand_logo: Yup.mixed()
      .nullable()
      .test(
        'fileSize',
        'File is too large',
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        'fileFormat',
        'Unsupported file format',
        (value) => !value || SUPPORTED_FORMATS.includes(value.type)
      ),
    product_media: Yup.mixed()
      .nullable()
      .test(
        'fileSize',
        'File is too large',
        (value) => !value || value.size <= FILE_SIZE
      )
      .test(
        'fileFormat',
        'Unsupported file format',
        (value) => !value || SUPPORTED_FORMATS.includes(value.type)
      ),
    event_title: Yup.string().required('Event title is required'),
    event_location: Yup.string().required('Event location is required'),
    event_category: Yup.string().required('Event category is required'),
    age_group_min: Yup.string().required('Age group min is required'),
    age_group_max: Yup.string().required('Age group max is required'),
    event_eligibility: Yup.string().required('Event eligibility is required'),
    event_delivery: Yup.string().required('Event delivery is required'),
    event_registration_deadline: Yup.date()
      .min(new Date(), 'Registration deadline must be in the future')
      .required('Registration deadline is required'),
  }),

  'Study Finance': Yup.object().shape({
    ...commonValidations,
    subcategory: Yup.string().required('Subcategory is required'),
    loan_for_study_level: Yup.string().required('Study level is required'),
    loan_duration: Yup.string().required('Loan duration is required'),
    loan_eligibility: Yup.string().required('Loan eligibility is required'),
    full_financing_available: Yup.string().oneOf(['Yes', 'No']),
    // loan_available_countries: Yup.string(),
    study_destination_countries: Yup.string().required(
      'Study destination is required'
    ),
    service_delivery: Yup.string().required('Service delivery is required'),
    study_destination_states: Yup.string(),
    country_origin: Yup.string(),
    scholarship_category: Yup.string(),
    loan_interest_percentage: Yup.number().min(
      0,
      'Interest rate must be positive'
    ),
    loan_amount_range: Yup.string(),
    scholarship_type: Yup.string(),
    scholarship_course: Yup.string(),
    fee_range_min: Yup.number(),
    fee_range_max: Yup.number(),
  }),

  Merchandise: Yup.object().shape({
    ...commonValidations,
    category: Yup.string().required('Product category is required'),
    member_since: Yup.date().max(new Date()),
    mode_of_teaching: Yup.string().required('Mode of teaching is required'),
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
      if (err.path === 'product_images' || err.path === 'product_videos') {
        if (!formData[err.path]) return;
      }
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};
